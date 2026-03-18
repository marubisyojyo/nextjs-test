"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter, usePathname } from "next/navigation"

type AdminStatus = "checking" | "allowed" | "denied"

type AdminRow = {
  email?: string | null
  is_admin?: boolean | null
  role?: string | null
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const [status, setStatus] = useState<AdminStatus>("checking")
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    let mounted = true

    const checkAdmin = async () => {
      if (pathname === "/admin/login") {
        if (mounted) setStatus("allowed")
        return
      }

      if (mounted) setStatus("checking")

      const { data, error } = await supabase.auth.getUser()
      const currentUser = data.user

      if (error || !currentUser) {
        if (mounted) {
          setUserEmail("")
          setStatus("denied")
        }
        router.replace("/admin/login")
        return
      }

      const { data: adminRow, error: adminError } = await supabase
        .from("users")
        .select("email,is_admin,role")
        .eq("id", currentUser.id)
        .maybeSingle<AdminRow>()

      const isAdmin = Boolean(adminRow?.is_admin) || adminRow?.role === "admin"

      if (adminError || !isAdmin) {
        await supabase.auth.signOut()
        if (mounted) {
          setUserEmail("")
          setStatus("denied")
        }
        alert("管理者権限がありません")
        router.replace("/admin/login")
        return
      }

      if (mounted) {
        setUserEmail(adminRow?.email || currentUser.email || "")
        setStatus("allowed")
      }
    }

    checkAdmin()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAdmin()
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [pathname, router])

  const logout = async () => {
    await supabase.auth.signOut()
    router.replace("/admin/login")
  }

  if (status === "checking") {
    return <div style={{ padding: "40px" }}>管理者権限を確認中...</div>
  }

  if (status === "denied" && pathname !== "/admin/login") {
    return <div style={{ padding: "40px" }}>管理画面へ移動しています...</div>
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
          borderBottom: "1px solid #ddd",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <b>管理画面</b>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {pathname !== "/admin/login" && <span>{userEmail}</span>}

          {pathname !== "/admin/login" && <button onClick={logout}>ログアウト</button>}
        </div>
      </div>

      <div style={{ padding: "40px" }}>{children}</div>
    </div>
  )
}
