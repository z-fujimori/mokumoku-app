import React from 'react'

const Relode = (props:{
    setChangeBordInfo: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    return (
        <div>
            <button onClick={()=>(props.setChangeBordInfo(true))}>再読み込み</button>
        </div>
    )
}

export default Relode