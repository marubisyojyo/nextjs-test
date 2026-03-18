"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import ProductCard from "@/components/ProductCard"

export default function RecommendedProducts() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .eq("is_deleted", false)
        .order("purchase_count", { ascending: false }) // ← 人気順
        .limit(8)

      setProducts(data || [])
    }

    load()
  }, [])

  if (!products.length) return null

  return (
    <section style={{ marginTop: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>
        🔥 人気商品（おすすめ）
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "24px",
        }}
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}