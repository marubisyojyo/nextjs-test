import { supabase } from "@/lib/supabase"

export default async function Products() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return <div style={{ padding: "40px" }}>エラー: {error.message}</div>
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: "36px", marginBottom: "24px" }}>商品一覧</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "24px",
        }}
      >
        {products?.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              overflow: "hidden",
              background: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <img
              src={product.image_url}
              alt={product.title}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
                display: "block",
              }}
            />

            <div style={{ padding: "16px" }}>
              <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>
                {product.title}
              </h3>

              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "16px",
                }}
              >
                {product.points} ポイント
              </p>

              <button
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                詳細を見る
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}