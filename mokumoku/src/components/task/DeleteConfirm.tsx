import React from 'react'
import { invoke } from '@tauri-apps/api/core'

const DeleteConfirm = (props:{
    bordNumber: number,
    setDeleteConfirmState: React.Dispatch<React.SetStateAction<boolean>>,
    setChangeBordInfo: React.Dispatch<React.SetStateAction<boolean>>,
    setModalState: React.Dispatch<React.SetStateAction<number>>
}) => {

    const offTaskButton = async () => {
        await invoke<string>("off_task", {bordId: props.bordNumber}).then((res) => console.log(res)).catch((err) => console.error(err));
        props.setChangeBordInfo(true);
        props.setModalState(0);
    }

    return (
        <div className='pt-3'>
            <h3 className="p-10 text-lg font-semibold text-gray-800">このタスクを削除しますか？</h3>
            <div className='flex justify-between items-center px-16'>
                <button
                    className="px-4 py-2 w-24 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition"
                    onClick={()=>{props.setDeleteConfirmState(false)}}>やめる</button>
                <button
                    className="px-4 py-2 w-24 text-white bg-red-500 rounded hover:bg-red-600 transition"
                    onClick={offTaskButton}> 消す </button>
            </div>
        </div>
    )
}

export default DeleteConfirm