import { jsPDF } from 'jspdf';
import type { ContraindicationResult } from './contraindicationEngine';

export function exportRiskReportToPDF(result: ContraindicationResult) {
    const doc = new jsPDF();
    const margin = 15;
    let y = margin;

    // Config
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - (margin * 2);

    // Helpers
    const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
    };

    const addText = (text: string, fontSize: number, isBold: boolean, color: number[]) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        doc.setTextColor(color[0], color[1], color[2]);

        const lines = doc.splitTextToSize(text, maxWidth);
        const lineHeight = fontSize * 0.3527 * 1.5; // roughly 1.5 spacing
        const blockHeight = lines.length * lineHeight;

        checkPageBreak(blockHeight);

        doc.text(lines, margin, y + (fontSize * 0.3527)); // adjust for baseline
        y += blockHeight + 2;
    };

    // Header
    addText(`RISK ELIGIBILITY REPORT`, 16, true, [0, 0, 0]);
    addText(`Generated: ${new Date(result.generatedAt).toLocaleString()}`, 10, false, [100, 100, 100]);
    addText(`Patient ID: ${result.patientId}   Substance: ${result.sessionSubstance}`, 10, false, [100, 100, 100]);
    y += 10;

    // Verdict
    addText(`VERDICT: ${result.verdict.replace(/_/g, ' ')}`, 14, true,
        result.verdict === 'CLEAR' ? [16, 185, 129] :
            result.verdict === 'PROCEED_WITH_CAUTION' ? [245, 158, 11] : [239, 68, 68]
    );
    y += 5;

    // Absolute
    if (result.absoluteFlags.length > 0) {
        addText(`ABSOLUTE CONTRAINDICATIONS (${result.absoluteFlags.length})`, 12, true, [239, 68, 68]);
        result.absoluteFlags.forEach(f => {
            y += 2;
            addText(`- ${f.headline} [${f.category}]`, 11, true, [0, 0, 0]);
            addText(`  ${f.detail}`, 10, false, [50, 50, 50]);
            addText(`  Source: ${f.source} | Basis: ${f.regulatoryBasis}`, 9, false, [100, 100, 100]);
            y += 4;
        });
    }

    // Relative
    if (result.relativeFlags.length > 0) {
        y += 5;
        addText(`RELATIVE CONTRAINDICATIONS (${result.relativeFlags.length})`, 12, true, [245, 158, 11]);
        result.relativeFlags.forEach(f => {
            y += 2;
            addText(`- ${f.headline} [${f.category}]`, 11, true, [0, 0, 0]);
            addText(`  ${f.detail}`, 10, false, [50, 50, 50]);
            addText(`  Source: ${f.source} | Basis: ${f.regulatoryBasis}`, 9, false, [100, 100, 100]);
            y += 4;
        });
    }

    if (result.absoluteFlags.length === 0 && result.relativeFlags.length === 0) {
        y += 5;
        addText(`No contraindication flags were detected for this patient framework.`, 11, false, [0, 0, 0]);
    }

    // Export
    doc.save(`risk_report_${result.patientId}_${new Date().toISOString().split('T')[0]}.pdf`);
}
