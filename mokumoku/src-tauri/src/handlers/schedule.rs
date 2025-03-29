use chrono::{Duration, Local};
use tauri::State;
use sqlx::Row;
use super::task::get_tasks_info;

#[tauri::command]
pub async fn schedule_event_dayend(sqlite_pool: State<'_, sqlx::SqlitePool>) -> Result<String, String> {
    println!("schedule_event_dayend");
    
    let today = Local::now().date_naive(); // 現在の日付（NaiveDate）
    let yesterday = today - Duration::days(1); // 1日前の日付を計算
    let formatday = yesterday.format("%Y-%m-%d").to_string(); // フォーマット
    println!("現在の日付  {}", today);
    println!("{}",formatday);

    // 日時を更新
    let mut tx = sqlite_pool.begin().await.map_err(|e| e.to_string())?;
    sqlx::query("UPDATE user_infos SET last_sckedule_ivent = ? WHERE id = 1")
        .bind(formatday)
        .execute(&mut *tx)
        .await
        .map_err(|e| e.to_string())?;
    tx.commit().await.map_err(|e| e.to_string())?;

    let data = get_tasks_info(sqlite_pool.clone()).await.map_err(|e| format!("errorr!: {:?}", e))?;
    println!("{:?}",data);
    for task in data {
        if task.task_id == 0 {continue;} // taskが設定されていなかったらスキップ
        let amount = yesterday_total_stamp(sqlite_pool.clone(), task.task_id).await.map_err(|e| format!("昨日のamount取得時: {:?}", e))?;
        // 実っている木をリセット else 木を枯れさせる
        if task.limit_time <= 1 {
            println!("定期イベント");
            if amount >= task.assignment && task.tree_state_id == 4 {
                println!("{}: 実を回収", task.plase);
                let mut tx = sqlite_pool.begin().await.map_err(|e| e.to_string())?;
                sqlx::query("UPDATE bords SET tree_state_id = ? WHERE id = ?")
                    .bind(3)
                    .bind(task.plase_id)
                    .execute(&mut *tx)
                    .await
                    .map_err(|e| e.to_string())?;
                sqlx::query("UPDATE tasks SET consecutive_record = ?, limit_time = ? WHERE id = ?")
                    .bind(task.consecutive_record + 1)
                    .bind(task.interval)
                    .bind(task.task_id)
                    .execute(&mut *tx)
                    .await
                    .map_err(|e| e.to_string())?;
                tx.commit().await.map_err(|e| e.to_string())?;
            } else if amount < task.assignment {
                println!("{}: 枯れ木 {}", task.plase, amount);
                let mut high_amount: i64 = task.record_high;
                if task.consecutive_record > task.record_high {high_amount = task.consecutive_record;}
                let mut tx = sqlite_pool.begin().await.map_err(|e| e.to_string())?;
                sqlx::query("UPDATE bords SET tree_state_id = ? WHERE id = ?")
                    .bind(5)
                    .bind(task.plase_id)
                    .execute(&mut *tx)
                    .await
                    .map_err(|e| e.to_string())?;
                sqlx::query("UPDATE tasks SET consecutive_record = ?, record_high = ?, limit_time = ? WHERE id = ?")
                    .bind(0)
                    .bind(high_amount)
                    .bind(task.interval)
                    .bind(task.task_id)
                    .execute(&mut *tx)
                    .await
                    .map_err(|e| e.to_string())?;
                tx.commit().await.map_err(|e| e.to_string())?;
            }
        } else {
            println!("{}: 期限更新", task.plase);
            let mut tx = sqlite_pool.begin().await.map_err(|e| e.to_string())?;
            sqlx::query("UPDATE tasks SET limit_time = ? WHERE id = ?")
                .bind(task.limit_time - 1)
                .bind(task.task_id)
                .execute(&mut *tx)
                .await
                .map_err(|e| e.to_string())?;
            tx.commit().await.map_err(|e| e.to_string())?;
        }
    }

    Ok("ok".to_string())
}

pub async fn yesterday_total_stamp(sqlite_pool: State<'_, sqlx::SqlitePool>, task_id: i32) -> Result<f64, String> {
    let today = Local::now().date_naive(); // 現在の日付（NaiveDate）
    let yesterday = today - Duration::days(1); // 1日前の日付を計算
    let formatday = yesterday.format("%Y-%m-%d").to_string(); // フォーマット
    // let formatday = yesterday.format("%Y-%m-%d").to_string(); // フォーマット
    // let mut tx = sqlite_pool.begin().await.map_err(|e| e.to_string())?;
    let row = sqlx::query("SELECT SUM(amount) AS total_amount FROM stamps WHERE task_id = ? AND DATE(date) = DATE(?)")
        .bind(task_id)
        .bind(formatday)
        .fetch_optional(&*sqlite_pool)
        .await
        .map_err(|e| e.to_string())?;
    // tx.commit().await.map_err(|e| e.to_string())?;
    // let task_id: i32 = row.expect("sum_amount取得失敗").try_get("total_amount").map_err(|e| e.to_string())?;
    let amount: f64 = row.map(|r| r.try_get::<f64, _>("total_amount").unwrap_or(0.0)).unwrap_or(0.0);

    Ok(amount)
}

#[tauri::command]
pub async fn check_schedule(sqlite_pool: State<'_, sqlx::SqlitePool>) -> Result<String, String> {

    let today = Local::now().date_naive();
    let yesterday = today - Duration::days(1); // 1日前の日付を計算
    let formatday = yesterday.format("%Y-%m-%d").to_string(); // フォーマット

    let row = sqlx::query("SELECT * FROM user_infos ORDER BY id DESC LIMIT 1")
        .fetch_optional(&*sqlite_pool)
        .await
        .map_err(|e| e.to_string())?;
    let last_schedule_date: String = row
        .map(|row| row.get("last_sckedule_ivent"))
        // .map(|token| token.token) // `Option<Token>` を `Option<String>` に変換
        .unwrap_or("".to_string());

    println!("{} {}", formatday, last_schedule_date);
    if formatday != last_schedule_date {
        let _ = schedule_event_dayend(sqlite_pool).await.map_err(|e| format!("error: {:?}", e));
    }

    Ok("ok".to_string())
}

// async fn reset_tree(sqlite_pool: State<'_, sqlx::SqlitePool>) -> Result<String, String> {

//     let data = get_tasks_info(sqlite_pool).await.map_err(|e| format!("errorr!: {:?}", e))?;
//     println!("{:?}",data);

//     Ok("ok".to_string())
// }

// fn die_tree(sqlite_pool: State<'_, sqlx::SqlitePool>) -> Result<String, String> {
//     Ok("ok".to_string())
// }

// pub async fn total_stamp(sqlite_pool: State<'_, sqlx::SqlitePool>, task_id: i32, date: String) -> Result<f64, String> {
//     let row = sqlx::query("SELECT SUM(amount) AS total_amount FROM stamps WHERE task_id = ? AND DATE(date) = DATE(?)")
//         .bind(task_id)
//         .bind(date)
//         .fetch_optional(&*sqlite_pool)
//         .await
//         .map_err(|e| e.to_string())?;

//     let amount: f64 = row.map(|r| r.try_get::<f64, _>("total_amount").unwrap_or(0.0)).unwrap_or(0.0);

//     Ok(amount)
// }
