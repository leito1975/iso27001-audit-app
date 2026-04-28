import jsPDF from 'jspdf';

export const generateAuditReport = (auditData, statistics) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    const addTitle = (text, size = 18) => {
        doc.setFontSize(size);
        doc.setFont(undefined, 'bold');
        doc.text(text, pageWidth / 2, yPos, { align: 'center' });
        yPos += size / 2 + 5;
    };

    const addSection = (title) => {
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(59, 130, 246);
        doc.text(title, 20, yPos);
        yPos += 8;
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'normal');
    };

    const addText = (text, indent = 20) => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
        doc.setFontSize(10);
        const lines = doc.splitTextToSize(text, pageWidth - 40);
        doc.text(lines, indent, yPos);
        yPos += lines.length * 5 + 3;
    };

    const addKeyValue = (key, value) => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text(`${key}:`, 25, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(String(value || 'N/A'), 80, yPos);
        yPos += 6;
    };

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 50, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('ISO 27001 AUDIT REPORT', pageWidth / 2, 25, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(auditData.auditInfo?.name || 'Auditoría ISO 27001', pageWidth / 2, 38, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    yPos = 60;

    // Audit Information
    addSection('1. Información de la Auditoría');
    addKeyValue('Organización', auditData.auditInfo?.organization);
    addKeyValue('Auditor Principal', auditData.auditInfo?.auditor);
    addKeyValue('Fecha de Inicio', auditData.auditInfo?.startDate);
    addKeyValue('Fecha de Fin', auditData.auditInfo?.endDate);
    addKeyValue('Alcance', auditData.auditInfo?.scope);
    yPos += 5;

    // Executive Summary
    addSection('2. Resumen Ejecutivo');
    addKeyValue('Total de Controles', statistics.totalControls);
    addKeyValue('Controles Evaluados', statistics.assessedControls);
    addKeyValue('Tasa de Cumplimiento', `${statistics.complianceRate}%`);
    addKeyValue('Madurez Promedio', `${statistics.avgMaturity}/5`);
    addKeyValue('Brechas Identificadas', statistics.gapControls);
    yPos += 5;

    // Findings Summary
    addSection('3. Resumen de Hallazgos');
    addKeyValue('Total de Hallazgos', statistics.findings?.total || 0);
    addKeyValue('No Conformidades Mayores', statistics.findings?.ncMajor || 0);
    addKeyValue('No Conformidades Menores', statistics.findings?.ncMinor || 0);
    addKeyValue('Hallazgos Abiertos', statistics.findings?.open || 0);
    addKeyValue('Hallazgos Cerrados', statistics.findings?.closed || 0);
    yPos += 5;

    // Risks Summary
    addSection('4. Resumen de Riesgos');
    addKeyValue('Total de Riesgos', statistics.risks?.total || 0);
    addKeyValue('Riesgos Activos', statistics.risks?.open || 0);
    addKeyValue('Riesgos Críticos', statistics.risks?.critical || 0);
    yPos += 5;

    // Action Plans Summary
    if (statistics.actionPlans) {
        addSection('5. Planes de Acción');
        addKeyValue('Total de Acciones', statistics.actionPlans.total);
        addKeyValue('Acciones Pendientes', statistics.actionPlans.pending);
        addKeyValue('Acciones En Progreso', statistics.actionPlans.inProgress);
        addKeyValue('Acciones Completadas', statistics.actionPlans.completed);
        addKeyValue('Acciones Vencidas', statistics.actionPlans.overdue);
        yPos += 5;
    }

    // Maturity by Category
    doc.addPage();
    yPos = 20;
    addSection('6. Madurez por Categoría');

    Object.entries(statistics.byCategory || {}).forEach(([category, data]) => {
        const avgMaturity = data.assessed > 0
            ? (data.totalMaturity / data.assessed).toFixed(2)
            : 'N/A';
        const compliance = data.total > 0
            ? Math.round((data.compliant / data.total) * 100)
            : 0;

        addKeyValue(category, `Madurez: ${avgMaturity}/5 | Cumplimiento: ${compliance}%`);
    });
    yPos += 5;

    // Detailed Findings
    if (auditData.findings?.length > 0) {
        doc.addPage();
        yPos = 20;
        addSection('7. Detalle de Hallazgos');

        auditData.findings.slice(0, 10).forEach((finding, index) => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.text(`${index + 1}. ${finding.title}`, 25, yPos);
            yPos += 6;
            doc.setFont(undefined, 'normal');
            addKeyValue('   Tipo', finding.type);
            addKeyValue('   Estado', finding.status);
            if (finding.description) {
                addText(`   ${finding.description.substring(0, 200)}...`, 25);
            }
            yPos += 3;
        });
    }

    // Footer on all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
            `Generado por ISO 27001 Audit Pro - ${new Date().toLocaleString()}`,
            pageWidth / 2,
            285,
            { align: 'center' }
        );
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - 20, 285, { align: 'right' });
    }

    // Save
    const fileName = `Informe_ISO27001_${auditData.auditInfo?.organization || 'Audit'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    return fileName;
};
