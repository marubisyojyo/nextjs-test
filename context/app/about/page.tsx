import Link from "next/link"

export default function AboutPage() {
  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "60px 20px 80px",
      }}
    >
      <section
        style={{
          background: "linear-gradient(135deg,#111827,#1f2937)",
          color: "white",
          borderRadius: "24px",
          padding: "60px 30px",
          textAlign: "center",
          marginBottom: "50px",
        }}
      >
        <p
          style={{
            display: "inline-block",
            padding: "6px 14px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.12)",
            fontSize: "14px",
            marginBottom: "18px",
          }}
        >
          ABOUT US
        </p>

        <h1
          style={{
            fontSize: "42px",
            fontWeight: 800,
            marginBottom: "18px",
          }}
        >
          高品質なAI素材を、もっと手軽に
        </h1>

        <p
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            fontSize: "17px",
            lineHeight: 1.9,
            opacity: 0.92,
          }}
        >
          このサイトは、動画・画像・デザイン素材を探している方が、
          必要な素材をすぐに見つけて、わかりやすくダウンロードできることを目指した
          AI素材ダウンロードサイトです。
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "24px",
          marginBottom: "50px",
        }}
      >
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "18px",
            padding: "24px",
            background: "#fff",
          }}
        >
          <h2 style={{ fontSize: "22px", marginBottom: "14px" }}>探しやすい</h2>
          <p style={{ lineHeight: 1.8, color: "#555" }}>
            カテゴリ、検索、人気表示、閲覧履歴などから、欲しい素材をすばやく探せます。
          </p>
        </div>

        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "18px",
            padding: "24px",
            background: "#fff",
          }}
        >
          <h2 style={{ fontSize: "22px", marginBottom: "14px" }}>使いやすい</h2>
          <p style={{ lineHeight: 1.8, color: "#555" }}>
            ポイント購入でスムーズに素材をダウンロードでき、購入履歴やマイページ管理も簡単です。
          </p>
        </div>

        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "18px",
            padding: "24px",
            background: "#fff",
          }}
        >
          <h2 style={{ fontSize: "22px", marginBottom: "14px" }}>安心して使える</h2>
          <p style={{ lineHeight: 1.8, color: "#555" }}>
            会員機能、お気に入り機能、履歴確認など、継続して使いやすい仕組みを整えています。
          </p>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "28px",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "20px",
            padding: "28px",
            background: "#fff",
          }}
        >
          <h2 style={{ fontSize: "30px", marginBottom: "18px" }}>このサイトについて</h2>

          <p style={{ lineHeight: 2, color: "#555", marginBottom: "16px" }}>
            画像素材、動画素材、無料素材などをわかりやすく整理し、
            必要なタイミングで必要なものを入手できることを大切にしています。
          </p>

          <p style={{ lineHeight: 2, color: "#555", marginBottom: "16px" }}>
            クリエイターの制作補助、SNS投稿、デザイン制作、動画編集など、
            幅広い用途で使える素材を扱うサイトとして、見やすさと使いやすさの両立を目指しています。
          </p>

          <p style={{ lineHeight: 2, color: "#555" }}>
            今後もカテゴリ拡充や利便性改善を進め、より使いやすい素材ダウンロードサイトにしていきます。
          </p>
        </div>

        <div
          style={{
            borderRadius: "20px",
            padding: "28px",
            background: "linear-gradient(135deg,#eff6ff,#eef2ff)",
            border: "1px solid #dbeafe",
          }}
        >
          <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>まずは無料登録</h2>

          <ul style={{ paddingLeft: "20px", color: "#444", lineHeight: 2 }}>
            <li>お気に入り機能が使える</li>
            <li>購入履歴を確認できる</li>
            <li>ダウンロード履歴を管理できる</li>
            <li>ポイント購入ですぐ使える</li>
          </ul>

          <div style={{ marginTop: "24px" }}>
            <Link href="/signup">
              <button
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "none",
                  borderRadius: "12px",
                  background: "#111827",
                  color: "#fff",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                会員登録へ進む
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}