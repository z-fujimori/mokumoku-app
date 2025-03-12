// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub(crate) mod handlers;
pub(crate) mod database;
mod types;
use chrono::{Local, Duration as ChronoDuration, Days};
use directories::ProjectDirs;
use tauri::Manager;
use tokio::time::{sleep, Duration as TokioDuration};
use tauri::Emitter;

use crate::database::data;
use crate::handlers::{secure_session, auth, task};
use types::{User, LoginRequest, LoginResponse};

// #[tokio::main]
fn main() -> Result<(), Box<dyn std::error::Error>> {
    // db作成
    use tauri::async_runtime::block_on;
    const DATABASE_FILE: &str = "db.sqlite";
    let app_dir = ProjectDirs::from("com", "dev", "mokumoku")
        .ok_or("プロジェクトディレクトリの取得に失敗しました")?;
    let database_dir = app_dir.data_dir();
    // データベースファイルが存在するかチェックする
    let db_exists = database_dir.exists();
    // 存在しないなら、ファイルを格納するためのディレクトリを作成する
    if !db_exists {
        std::fs::create_dir(&database_dir)?;
    }
    // データベースURLを作成する
    let database_dir_str = dunce::canonicalize(&database_dir)
        .unwrap()
        .to_string_lossy()
        .replace('\\', "/");
    let database_url = format!("sqlite://{}/{}", database_dir_str, DATABASE_FILE); 
    // SQLiteのコネクションプールを作成する
    let sqlite_pool = block_on(data::create_sqlite_pool(&database_url))?;
    //  データベースファイルが存在しなかったなら、マイグレーションSQLを実行する
    if !db_exists {
        block_on(data::migrate_database(&sqlite_pool))?;
        println!("db作成");
    }

    tauri::Builder::default()
        // API コマンドを登録
        .invoke_handler(tauri::generate_handler![
            auth::check_auth,
            auth::login,
            auth::signup,
            auth::logout,
            task::add_task, 
            task::get_tasks_info,
            task::grow_tree,
            task::off_task,
        ])
        // 多分これで関数の引数にsqlite_poolが入る
        .setup(|app| {
            app.manage(sqlite_pool); 
            Ok(())
        })
        // // 定刻0時にイベント発生
        // .setup(|app| {
        //     let app_handle = app.handle().clone();

        //     // ✅ `async_runtime::spawn` を使用
        //     tauri::async_runtime::spawn(async move {
        //         let database_url = "sqlite://my_database.sqlite";
        //         let sqlite_pool = data::create_sqlite_pool(&database_url).await.expect("DB 作成失敗");
        //         data::migrate_database(&sqlite_pool).await.expect("DB マイグレーション失敗");
                
        //         app_handle.manage(sqlite_pool);
        //     });

        //     Ok(())
        // })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
