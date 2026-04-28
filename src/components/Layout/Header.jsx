import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, User, FileDown, Command } from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import NotificationCenter from '../Notifications/NotificationCenter';
import { generateAuditReport } from '../Reports/PDFGenerator';
import GlobalSearch from '../Search/GlobalSearch';
import './Header.css';

const Header = () => {
    const location = useLocation();
    const { auditInfo, getStatistics, findings, risks, actionPlans, controlAssessments, selectedNorm, currentAudit } = useAudit();
    const stats = getStatistics();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const normLabel = selectedNorm === 'iso42001' ? 'ISO 42001' : 'ISO 27001';
    const pageTitles = {
        '/': 'Dashboard',
        '/controls': `Controles ${normLabel}`,
        '/gap-analysis': 'Gap Analysis',
        '/findings': 'Gestión de Hallazgos',
        '/risks': 'Gestión de Riesgos',
        '/action-plans': 'Plan de Acción',
        '/timeline': 'Historial de Actividades',
        '/requirements': `Requisitos ${normLabel}`,
        '/settings': 'Configuración'
    };

    const title = pageTitles[location.pathname] || (currentAudit?.name || 'AuditIA');

    // Handle Cmd+K shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleExportPDF = () => {
        const auditData = {
            auditInfo,
            findings,
            risks,
            actionPlans,
            controlAssessments
        };
        generateAuditReport(auditData, stats);
    };

    return (
        <>
            <header className="header">
                <div className="header-left">
                    <div className="header-title-section">
                        <h1 className="header-title">{title}</h1>
                        <span className="header-subtitle">{auditInfo.organization || 'Organización no definida'}</span>
                    </div>
                </div>

                <div className="header-center">
                    <div className="search-box" onClick={() => setIsSearchOpen(true)}>
                        <Search className="search-icon" />
                        <span className="search-placeholder">Buscar...</span>
                        <div className="search-shortcut">
                            <kbd><Command size={12} /></kbd>
                            <kbd>K</kbd>
                        </div>
                    </div>
                </div>

                <div className="header-right">
                    <div className="header-stats">
                        <div className="stat-item">
                            <span className="stat-value">{stats.progressRate}%</span>
                            <span className="stat-label">Progreso</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-value">{stats.complianceRate}%</span>
                            <span className="stat-label">Cumplimiento</span>
                        </div>
                    </div>

                    <button className="header-btn" onClick={handleExportPDF} title="Exportar PDF">
                        <FileDown />
                    </button>

                    <NotificationCenter />

                    <div className="user-menu">
                        <div className="user-avatar">
                            <User />
                        </div>
                        <div className="user-info">
                            <span className="user-name">{auditInfo.auditor || 'Auditor'}</span>
                            <span className="user-role">Lead Auditor</span>
                        </div>
                    </div>
                </div>
            </header>

            <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
};

export default Header;

