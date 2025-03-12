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
        <div>
            DeleteConfirm
            <div className='flex justify-between items-center'>
                <button onClick={()=>{props.setDeleteConfirmState(false)}}>やめる</button>
                <button onClick={offTaskButton}>消す</button>
            </div>
        </div>
    )
}

export default DeleteConfirm