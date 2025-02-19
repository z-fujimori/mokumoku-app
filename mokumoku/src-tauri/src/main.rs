// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub(crate) mod handlers;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    tauri::Builder::default()
        // API コマンドを登録
        .invoke_handler(tauri::generate_handler![
            handlers::session::store_session
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
