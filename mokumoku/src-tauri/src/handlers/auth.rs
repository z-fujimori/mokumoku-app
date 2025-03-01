use std::env;

use dotenv::dotenv;
use reqwest::{self, header::CONTENT_TYPE, Client};
use reqwest::tls::Version;
use tauri::{http::response, State};
use crate::types::{User, LoginRequest, LoginResponse};

#[tauri::command]
pub async  fn login(sqlite_pool: State<'_, sqlx::SqlitePool>, email: String, password: String) -> Result<String, String>{
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
        Ok(token.access_token)
}

#[tauri::command]
pub async  fn signup(sqlite_pool: State<'_, sqlx::SqlitePool>, email: String, password: String) -> Result<String, String>{
    println!("ログイン処理");
    println!("{}, {}", email, password);

    dotenv().ok();
    let secret_key = env::var("VITE_SUPABASE_ANON_KEY").expect("VITE_SUPABASE_ANON_KEY not set in .env");
    println!("{secret_key}");

    let client = Client::new();
    let url = "https://crojyohgwneomqasuuaq.supabase.co/auth/v1/signup";
    let response = client
        .get(url)
        .header( CONTENT_TYPE, "application/json")
        .header( "apikey", secret_key)
        .send()
        .await
        .map_err(|e| format!("HTTP request failed: {:?}", e))?;

    println!("{:?}",response);

    Ok("return".to_string())
}
