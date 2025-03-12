import React from 'react'
import { FiUser } from "react-icons/fi"

const MenuIcon = (props:{
    setAuthModalState: React.Dispatch<React.SetStateAction<number>>
}) => {

    const openComponent = () => {
        props.setAuthModalState(1);
        // setDeleteConfirmState(false);
    }

    return (
        <button className='bg-[#e2d6c4] bg-opacity-30 h-[80px] w-[80px] rounded-lg mx-[5px]' onClick={openComponent}>
            <FiUser className='h-full w-full p-3 text-slate-700' />
        </button>
    )
}

export default MenuIcon