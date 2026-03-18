"use client"

import Link from "next/link"

export default function AdminDashboard(){

return(

<div style={{padding:"40px"}}>

<h1>管理ダッシュボード</h1>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(2,200px)",
gap:"20px",
marginTop:"30px"
}}>

<Link href="/admin/products">
<div style={cardStyle}>
商品管理
</div>
</Link>

<Link href="/admin/products/new">
<div style={cardStyle}>
商品登録
</div>
</Link>

<Link href="/admin/categories">
<div style={cardStyle}>
カテゴリ管理
</div>
</Link>

<Link href="/admin/messages">
<div style={cardStyle}>
お知らせ管理
</div>
</Link>

<Link href="/admin/users">
<div style={cardStyle}>
ユーザー管理
</div>
</Link>

</div>

</div>

)

}

const cardStyle = {
border:"1px solid #ddd",
padding:"30px",
textAlign:"center",
borderRadius:"10px",
cursor:"pointer",
fontWeight:"bold"
} as const