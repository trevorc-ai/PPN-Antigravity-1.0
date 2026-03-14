/**
 * jspdf.d.ts - Module declaration shim for jsPDF
 *
 * The node_modules/jspdf/dist folder has a permissions issue preventing TypeScript
 * from reading the bundled types. This shim provides the minimal API surface used
 * by dischargeSummary.ts and reportGenerator.ts until `npm install` can be re-run
 * with correct permissions (sudo chown -R $(whoami) ~/.npm).
 *
 * Mirrors the jsPDF v4 public API used in this project.
 */

declare module 'jspdf' {
    interface GStateOptions {
        opacity?: number;
    }

    interface GState {
        new(options: GStateOptions): GState;
    }

    interface jsPDFInternal {
        pages: unknown[];
    }

    class jsPDF {
        internal: jsPDFInternal;
        constructor(options?: { orientation?: 'portrait' | 'landscape'; unit?: string; format?: string });
        GState(options: GStateOptions): GState;
        setGState(state: GState): void;
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
