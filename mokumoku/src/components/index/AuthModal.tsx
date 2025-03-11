import React from 'react'
import LogoutButton from '../auth/LogoutButton';

const AuthModal = (props:{
    setAuthModalState: React.Dispatch<React.SetStateAction<number>>,
    setIsUpdateViewState: React.Dispatch<React.SetStateAction<boolean>>
}) => {

    const closeComponent = () => {
        props.setAuthModalState(0);
        // setDeleteConfirmState(false);
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={closeComponent}>
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-[450px]" onClick={(e)=>{e.stopPropagation();}}>
                <LogoutButton setAuthModalState={props.setAuthModalState} setIsUpdateViewState={props.setIsUpdateViewState} />
            </div>
        </div>
    )
}

export default AuthModal