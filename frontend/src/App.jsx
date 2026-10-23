
import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/register'
import LoginPage from './pages/Login'
import SubmitJob from './pages/AddJob'
import { DashboardPage, EditJob } from './pages/Dashboard'

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
          <Route
            path='/edit-job/:id'
            element={<EditJob/>}
          />
          </Routes>
    </BrowserRouter>
  )
}

export default App
