import '../styles/AddJob.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import Workspace, { Icon, STATUS } from '../components/Workspace'

export default function SubmitJob() {
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

  useEffect(() => { if (!localStorage.getItem('access_token')) navigate('/') }, [navigate])

  const handleParse = async () => {
    if (!rawText.trim() || parsing) return
    setError('')
    setParsing(true)
    try {
      const { data } = await api.post('api/parse-job/', { text: rawText })
      setCompanyName(data.company || '')
      setRoleTitle(data.role || '')
      setNotes(Array.isArray(data.requirements) ? data.requirements.join(', ') : '')
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to parse this description. You can enter the details manually.')
    } finally { setParsing(false) }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return
    setError('')
    if (!companyName.trim() || !roleTitle.trim()) { setError('Company name and role title are required.'); return }
    setSubmitting(true)
    try {
      await api.post('api/jobs/', { company_name: companyName, role_title: roleTitle, job_link: jobLink, notes, status })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not save the application. Please try again.')
    } finally { setSubmitting(false) }
  }

  return (
    <Workspace active="add">
      <div className="form-page">
        <button className="back-link" onClick={() => navigate('/dashboard')}><Icon name="chevron" size={16} style={{ transform: 'rotate(180deg)' }} /> All applications</button>
        <div className="form-page-header"><div className="eyebrow">NEW OPPORTUNITY</div><h1>Add application</h1><p>Save the details, stay organized, and keep moving.</p></div>

        <section className="ai-panel">
          <div className="ai-panel-heading"><span className="ai-panel-icon"><Icon name="spark" size={18} /></span><div><h2>Quick fill with AI <span className="optional">(optional)</span></h2><p>Paste a job description to fill in the basics.</p></div></div>
          <label className="sr-only" htmlFor="job-description">Paste job description</label>
          <textarea id="job-description" placeholder="Paste the full job posting here..." value={rawText} onChange={e => setRawText(e.target.value)} rows={3} />
          <div className="ai-panel-footer"><span>You'll be able to review everything before saving.</span><button className="button button-secondary" type="button" onClick={handleParse} disabled={parsing || !rawText.trim()}><Icon name="spark" size={15} />{parsing ? 'Parsing...' : 'Parse with AI'}</button></div>
        </section>

        <form className="form-panel" onSubmit={handleSubmit}>
          <div className="panel-heading"><span className="panel-icon"><Icon name="briefcase" size={18} /></span><div><h2>Application details</h2><p>Just the essentials. You can edit these later.</p></div></div>
          <div className="form-grid">
            <label className="field">Company name <input required placeholder="Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} /></label>
            <label className="field">Role title <input required placeholder="Role title" value={roleTitle} onChange={e => setRoleTitle(e.target.value)} /></label>
            <label className="field field-wide">Job posting URL <span className="optional">(optional)</span><input type="url" placeholder="Job link" value={jobLink} onChange={e => setJobLink(e.target.value)} /></label>
            <label className="field field-wide">Application status <select value={status} onChange={e => setStatus(Number(e.target.value))}>{Object.entries(STATUS).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}</select></label>
            <label className="field field-wide">Notes <span className="optional">(optional)</span><textarea rows={3} placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} /></label>
          </div>
          {error && <div className="inline-error" role="alert">{error}</div>}
          <div className="form-actions"><button className="button button-secondary" type="button" onClick={() => navigate('/dashboard')}>Cancel</button><button className="button button-primary" type="submit" disabled={submitting}><Icon name="plus" size={16} />{submitting ? 'Saving...' : 'Submit'}</button></div>
        </form>
      </div>
    </Workspace>
  )
}
