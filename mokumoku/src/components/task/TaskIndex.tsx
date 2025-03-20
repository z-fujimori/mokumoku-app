import React from 'react'
import { TreeState } from '../../types/tree'
import { invoke } from '@tauri-apps/api/core'
import { FaTrashAlt } from "react-icons/fa"
import { PlaseWithTask, Service } from '../../types/task'
import { useForm } from 'react-hook-form'

const TaskIndex = (props:{
    modalState: number,
    setModalState: React.Dispatch<React.SetStateAction<number>>,
    itemsState: PlaseWithTask,
    setItemsState: React.Dispatch<React.SetStateAction<TreeState[]>>,
    setChangeBordInfo: React.Dispatch<React.SetStateAction<boolean>>,
    setDeleteConfirmState: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const {register, handleSubmit, formState: {errors}, setValue} = useForm<{amount:number}>();

    async function taskCompleted() {
        await invoke<string>("stamp_task", {bordId: props.modalState, treeState: props.itemsState.tree_state_id})
            .then((res) => console.log(res)).catch((err) => console.error(err));
        
        // let newState = [...props.itemsState];
        // newState[props.modalState] = (props.itemsState[props.modalState] + 1) % Object.keys(TreeState).filter(key => isNaN(Number(key))).length;
        // console.log(newState);
        // props.setItemsState(newState);
        props.setChangeBordInfo(true);
        props.setModalState(0);
    }

    async function sendTaskAmount(data: {amount:number}) {
        console.log("task_amount送信: ", data)
        await invoke<string>("stamp_task", {bordId: props.modalState, treeState: props.itemsState.tree_state_id, amount: data.amount})
            .then((res) => console.log(res)).catch((err) => console.error(err));
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

            <div className='my-2'>
                <h2 className="text-2xl font-bold text-gray-800">{props.itemsState.name}</h2>
            </div>

            <div className=''>
                <p className="text-gray-600">
                    <span className='text-gray-500 mr-3'>目標:</span>
                    {props.itemsState.interval}日 で {props.itemsState.assignment}{props.itemsState.service}
                </p>
            </div>

            <form onSubmit={handleSubmit(sendTaskAmount)}>
                <div className='h-[85px] flex mb-1'>
                    <div className='w-2/3 flex flex-col items-end justify-end mr-5'>
                        <input 
                            type="number"
                            step="0.01"
                            placeholder='ex) 0.5 '
                            {...register("amount", {required: "今日の成果を記録しよう！", valueAsNumber: true})}
                            required
                            className="appearance-none border-b border-gray-500 focus:outline-none focus:border-[#e2d6c4] text-5xl text-right pr-3 w-4/6 placeholder:text-3xl placeholder:text-end placeholder:leading-none" />
                    </div>
                    <div className='w-1/3 text-3xl flex flex-col justify-end items-start'>{Service[props.itemsState.service]}</div>
                    {/* <div className='w-1/3 text-3xl bg-sky-200'>{props.itemsState.service}</div> */}
                </div>

                <button
                    type='submit'
                    className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-md font-bold hover:bg-green-600 active:bg-green-700 transition"
                >今日のタスクを登録</button>
            </form>
            
        </>
    )
}

export default TaskIndex