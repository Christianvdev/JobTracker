import '../styles/Login.css'

import { useEffect, useState } from "react"
import api from '../../api/axios'
import {Navigate, useNavigate} from 'react-router-dom'

const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('access_token')
        if(token){
            navigate('/dashboard')
        }
    })


    const handleSubmit = async () => {
        try{
            const response = await api.post('token/', {
                username,
                password
            })
            localStorage.setItem('access_token', response.data.access)
            localStorage.setItem('refresh_token', response.data.refresh)
            navigate('/dashboard')
        }
        catch(err){
            setError('Invalid credentials')
        }
    }

    const navigate = useNavigate()

    const transferRegister = () => {
        navigate('/register')
    }

    return(
        <div className="login">
            <h1>Login</h1>
            <input
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br/>
            <input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br/>
            <button onClick={handleSubmit}>Login</button>
            <br/>
            <button onClick={transferRegister}>Register here.</button>
        </div>
    )
}

export default LoginPage