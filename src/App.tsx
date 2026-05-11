import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { GoalsProvider } from './context/GoalsContext'
import Dashboard from './pages/Dashboard'
import NewGoal from './pages/NewGoal'
import GoalDetails from './pages/GoalDetails'
import Login from './pages/Login'
import Register from './pages/Register'

const isAuthenticated = ()=> !!localStorage.getItem('token')

const ProtectedRoute = ({children}:{children:React.ReactNode}) =>{
  if(!isAuthenticated()){
    return <Navigate to="/login" replace/>
  }
  return <>{children}</>
}
function App() {
  return (
    <GoalsProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/register' element={<Register/>}/>
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }/>

          <Route path="/goals/new" element={
            <ProtectedRoute>
              <NewGoal/>
            </ProtectedRoute>
          }/>

          <Route path="/goals/:id" element={
            <ProtectedRoute>
              <GoalDetails/>
            </ProtectedRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </GoalsProvider>
  )
}

export default App
