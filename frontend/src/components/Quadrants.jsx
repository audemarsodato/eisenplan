import { useEffect, useState } from 'react'
import { DragDropProvider, useDroppable } from '@dnd-kit/react'
import TaskCard from  './TaskCard'
import Quadrant from './Quadrant'
import useTasksContext from '../hooks/useTasksContext'
import useToastContext from '../hooks/useToastContext'

import { isFull } from '../utilities'
import userUserContext from '../hooks/useUserContext'

export default function Quadrants({ onDelete }) {
        const { tasks, dispatch } = useTasksContext()
        const { user_id } = userUserContext()
        const { showToast } = useToastContext()
        const [ hover, setHovered ] = useState(0)
        
        let pendingTask = tasks.filter(task => task.status === 'pending')
        const [ isEmpty, setIsEmpty ] = useState(pendingTask.length === 0)
        useEffect(() => {
                setIsEmpty(pendingTask.length === 0)
        }, [tasks])
        
        const displayTasks = (quadrantId) => tasks && 
                tasks.filter(task => task.quadrant === quadrantId && task.status === 'pending')
                .sort((taskA, taskB) => taskA.createdAt - taskB.createdAt)
                .map((task, index) => <TaskCard onDelete={onDelete} key={task._id} task={task} isTopTask={index === 0}/>)
        
        async function moveTask(taskId, targetQuadrant) {
                const task = tasks.find(task => task._id === taskId)
                if (task.quadrant !== targetQuadrant) {
                        if (isFull(targetQuadrant, tasks)) {
                                showToast('Can’t move here — this quadrant already has 3 tasks.')
                                setHovered(0)
                                return
                        }

                        dispatch({type: 'UPDATE', payload: {_id: taskId, quadrant: targetQuadrant}})
                        try {
                                const updates = {...task, quadrant: targetQuadrant}
                                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${task._id}`, {
                                        method: 'PATCH',
                                        headers: {
                                                'Content-Type': 'application/json',
                                                user_id
                                        },
                                        body: JSON.stringify(updates)
                                })
                                // const json = await response.json()

                                // dispatch({type: 'UPDATE', payload: json}) // delays the visual update
                        }
                        catch (error) {
                                console.log(error)
                        }
                }
        }

        return (
                <div className='quadrants'>
                        <DragDropProvider
                                onDragOver={event => {
                                        setHovered(event.operation.target?.id)
                                }}

                                onDragEnd={event => {
                                        if (event.canceled) return

                                        const taskId = event.operation.source.id
                                        const targetQuadrant = event.operation.target?.id
                                        if (!targetQuadrant) return

                                        moveTask(taskId, targetQuadrant)
                                        setHovered(0)
                                }}

                                // TODO:
                                // ondragstart
                                // set quadrant to 0 of the task being drag and if target drop is null just bring it back
                        >
                        
                                <Quadrant id={1} isHovered={hover === 1} className={'q1 quadrant'} isEmpty={isEmpty} >
                                        <p className={`quadrant-label ${isEmpty ? 'hidden': ''}`}>Q1 <br /> Do Now!</p>
                                        <p className={`empty-quadrant-label ${isEmpty ? '': 'hidden'}`}>
                                                Do Now <br /> 
                                                <span>
                                                        Urgent & <br />
                                                        Important
                                                </span>
                                        </p>
                                        <div className="scrollable">
                                                {displayTasks(1)}
                                        </div>
                                </Quadrant>

                                <Quadrant id={2} isHovered={hover === 2} className={'q2 quadrant'} isEmpty={isEmpty} >
                                        <p className={`quadrant-label ${isEmpty ? 'hidden': ''}`}>Q2 <br /> Schedule!</p>
                                        <p className={`empty-quadrant-label ${isEmpty ? '': 'hidden'}`}>
                                                Schedule <br />
                                                <span>
                                                        Important, not <br />
                                                        urgent
                                                </span>
                                        </p>
                                        <div className="scrollable">
                                                {displayTasks(2)}
                                        </div>
                                </Quadrant>

                                <Quadrant id={3} isHovered={hover === 3} className={'q3 quadrant'} isEmpty={isEmpty} >
                                        <p className={`quadrant-label ${isEmpty ? 'hidden': ''}`}>Q3 <br /> Delegate!</p>
                                        <p className={`empty-quadrant-label ${isEmpty ? '': 'hidden'}`}>
                                                Delegate <br /> 
                                                <span>
                                                        Urgent, not <br />
                                                        important
                                                </span>
                                        </p>
                                        <div className="scrollable">
                                                {displayTasks(3)}
                                        </div>
                                </Quadrant>

                                <Quadrant id={4} isHovered={hover === 4} className={'q4 quadrant'} isEmpty={isEmpty} >
                                        <p className={`quadrant-label ${isEmpty ? 'hidden': ''}`}>Q4 <br /> Eliminate!</p>
                                        <p className={`empty-quadrant-label ${isEmpty ? '': 'hidden'}`}>
                                                Eliminate <br /> 
                                                <span>
                                                        not urgent, <br />
                                                        not important
                                                </span>
                                        </p>
                                        <div className="scrollable">
                                                {displayTasks(4)}
                                        </div>
                                </Quadrant>

                        </DragDropProvider>

                        <div className={isEmpty ? 'empty-prompt' : 'empty-prompt hidden'}>
                                <p><strong>Add a task below</strong> <br /> then drag to organize</p>
                        </div>
                </div>
        )
}