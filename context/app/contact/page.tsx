"use client"

import { useState } from "react"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess("")
    setError("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "送信に失敗しました")
        setLoading(false)
        return
      }

      setSuccess("お問い合わせを送信しました。ありがとうございます。")
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    } catch (err) {
      setError("送信中にエラーが発生しました")
    }

    setLoading(false)
  }

  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "60px 20px 80px",
      }}
    >
      <section
        style={{
          background: "linear-gradient(135deg,#111827,#1f2937)",
          color: "#fff",
          borderRadius: "24px",
          padding: "50px 30px",
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        <h1 style={{ fontSize: "40px", marginBottom: "16px" }}>Contact</h1>
        <p style={{ fontSize: "16px", opacity: 0.92, lineHeight: 1.8 }}>
          ご質問、ご要望、不具合報告などがありましたら、お気軽にお問い合わせください。
        </p>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "0.9fr 1.1fr",
          gap: "28px",
        }}
      >
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "20px",
            padding: "28px",
            background: "#fff",
          }}
        >
          <h2 style={{ fontSize: "26px", marginBottom: "18px" }}>お問い合わせについて</h2>

          <p style={{ color: "#555", lineHeight: 1.9, marginBottom: "16px" }}>
            素材についてのご質問、ダウンロードに関する不具合、会員登録やポイント購入に関するお問い合わせなどを受け付けています。
          </p>

          <p style={{ color: "#555", lineHeight: 1.9 }}>
            内容を確認後、必要に応じてご連絡いたします。
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            border: "1px solid #eee",
            borderRadius: "20px",
            padding: "28px",
            background: "#fff",
          }}
        >
          <h2 style={{ fontSize: "26px", marginBottom: "20px" }}>フォーム送信</h2>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              お名前
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                fontSize: "15px",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                fontSize: "15px",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              件名
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                fontSize: "15px",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              お問い合わせ内容
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={8}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                fontSize: "15px",
                resize: "vertical",
              }}
            />
          </div>

          {success && (
            <p style={{ color: "green", marginBottom: "14px", fontWeight: "bold" }}>
              {success}
            </p>
          )}

          {error && (
            <p style={{ color: "red", marginBottom: "14px", fontWeight: "bold" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background: loading ? "#999" : "#111827",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading ? "送信中..." : "お問い合わせを送信する"}
          </button>
        </form>
      </div>
    </main>
  )
}