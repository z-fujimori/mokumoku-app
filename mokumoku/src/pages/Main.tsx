import React, { useState } from 'react'
import { PlaseWithTask } from '../types/task'
import MenuIcon from '../components/index/MenuIcon';
import AuthModal from '../components/index/AuthModal';
import { FiUser } from "react-icons/fi"
import { TbBook } from "react-icons/tb";
import Index from './Index';
import { MainPageState } from '../types';
import { SiGumtree } from "react-icons/si";
import Archive from './Archive';

const Main = (props:{
    bordInfo: PlaseWithTask[],
    setChangeBordInfo: React.Dispatch<React.SetStateAction<boolean>>,
    setIsUpdateViewState: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [authModalState, setAuthModalState] = useState(0);
    const [mainPageState, setMainPageState] = useState(0);

    return (
        <div>
            <div className='w-screen h-[80vh] flex flex-col items-center justify-center'>
                {mainPageState == MainPageState.index && <Index bordInfo={props.bordInfo} setChangeBordInfo={props.setChangeBordInfo} setIsUpdateViewState={props.setIsUpdateViewState} /> }
                {mainPageState == MainPageState.archive && <Archive />}
            </div>
            
            {authModalState != 0 ? <AuthModal setAuthModalState={setAuthModalState}  setIsUpdateViewState={props.setIsUpdateViewState} /> : <></>}

            <div className='w-screen h-[20vh] bg-slate-700'>
                <div className='flex items-center justify-center h-full'>
                    <MenuIcon icon={SiGumtree} strokeWidth={0.5} clickIvent={()=>{setMainPageState(MainPageState.index)}} />
                    <MenuIcon icon={TbBook} strokeWidth={2.6} clickIvent={()=>{setMainPageState(MainPageState.archive)}} />
                    <MenuIcon icon={FiUser} strokeWidth={3.0} clickIvent={()=>{setAuthModalState(1); console.log("log")}} />
                    {/* <MenuIcon icon={BiCog} strokeWidth={0.3} setAuthModalState={setAuthModalState} /> */}
                </div>
            </div>
        </div>
    )
}

export default Main