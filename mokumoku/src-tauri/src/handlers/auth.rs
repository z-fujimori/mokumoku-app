use std::env;

use dotenv::dotenv;
use reqwest::{self, header::CONTENT_TYPE, Client};
use reqwest::tls::Version;
use tauri::{http::response, State};
use crate::types::{User, LoginRequest, LoginResponse};

#[tauri::command]
pub async fn check_auth() -> Result<bool, String> {
    Ok(true)
}

#[tauri::command]
pub async fn login(sqlite_pool: State<'_, sqlx::SqlitePool>, email: &str, password: &str) -> Result<bool, String> {
    dotenv().ok();
    let secret_key = env::var("VITE_SUPABASE_ANON_KEY").expect("VITE_SUPABASE_ANON_KEY not set in .env");
    let client = Client::builder()
        .max_tls_version(Version::TLS_1_2)
        .danger_accept_invalid_certs(true) // 証明書エラー回避（開発用）
        .build()
        .map_err(|e| format!("Client build error: {:?}", e))?;
    let url = "https://crojyohgwneomqasuuaq.supabase.co/auth/v1/token?grant_type=password";
    let response = client
        .post(url)
        .header( CONTENT_TYPE, "application/json")
        .header( "apikey", secret_key)
        .json(&LoginRequest {
            email: email.to_string(),
            password: password.to_string(),
        })
        .send()
        .await
        .map_err(|e| format!("HTTP request error: {:?}", e))?;

    // HTTP レスポンスのステータスをチェック
    let status = response.status();
    let body = response.text().await.map_err(|e| format!("Failed to read response: {:?}", e))?;
    if !status.is_success() {
        return Err(format!("Login failed: HTTP {} - {}", status, body));
    }
    // JSON をパース
    let token: LoginResponse = serde_json::from_str(&body)
        .map_err(|e| format!("Failed to parse JSON: {:?}, body: {}", e, body))?;
    println!("ログイントークン取得成功: {:?}", token.access_token);

    // tokenをlocalに保存
    let mut tx = sqlite_pool.begin().await.map_err(|e| e.to_string())?;
    sqlx::query("INSERT INTO user_infos (token) VALUES (?)")
        .bind(token.access_token)
        .execute(&mut *tx)
        .await
        .map_err(|e| e.to_string())?;
    tx.commit().await.map_err(|e| e.to_string())?;

    // Ok(token.access_token)
    Ok(true)
}

#[tauri::command]
pub async  fn signup(sqlite_pool: State<'_, sqlx::SqlitePool>, email: String, password: String)
-> Result<bool, String>{
    println!("ログイン処理");
    println!("{}, {}", email, password);

    dotenv().ok();
    let secret_key = env::var("VITE_SUPABASE_ANON_KEY").expect("VITE_SUPABASE_ANON_KEY not set in .env");
    println!("{secret_key}");

    let client = Client::builder()
        .max_tls_version(Version::TLS_1_2)
        .danger_accept_invalid_certs(true) // 証明書エラー回避（開発用）
        .build()
        .map_err(|e| format!("Client build error: {:?}", e))?;
    let url = "https://crojyohgwneomqasuuaq.supabase.co/auth/v1/signup";
    let response = client
        .post(url)
        .header( CONTENT_TYPE, "application/json")
        .header( "apikey", secret_key)
        .json(&LoginRequest {
            email: email.to_string(),
            password: password.to_string(),
        })
        .send()
        .await
        .map_err(|e| format!("HTTP request error: {:?}", e))?;

    // HTTP レスポンスのステータスをチェック
    let status = response.status();
    let body = response.text().await.map_err(|e| format!("Failed to read response: {:?}", e))?;

    if !status.is_success() {
        return Err(format!("Login failed: HTTP {} - {}", status, body));
    }

    // JSON をパース
    let token: LoginResponse = serde_json::from_str(&body)
        .map_err(|e| format!("Failed to parse JSON: {:?}, body: {}", e, body))?;
    println!("ログイントークン取得成功: {:?}", token.access_token);

    // tokenをlocalに保存
    let mut tx = sqlite_pool.begin().await.map_err(|e| e.to_string())?;
    sqlx::query("INSERT INTO user_infos (token) VALUES (?)")
        .bind(token.access_token)
        .execute(&mut *tx)
        .await
        .map_err(|e| e.to_string())?;
    tx.commit().await.map_err(|e| e.to_string())?;

    // Ok(token.access_token)
    Ok(true)
}
