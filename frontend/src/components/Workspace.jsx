import { NavLink, useNavigate } from 'react-router-dom'

export function Icon({ name, size = 18, strokeWidth = 1.8, ...props }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    search: <><circle cx="10.8" cy="10.8" r="7" /><path d="m16 16 5 5" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    down: <path d="m6 9 6 6 6-6" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></>,
    note: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    spark: <><path d="m12 3 1.7 6.3L20 11l-6.3 1.7L12 19l-1.7-6.3L4 11l6.3-1.7L12 3ZM19 18v4m-2-2h4" /></>,
    edit: <><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 10v7M14 10v7" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18" /></>,
    external: <><path d="M14 4h6v6M20 4l-9 9M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="M18 6 6 18M6 6l12 12" />,
    filter: <><path d="M4 7h16M7 12h10M10 17h4" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.briefcase}</svg>
}

export const STATUS = {
  1: { label: 'Applied', tone: 'applied' },
  2: { label: 'Interviewing', tone: 'interview' },
  3: { label: 'Offer received', tone: 'offer' },
  4: { label: 'Hired', tone: 'hired' },
  5: { label: 'Not selected', tone: 'closed' },
  6: { label: 'No longer interested', tone: 'closed' },
}

export function StatusBadge({ status }) {
  const item = STATUS[Number(status)] || STATUS[1]
  return <span className={`status-badge status-${item.tone}`}><span className="status-dot" />{item.label}</span>
}

export function Brand({ compact = false }) {
  return <div className="brand"><span className="brand-mark"><Icon name="briefcase" size={17} strokeWidth={2} /></span>{!compact && <span className="brand-wordmark">folio<span className="brand-period">.</span></span>}</div>
}

export default function Workspace({ active, children }) {
  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/')
  }
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-top"><Brand /></div>
        <div className="sidebar-section-label">WORKSPACE</div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/dashboard" className={`nav-item ${active === 'dashboard' ? 'is-active' : ''}`}><Icon name="grid" size={17} /> <span>Applications</span></NavLink>
          <NavLink to="/add-job" className={`nav-item ${active === 'add' ? 'is-active' : ''}`}><Icon name="plus" size={18} /> <span>Add application</span></NavLink>
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-bottom">
          <div className="sidebar-hint"><span className="sidebar-hint-icon"><Icon name="briefcase" size={16} /></span><span><strong>Your career, organized.</strong><small>One opportunity at a time.</small></span></div>
          <button className="nav-item sign-out" onClick={logout}><Icon name="logout" size={17} /> <span>Sign out</span></button>
        </div>
      </aside>
      <div className="main-area">
        <header className="topbar"><span className="topbar-crumb">Workspace <Icon name="chevron" size={13} /> <strong>{active === 'dashboard' ? 'Applications' : active === 'add' ? 'New application' : 'Edit application'}</strong></span><span className="topbar-right"><span className="online-dot" /> Personal workspace</span></header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  )
}
