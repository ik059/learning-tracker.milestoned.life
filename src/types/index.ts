export type TopicStatus = 'not_started' | 'in_progress' | 'done'

export interface Topic {
    id: string,
    title: string,
    status: TopicStatus,
    notes?: string,
    createdAt: string
}

export interface Goal {
    id: string,
    title: string,
    description?: string,
    deadline?: string,
    topics: Topic[],
    createdAt: string
}