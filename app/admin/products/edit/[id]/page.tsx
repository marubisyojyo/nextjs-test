"use client"

import { FormEvent, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams, useRouter } from "next/navigation"

export default function EditProduct(){

const params = useParams<{ id: string }>()
const router = useRouter()

const id = params.id as string

const [loading,setLoading] = useState(true)

const [title,setTitle] = useState("")
const [points,setPoints] = useState<number | string>("")
const [image,setImage] = useState("")
const [description,setDescription] = useState("")

const [isActive,setIsActive] = useState(true)
const [isDeleted,setIsDeleted] = useState(false)

const [categoryId,setCategoryId] = useState("")
const [categories,setCategories] = useState<any[]>([])

const [updatedAt,setUpdatedAt] = useState("")

/* 商品取得 */

const loadProduct = async()=>{

const { data,error } = await supabase
.from("products")
.select("*")
.eq("id",id)
.single()

if(error){
console.log(error)
return
}

setTitle(data.title || "")
setPoints(data.points ?? "")
setImage(data.thumbnail_url || "")
setDescription(data.description || "")
setIsActive(data.is_active)
setIsDeleted(data.is_deleted)
setCategoryId(data.category_id ? String(data.category_id) : "")
setUpdatedAt(data.updated_at || "")

setLoading(false)

}

/* カテゴリ取得 */

const loadCategories = async()=>{

const { data,error } = await supabase
.from("categories")
.select("*")
.order("id",{ascending:true})

if(error){
console.log(error)
return
}

setCategories(data || [])

}

/* 更新 */

const updateProduct = async(e: FormEvent<HTMLFormElement>)=>{

e.preventDefault()

const { error } = await supabase
.from("products")
.update({
title:title,
points:Number(points),
thumbnail_url:image,
description:description,
category_id:categoryId || null,
updated_at:new Date().toISOString()
})
.eq("id",id)

if(error){

alert(error.message)

}else{

alert("更新しました")
router.push("/admin/products")

}

}

/* 表示切替 */

const toggleActive = async()=>{

const { error } = await supabase
.from("products")
.update({
is_active:!isActive,
updated_at:new Date().toISOString()
})
.eq("id",id)

if(error){

alert(error.message)

}else{

setIsActive(!isActive)
setUpdatedAt(new Date().toISOString())

}

}

/* 削除 */

const deleteProduct = async()=>{

if(!confirm("この商品を削除しますか？")) return

const { error } = await supabase
.from("products")
.update({
is_active:false,
is_deleted:true,
updated_at:new Date().toISOString()
})
.eq("id",id)

if(error){

alert(error.message)

}else{

alert("削除しました")
router.push("/admin/products")

}

}

/* 復元 */

const restoreProduct = async()=>{

if(!confirm("商品を復元しますか？")) return

const { error } = await supabase
.from("products")
.update({
is_active:true,
is_deleted:false,
updated_at:new Date().toISOString()
})
.eq("id",id)

if(error){

alert(error.message)

}else{

setIsDeleted(false)
setIsActive(true)
setUpdatedAt(new Date().toISOString())

}

}

useEffect(()=>{

const init = async()=>{
await loadProduct()
await loadCategories()
}

init()

},[])

if(loading){

return <div style={{padding:"40px"}}>読み込み中...</div>

}

return(

<div style={{padding:"40px",maxWidth:"800px"}}>

<h1>商品編集</h1>

<form onSubmit={updateProduct}>

<div>

<label>商品タイトル</label>
<br/>

<input
value={title}
onChange={(e)=>setTitle(e.target.value)}
style={{width:"300px",padding:"8px"}}
/>

</div>

<br/>

<div>

<label>ポイント</label>
<br/>

<input
value={points}
onChange={(e)=>setPoints(e.target.value)}
style={{width:"120px",padding:"8px"}}
/>

</div>

<br/>

<div>

<label>サムネイルURL</label>
<br/>

<input
value={image}
onChange={(e)=>setImage(e.target.value)}
style={{width:"400px",padding:"8px"}}
/>

</div>

<br/>

{image && (

<img
src={image}
style={{
width:"200px",
borderRadius:"10px"
}}
onError={(e)=>{
e.currentTarget.src="/noimage.png"
}}
/>

)}

<br/><br/>

<div>

<label>商品説明</label>
<br/>

<textarea
value={description}
onChange={(e)=>setDescription(e.target.value)}
rows={5}
style={{
width:"400px",
padding:"8px"
}}
/>

</div>

<br/>

<div>

<label>カテゴリ</label>
<br/>

<select
value={categoryId}
onChange={(e)=>setCategoryId(e.target.value)}
style={{padding:"8px"}}
>

<option value="">カテゴリ選択</option>

{categories.map((cat)=>(
<option key={cat.id} value={cat.id}>
{cat.name}
</option>
))}

</select>

</div>

<br/>

<button type="submit">
更新
</button>

</form>

<br/><br/>

<p style={{color:"#666"}}>
最終更新：
{updatedAt ? new Date(updatedAt).toLocaleString() : "未更新"}
</p>

<br/>

<div>

<span
style={{
fontWeight:"bold",
color:isDeleted ? "red" : isActive ? "green" : "gray"
}}
>

{isDeleted
? "🗑 削除済"
: isActive
? "🟢 表示"
: "⚫ 非表示"}

</span>

<br/><br/>

{!isDeleted &&(

<button onClick={toggleActive}>
{isActive ? "非表示にする" : "表示する"}
</button>

)}

<br/><br/>

{!isDeleted &&(

<button
style={{background:"red",color:"white"}}
onClick={deleteProduct}
>

削除

</button>

)}

{isDeleted &&(

<button
style={{background:"green",color:"white"}}
onClick={restoreProduct}
>

復元

</button>

)}

<br/><br/>

<button
onClick={()=>router.push(`/products/${id}`)}
>

商品ページを見る

</button>

</div>

</div>

)

}