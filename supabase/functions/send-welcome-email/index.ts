const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, name } = await req.json()
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'ResumeForge <onboarding@resend.dev>',
        to: [email],
        subject: 'Welcome to ResumeForge',
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden;">
            <div style="background: #1a1a2e; padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Welcome to ResumeForge</h1>
            </div>
            <div style="padding: 40px 30px;">
              <p style="font-size: 16px; color: #333; line-height: 1.6;">Hi ${name || 'there'},</p>
              <p style="font-size: 16px; color: #333; line-height: 1.6;">
                We're thrilled to have you on board! ResumeForge makes it easy to create stunning, 
                professional resumes and design wireframes — all in one place.
              </p>
              <p style="font-size: 16px; color: #333; line-height: 1.6;">Here's what you can do:</p>
              <ul style="font-size: 15px; color: #555; line-height: 2;">
                <li>Build beautiful resumes with our intuitive editor</li>
                <li>Download your CV as a high-quality PDF</li>
                <li>Design wireframes for websites and mobile apps</li>
                <li>Your first download is completely <strong>free</strong>!</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://id-preview--1321f140-aa5d-4e8e-bbdd-005de4651bb7.lovable.app" 
                   style="background: #1a1a2e; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
                  Start Creating
                </a>
              </div>
              <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px;">
                — The ResumeForge Team
              </p>
            </div>
          </div>
        `,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      status: res.ok ? 200 : 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
