import Sidebar from "@/components/Sidebar"
import ProductCard from "@/components/ProductCard"
import RecentProducts from "@/components/sections/RecentProducts"
import FavoriteProducts from "@/components/sections/FavoriteProducts"
import { supabase } from "@/lib/supabase"
import { buildCounts, Category, Product } from "@/lib/site"
import Link from "next/link"
type Props = {
  searchParams?: Promise<{
    search?: string
    sort?: string
    page?: string
  }>
}
export default async function ProductsPage({ searchParams }: Props) {
  const params = (await searchParams) || {}
  const keyword = params.search?.trim() || ""
  const sort = params.sort || "new"

  const page = Number(params.page || "1")
const limit = 20
const from = (page - 1) * limit
const to = from + limit - 1

let query = supabase
  .from("products")
  .select("*", { count: "exact" })
  .eq("is_active", true)
  .eq("is_deleted", false)

if (keyword) query = query.ilike("title", `%${keyword}%`)

if (sort === "popular") query = query.order("purchase_count", { ascending: false, nullsFirst: false })
else if (sort === "points") query = query.order("points", { ascending: false })
else if (sort === "old") query = query.order("created_at", { ascending: true })
else query = query.order("created_at", { ascending: false })

// 👇最後にする
query = query.range(from, to)


// 商品取得（ページネーション対応）
const { data: products, count } = await query

// ページ計算
const totalPages = Math.ceil((count || 0) / limit)

// カテゴリなど
const [{ data: categories }, { data: countData }] = await Promise.all([
  supabase.from("categories").select("id,name").order("id", { ascending: true }),
  supabase.from("products").select("category_id").eq("is_active", true).eq("is_deleted", false),
])

  const counts = buildCounts((countData || []) as Array<{ category_id?: number | null }>)
  return <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}><h1 style={{ fontSize: "30px", marginBottom: "30px" }}>商品一覧</h1><div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "32px" }}><Sidebar categories={(categories || []) as Category[]} counts={counts} /><div><div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}><span style={{ fontSize: "18px", fontWeight: "bold", color: "#111" }}>{keyword ? `検索: ${keyword}` : "全商品"}</span><span style={{ color: "#999" }}>：</span><span style={{ fontSize: "18px", fontWeight: "bold", color: "#2563eb" }}>{products?.length || 0}件</span><span style={{ fontSize: "14px", color: "#666" }}>の商品</span></div><div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>{(products || []).map((p) => <ProductCard key={p.id} product={p as Product} />)}</div>{products?.length === 0 && <div style={{ padding: "40px", textAlign: "center" }}>商品がありません</div>}
  

<div style={{ marginTop: "40px", textAlign: "center" }}>
  {page > 1 && (
    <Link href={`/products?page=${page - 1}`} style={{ marginRight: "10px" }}>
      ← 前
    </Link>
  )}

  {Array.from({ length: totalPages }, (_, i) => (
    <Link
      key={i}
      href={`/products?page=${i + 1}`}
      style={{
        margin: "0 5px",
        padding: "8px 12px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        background: page === i + 1 ? "#2563eb" : "#fff",
        color: page === i + 1 ? "#fff" : "#333",
        textDecoration: "none",
      }}
    >
      {i + 1}
    </Link>
  ))}

  {page < totalPages && (
    <Link href={`/products?page=${page + 1}`} style={{ marginLeft: "10px" }}>
      次 →
    </Link>
  )}
</div>
  
  <RecentProducts /><FavoriteProducts /></div></div></main>
}
