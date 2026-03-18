"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import ProductCard from "@/components/ProductCard"
import WithdrawButton from "@/components/WithdrawButton"
import { Product, RECENT_PRODUCTS_KEY, formatDate, readLocalProducts } from "@/lib/site"

type PurchaseItem = {
  id: string
  amount: number
  created_at?: string | null
  product: Product | Product[] | null
}

export default function MyPage() {
  const [user, setUser] = useState<{ id: string; email?: string | null } | null>(null)
  const [favorites, setFavorites] = useState<Product[]>([])
  const [purchases, setPurchases] = useState<PurchaseItem[]>([])
  const [recommended, setRecommended] = useState<Product[]>([])
  const [recent, setRecent] = useState<Product[]>([])
  const [points, setPoints] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const { data } = await supabase.auth.getUser()
      const currentUser = data.user

      if (!currentUser) {
        setLoading(false)
        return
      }

      setUser({ id: currentUser.id, email: currentUser.email })

      const { data: userData } = await supabase
        .from("users")
        .select("points_balance")
        .eq("id", currentUser.id)
        .maybeSingle()
      setPoints(userData?.points_balance || 0)

      const { data: favData } = await supabase
        .from("favorites")
        .select("product_id")
        .eq("user_id", currentUser.id)

      if (favData?.length) {
        const ids = favData.map((f) => f.product_id)
        const { data: products } = await supabase
          .from("products")
          .select("*")
          .in("id", ids)
          .eq("is_deleted", false)
        setFavorites((products || []) as Product[])
      } else {
        setFavorites([])
      }

      const { data: purchaseData } = await supabase
        .from("point_transactions")
        .select(`
          id,
          amount,
          created_at,
          product:products (
            id,
            title,
            points,
            thumbnail_url,
            image_url,
            created_at,
            is_deleted,
            file_path,
            download_url
          )
        `)
        .eq("user_id", currentUser.id)
        .eq("type", "purchase")
        .order("created_at", { ascending: false })

      const normalizedPurchases = ((purchaseData || []) as PurchaseItem[]).filter((item) => {
        const product = Array.isArray(item.product) ? item.product[0] : item.product
        return product && !product.is_deleted
      })
      setPurchases(normalizedPurchases)

      const { data: recData } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false })
        .limit(8)
      setRecommended((recData || []) as Product[])

      setRecent(readLocalProducts(RECENT_PRODUCTS_KEY))
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) return <div style={{ padding: "40px" }}>読み込み中...</div>
  if (!user) return <div style={{ padding: "40px" }}>ログインしてください</div>

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "40px", marginBottom: "30px" }}>マイページ</h1>

      <div style={{ marginBottom: "40px", padding: "24px", border: "1px solid #eee", borderRadius: "16px", background: "#fff" }}>
        <p><strong>メール:</strong> {user.email}</p>
        <p>
          <strong>ポイント:</strong>{" "}
          <span style={{ color: "#e60023", fontWeight: "bold", fontSize: "28px" }}>{points.toLocaleString()}</span>
        </p>
        <Link
          href="/points"
          style={{
            display: "inline-block",
            marginTop: "12px",
            padding: "12px 18px",
            borderRadius: "999px",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "#fff",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ポイント購入ページへ
        </Link>
      </div>

      <PurchaseSection title="🛒 購入履歴" purchases={purchases} />
      <Section title="❤️ お気に入り" products={favorites} />
      <Section title="🔥 おすすめ商品" products={recommended} />
      <Section title="👀 最近チェックした商品" products={recent} />

      <div style={{ marginTop: "40px" }}>
        <WithdrawButton />
      </div>
    </div>
  )
}

function PurchaseSection({ title, purchases }: { title: string; purchases: PurchaseItem[] }) {
  if (!purchases.length) return null

  return (
    <div style={{ marginBottom: "50px" }}>
      <h2 style={{ marginBottom: "16px" }}>{title}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: "20px" }}>
        {purchases.map((item) => {
          const product = Array.isArray(item.product) ? item.product[0] : item.product
          if (!product) return null

          const handleDownload = () => {
            if (product.download_url) {
              window.open(product.download_url, "_blank")
              return
            }

            if (!product.file_path) {
              alert("ダウンロードファイルが見つかりません")
              return
            }

            const url = supabase.storage
              .from("product-files")
              .getPublicUrl(product.file_path).data.publicUrl

            window.open(url, "_blank")
          }

          return (
            <div key={item.id}>
              <ProductCard product={product} showDate={false} showPoint />
              <div
                style={{
                  marginTop: "10px",
                  padding: "12px",
                  border: "1px solid #eee",
                  borderRadius: "12px",
                  background: "#fff",
                }}
              >
                <p style={{ margin: 0, fontSize: "13px", color: "#555" }}>
                  購入日：{formatDate(item.created_at)}
                </p>
                <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#555" }}>
                  消費ポイント：{Math.abs(Number(item.amount || 0)).toLocaleString()} pt
                </p>
                {(product.file_path || product.download_url) && (
                  <button
                    onClick={handleDownload}
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "12px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #16a34a, #22c55e)",
                      color: "#fff",
                      fontWeight: "bold",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    ⬇ ダウンロード
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Section({ title, products }: { title: string; products: Product[] }) {
  if (!products.length) return null

  return (
    <div style={{ marginBottom: "50px" }}>
      <h2 style={{ marginBottom: "16px" }}>{title}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: "20px" }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} showDate={false} showPoint />
        ))}
      </div>
    </div>
  )
}
