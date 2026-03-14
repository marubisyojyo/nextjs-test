"use client";

import { useState } from "react";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [dark, setDark] = useState(false);

  return (
    <html>
      <body
        style={{
          margin:0,
          fontFamily:"sans-serif",
          background: dark ? "#111" : "#fff",
          color: dark ? "#fff" : "#000"
        }}
      >

        <header
          style={{
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
            padding:"20px 40px",
            borderBottom:"1px solid #ccc"
          }}
        >

          <h2>MySite</h2>

          <nav>
            <Link href="/" style={{marginRight:"20px"}}>Home</Link>
            <Link href="/about" style={{marginRight:"20px"}}>About</Link>
            <Link href="/contact" style={{marginRight:"20px"}}>Contact</Link>
          </nav>

          <button
            onClick={() => setDark(!dark)}
            style={{
              padding:"8px 14px",
              borderRadius:"6px",
              border:"none",
              cursor:"pointer"
            }}
          >
            {dark ? "☀ Light" : "🌙 Dark"}
          </button>

        </header>

        <main style={{maxWidth:"1000px",margin:"40px auto"}}>
          {children}
          
          <footer
  style={{
    marginTop:"80px",
    padding:"30px",
    textAlign:"center",
    borderTop:"1px solid #ccc"
  }}
>
  © 2026 MySite
</footer>
        </main>

      </body>
    </html>
  );
}