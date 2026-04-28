import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Shield,
    ClipboardCheck,
    AlertTriangle,
    FileText,
    Settings,
    ChevronRight,
    Download,
    ListChecks,
    BookOpen,
    Users,
    ArrowLeft
} from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const { getStatistics, selectedNorm, currentAudit } = useAudit();
    const { user } = useAuth();
    const stats = getStatistics();

    const handleChangeAudit = () => {
        // Clear current audit and navigate to audits page
        window.location.href = '/';
    };

    const navItems = [
        {
            path: '/',
            icon: LayoutDashboard,
            label: 'Dashboard',
            badge: null
        },
        {
            path: '/requirements',
            icon: BookOpen,
            label: 'Requisitos',
            badge: null
        },
        {
            path: '/controls',
            icon: Shield,
            label: 'Controles',
            badge: `${stats.assessedControls}/${stats.applicableControls}`
        },
        {
            path: '/gap-analysis',
            icon: ClipboardCheck,
            label: 'Gap Analysis',
            badge: stats.gapControls > 0 ? stats.gapControls : null
        },
        {
            path: '/findings',
            icon: FileText,
            label: 'Hallazgos',
            badge: stats.findings.open > 0 ? stats.findings.open : null
        },
        {
            path: '/risks',
            icon: AlertTriangle,
            label: 'Riesgos',
            badge: stats.risks.critical > 0 ? stats.risks.critical : null
        },
        {
            path: '/seguimiento',
            icon: ListChecks,
            label: 'Seguimiento',
            badge: null
        },
        {
            path: '/reportes',
            icon: Download,
            label: 'Reportes',
            badge: null
        },
        {
            path: '/settings',
            icon: Settings,
            label: 'Configuración',
            badge: null
        },
        ...(user?.role === 'admin' ? [{
            path: '/users',
            icon: Users,
            label: 'Usuarios',
            badge: null
        }] : [])
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <button
                    className="btn-change-audit"
                    onClick={handleChangeAudit}
                    title="Volver a auditorías"
                >
                    <ArrowLeft size={18} />
                </button>
                <div className="sidebar-logo">
                    <Shield className="logo-icon" />
                    <div className="logo-text">
                        <span className="logo-title">AuditIA</span>
                        <span className="logo-subtitle">
                            {currentAudit?.name || 'Auditoría'}
                        </span>
                    </div>
                </div>
                <div style={{
                    display: 'inline-block',
                    marginTop: '8px',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#fff',
                    backgroundColor: selectedNorm === 'iso42001' ? '#7c3aed' : '#1B6CA8'
                }}>
                    {selectedNorm === 'iso42001' ? 'AI Management' : 'Security'}
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon className="nav-icon" />
                        <span className="nav-label">{item.label}</span>
                        {item.badge && (
                            <span className="nav-badge">{item.badge}</span>
                        )}
                        <ChevronRight className="nav-arrow" />
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="compliance-summary">
                    <div className="compliance-label">Cumplimiento General</div>
                    <div className="compliance-value">{stats.complianceRate}%</div>
                    <div className="compliance-bar">
                        <div
                            className="compliance-bar-fill"
                            style={{ width: `${stats.complianceRate}%` }}
                        />
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
