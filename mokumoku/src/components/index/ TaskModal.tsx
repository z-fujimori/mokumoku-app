import React, { useState } from 'react'
import { TreeState } from '../../types/tree'
import { invoke } from '@tauri-apps/api/core'
import { FaTrashAlt } from "react-icons/fa";
import { PlaseWithTask } from '../../types/task'
import TaskIndex from '../task/TaskIndex';
import DeleteConfirm from '../task/DeleteConfirm';

const  TaskModal = (props:{
    modalState: number,
    setModalState: React.Dispatch<React.SetStateAction<number>>,
    itemsState: PlaseWithTask,
    setItemsState: React.Dispatch<React.SetStateAction<TreeState[]>>,
    setChangeBordInfo: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [deleteConfirmState, setDeleteConfirmState] = useState(false);

    const closeComponent = () => {
        props.setModalState(0);
        setDeleteConfirmState(false);
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={closeComponent}>
            <div className="relative bg-white p-6 rounded-lg shadow-lg h-[265px] w-[450px]" onClick={(e)=>{e.stopPropagation();}}>
                {
                    deleteConfirmState ?
                    <DeleteConfirm 
                        bordNumber={props.modalState} 
                        setDeleteConfirmState={setDeleteConfirmState} 
                        setChangeBordInfo={props.setChangeBordInfo} 
                        setModalState={props.setModalState} /> :
                    <TaskIndex 
                        modalState={props.modalState} 
                        setModalState={props.setModalState} 
                        itemsState={props.itemsState} 
                        setItemsState={props.setItemsState} 
                        setChangeBordInfo={props.setChangeBordInfo}
                        setDeleteConfirmState={setDeleteConfirmState} />
                }
            
            </div>
        </div>
    )
}

export default  TaskModal