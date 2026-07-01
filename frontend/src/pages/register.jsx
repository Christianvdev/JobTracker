import { useState } from "react"
import api from '../../api/axios'
import {useNavigate} from 'react-router-dom'
const RegisterPage = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    const [error, setError] = useState('')


    const handleRegister = async () => {
        try{
            const response = await api.post('api/accounts/register/',{
                username,
                email,
                password
            })
            alert('successful registration')
        }
        catch(err){
            console.log(err.response.data)
            setError(JSON.stringify(err.response.data))
        }
    }

    const navigate = useNavigate()

    const transferRegister = () => {
        navigate('/')
    }


    return(
        <div>
            <h1>Register</h1>
            <input
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br/>
            <input
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br/>
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br/>
            {error && <p>{error}</p>}
            <button onClick={handleRegister}>Register</button>
            <br/>
            <button onClick={transferRegister}>Already have an account? Login here.</button>
        </div>
    )
}

export default RegisterPage;