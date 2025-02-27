use std::{collections::BTreeMap, str::FromStr};
// use chrono::{DateTime, NaiveDateTime, Local};
// use futures::TryStreamExt;
use sqlx::{
    sqlite::{SqliteConnectOptions, SqliteJournalMode, SqlitePoolOptions, SqliteSynchronous}, Row, Sqlite, SqlitePool, Transaction 
};

/// このモジュール内の関数の戻り値型
type DbResult<T> = Result<T, Box<dyn std::error::Error>>;

/// SQLiteのコネクションプールを作成して返す
pub(crate) async fn create_sqlite_pool(database_url: &str) -> DbResult<SqlitePool> {
  // コネクションの設定
  let connection_options = SqliteConnectOptions::from_str(database_url)?
    // DBが存在しないなら作成する
    .create_if_missing(true)
    // トランザクション使用時の性能向上のため、WALを使用する
    .journal_mode(SqliteJournalMode::Wal)
    .synchronous(SqliteSynchronous::Normal);

  // 上の設定を使ってコネクションプールを作成する
  let sqlite_pool = SqlitePoolOptions::new()
    .connect_with(connection_options)
    .await?;

  Ok(sqlite_pool)
}
// マイグレーションを行う
pub(crate) async fn migrate_database(pool: &SqlitePool) -> DbResult<()> {
  println!("マイグレーション実行");
  // let pool = SqlitePoolOptions::new().connect("sqlite::memory:").await?;
  sqlx::migrate!("./db").run(pool).await?;
  Ok(())
}
#[cfg(debug_assertions)] // リリースビルドでは無視
pub(crate) async fn show_tables(pool: &SqlitePool) -> DbResult<()> {
  let rows = sqlx::query(
    &format!("SELECT {} FROM times", "*")
  )
  .fetch_all(pool)
  .await?;
  // .expect("failed to get value")

  for row in rows {
    let id: i64 = row.get("id");
    let task_id: i64 = row.get("task_id");
    let start_time: String = row.get("start_time");
    let end_time: String = row.get("end_time");
    let add: i64 = row.get("additions");
    let del: i64 = row.get("deletions");

    println!("id: {}, task_id: {}, start_time: {}, end_time: {}, add: {}, del: {}", id, task_id, start_time, end_time, add, del);
  }

  Ok(())
}
