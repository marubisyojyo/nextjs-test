"use client"

export default function News() {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #eee",
      borderRadius: "16px",
      padding: "16px 20px", // ← 少しコンパクト
      marginBottom: "24px"
    }}>
      <h3 style={{
        marginBottom: "10px",
        fontSize: "16px"
      }}>
        📢 お知らせ
      </h3>

      {/* 👇 ここが重要 */}
      <div style={{
        maxHeight: "60px",   // ← 高さ制限
        overflowY: "auto",    // ← スクロールON
        paddingRight: "6px"
      }}>

        <ul style={{
          fontSize: "13px",
          color: "#555",
          lineHeight: 1.6,
          margin: 0,
          paddingLeft: "16px"
        }}>
          <li>2026/03/17 新商品追加しました</li>
          <li>2026/03/15 人気ランキング更新</li>
          <li>2026/03/10 サイト公開しました</li>
          <li>2026/03/05 UI改善しました</li>
          <li>2026/03/01 新カテゴリ追加</li>
          <li>2026/02/28 サーバー強化</li>
        </ul>

      </div>
    </div>
  )
}