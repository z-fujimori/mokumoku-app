import React from 'react'
import { invoke } from '@tauri-apps/api/core'
import { MdDriveFileRenameOutline, MdOutlineCancel } from "react-icons/md";
import { TreeState } from '../../types/tree';
import { useForm } from 'react-hook-form';
import { Add_task, PlaseWithTask } from '../../types/task';

const CreateTaskModal = (props:{
    modalState: number,
    setModalState: React.Dispatch<React.SetStateAction<number>>,
    itemsState: PlaseWithTask[],
    setItemsState: React.Dispatch<React.SetStateAction<TreeState[]>>,
    setChangeBordInfo: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<Add_task>();

    const onSubmit = async (data: Add_task) => {
        setValue("plase", props.modalState);
        console.log(data);
        await invoke<string>("add_task", data).then((res) => console.log(res)).catch((err) => console.error(err));
        props.setChangeBordInfo(true);
        // let newState = props.itemsState;
        // newState[props.modalState] = TreeState.seed;
        // props.setItemsState(newState);
        props.setModalState(0);
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={()=>{props.setModalState(0)}}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-[450px]" onClick={(e)=>{e.stopPropagation();}}>
                {/* <h2 className="text-xl font-bold text-gray-700 mb-4">目標設定</h2> */}

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex items-center justify-between'>
                        <input
                            type="text"
                            {...register("name", { required: "タスク名を入力しよう！" })}
                            placeholder="何をやる？"
                            // onChange={}
                            className="w-5/6 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                        <p className='p-3'></p>
                    </div>
                    <div className='flex items-center justify-between'>
                        <input
                            type="number"
                            {...register("assignment", { required: "ノルマを設定しよう！", valueAsNumber: true })}
                            name="assignment"
                            placeholder="どのくらいやる？"
                            // onChange={}
                            className="w-2/3 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                        <div className="">
                            <select
                            {...register("service", {})}
                            // onChange={handleChange}
                            className="w-full border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                            >
                                <option value="" disabled>単位</option>
                                <option value="h">時間</option>
                                <option value="p">ページ</option>
                                <option value="ｺ">個</option>
                                <option value="-">なし</option>
                            </select>
                        </div>
                    </div>
                    <div className='flex items-center justify-start'>
                        <input
                            {...register("interval", { required: "頻度を設定しよう！", valueAsNumber: true })}
                            name="interval"
                            placeholder="何日ごとやる？(ex.1日)"
                            // onChange={}
                            className="w-2/3 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                        <p className='p-3'>日</p>
                    </div>
                    <div className="flex justify-between">
                        <button 
                        type="button" 
                        onClick={()=>{props.setModalState(0)}}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
                        <MdOutlineCancel className='text-2xl' />
                        </button>
                        <button 
                            type="submit"
                            className="px-10 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                            <MdDriveFileRenameOutline className='text-2xl' />
                        </button>
                    </div>
                    <input className='hidden' type="text" {...register("plase", { valueAsNumber: true })} value={props.modalState} />
                </form>
            </div>
        </div>
    )
}

export default CreateTaskModal