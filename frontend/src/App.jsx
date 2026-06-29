
import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/Register'
import LoginPage from './pages/Login'
import DashboardPage from './pages/Dashboard'
import SubmitJob from './pages/AddJob'

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route 
            path='/' 
            element={<LoginPage />}
          />

          <Route
            path='/register'
            element={<RegisterPage />}
          />

          <Route
            path='/dashboard'
            element={<DashboardPage />}
          />
          <Route
            path='/add-job'
            element={<SubmitJob/>}
          />
          </Routes>
    </BrowserRouter>
  )
}

export default App
