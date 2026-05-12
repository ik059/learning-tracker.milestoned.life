export type TopicStatus = 'not_started' | 'in_progress' | 'done'

export interface Topic {
    id: string,
    goal_id: string,
    title: string,
    status: TopicStatus,
    notes: string | null,
    created_at: string
}

export interface Goal {
    id: string,
    user_id: string,
    title: string,
    description?: string,
    deadline?: string,
    topics: Topic[],
    created_at: string,
    updated_at: string
}