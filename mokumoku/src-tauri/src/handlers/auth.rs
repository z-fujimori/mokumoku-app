use std::env;

use dotenv::dotenv;
use reqwest::{self, header::CONTENT_TYPE, Client};
use reqwest::tls::Version;
use tauri::{http::response, State};
use sqlx::Row;
use serde_json::json;
use crate::types::{LoginRequest, LoginResponse, Token, User};

#[tauri::command]
pub async fn check_auth(sqlite_pool: State<'_, sqlx::SqlitePool>) -> Result<bool, String> {
    let user_exist:Option<bool> = sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM user_infos)")
        .fetch_optional(&*sqlite_pool)
        .await
        .map_err(|e| e.to_string())?;
    // let token = row
    //     .map(|row| Token {token: row.get("access_token"),})
    //     .map(|token| token.token) // `Option<Token>` を `Option<String>` に変換
    //     .unwrap_or(0);
    // println!("{:?}", user_exist.unwrap_or(false));
    let exist = user_exist.unwrap_or(false);
    Ok(exist)
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
    // sqlx::query("UPDATE user_infos SET access_token = ?, refresh_token = ? WHERE id = 1")
    sqlx::query("INSERT INTO user_infos (access_token, refresh_token) VALUES (?, ?)")
        .bind(token.access_token)
        .bind(token.refresh_token)
        .execute(&mut *tx)
        .await
        .map_err(|e| e.to_string())?;
    tx.commit().await.map_err(|e| e.to_string())?;

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
    sqlx::query("INSERT INTO user_infos (access_token, refresh_token) VALUES (?, ?)")
        .bind(token.access_token)
        .bind(token.refresh_token)
        .execute(&mut *tx)
        .await
        .map_err(|e| e.to_string())?;
    tx.commit().await.map_err(|e| e.to_string())?;

    // Ok(token.access_token)
    Ok(true)
}

// #[tauri::command]
pub async fn refresh(sqlite_pool: State<'_, sqlx::SqlitePool>) ->Result<String, String> {
    println!("リフレッシュ関数");
    dotenv().ok();
    let url = env::var("VITE_SUPABASE_URL").expect("VITE_SUPABASE_URL not set in .env");
    let url = url + "/auth/v1/token?grant_type=refresh_token";
    let secret_key = env::var("VITE_SUPABASE_ANON_KEY").expect("VITE_SUPABASE_ANON_KEY not set in .env");

    let row = sqlx::query("SELECT * FROM user_infos ORDER BY id DESC LIMIT 1")
        .fetch_optional(&*sqlite_pool)
        .await
        .map_err(|e| e.to_string())?;
    let refresh_token: String = row
        .map(|row| Token{token: row.get("refresh_token")})
        .map(|token| token.token) // `Option<Token>` を `Option<String>` に変換
        .unwrap_or("".to_string());

    let client = Client::builder()
        .max_tls_version(Version::TLS_1_2)
        .danger_accept_invalid_certs(true) // 証明書エラー回避（開発用）
        .build()
        .map_err(|e| format!("Client build error: {:?}", e))?;
    let response = client
        .post(url)
        .header("apikey", secret_key)
        .header("Content-Type", "application/json")
        .json(&json!({ "refresh_token": refresh_token }))
        .send()
        .await
        .map_err(|e| format!("リフレッシュトークン request error: {:?}", e))?;

    // HTTP レスポンスのステータスをチェック
    let status = response.status();
    let body = response.text().await.map_err(|e| format!("Failed to read response: {:?}", e))?;
    if !status.is_success() {
        return Err(format!("Login failed: HTTP {} - {}", status, body));
    }
    // JSON をパース
    let token: LoginResponse = serde_json::from_str(&body)
        .map_err(|e| format!("Failed to parse JSON: {:?}, body: {}", e, body))?;
    println!("ログイントークン取得成功: {:?}", token.access_token.clone());

    // tokenをlocalに保存
    let mut tx = sqlite_pool.begin().await.map_err(|e| e.to_string())?;
    sqlx::query("UPDATE user_infos SET access_token = ? WHERE id = 1")
        .bind(token.access_token.clone())
        .execute(&mut *tx)
        .await
        .map_err(|e| e.to_string())?;
    tx.commit().await.map_err(|e| e.to_string())?;

    Ok(token.access_token)
}

#[tauri::command]
pub async fn logout(sqlite_pool: State<'_, sqlx::SqlitePool>) ->Result<String, String> {
    let mut tx = sqlite_pool.begin().await.map_err(|e| e.to_string())?;
    // sqlx::query("UPDATE user_infos SET access_token = ?, refresh_token = ? WHERE id = 1")
    sqlx::query("DELETE FROM user_infos")
        .execute(&mut *tx)
        .await
        .map_err(|e| e.to_string())?;
    tx.commit().await.map_err(|e| e.to_string())?;

    Ok("ok".to_string())
}
