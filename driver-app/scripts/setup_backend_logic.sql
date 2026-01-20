-- ============================================================
-- BACKEND LOGIC: FUNCTIONS & RPCs
-- Run this script in Supabase SQL Editor
-- ============================================================

-- 1. Validate Ticket Function
create or replace function validate_ticket(ticket_id uuid, scan_bus_id uuid)
returns json
language plpgsql
security definer
as $$
declare
  booking_record record;
begin
  -- Find the booking
  select * into booking_record
  from bookings
  where id = ticket_id;

  -- Check if booking exists
  if booking_record is null then
    return json_build_object('valid', false, 'reason', 'Ticket not found');
  end if;

  -- Check if already used
  if booking_record.status = 'Completed' then
    return json_build_object('valid', false, 'reason', 'Ticket already used');
  end if;

  -- Check if cancelled
  if booking_record.status = 'Cancelled' then
    return json_build_object('valid', false, 'reason', 'Ticket was cancelled');
  end if;

  -- Check bus match (Optional: allow any bus on same route?)
  if booking_record.bus_id != scan_bus_id then
    return json_build_object('valid', false, 'reason', 'Wrong Bus. Valid for: ' || booking_record.bus_id);
  end if;

  -- Check date (Optional: allow +/- 1 day?)
  if booking_record.trip_date != current_date then
    return json_build_object('valid', false, 'reason', 'Ticket valid for date: ' || booking_record.trip_date);
  end if;

  -- Update status to Completed (Used)
  update bookings
  set status = 'Completed',
      completed_at = now()
  where id = ticket_id;

  return json_build_object(
    'valid', true,
    'passengerName', (select name from profiles where id = booking_record.passenger_id),
    'seatNumber', booking_record.seat_number,
    'ticketId', booking_record.id,
    'busId', booking_record.bus_id
  );
end;
$$;

-- 2. Driver Dashboard Stats
create or replace function get_driver_dashboard_stats()
returns json
language plpgsql
security definer
as $$
declare
  count_trips int;
  count_bookings int;
  count_passengers int;
  revenue decimal;
  today_seat_list int[];
  user_bus_id uuid;
begin
  -- Get the bus assigned to this driver (assuming 1 active bus per driver for simpler logic)
  select bus_id into user_bus_id
  from bus_crews
  where profile_id = auth.uid() and is_active = true
  limit 1;

  if user_bus_id is null then
    return json_build_object(
      'tripsToday', 0,
      'bookings', 0,
      'totalPassengers', 0,
      'bookedSeats', array[]::int[],
      'revenue', 0
    );
  end if;

  -- Calculate stats for Today
  select count(*) into count_bookings
  from bookings
  where bus_id = user_bus_id and trip_date = current_date and status != 'Cancelled';

  -- Completed trips (using 'Completed' status bookings as proxy for passengers served)
  select count(*) into count_passengers
  from bookings
  where bus_id = user_bus_id and trip_date = current_date and status = 'Completed';

  -- Total revenue today
  select coalesce(sum(amount), 0) into revenue
  from bookings
  where bus_id = user_bus_id and trip_date = current_date and status != 'Cancelled';

  -- Get list of booked seats
  select array_agg(cast(seat_number as int)) into today_seat_list
  from bookings
  where bus_id = user_bus_id and trip_date = current_date and status != 'Cancelled';

  return json_build_object(
    'tripsToday', 1, -- Hardcoded for now, or derive from distinct routes/times
    'bookings', count_bookings,
    'totalPassengers', count_passengers,
    'bookedSeats', coalesce(today_seat_list, array[]::int[]),
    'revenue', revenue
  );
end;
$$;

-- 3. Owner Dashboard Stats
create or replace function get_owner_dashboard_stats()
returns json
language plpgsql
security definer
as $$
declare
  daily_rev decimal;
  monthly_rev decimal;
  active_bus_count int;
  total_bus_count int;
  today_booking_count int;
  utilization int;
begin
  -- Total Buses
  select count(*) into total_bus_count
  from buses
  where owner_id in (select id from owners where profile_id = auth.uid());

  -- Active Buses
  select count(*) into active_bus_count
  from buses
  where owner_id in (select id from owners where profile_id = auth.uid())
  and status = 'active';

  -- Revenue Today
  select coalesce(sum(b.amount), 0) into daily_rev
  from bookings b
  join buses bus on b.bus_id = bus.id
  join owners o on bus.owner_id = o.id
  where o.profile_id = auth.uid()
  and b.trip_date = current_date
  and b.status != 'Cancelled';

  -- Revenue This Month
  select coalesce(sum(b.amount), 0) into monthly_rev
  from bookings b
  join buses bus on b.bus_id = bus.id
  join owners o on bus.owner_id = o.id
  where o.profile_id = auth.uid()
  and b.trip_date >= date_trunc('month', current_date)
  and b.status != 'Cancelled';

  -- Bookings Today
  select count(*) into today_booking_count
  from bookings b
  join buses bus on b.bus_id = bus.id
  join owners o on bus.owner_id = o.id
  where o.profile_id = auth.uid()
  and b.trip_date = current_date
  and b.status != 'Cancelled';

  -- Simple utilization (bookings / (active_buses * 50 capacity)) * 100
  if active_bus_count > 0 then
    utilization := (today_booking_count::decimal / (active_bus_count * 50)) * 100;
  else
    utilization := 0;
  end if;

  return json_build_object(
    'dailyRevenue', daily_rev,
    'monthlyRevenue', monthly_rev,
    'activeBuses', active_bus_count,
    'totalBuses', total_bus_count,
    'todaysBookings', today_booking_count,
    'seatUtilization', round(utilization),
    'cancellations', 0 -- Todo: query cancelled count
  );
end;
$$;
