import React, { useState } from 'react'
import Plus from '../components/tree/Plus'
import Item from '../components/tree/Item'
import { TreeState } from '../types/tree'
import CreateTaskModal from '../components/index/CreateTaskModal'

const Index = () => {
  // const [leftItem, setLeftItem] = useState<TreeState>(0);
  // const [centerItem, setCenterItem] = useState<TreeState>(0);
  // const [rightItem, setRightItem] = useState<TreeState>(0);
  const [items, setItems] = useState<TreeState[]>([0,0,0,0]);
  const [createTasckModalState, setCreateTasckModalState] = useState(0);

  function changeItemState(state: TreeState, setState: React.Dispatch<React.SetStateAction<TreeState>>) {
    const newState = (state + 1) % Object.keys(TreeState).filter(key => isNaN(Number(key))).length;
    setState(newState);
    console.log("state更新")
  }

  return (
    <div>
      <div className='w-screen h-[80vh] flex flex-col items-center justify-center'>

        <div className='h-1/5 bg-slate-300'>
          a
        </div>

        <div className='h-3/5 flex items-center justify-between'>
          {/* <button onClick={()=>changeItemState(leftItem,setLeftItem)}> */}
            <Item itemNum={1} itemsState={items} setItemsState={setItems} setCreateTasckModalState={setCreateTasckModalState} />
          {/* </button> */}
          {/* <button onClick={()=>changeItemState(centerItem,setCenterItem)}> */}
            <Item itemNum={2} itemsState={items} setItemsState={setItems} setCreateTasckModalState={setCreateTasckModalState} />
          {/* </button> */}
          {/* <button onClick={()=>changeItemState(rightItem,setRightItem)}> */}
            <Item itemNum={3} itemsState={items} setItemsState={setItems} setCreateTasckModalState={setCreateTasckModalState} />
          {/* </button> */}
        </div>

        <div className='h-1/5 bg-slate-300'>
          <button onClick={()=>{setCreateTasckModalState(1)}}>タスク作成</button>
        </div>
      </div>

      {createTasckModalState != 0 ? <CreateTaskModal modalState={createTasckModalState} setModalState={setCreateTasckModalState} itemsState={items} setItemsState={setItems} /> : <></>}

      <div className='w-screen h-[20vh] bg-slate-700'>
        メニュー
      </div>
    </div>
    
  )
}

export default Index