"use client"

import Link from "next/link"
import { useState } from "react"
import { FALLBACK_IMAGE, Product, formatDate, isNewProduct } from "@/lib/site"

type Props = {
  product: Product
  showDate?: boolean
  showPoint?: boolean
}

export default function ProductCard({ product, showDate = true, showPoint = true }: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <Link href={`/products/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div
        style={{ border: "1px solid #eee", borderRadius: "14px", overflow: "hidden", background: "#fff", transition: "all 0.25s ease", cursor: "pointer" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)"
          e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.15)"
          const img = e.currentTarget.querySelector(".product-image") as HTMLElement | null
          if (img) img.style.transform = "scale(1.06)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)"
          e.currentTarget.style.boxShadow = "none"
          const img = e.currentTarget.querySelector(".product-image") as HTMLElement | null
          if (img) img.style.transform = "scale(1)"
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "scale(0.97)"
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)"
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "260px", background: "#f3f4f6", overflow: "hidden" }}>
          {isNewProduct(product.created_at) && (
            <span style={{ position: "absolute", top: "10px", left: "10px", background: "#e60023", color: "#fff", fontSize: "11px", fontWeight: "bold", padding: "4px 8px", borderRadius: "999px", zIndex: 2 }}>
              NEW
            </span>
          )}
          <img
            className="product-image"
            src={product.thumbnail_url || product.image_url || FALLBACK_IMAGE}
            alt={product.title}
            onLoad={() => setLoaded(true)}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE
            }}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "0.3s", opacity: loaded ? 1 : 0 }}
          />
        </div>
        <div style={{ padding: "12px" }}>
          <p style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "8px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.title}</p>
          {showDate && product.created_at && <p style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>登録日 {formatDate(product.created_at)}</p>}
          {showPoint && <p style={{ fontWeight: "bold", fontSize: "16px", color: "#e60023" }}>{Number(product.points || 0).toLocaleString()} ポイント</p>}
        </div>
      </div>
    </Link>
  )
}
