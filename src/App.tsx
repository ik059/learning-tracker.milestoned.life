import { BrowserRouter, Routes, Route} from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import NewGoal from './pages/NewGoal'
import GoalDetails from './pages/GoalDetails'
function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Dashboard/>}/>
        <Route path="/goals/new" element={<NewGoal/>}/>
        <Route path="/goals/:id" element={<GoalDetails/>}/>

      </Routes>
    </BrowserRouter>
  )
}

export default App
