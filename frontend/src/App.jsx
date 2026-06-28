import Quadrants from './components/Quadrants'
import Form from './components/Form'
import { useEffect, useState } from 'react'
import useTasksContext from './hooks/useTasksContext'
import userUserContext from './hooks/useUserContext'
import DeleteModal from './components/DeleteModal'

// TODOS:
//      drag reordering for task
//      stack task, make it an array of toasts
//      add animation transition when marking tasks done or deleting tasks
//      q3 and q4 colors may be too bright
//      TRY making drop animation consistent
//      App name? Today? Morning planner?
export default function App() {
        const { dispatch } = useTasksContext()
        const { user_id, dispatch: userDispatch } = userUserContext()

        useEffect(() => {
                const initUser = async () => {
                        let storedUUID = localStorage.getItem('uuid')
                        if (!storedUUID) {
                                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/uuid`)
                                const json = await response.json()
                                localStorage.setItem('uuid', json)
                                storedUUID = json
                        }
                        userDispatch({type: 'SET', payload: storedUUID})
                        
                        getTasks(storedUUID)
                }
                initUser()
        }, [])

        const [ taskToDelete, setTaskToDelete ] = useState(null)
        
        async function getTasks(user_id) {
                try {
                        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
                                headers: {
                                        user_id
                                }
                        })
                        const json = await response.json()
                        dispatch({type: 'SET', payload: json})
                }
                catch(error) {
                        console.log(error)
                }
        }

        return (
                <div className='app'>
                        <Quadrants onDelete={setTaskToDelete} />
                        <Form />
                        {taskToDelete &&
                                <DeleteModal taskToDelete={taskToDelete} closeModal={() => setTaskToDelete(null)}/>
                        }
                </div>
        )
}