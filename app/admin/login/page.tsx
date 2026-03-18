"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type AdminRow = {
  is_admin?: boolean | null
  role?: string | null
}

export default function AdminLogin() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkAlreadyLoggedIn = async () => {
      const { data } = await supabase.auth.getUser()
      const user = data.user
      if (!user) return

      const { data: userData } = await supabase
        .from("users")
        .select("is_admin,role")
        .eq("id", user.id)
        .maybeSingle<AdminRow>()

      const isAdmin = Boolean(userData?.is_admin) || userData?.role === "admin"
      if (isAdmin) {
        router.replace("/admin")
      }
    }

    checkAlreadyLoggedIn()
  }, [router])

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg("")
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMsg("ログイン失敗")
      setLoading(false)
      return
    }

    const user = data.user

    const { data: userData } = await supabase
      .from("users")
      .select("is_admin,role")
      .eq("id", user?.id)
      .maybeSingle<AdminRow>()

    const isAdmin = Boolean(userData?.is_admin) || userData?.role === "admin"

    if (!isAdmin) {
      await supabase.auth.signOut()
      setErrorMsg("管理者ではありません。会員ログインをご利用ください。")
      setLoading(false)
      return
    }

    router.replace("/admin")
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>管理者ログイン</h1>

      <form onSubmit={login}>
        <input
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button disabled={loading}>{loading ? "確認中..." : "ログイン"}</button>
      </form>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
    </div>
  )
}
