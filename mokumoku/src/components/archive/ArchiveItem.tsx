import React from 'react'
import { Task } from '../../types/task'

const ArchiveItem = (props:{
    task: Task
}) => {
    return (
        <div className='w-3/4 h-32 my-1 border-2 rounded-lg'>
            <div className='h-full flex items-center'>
                <p className='ml-5'>{props.task.name}</p>
            </div>
        </div>
    )
}

export default ArchiveItem