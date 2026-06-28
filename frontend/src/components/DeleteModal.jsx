import useTasksContext from '../hooks/useTasksContext'
import userUserContext from '../hooks/useUserContext'

export default function DeleteModal({ taskToDelete, closeModal }) {
        const { dispatch } = useTasksContext()
        const { user_id } = userUserContext()
        
        async function deleteTask() {
                dispatch({type: 'DELETE', payload: taskToDelete})
                try {
                        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${taskToDelete._id}`, {
                                method: 'DELETE',
                                headers: {
                                        user_id
                                }
                        })
                }
                catch (error) {
                        console.log(error)
                }
                closeModal()
        }
        
        return (
                <section onClick={closeModal} className='delete-modal-window'>
                        <section onClick={event => event.stopPropagation()} className="delete-modal-body">
                                <h2 className="delete-modal-title">Delete task?</h2>
                                <br />
                                <p className="modal-message">This task will be permanently deleted. This action cannot be undone.</p>
                                <br />
                                <p className="modal-task">{taskToDelete.title}</p>
                                <br />
                                <div className="modal-buttons">
                                        <button onClick={closeModal} className="cancel-delete-button">Cancel</button>
                                        <button onClick={deleteTask} className="delete-task-button">Delete</button>
                                </div>
                        </section>
                </section>
        )
}