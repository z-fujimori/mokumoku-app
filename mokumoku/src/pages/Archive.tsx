// import React from 'react'
import { invoke } from '@tauri-apps/api/core'
import { useState } from 'react';

const Archive = () => {
    const [demoEnv, setDemoEnv] = useState("button");

    async function handleButton() {
        await invoke<any>("demo_env").then((res) => {console.log(res); setDemoEnv(res)}).catch((err) => console.error(err));
    }
    return (
        <div className='h-auto justify-center items-center'>
            <h1 className='text-xl'>開発中...</h1>
            <button onClick={handleButton}>{demoEnv}</button>
        </div>
    )
}

export default Archive