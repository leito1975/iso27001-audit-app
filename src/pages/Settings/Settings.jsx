import { useState } from 'react';
import { Save, RefreshCw, Download, Upload, Building2, User, Calendar, FileText, AlertCircle } from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import './Settings.css';

const Settings = () => {
    const { auditInfo, updateAuditInfo, getStatistics, resetAudit, selectedNorm, setNorm } = useAudit();
    const [normChangeWarning, setNormChangeWarning] = useState(false);
    const [formData, setFormData] = useState({
        name: auditInfo.name || '',
        organization: auditInfo.organization || '',
        auditor: auditInfo.auditor || '',
        startDate: auditInfo.startDate || '',
        endDate: auditInfo.endDate || '',
        scope: auditInfo.scope || '',
        auditedCompany: auditInfo.auditedCompany || '',
        companySector: auditInfo.companySector || '',
        contactPerson: auditInfo.contactPerson || '',
        sgsiScope: auditInfo.sgsiScope || '',
        auditType: auditInfo.auditType || 'interna',
        normVersion: auditInfo.normVersion || 'ISO 27001:2022',
        auditorOrg: auditInfo.auditorOrg || 'AonikLabs'
    });
    const [saved, setSaved] = useState(false);

    const stats = getStatistics();

    const handleSave = () => {
        updateAuditInfo(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleNormChange = (norm) => {
        if (norm !== selectedNorm) {
            setNormChangeWarning(true);
        }
    };

    const confirmNormChange = (norm) => {
        setNorm(norm);
        setNormChangeWarning(false);
    };

    const handleExport = () => {
        const data = localStorage.getItem('iso27001_audit_data');
        if (data) {
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `audit-${auditInfo.organization || 'export'}-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    localStorage.setItem('iso27001_audit_data', JSON.stringify(data));
                    window.location.reload();
                } catch (err) {
                    alert('Error al importar el archivo. Asegúrese de que es un archivo válido.');
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="settings-page">
            {/* Norm Selection */}
            <div className="card settings-section">
                <div className="card-header">
                    <h3 className="card-title">
                        <FileText size={20} />
                        Norma de Auditoría
                    </h3>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                    {/* ISO 27001 Card */}
                    <button
                        onClick={() => handleNormChange('iso27001')}
                        style={{
                            flex: 1,
                            padding: '20px',
                            border: `2px solid ${selectedNorm === 'iso27001' ? '#1B6CA8' : '#cbd5e1'}`,
                            borderRadius: '8px',
                            backgroundColor: selectedNorm === 'iso27001' ? '#1B6CA8' : '#f8fafc',
                            color: selectedNorm === 'iso27001' ? '#fff' : '#334155',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textAlign: 'left'
                        }}
                    >
                        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                            ISO 27001:2022
                        </div>
                        <div style={{ fontSize: '13px', opacity: 0.9 }}>
                            Information Security Management System
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
                            93 Controles • 7 Categorías
                        </div>
                    </button>

                    {/* ISO 42001 Card */}
                    <button
                        onClick={() => handleNormChange('iso42001')}
                        style={{
                            flex: 1,
                            padding: '20px',
                            border: `2px solid ${selectedNorm === 'iso42001' ? '#7c3aed' : '#cbd5e1'}`,
                            borderRadius: '8px',
                            backgroundColor: selectedNorm === 'iso42001' ? '#7c3aed' : '#f8fafc',
                            color: selectedNorm === 'iso42001' ? '#fff' : '#334155',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textAlign: 'left'
                        }}
                    >
                        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                            ISO 42001:2023
                        </div>
                        <div style={{ fontSize: '13px', opacity: 0.9 }}>
                            Artificial Intelligence Management System
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
                            38 Controles • 9 Dominios
                        </div>
                    </button>
                </div>

                {/* Warning Modal */}
                {normChangeWarning && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            padding: '32px',
                            maxWidth: '400px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                                <AlertCircle size={24} style={{ color: '#ef4444', flexShrink: 0 }} />
                                <div>
                                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                                        Cambiar Norma
                                    </h3>
                                    <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
                                        Al cambiar de norma, se reseteará la evaluación de todos los controles y requisitos. Los hallazgos y riesgos se mantendrán.
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setNormChangeWarning(false)}
                                    style={{
                                        padding: '8px 16px',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '6px',
                                        backgroundColor: '#f8fafc',
                                        color: '#334155',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => confirmNormChange(selectedNorm === 'iso27001' ? 'iso42001' : 'iso27001')}
                                    style={{
                                        padding: '8px 16px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        backgroundColor: '#ef4444',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }}
                                >
                                    Cambiar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Audit Information */}
            <div className="card settings-section">
                <div className="card-header">
                    <h3 className="card-title">
                        <FileText size={20} />
                        Información de la Auditoría
                    </h3>
                </div>

                <div className="settings-form">
                    <div className="form-group">
                        <label className="form-label">
                            <FileText size={16} />
                            Nombre de la Auditoría
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Auditoría ISO 27001 - 2024"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                <Building2 size={16} />
                                Organización
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.organization}
                                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                placeholder="Nombre de la organización"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <User size={16} />
                                Auditor Principal
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.auditor}
                                onChange={(e) => setFormData({ ...formData, auditor: e.target.value })}
                                placeholder="Nombre del auditor"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                <Calendar size={16} />
                                Fecha de Inicio
                            </label>
                            <input
                                type="date"
                                className="form-input"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Calendar size={16} />
                                Fecha de Fin
                            </label>
                            <input
                                type="date"
                                className="form-input"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Alcance de la Auditoría</label>
                        <textarea
                            className="form-textarea"
                            value={formData.scope}
                            onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                            placeholder="Describir el alcance de la auditoría..."
                            rows={4}
                        />
                    </div>

                    <hr style={{ margin: '20px 0', borderColor: '#e2e8f0' }} />
                    <h4 style={{ fontSize: '14px', marginBottom: '16px', color: '#334155' }}>Información Adicional para Informe</h4>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                <Building2 size={16} />
                                Empresa Auditada
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.auditedCompany}
                                onChange={(e) => setFormData({ ...formData, auditedCompany: e.target.value })}
                                placeholder="Nombre de la empresa auditada"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Sector / Industria</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.companySector}
                                onChange={(e) => setFormData({ ...formData, companySector: e.target.value })}
                                placeholder="Sector de la empresa"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                <User size={16} />
                                Persona de Contacto
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.contactPerson}
                                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                placeholder="Nombre del contacto en la empresa"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Tipo de Auditoría</label>
                            <select
                                className="form-input"
                                value={formData.auditType}
                                onChange={(e) => setFormData({ ...formData, auditType: e.target.value })}
                            >
                                <option value="interna">Interna</option>
                                <option value="externa">Externa</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Alcance del SGSI</label>
                        <textarea
                            className="form-textarea"
                            value={formData.sgsiScope}
                            onChange={(e) => setFormData({ ...formData, sgsiScope: e.target.value })}
                            placeholder="Describir el alcance del Sistema de Gestión de Seguridad de la Información..."
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Norma Aplicable</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.normVersion}
                                onChange={(e) => setFormData({ ...formData, normVersion: e.target.value })}
                                placeholder="ISO 27001:2022"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Organización Auditora</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.auditorOrg}
                                onChange={(e) => setFormData({ ...formData, auditorOrg: e.target.value })}
                                placeholder="AonikLabs"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button className={`btn btn-primary ${saved ? 'btn-success' : ''}`} onClick={handleSave}>
                            <Save size={18} />
                            {saved ? '¡Guardado!' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Statistics Summary */}
            <div className="card settings-section">
                <div className="card-header">
                    <h3 className="card-title">Resumen de la Auditoría</h3>
                </div>
                <div className="stats-summary">
                    <div className="stat-item">
                        <span className="stat-label">Total de Controles</span>
                        <span className="stat-value">{stats.totalControls}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Controles Evaluados</span>
                        <span className="stat-value">{stats.assessedControls}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Tasa de Cumplimiento</span>
                        <span className="stat-value">{stats.complianceRate}%</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Madurez Promedio</span>
                        <span className="stat-value">{stats.avgMaturity}/5</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Hallazgos Abiertos</span>
                        <span className="stat-value">{stats.findings.open}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Riesgos Activos</span>
                        <span className="stat-value">{stats.risks.open}</span>
                    </div>
                </div>
            </div>

            {/* Data Management */}
            <div className="card settings-section">
                <div className="card-header">
                    <h3 className="card-title">Gestión de Datos</h3>
                </div>
                <div className="data-actions">
                    <div className="action-card">
                        <div className="action-info">
                            <Download size={24} />
                            <div>
                                <h4>Exportar Datos</h4>
                                <p>Descargar todos los datos de la auditoría en formato JSON</p>
                            </div>
                        </div>
                        <button className="btn btn-secondary" onClick={handleExport}>
                            <Download size={18} />
                            Exportar
                        </button>
                    </div>

                    <div className="action-card">
                        <div className="action-info">
                            <Upload size={24} />
                            <div>
                                <h4>Importar Datos</h4>
                                <p>Cargar datos de una auditoría previamente exportada</p>
                            </div>
                        </div>
                        <label className="btn btn-secondary">
                            <Upload size={18} />
                            Importar
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>

                    <div className="action-card danger">
                        <div className="action-info">
                            <RefreshCw size={24} />
                            <div>
                                <h4>Reiniciar Auditoría</h4>
                                <p>Eliminar todos los datos y comenzar una nueva auditoría</p>
                            </div>
                        </div>
                        <button className="btn btn-danger" onClick={resetAudit}>
                            <RefreshCw size={18} />
                            Reiniciar
                        </button>
                    </div>
                </div>
            </div>

            {/* About */}
            <div className="card settings-section about-section">
                <div className="about-content">
                    <h3>AuditIA</h3>
                    <p>Versión 1.1.0 — by AonikLabs</p>
                    <p className="about-description">
                        Plataforma de auditoría inteligente con soporte multinorma.
                        Gestión completa de auditorías ISO 27001 e ISO 42001 con metodología de madurez CMMI.
                    </p>
                    <div className="about-features">
                        <span className="feature-tag">ISO 27001:2022</span>
                        <span className="feature-tag">ISO 42001:2023</span>
                        <span className="feature-tag">Metodología CMMI</span>
                        <span className="feature-tag">Gap Analysis</span>
                        <span className="feature-tag">Gestión de Riesgos</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
