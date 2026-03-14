import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body style={{margin:0,fontFamily:"sans-serif"}}>

        <header
          style={{
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
            padding:"20px 40px",
            background:"#111",
            color:"white"
          }}
        >

          <h2 style={{margin:0}}>MySite</h2>

          <nav>
            <Link href="/" style={{marginRight:"20px",color:"white"}}>Home</Link>
            <Link href="/about" style={{marginRight:"20px",color:"white"}}>About</Link>
            <Link href="/contact" style={{color:"white"}}>Contact</Link>
          </nav>

        </header>

        <main style={{maxWidth:"1000px",margin:"40px auto"}}>
          {children}
        </main>

      </body>
    </html>
  );
}