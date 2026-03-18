"use client"

import { useEffect, useState } from "react"
import ProductCard from "@/components/ProductCard"
import { Product, RECENT_PRODUCTS_KEY, SECTION_LIMIT, readLocalProducts } from "@/lib/site"

export default function RecentProducts() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    setProducts(readLocalProducts(RECENT_PRODUCTS_KEY).slice(0, SECTION_LIMIT))
  }, [])

  if (!products.length) return null

  return (
    <section style={{ marginTop: "60px" }}>
      <h2 style={{ marginBottom: "20px" }}>あなたが最近チェックした商品</h2>
      <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "10px" }}>
        {products.map((p) => (
          <div style={{ minWidth: "220px" }} key={p.id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  )
}
