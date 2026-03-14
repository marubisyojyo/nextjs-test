export default function Home() {
  return (
    <main
      style={{
        textAlign: "center",
        padding: "120px 20px"
      }}
    >
      <h1
        style={{
          fontSize: "64px",
          marginBottom: "20px"
        }}
      >
        Build Something Amazing
      </h1>

      <p
        style={{
          fontSize: "22px",
          color: "#555",
          marginBottom: "40px"
        }}
      >
        Next.jsで作るモダンWebサイト
      </p>

      <div>
        <button
          style={{
            padding: "15px 30px",
            fontSize: "18px",
            marginRight: "20px",
            background: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Get Started
        </button>

        <button
          style={{
            padding: "15px 30px",
            fontSize: "18px",
            background: "#eee",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Contact
        </button>
      </div>
    </main>
  );
}