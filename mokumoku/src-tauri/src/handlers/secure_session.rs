use iota_stronghold::{Store, Location, ClientVault, Stronghold};
use std::path::PathBuf;

// #[tauri::command]
// pub fn strong() {
//     let hold = Stronghold::reset(self);

// }

// #[tauri::command]
// pub fn insert() {
//     println!("helo w");
//     let store = Store::default();
//     let key = "some key1";
//     let value = "data";
//     // let key = b"some key1".to_vec();
//     // let data = b"data".to_vec();
//     let key_bytes = key.as_bytes().to_vec();
//     let value_bytes = value.as_bytes().to_vec();

//     match store.insert(key_bytes.clone(), value_bytes, None) {
//         Ok(_) => println!("データを保存しました: {:?}", key),
//         Err(e) => println!("データの保存エラー: {:?}", e),
//     }
// }

// #[tauri::command]
// pub fn get() {
//     let store = Store::default();
//     let key = b"some key1".to_vec();
//     let get_data = store.get(&key).unwrap().expect("msg");
//     println!("{:?}",get_data);
// }


// #[tauri::command]
// pub fn get2() {
//     let store = Store::default();
//     let key = b"key2".to_vec();
//     let get_data = store.get(&key).unwrap().expect("msg");
//     println!("{:?}",get_data);
// }

// #[tauri::command]
// pub fn insert_get() {
//     println!("hello");
//     // let store = Store::default();
//     let store = Stronghold::store(&self).
//     let key = b"key2".to_vec();
//     let data = b"some  data".to_vec();
//     assert!(store.insert(key.clone(), data, None).is_ok());
//     assert!(store.get(&key).is_ok());
//     assert!(store.get(&key).unwrap().is_some());
//     let get_data = store.get(&key).unwrap().expect("");
//     println!("{:?}",get_data);
// }
