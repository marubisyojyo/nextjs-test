export default function Home() {
  return (
    <main style={{textAlign:"center", padding:"80px"}}>
      
      <h1 style={{fontSize:"60px"}}>
        My First Website
      </h1>

      <p style={{fontSize:"20px", marginTop:"20px"}}>
        Next.jsで作った最初のサイトです
      </p>

      <button
        style={{
          marginTop:"40px",
          padding:"15px 30px",
          fontSize:"18px",
          background:"#0070f3",
          color:"white",
          border:"none",
          borderRadius:"10px",
          cursor:"pointer"
        }}
      >
        Get Started
      </button>

    </main>
  );
}