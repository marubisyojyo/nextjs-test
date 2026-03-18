"use client"
import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import RelatedProducts from "@/components/sections/RelatedProducts"
import RecentProducts from "@/components/sections/RecentProducts"
import FavoriteProducts from "@/components/sections/FavoriteProducts"
import { useFavorites } from "@/context/FavoritesContext"
import { supabase } from "@/lib/supabase"
import {
  buildCounts,
  Category,
  FALLBACK_IMAGE,
  Product,
  formatDate,
  saveRecentProduct,
  syncFavoriteProduct,
} from "@/lib/site"

export default function ProductPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [counts, setCounts] = useState<Record<number, number>>({})
  const [isFavorite, setIsFavorite] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [purchasing, setPurchasing] = useState(false)
  const [owned, setOwned] = useState(false)
  const [userPoints, setUserPoints] = useState(0)

  const { loadFavoritesCount } = useFavorites()

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      const [
        { data: userData },
        { data: likeData },
        { data: productData },
        { data: catData },
        { data: countData },
      ] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from("likes").select("user_id").eq("product_id", id),
        supabase.from("products").select("*").eq("id", id).maybeSingle(),
        supabase.from("categories").select("id,name").order("id", { ascending: true }),
        supabase
          .from("products")
          .select("category_id")
          .eq("is_active", true)
          .eq("is_deleted", false),
      ])

      const user = userData.user
      setLikeCount(likeData?.length || 0)
      setLiked(Boolean(user && likeData?.some((l) => l.user_id === user.id)))
      setCategories((catData || []) as Category[])
      setCounts(buildCounts((countData || []) as Array<{ category_id?: number | null }>))

      if (!productData) {
        setProduct(null)
        setLoading(false)
        return
      }

      const nextProduct = productData as Product
      setProduct(nextProduct)
      setMainImage(nextProduct.thumbnail_url || nextProduct.image_url || FALLBACK_IMAGE)
      saveRecentProduct(nextProduct)

      if (user) {
        const [{ data: favData }, { data: purchaseData }, { data: userRow }] = await Promise.all([
          supabase
            .from("favorites")
            .select("product_id")
            .eq("user_id", user.id)
            .eq("product_id", id)
            .maybeSingle(),
          supabase
            .from("point_transactions")
            .select("id")
            .eq("user_id", user.id)
            .eq("product_id", id)
            .eq("type", "purchase")
            .maybeSingle(),
          supabase
            .from("users")
            .select("points_balance")
            .eq("id", user.id)
            .maybeSingle(),
        ])

        setIsFavorite(Boolean(favData))
        setOwned(Boolean(purchaseData))
        setUserPoints(Number(userRow?.points_balance || 0))
      } else {
        setIsFavorite(false)
        setOwned(false)
        setUserPoints(0)
      }

      setLoading(false)
    }

    load()
  }, [id])

  const handleLike = async () => {
    if (liked || !product) return

    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    if (!user) {
      alert("ログインしてください")
      return
    }

    const { error } = await supabase.from("likes").insert([{ product_id: product.id, user_id: user.id }])
    if (error) {
      alert("いいねの保存に失敗しました")
      return
    }

    setLikeCount((prev) => prev + 1)
    setLiked(true)
  }

  const toggleFavorite = async () => {
    if (favoriteLoading || !product) return

    setFavoriteLoading(true)
    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    if (!user) {
      alert("ログインしてください")
      router.push("/login")
      setFavoriteLoading(false)
      return
    }

    const { data: existing } = await supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", user.id)
      .eq("product_id", id)
      .maybeSingle()

    if (existing) {
      const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", id)
      if (error) {
        alert("削除失敗")
        setFavoriteLoading(false)
        return
      }
      setIsFavorite(false)
      syncFavoriteProduct(product, false)
    } else {
      const { error } = await supabase.from("favorites").insert([{ user_id: user.id, product_id: id }])
      if (error) {
        alert("追加失敗")
        setFavoriteLoading(false)
        return
      }
      setIsFavorite(true)
      syncFavoriteProduct(product, true)
    }

    await loadFavoritesCount()
    setFavoriteLoading(false)
  }

  const handleBuy = async () => {
    if (!product || purchasing) return

    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    if (!user) {
      alert("ログインしてください")
      router.push("/login")
      return
    }

    if (owned) {
      alert("この商品はすでに購入済みです")
      return
    }

    setPurchasing(true)

    try {
      const [{ data: latestUser }, { data: existingPurchase }] = await Promise.all([
        supabase.from("users").select("points_balance").eq("id", user.id).single(),
        supabase
          .from("point_transactions")
          .select("id")
          .eq("user_id", user.id)
          .eq("product_id", product.id)
          .eq("type", "purchase")
          .maybeSingle(),
      ])

      if (existingPurchase) {
        setOwned(true)
        alert("この商品はすでに購入済みです")
        return
      }

      const currentPoints = Number(latestUser?.points_balance || 0)
      const price = Number(product.points || 0)

      if (currentPoints < price) {
        alert("ポイントが不足しています")
        return
      }

      const newPoints = currentPoints - price

      const { error: updateError } = await supabase
        .from("users")
        .update({ points_balance: newPoints })
        .eq("id", user.id)

      if (updateError) {
        alert(`ポイント更新に失敗しました: ${updateError.message}`)
        return
      }

      const { error: insertError } = await supabase.from("point_transactions").insert({
        user_id: user.id,
        product_id: product.id,
        amount: -price,
        type: "purchase",
      })

      if (insertError) {
        await supabase.from("users").update({ points_balance: currentPoints }).eq("id", user.id)
        alert(`購入履歴の保存に失敗しました: ${insertError.message}`)
        return
      }

      const nextPurchaseCount = Number(product.purchase_count || 0) + 1
      await supabase
        .from("products")
        .update({ purchase_count: nextPurchaseCount })
        .eq("id", product.id)

      setUserPoints(newPoints)
      setOwned(true)
      setProduct((prev) => (prev ? { ...prev, purchase_count: nextPurchaseCount } : prev))
      alert("購入完了しました")
      router.refresh()
    } finally {
      setPurchasing(false)
    }
  }

  const buyButtonLabel = useMemo(() => {
    if (owned) return "購入済み"
    if (purchasing) return "購入処理中..."
    return "今すぐ購入する"
  }, [owned, purchasing])

  if (loading) return <div style={{ padding: "40px" }}>読み込み中...</div>
  if (!product) return <div style={{ padding: "40px" }}>商品が見つかりません</div>

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "32px" }}>
        <Sidebar categories={categories} counts={counts} currentId={product.category_id || undefined} />

        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "50px" }}>
            <div>
              <img
                src={mainImage}
                alt={product.title}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE
                }}
                style={{ width: "100%", height: "500px", objectFit: "cover", borderRadius: "16px" }}
              />
            </div>

            <div style={{ border: "1px solid #eee", borderRadius: "16px", padding: "24px", background: "#fff" }}>
              <h1 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "10px" }}>{product.title}</h1>

              <div style={{ marginBottom: "10px" }}>
                <button
                  onClick={handleLike}
                  style={{
                    border: "none",
                    background: liked ? "#ffe4e6" : "#f5f5f5",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    cursor: liked ? "default" : "pointer",
                    fontWeight: "bold",
                    color: "#e60023",
                  }}
                >
                  ❤ {likeCount}
                </button>
              </div>

              <p style={{ fontSize: "28px", color: "#e60023", fontWeight: "bold", marginBottom: "10px" }}>
                {Number(product.points || 0).toLocaleString()} ポイント
              </p>
              <div style={{ fontSize: "14px", color: "#16a34a", fontWeight: "bold", marginBottom: "6px" }}>✔ 今すぐダウンロード可能</div>
              <p style={{ color: "#666" }}>登録日：{formatDate(product.created_at)}</p>
              <p style={{ color: "#2563eb", fontWeight: "bold", marginTop: "8px" }}>
                あなたの所持ポイント：{userPoints.toLocaleString()}
              </p>
              {owned && <p style={{ color: "#16a34a", fontWeight: "bold", marginTop: "8px" }}>この商品は購入済みです</p>}

              {owned && (product.file_path || product.download_url) && (
                <button
                  onClick={() => {
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
                  }}
                  style={{
                    width: "100%",
                    padding: "16px",
                    marginTop: "12px",
                    borderRadius: "12px",
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

              <div style={{ fontSize: "14px", marginTop: "12px", marginBottom: "20px", whiteSpace: "pre-wrap" }}>
                {product.description || "説明はありません"}
              </div>

              <button
                onClick={handleBuy}
                disabled={purchasing || owned}
                style={{
                  width: "100%",
                  padding: "20px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  background: owned ? "#cbd5e1" : "linear-gradient(135deg, #ff6b6b, #ff4d5a)",
                  color: "#fff",
                  borderRadius: "14px",
                  border: "none",
                  cursor: purchasing || owned ? "default" : "pointer",
                }}
              >
                {buyButtonLabel}
              </button>

              {!owned && (
                <button
                  onClick={() => router.push("/points")}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "10px",
                    borderRadius: "12px",
                    border: "1px solid #2563eb",
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  ポイントを購入する
                </button>
              )}

              <button
                onClick={toggleFavorite}
                disabled={favoriteLoading}
                style={{
                  width: "100%",
                  padding: "14px",
                  marginTop: "12px",
                  borderRadius: "12px",
                  border: isFavorite ? "1px solid #ff4d4f" : "1px solid #ddd",
                  background: isFavorite ? "#fff1f1" : "#f8f8f8",
                  color: isFavorite ? "#ff4d4f" : "#333",
                  fontWeight: "bold",
                  cursor: favoriteLoading ? "wait" : "pointer",
                }}
              >
                {isFavorite ? "❤ お気に入り済み" : "♡ お気に入り"}
              </button>
            </div>
          </div>

          <RelatedProducts categoryId={Number(product.category_id)} currentProductId={String(product.id)} />
          <RecentProducts />
          <FavoriteProducts />
        </div>
      </div>
    </main>
  )
}
