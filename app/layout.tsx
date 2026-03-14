import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>

        <nav style={{
          padding: "20px",
          borderBottom: "1px solid #ccc",
          fontSize: "18px"
        }}>
          <Link href="/" style={{marginRight:"20px"}}>Home</Link>
          <Link href="/about" style={{marginRight:"20px"}}>About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {children}

      </body>
    </html>
  );
}