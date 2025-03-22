import React, { useState } from 'react'
import Item from '../components/tree/Item'
import CreateTaskModal from '../components/index/CreateTaskModal'
import TaskModal from '../components/index/ TaskModal'
import { PlaseWithTask } from '../types/task';

const Index = (props:{
  bordInfo: PlaseWithTask[],
  setChangeBordInfo: React.Dispatch<React.SetStateAction<boolean>>,
  setIsUpdateViewState: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [createTaskModalState, setCreateTaskModalState] = useState(0);
  const [taskModalState, setTaskModalState] = useState(0);
  const bordInfo = props.bordInfo;
  const setChangeBordInfo = props.setChangeBordInfo;

  // function changeItemState(state: TreeState, setState: React.Dispatch<React.SetStateAction<TreeState>>) {
  //   const newState = (state + 1) % Object.keys(TreeState).filter(key => isNaN(Number(key))).length;
  //   setState(newState);
  //   console.log("state更新");
  // }

  console.log("ボードインフォ: ", props.bordInfo);

  return (
    <div>
      {/* <div className='w-screen h-[80vh] flex flex-col items-center justify-center'> */}

        <div className='h-1/5 '>
          
        </div>

        <div className='h-3/5 flex items-center justify-between'>
          {/* <button onClick={()=>changeItemState(leftItem,setLeftItem)}> */}
            <Item itemNum={1} itemsState={bordInfo} treeState={bordInfo[0].tree_state_id} setCreateTaskModalState={setCreateTaskModalState} setTaskModalState={setTaskModalState} />
          {/* </button> */}
          {/* <button onClick={()=>changeItemState(centerItem,setCenterItem)}> */}
            <Item itemNum={2} itemsState={bordInfo} treeState={bordInfo[1].tree_state_id} setCreateTaskModalState={setCreateTaskModalState} setTaskModalState={setTaskModalState} />
          {/* </button> */}
          {/* <button onClick={()=>changeItemState(rightItem,setRightItem)}> */}
            <Item itemNum={3} itemsState={bordInfo} treeState={bordInfo[2].tree_state_id} setCreateTaskModalState={setCreateTaskModalState} setTaskModalState={setTaskModalState} />
          {/* </button> */}
        </div>

        <div className='h-1/5 '>
          
        </div>
        
        {createTaskModalState != 0 ? <CreateTaskModal modalState={createTaskModalState} setModalState={setCreateTaskModalState} itemsState={bordInfo} setChangeBordInfo={setChangeBordInfo} /> : <></>}
        {taskModalState != 0 ? <TaskModal modalState={taskModalState} setModalState={setTaskModalState} itemsState={bordInfo[taskModalState-1]} setChangeBordInfo={setChangeBordInfo} /> : <></>}


      {/* </div> */}
      
      
      {/* {authModalState != 0 ? <AuthModal setAuthModalState={setAuthModalState}  setIsUpdateViewState={props.setIsUpdateViewState} /> : <></>}

      <div className='w-screen h-[20vh] bg-slate-700'>
        <div className='flex items-center justify-center h-full'>
          <MenuIcon icon={FiUser} setAuthModalState={setAuthModalState} />
          <MenuIcon icon={TbBook} setAuthModalState={setAuthModalState} />
          <MenuIcon icon={BiCog} setAuthModalState={setAuthModalState} />
        </div>
      </div> */}

    </div>
    
  )
}

export default Index