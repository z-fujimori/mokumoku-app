import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Auth from "./pages/Auth"
import Index from "./pages/Index";
import { PlaseWithTask } from "./types/task";

function App() {
  const [authState, setAuthState] = useState<boolean | null>(null);
  const [bordInfo, setBordInfo] = useState<PlaseWithTask[]>([]);
  const [changeBordInfo, setChangeBordInfo] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await invoke<boolean>("check_auth");
        setAuthState(isAuthenticated);
        console.log(isAuthenticated);
      } catch (error) {
        console.error("認証チェックに失敗:", error);
        setAuthState(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    (async () => {
      const tasks = await invoke<PlaseWithTask[]>("get_tasks_info", {})
        .catch(err => {
          console.error("useEffect", err);
          return []
        });
      setBordInfo(tasks);
      console.log(tasks);
      console.log(tasks[0]);
      console.log(tasks[0].tree_state_id);
    })();
    setChangeBordInfo(prev => false);
  },[changeBordInfo]);

  return (
    <main className="container">
      {authState ? <Index bordInfo={bordInfo} setChangeBordInfo={setChangeBordInfo} /> : <Auth />}
    </main>
  );
}

export default App;
