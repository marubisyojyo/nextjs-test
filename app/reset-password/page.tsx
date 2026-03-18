"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ResetPasswordPage() {

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleReset = async () => {

    if (!email) {
      alert("メールアドレスを入力してください")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`
    })

    setLoading(false)

    if (error) {
      alert(error.message)
    } else {
      alert("パスワードリセット用のメールを送信しました！")
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      background: "#f9fafb",
      paddingTop: "80px"
    }}>

      <div style={{
        width: "100%",
        maxWidth: "420px",
        background: "#fff",
        padding: "30px",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
      }}>

        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
          パスワードリセット
        </h1>

        <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
          登録したメールアドレスを入力してください
        </p>

        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "1px solid #ddd"
          }}
        />

        <button
          onClick={handleReset}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: "#111827",
            color: "#fff",
            borderRadius: "12px",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          {loading ? "送信中..." : "リセットメール送信"}
        </button>

      </div>
    </div>
  )
}