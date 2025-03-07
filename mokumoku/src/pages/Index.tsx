import React, { useState } from 'react'
import { invoke } from '@tauri-apps/api/core';
import Plus from '../components/tree/Plus'
import Item from '../components/tree/Item'
import { TreeState } from '../types/tree'
import CreateTaskModal from '../components/index/CreateTaskModal'
import TaskModal from '../components/index/ TaskModal'

const Index = () => {
  // const [leftItem, setLeftItem] = useState<TreeState>(0);
  // const [centerItem, setCenterItem] = useState<TreeState>(0);
  // const [rightItem, setRightItem] = useState<TreeState>(0);
  const [items, setItems] = useState<TreeState[]>([0,0,0,0]);
  const [createTaskModalState, setCreateTaskModalState] = useState(0);
  const [taskModalState, setTaskModalState] = useState(0);

  function changeItemState(state: TreeState, setState: React.Dispatch<React.SetStateAction<TreeState>>) {
    const newState = (state + 1) % Object.keys(TreeState).filter(key => isNaN(Number(key))).length;
    setState(newState);
    console.log("state更新")
  }

  async function handleButton() {
    await invoke<any>("get_tasks_info").then((res) => console.log(res)).catch((err) => console.error(err));
  }

  return (
    <div>
      <div className='w-screen h-[80vh] flex flex-col items-center justify-center'>

        <div className='h-1/5 '>
          
        </div>

        <div className='h-3/5 flex items-center justify-between'>
          {/* <button onClick={()=>changeItemState(leftItem,setLeftItem)}> */}
            <Item itemNum={1} itemsState={items} setItemsState={setItems} setCreateTaskModalState={setCreateTaskModalState} setTaskModalState={setTaskModalState} />
          {/* </button> */}
          {/* <button onClick={()=>changeItemState(centerItem,setCenterItem)}> */}
            <Item itemNum={2} itemsState={items} setItemsState={setItems} setCreateTaskModalState={setCreateTaskModalState} setTaskModalState={setTaskModalState} />
          {/* </button> */}
          {/* <button onClick={()=>changeItemState(rightItem,setRightItem)}> */}
            <Item itemNum={3} itemsState={items} setItemsState={setItems} setCreateTaskModalState={setCreateTaskModalState} setTaskModalState={setTaskModalState} />
          {/* </button> */}
        </div>

        <div className='h-1/5 '>
          <button onClick={handleButton}>button</button>
        </div>
      </div>

      {createTaskModalState != 0 ? <CreateTaskModal modalState={createTaskModalState} setModalState={setCreateTaskModalState} itemsState={items} setItemsState={setItems} /> : <></>}
      {taskModalState != 0 ? <TaskModal modalState={taskModalState} setModalState={setTaskModalState} itemsState={items} setItemsState={setItems} /> : <></>}

      <div className='w-screen h-[20vh] bg-slate-700'>
        メニュー
      </div>
    </div>
    
  )
}

export default Index