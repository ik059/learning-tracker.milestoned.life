import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { GoalsProvider } from './context/GoalsContext'
import Dashboard from './pages/Dashboard'
import NewGoal from './pages/NewGoal'
import GoalDetail from './pages/GoalDetails'
import Login from './pages/Login'
import Register from './pages/Register'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // GoalsProvider only mounts when user is authenticated
  // This ensures token is available before fetching goals
  return (
    <GoalsProvider>
      {children}
    </GoalsProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/goals/new" element={
            <ProtectedRoute>
              <NewGoal />
            </ProtectedRoute>
          } />
          <Route path="/goals/:id" element={
            <ProtectedRoute>
              <GoalDetail />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App