import React from "react";
import SignupForm from "../components/auth/SignupForm";
import LoginForm from "../components/auth/LoginForm";
import LogoutButton from "../components/auth/LogoutButton";
import { invoke } from "@tauri-apps/api/core";

const AuthPage: React.FC = () => {

    async function testButton() {
        await invoke<void>("insert_get", {})
    }
    async function testInsertButton() {
        await invoke<void>("insert", {})
    }
    async function testGetButton() {
        await invoke<void>("get", {})
    }
    async function testGetButton2() {
        await invoke<void>("get2", {})
    }

    return (
        <div>
            <button onClick={() => testButton()}>secure data</button>
            <button onClick={() => testInsertButton()}>insert</button>
            <button onClick={() => testGetButton()}>get</button>
            <button onClick={() => testGetButton2()}>get2</button>
            <SignupForm />
            <LoginForm />
            <LogoutButton />
        </div>
    );
};

export default AuthPage;