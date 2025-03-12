import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Auth from "./pages/Auth"
import Index from "./pages/Index";
import { PlaseWithTask } from "./types/task";
import Load from "./pages/Load";
import { ViewState } from "./types";

function App() {
  const [authState, setAuthState] = useState<boolean | null>(null);
  const [bordInfo, setBordInfo] = useState<PlaseWithTask[]>([]);
  const [changeBordInfo, setChangeBordInfo] = useState(false);
  const [viewState, setViewState] = useState<ViewState>(0);
  const [isUpdateViewState, setIsUpdateViewState] = useState(false);

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

  useEffect(() => {
    (async () => {
      const tasks = await invoke<PlaseWithTask[]>("get_tasks_info", {})
        .catch(err => {
          console.error("useEffect", err);
          // let task = (async () => {await invoke<PlaseWithTask[]>("get_tasks_info", {})});
          return []
        });
      setBordInfo(tasks);
      console.log("task",tasks);
      console.log(tasks[0]);
      console.log(tasks[0].tree_state_id);
    })();
    setChangeBordInfo(prev => false);
  },[changeBordInfo]);

  return (
    <main className="container">
      {viewState === ViewState.load && <Load /> }
      {viewState === ViewState.auth && <Auth setIsUpdateViewState={setIsUpdateViewState} /> }
      {viewState === ViewState.index && <Index bordInfo={bordInfo} setChangeBordInfo={setChangeBordInfo} setIsUpdateViewState={setIsUpdateViewState} /> }
    </main>
  );
}

export default App;
