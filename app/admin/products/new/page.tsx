"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function NewProduct() {

const [title,setTitle] = useState("")
const [points,setPoints] = useState("")
const [image,setImage] = useState("")

const handleSubmit = async (e:any) => {

e.preventDefault()

const { error } = await supabase
.from("products")
.insert([
{
title:title,
points:points,
image_url:image
}
])

if(error){
alert(error.message)
}
}else{
alert("商品登録成功")
}

}

return (

<div style={{padding:"40px"}}>

<h1>商品登録</h1>

<form onSubmit={handleSubmit}>

<input
placeholder="商品タイトル"
value={title}
onChange={(e)=>setTitle(e.target.value)}
/>

<br/><br/>

<input
placeholder="ポイント"
value={points}
onChange={(e)=>setPoints(e.target.value)}
/>

<br/><br/>

<input
placeholder="画像URL"
value={image}
onChange={(e)=>setImage(e.target.value)}
/>

<br/><br/>

<button type="submit">
登録
</button>

</form>

</div>

)
}