"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Contact() {

  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [message,setMessage] = useState("")

  const send = async () => {

    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          name:name,
          email:email,
          message:message
        }
      ])

    if(error){
      alert("送信失敗")
      console.log(error)
    }else{
      alert("送信成功")
    }

  }

  return (

    <main style={{padding:"80px",textAlign:"center"}}>

      <h1>Contact</h1>

      <div style={{maxWidth:"400px",margin:"40px auto"}}>

        <input
          placeholder="Your Name"
          style={{width:"100%",padding:"10px",marginBottom:"10px"}}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          placeholder="Email"
          style={{width:"100%",padding:"10px",marginBottom:"10px"}}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <textarea
          placeholder="Message"
          style={{width:"100%",padding:"10px",height:"120px"}}
          onChange={(e)=>setMessage(e.target.value)}
        />

        <button
          style={{
            marginTop:"20px",
            width:"100%",
            padding:"12px",
            background:"#0070f3",
            color:"white",
            border:"none",
            borderRadius:"6px"
          }}
          onClick={send}
        >
          Send
        </button>

      </div>

    </main>

  )
}