"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { FavoritesProvider, useFavorites } from "@/context/FavoritesContext"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto", background: "#fff" }}>
        <FavoritesProvider>
          <LayoutContent>{children}</LayoutContent>
        </FavoritesProvider>
      </body>
    </html>
  )
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [search, setSearch] = useState("")
  const [points, setPoints] = useState(0)
  const [hoverBtn, setHoverBtn] = useState("")
  const [hoverIcon, setHoverIcon] = useState(false)
  const { favoritesCount, loadFavoritesCount } = useFavorites()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const loadUserData = async () => {
      const { data } = await supabase.auth.getUser()
      const currentUser = data.user
      setUser(currentUser)

      if (!currentUser) {
        setPoints(0)
        return
      }

      await loadFavoritesCount()
      const { data: userData } = await supabase
        .from("users")
        .select("points_balance")
        .eq("id", currentUser.id)
        .maybeSingle()
      setPoints(userData?.points_balance || 0)
    }

    loadUserData()
    window.addEventListener("focus", loadUserData)

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        setPoints(0)
        return
      }
      loadFavoritesCount()
    })

    return () => {
      window.removeEventListener("focus", loadUserData)
      subscription.unsubscribe()
    }
  }, [loadFavoritesCount])

  useEffect(() => {
    if (pathname !== "/products") {
      setSearch("")
    }
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace("/")
    router.refresh()
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const keyword = search.trim()
    if (!keyword) return
    router.push(`/products?search=${encodeURIComponent(keyword)}`)
  }

  const navStyle = (path: string) => ({
    color: pathname === path ? "#000" : "#555",
    fontWeight: pathname === path ? "600" : "400",
    textDecoration: "none",
  })

  return (
    <>
      <header style={{ position: "sticky", top: 0, zIndex: 1000, background: "#fff", borderBottom: "1px solid #eee", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
            <Link
  href="/"
  style={{
    fontSize: "16px",
    fontWeight: "900",
    background: "linear-gradient(90deg,#00dbde,#fc00ff)",
    WebkitBackgroundClip: "text",
    color: "transparent",
    whiteSpace: "nowrap",
  }}
>
  AIデジタルストア
</Link>
            <nav style={{ display: "flex", gap: "18px", fontSize: "15px" }}>
              <Link href="/" style={navStyle("/")}>Home</Link>
              <Link href="/products" style={navStyle("/products")}>商品一覧</Link>
              <Link href="/about" style={navStyle("/about")}>About</Link>
              <Link href="/contact" style={navStyle("/contact")}>Contact</Link>
            </nav>
          </div>

          <form onSubmit={handleSearch} style={{ flex: "1", minWidth: "200px", maxWidth: "320px" }}>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: "999px", overflow: "hidden", transition: "0.2s" }}>
              <input
                placeholder="商品を検索..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1, padding: "12px 16px", border: "none", outline: "none" }}
              />
              <button
                type="submit"
                onMouseEnter={() => setHoverIcon(true)}
                onMouseLeave={() => setHoverIcon(false)}
                style={{ width: "42px", height: "42px", border: "none", background: hoverIcon ? "#e2e8f0" : "#f1f5f9", cursor: "pointer", transition: "0.2s" }}
              >
                🔍
              </button>
            </div>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {user && (
              <Link href="/mypage" style={{ textDecoration: "none" }}>
                <div style={{ textAlign: "center", cursor: "pointer" }}>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "#2563eb" }}>{favoritesCount}件</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>❤ お気に入り</div>
                </div>
              </Link>
            )}

            {user && (
              <Link href="/mypage" style={{ textDecoration: "none" }}>
                <div style={{ textAlign: "center", cursor: "pointer" }}>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#e60023" }}>{points.toLocaleString()}</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>ポイント</div>
                </div>
              </Link>
            )}

            <Link
              href="/points"
              onMouseEnter={() => setHoverBtn("points")}
              onMouseLeave={() => setHoverBtn("")}
              style={{
                ...pointsBtn,
                transform: hoverBtn === "points" ? "translateY(-2px)" : "none",
                boxShadow: hoverBtn === "points" ? "0 6px 16px rgba(37,99,235,0.25)" : "none",
                transition: "0.2s",
              }}
            >
              ポイント購入
            </Link>

            {!user && (
              <>
                <Link
                  href="/login"
                  onMouseEnter={() => setHoverBtn("login")}
                  onMouseLeave={() => setHoverBtn("")}
                  style={{
                    ...loginBtn,
                    transform: hoverBtn === "login" ? "translateY(-2px)" : "none",
                    boxShadow: hoverBtn === "login" ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
                    transition: "0.2s",
                  }}
                >
                  ログイン
                </Link>
                <Link
                  href="/signup"
                  onMouseEnter={() => setHoverBtn("signup")}
                  onMouseLeave={() => setHoverBtn("")}
                  style={{
                    ...signupBtn,
                    transform: hoverBtn === "signup" ? "translateY(-2px)" : "none",
                    boxShadow: hoverBtn === "signup" ? "0 6px 16px rgba(34,197,94,0.4)" : "none",
                    transition: "0.2s",
                  }}
                >
                  無料登録
                </Link>
              </>
            )}

            {user && (
              <>
                <Link
                  href="/mypage"
                  onMouseEnter={() => setHoverBtn("mypage")}
                  onMouseLeave={() => setHoverBtn("")}
                  style={{
                    ...loginBtn,
                    transform: hoverBtn === "mypage" ? "translateY(-2px)" : "none",
                    boxShadow: hoverBtn === "mypage" ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
                    transition: "0.2s",
                  }}
                >
                  マイページ
                </Link>
                <button
                  onClick={handleLogout}
                  onMouseEnter={() => setHoverBtn("logout")}
                  onMouseLeave={() => setHoverBtn("")}
                  style={{
                    ...logoutBtn,
                    transform: hoverBtn === "logout" ? "translateY(-2px)" : "none",
                    boxShadow: hoverBtn === "logout" ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
                    transition: "0.2s",
                  }}
                >
                  ログアウト
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>{children}</main>
      <footer style={{ marginTop: "80px", padding: "30px", textAlign: "center", borderTop: "1px solid #eee" }}>© 2026 MySite</footer>
    </>
  )
}

const loginBtn = { padding: "10px 16px", borderRadius: "999px", border: "1px solid #ddd", textDecoration: "none", color: "#333", cursor: "pointer" }
const signupBtn = { padding: "12px 18px", borderRadius: "999px", background: "linear-gradient(135deg, #16a34a, #22c55e)", color: "#fff", textDecoration: "none", fontWeight: "bold", cursor: "pointer" }
const logoutBtn = { padding: "10px 16px", borderRadius: "999px", border: "1px solid #ddd", background: "#f5f5f5", cursor: "pointer" }
const pointsBtn = { padding: "12px 18px", borderRadius: "999px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff", textDecoration: "none", fontWeight: "bold", cursor: "pointer" }
