import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config();

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);
