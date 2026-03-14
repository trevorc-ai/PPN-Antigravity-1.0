/**
 * jspdf.d.ts - Module declaration shim for jsPDF
 *
 * Provides the minimal API surface used by dischargeSummary.ts and
 * reportGenerator.ts. The GStateInstance branded type prevents TS2345 errors
 * when passing doc.GState({ opacity }) to doc.setGState().
 */

declare module 'jspdf' {
    /** Opaque handle returned by doc.GState() and accepted by doc.setGState() */
    type GStateInstance = { readonly __brand: 'GStateInstance' };

    interface jsPDFInternal {
        pages: unknown[];
    }

    class jsPDF {
        internal: jsPDFInternal;
        constructor(options?: { orientation?: 'portrait' | 'landscape'; unit?: string; format?: string });
        // GState factory — returns an opaque handle
        GState(options: { opacity?: number }): GStateInstance;
        setGState(state: GStateInstance): void;
        setFillColor(r: number, g: number, b: number): void;
        setDrawColor(r: number, g: number, b: number): void;
        setTextColor(r: number, g: number, b: number): void;
        setFont(family: string, style: string): void;
        setFontSize(size: number): void;
        setLineWidth(width: number): void;
        setPage(page: number): void;
        addPage(): void;
        rect(x: number, y: number, w: number, h: number, style?: string): void;
        roundedRect(x: number, y: number, w: number, h: number, rx: number, ry: number, style?: string): void;
        line(x1: number, y1: number, x2: number, y2: number): void;
        text(text: string | string[], x: number, y: number, options?: { align?: string; maxWidth?: number }): void;
        splitTextToSize(text: string, maxWidth: number): string[];
        save(filename: string): void;
        output(type: string): string;
    }
}
