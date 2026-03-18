"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Signup() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("") // ←追加

  // 🔥 パスワードチェック追加
  const validatePassword = (password: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
    return regex.test(password)
  }

  const handleSignup = async () => {
    setError("") // ←追加

    if (!email || !password || !confirmPassword) {
      alert("メールアドレスとパスワードを入力してください")
      return
    }

    if (password !== confirmPassword) {
      alert("パスワードが一致していません")
      return
    }

    // 🔥 ここ追加（最重要）
    if (!validatePassword(password)) {
      setError("パスワードは英字＋数字を含む8文字以上で入力してください")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
    })

    setLoading(false)

    if (error) {
      if (error.message.includes("User already registered")) {
        alert("このメールアドレスは既に登録されています。\nログイン画面へ移動します。")
        router.push("/login")
      } else {
        alert("登録に失敗しました。\n" + error.message)
      }
    } else {
      alert("登録完了しました！ログインしてください")
      router.push("/login")
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      paddingTop: "80px",
      background: "linear-gradient(#f8fafc, #eef2f7)"
    }}>

      <div style={{
        width: "100%",
        maxWidth: "440px",
        background: "#fff",
        padding: "36px",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
      }}>

        <h1 style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "10px"
        }}>
          今すぐ無料登録
        </h1>

        <p style={{
          fontSize: "15px",
          color: "#555",
          marginBottom: "20px",
          lineHeight: "1.6"
        }}>
          30秒で登録できます。登録後すぐに商品をダウンロードできます。
        </p>

        <div style={{
          marginBottom: "20px",
          fontSize: "15px",
          lineHeight: "2"
        }}>
          <div style={{ color: "#16a34a", fontWeight: "bold" }}>
            ✔ 登録無料・30秒で完了
          </div>
          <div>✔ 無料商品ダウンロードがすぐ可能</div>
          <div>✔ お気に入り保存</div>
          <div>✔ 購入履歴の管理</div>
        </div>

        <div style={{
          fontSize: "14px",
          color: "#666",
          marginBottom: "18px",
          lineHeight: "1.7"
        }}>
          ・メールアドレスはログイン時に使用します<br />
          ・パスワードは忘れないようにメモなどで保管してください<br />
	・パスワードは英字＋数字を含む8文字以上で入力してください
        </div>

        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {/* 🔥 エラー表示（ここだけ追加） */}
        {error && (
          <p style={{ color: "red", marginBottom: "10px", fontSize: "13px" }}>
            {error}
          </p>
        )}

        <input
          type="password"
          placeholder="パスワード（確認用）"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          style={{
            width: "100%",
            padding: "18px",
            background: "linear-gradient(135deg, #16a34a, #22c55e)",
            color: "#fff",
            borderRadius: "12px",
            border: "none",
            fontWeight: "bold",
            fontSize: "17px",
            cursor: "pointer",
            boxShadow: "0 6px 16px rgba(34,197,94,0.3)",
            transition: "0.2s",
            marginTop: "10px"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.04)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)"
          }}
        >
          {loading ? "登録中..." : "✨ 無料で始める"}
        </button>

        <p style={{
          fontSize: "13px",
          color: "#888",
          marginTop: "12px",
          textAlign: "center"
        }}>
          登録は無料です。いつでも退会できます。
        </p>

        <p style={{
          fontSize: "14px",
          marginTop: "20px",
          textAlign: "center"
        }}>
          すでにアカウントをお持ちですか？
          <span
            onClick={() => router.push("/login")}
            style={{
              color: "#16a34a",
              marginLeft: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            ログイン
          </span>
        </p>

      </div>
    </div>
  )
}

const inputStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  marginBottom: "14px",
  fontSize: "15px",
  boxSizing: "border-box" as const,
  outline: "none"
}