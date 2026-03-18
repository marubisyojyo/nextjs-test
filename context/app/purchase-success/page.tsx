export default function Page() {

  return (
    <div style={{ padding: "60px", textAlign: "center" }}>

      <h1>購入ありがとうございました</h1>

      <p>
        商品のダウンロードはマイページからできます
      </p>

      <br />

      <a
        href="/mypage"
        style={{
          padding: "12px 24px",
          background: "#000",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "6px"
        }}
      >
        マイページへ
      </a>

    </div>
  )

}