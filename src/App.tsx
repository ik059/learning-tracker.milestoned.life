import { BrowserRouter, Routes, Route} from 'react-router-dom'
import { GoalsProvider } from './context/GoalsContext'
import Dashboard from './pages/Dashboard'
import NewGoal from './pages/NewGoal'
import GoalDetails from './pages/GoalDetails'
function App() {


  return (
    <GoalsProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Dashboard/>}/>
          <Route path="/goals/new" element={<NewGoal/>}/>
          <Route path="/goals/:id" element={<GoalDetails/>}/>

        </Routes>
      </BrowserRouter>
    </GoalsProvider>
  )
}

export default App
