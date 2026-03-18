import { redirect } from "next/navigation"
type Props = { searchParams?: Promise<{ q?: string }> }
export default async function SearchPage({ searchParams }: Props) {
  const params = (await searchParams) || {}
  const keyword = params.q?.trim() || ""
  redirect(`/products?search=${encodeURIComponent(keyword)}`)
}
