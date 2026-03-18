import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { error } = await supabase
      .from("contacts")
      .insert([body])

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    })
  }
}