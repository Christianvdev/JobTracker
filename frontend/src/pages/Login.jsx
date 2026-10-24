import '../styles/Login.css'
import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useNavigate } from 'react-router-dom'
import { Brand, Icon, ThemeToggle } from '../components/Workspace'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { if (localStorage.getItem('access_token')) navigate('/dashboard') }, [navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('token/', { username, password })
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      navigate('/dashboard')
    } catch { setError('Invalid username or password. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="auth-layout">
      <header className="auth-header"><Brand /><ThemeToggle /></header>
      <main className="auth-center">
        <div className="auth-intro"><div className="auth-icon"><Icon name="briefcase" size={22} /></div><h1>Welcome back</h1><p>Sign in to your workspace to pick up where you left off.</p></div>
        <form className="auth-card" onSubmit={handleSubmit}>
          <label className="auth-field">Username<input autoComplete="username" placeholder="username" value={username} onChange={e => setUsername(e.target.value)} required /></label>
          <label className="auth-field">Password<input autoComplete="current-password" placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
          {error && <p className="inline-error" role="alert">{error}</p>}
          <button className="button button-primary auth-submit" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}<Icon name="arrow" size={16} /></button>
        </form>
        <p className="auth-switch">New to folio? <button type="button" onClick={() => navigate('/register')}>Register here.</button></p>
      </main>
      <footer className="auth-footer">A little clarity for your next big step.</footer>
    </div>
  )
}
