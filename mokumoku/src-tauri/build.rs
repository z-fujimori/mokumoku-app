fn main() {
    // .envファイルの読み込み
    dotenvy::from_filename(".env").ok();

    // 必要な環境変数を取得
    if let Ok(supabase_key) = std::env::var("VITE_SUPABASE_ANON_KEY") {
        println!("cargo:rustc-env=SUPABASE_ANON_KEY={}", supabase_key);
    }
    if let Ok(supabase_url) = std::env::var("VITE_SUPABASE_URL") {
        println!("cargo:rustc-env=SUPABASE_URL={}", supabase_url);
    }

    tauri_build::build()
    
}
