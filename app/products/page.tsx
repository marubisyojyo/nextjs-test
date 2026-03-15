import { supabase } from "@/lib/supabase"

export default async function Products() {

const { data: products } = await supabase
.from("products")
.select("*")

return (

<div style={{padding:"40px"}}>

<h1>商品一覧</h1>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(4,1fr)",
gap:"20px"
}}>

{products?.map((product)=>(

<div key={product.id}>

<img
src={product.image_url}
style={{width:"100%"}}
/>

<h3>{product.title}</h3>

<p>{product.points} ポイント</p>

</div>

))}

</div>

</div>

)

}