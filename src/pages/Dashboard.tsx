// Dashboard.tsx — Home page
// Shows all learning goals with progress
// From here user can create new goals or click into a goal

import { Link } from 'react-router-dom'
import { useGoals } from '../hooks/useGoals'
import type { Goal, Topic } from '../types';

// ── Progress Bar component ───────────────────────────────
// Small reusable component defined in same file
// Only used here so no need to put it in ui/ folder
const ProgressBar = ({ percentage }: { percentage: number }) => {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div
        className="h-2 rounded-full transition-all duration-500"
        style={{
          width: `${percentage}%`,
          // Color changes based on progress
          // This is called a "derived value" — calculated from data
          backgroundColor:
            percentage === 100
              ? '#10B981' // green — complete
              : percentage >= 50
              ? '#7C3AED' // purple — halfway
              : '#7C3AED', // purple — just started
        }}
      />
    </div>
  )
}

// ── Goal Card component ──────────────────────────────────
const GoalCard = ({
  goal,
  progress,
}: {
  goal: Goal,
  progress: number
}) => {
  return (
    // Link wraps the whole card — clicking anywhere navigates
    <Link
      to={`/goals/${goal.id}`}
      className="block bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-purple-100 transition-all"
    >
      {/* TOP ROW — title + progress percentage */}
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

        {/* Progress badge */}
        <span
          className={`ml-4 text-sm font-semibold px-3 py-1 rounded-full flex-shrink-0 ${
            progress === 100
              ? 'bg-green-50 text-green-600'
              : 'bg-purple-50 text-purple-600'
          }`}
        >
          {progress}%
        </span>
      </div>

      {/* PROGRESS BAR */}
      <ProgressBar percentage={progress} />

      {/* BOTTOM ROW — topics count + deadline */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-gray-400">
          {/* Count done topics vs total */}
          {goal.topics.filter((t: Topic) => t.status === 'done').length}/
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
}

// ── Dashboard Page ───────────────────────────────────────
const Dashboard = () => {
  // Get goals and getProgress from our custom hook
  const { goals, getProgress } = useGoals()

  // Calculate overall stats for the header
  const totalTopics = goals.reduce((sum, g) => sum + g.topics.length, 0)
  const doneTopics = goals.reduce(
    (sum, g) => sum + g.topics.filter(t => t.status === 'done').length,
    0
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
              <span className="text-purple-500">.milestoned</span>
              
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Track your learning progress
            </p>
          </div>

          {/* Add new goal button */}
          <Link
            to="/goals/new"
            className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            + New Goal
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* ── STATS ROW ── */}
        {goals.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
              <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
              <p className="text-sm text-gray-400 mt-1">Goals</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
              <p className="text-2xl font-bold text-gray-900">{doneTopics}/{totalTopics}</p>
              <p className="text-sm text-gray-400 mt-1">Topics done</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
              <p className="text-2xl font-bold text-green-500">{completedGoals}</p>
              <p className="text-sm text-gray-400 mt-1">Completed</p>
            </div>
          </div>
        )}

        {/* ── GOALS LIST ── */}
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
          // ── EMPTY STATE ──
          // Shown when no goals exist yet
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
      </div>
    </div>
  )
}

export default Dashboard