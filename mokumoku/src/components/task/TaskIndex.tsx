import React from 'react'
import { TreeState } from '../../types/tree'
import { invoke } from '@tauri-apps/api/core'
import { FaTrashAlt } from "react-icons/fa";
import { PlaseWithTask } from '../../types/task'

const TaskIndex = (props:{
    modalState: number,
    setModalState: React.Dispatch<React.SetStateAction<number>>,
    itemsState: PlaseWithTask,
    setItemsState: React.Dispatch<React.SetStateAction<TreeState[]>>,
    setChangeBordInfo: React.Dispatch<React.SetStateAction<boolean>>,
    setDeleteConfirmState: React.Dispatch<React.SetStateAction<boolean>>
}) => {

    async function taskCompleted() {
        await invoke<string>("grow_tree", {bordId: props.modalState, treeState: props.itemsState.tree_state_id})
            .then((res) => console.log(res)).catch((err) => console.error(err));
        
        // let newState = [...props.itemsState];
        // newState[props.modalState] = (props.itemsState[props.modalState] + 1) % Object.keys(TreeState).filter(key => isNaN(Number(key))).length;
        // console.log(newState);
        // props.setItemsState(newState);
        props.setChangeBordInfo(true);
        props.setModalState(0);
    }

    return (
        <>
            {/* <h2 className="text-xl font-bold text-gray-700 mb-4">目標設定</h2> */}

            <button
                onClick={()=>{props.setDeleteConfirmState(true)}}
                className='absolute top-4 right-5 m-2 p-2 bg-red-500 text-white rounded-md hover:bg-red-600' 
            >
                <FaTrashAlt />
            </button>

            <div>
                <h2 className="text-lg font-bold text-gray-800 mb-2">{props.itemsState.name}</h2>
            </div>
            <div className='my-3'>
                <p className="text-gray-600">
                    {props.itemsState.interval}日 で {props.itemsState.assignment}{props.itemsState.service}
                </p>
            </div>

            <button 
                className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-md font-bold hover:bg-green-600 active:bg-green-700 transition"
                onClick={taskCompleted}
            >目標タスク完了!!</button>
            
        </>
    )
}

export default TaskIndex