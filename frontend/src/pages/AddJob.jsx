import '../styles/AddJob.css'

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../api/axios"

const SubmitJob = () => {
    const [companyName, setCompanyName] = useState('')
    const [roleTitle, setRoleTitle] = useState('')
    const [jobLink, setJobLink] = useState('')
    const [status, setStatus] = useState(1)
    const [notes, setNotes] = useState('')
    const [rawText, setRawText] = useState('')
    const [parsing, setParsing] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('access_token')
        if(!token){
            navigate('/')
        }
    }, [])

    const handleParse = async () => {
        if (!rawText.trim() || parsing) return
        setError('')
        setParsing(true)
        try {
            const response = await api.post('api/parse-job/', {
                text: rawText
            })
            setCompanyName(response.data.company || '')
            setRoleTitle(response.data.role || '')
            setNotes(response.data.requirements?.join(', ') || '')
        }
        catch(err) {
            setError(err.response?.data?.detail || 'Unable to parse this description. You can enter the details manually.')
        }
        finally {
            setParsing(false)
        }
    }

    const handleSubmit = async () => {
        if (submitting) return
        setError('')
        if (!companyName.trim() || !roleTitle.trim()) {
            setError('Company name and role title are required.')
            return
        }
        setSubmitting(true)
        try{
            await api.post('api/jobs/', {
                company_name: companyName,
                role_title: roleTitle,
                job_link: jobLink,
                notes,
                status
            })
            navigate('/dashboard')
        }
        catch(err){
            setError(err.response?.data?.detail || 'Could not save the application. Please try again.')
        }
        finally {
            setSubmitting(false)
        }
    }

    return(
        <div>
            {/*  AI Parser  */}
            <div className='ai-form'>
                <h3>Paste job description</h3>
                <textarea
                    placeholder="Paste the full job posting here..."
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    rows={6}
                />
                <br/>
                <button onClick={handleParse} disabled={parsing || !rawText.trim()}>
                    {parsing ? "Parsing..." : "Parse with AI"}
                </button>

                <hr/>
            </div>

            {/*  Manual form  */}
            <div className='manual-form'>
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
                    <option value="3">Offer Received</option>
                    <option value="4">Hired</option>
                    <option value="5">Not Selected By Employer</option>
                    <option value="6">No Longer Interested</option>
                </select>
                <br/>
                {error && <p role="alert">{error}</p>}
                <button onClick={handleSubmit} disabled={submitting}>{submitting ? 'Saving...' : 'Submit'}</button>
                <br/>
                <button onClick={() => navigate('/dashboard')}>Cancel</button>
            </div>
        </div>
    )
}

export default SubmitJob