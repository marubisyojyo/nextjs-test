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
            borderBottom:"1px solid #ddd"
          }}
        >

          <h2>MySite</h2>

          <nav>
            <Link href="/" style={{marginRight:"20px"}}>Home</Link>
            <Link href="/about" style={{marginRight:"20px"}}>About</Link>
            <Link href="/contact">Contact</Link>
          </nav>

        </header>

        <main style={{maxWidth:"1000px",margin:"0 auto"}}>
          {children}
        </main>

      </body>
    </html>
  );
}