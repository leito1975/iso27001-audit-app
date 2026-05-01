import { useState } from 'react';
import {
    FileText, Download, Shield, AlertTriangle, Search,
    ClipboardCheck, BarChart2, BookOpen, CheckCircle, Loader
} from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { CMMI_LEVELS, CONTROL_CATEGORIES } from '../../data/iso27001-controls';
import { ISO42001_CONTROL_CATEGORIES } from '../../data/iso42001-controls';
import { ISO27001_CLAUSES } from '../../data/iso27001-clauses';
import { ISO42001_CLAUSES } from '../../data/iso42001-clauses';
import './Reportes.css';

// ─── Helpers ───────────────────────────────────────────────────────────────
function escHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatDate(d) {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('es-ES'); } catch { return '—'; }
}

// CIA methodology: uses impactoNivel (string) if available, otherwise falls back to numeric score
function riskLevelFromCia(risk) {
    const nivel = risk.impactoNivel;
    if (nivel) {
        const map = {
            'Crítico':  { label: 'Crítico',  color: '#dc2626', cls: 'critical' },
            'Muy Alto': { label: 'Muy Alto', color: '#ef4444', cls: 'critical' },
            'Alto':     { label: 'Alto',     color: '#f97316', cls: 'high'     },
            'Medio':    { label: 'Medio',    color: '#eab308', cls: 'medium'   },
            'Bajo':     { label: 'Bajo',     color: '#22c55e', cls: 'low'      },
            'Muy Bajo': { label: 'Muy Bajo', color: '#22c55e', cls: 'low'      },
        };
        return map[nivel] || { label: nivel, color: '#64748b', cls: 'pending' };
    }
    // Legacy numeric fallback
    const score = (risk.probability || 0) * (risk.impact || 0);
    if (score >= 15) return { label: 'Crítico', color: '#ef4444', cls: 'critical' };
    if (score >= 9)  return { label: 'Alto',    color: '#f97316', cls: 'high'     };
    if (score >= 4)  return { label: 'Medio',   color: '#eab308', cls: 'medium'   };
    if (score > 0)   return { label: 'Bajo',    color: '#22c55e', cls: 'low'      };
    return { label: '—', color: '#64748b', cls: 'pending' };
}

// Count risks by CIA level (works for both old and new methodology)
function countByCiaLevel(risks, levels) {
    return levels.map(lvl => risks.filter(r => {
        if (r.impactoNivel) return r.impactoNivel === lvl;
        const s = (r.probability||0)*(r.impact||0);
        if (lvl === 'Crítico')  return s >= 15;
        if (lvl === 'Alto')     return s >= 9 && s < 15;
        if (lvl === 'Medio')    return s >= 4 && s < 9;
        if (lvl === 'Bajo')     return s > 0 && s < 4;
        return false;
    }).length);
}

const getReportTemplates = (norm) => {
    const isAI = norm === 'iso42001';
    const normLabel = isAI ? 'ISO 42001:2023' : 'ISO 27001:2022';
    const controlCount = isAI ? '39' : '93';
    return [
        {
            id: 'audit-report',
            icon: FileText,
            title: 'Informe de Auditoría Completo',
            description: `Informe ejecutivo completo con portada, dashboard de madurez, evaluación de requisitos, hallazgos y conclusiones. Formato profesional AonikLabs — ${normLabel}.`,
            color: '#0D2137'
        },
        {
            id: 'gap-analysis',
            icon: ClipboardCheck,
            title: 'Gap Analysis — Controles Anexo A',
            description: `Estado de evaluación de los ${controlCount} controles ${normLabel}. Nivel de madurez actual vs objetivo, brechas y evidencias.`,
            color: '#3b82f6'
        },
        {
            id: 'risk-assessment',
            icon: AlertTriangle,
            title: 'Evaluación de Riesgos',
            description: 'Registro completo de riesgos con probabilidad, impacto, nivel, plan de tratamiento, responsable y fecha objetivo.',
            color: '#ef4444'
        },
        {
            id: 'findings',
            icon: Search,
            title: 'Informe de Hallazgos',
            description: 'Hallazgos identificados durante la auditoría con severidad, estado, controles vinculados y observaciones.',
            color: '#f97316'
        },
        {
            id: 'compliance-summary',
            icon: BarChart2,
            title: 'Resumen Ejecutivo de Cumplimiento',
            description: `Vista consolidada del estado de cumplimiento general por dominio y cláusula — ${normLabel}. Ideal para dirección.`,
            color: '#8b5cf6'
        },
        {
            id: 'requirements',
            icon: BookOpen,
            title: 'Evaluación de Requisitos (Cláusulas 4–10)',
            description: `Estado de evaluación de los requisitos normativos obligatorios del estándar ${normLabel}.`,
            color: '#06b6d4'
        }
    ];
};

// ─── HTML Generators ───────────────────────────────────────────────────────

function buildStyles(color, gold) {
    const goldColor = gold || '#C47D2A';
    return `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #1e293b; background: #fff; padding: 32px; }
      h1 { font-size: 22px; color: ${color}; margin-bottom: 4px; }
      h2 { font-size: 15px; margin: 24px 0 10px; color: #334155; border-bottom: 2px solid ${color}30; padding-bottom: 4px; }
      h3 { font-size: 13px; margin: 16px 0 8px; color: #475569; }
      .header { border-bottom: 3px solid ${color}; padding-bottom: 16px; margin-bottom: 24px; }
      .meta { font-size: 11px; color: #64748b; margin-top: 4px; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 16px; }
      th { background: ${color}18; color: #334155; padding: 7px 10px; text-align: left; font-weight: 600; border: 1px solid ${color}25; }
      td { padding: 6px 10px; border: 1px solid #e2e8f0; vertical-align: top; }
      tr:nth-child(even) td { background: #f8fafc; }
      .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; }
      .badge-critical { background: #fef2f2; color: #ef4444; }
      .badge-high     { background: #fff7ed; color: #f97316; }
      .badge-medium   { background: #fefce8; color: #ca8a04; }
      .badge-low      { background: #f0fdf4; color: #16a34a; }
      .badge-open     { background: #fef2f2; color: #ef4444; }
      .badge-closed   { background: #f0fdf4; color: #16a34a; }
      .badge-progress { background: #fffbeb; color: #d97706; }
      .badge-pending  { background: #f1f5f9; color: #64748b; }
      .badge-nc-major { background: #fef2f2; color: #dc2626; font-weight: 700; }
      .badge-nc-minor { background: #fff7ed; color: #ea580c; }
      .badge-observation { background: #dbeafe; color: #0c4a6e; }
      .badge-opportunity { background: #dcfce7; color: #15803d; }
      .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
      .kpi { padding: 14px 16px; border-radius: 8px; border: 1px solid #e2e8f0; }
      .kpi-value { font-size: 26px; font-weight: 700; color: ${color}; }
      .kpi-label { font-size: 11px; color: #64748b; margin-top: 2px; }
      .progress-bar { width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; margin-top: 4px; }
      .progress-fill { height: 100%; background: ${color}; border-radius: 4px; }
      .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
      .page-break { page-break-after: always; margin: 40px 0; }
      .cover-page { page-break-after: always; }
      .cover-top-bar { background: ${color}; -webkit-print-color-adjust: exact; print-color-adjust: exact; padding: 32px 48px 28px; }
      .cover-top-bar .cover-brand { font-size: 16px; letter-spacing: 4px; color: #ffffff; font-weight: 300; }
      .cover-top-bar .cover-brand strong { font-weight: 700; }
      .cover-top-bar .cover-tagline { font-size: 10px; color: #94a3b8; letter-spacing: 2px; margin-top: 6px; }
      .cover-body { padding: 60px 48px 40px; }
      .cover-divider { width: 60px; height: 4px; background: ${goldColor}; -webkit-print-color-adjust: exact; print-color-adjust: exact; border-radius: 2px; margin-bottom: 40px; }
      .cover-pre { font-size: 11px; letter-spacing: 4px; color: #94a3b8; text-transform: uppercase; margin-bottom: 12px; }
      .cover-title { font-size: 52px; font-weight: 800; color: ${color}; line-height: 1; letter-spacing: -1px; margin-bottom: 6px; }
      .cover-subtitle { font-size: 52px; font-weight: 300; color: ${color}; line-height: 1; letter-spacing: -1px; margin-bottom: 32px; }
      .cover-norm { display: inline-block; background: ${goldColor}18; border: 1px solid ${goldColor}; color: ${goldColor}; font-size: 12px; font-weight: 600; padding: 6px 16px; border-radius: 20px; letter-spacing: 1px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .cover-bottom { border-top: 1px solid #e2e8f0; margin: 60px 48px 0; padding: 24px 0; display: flex; justify-content: space-between; align-items: flex-end; }
      .cover-company { font-size: 22px; font-weight: 700; color: ${color}; }
      .cover-meta { font-size: 11px; color: #64748b; line-height: 2; }
      .cover-confidential { font-size: 9px; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase; text-align: right; }
      @media print { .page-break { page-break-after: always; } body { padding: 20px; } .cover-top-bar { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } }
    </style>`;
}

function generateAuditReport(controls, controlAssessments, findings, risks, clauseAssessments, auditInfo, stats, selectedNorm) {
    const color = '#0D2137';
    const accentColor = '#1B6CA8';
    const goldColor = '#C47D2A';

    // Calculate maturity levels for clauses - use correct norm
    const clauses = selectedNorm === 'iso42001' ? (ISO42001_CLAUSES || []) : (ISO27001_CLAUSES || []);
    const clausesWithMaturity = clauses.map(cl => {
        const assessment = clauseAssessments[cl.id] || {};
        return {
            ...cl,
            maturityLevel: assessment.maturityLevel,
            targetLevel: assessment.targetLevel || 3,
            status: assessment.maturityLevel ? (assessment.maturityLevel >= (assessment.targetLevel || 3) ? 'Cumple' : 'Brecha') : 'Pendiente'
        };
    });

    // Calculate overall maturity — only for controls of the active norm
    const activeControlIds = new Set(controls.map(c => c.id));
    const allAssessments = Object.entries(controlAssessments)
        .filter(([id]) => activeControlIds.has(id))
        .map(([, a]) => a);
    const applicableControls = allAssessments.filter(a => a.applicable);
    const assessedControls = applicableControls.filter(a => a.maturityLevel !== null);
    const overallMaturity = assessedControls.length > 0
        ? (assessedControls.reduce((sum, a) => sum + (a.maturityLevel || 0), 0) / assessedControls.length).toFixed(1)
        : 0;

    // Calculate requirements maturity
    const evaluatedClauses = clausesWithMaturity.filter(cl => cl.maturityLevel !== null);
    const requirementsMaturity = evaluatedClauses.length > 0
        ? (evaluatedClauses.reduce((sum, cl) => sum + (cl.maturityLevel || 0), 0) / evaluatedClauses.length).toFixed(1)
        : 0;

    // Group findings by type (all findings, not just open)
    const ncMajor      = findings.filter(f => f.type === 'nc-major');
    const ncMinor      = findings.filter(f => f.type === 'nc-minor');
    const observations = findings.filter(f => f.type === 'observation');
    const opportunities= findings.filter(f => f.type === 'improvement' || f.type === 'opportunity' || f.type === 'ofi');
    const strengths    = findings.filter(f => f.type === 'strength');

    // Top recommendations based on most severe findings
    const topFindings = [...ncMajor, ...ncMinor, ...observations].slice(0, 5);

    // Overall SGSI maturity = average of controls + requirements maturity
    const sgsiMaturity = (parseFloat(overallMaturity) > 0 || parseFloat(requirementsMaturity) > 0)
        ? (((parseFloat(overallMaturity) || 0) + (parseFloat(requirementsMaturity) || 0)) / 2).toFixed(1)
        : 0;

    const progressPercent     = (overallMaturity / 5) * 100;
    const requirementsPercent = (requirementsMaturity / 5) * 100;
    const sgsiPercent         = (sgsiMaturity / 5) * 100;

    // Annex A domain maturity — dynamic by norm
    const ANNEX_DOMAINS = selectedNorm === 'iso42001' ? [
        { key: 'Gobernanza y Políticas',          label: 'A.2 — Gobernanza y Políticas'          },
        { key: 'Organización Interna',            label: 'A.3 — Organización Interna'            },
        { key: 'Recursos para Sistemas de IA',   label: 'A.4 — Recursos para Sistemas de IA'   },
        { key: 'Evaluación de Impactos',          label: 'A.5 — Evaluación de Impactos'          },
        { key: 'Ciclo de Vida de Sistemas de IA', label: 'A.6 — Ciclo de Vida de Sistemas de IA' },
        { key: 'Datos para Sistemas de IA',       label: 'A.7 — Datos para Sistemas de IA'       },
        { key: 'Información para Partes Interesadas', label: 'A.8 — Información para Partes Interesadas' },
        { key: 'Uso de Sistemas de IA',           label: 'A.9 — Uso de Sistemas de IA'           },
        { key: 'Relaciones con Terceros y Clientes', label: 'A.10 — Relaciones con Terceros y Clientes' },
    ] : [
        { key: 'Organizacionales', label: 'A.5 — Controles Organizacionales' },
        { key: 'Personas',         label: 'A.6 — Controles de Personas'       },
        { key: 'Físicos',          label: 'A.7 — Controles Físicos'           },
        { key: 'Tecnológicos',     label: 'A.8 — Controles Tecnológicos'      },
    ];
    const domainMaturity = ANNEX_DOMAINS.map(domain => {
        const domainControls = controls.filter(c => c.category === domain.key);
        const assessed = domainControls
            .map(c => controlAssessments[c.id])
            .filter(a => a && a.applicable && a.maturityLevel !== null && a.maturityLevel !== undefined);
        const avg = assessed.length > 0
            ? (assessed.reduce((s, a) => s + (a.maturityLevel || 0), 0) / assessed.length).toFixed(1)
            : null;
        return { ...domain, total: domainControls.length, assessed: assessed.length, avg };
    });

    // Pre-compute requirements table rows (avoids complex nesting inside template literal)
    const requirementRows = clausesWithMaturity.map(cl => {
        const pct = (cl.maturityLevel !== null && cl.maturityLevel !== undefined) ? Math.round((cl.maturityLevel / 5) * 100) : null;
        const pctColor = pct !== null ? (pct >= 60 ? '#16a34a' : pct >= 40 ? '#d97706' : '#dc2626') : '#94a3b8';
        const matStr = (cl.maturityLevel !== null && cl.maturityLevel !== undefined) ? cl.maturityLevel + '/5' : '—';
        const pctStr = pct !== null ? pct + '%' : '—';
        return `<tr>
          <td style="font-weight:600;color:${color};white-space:nowrap;">${escHtml(cl.id)}</td>
          <td>${escHtml(cl.name)}</td>
          <td style="text-align:center;font-weight:600;">${matStr}</td>
          <td style="text-align:center;font-weight:600;color:${pctColor};">${pctStr}</td>
        </tr>`;
    }).join('');

    // Pre-compute domain rows
    const domainRows = domainMaturity.map(d => {
        const pct = d.avg !== null ? Math.round((parseFloat(d.avg) / 5) * 100) : null;
        const pctColor = pct !== null ? (pct >= 60 ? '#16a34a' : pct >= 40 ? '#d97706' : '#dc2626') : '#94a3b8';
        const avgStr = d.avg !== null ? d.avg + '/5' : '—';
        const pctStr = pct !== null ? pct + '%' : '—';
        return `<tr>
          <td style="font-weight:600;color:${color};">${escHtml(d.label)}</td>
          <td style="text-align:center;">${d.assessed} de ${d.total}</td>
          <td style="text-align:center;font-weight:600;">${avgStr}</td>
          <td style="text-align:center;font-weight:600;color:${pctColor};">${pctStr}</td>
        </tr>`;
    }).join('');

    // Pre-compute findings cards per type
    const renderFindingCard = (f, prefix, idx, borderColor, bgColor, labelColor) => {
        const desc = f.description ? `<p style="font-size:12px;color:#475569;line-height:1.5;margin-bottom:8px;">${escHtml(f.description)}</p>` : '';
        const evi  = f.evidence ? `<p style="font-size:11px;color:#64748b;margin-bottom:6px;"><strong>Evidencia:</strong> ${escHtml(f.evidence)}</p>` : '';
        const rec  = f.recommendation ? `<p style="font-size:11px;color:#166534;background:#dcfce7;padding:6px 10px;border-radius:4px;margin:0;"><strong>Recomendación:</strong> ${escHtml(f.recommendation)}</p>` : '';
        const idStr = prefix + '-' + String(idx + 1).padStart(2, '0');
        return `<div style="border-left:4px solid ${borderColor};padding:12px 16px;margin-bottom:14px;background:${bgColor};border-radius:0 6px 6px 0;page-break-inside:avoid;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
            <strong style="font-size:13px;color:#1e293b;">${escHtml(f.title)}</strong>
            <span style="font-family:monospace;font-size:10px;color:${labelColor};font-weight:600;white-space:nowrap;margin-left:12px;">${idStr}</span>
          </div>${desc}${evi}${rec}
        </div>`;
    };

    const ncMajorCards    = ncMajor.map((f, i) => renderFindingCard(f, 'NCM', i, '#dc2626', '#fef2f2', '#dc2626')).join('');
    const ncMinorCards    = ncMinor.map((f, i) => renderFindingCard(f, 'NCm', i, '#ea580c', '#fff7ed', '#ea580c')).join('');
    const observCards     = observations.map((f, i) => renderFindingCard(f, 'OBS', i, '#1d4ed8', '#eff6ff', '#1d4ed8')).join('');
    const oppCards        = opportunities.map((f, i) => renderFindingCard(f, 'OFI', i, '#16a34a', '#f0fdf4', '#16a34a')).join('');
    const strengthCards   = strengths.map((f, i) => renderFindingCard(f, 'FOR', i, '#7c3aed', '#faf5ff', '#7c3aed')).join('');

    const findingsSection = [
        findings.length === 0 ? '<p style="color:#64748b;font-style:italic;">No se han registrado hallazgos.</p>' : '',
        ncMajor.length > 0 ? `<h3 style="color:#dc2626;margin-top:28px;margin-bottom:14px;font-size:14px;text-transform:uppercase;letter-spacing:0.5px;">No Conformidades Mayores (${ncMajor.length})</h3>${ncMajorCards}` : '',
        ncMinor.length > 0 ? `<h3 style="color:#ea580c;margin-top:28px;margin-bottom:14px;font-size:14px;text-transform:uppercase;letter-spacing:0.5px;">No Conformidades Menores (${ncMinor.length})</h3>${ncMinorCards}` : '',
        observations.length > 0 ? `<h3 style="color:#0c4a6e;margin-top:28px;margin-bottom:14px;font-size:14px;text-transform:uppercase;letter-spacing:0.5px;">Observaciones (${observations.length})</h3>${observCards}` : '',
        opportunities.length > 0 ? `<h3 style="color:#15803d;margin-top:28px;margin-bottom:14px;font-size:14px;text-transform:uppercase;letter-spacing:0.5px;">Oportunidades de Mejora (${opportunities.length})</h3>${oppCards}` : '',
        strengths.length > 0 ? `<h3 style="color:#7c3aed;margin-top:28px;margin-bottom:14px;font-size:14px;text-transform:uppercase;letter-spacing:0.5px;">Fortalezas Identificadas (${strengths.length})</h3>${strengthCards}` : '',
    ].join('');

    return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Informe de Auditoría — ${escHtml(auditInfo.normVersion || 'ISO 27001:2022')}</title>${buildStyles(color, goldColor)}</head><body>

<!-- PORTADA -->
<div class="cover-page">
  <div class="cover-top-bar">
    <div class="cover-brand">AONIK<strong>LABS</strong></div>
    <div class="cover-tagline">APPLIED TECHNOLOGY THINK TANK</div>
  </div>
  <div class="cover-body">
    <div class="cover-divider"></div>
    <div class="cover-pre">Informe Oficial</div>
    <div class="cover-title">AUDITORÍA</div>
    <div class="cover-subtitle">DE SEGURIDAD</div>
    <span class="cover-norm">${escHtml(auditInfo.normVersion || 'ISO 27001:2022')}</span>
  </div>
  <div class="cover-bottom">
    <div>
      <div class="cover-company">${escHtml(auditInfo.auditedCompany || auditInfo.organization || 'Empresa Auditada')}</div>
      <div class="cover-meta">
        Período: ${formatDate(auditInfo.startDate)} — ${formatDate(auditInfo.endDate)}<br>
        Auditor: ${escHtml(auditInfo.auditor || '—')} · ${escHtml(auditInfo.auditorOrg || 'AonikLabs')}<br>
        Fecha de emisión: ${formatDate(new Date())}
      </div>
    </div>
    <div class="cover-confidential">Documento Confidencial<br>Uso exclusivo de la organización auditada</div>
  </div>
</div>

<!-- SECCIÓN 1: INFORMACIÓN GENERAL -->
<div class="page-break"></div>
<h2 style="color: ${color}; font-size: 20px; border-bottom: 3px solid ${goldColor}; padding-bottom: 8px; margin-bottom: 20px;">1. Información General</h2>
<table>
  <thead><tr><th>Parámetro</th><th>Valor</th></tr></thead>
  <tbody>
    <tr><td><strong>Empresa auditada</strong></td><td>${escHtml(auditInfo.auditedCompany || auditInfo.organization || '—')}</td></tr>
    <tr><td><strong>Sector / Industria</strong></td><td>${escHtml(auditInfo.companySector || '—')}</td></tr>
    <tr><td><strong>Persona de contacto</strong></td><td>${escHtml(auditInfo.contactPerson || '—')}</td></tr>
    <tr><td><strong>Alcance SGSI</strong></td><td>${escHtml(auditInfo.sgsiScope || auditInfo.scope || '—')}</td></tr>
    <tr><td><strong>Tipo de auditoría</strong></td><td>${escHtml(auditInfo.auditType === 'interna' ? 'Interna' : 'Externa')}</td></tr>
    <tr><td><strong>Auditor</strong></td><td>${escHtml(auditInfo.auditor || '—')}</td></tr>
    <tr><td><strong>Organización auditora</strong></td><td>${escHtml(auditInfo.auditorOrg || 'AonikLabs')}</td></tr>
    <tr><td><strong>Período de auditoría</strong></td><td>${formatDate(auditInfo.startDate)} — ${formatDate(auditInfo.endDate)}</td></tr>
    <tr><td><strong>Norma aplicable</strong></td><td>${escHtml(auditInfo.normVersion || 'ISO 27001:2022')}</td></tr>
  </tbody>
</table>

<!-- SECCIÓN 2: DASHBOARD EJECUTIVO DE MADUREZ -->
<div class="page-break"></div>
<h2 style="color: ${color}; font-size: 20px; border-bottom: 3px solid ${goldColor}; padding-bottom: 8px; margin-bottom: 20px;">2. Dashboard Ejecutivo de Madurez</h2>

<div class="kpi-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 32px;">
  <div class="kpi" style="border-left: 4px solid ${color}; text-align: center;">
    <div class="kpi-label" style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Madurez del SGSI</div>
    <div class="kpi-value" style="font-size: 40px; margin: 10px 0; color: ${color};">${sgsiMaturity}<span style="font-size:16px; color:#64748b;">/5</span></div>
    <div class="progress-bar" style="background: #e2e8f0;"><div class="progress-fill" style="width: ${sgsiPercent}%; background: ${color};"></div></div>
    <div class="kpi-label" style="margin-top: 6px; font-size: 10px; color: #64748b;">Promedio integral</div>
  </div>

  <div class="kpi" style="border-left: 4px solid ${accentColor}; text-align: center;">
    <div class="kpi-label" style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Madurez de Requisitos</div>
    <div class="kpi-value" style="font-size: 40px; margin: 10px 0; color: ${accentColor};">${requirementsMaturity}<span style="font-size:16px; color:#64748b;">/5</span></div>
    <div class="progress-bar" style="background: #e2e8f0;"><div class="progress-fill" style="width: ${requirementsPercent}%; background: ${accentColor};"></div></div>
    <div class="kpi-label" style="margin-top: 6px; font-size: 10px; color: #64748b;">${evaluatedClauses.length} de ${clauses.length} cláusulas</div>
  </div>

  <div class="kpi" style="border-left: 4px solid ${goldColor}; text-align: center;">
    <div class="kpi-label" style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Madurez de Controles</div>
    <div class="kpi-value" style="font-size: 40px; margin: 10px 0; color: ${goldColor};">${overallMaturity}<span style="font-size:16px; color:#64748b;">/5</span></div>
    <div class="progress-bar" style="background: #e2e8f0;"><div class="progress-fill" style="width: ${progressPercent}%; background: ${goldColor};"></div></div>
    <div class="kpi-label" style="margin-top: 6px; font-size: 10px; color: #64748b;">${assessedControls.length} de ${applicableControls.length} controles</div>
  </div>
</div>

<h3>Resumen de Hallazgos</h3>
<table>
  <thead><tr><th>Tipo de Hallazgo</th><th style="text-align: center;">Cantidad</th></tr></thead>
  <tbody>
    <tr><td><span class="badge badge-nc-major">NC Mayor</span></td><td style="text-align: center; font-weight: 700; color: #dc2626;">${ncMajor.length}</td></tr>
    <tr><td><span class="badge badge-nc-minor">NC Menor</span></td><td style="text-align: center; font-weight: 700; color: #ea580c;">${ncMinor.length}</td></tr>
    <tr><td><span class="badge badge-observation">Observación</span></td><td style="text-align: center; font-weight: 700; color: #0c4a6e;">${observations.length}</td></tr>
    <tr><td><span class="badge badge-opportunity">Oportunidad de Mejora</span></td><td style="text-align: center; font-weight: 700; color: #15803d;">${opportunities.length}</td></tr>
    <tr><td><span class="badge" style="background:#ede9fe;color:#7c3aed;">Fortaleza</span></td><td style="text-align: center; font-weight: 700; color: #7c3aed;">${strengths.length}</td></tr>
  </tbody>
</table>

<!-- SECCIÓN 3: EVALUACIÓN DE REQUISITOS Y CONTROLES -->
<div class="page-break"></div>
<h2 style="color: ${color}; font-size: 20px; border-bottom: 3px solid ${goldColor}; padding-bottom: 8px; margin-bottom: 20px;">3. Evaluación de Requisitos y Controles</h2>

<h3 style="margin-bottom: 12px;">3.1 Requisitos del SGSI (Cláusulas 4–10)</h3>
<table>
  <thead><tr><th>Cláusula</th><th>Requisito</th><th style="text-align:center;">Madurez</th><th style="text-align:center;">% Cumplimiento</th></tr></thead>
  <tbody>${requirementRows}</tbody>
</table>

<h3 style="margin-top: 28px; margin-bottom: 12px;">3.2 Evaluación por Dominio — Anexo A</h3>
<table>
  <thead><tr><th>Dominio</th><th style="text-align:center;">Controles Evaluados</th><th style="text-align:center;">Madurez Promedio</th><th style="text-align:center;">% Cumplimiento</th></tr></thead>
  <tbody>${domainRows}</tbody>
</table>

<!-- SECCIÓN 4: HALLAZGOS -->
<div class="page-break"></div>
<h2 style="color: ${color}; font-size: 20px; border-bottom: 3px solid ${goldColor}; padding-bottom: 8px; margin-bottom: 20px;">4. Hallazgos</h2>
${findingsSection}

<!-- SECCIÓN 5: CONCLUSIONES Y RECOMENDACIONES -->
<div class="page-break"></div>
<h2 style="color: ${color}; font-size: 20px; border-bottom: 3px solid ${goldColor}; padding-bottom: 8px; margin-bottom: 20px;">5. Conclusiones y Recomendaciones</h2>

<h3>Conclusiones</h3>
<p style="line-height: 1.6; margin-bottom: 16px;">
  Se ha completado la auditoría de seguridad de la información basada en ${escHtml(auditInfo.normVersion || 'ISO 27001:2022')} para
  <strong>${escHtml(auditInfo.auditedCompany || auditInfo.organization || 'la organización')}</strong> en el período de
  ${formatDate(auditInfo.startDate)} a ${formatDate(auditInfo.endDate)}.
</p>
<p style="line-height: 1.6; margin-bottom: 16px;">
  <strong>Madurez del SGSI: ${sgsiMaturity}/5</strong><br>
  La madurez de requisitos (cláusulas 4–10) alcanzó <strong>${requirementsMaturity}/5</strong>, mientras que la madurez de controles (Anexo A) resultó en <strong>${overallMaturity}/5</strong>, con ${assessedControls.length} de ${applicableControls.length} controles aplicables evaluados.
</p>
<p style="line-height: 1.6; margin-bottom: 16px;">
  <strong>Hallazgos Identificados:</strong><br>
  Se identificaron <strong>${findings.length} hallazgos</strong> en total:
  ${ncMajor.length} no conformidades mayores, ${ncMinor.length} no conformidades menores,
  ${observations.length} observaciones, ${opportunities.length} oportunidades de mejora
  ${strengths.length > 0 ? `y ${strengths.length} fortalezas` : ''}.
</p>

<h3 style="margin-top: 24px;">Recomendaciones Prioritarias</h3>
${topFindings.length > 0 ? `
<ol style="line-height: 1.8; font-size: 12px;">
  ${topFindings.map((f, idx) => `
    <li><strong>${escHtml(f.title)}</strong><br><span style="color: #64748b; font-size: 11px;">${escHtml((f.recommendation || f.description || '').substring(0, 200))}</span></li>
  `).join('')}
</ol>
` : '<p style="color: #64748b; font-style: italic;">No hay recomendaciones pendientes.</p>'}

<p style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; line-height: 1.6;">
  <strong>Notas:</strong> Este informe es confidencial y está destinado únicamente al uso de ${escHtml(auditInfo.auditedCompany || auditInfo.organization || 'la organización')}
  auditada. Las recomendaciones deben ser revisadas y priorizadas por la dirección de la organización.
  Se recomienda un seguimiento trimestral de la implementación de las acciones correctivas identificadas.
</p>

<div class="footer" style="margin-top: 60px;">
  <span>${escHtml(auditInfo.auditorOrg || 'AonikLabs')} — Applied Technology Think Tank</span>
  <span>Confidencial | ${formatDate(new Date())}</span>
</div>

</body></html>`;
}

function generateGapReport(controls, controlAssessments, auditInfo, selectedNorm) {
    const isAI = selectedNorm === 'iso42001';
    const normLabel = isAI ? 'ISO 42001:2023' : 'ISO 27001:2022';
    const cats = isAI ? ISO42001_CONTROL_CATEGORIES : CONTROL_CATEGORIES;
    const rows = controls.map(c => {
        const a = controlAssessments[c.id] || {};
        const ml = a.maturityLevel;
        const tl = a.targetLevel ?? 3;
        const gap = ml !== null && ml !== undefined ? Math.max(0, tl - ml) : null;
        const status = !a.applicable ? 'N/A' : ml === null || ml === undefined ? 'Pendiente' : gap > 0 ? 'Brecha' : 'Cumple';
        return { c, a, ml, tl, gap, status };
    });
    const evaluated = rows.filter(r => r.a.applicable && r.ml !== null && r.ml !== undefined);
    const gaps = rows.filter(r => r.gap !== null && r.gap > 0);

    const color = '#3b82f6';
    return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Gap Analysis — ${normLabel}</title>${buildStyles(color)}</head><body>
    <div class="header">
      <h1>Gap Analysis — Controles ${normLabel} (Anexo A)</h1>
      <div class="meta">${escHtml(auditInfo.organization || 'Organización')} &nbsp;·&nbsp; Auditor: ${escHtml(auditInfo.auditor || '—')} &nbsp;·&nbsp; Generado: ${formatDate(new Date())}</div>
    </div>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-value">${evaluated.length}</div><div class="kpi-label">Controles evaluados</div></div>
      <div class="kpi"><div class="kpi-value">${controls.length}</div><div class="kpi-label">Total controles</div></div>
      <div class="kpi"><div class="kpi-value">${gaps.length}</div><div class="kpi-label">Con brecha</div></div>
      <div class="kpi"><div class="kpi-value">${evaluated.length > 0 ? Math.round(evaluated.reduce((s,r) => s + r.ml, 0) / evaluated.length * 10) / 10 : '—'}</div><div class="kpi-label">Madurez promedio</div></div>
    </div>
    ${cats.map(cat => {
        const catRows = rows.filter(r => r.c.category === cat.name);
        if (!catRows.length) return '';
        return `<h2>${escHtml(cat.name)} (${catRows.length} controles)</h2>
        <table>
          <thead><tr><th>ID</th><th>Control</th><th>Nivel Actual</th><th>Nivel Objetivo</th><th>Brecha</th><th>Estado</th><th>Evidencia</th></tr></thead>
          <tbody>${catRows.map(r => `
            <tr>
              <td style="font-family:monospace;white-space:nowrap">${escHtml(r.c.id)}</td>
              <td>${escHtml(r.c.name)}</td>
              <td>${r.ml !== null && r.ml !== undefined ? r.ml : '—'}</td>
              <td>${r.tl}</td>
              <td>${r.gap !== null ? (r.gap > 0 ? `<span style="color:#ef4444;font-weight:600">−${r.gap}</span>` : '<span style="color:#22c55e">✓</span>') : '—'}</td>
              <td><span class="badge badge-${r.status === 'Brecha' ? 'high' : r.status === 'Cumple' ? 'low' : 'pending'}">${escHtml(r.status)}</span></td>
              <td style="font-size:11px;color:#64748b">${escHtml(r.a.evidence || '')}</td>
            </tr>`).join('')}
          </tbody>
        </table>`;
    }).join('')}
    <div class="footer"><span>AuditIA — AonikLabs</span><span>${formatDate(new Date())}</span></div>
    </body></html>`;
}

function generateRiskReport(risks, auditInfo, selectedNorm) {
    const normLabel = selectedNorm === 'iso42001' ? 'ISO 42001:2023' : 'ISO 27001:2022';
    const color = '#ef4444';
    const total = risks.length;
    const [nCritico, nMuyAlto, nAlto, nMedio] = countByCiaLevel(risks, ['Crítico', 'Muy Alto', 'Alto', 'Medio']);
    const nAltosCriticos = nCritico + nMuyAlto;

    return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación de Riesgos — ${normLabel}</title>${buildStyles(color)}</head><body>
    <div class="header">
      <h1>Evaluación de Riesgos — ${normLabel}</h1>
      <div class="meta">${escHtml(auditInfo.organization||'Organización')} &nbsp;·&nbsp; Auditor: ${escHtml(auditInfo.auditor||'—')} &nbsp;·&nbsp; Generado: ${formatDate(new Date())}</div>
    </div>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-value">${total}</div><div class="kpi-label">Total riesgos</div></div>
      <div class="kpi"><div class="kpi-value" style="color:#dc2626">${nAltosCriticos}</div><div class="kpi-label">Críticos / Muy Altos</div></div>
      <div class="kpi"><div class="kpi-value" style="color:#f97316">${nAlto}</div><div class="kpi-label">Altos</div></div>
      <div class="kpi"><div class="kpi-value" style="color:#eab308">${nMedio}</div><div class="kpi-label">Medios</div></div>
    </div>
    <table>
      <thead><tr><th>ID</th><th>Riesgo</th><th>Tipo Activo</th><th>CIA</th><th>Probabilidad</th><th>Valor</th><th>Nivel</th><th>Residual</th><th>Estado</th><th>Responsable</th><th>F. Objetivo</th></tr></thead>
      <tbody>${risks.map(r => {
          const { label, color: c, cls } = riskLevelFromCia(r);
          const residualLevel = r.clasificacionResidual
              ? riskLevelFromCia({ impactoNivel: r.clasificacionResidual })
              : { label: '—', cls: 'pending' };
          const ciaStr = (r.nivelConfidencialidad && r.nivelIntegridad && r.nivelDisponibilidad && r.nivelPrivacidad)
              ? `C:${r.nivelConfidencialidad[0]} I:${r.nivelIntegridad[0]} D:${r.nivelDisponibilidad[0]} P:${r.nivelPrivacidad[0]}`
              : '—';
          const statusMap = { 'identificado':'Identificado', 'en-tratamiento':'En tratamiento', 'mitigado':'Mitigado', 'aceptado':'Aceptado', 'cerrado':'Cerrado' };
          return `<tr>
            <td style="font-family:monospace;white-space:nowrap">R-${escHtml(r.id)}</td>
            <td><strong>${escHtml(r.name||r.title)}</strong><br><span style="color:#64748b;font-size:11px">${escHtml((r.description||'').substring(0,90))}</span></td>
            <td style="font-size:11px">${escHtml(r.tipoActivo||'—')}</td>
            <td style="font-family:monospace;font-size:11px;white-space:nowrap">${escHtml(ciaStr)}</td>
            <td style="font-size:11px;white-space:nowrap">${escHtml(r.probabilidadNivel||'—')}</td>
            <td style="font-weight:700;color:${c}">${r.valorRiesgo != null ? parseFloat(r.valorRiesgo).toFixed(2) : '—'}</td>
            <td><span class="badge badge-${cls}">${escHtml(label)}</span></td>
            <td><span class="badge badge-${residualLevel.cls}">${escHtml(residualLevel.label)}</span></td>
            <td style="font-size:11px">${escHtml(statusMap[r.status]||r.status||'—')}</td>
            <td style="font-size:11px">${escHtml(r.owner||'—')}</td>
            <td style="white-space:nowrap;font-size:11px">${formatDate(r.targetDate)}</td>
          </tr>`;
      }).join('')}</tbody>
    </table>
    <div class="footer"><span>AuditIA — AonikLabs</span><span>${formatDate(new Date())}</span></div>
    </body></html>`;
}

function generateFindingsReport(findings, auditInfo, selectedNorm) {
    const normLabel = selectedNorm === 'iso42001' ? 'ISO 42001:2023' : 'ISO 27001:2022';
    const color = '#f97316';
    const open = findings.filter(f => f.status === 'abierto' || f.status === 'open').length;
    return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Informe de Hallazgos — ${normLabel}</title>${buildStyles(color)}</head><body>
    <div class="header">
      <h1>Informe de Hallazgos — ${normLabel}</h1>
      <div class="meta">${escHtml(auditInfo.organization||'Organización')} &nbsp;·&nbsp; Auditor: ${escHtml(auditInfo.auditor||'—')} &nbsp;·&nbsp; Generado: ${formatDate(new Date())}</div>
    </div>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-value">${findings.length}</div><div class="kpi-label">Total hallazgos</div></div>
      <div class="kpi"><div class="kpi-value" style="color:#ef4444">${open}</div><div class="kpi-label">Abiertos</div></div>
      <div class="kpi"><div class="kpi-value">${findings.filter(f=>f.status==='cerrado'||f.status==='closed').length}</div><div class="kpi-label">Cerrados</div></div>
      <div class="kpi"><div class="kpi-value">${findings.filter(f=>f.severity==='critical'||f.severity==='high').length}</div><div class="kpi-label">Críticos / Altos</div></div>
    </div>
    <table>
      <thead><tr><th>ID</th><th>Título</th><th>Tipo</th><th>Severidad</th><th>Estado</th><th>Controles</th><th>Descripción</th><th>Fecha</th></tr></thead>
      <tbody>${findings.map(f => {
          const sevMap = { critical:'critical', high:'high', medium:'medium', low:'low' };
          const stMap = { abierto:'open', open:'open', cerrado:'closed', closed:'closed', 'en-proceso':'progress', 'in-progress':'progress' };
          const controls = (f.controls||[]).map(c=>c.id).join(', ') || '—';
          return `<tr>
            <td style="font-family:monospace">H-${escHtml(f.id)}</td>
            <td><strong>${escHtml(f.title)}</strong></td>
            <td>${escHtml(f.type||'—')}</td>
            <td><span class="badge badge-${sevMap[f.severity]||'pending'}">${escHtml(f.severity||'—')}</span></td>
            <td><span class="badge badge-${stMap[f.status]||'pending'}">${escHtml(f.status||'—')}</span></td>
            <td style="font-family:monospace;font-size:11px">${escHtml(controls)}</td>
            <td style="font-size:11px">${escHtml((f.description||'').substring(0,120))}</td>
            <td style="white-space:nowrap">${formatDate(f.createdAt)}</td>
          </tr>`;
      }).join('')}</tbody>
    </table>
    <div class="footer"><span>AuditIA — AonikLabs</span><span>${formatDate(new Date())}</span></div>
    </body></html>`;
}

function generateComplianceSummary(controls, controlAssessments, risks, findings, clauseAssessments, auditInfo, selectedNorm) {
    const color = '#8b5cf6';
    const evaluated = controls.filter(c => {
        const a = controlAssessments[c.id];
        return a && a.maturityLevel !== null && a.maturityLevel !== undefined;
    });
    const avgMaturity = evaluated.length
        ? (evaluated.reduce((s,c) => s + controlAssessments[c.id].maturityLevel, 0) / evaluated.length).toFixed(1)
        : '—';
    const compliance = controls.length ? Math.round(evaluated.length / controls.length * 100) : 0;

    const cats = selectedNorm === 'iso42001' ? ISO42001_CONTROL_CATEGORIES : CONTROL_CATEGORIES;
    const domainRows = cats.map(cat => {
        const catControls = controls.filter(c => c.category === cat.name);
        const catEval = catControls.filter(c => {
            const a = controlAssessments[c.id];
            return a && a.maturityLevel !== null && a.maturityLevel !== undefined;
        });
        const avg = catEval.length
            ? (catEval.reduce((s,c) => s + controlAssessments[c.id].maturityLevel, 0) / catEval.length).toFixed(1)
            : '—';
        return { cat, catControls, catEval, avg };
    });

    const normLabel = selectedNorm === 'iso42001' ? 'ISO 42001:2023' : 'ISO 27001:2022';
    return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Resumen Ejecutivo — ${normLabel}</title>${buildStyles(color)}</head><body>
    <div class="header">
      <h1>Resumen Ejecutivo de Cumplimiento — ${normLabel}</h1>
      <div class="meta">${escHtml(auditInfo.organization||'Organización')} &nbsp;·&nbsp; Alcance: ${escHtml(auditInfo.scope||'—')} &nbsp;·&nbsp; Generado: ${formatDate(new Date())}</div>
    </div>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-value">${compliance}%</div><div class="kpi-label">Cobertura de evaluación</div></div>
      <div class="kpi"><div class="kpi-value">${avgMaturity}</div><div class="kpi-label">Madurez promedio (0-5)</div></div>
      <div class="kpi"><div class="kpi-value" style="color:#ef4444">${countByCiaLevel(risks,['Crítico','Muy Alto']).reduce((a,b)=>a+b,0)}</div><div class="kpi-label">Riesgos críticos/muy altos</div></div>
      <div class="kpi"><div class="kpi-value" style="color:#f97316">${findings.filter(f=>f.status==='abierto'||f.status==='open').length}</div><div class="kpi-label">Hallazgos abiertos</div></div>
    </div>
    <h2>Cumplimiento por Dominio (Anexo A)</h2>
    <table>
      <thead><tr><th>Dominio</th><th>Controles</th><th>Evaluados</th><th>Cobertura</th><th>Madurez Promedio</th></tr></thead>
      <tbody>${domainRows.map(d => `
        <tr>
          <td>${escHtml(d.cat.name)}</td>
          <td>${d.catControls.length}</td>
          <td>${d.catEval.length}</td>
          <td>${d.catControls.length ? Math.round(d.catEval.length/d.catControls.length*100) : 0}%</td>
          <td>${d.avg}</td>
        </tr>`).join('')}
      </tbody>
    </table>
    <h2>Estado de Riesgos</h2>
    <table>
      <thead><tr><th>Nivel</th><th>Cantidad</th></tr></thead>
      <tbody>${['Crítico','Muy Alto','Alto','Medio','Bajo','Muy Bajo'].map(lvl => {
        const [n] = countByCiaLevel(risks, [lvl]);
        if (n === 0) return '';
        const cls = ['Crítico','Muy Alto'].includes(lvl)?'critical':lvl==='Alto'?'high':lvl==='Medio'?'medium':'low';
        return `<tr><td><span class="badge badge-${cls}">${lvl}</span></td><td>${n}</td></tr>`;
      }).join('')}
      </tbody>
    </table>
    <div class="footer"><span>AuditIA — AonikLabs</span><span>${formatDate(new Date())}</span></div>
    </body></html>`;
}

function generateRequirementsReport(clauseAssessments, auditInfo, selectedNorm) {
    const normLabel = selectedNorm === 'iso42001' ? 'ISO 42001:2023' : 'ISO 27001:2022';
    const color = '#06b6d4';
    const clauses = selectedNorm === 'iso42001' ? (ISO42001_CLAUSES || []) : (ISO27001_CLAUSES || []);
    const evaluated = clauses.filter(cl => clauseAssessments[cl.id]?.maturityLevel != null);
    return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Requisitos — ${normLabel}</title>${buildStyles(color)}</head><body>
    <div class="header">
      <h1>Evaluación de Requisitos (Cláusulas 4–10) — ${normLabel}</h1>
      <div class="meta">${escHtml(auditInfo.organization||'Organización')} &nbsp;·&nbsp; Auditor: ${escHtml(auditInfo.auditor||'—')} &nbsp;·&nbsp; Generado: ${formatDate(new Date())}</div>
    </div>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-value">${evaluated.length}/${clauses.length}</div><div class="kpi-label">Cláusulas evaluadas</div></div>
      <div class="kpi"><div class="kpi-value">${evaluated.length > 0 ? (evaluated.reduce((s,cl) => s + (clauseAssessments[cl.id]?.maturityLevel||0), 0) / evaluated.length).toFixed(1) : '—'}</div><div class="kpi-label">Madurez promedio</div></div>
    </div>
    <table>
      <thead><tr><th>Cláusula</th><th>Requisito</th><th>Nivel de Madurez</th><th>Nivel Objetivo</th><th>Observaciones</th></tr></thead>
      <tbody>${clauses.map(cl => {
          const a = clauseAssessments[cl.id] || {};
          return `<tr>
            <td style="font-family:monospace;font-weight:600">${escHtml(cl.id)}</td>
            <td>${escHtml(cl.name||cl.title||cl.id)}</td>
            <td>${a.maturityLevel !== null && a.maturityLevel !== undefined ? a.maturityLevel : '—'}</td>
            <td>${a.targetLevel || 3}</td>
            <td style="font-size:11px;color:#64748b">${escHtml(a.evidence||a.notes||'')}</td>
          </tr>`;
      }).join('')}</tbody>
    </table>
    <div class="footer"><span>AuditIA — AonikLabs</span><span>${formatDate(new Date())}</span></div>
    </body></html>`;
}

// ─── Component ─────────────────────────────────────────────────────────────

const Reportes = () => {
    const { controls, controlAssessments, findings, risks, clauseAssessments, auditInfo, getStatistics, selectedNorm } = useAudit();
    const [generating, setGenerating] = useState(null);

    const REPORT_TEMPLATES = getReportTemplates(selectedNorm);

    const buildHtml = (templateId) => {
        switch (templateId) {
            case 'audit-report':       return generateAuditReport(controls, controlAssessments, findings, risks, clauseAssessments, auditInfo, getStatistics(), selectedNorm);
            case 'gap-analysis':       return generateGapReport(controls, controlAssessments, auditInfo, selectedNorm);
            case 'risk-assessment':    return generateRiskReport(risks, auditInfo, selectedNorm);
            case 'findings':           return generateFindingsReport(findings, auditInfo, selectedNorm);
            case 'compliance-summary': return generateComplianceSummary(controls, controlAssessments, risks, findings, clauseAssessments, auditInfo, selectedNorm);
            case 'requirements':       return generateRequirementsReport(clauseAssessments, auditInfo, selectedNorm);
            default:                   return null;
        }
    };

    const normPrefix = selectedNorm === 'iso42001' ? 'ISO42001' : 'ISO27001';

    const generate = (templateId) => {
        setGenerating(templateId);
        setTimeout(() => {
            try {
                const html = buildHtml(templateId);
                if (!html) { setGenerating(null); return; }
                const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${normPrefix}_${templateId}_${new Date().toISOString().split('T')[0]}.html`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (err) {
                console.error('Error generando reporte:', err);
                alert('Error al generar el reporte: ' + (err.message || err));
            } finally {
                setGenerating(null);
            }
        }, 400);
    };

    const openPreview = (templateId) => {
        setGenerating(templateId + '-preview');
        setTimeout(() => {
            try {
                const html = buildHtml(templateId);
                if (!html) { setGenerating(null); return; }
                const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
            } catch (err) {
                console.error('Error generando vista previa:', err);
                alert('Error al generar la vista previa: ' + (err.message || err));
            } finally {
                setGenerating(null);
            }
        }, 300);
    };

    return (
        <div className="reportes-page">
            <div className="reportes-header card">
                <div className="reportes-header-left">
                    <h1 className="reportes-title">
                        <Download size={24} />
                        Exportar Informes
                    </h1>
                    <p className="reportes-subtitle">
                        Generá reportes HTML listos para imprimir o convertir a PDF desde el navegador.
                        Los datos se toman en tiempo real del estado actual de la auditoría.
                    </p>
                </div>
                <div className="reportes-tip">
                    <CheckCircle size={16} />
                    <span>Abrí el preview, luego <strong>Archivo → Imprimir → Guardar como PDF</strong></span>
                </div>
            </div>

            <div className="reportes-grid">
                {REPORT_TEMPLATES.map(tmpl => {
                    const Icon = tmpl.icon;
                    const isGen = generating === tmpl.id;
                    const isPrev = generating === tmpl.id + '-preview';
                    return (
                        <div key={tmpl.id} className="reporte-card card" style={{ borderTop: `3px solid ${tmpl.color}` }}>
                            <div className="reporte-card-icon" style={{ background: tmpl.color + '18', color: tmpl.color }}>
                                <Icon size={22} />
                            </div>
                            <div className="reporte-card-content">
                                <h3 className="reporte-card-title">{tmpl.title}</h3>
                                <p className="reporte-card-desc">{tmpl.description}</p>
                            </div>
                            <div className="reporte-card-actions">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => openPreview(tmpl.id)}
                                    disabled={!!generating}
                                >
                                    {isPrev ? <Loader size={14} className="spin" /> : <FileText size={14} />}
                                    Vista previa
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => generate(tmpl.id)}
                                    disabled={!!generating}
                                    style={{ background: tmpl.color, borderColor: tmpl.color }}
                                >
                                    {isGen ? <Loader size={14} className="spin" /> : <Download size={14} />}
                                    Descargar HTML
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Reportes;
