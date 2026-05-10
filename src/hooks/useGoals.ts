import { useState, useEffect } from 'react'
import type { Goal } from '../types'

const STORAGE_KEY = 'milestoned_goals'

export const useGoals = ()=>{
    const [goals, setGoals] = useState<Goal[]>(()=>{
        try{
            const stored = localStorage.getItem("STORAGE_KEY")
            return stored ? JSON.parse(stored): []
        }
        catch{
            return []
        }   
    })
    useEffect(()=>{
        localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
    },[goals])

    const addGoal = (goal: Goal) =>{
        setGoals(prev => [goal, ...prev])
    }

    const updateGoal = (updateGoal: Goal)=>{
        setGoals(prev => 
            prev.map(g => g.id === updateGoal.id ? updateGoal: g)
        )
    }

    const deleteGoal = (deleteGoal : Goal)=>{
        setGoals(prev => prev.filter(g=> g.id === deleteGoal.id))
    }

    const getGoal = (id: string):Goal | undefined =>{
        return goals.find(g=>g.id === id)
    }

    const getProgress = (goal : Goal): number =>{
        if(goal.topics.length == 0) return 0
        const done = goal.topics.filter(t=> t.status === 'done').length
        return Math.round((done/goal.topics.length))
    }

    return {
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        getGoal,
        getProgress
    }
}