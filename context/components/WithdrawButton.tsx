"use client"

import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function WithdrawButton() {
  const router = useRouter()

  const handleWithdraw = async () => {
    const ok = confirm("本当に退会しますか？\nこの操作は取り消せません。")
    if (!ok) return

    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) return

    const { error } = await supabase
      .from("users")
      .update({
        is_deleted: true,
        email: null,
        name: "退会ユーザー",
      })
      .eq("id", user.id)

    if (error) {
      alert("エラーが発生しました")
      return
    }

    await supabase.auth.signOut()

    alert("退会が完了しました")
    router.push("/")
    router.refresh()
  }

  return (
    <button
      onClick={handleWithdraw}
      style={{
        padding: "12px 20px",
        background: "#ef4444",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        marginTop: "30px",
      }}
    >
      退会する
    </button>
  )
}