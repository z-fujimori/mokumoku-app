import React from 'react'
import { TreeState } from '../../types/tree'
import Plus from './Plus'
import Seed from './Seed'
import Sprout from './Sprout'
import Tree from './Tree'
import Nut from './Nut'
import Dead from './Dead'
import { PlaseWithTask } from '../../types/task'

const Item = (props:{
    itemNum: number,
    itemsState: PlaseWithTask[],
    treeState: number,
    setCreateTaskModalState: React.Dispatch<React.SetStateAction<number>>,
    setTaskModalState: React.Dispatch<React.SetStateAction<number>>
}) => {

    function clickItem() {
        if (props.treeState == TreeState.none) {
            props.setCreateTaskModalState(props.itemNum)
        } else {
            props.setTaskModalState(props.itemNum)
        }
    }

    return (
        <div>
            {props.itemsState?.[props.itemNum - 1]?.task_id ?
                <div>
                    <h2>{props.itemsState?.[props.itemNum - 1]?.name ?? "データがありません"}</h2>
                </div>
            : <></> }

            <button onClick={()=>{clickItem()}}>
                <div className='p-10 w-56 flex justify-center items-center'>
                    {props.treeState == TreeState.none && <Plus />}
                    {props.treeState == TreeState.seed && <Seed />}
                    {props.treeState == TreeState.sprout && <Sprout />}
                    {props.treeState == TreeState.tree && <Tree />}
                    {props.treeState == TreeState.nut && <Nut />}
                    {props.treeState == TreeState.dead && <Dead />}
                </div>
            </button>

            {props.itemsState?.[props.itemNum - 1]?.task_id ?
                <div>
                    <h2>{props.itemsState?.[props.itemNum - 1]?.consecutive_record ?? "データがありません"}</h2>
                </div>
            : <></> }
        </div>
    )
}

export default Item