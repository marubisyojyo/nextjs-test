export default function Contact() {
  return (
    <main style={{padding:"80px"}}>

      <h1>Contact</h1>

      <form
        style={{
          marginTop:"40px",
          display:"flex",
          flexDirection:"column",
          maxWidth:"400px",
          gap:"15px"
        }}
      >

        <input
          placeholder="Your Name"
          style={{padding:"10px"}}
        />

        <input
          placeholder="Email"
          style={{padding:"10px"}}
        />

        <textarea
          placeholder="Message"
          style={{padding:"10px",height:"120px"}}
        />

        <button
          style={{
            padding:"12px",
            background:"#0070f3",
            color:"white",
            border:"none",
            borderRadius:"6px",
            cursor:"pointer"
          }}
        >
          Send
        </button>

      </form>

    </main>
  );
}