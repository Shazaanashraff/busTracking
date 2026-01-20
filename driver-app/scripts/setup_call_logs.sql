-- Call Logs Table for Masked Calling
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS call_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  crew_id UUID REFERENCES profiles(id),
  call_sid TEXT,
  status TEXT DEFAULT 'initiated',
  duration_seconds INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;

-- Crew can view their own call logs
CREATE POLICY "Crew can view own call logs" ON call_logs
  FOR SELECT USING (crew_id = auth.uid());

-- System can insert call logs (via service role)
CREATE POLICY "Service can insert call logs" ON call_logs
  FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_call_logs_booking_id ON call_logs(booking_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_crew_id ON call_logs(crew_id);
