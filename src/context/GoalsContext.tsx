import { createContext, useContext } from 'react'
import { useGoals } from '../hooks/useGoals'
import type { Goal } from '../types'
import type { ReactNode } from 'react'

interface GoalContextType {
    goals : Goal[]
    isLoading: boolean,
    error: string,
    addGoal: (data:{
        title: string,
        description: string,
        deadline: string,
        topics: { title: string}[]
    }) => Promise<Goal>

    updateTopicStatus:(
        goalId: string,
        topicId: string,
        status: 'not_started' | 'in_progress' | 'done'
    ) => Promise<void>

    deleteGoal: (id: string) => Promise<void>
    getGoal: (id : string)=>Goal | undefined
    getProgress:(goal: Goal) => number
    fetchGoals: ()=>Promise<void>
}

const GoalsContext = createContext<GoalContextType | undefined>(undefined)

export const GoalsProvider = ({children}:{children:ReactNode})=>{
    const goalsData = useGoals()

    return(
        <GoalsContext.Provider value={goalsData}>
            {children}
        </GoalsContext.Provider>
    )
}
// eslint-disable-next-line react-refresh/only-export-components
export const useGoalsContext = ()=>{
    const context = useContext(GoalsContext)
    if(!context){
        throw new Error("useGoalsContext must be used inside GoalsProvider")
    }
    return context
}