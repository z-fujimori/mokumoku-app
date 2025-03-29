use std::{collections::BTreeMap, env};
use chrono::Local;
use dotenv::dotenv;
use tauri::State;
use sqlx::{query, Row};
use reqwest::{self, header::CONTENT_TYPE, Client};
use crate::types::{PlaseWithTask, Position, StoreTask, Task};
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
        tasks.interval AS interval,
        tasks.consecutive_record AS consecutive_record,
        tasks.record_high AS record_high,
        tasks.limit_time AS limit_time
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
        let limit_time: i64 = row.try_get("limit_time").map_err(|e| e.to_string())?;
        let consecutive_record: i64 = row.try_get("consecutive_record").map_err(|e| e.to_string())?;
        let record_high: i64 = row.try_get("record_high").map_err(|e| e.to_string())?;
    
        tasks.insert(plase_id, PlaseWithTask{plase_id, plase, tree_state_id, task_id, name, assignment, service, interval, limit_time, consecutive_record, record_high});
    }

    println!("{:?}",tasks);

    Ok(tasks.into_iter().map(|(_k, v)| v).collect())
}

#[tauri::command]
pub async fn add_task(sqlite_pool: State<'_, sqlx::SqlitePool>,  name: String, assignment: f64, service: String, interval: i64, plase: i64) -> Result<String, String> {
    println!("{name}, {assignment}, {service}, {interval}");

    let token: String = auth::refresh(sqlite_pool.clone()).await.map_err(|e| format!("refreshエラー: {:?}", e))?;
    println!("get token, {}", token);

    let url = "https://crojyohgwneomqasuuaq.supabase.co/rest/v1/tasks";
    // dotenv().ok();
    // let secret_key = env::var("VITE_SUPABASE_ANON_KEY").expect("VITE_SUPABASE_ANON_KEY not set in .env");
    let secret_key = env!("SUPABASE_ANON_KEY");
    let new_task = StoreTask {
        name: name.clone(),
        assignment: assignment.clone(),
        service: service.clone(),
        interval: interval.clone()
    };

    // `reqwest` クライアント
    // let client = Client::new();
    let client = Client::builder()
        // .max_tls_version(Version::TLS_1_2)                             // 本番でコメントアウト
        // .danger_accept_invalid_certs(true) // 証明書エラー回避（開発用）    // 本番でコメントアウト
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
    let local_task = sqlx::query("INSERT INTO tasks (name, assignment, service, interval, limit_time) VALUES (?, ?, ?, ?, ?) RETURNING id")
        .bind(name)
        .bind(assignment)
        .bind(service)
        .bind(interval)
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

pub async fn get_taskid_from_bord(sqlite_pool: State<'_, sqlx::SqlitePool>, bord_id: i64) ->Result<i32, String> {
    let row = sqlx::query("SELECT task_id FROM bords WHERE id = ?")
        .bind(bord_id)
        // .fetch_one(sqlite_pool)
        .fetch_optional(&*sqlite_pool)
        .await
        .map_err(|e| e.to_string())?;
    let task_id: i32 = row.expect("can't get id").try_get("task_id").map_err(|e| e.to_string())?;
    Ok(task_id)
}

#[tauri::command]
pub async fn stamp_task(sqlite_pool: State<'_, sqlx::SqlitePool>, bordId: i64, treeState: i64, amount: f64) ->Result<String, String> {
    println!("今日のタスク量:{} bord_id:{} tree_state:{}", amount, bordId, treeState);
    let now = Local::now(); // 現在のローカル時刻を取得
    let now_date = now.format("%Y-%m-%d %H:%M:%S").to_string(); // フォーマット
    let task_id = get_taskid_from_bord(sqlite_pool.clone(), bordId).await.map_err(|e| format!("stamp_taskでtask_id取得失敗: {:?}", e))?;

    // 既にノルマクリアしているか
    let today = Local::now().date_naive(); // 現在の日付（NaiveDate）
    let formatday = today.format("%Y-%m-%d").to_string(); // フォーマット
    let query = "SELECT 
        SUM(s.amount) AS total_amount, t.assignment AS assignment, s.task_id AS task_id, t.consecutive_record AS consecutive_record
        FROM stamps s
        JOIN bords b ON s.task_id = b.task_id
        JOIN tasks t ON s.task_id = t.id
        WHERE b.id = ?
        AND DATE(s.date) = DATE(?)";
    let row = sqlx::query(query)
        .bind(bordId)
        .bind(formatday.clone())
        .fetch_optional(&*sqlite_pool)
        .await
        .map_err(|e| e.to_string())?;
    let past_amount_data = row.map(|r| {
            (
                r.try_get::<f64, _>("total_amount").unwrap_or(0.0), 
                r.try_get::<f64, _>("assignment").unwrap_or(0.0),
                r.try_get::<i64, _>("task_id").unwrap_or(0),
                r.try_get::<i64, _>("consecutive_record").unwrap_or(0)
            )
        }).unwrap_or_else(|| (0.0, 0.0, 0, 0));
    let already_task_clear = if past_amount_data.0 == 0.0 && past_amount_data.1 == 0.0 {
            false
        } else {
            past_amount_data.0 >= past_amount_data.1
        };
    println!("{} total:{} assi:{}", already_task_clear, past_amount_data.0, past_amount_data.1);

    // タスク登録
    let mut tx = sqlite_pool.begin().await.map_err(|e| e.to_string())?;
    sqlx::query("INSERT INTO stamps (amount, date, task_id) VALUES (?, ?, ?)")
        .bind(amount)
        .bind(now_date)
        .bind(task_id)
        .execute(&mut *tx)
        .await
        .map_err(|e| e.to_string())?;
    tx.commit().await.map_err(|e| e.to_string())?;

    if !already_task_clear {
        // ノルマクリアしたか
        let row = sqlx::query(query)
            .bind(bordId)
            .bind(formatday)
            .fetch_optional(&*sqlite_pool)
            .await
            .map_err(|e| e.to_string())?;
        let amount_data = row.map(|r| {
                (
                    r.try_get::<f64, _>("total_amount").unwrap_or(0.0), 
                    r.try_get::<f64, _>("assignment").unwrap_or(0.0),
                    r.try_get::<i64, _>("task_id").unwrap_or(0),
                    r.try_get::<i64, _>("consecutive_record").unwrap_or(0)
                )
            }).unwrap_or_else(|| (0.0, 0.0, 0, 0));
        println!("これ {} {}", amount_data.0, amount_data.1);
    
        if amount_data.0 >= amount_data.1 {
            let _ = grow_tree(sqlite_pool, bordId, treeState, amount_data.2, amount_data.3).await.map_err(|e| format!("store_task request error: {:?}", e))?;
        }
    }

    Ok("ok".to_string())
}

#[tauri::command]
pub async fn grow_tree(sqlite_pool: State<'_, sqlx::SqlitePool>, bordId: i64, treeState: i64, taskId: i64, consecutive_record: i64) ->Result<String, String> {
    let mut tx = sqlite_pool.begin().await.map_err(|e| e.to_string())?;    
    sqlx::query("UPDATE bords SET tree_state_id = ? WHERE id = ?")
        .bind((treeState+1)%5 + (treeState+1)/5)
        .bind(bordId)
        .execute(&mut *tx)
        .await
        .map_err(|e| e.to_string())?;
    let a = sqlx::query("UPDATE tasks SET consecutive_record = ? WHERE id = ?")
        .bind(consecutive_record + 1)
        .bind(taskId)
        .execute(&mut *tx)
        .await
        .map_err(|e| e.to_string())?;
    tx.commit().await.map_err(|e| e.to_string())?;

    println!("aa {:?},, {} id:{}", a, consecutive_record+1, taskId);
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

#[tauri::command]
pub async fn all_task(sqlite_pool: State<'_, sqlx::SqlitePool>) -> Result<Vec<Task>, String> {
    let query = "SELECT * FROM tasks";
    let mut rows = sqlx::query(&query)
        .fetch(&*sqlite_pool);
        // .map_err(|e| e.to_string())?;

    let mut tasks = BTreeMap::new();
    while let Some(row) = rows.try_next().await.map_err(|e| e.to_string())? {
        let id: i32 = row.try_get("id").map_err(|e| e.to_string())?;
        let name: String = row.try_get("name").map_err(|e| e.to_string())?;
        let assignment: f64 = row.try_get("assignment").map_err(|e| e.to_string())?;
        let service: String = row.try_get("service").map_err(|e| e.to_string())?;
        let interval: i64 = row.try_get("interval").map_err(|e| e.to_string())?;
        let limit_time: i64 = row.try_get("limit_time").map_err(|e| e.to_string())?;
        let consecutive_record: i64 = row.try_get("consecutive_record").map_err(|e| e.to_string())?;
        let record_high: i64 = row.try_get("record_high").map_err(|e| e.to_string())?;

        tasks.insert(id, Task{id, name, assignment, service, interval, limit_time, consecutive_record, record_high});
    }

    Ok(tasks.into_iter().map(|(_k, v)| v).collect())
}

#[tauri::command]
pub async fn demo_env() -> Result<String, String> {
    // let secret_key = env::var("VITE_SUPABASE_ANON_KEY").expect("VITE_SUPABASE_ANON_KEY not set in .env");
    let secret_key = env!("SUPABASE_ANON_KEY");

    Ok("OK".to_string())
}

