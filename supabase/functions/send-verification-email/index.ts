import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  email: string
  verificationCode: string
  verificationToken: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, verificationCode, verificationToken }: EmailRequest = await req.json()

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set')
    }

    // Send email using Resend API
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Digital Flipbook <onboarding@yourdomain.com>',
        to: [email],
        subject: '🔐 Your Digital Flipbook Verification Code',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Account</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #18181b; border-radius: 24px; overflow: hidden; border: 1px solid #27272a;">
          <!-- Header -->
          <tr>
            <td style="padding: 48px 48px 32px; text-align: center; background: linear-gradient(135deg, #18181b 0%, #27272a 100%);">
              <div style="width: 64px; height: 64px; background-color: rgba(251, 191, 36, 0.1); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                <span style="font-size: 32px;">📖</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">Verify Your Account</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 32px 48px;">
              <p style="margin: 0 0 24px; color: #a1a1aa; font-size: 16px; line-height: 1.6;">
                Welcome to <strong style="color: #fbbf24;">Digital Flipbook</strong>! To complete your registration, please enter the verification code below:
              </p>
              
              <!-- Verification Code Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                <tr>
                  <td align="center" style="background-color: #09090b; border-radius: 16px; padding: 32px; border: 2px solid #27272a;">
                    <p style="margin: 0 0 16px; color: #a1a1aa; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Your Verification Code</p>
                    <div style="font-size: 48px; font-weight: 700; color: #fbbf24; letter-spacing: 0.2em; font-family: 'Courier New', monospace;">
                      ${verificationCode}
                    </div>
                    <p style="margin: 16px 0 0; color: #71717a; font-size: 13px;">
                      This code expires in <strong style="color: #a1a1aa;">5 minutes</strong>
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0; color: #a1a1aa; font-size: 14px; line-height: 1.6;">
                Simply enter this code in the verification screen to activate your account and start exploring your digital library.
              </p>
            </td>
          </tr>
          
          <!-- Security Notice -->
          <tr>
            <td style="padding: 24px 48px 48px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(239, 68, 68, 0.1); border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.2);">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0; color: #fca5a5; font-size: 13px; line-height: 1.5;">
                      <strong style="color: #ef4444;">⚠️ Security Notice:</strong> If you didn't request this code, please ignore this email. Never share your verification code with anyone.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 48px; border-top: 1px solid #27272a; text-align: center;">
              <p style="margin: 0; color: #52525b; font-size: 12px; line-height: 1.5;">
                © ${new Date().getFullYear()} Digital Flipbook. All rights reserved.<br>
                This is an automated message, please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(data)}`)
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
