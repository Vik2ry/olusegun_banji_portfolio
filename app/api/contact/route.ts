import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    const emailData = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      template_params: {
        from_name: name,
        from_email: email,
        message: message,
        to_name: "Olusegun Banji",
      },
    }

    if (!emailData.service_id || !emailData.template_id || !emailData.user_id) {
      console.error("Missing EmailJS environment variables")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    })

    if (response.ok) {
      return NextResponse.json({ message: "Email sent successfully" }, { status: 200 })
    } else {
      const errorText = await response.text()
      console.error("EmailJS API error:", response.status, errorText)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
