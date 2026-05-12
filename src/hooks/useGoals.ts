/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from 'react'

import api from '../utils/api'

import type { Goal, Topic} from '../types'

export const useGoals = ()=>{
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(()=>{
    void fetchGoals()
  },[])

  const fetchGoals = async ()=>{
    try{
      setIsLoading(true)
      const response = await api.get('/goals')
      setGoals(response.data)
    }
    catch(err){
      setError("Failed to fetch goals!")
      console.error(err)
    }
    finally{
      setIsLoading(false)
    }
  }

  const addGoal = async (data :{
    title: string,
    description: string,
    deadline: string,
    topics: { title: string}[]
  })=>{
    const response = await api.post('/goals', data)
    const newGoal = response.data
    setGoals(prev=>[newGoal, ...prev])
    return newGoal;
  }

  const updateTopicStatus = async (
    goalId: string,
    topicId: string,
    status: 'not_started' | 'in_progress' | 'done'
  ) =>{
    console.log(topicId,"A")
    console.log(goalId,"B")
    const response = await api.patch<Topic>(`/goals/${goalId}/topics/${topicId}`, {status})
    console.log("A",response)
    const updatedTopic = response.data

    setGoals(prev => 
      prev.map(g=>
        g.id === goalId ?
        {
          ...g,
          topics: g.topics.map(t =>
            t.id === topicId ? updatedTopic : t
          ),
        }
        : g
      )
    )
  }

  const deleteGoal = async (id: string)=>{
    await api.delete(`/goals/${id}`)
    setGoals(prev => prev.filter(g => g.id === id))
  }

  const getGoal = (id: string) : Goal | undefined =>{
    return goals.find(g=>g.id === id)
  }

  const getProgress = (goal: Goal): number =>{
    if(goal.topics.length === 0) return 0
    const done = goal.topics.filter(t=>t.status === 'done').length
    return Math.round((done/goal.topics.length)*100)
  }

  return {
    goals,
    isLoading,
    error,
    addGoal,
    updateTopicStatus,
    deleteGoal,
    getGoal,
    getProgress,
    fetchGoals
  }
}