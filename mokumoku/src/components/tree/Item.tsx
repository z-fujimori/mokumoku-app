import React from 'react'
import { TreeState } from '../../types/tree'
import Plus from './Plus'
import Seed from './Seed'
import Sprout from './Sprout'
import Tree from './Tree'
import Nut from './Nut'
import Dead from './Dead'

const Item = (props:{
    itemNum: number,
    itemsState: TreeState[],
    setItemsState: React.Dispatch<React.SetStateAction<TreeState[]>>
    setCreateTaskModalState: React.Dispatch<React.SetStateAction<number>>
    setTaskModalState: React.Dispatch<React.SetStateAction<number>>
}) => {

    function clickItem() {
        if (props.itemsState[props.itemNum] == TreeState.none) {
            props.setCreateTaskModalState(props.itemNum)
        } else {
            props.setTaskModalState(props.itemNum)
        }
    }

    return (
        <>
        <button onClick={()=>{clickItem()}}>
            <div className='p-10 w-56 flex justify-center items-center'>
                {props.itemsState[props.itemNum] == TreeState.none && <Plus />}
                {props.itemsState[props.itemNum] == TreeState.seed && <Seed />}
                {props.itemsState[props.itemNum] == TreeState.sprout && <Sprout />}
                {props.itemsState[props.itemNum] == TreeState.tree && <Tree />}
                {props.itemsState[props.itemNum] == TreeState.nut && <Nut />}
                {props.itemsState[props.itemNum] == TreeState.dead && <Dead />}
            </div>
        </button>
        </>
    )
}

export default Item