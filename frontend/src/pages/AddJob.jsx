import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../api/axios"

const SubmitJob = () => {
    const [companyName, setCompanyName] = useState('')
    const [roleTitle,setRoleTitle] = useState('')
    const [jobLink, setJobLink] = useState('')
    const [status, setStatus] = useState('applied')
    const [notes, setNotes] = useState('')


    const navigate = useNavigate()
    useEffect(() =>{
        const token = localStorage.getItem('access_token')
        if(!token){
            navigate('/')
        }
    }, [])


    const handleSubmit = async () => {
        try{
            const response = await api.post('api/jobs/',{
                company_name: companyName,
                role_title: roleTitle,
                job_link: jobLink,
                notes
            })
            navigate('/dashboard')
        }
        catch(err){
            console.log('Error status', err.response.status)
            console.log('Error data', err.response.data)
        }
    }


    return(
        <div>
            <input
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
            />
            <br/>
            <input
                placeholder="Role title"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
            />
            <br/>
            <input
                placeholder="Job link"
                value={jobLink}
                onChange={(e) => setJobLink(e.target.value)}
            />
            <br/>
            <input
                placeholder="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            />
            <br/>
            <input
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />

            <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default SubmitJob