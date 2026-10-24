import '../styles/Register.css'
import { useState } from 'react'
import api from '../../api/axios'
import { useNavigate } from 'react-router-dom'
import { Brand, Icon, ThemeToggle } from '../components/Workspace'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('api/accounts/register/', { username, email, password })
      setSuccess(true)
    } catch (err) {
      const detail = err.response?.data
      setError(typeof detail?.detail === 'string' ? detail.detail : 'Could not create your account. Please check your details.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-layout">
      <header className="auth-header"><Brand /><ThemeToggle /></header>
      <main className="auth-center">
        <div className="auth-intro"><div className="auth-icon"><Icon name="briefcase" size={22} /></div><h1>Create your account</h1><p>A simpler way to stay on top of every opportunity.</p></div>
        {success ? <div className="auth-card success-card"><span className="success-icon"><Icon name="check" size={20} /></span><h2>You're all set.</h2><p>Your account has been created.</p><button className="button button-primary auth-submit" onClick={() => navigate('/')}>Continue to login <Icon name="arrow" size={16} /></button></div> :
          <form className="auth-card" onSubmit={handleRegister}>
            <label className="auth-field">Username<input autoComplete="username" placeholder="username" value={username} onChange={e => setUsername(e.target.value)} required /></label>
            <label className="auth-field">Email<input autoComplete="email" type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
            <label className="auth-field">Password<input autoComplete="new-password" type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
            {error && <p className="inline-error" role="alert">{error}</p>}
            <button className="button button-primary auth-submit" type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Register'} <Icon name="arrow" size={16} /></button>
          </form>
        }
        <p className="auth-switch">Already have an account? <button type="button" onClick={() => navigate('/')}>Login here.</button></p>
      </main>
      <footer className="auth-footer">A little clarity for your next big step.</footer>
    </div>
  )
}
