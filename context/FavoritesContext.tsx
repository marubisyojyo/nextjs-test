"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type FavoritesContextType = {
  favoritesCount: number
  setFavoritesCount: React.Dispatch<React.SetStateAction<number>>
  loadFavoritesCount: () => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextType | null>(null)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoritesCount, setFavoritesCount] = useState(0)

  const loadFavoritesCount = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setFavoritesCount(0)
      return
    }
    const { count, error } = await supabase.from("favorites").select("*", { count: "exact", head: true }).eq("user_id", user.id)
    if (error) return
    setFavoritesCount(count || 0)
  }

  useEffect(() => {
    loadFavoritesCount()
  }, [])

  return (
    <FavoritesContext.Provider value={{ favoritesCount, setFavoritesCount, loadFavoritesCount }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error("useFavoritesはFavoritesProviderの中で使ってください")
  return context
}
