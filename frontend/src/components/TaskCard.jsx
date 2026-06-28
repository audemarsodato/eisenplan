import { useDraggable } from '@dnd-kit/react'
import useTasksContext from '../hooks/useTasksContext'
import { useEffect } from 'react'
import userUserContext from '../hooks/useUserContext'

export default function TaskCard({ task, isTopTask, onDelete }) {
        const { dispatch } = useTasksContext()
        const { user_id } = userUserContext()
        const { _id, title, quadrant } = task
        const { ref, listeners, attributes, isDragging, transform } = useDraggable({
                id: _id
        })

        async function markTaskDone() {
                dispatch({type: 'UPDATE', payload: {_id, status: 'done'}})
                try {
                        const updates = {...task, status: 'done'}
                        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${task._id}`, {
                                method: 'PATCH',
                                headers: {
                                        'Content-Type': 'application/json',
                                        user_id
                                },
                                body: JSON.stringify(updates)
                        })
                        // const json = await response.json()
                        // dispatch({type: 'UPDATE', payload: json})
                }
                catch (error) {
                        console.log(error)
                }
        }

        function moveTask(newQuadrant) {
                dispatch({type: 'UPDATE', payload: {_id, quadrant: newQuadrant}})
        }

        return (
                <div 
                        ref={ref} 
                        {...listeners} 
                        {...attributes} 
                        className={`
                                task-card ${!isDragging ? (isTopTask ? 'top-task' : 'lower-tasks') : ''} 
                                ${isDragging ? ' grabbing' : ''}
                        `}
                >
                        <p className='task-text'>{title}</p>
                        <div className='actions'>
                                <span className='material-symbols-outlined button' onClick={markTaskDone}>check</span>
                                <span className='material-symbols-outlined button' onClick={() => onDelete(task)}>delete</span>
                        </div>
                </div>
        )
}