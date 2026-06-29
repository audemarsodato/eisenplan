import { useState } from "react"
import useTasksContext from '../hooks/useTasksContext'
import useToastContext from "../hooks/useToastContext"
import userUserContext from '../hooks/useUserContext'
import { isFull } from '../utilities'

export default function Form() {
        const [ taskInput, setTaskInput ] = useState(null)
        const { tasks, dispatch } = useTasksContext()
        const { showToast } = useToastContext()
        const { user_id } = userUserContext()
        
        // sundin at makinig kay trisha!!!
        // im done with assigning uuid or authentication for users. what is next is deployment tommorow. this is just a reminder, do not reply
        async function handleSubmit(event) {
                event.preventDefault()

                const defaultQuadrant = 2

                if (isFull(defaultQuadrant, tasks)) {
                        showToast('Q2 quadrant is full. Complete or move a task first.')
                        // setTaskInput('')
                        return
                }

                if (!taskInput) {
                        showToast('Enter what you need to finish')
                        return
                }

                try {
                        const task = {title: taskInput}
                        
                        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                        user_id
                                },
                                body: JSON.stringify(task)
                        })

                        const json = await response.json()
                        
                        dispatch({type: 'ADD', payload: json})
                        setTaskInput('')
                }
                catch (error) {
                        console.log(error)
                }
        }

        let tasksSamples = [
                'Finish drafting Chapter 1 by 9:00 AM Monday',
                'Submit internship application before Friday',
                'Review calculus notes by 8:00 PM tonight',
                'Exercise for 30 minutes after work',
                'Prepare presentation slides before 2:00 PM Tuesday',
                'Call the dentist to schedule an appointment today',
                'Refactor task API before deployment',
                "Reply to client emails before lunch",
                "Go for a 30-minute walk after dinner",
                "Book a dental appointment this afternoon",
                "Call Mom before 8:00 PM",
                "Pay electricity bill before Friday"
        ]
        const [ placeholder, setPlaceholder ] = useState(() => {
                return tasksSamples[Math.floor(Math.random() * tasksSamples.length)]
        })

        return (
                <form onSubmit={handleSubmit}>
                        <input type='text' placeholder={placeholder} value={taskInput} onChange={event => setTaskInput(event.target.value)}/>
                        {/* 
                        <p>Write clear, actionable tasks. Start with a verb and include a deadline when possible.</p>
                                Structure of an actionable task is:
                                        Action + Outcome + Deadline
                                e.g. Finish drafting Chapter 1 by 9:00 AM Monday
                                Proper actionable task answers: 
                                        What? → Finish drafting Chapter 1
                                        When? → By 9:00 AM Monday
                        */}
                </form>
        )
}