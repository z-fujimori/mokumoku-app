import { createClient } from '@supabase/supabase-js'
// import type { Database } from "../types/supabase";  // Supabaseの型を生成した際に作成されたinterface

// supabase.~~としてSupabaseのAuthAPIを使用する。
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL または API キーが設定されていません。");
}

// `supabase` インスタンスは 1 つだけ作成し、エクスポート
export const supabase = createClient(supabaseUrl, supabaseAnonKey);