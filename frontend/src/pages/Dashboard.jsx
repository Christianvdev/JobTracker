import '../styles/Dashboard.css'

import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useNavigate, useParams } from 'react-router-dom'



const DashboardPage = () => {
    const [applications, setApplications] = useState([])
    const [expandedId, setExpandedId] = useState(null)
    const navigate = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem('access_token')
        if(!token){
            navigate('/')
            return
        }

        
        
        const fetchJobs = async() => {
            try{
                const res = await api.get('api/jobs/')
                setApplications(res.data)

            }
            catch(err){
                console.log(err)
            }
        }
        
        fetchJobs()
    },[])

        const AddJob = () => {
            navigate('/add-job')
        }

        const RemoveJob = async (id) => {
            try{
                await api.delete(`api/jobs/${id}/`)
                setApplications(applications.filter(apps => apps.id !== id))
            }
            catch(err){
                console.log(err)
            }
        }

        const LogOut = () => {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            navigate('/')
        }
    

        const statusLabels = {
            1: "Applied",
            2: "Interviewing",
            3: "Offer received",
            4: "Hired",
            5: "Not selected by employer",
            6: "No longer interested",
        }

        
     return(
            <div className="dashboard">
            <h1>applications</h1>
            {applications.map(app => (
                <div className="job-card" key={app.id}>
                    
                    <h3>Company Name:</h3>
                    <p>{app.company_name}</p>

                    <h3>Role title:</h3>
                    <p>{app.role_title}</p>

                    <h3>Date applied</h3>
                    <p>{app.date_applied}</p>

                    <button onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}>
                        {expandedId === app.id ? "Hide Notes" : "Show Notes"}
                    </button>

                    {expandedId === app.id && <p>{app.notes}</p>}
                    <br/>

                    <h1>status:</h1>
                    <p>{statusLabels[app.status]}</p>
                    <br/>

                    <div className="card-actions">
                        <button onClick={() => RemoveJob(app.id)}>remove</button>
                        <button onClick={() => navigate(`/edit-job/${app.id}`)}>edit</button>
                    </div>

                </div>
            ))}

            <br/>
            <button onClick={AddJob}>Add Job</button>
            <button onClick={LogOut}> Log out </button>
        </div>
        )
}


const EditJob = () => {
    const [companyName, setCompanyName] = useState('')
    const [roleTitle,setRoleTitle] = useState('')
    const [jobLink, setJobLink] = useState('')
    const [status, setStatus] = useState(1)
    const [notes, setNotes] = useState('')

    const {id}  = useParams()
    
    const navigate = useNavigate()
    useEffect(() =>{

        const fetchJob = async () => {

        const res = await api.get(`api/jobs/${id}/`)
            setCompanyName(res.data.company_name)
            setRoleTitle(res.data.role_title)
            setJobLink(res.data.job_link)
            setNotes(res.data.notes)
            setStatus(res.data.status)
        }



        const token = localStorage.getItem('access_token')
        if(!token){
            navigate('/')
        }

        fetchJob()
    }, [id])


    const handleSubmit = async () => {
        try{
            const response = await api.put(`api/jobs/${id}/`,{
                company_name: companyName,
                role_title: roleTitle,
                job_link: jobLink,
                status,
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
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />
            <select value={status} onChange={(e) => setStatus(Number(e.target.value))}>
                <option value="">Select status</option>
                <option value="1">Applied</option>
                <option value="2">Interviewing</option>
                <option value="3">Offer_received</option>
                <option value="4">Hired</option>
                <option value="5">Not_selected_by_employer</option>
                <option value="6">No_longer_interested</option>
            </select>

            <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export {DashboardPage, EditJob}