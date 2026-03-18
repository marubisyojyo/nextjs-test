import Sidebar from "@/components/Sidebar"
import ProductCard from "@/components/ProductCard"
import RecentProducts from "@/components/sections/RecentProducts"
import FavoriteProducts from "@/components/sections/FavoriteProducts"
import { supabase } from "@/lib/supabase"
import { buildCounts, Category, Product } from "@/lib/site"
type Props = { params: Promise<{ id: string }> }
export default async function CategoryPage({ params }: Props) {
  const { id } = await params
  const categoryId = Number(id)
  const [{ data: products }, { data: categories }, { data: countData }] = await Promise.all([
    supabase.from("products").select("*").eq("category_id", categoryId).eq("is_active", true).eq("is_deleted", false).order("created_at", { ascending: false }),
    supabase.from("categories").select("id,name").order("id", { ascending: true }),
    supabase.from("products").select("category_id").eq("is_active", true).eq("is_deleted", false),
  ])
  const counts = buildCounts((countData || []) as Array<{ category_id?: number | null }>)
  const currentCategory = (categories || []).find((c) => Number(c.id) === categoryId)
  return <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}><h1 style={{ fontSize: "28px", marginBottom: "30px" }}>{currentCategory?.name || "カテゴリ"} の商品</h1><div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "32px" }}><Sidebar categories={(categories || []) as Category[]} counts={counts} currentId={categoryId} /><div><div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}><span style={{ fontSize: "18px", fontWeight: "bold", color: "#111" }}>{currentCategory?.name || "カテゴリ"}</span><span style={{ color: "#999" }}>：</span><span style={{ fontSize: "18px", fontWeight: "bold", color: "#6b21a8" }}>{products?.length || 0}件</span><span style={{ fontSize: "14px", color: "#666" }}>の商品</span></div>{products && products.length > 0 ? <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>{products.map((p) => <ProductCard key={p.id} product={p as Product} />)}</div> : <div style={{ padding: "40px", textAlign: "center", border: "1px solid #eee", borderRadius: "16px", background: "#fff" }}>このカテゴリには商品がありません</div>}<div style={{ marginTop: "50px" }}><RecentProducts /></div><div style={{ marginTop: "50px" }}><FavoriteProducts /></div></div></div></main>
}
