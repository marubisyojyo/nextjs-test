import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://lyoqauwmukrrulqbbape.supabase.co"
const supabaseKey = "sb_publishable_FKCtkr0fkUunVoy8todtVw_GPjUjnwt"

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)