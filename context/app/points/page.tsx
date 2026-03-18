"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

const PLANS = [
  { points: 500, priceLabel: "¥500相当" },
  { points: 1000, priceLabel: "¥1,000相当" },
  { points: 3000, priceLabel: "¥3,000相当" },
]

export default function PointsPage() {
  const router = useRouter()
  const [currentPoints, setCurrentPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const [processingPoints, setProcessingPoints] = useState<number | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      const user = data.user

      if (!user) {
        setLoading(false)
        return
      }

      const { data: userRow } = await supabase
        .from("users")
        .select("points_balance")
        .eq("id", user.id)
        .single()

      setCurrentPoints(Number(userRow?.points_balance || 0))
      setLoading(false)
    }

    loadUser()
  }, [])

  const buyPoints = async (amount: number) => {
    const { data } = await supabase.auth.getUser()
    const user = data.user

    if (!user) {
      alert("ログインしてください")
      router.push("/login")
      return
    }

    setProcessingPoints(amount)

    try {
      const { data: userRow, error: userError } = await supabase
        .from("users")
        .select("points_balance")
        .eq("id", user.id)
        .single()

      if (userError) {
        alert(`ポイント残高の取得に失敗しました: ${userError.message}`)
        return
      }

      const newPoints = Number(userRow?.points_balance || 0) + amount

      const { error: updateError } = await supabase
        .from("users")
        .update({ points_balance: newPoints })
        .eq("id", user.id)

      if (updateError) {
        alert(`ポイント追加に失敗しました: ${updateError.message}`)
        return
      }

      const { error: insertError } = await supabase.from("point_transactions").insert({
        user_id: user.id,
        amount: amount,
        type: "charge",
      })

      if (insertError) {
        await supabase.from("users").update({ points_balance: userRow?.points_balance || 0 }).eq("id", user.id)
        alert(`履歴保存に失敗しました: ${insertError.message}`)
        return
      }

      setCurrentPoints(newPoints)
      alert(`${amount.toLocaleString()}ポイントを追加しました`)
    } finally {
      setProcessingPoints(null)
    }
  }

  if (loading) return <div style={{ padding: "40px" }}>読み込み中...</div>

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "36px", marginBottom: "12px" }}>ポイント購入</h1>
      <p style={{ color: "#666", marginBottom: "28px" }}>
        今はテスト用のポイント追加ページです。後からStripe決済に置き換えられる形で作っています。
      </p>

      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          borderRadius: "16px",
          border: "1px solid #eee",
          background: "#fff",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>現在の所持ポイント</p>
        <p style={{ margin: "8px 0 0", fontSize: "32px", fontWeight: "bold", color: "#e60023" }}>
          {currentPoints.toLocaleString()} pt
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: "20px" }}>
        {PLANS.map((plan) => (
          <div
            key={plan.points}
            style={{
              border: "1px solid #eee",
              borderRadius: "18px",
              background: "#fff",
              padding: "24px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            }}
          >
            <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>{plan.priceLabel}</p>
            <p style={{ margin: "8px 0 16px", fontSize: "30px", fontWeight: "bold", color: "#2563eb" }}>
              {plan.points.toLocaleString()} pt
            </p>
            <button
              onClick={() => buyPoints(plan.points)}
              disabled={processingPoints !== null}
              style={{
                width: "100%",
                padding: "14px 18px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #16a34a, #22c55e)",
                color: "#fff",
                fontWeight: "bold",
                cursor: processingPoints !== null ? "default" : "pointer",
              }}
            >
              {processingPoints === plan.points ? "追加中..." : "このポイントを追加"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
