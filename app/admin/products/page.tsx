"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function AdminProducts() {

const [products,setProducts] = useState<any[]>([])
const [categories,setCategories] = useState<any[]>([])
const [filter,setFilter] = useState("all")
const [search,setSearch] = useState("")
const [sort,setSort] = useState("new")
const [loading,setLoading] = useState(true)

const loadProducts = async () => {

const { data,error } = await supabase
.from("products")
.select("*")

if(error){
console.log(error)
}

setProducts(data || [])
setLoading(false)

}

const loadCategories = async () => {

const { data,error } = await supabase
.from("categories")
.select("*")

if(error){
console.log(error)
}

setCategories(data || [])

}

useEffect(()=>{
loadProducts()
loadCategories()
},[])

const getCategoryName = (id:any)=>{

const cat = categories.find(c => Number(c.id) === Number(id))

return cat ? cat.name : ""

}

const toggleActive = async (id:string,current:boolean) => {

const { error } = await supabase
.from("products")
.update({ is_active: !current })
.eq("id",id)

if(error){
alert(error.message)
}else{
loadProducts()
}

}

const deleteProduct = async (id:string)=>{

if(!confirm("この商品を削除しますか？")) return

const { error } = await supabase
.from("products")
.update({ is_deleted:true })
.eq("id",id)

if(error){
alert(error.message)
}else{
loadProducts()
}

}

const filteredProducts = products

.filter((product)=>{

if(filter === "active"){
return product.is_active && !product.is_deleted
}

if(filter === "hidden"){
return !product.is_active && !product.is_deleted
}

if(filter === "deleted"){
return product.is_deleted
}

return true

})

.filter((product)=>{

if(!search) return true

return product.title
?.toLowerCase()
.includes(search.toLowerCase())

})

.sort((a,b)=>{

if(sort === "new"){
return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
}

if(sort === "old"){
return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
}

if(sort === "points"){
return b.points - a.points
}

return 0

})

if(loading){
return <div style={{padding:"40px"}}>読み込み中...</div>
}

return (

<div style={{padding:"40px",maxWidth:"1000px",margin:"0 auto"}}>

<h1>商品管理</h1>

<Link href="/admin/products/new">
<button style={{marginBottom:"20px"}}>＋商品登録</button>
</Link>

{/* 検索 */}

<input
placeholder="商品検索"
value={search}
onChange={(e)=>setSearch(e.target.value)}
style={{
padding:"8px",
width:"250px",
marginRight:"20px"
}}
/>

{/* 並び替え */}

<select
value={sort}
onChange={(e)=>setSort(e.target.value)}
style={{padding:"8px"}}
>

<option value="new">新しい順</option>
<option value="old">古い順</option>
<option value="points">ポイント順</option>

</select>

{/* フィルター */}

<div style={{margin:"20px 0",display:"flex",gap:"10px"}}>

<button onClick={()=>setFilter("all")}>すべて</button>
<button onClick={()=>setFilter("active")}>表示</button>
<button onClick={()=>setFilter("hidden")}>非表示</button>
<button onClick={()=>setFilter("deleted")}>削除</button>

</div>

<hr style={{margin:"20px 0"}}/>

{filteredProducts.map((product)=>(

<div
key={product.id}
style={{
border:"1px solid #ddd",
padding:"15px",
marginBottom:"10px",
display:"flex",
justifyContent:"space-between",
alignItems:"center",
borderRadius:"8px",
opacity: product.is_deleted ? 0.5 : 1,
background: !product.is_active ? "#f7f7f7" : "white"
}}
>

{/* 左側 */}

<div style={{display:"flex",alignItems:"center",gap:"15px"}}>

<Link href={`/admin/products/edit/${product.id}`}>
<img
src={product.thumbnail_url || "/noimage.png"}
alt={product.title}
style={{
width:"80px",
height:"80px",
objectFit:"cover",
borderRadius:"6px",
cursor:"pointer"
}}
onError={(e)=>{
e.currentTarget.src="/noimage.png"
}}
/>
</Link>

<div>

<Link href={`/admin/products/edit/${product.id}`}>
<b>{product.title}</b>
</Link>

<div>{product.points} pt</div>

<div style={{fontSize:"12px",color:"#666"}}>
カテゴリ：{getCategoryName(product.category_id)}
</div>

<div style={{fontSize:"12px",color:"#999"}}>
登録日：
{product.created_at
? new Date(product.created_at).toLocaleDateString()
: ""}
</div>

<div style={{
marginTop:"5px",
fontSize:"12px",
fontWeight:"bold",
color:
product.is_deleted
? "red"
: product.is_active
? "green"
: "gray"
}}>

{product.is_deleted
? "🗑 削除済"
: product.is_active
? "🟢 表示"
: "⚫ 非表示"}

</div>

</div>

</div>

{/* 右側ボタン */}

<div style={{display:"flex",gap:"10px"}}>

<Link href={`/products/${product.id}`}>
<button>プレビュー</button>
</Link>

<Link href={`/admin/products/edit/${product.id}`}>
<button>編集</button>
</Link>

{!product.is_deleted && (

<button
onClick={()=>toggleActive(product.id,product.is_active)}
>
{product.is_active ? "非表示" : "表示"}
</button>

)}

{!product.is_deleted && (

<button
onClick={()=>deleteProduct(product.id)}
style={{color:"red"}}
>
削除
</button>

)}

</div>

</div>

))}

</div>

)

}