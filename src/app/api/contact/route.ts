import { NextResponse } from 'next/server'

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

        // For now, log to console (in production, you'd send an actual email)
        console.log('📧 Contact Form Submission:')
        console.log('Name:', name)
        console.log('Email:', email)
        console.log('Message:', message)
        console.log('Timestamp:', new Date().toISOString())

        // TODO: Integrate with email service (Resend, SendGrid, etc.)
        // Example with Resend:
        // const resend = new Resend(process.env.RESEND_API_KEY)
        // await resend.emails.send({
        //   from: 'contact@yourdomain.com',
        //   to: 'your-email@example.com',
        //   subject: `New Contact Form Submission from ${name}`,
        //   html: `
        //     <h2>New Contact Form Submission</h2>
        //     <p><strong>Name:</strong> ${name}</p>
        //     <p><strong>Email:</strong> ${email}</p>
        //     <p><strong>Message:</strong></p>
        //     <p>${message}</p>
        //   `
        // })

        return NextResponse.json({
            success: true,
            message: 'Thank you for your message! I will get back to you soon.'
        })
    } catch (error) {
        console.error('Contact form error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to send message. Please try again.' },
            { status: 500 }
        )
    }
}
