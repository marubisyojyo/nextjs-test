import { supabase } from "@/lib/supabase"

export default async function ProductPage({ params }: any) {

  const id = params.id

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single()

  if (!product || error) {
    return <div style={{ padding: "40px" }}>商品が見つかりません</div>
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px",
      }}
    >
      <img
        src={product.image_url}
        style={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "10px",
        }}
      />

      <h1>{product.title}</h1>

      <p style={{ fontSize: "20px" }}>
        {product.points} ポイント
      </p>

      <button
        style={{
          padding: "12px 24px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        購入する
      </button>
    </div>
  )
}