import React, { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core';
import Plus from '../components/tree/Plus'
import Item from '../components/tree/Item'
import { TreeState } from '../types/tree'
import CreateTaskModal from '../components/index/CreateTaskModal'
import TaskModal from '../components/index/ TaskModal'
import { PlaseWithTask } from '../types/task';
import MenuIcon from '../components/index/MenuIcon';
import AuthModal from '../components/index/AuthModal';

const Index = (props:{
  bordInfo: PlaseWithTask[],
  setChangeBordInfo: React.Dispatch<React.SetStateAction<boolean>>,
  setIsUpdateViewState: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [items, setItems] = useState<TreeState[]>([0,0,0,0]);
  const [createTaskModalState, setCreateTaskModalState] = useState(0);
  const [taskModalState, setTaskModalState] = useState(0);
  const [authModalState, setAuthModalState] = useState(0);
  // const [bordInfo, setBordInfo] = useState<PlaseWithTask[]>([]);
  // const [changeBordInfo, setChangeBordInfo] = useState(false);
  const bordInfo = props.bordInfo;
  const setChangeBordInfo = props.setChangeBordInfo;

  function changeItemState(state: TreeState, setState: React.Dispatch<React.SetStateAction<TreeState>>) {
    const newState = (state + 1) % Object.keys(TreeState).filter(key => isNaN(Number(key))).length;
    setState(newState);
    console.log("state更新");
  }

  async function handleButton() {
    await invoke<any>("get_tasks_info").then((res) => console.log(res)).catch((err) => console.error(err));
  }

  // useEffect(() => {
  //   (async () => {
  //     const tasks = await invoke<PlaseWithTask[]>("get_tasks_info", {})
  //       .catch(err => {
  //         console.error("useEffect", err);
  //         return []
  //       });
  //     setBordInfo(tasks);
  //     console.log(tasks);
  //   })();
  //   setChangeBordInfo(prev => false);
  // },[changeBordInfo])

  return (
    <div>
      <div className='w-screen h-[80vh] flex flex-col items-center justify-center'>

        <div className='h-1/5 '>
          
        </div>

        <div className='h-3/5 flex items-center justify-between'>
          {/* <button onClick={()=>changeItemState(leftItem,setLeftItem)}> */}
            <Item itemNum={1} itemsState={bordInfo} treeState={bordInfo[0].tree_state_id} setItemsState={setItems} setCreateTaskModalState={setCreateTaskModalState} setTaskModalState={setTaskModalState} />
          {/* </button> */}
          {/* <button onClick={()=>changeItemState(centerItem,setCenterItem)}> */}
            <Item itemNum={2} itemsState={bordInfo} treeState={bordInfo[1].tree_state_id} setItemsState={setItems} setCreateTaskModalState={setCreateTaskModalState} setTaskModalState={setTaskModalState} />
          {/* </button> */}
          {/* <button onClick={()=>changeItemState(rightItem,setRightItem)}> */}
            <Item itemNum={3} itemsState={bordInfo} treeState={bordInfo[2].tree_state_id} setItemsState={setItems} setCreateTaskModalState={setCreateTaskModalState} setTaskModalState={setTaskModalState} />
          {/* </button> */}
        </div>

        <div className='h-1/5 '>
          <button onClick={handleButton}>button</button>
        </div>
      </div>

      {createTaskModalState != 0 ? <CreateTaskModal modalState={createTaskModalState} setModalState={setCreateTaskModalState} itemsState={bordInfo} setItemsState={setItems} setChangeBordInfo={setChangeBordInfo} /> : <></>}
      {taskModalState != 0 ? <TaskModal modalState={taskModalState} setModalState={setTaskModalState} itemsState={bordInfo[taskModalState-1]} setItemsState={setItems} setChangeBordInfo={setChangeBordInfo} /> : <></>}
      {authModalState != 0 ? <AuthModal setAuthModalState={setAuthModalState}  setIsUpdateViewState={props.setIsUpdateViewState} /> : <></>}

      <div className='w-screen h-[20vh] bg-slate-700'>
        <div className='flex items-center justify-center h-full'>
          <MenuIcon setAuthModalState={setAuthModalState} />
          <MenuIcon setAuthModalState={setAuthModalState} />
          <MenuIcon setAuthModalState={setAuthModalState} />
        </div>
      </div>
    </div>
    
  )
}

export default Index