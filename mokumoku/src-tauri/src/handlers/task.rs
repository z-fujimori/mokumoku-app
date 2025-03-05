use std::env;

use tauri::State;
use sqlx::Row;
use reqwest::{self, header::CONTENT_TYPE, Client};
use crate::types::{StoreTask, Token};
use reqwest::tls::Version;

#[tauri::command]
pub async fn add_task(sqlite_pool: State<'_, sqlx::SqlitePool>, name: String, assignment: f64, service: String, interval: i64) -> Result<String, String> {
    println!("{name}, {assignment}, {service}, {interval}");

    let row = sqlx::query("SELECT * FROM user_infos ORDER BY id DESC LIMIT 1")
        .fetch_optional(&*sqlite_pool)
        .await
        .map_err(|e| e.to_string())?;

    let token: String = row
        .map(|row| Token {token: row.get("token"),})
        .map(|token| token.token) // `Option<Token>` を `Option<String>` に変換
        .unwrap_or("".to_string());

    println!("{:?}", token);

    let url = "https://crojyohgwneomqasuuaq.supabase.co/rest/v1/Tasks";
    let secret_key = env::var("VITE_SUPABASE_ANON_KEY").expect("VITE_SUPABASE_ANON_KEY not set in .env");
    let new_task = StoreTask {
        name: name,
        assignment: assignment,
        interval: interval
    };

    // `reqwest` クライアント
    // let client = Client::new();
    let client = Client::builder()
        .max_tls_version(Version::TLS_1_2)
        .danger_accept_invalid_certs(true) // 証明書エラー回避（開発用）
        .build()
        .map_err(|e| format!("Client build error: {:?}", e))?;
    
    // `POST` リクエストを送信
    let response = client
        .post(url)
        .header("apikey", secret_key.clone())
        .header("Authorization", format!("Bearer {}", secret_key.clone()))
        .header("Content-Type", "application/json")
        .json(&new_task)
        .send()
        .await
        .map_err(|e| format!("store_task request error: {:?}", e))?;

    // 結果を出力
    if response.status().is_success() {
        println!("データ送信成功！");
    } else {
        println!("store_task時エラー: {:?}", response.text().await.map_err(|e| e.to_string())?);
    }

    Ok("ok".to_string())
}
