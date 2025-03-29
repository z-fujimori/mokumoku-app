import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Auth from "./pages/Auth";
import { PlaseWithTask, Task } from "./types/task";
import Load from "./pages/Load";
import { ViewState } from "./types";
import { listen } from "@tauri-apps/api/event";
import Main from "./pages/Main";
import Relode from "./pages/Relode";

function App() {
  const [bordInfo, setBordInfo] = useState<PlaseWithTask[]>([]);
  const [taskInfo, setTaskInfo] = useState<Task[]>([]);
  const [changeBordInfo, setChangeBordInfo] = useState(false);
  const [viewState, setViewState] = useState<ViewState>(0);
  const [isUpdateViewState, setIsUpdateViewState] = useState(false);

  // bord infoを取得して画面情報の更新
  useEffect(() => {
    (async () => {
      const bordTasks = await invoke<PlaseWithTask[]>("get_tasks_info", {})
        .catch(err => {
          console.error("useEffect", err);
          // let task = (async () => {await invoke<PlaseWithTask[]>("get_tasks_info", {})});
          return []
        });
      const taskInfo = await invoke<Task[]>("all_task", {})
        .catch(err => {
          console.error("all_task", err);
          return []
        })
      setBordInfo(bordTasks);
      setTaskInfo(taskInfo);
      console.log("task",bordTasks);
      console.log("タsk", taskInfo);
      console.log(bordTasks[0]);
      console.log(bordTasks[0].tree_state_id);
    })();
    setChangeBordInfo(() => false);
  },[changeBordInfo]);

  // ログインしているか。 Index,Auth,Loadを切り替え
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await invoke<boolean>("check_auth");
        // setAuthState(isAuthenticated);
        // console.log(isAuthenticated);
        if (isAuthenticated) {
          setViewState(ViewState.index);
        } else {
          setViewState(ViewState.auth);
        }

      } catch (error) {
        console.error("認証チェックに失敗:", error);
        setViewState(ViewState.auth);
      }
    };

    setIsUpdateViewState(() => false);
    checkAuth();
  }, [isUpdateViewState]);

  // 0時に動く関数をlisten
  useEffect(() => {
    const unlisten = listen("schedule_event", () => {
      console.log("定期関数listen");
      setChangeBordInfo(true);
    });
    return () => {
      unlisten.then((fn) => fn()); // クリーンアップ
    };
  }, []);

  // スリープ復帰検知のカスタムフック
  function useSleepWatcher(callback: () => void, interval = 60 * 1000) {
    const lastTimestamp = useRef(Date.now());
    console.log("スリープ");
  
    useEffect(() => {
      const timer = setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastTimestamp.current;
        console.log("スリープ復帰イベント");
  
        // intervalの1.5倍以上空いたらスリープ復帰とみなす
        if (elapsed > interval * 1.5) {
          console.log("💤 スリープ復帰を検知！");
          callback(); // 再発火したいイベント
        }
  
        lastTimestamp.current = now;
      }, interval);
  
      return () => clearInterval(timer);
    }, [callback, interval]);
  }
  // 実際に動かしてみよー
  useSleepWatcher(() => {
    console.log("復帰後の処理を実行！");
    // タスクを再スケジュールする等
    invoke<string>("check_schedule", {}).then(() => {console.log("check_schedule成功")});
  });

  return (
    <main className="container">
      {viewState === ViewState.load && <Load /> }
      {viewState === ViewState.auth && <Auth setIsUpdateViewState={setIsUpdateViewState} setViewState={setViewState} /> }
      {viewState === ViewState.index && 
        (bordInfo.length == 0 
          ? <Relode setChangeBordInfo={setChangeBordInfo} /> 
          : <Main bordInfo={bordInfo} setChangeBordInfo={setChangeBordInfo} setIsUpdateViewState={setIsUpdateViewState} taskInfo={taskInfo} /> 
        )
      }
    </main>
  );
}

export default App;
