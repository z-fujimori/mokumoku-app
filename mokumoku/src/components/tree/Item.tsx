import React from 'react'
import { TreeState } from '../../types/tree'
import Plus from './Plus'
import Seed from './Seed'
import Sprout from './Sprout'
import Tree from './Tree'
import Nut from './Nut'

const Item = (props:{
    itemState: TreeState,
    setItemState: React.Dispatch<React.SetStateAction<TreeState>>
}) => {
    return (
        <div className='p-10 w-56 flex justify-center items-center'>
            {props.itemState == TreeState.none && <Plus />}
            {props.itemState == TreeState.seed && <Seed />}
            {props.itemState == TreeState.sprout && <Sprout />}
            {props.itemState == TreeState.tree && <Tree />}
            {props.itemState == TreeState.nut && <Nut />}
        </div>
    )
}

export default Item