import React, { useState } from 'react'
import Plus from '../components/tree/Plus'
import Item from '../components/tree/Item'
import { TreeState } from '../types/tree'

const Index = () => {
  const [leftItem, setLeftItem] = useState<TreeState>(0);
  const [centerItem, setCenterItem] = useState<TreeState>(0);
  const [rightItem, setRightItem] = useState<TreeState>(0);

  function changeItemState(state: TreeState, setState: React.Dispatch<React.SetStateAction<TreeState>>) {
    const newState = (state + 1) % Object.keys(TreeState).filter(key => isNaN(Number(key))).length;
    setState(newState);
    console.log("state更新")
  }

  return (
    <div>
      <div className='w-screen h-[80vh] flex items-center justify-center'>
        <div className='flex items-center justify-between '>
          <button onClick={()=>changeItemState(leftItem,setLeftItem)}>
            <Item itemState={leftItem} setItemState={setLeftItem} />
          </button>
          <button onClick={()=>changeItemState(centerItem,setCenterItem)}>
            <Item itemState={centerItem} setItemState={setCenterItem} />
          </button>
          <button onClick={()=>changeItemState(rightItem,setRightItem)}>
            <Item itemState={rightItem} setItemState={setRightItem} />
          </button>
        </div>
      </div>

      <div className='w-screen h-[20vh] bg-slate-700'>
        メニュー
      </div>
    </div>
    
  )
}

export default Index