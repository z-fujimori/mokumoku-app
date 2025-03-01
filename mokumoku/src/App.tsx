import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Auth from "./pages/Auth"
import Index from "./pages/Index";

function App() {
  const [authState, setAuthState] = useState<boolean | null>(null);

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

  return (
    <main className="container">
      {authState ? <Index /> : <Auth />}
    </main>
  );
}

export default App;
