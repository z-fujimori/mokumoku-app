import React from 'react'
import { TreeState } from '../../types/tree'

const  TaskModal = (props:{
    modalState: number,
    setModalState: React.Dispatch<React.SetStateAction<number>>
    itemsState: TreeState[],
    setItemsState: React.Dispatch<React.SetStateAction<TreeState[]>>
}) => {

    function taskCompleted() {
        let newState = [...props.itemsState];
        newState[props.modalState] = (props.itemsState[props.modalState] + 1) % Object.keys(TreeState).filter(key => isNaN(Number(key))).length;
        console.log(newState);
        props.setItemsState(newState);
        props.setModalState(0);
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={()=>{props.setModalState(0)}}>
        <div className="bg-white p-6 rounded-lg shadow-lg w-[450px]" onClick={(e)=>{e.stopPropagation();}}>
            {/* <h2 className="text-xl font-bold text-gray-700 mb-4">目標設定</h2> */}

            <button onClick={taskCompleted}>タスク完了</button>
        
        </div>
    </div>
    )
}

export default  TaskModal