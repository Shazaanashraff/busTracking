// Supabase Edge Function: masked-call-twiml
// Returns TwiML to connect the crew to the passenger
// Deploy: supabase functions deploy masked-call-twiml

// @ts-ignore - Deno imports work in Supabase Edge Functions runtime
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req: Request) => {
    const url = new URL(req.url)
    const passengerPhone = url.searchParams.get('to')

    if (!passengerPhone) {
        return new Response('Missing phone number', { status: 400 })
    }

    // @ts-ignore - Deno global
    const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER')

    // TwiML response that:
    // 1. Says a message to the crew
    // 2. Dials the passenger with the Twilio number as caller ID
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="en-US">Connecting you to the passenger. Please wait.</Say>
  <Dial callerId="${TWILIO_PHONE_NUMBER}" timeout="30">
    <Number>${passengerPhone}</Number>
  </Dial>
  <Say language="en-US">The passenger did not answer. Goodbye.</Say>
</Response>`

    return new Response(twiml, {
        headers: { 'Content-Type': 'application/xml' },
    })
})
