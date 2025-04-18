// import React from 'react'
import { invoke } from '@tauri-apps/api/core'
import { useState } from 'react';
import { Task } from '../types/task'
import ArchiveItem from '../components/archive/ArchiveItem';

const Archive = (props:{
    taskInfo: Task[],
}) => {
    const [demoEnv, setDemoEnv] = useState("button");

    async function handleButton() {
        await invoke<any>("demo_env").then((res) => {console.log(res); setDemoEnv(res)}).catch((err) => console.error(err));
    }

    return (
        <div className='h-auto w-full justify-center items-center'>
            <h1 className='text-xl'>開発中...</h1>
            <button onClick={handleButton}>{demoEnv}</button>
            <div className='w-full h-72 overflow-y-auto'>
                <div className='flex flex-col items-center justify-center'>
                    {props.taskInfo.map((task) => (
                        <ArchiveItem task={task} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Archive