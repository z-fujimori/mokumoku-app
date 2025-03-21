import React from "react";
import { invoke } from '@tauri-apps/api/core'
import { Button } from "@mui/material";

const LogoutButton = (props:{
    setAuthModalState: React.Dispatch<React.SetStateAction<number>>,
    setIsUpdateViewState: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const handleLogout = async () => {
        await invoke<string>("logout", {})
            .then()
            .catch(err => {console.error("logout失敗", err); return "";});;

        props.setAuthModalState(0);
        props.setIsUpdateViewState(true)
        alert("ログアウトしました！");
    };

    return (
        <Button onClick={handleLogout} variant="contained" color="secondary">
            ログアウト
        </Button>
    );
};

export default LogoutButton;
