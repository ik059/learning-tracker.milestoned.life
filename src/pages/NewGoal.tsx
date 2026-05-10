import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import type { Goal, Topic } from '../types'
import { useGoals } from '../hooks/useGoals'

const NewGoal = ()=>{
    const navigate = useNavigate()
    const { addGoal } = useGoals()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState('')
    const [topics, setTopics]=useState<Topic[]>([])
    const [topicInput, setTopicInput]=useState('')
    const [error, setError] = useState('')

    const handleAddTopic = ()=>{
        const trimmed = topicInput.trim()
        if(!trimmed) return

        const newTopic: Topic = {
            id: crypto.randomUUID(),
            title: trimmed,
            status: 'not_started',
            createdAt: new Date().toISOString()
        }
        setTopics(prev=>[...prev, newTopic])

        setTopicInput('')
    }

    const handleRemoveTopic = (id:string)=>{
        setTopics(prev => prev.filter(t=>t.id !==id))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>)=>{
        if(e.key === 'Enter'){
            e.preventDefault()
            handleAddTopic()
        }
    }

    const handleSubmit = (e: React.FormEvent)=>{
        e.preventDefault()
        
        if(!title.trim()){
            setError("Please add a goal title.")
            return
        }
        const newGoal: Goal = {
            id: crypto.randomUUID(),
            title: title.trim(),
            description: description.trim(),
            deadline: deadline || undefined,
            topics,
            createdAt: new Date().toISOString()
        }

        addGoal(newGoal)

        navigate(`/goals/${newGoal.id}`)
    }

    return (
        <div className= "min-h-screen br-gray-50">
            <div className="bg-white border-b border-gray-100 px-6 py-5">
                <div className="max-w-2xl mx-auto flex items-center gap-4">
                    <Link 
                        to='/'
                        className="text-gray-400 hover:text-gray-600 transition-colors">
                            ← Back
                    </Link>
                    <h1 className="text-lg font-semibold text-gray-900">
                        New Learning Goal
                    </h1>
                </div>
            </div>
            <div className="max-w-2xl mx-auto px-6 py-8">
                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Goal Title*
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={e=>{
                                setTitle(e.target.value)
                                setError('')
                            }}
                            placeholder="e.g Learn PLC programming language"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focusLring2 focus:ring-purple-500 text-gray-900"/>
                            {error && (
                                <p className='text-red-500 text-sm mt-2'>{error}</p>
                            )}
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                                <span className="text-gray-400 font-normal ml-1">(optioal)</span>
                            </label>
                            <textarea
                             value={description}
                             onChange={e=>{setDescription(e.target.value)}}
                             placeholder="I will go through the twincat and the write small program and forward step by step"
                             rows={3}
                             className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focusLring-purple-500 resize-none"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deadline
                                <span className="text-gray-400 font-normal ml-1">(optional)</span>
                            </label>
                            <input
                                type="date"
                                value={deadline}
                                onChange={e=>{setDeadline(e.target.value)}}
                                className="w-full ox-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"/>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Topics
                                <span className="text-gray-400 font-normal ml-1">(things to learn inside this goal)</span>
                            </label>
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={topicInput}
                                    onChange={e=>{setTopicInput(e.target.value)}}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                                    placeholder="ex: TwinCat, Timer, Automation"/>
                                <button 
                                    type="button"
                                    onClick={handleAddTopic}
                                    className="bg-purple-100 text-purple-700 px-4 py-3 rounded-xl font-medium hover:bg-purple-200 transition-colors"
                                    >Add</button>
                            </div>
                            {topics.length > 0 ? (
                                <ul className="space-y-2">
                                    {topics.map((topic, index)=>(
                                        <li
                                        key={topic.id}
                                        className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-gray-400 w-5">{index+1}</span>
                                                <span className="text-sm text-gray-700">
                                                    {topic.title}
                                                </span>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={()=> handleRemoveTopic(topic.id)}
                                                className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
                                                >x</button>
                                        </li>
                                    ))}
                                </ul>
                            ):
                            (
                                <p className="text-sm text-gray-400 text-center py-4">
                                    No topics yet- add some above
                                </p>
                            )}
                        </div>
                        <button 
                            type="submit"
                            className="w-full bg-purple-600 text-white py-4 rounded-xl font-medium  hover:bg-purple-700 transition-colors"
                            >Create Goal</button>
                            
                    </div>
                </form>
            </div>
        </div>
    )
}
 export default NewGoal;