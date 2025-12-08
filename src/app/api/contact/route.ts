import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend with API key from environment variables
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json()

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, message: 'All fields are required' },
                { status: 400 }
            )
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: 'Invalid email address' },
                { status: 400 }
            )
        }

        // Log to console (always)
        console.log('📧 Contact Form Submission:')
        console.log('Name:', name)
        console.log('Email:', email)
        console.log('Message:', message)
        console.log('Timestamp:', new Date().toISOString())

        // Send email if Resend is configured
        if (resend && process.env.CONTACT_EMAIL) {
            try {
                console.log('🔄 Attempting to send email via Resend...')
                console.log('From:', process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev')
                console.log('To:', process.env.CONTACT_EMAIL)

                const result = await resend.emails.send({
                    from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
                    to: process.env.CONTACT_EMAIL,
                    subject: `New Contact Form Submission from ${name}`,
                    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                New Contact Form Submission
              </h2>
              
              <div style="margin: 20px 0;">
                <p style="margin: 10px 0;">
                  <strong style="color: #555;">Name:</strong><br/>
                  <span style="color: #333;">${name}</span>
                </p>
                
                <p style="margin: 10px 0;">
                  <strong style="color: #555;">Email:</strong><br/>
                  <a href="mailto:${email}" style="color: #007bff;">${email}</a>
                </p>
                
                <p style="margin: 10px 0;">
                  <strong style="color: #555;">Message:</strong><br/>
                  <span style="color: #333; white-space: pre-wrap;">${message}</span>
                </p>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
                <p>This email was sent from your portfolio contact form.</p>
                <p>Submitted at: ${new Date().toLocaleString()}</p>
              </div>
            </div>
          `,
                    text: `
New Contact Form Submission

Name: ${name}
Email: ${email}

Message:
${message}

---
Submitted at: ${new Date().toLocaleString()}
          `.trim(),
                })

                console.log('✅ Email sent successfully via Resend')
                console.log('📬 Email ID:', result.data?.id)
                console.log('📊 Full response:', JSON.stringify(result, null, 2))

                return NextResponse.json({
                    success: true,
                    message: 'Thank you for your message! I will get back to you soon.',
                    emailId: result.data?.id // Include email ID for debugging
                })
            } catch (emailError) {
                console.error('❌ Error sending email via Resend:')
                console.error('Error details:', emailError)
                console.error('Error message:', emailError instanceof Error ? emailError.message : 'Unknown error')
                console.error('Error stack:', emailError instanceof Error ? emailError.stack : 'No stack trace')

                // Return error details for debugging
                return NextResponse.json({
                    success: false,
                    message: 'Failed to send email. Please try again.',
                    error: emailError instanceof Error ? emailError.message : 'Unknown error'
                }, { status: 500 })
            }
        } else {
            // Resend not configured - log only
            console.log('⚠️  Resend not configured. Email logged to console only.')
            console.log('Configuration status:')
            console.log('- Resend initialized:', !!resend)
            console.log('- CONTACT_EMAIL set:', !!process.env.CONTACT_EMAIL)
            console.log('- RESEND_API_KEY set:', !!process.env.RESEND_API_KEY)

            return NextResponse.json({
                success: true,
                message: 'Thank you for your message! I will get back to you soon.',
                debug: 'Email service not configured - logged to console only'
            })
        }
    } catch (error) {
        console.error('Contact form error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to send message. Please try again.' },
            { status: 500 }
        )
    }
}
