import { useState } from "react"
import api from '../../api/axios'
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
            setError('Invalid')
        }
    }


    return(
        <div>
            <input
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p>{error}</p>}
            <button onClick={handleRegister}>Register</button>
        </div>
    )
}

export default RegisterPage;