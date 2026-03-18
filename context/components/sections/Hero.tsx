"use client"

import Link from "next/link"

export default function Hero() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg,#111827,#6b21a8)",
        color: "#fff",
        borderRadius: "16px",
        padding: "14px 32px", // ← 小さくした
        marginBottom: "24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* 左 */}
      <div>
        <h1 style={{ fontSize: "26px", marginBottom: "8px" }}>
          AIデジタルストア
        </h1>

        <p style={{ opacity: 0.85, fontSize: "14px", marginBottom: "14px" }}>
          高品質な動画・画像・コンテンツをすぐダウンロード
        </p>

        <Link href="/products">
          <button
            style={{
              padding: "10px 18px",
              background: "#fff",
              color: "#111",
              borderRadius: "8px",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            商品を見る →
          </button>
        </Link>
      </div>

      {/* 右（装飾） */}
      <div style={{
        fontSize: "48px",
        opacity: 0.2,
        fontWeight: "bold"
      }}>
        AI
      </div>

    </div>
  )
}