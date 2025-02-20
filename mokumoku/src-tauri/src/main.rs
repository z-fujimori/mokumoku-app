// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub(crate) mod handlers;
use crate::handlers::secure_session;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    tauri::Builder::default()
        // API コマンドを登録
        .invoke_handler(tauri::generate_handler![
            secure_session::insert,
            secure_session::get,
            secure_session::get2,
            secure_session::insert_get,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
