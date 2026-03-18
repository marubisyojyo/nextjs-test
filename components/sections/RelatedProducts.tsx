"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import ProductCard from "@/components/ProductCard"

type Props = {
  categoryId: number
  currentProductId: string
}

export default function RelatedProducts({
  categoryId,
  currentProductId,
}: Props) {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      if (!categoryId) return

      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", categoryId)
        .eq("is_active", true)
        .eq("is_deleted", false)
        .neq("id", currentProductId)
        .order("created_at", { ascending: false })
        .limit(4)

      setProducts(data || [])
    }

    load()
  }, [categoryId, currentProductId])

  if (!products.length) return null

  return (
    <section style={{ marginTop: "60px" }}>
      <h2 style={{ marginBottom: "20px" }}>関連商品</h2>

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