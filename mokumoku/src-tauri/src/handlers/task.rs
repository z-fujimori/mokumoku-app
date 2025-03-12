use std::{collections::BTreeMap, env};

use dotenv::dotenv;
use tauri::State;
use sqlx::Row;
use reqwest::{self, header::CONTENT_TYPE, Client};
use crate::types::{PlaseWithTask, Position, StoreTask, Token};
use reqwest::tls::Version;
use futures::TryStreamExt;

use super::auth;

#[tauri::command]
pub async fn get_tasks_info(sqlite_pool: State<'_, sqlx::SqlitePool>) ->Result<Vec<PlaseWithTask>, String> {
    let query = "SELECT 
        bords.id AS plase_id, 
        bords.plase,
        bords.tree_state_id,
        tasks.id AS task_id,
        tasks.name AS name,
        tasks.assignment AS assignment,
        tasks.service AS service,
        tasks.interval AS interval 
        FROM bords LEFT JOIN tasks ON bords.task_id = tasks.id";
    let mut rows = sqlx::query(&query)
        .fetch(&*sqlite_pool);
        // .map_err(|e| e.to_string())?;

    let mut tasks = BTreeMap::new();
    while let Some(row) = rows.try_next().await.map_err(|e| e.to_string())? {
        let plase_id: i64 = row.try_get("plase_id").map_err(|e| e.to_string())?;
        let plase: String = row.try_get("plase").map_err(|e| e.to_string())?;
        let tree_state_id: i32 = row.try_get("tree_state_id").map_err(|e| e.to_string())?;
        let task_id: i32 = row.try_get("task_id").map_err(|e| e.to_string())?;
        let name: String = row.try_get("name").map_err(|e| e.to_string())?;
        let assignment: f64 = row.try_get("assignment").map_err(|e| e.to_string())?;
        let service: String = row.try_get("service").map_err(|e| e.to_string())?;
        let interval: i64 = row.try_get("interval").map_err(|e| e.to_string())?;
    
        tasks.insert(plase_id, PlaseWithTask{plase_id, plase, tree_state_id, task_id, name, assignment, service, interval});
    }

    Ok(tasks.into_iter().map(|(_k, v)| v).collect())
}

#[tauri::command]
pub async fn add_task(sqlite_pool: State<'_, sqlx::SqlitePool>,  name: String, assignment: f64, service: String, interval: i64, plase: i64) -> Result<String, String> {
    println!("{name}, {assignment}, {service}, {interval}");

    let token: String = auth::refresh(sqlite_pool.clone()).await.map_err(|e| format!("refreshエラー: {:?}", e))?;
    // localDBからaccess_tokenを取得
    // let row = sqlx::query("SELECT * FROM user_infos ORDER BY id DESC LIMIT 1")
    //     .fetch_optional(&*sqlite_pool)
    //     .await
    //     .map_err(|e| e.to_string())?;
    // let token: String = row
    //     .map(|row| Token {token: row.get("access_token"),})
    //     .map(|token| token.token) // `Option<Token>` を `Option<String>` に変換
    //     .unwrap_or("".to_string());
    // println!("{:?}", token);
    println!("get token, {}", token);

    let url = "https://crojyohgwneomqasuuaq.supabase.co/rest/v1/tasks";
    dotenv().ok();
    let secret_key = env::var("VITE_SUPABASE_ANON_KEY").expect("VITE_SUPABASE_ANON_KEY not set in .env");
    let new_task = StoreTask {
        name: name.clone(),
        assignment: assignment.clone(),
        service: service.clone(),
        interval: interval.clone()
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
        .header("Authorization", format!("Bearer {}", token.clone()))
        .header( CONTENT_TYPE, "application/json")
        .json(&new_task)
        .send()
        .await
        .map_err(|e| format!("store_task request error: {:?}", e))?;

    if !response.status().is_success() {
        println!("store_task時エラー: {:?}", response.text().await.map_err(|e| e.to_string())?);
        return Err("try_again".to_string());
    }

    println!("{:?}", response.text().await.map_err(|e| e.to_string())?);

    // localに保存
    let mut tx = sqlite_pool.begin().await.map_err(|e| e.to_string())?;
    let local_task = sqlx::query("INSERT INTO tasks (name, assignment, service, interval) VALUES (?, ?, ?, ?) RETURNING id")
        .bind(name)
        .bind(assignment)
        .bind(service)
        .bind(interval)
        .execute(&mut *tx)
        .await
        .map_err(|e| e.to_string())?;
    sqlx::query("UPDATE bords SET plase = ?, task_id = ?, tree_state_id = ? WHERE id = ?")
        .bind(Position::from_number(plase as i32).to_string())
        .bind(local_task.last_insert_rowid())
        .bind(1)
        .bind(plase)
        .execute(&mut *tx)
        .await
        .map_err(|e| e.to_string())?;
    tx.commit().await.map_err(|e| e.to_string())?;

    Ok("ok".to_string())
}

#[tauri::command]
pub async fn grow_tree(sqlite_pool: State<'_, sqlx::SqlitePool>, bordId: i64, treeState: i64) ->Result<String, String> {
    let mut tx = sqlite_pool.begin().await.map_err(|e| e.to_string())?;
    sqlx::query("UPDATE bords SET tree_state_id = ? WHERE id = ?")
        .bind((treeState+1)%5 + (treeState+1)/5)
        .bind(bordId)
        .execute(&mut *tx)
        .await
        .map_err(|e| e.to_string())?;
    tx.commit().await.map_err(|e| e.to_string())?;

    Ok("ok".to_string())
}

#[tauri::command]
pub async fn off_task(sqlite_pool: State<'_, sqlx::SqlitePool>, bordId: i64) ->Result<String, String> {
    let mut tx = sqlite_pool.begin().await.map_err(|e| e.to_string())?;
    sqlx::query("UPDATE bords SET task_id = NULL, tree_state_id = ? WHERE id = ?")
        .bind(0)
        .bind(bordId)
        .execute(&mut *tx)
        .await
        .map_err(|e| e.to_string())?;
    tx.commit().await.map_err(|e| e.to_string())?;

    Ok("ok".to_string())
}
