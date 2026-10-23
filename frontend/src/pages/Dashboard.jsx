import '../styles/Dashboard.css'
import { useEffect, useMemo, useState } from 'react'
import api from '../../api/axios'
import { useNavigate, useParams } from 'react-router-dom'
import Workspace, { Icon, StatusBadge, STATUS } from '../components/Workspace'

const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(`${value.slice(0, 10)}T12:00:00`)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function DashboardPage() {
  const [applications, setApplications] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('access_token')) { navigate('/'); return }
    let active = true
    api.get('api/jobs/')
      .then(({ data }) => { if (active) setApplications(data) })
      .catch(() => { if (active) setError('Could not load your applications. Please refresh and try again.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [navigate])

  const visible = useMemo(() => applications.filter(app => {
    const matchText = `${app.company_name} ${app.role_title}`.toLowerCase().includes(query.toLowerCase().trim())
    const matchStatus = filter === 'all' || (filter === 'active' ? [1, 2].includes(Number(app.status)) : filter === 'closed' ? [5, 6].includes(Number(app.status)) : Number(app.status) === Number(filter))
    return matchText && matchStatus
  }), [applications, query, filter])

  const removeJob = async (id) => {
    if (!window.confirm('Remove this application? This cannot be undone.')) return
    setError('')
    try {
      await api.delete(`api/jobs/${id}/`)
      setApplications(current => current.filter(app => app.id !== id))
      setExpandedId(null)
    } catch {
      setError('Could not remove the application. Please try again.')
    }
  }

  const interviewing = applications.filter(app => Number(app.status) === 2).length
  const offers = applications.filter(app => [3, 4].includes(Number(app.status))).length

  return (
    <Workspace active="dashboard">
      <div className="page-heading">
        <div><div className="eyebrow">OVERVIEW</div><h1>Applications</h1><p>Keep every opportunity in one place.</p></div>
        <button className="button button-primary add-job-button" onClick={() => navigate('/add-job')}><Icon name="plus" size={17} /> Add Job</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-top"><span>Total applications</span><span className="stat-icon"><Icon name="briefcase" size={18} /></span></div><div className="stat-number">{applications.length.toString().padStart(2, '0')}</div><div className="stat-caption">All tracked opportunities</div></div>
        <div className="stat-card"><div className="stat-top"><span>In interviews</span><span className="stat-icon"><Icon name="calendar" size={18} /></span></div><div className="stat-number">{interviewing.toString().padStart(2, '0')}</div><div className="stat-caption"><span className="mini-dot mini-blue" /> Conversations in progress</div></div>
        <div className="stat-card"><div className="stat-top"><span>Offers & hired</span><span className="stat-icon"><Icon name="check" size={18} /></span></div><div className="stat-number">{offers.toString().padStart(2, '0')}</div><div className="stat-caption"><span className="mini-dot mini-green" /> Positive outcomes</div></div>
      </div>

      <section className="applications-section">
        <div className="section-heading"><div><h2>All applications <span className="count-pill">{applications.length}</span></h2><p>A clear view of where things stand.</p></div></div>
        <div className="table-toolbar">
          <label className="search-field"><Icon name="search" size={17} /><input aria-label="Search applications" placeholder="Search company or role..." value={query} onChange={e => setQuery(e.target.value)} /></label>
          <label className="filter-field"><Icon name="filter" size={16} /><select aria-label="Filter by status" value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All statuses</option><option value="active">Active</option><option value="2">Interviewing</option><option value="3">Offer received</option><option value="4">Hired</option><option value="closed">Closed</option></select><Icon name="down" size={14} /></label>
        </div>
        {error && <div className="inline-error" role="alert">{error}</div>}
        <div className="table-frame">
          <div className="table-scroll">
            <table className="applications-table">
              <thead><tr><th>COMPANY / ROLE</th><th>DATE APPLIED</th><th>STATUS</th><th>NOTES</th><th className="actions-header">ACTIONS</th></tr></thead>
              <tbody>
                {visible.map(app => (
                  <tr className="job-card" key={app.id}>
                    <td className="company-cell"><div className="company-row"><div className="company-avatar">{(app.company_name || '?').slice(0, 1).toUpperCase()}</div><div className="company-copy"><strong>{app.company_name}</strong><span>{app.role_title}</span></div></div></td>
                    <td className="date-cell">{formatDate(app.date_applied)}</td>
                    <td><StatusBadge status={app.status} /></td>
                    <td className="notes-cell">{app.notes ? <><button className="notes-toggle" onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}><Icon name="note" size={15} />{expandedId === app.id ? 'Hide Notes' : 'Show Notes'}</button>{expandedId === app.id && <p className="note-detail">{app.notes}</p>}</> : <span className="muted-dash">—</span>}</td>
                    <td><div className="row-actions"><button aria-label={`Edit ${app.company_name}`} title="Edit" onClick={() => navigate(`/edit-job/${app.id}`)}><Icon name="edit" size={16} /> <span className="sr-only">edit</span></button><button aria-label={`Remove ${app.company_name}`} title="Remove" onClick={() => removeJob(app.id)}><Icon name="trash" size={16} /><span className="sr-only">remove</span></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && visible.length === 0 && <div className="empty-state"><span className="empty-icon"><Icon name="briefcase" size={24} /></span><h3>{applications.length ? 'No matching applications' : 'Your next opportunity starts here'}</h3><p>{applications.length ? 'Try another search or filter.' : 'Add your first job application to start tracking.'}</p>{!applications.length && <button className="button button-primary" onClick={() => navigate('/add-job')}>Add application <Icon name="arrow" size={16} /></button>}</div>}
          {loading && <div className="empty-state"><p>Loading your applications...</p></div>}
          <div className="table-footer"><span>Showing {visible.length} of {applications.length} applications</span><span>Keep moving forward <span aria-hidden="true">↗</span></span></div>
        </div>
      </section>
    </Workspace>
  )
}

export function EditJob() {
  const [companyName, setCompanyName] = useState('')
  const [roleTitle, setRoleTitle] = useState('')
  const [jobLink, setJobLink] = useState('')
  const [status, setStatus] = useState(1)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('access_token')) { navigate('/'); return }
    let active = true
    api.get(`api/jobs/${id}/`).then(({ data }) => {
      if (!active) return
      setCompanyName(data.company_name || '')
      setRoleTitle(data.role_title || '')
      setJobLink(data.job_link || '')
      setNotes(data.notes || '')
      setStatus(Number(data.status) || 1)
    }).catch(() => { if (active) setError('Could not load this application.') }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!companyName.trim() || !roleTitle.trim()) { setError('Company name and role title are required.'); return }
    setError('')
    setSaving(true)
    try {
      await api.put(`api/jobs/${id}/`, { company_name: companyName, role_title: roleTitle, job_link: jobLink, status, notes })
      navigate('/dashboard')
    } catch {
      setError('Could not save your changes. Please try again.')
    } finally { setSaving(false) }
  }

  return (
    <Workspace active="edit">
      <div className="form-page">
        <button className="back-link" onClick={() => navigate('/dashboard')}><Icon name="chevron" size={16} style={{ transform: 'rotate(180deg)' }} /> All applications</button>
        <div className="form-page-header"><div className="eyebrow">APPLICATION DETAILS</div><h1>Edit application</h1><p>Update the details as your application progresses.</p></div>
        <form className="form-panel" onSubmit={handleSubmit}>
          <div className="panel-heading"><span className="panel-icon"><Icon name="briefcase" size={18} /></span><div><h2>Application details</h2><p>Keep your information up to date.</p></div></div>
          {loading ? <p>Loading application...</p> : <>
            <div className="form-grid">
              <label className="field">Company name <input required placeholder="Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} /></label>
              <label className="field">Role title <input required placeholder="Role title" value={roleTitle} onChange={e => setRoleTitle(e.target.value)} /></label>
              <label className="field field-wide">Job posting URL <input type="url" placeholder="Job link" value={jobLink} onChange={e => setJobLink(e.target.value)} /></label>
              <label className="field field-wide">Application status <select value={status} onChange={e => setStatus(Number(e.target.value))}>{Object.entries(STATUS).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}</select></label>
              <label className="field field-wide">Notes <span className="optional">(optional)</span><textarea rows={3} placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} /></label>
            </div>
            {error && <p className="inline-error" role="alert">{error}</p>}
            <div className="form-actions"><button className="button button-secondary" type="button" onClick={() => navigate('/dashboard')}>Cancel</button><button className="button button-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Submit'}</button></div>
          </>}
        </form>
      </div>
    </Workspace>
  )
}
