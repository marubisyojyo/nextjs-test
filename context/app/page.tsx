"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { buildCounts, Category } from "@/lib/site"
import Sidebar from "@/components/Sidebar"
import Hero from "@/components/sections/Hero"
import RecommendedProducts from "@/components/sections/RecommendedProducts"
import News from "@/components/sections/News"
import RecentProducts from "@/components/sections/RecentProducts"
import FavoriteProducts from "@/components/sections/FavoriteProducts"
export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [counts, setCounts] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: categoryData }, { data: countData }] = await Promise.all([
          supabase.from("categories").select("id,name").order("id", { ascending: true }),
          supabase.from("products").select("category_id").eq("is_active", true).eq("is_deleted", false),
        ])
        setCategories((categoryData || []) as Category[])
        setCounts(buildCounts((countData || []) as Array<{ category_id?: number | null }>))
      } finally { setLoading(false) }
    }
    load()
  }, [])
  if (loading) return <div style={{ padding: "40px" }}>読み込み中...</div>
  return <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}><div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "30px", alignItems: "start" }}><Sidebar categories={categories} counts={counts} /><div><Hero /><News /><div style={{ display: "flex", gap: "10px", overflowX: "auto", marginBottom: "20px" }}>{categories.map((cat) => <a key={cat.id} href={`/category/${cat.id}`} style={{ padding: "8px 16px", borderRadius: "999px", border: "1px solid #eee", whiteSpace: "nowrap", cursor: "pointer", color: "inherit", textDecoration: "none" }}>{cat.name}</a>)}</div><RecommendedProducts /><RecentProducts /><FavoriteProducts /></div></div></main>
}
