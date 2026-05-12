// Dashboard.tsx — Home page
// Now fetches goals from real API
// Shows loading state while fetching

import { Link } from 'react-router-dom'
import { useGoalsContext } from '../context/GoalsContext'
import { useAuth } from '../context/AuthContext'
import type { Goal } from '../types'

// ── Progress Bar ─────────────────────────────────────────
const ProgressBar = ({ percentage }: { percentage: number }) => (
  <div className="w-full bg-gray-100 rounded-full h-2">
    <div
      className="h-2 rounded-full transition-all duration-500"
      style={{
        width: `${percentage}%`,
        backgroundColor: percentage === 100 ? '#10B981' : '#7C3AED'
      }}
    />
  </div>
)

// ── Goal Card ─────────────────────────────────────────────
const GoalCard = ({ goal, progress }: { goal: Goal; progress: number }) => (
  <Link
    to={`/goals/${goal.id}`}
    className="block bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-purple-100 transition-all"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 text-lg mb-1">
          {goal.title}
        </h3>
        {goal.description && (
          <p className="text-gray-400 text-sm line-clamp-1">
            {goal.description}
          </p>
        )}
      </div>
      <span className={`ml-4 text-sm font-semibold px-3 py-1 rounded-full flex-shrink-0 ${
        progress === 100
          ? 'bg-green-50 text-green-600'
          : 'bg-purple-50 text-purple-600'
      }`}>
        {progress}%
      </span>
    </div>

    <ProgressBar percentage={progress} />

    <div className="flex items-center justify-between mt-4">
      <span className="text-sm text-gray-400">
        {goal.topics.filter(t => t.status === 'done').length}/
        {goal.topics.length} topics done
      </span>
      {goal.deadline && (
        <span className="text-sm text-gray-400">
          🗓 {new Date(goal.deadline).toLocaleDateString()}
        </span>
      )}
    </div>
  </Link>
)

// ── Dashboard Page ────────────────────────────────────────
const Dashboard = () => {
  const { goals, isLoading, error, getProgress } = useGoalsContext()
  const { user, logout } = useAuth()

  // Calculate stats
  const totalTopics = goals.reduce((sum, g) => sum + g.topics.length, 0)
  const doneTopics = goals.reduce(
    (sum, g) => sum + g.topics.filter(t => t.status === 'done').length, 0
  )
  const completedGoals = goals.filter(g => getProgress(g) === 100).length

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HEADER ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              learning
              <span className="text-purple-500">.</span>
              milestoned
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Welcome back, {user?.name} 👋
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/goals/new"
              className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              + New Goal
            </Link>
            {/* Logout button */}
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors px-3 py-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* ── LOADING STATE ── */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* ── ERROR STATE ── */}
        {error && !isLoading && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        {/* ── CONTENT ── */}
        {!isLoading && !error && (
          <>
            {/* STATS ROW */}
            {goals.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
                  <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
                  <p className="text-sm text-gray-400 mt-1">Goals</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {doneTopics}/{totalTopics}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">Topics done</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
                  <p className="text-2xl font-bold text-green-500">{completedGoals}</p>
                  <p className="text-sm text-gray-400 mt-1">Completed</p>
                </div>
              </div>
            )}

            {/* GOALS LIST */}
            {goals.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Your goals
                </h2>
                {goals.map(goal => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    progress={getProgress(goal)}
                  />
                ))}
              </div>
            ) : (
              // EMPTY STATE
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  No goals yet
                </h2>
                <p className="text-gray-400 mb-8">
                  Add your first learning goal and start tracking progress
                </p>
                <Link
                  to="/goals/new"
                  className="bg-purple-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  Create your first goal
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard