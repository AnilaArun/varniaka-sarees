import { Resend } from "resend"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Check for API key at runtime, not build time
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service not configured. Please contact us via WhatsApp." },
        { status: 503 }
      )
    }
    
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      )
    }

    const { data, error } = await resend.emails.send({
      from: "Varnika Contact Form <onboarding@resend.dev>",
      to: ["varnika.sarees2026@gmail.com"],
      subject: `New Enquiry: ${subject || "General Enquiry"}`,
      replyTo: email,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5C3310; border-bottom: 2px solid #C8902E; padding-bottom: 12px;">
            New Contact Form Submission
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #5C3310; width: 120px;">Name:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #5C3310;">Email:</td>
              <td style="padding: 8px 0;">${email}</td>
            </tr>
            ${phone ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #5C3310;">Phone:</td><td style="padding: 8px 0;">${phone}</td></tr>` : ""}
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #5C3310;">Subject:</td>
              <td style="padding: 8px 0;">${subject || "General Enquiry"}</td>
            </tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #FAF6F1; border-left: 4px solid #C8902E;">
            <p style="margin: 0 0 4px; font-weight: bold; color: #5C3310;">Message:</p>
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #999;">
            Sent from Varnika website contact form
          </p>
        </div>
      `,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
