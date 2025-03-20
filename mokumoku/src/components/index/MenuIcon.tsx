import React from 'react'
import { IconType } from 'react-icons/lib'

const MenuIcon = (props:{
    icon: IconType,
    strokeWidth: number,
    clickIvent: () => void
}) => {

    const { icon: Icon } = props;  // アイコン。 エイリアスをつける

    const clickEvent = () => {
        props.clickIvent();
        console.log("aa")
    }

    return (
        <button className='bg-[#e2d6c4] bg-opacity-30 hover:bg-opacity-20 h-[80px] w-[80px] rounded-lg mx-[5px]' onClick={clickEvent}>
            <Icon strokeWidth={props.strokeWidth} className='h-full w-full p-3 text-slate-700' />
        </button>
    )
}

export default MenuIcon