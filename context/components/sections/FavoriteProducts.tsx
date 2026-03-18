"use client"

import { useEffect, useState } from "react"
import ProductCard from "@/components/ProductCard"
import { FAVORITE_PRODUCTS_KEY, Product, SECTION_LIMIT, readLocalProducts } from "@/lib/site"

export default function FavoriteProducts() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    setProducts(readLocalProducts(FAVORITE_PRODUCTS_KEY).slice(0, SECTION_LIMIT))
  }, [])

  if (!products.length) return null

  return (
    <section style={{ marginTop: "60px" }}>
      <h2 style={{ marginBottom: "20px" }}>あなたのお気に入り</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
