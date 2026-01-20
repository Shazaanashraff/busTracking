// Supabase Edge Function: masked-call
// Deploy to Supabase: supabase functions deploy masked-call
// 
// This function creates a proxy call using Twilio where:
// - Crew member initiates call through the app
// - Both parties see "Bus App" caller ID, not each other's numbers
// - No phone numbers are exposed

// @ts-ignore - Deno imports work in Supabase Edge Functions runtime
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Twilio credentials (set in Supabase Dashboard -> Edge Functions -> Secrets)
// @ts-ignore - Deno global
const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
// @ts-ignore
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
// @ts-ignore
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER') // Your Twilio number

serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Verify authentication
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('No authorization header')
        }

        // Initialize Supabase client
        // @ts-ignore
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        // @ts-ignore
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const supabase = createClient(supabaseUrl, supabaseKey)

        // Get the user from the JWT
        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: userError } = await supabase.auth.getUser(token)

        if (userError || !user) {
            throw new Error('Invalid token')
        }

        // Parse request body
        const { bookingId } = await req.json()

        if (!bookingId) {
            throw new Error('Booking ID is required')
        }

        // Verify crew has access to this booking
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select(`
        id,
        bus_id,
        passenger:passenger_id (
          id,
          phone
        )
      `)
            .eq('id', bookingId)
            .single()

        if (bookingError || !booking) {
            throw new Error('Booking not found')
        }

        // Verify user is crew for this bus
        const { data: crewAssignment, error: crewError } = await supabase
            .from('bus_crews')
            .select('id')
            .eq('profile_id', user.id)
            .eq('bus_id', booking.bus_id)
            .eq('is_active', true)
            .single()

        if (crewError || !crewAssignment) {
            throw new Error('Unauthorized: Not assigned to this bus')
        }

        // Get crew member's phone
        const { data: crewProfile, error: profileError } = await supabase
            .from('profiles')
            .select('phone')
            .eq('id', user.id)
            .single()

        if (profileError || !crewProfile?.phone) {
            throw new Error('Crew phone number not found')
        }

        const passengerPhone = (booking.passenger as { phone?: string })?.phone
        const crewPhone = crewProfile.phone

        if (!passengerPhone) {
            throw new Error('Passenger phone number not found')
        }

        // Check Twilio credentials
        if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
            throw new Error('Twilio not configured')
        }

        // Create Twilio proxy call
        // This calls the crew first, then connects to passenger
        const twimlUrl = `${supabaseUrl}/functions/v1/masked-call-twiml?to=${encodeURIComponent(passengerPhone)}`

        const twilioResponse = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`,
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    To: crewPhone,
                    From: TWILIO_PHONE_NUMBER,
                    Url: twimlUrl,
                    StatusCallback: `${supabaseUrl}/functions/v1/call-status`,
                }),
            }
        )

        const twilioResult = await twilioResponse.json()

        if (!twilioResponse.ok) {
            console.error('Twilio error:', twilioResult)
            throw new Error(twilioResult.message || 'Failed to initiate call')
        }

        // Log the call
        await supabase
            .from('call_logs')
            .insert({
                booking_id: bookingId,
                crew_id: user.id,
                call_sid: twilioResult.sid,
                status: 'initiated',
            })

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Call initiated. You will receive a call shortly.',
                callSid: twilioResult.sid,
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('Error:', errorMessage)
        return new Response(
            JSON.stringify({ success: false, error: errorMessage }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
