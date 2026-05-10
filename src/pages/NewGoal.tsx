import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import type { Goal, Topic } from '../types'
import { useGoals } from '../hooks/useGoals'

const NewGoal = ()=>{
    const navigate = useNavigate()
    const { addGoal } = useGoals()

    const [title, setTitle ] = useState('')
    const [description, setDescription ] = useState('')

    return <div> New Goal coming soon</div>
}
 export default NewGoal;