"use client"

import { useRouter } from "next/navigation"

export default function SignupRequired() {

  const router = useRouter()

  return (

    <div style={{
      maxWidth:"500px",
      margin:"100px auto",
      textAlign:"center",
      padding:"40px",
      border:"1px solid #eee",
      borderRadius:"10px"
    }}>

      <h1 style={{marginBottom:"20px"}}>
        素材を購入するには<br/>
        会員登録が必要です
      </h1>

<div style={{
  textAlign:"left",
  margin:"30px auto",
  maxWidth:"320px",
  lineHeight:"2"
}}>
  ✓ 購入履歴管理<br/>
  ✓ 再ダウンロード<br/>
  ✓ ポイント購入<br/>
  ✓ 会員限定の無料商品ダウンロード
  <span style={{
    background:"#ff4d4f",
    color:"#fff",
    fontSize:"12px",
    padding:"2px 6px",
    borderRadius:"4px",
    marginLeft:"6px"
  }}>
    NEW
  </span>
</div>

      <button
        onClick={()=>router.push("/signup")}
        style={{
          padding:"12px 30px",
          fontSize:"16px",
          background:"#00a86b",
          color:"#fff",
          border:"none",
          borderRadius:"6px",
          cursor:"pointer"
        }}
      >
        無料会員登録
      </button>

      <p style={{marginTop:"20px"}}>
        すでに会員の方
      </p>

      <button
        onClick={()=>router.push("/login")}
        style={{
          padding:"10px 20px",
          cursor:"pointer",
          background:"#f5f5f5",
          border:"1px solid #ddd"
        }}
      >
        ログイン
      </button>

    </div>

  )

}