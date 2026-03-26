import React from 'react';
import { Shield, Lock, Clock } from 'lucide-react';

// ─── WO-666: ComplianceFooter — shared component extracted from
//     SessionExportCenter.tsx (lines 654–675) and DataExport.tsx (lines 430–444).
//     Visual contract preserved exactly from both source files.

interface ComplianceFooterProps {
    /** DataExport shows a copyright line; SessionExportCenter does not. */
    showCopyright?: boolean;
    /** SessionExportCenter shows "All exports logged with timestamp"; DataExport does not. */
    showTimestamp?: boolean;
}

export const ComplianceFooter: React.FC<ComplianceFooterProps> = ({
    showCopyright = false,
    showTimestamp = false,
}) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 pb-6">
            <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>HIPAA Compliant</span>
                </div>
                <div className="h-3 w-px bg-slate-800" />
                <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>FDA 21 CFR Part 11</span>
                </div>
                {showTimestamp && (
                    <>
                        <div className="h-3 w-px bg-slate-800" />
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>All exports logged with timestamp</span>
                        </div>
                    </>
                )}
            </div>
            {showCopyright ? (
                <p className="text-sm text-slate-600">
                    © 2026 PPN Portal · Data Version: 2.1.0-BETA · Clinical Platform
                </p>
            ) : (
                <p className="text-sm text-slate-600">
                    Re-identification of de-identified records is strictly prohibited.
                </p>
            )}
        </div>
    );
};

export default ComplianceFooter;
