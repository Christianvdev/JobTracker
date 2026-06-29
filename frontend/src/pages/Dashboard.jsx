import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useNavigate } from 'react-router-dom'


const DashboardPage = () => {
    const [applications, setApplications] = useState([])
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
    

     return(
            <div>
                <h1>applications</h1>
                {applications.map(app => (
                    <div key={app.id}>
                        <h3>Company Name:</h3>
                        <p>{app.company_name}</p>

                        <h3>Role title:</h3>
                        <p>{app.role_title}</p>

                        <h3>Date applied</h3>
                        <p>{app.date_applied}</p>
                        <h4>Notes</h4>
                        <p>{app.notes}</p>
                        <br/>
                        <button onClick={() => RemoveJob(app.id)}>remove</button>
                    </div>
                    
                ))}

                <br/>
                <button onClick={AddJob}>Add Job</button>
                <button onClick={LogOut}> Log out </button>
            </div>
        )
}

export default DashboardPage