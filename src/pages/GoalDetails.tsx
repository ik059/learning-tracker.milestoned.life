import { useParams, useNavigate, Link } from 'react-router-dom'
import type { Topic, TopicStatus } from '../types'
import { useGoalsContext } from '../context/GoalsContext'

const STATUS_CONFIG: Record<TopicStatus, { label: string; color: string; next: TopicStatus }> = {
  not_started: {
    label: 'Not started',
    color: 'bg-gray-100 text-gray-500',
    next: 'in_progress'
  },
  in_progress: {
    label: 'In progress',
    color: 'bg-yellow-100 text-yellow-700',
    next: 'done'
  },
  done: {
    label: 'Done ✓',
    color: 'bg-green-100 text-green-700',
    next: 'not_started'
  }
}

const ProgressBar = ({ percentage }: { percentage: number }) => (
  <div className="w-full bg-gray-100 rounded-full h-3">
    <div
      className="h-3 rounded-full transition-all duration-500"
      style={{
        width: `${percentage}%`,
        backgroundColor: percentage === 100 ? '#10B981' : '#7C3AED'
      }}
    />
  </div>
)

const TopicItem = ({
  topic,
  onStatusChange
}: {
  topic: Topic
  onStatusChange: (id: string, status: TopicStatus) => void
}) => {
  const config = STATUS_CONFIG[topic.status]

  return (
    <div className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-5 py-4">
      <span className="text-gray-800 text-sm font-medium">
        {topic.title}
      </span>
      <button
        onClick={() => onStatusChange(topic.id, config.next)}
        className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors cursor-pointer ${config.color}`}
      >
        {config.label}
      </button>
    </div>
  )
}

const GoalDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getGoal, updateTopicStatus, deleteGoal, getProgress } = useGoalsContext()

  const goal = getGoal(id!)

  if (!goal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Goal not found</p>
          <Link to="/" className="text-purple-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const progress = getProgress(goal)

  const handleStatusChange = (topicId: string, newStatus: TopicStatus) => {
    console.log(topicId, goal.id, newStatus)
    updateTopicStatus(goal.id, topicId, newStatus)
  }

  const handleDelete = async () => {
    console.log("delete")
    if (window.confirm('Delete this goal? This cannot be undone.')) {
      try{
        await deleteGoal(goal.id)
        navigate('/')
      }
      catch(err){
        console.error(err)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Back
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">
              {goal.title}
            </h1>
          </div>
          <button
            onClick={ handleDelete}
            className="text-sm text-red-400 hover:text-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">

        {/* PROGRESS CARD */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Overall progress</p>
              {goal.deadline && (
                <p className="text-xs text-gray-400">
                  🗓 Due {new Date(goal.deadline).toLocaleDateString()}
                </p>
              )}
            </div>
            <span className={`text-3xl font-bold ${
              progress === 100 ? 'text-green-500' : 'text-purple-600'
            }`}>
              {progress}%
            </span>
          </div>
          <ProgressBar percentage={progress} />
          <p className="text-sm text-gray-400 mt-3">
            {goal.topics.filter(t => t.status === 'done').length} of {goal.topics.length} topics completed
          </p>
          {progress === 100 && (
            <div className="mt-4 bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl">
              🎉 Goal completed! Great work!
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        {goal.description && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <p className="text-sm text-gray-400 mb-1">Description</p>
            <p className="text-gray-700">{goal.description}</p>
          </div>
        )}

        {/* TOPICS */}
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
            Topics — click to update status
          </h2>
          {goal.topics.length > 0 ? (
            <div className="space-y-2">
              {goal.topics.map(topic => (
                <TopicItem
                  key={topic.id}
                  topic={topic}
                  onStatusChange={ handleStatusChange}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
              <p className="text-gray-400 text-sm">
                No topics added to this goal yet
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default GoalDetail