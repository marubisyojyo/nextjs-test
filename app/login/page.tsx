"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const router = useRouter()

  const handleLogin = async () => {

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      alert(error.message)
    } else {
      alert("ログイン成功")
      router.replace("/")
      router.refresh()
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",

      // ⭐ 中央じゃなく少し上に
      alignItems: "flex-start",

      background: "#f9fafb",
      padding: "20px",

      // ⭐ 上に余白（ここで位置調整）
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

        {/* タイトル */}
        <h1 style={{
          fontSize: "26px",
          fontWeight: "bold",
          marginBottom: "8px"
        }}>
          会員ログイン
        </h1>

        <p style={{
          fontSize: "14px",
          color: "#666",
          marginBottom: "24px"
        }}>
          購入・ダウンロードにはログインが必要です
        </p>

        {/* メール */}
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            fontSize: "14px",
            boxSizing: "border-box"
          }}
        />

        {/* パスワード */}
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            fontSize: "14px",
            boxSizing: "border-box"
          }}
        />

        {/* ログインボタン */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "14px",
            background: "linear-gradient(135deg, #111827, #1f2937)",
            color: "#fff",
            borderRadius: "12px",
            border: "none",
            fontWeight: "bold",
            fontSize: "15px",
            cursor: "pointer",
            transition: "0.2s",
            boxShadow: "0 6px 16px rgba(0,0,0,0.15)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)"
            e.currentTarget.style.boxShadow = "0 10px 22px rgba(0,0,0,0.2)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)"
          }}
        >
          ログイン
        </button>

<p style={{
  fontSize: "13px",
  marginBottom: "20px",
  textAlign: "right"
}}>
  <span
    style={{
      color: "#2563eb",
      cursor: "pointer",
      fontWeight: "bold"
    }}
    onClick={() => router.push("/reset-password")}
  >
    パスワードを忘れた方はこちら
  </span>
</p>

        {/* 下テキスト */}
        <p style={{
          marginTop: "16px",
          fontSize: "13px",
          textAlign: "center",
          color: "#666"
        }}>
          アカウントをお持ちでない方は{" "}
          <span
            style={{
              color: "#16a34a",
              cursor: "pointer",
              fontWeight: "bold"
            }}
            onClick={() => router.push("/signup")}
          >
            無料登録
          </span>
        </p>

      </div>
    </div>
  )
}