"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function UpdatePasswordPage() {

  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleUpdate = async () => {

    if (!password) {
      alert("パスワードを入力してください")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    setLoading(false)

    if (error) {
      alert(error.message)
    } else {
      alert("パスワード変更完了！")
      router.push("/login")
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
        borderRadius: "16px"
      }}>

        <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
          新しいパスワード設定
        </h1>

        <input
          type="password"
          placeholder="新しいパスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "1px solid #ddd"
          }}
        />

        <button
          onClick={handleUpdate}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: "#111827",
            color: "#fff",
            borderRadius: "12px",
            border: "none"
          }}
        >
          {loading ? "更新中..." : "パスワード更新"}
        </button>

      </div>
    </div>
  )
}