import React from "react";
import { Button } from "@mui/material";
import { supabase } from "../../lib/supabaseClient";

const LogoutButton: React.FC = () => {
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("ログアウトエラー:", error.message);
            return;
        }
        alert("ログアウトしました！");
    };

    return (
        <Button onClick={handleLogout} variant="contained" color="secondary">
            ログアウト
        </Button>
    );
};

export default LogoutButton;
