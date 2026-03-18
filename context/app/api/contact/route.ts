import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {

  try {

    const { name, email, subject, message } = await req.json()

    // Supabase保存
    await supabase.from("inquiries").insert([
      {
        name,
        email,
        subject,
        message
      }
    ])

    // メール送信
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.CONTACT_TO_EMAIL!,
      subject: `お問い合わせ: ${subject}`,
      html: `
        <h2>お問い合わせ</h2>
        <p><b>名前:</b> ${name}</p>
        <p><b>メール:</b> ${email}</p>
        <p><b>件名:</b> ${subject}</p>
        <p><b>内容:</b><br/>${message}</p>
      `
    })

    return NextResponse.json({ success: true })

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "送信失敗" },
      { status: 500 }
    )

  }

}