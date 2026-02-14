import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TableOfContentsItem {
    id: string;
    title: string;
}

interface LegalPageLayoutProps {
    title: string;
    effectiveDate: string;
    tableOfContents: TableOfContentsItem[];
    children: React.ReactNode;
}

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
    title,
    effectiveDate,
    tableOfContents,
    children,
}) => {
    const navigate = useNavigate();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-slate-900/50 backdrop-blur border-b border-slate-800">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">P</span>
                        </div>
                        <span className="text-slate-100 font-semibold">PPN Research Portal</span>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to App</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Title */}
                <h1 className="text-4xl font-bold text-slate-100 mb-2">{title}</h1>
                <p className="text-slate-400 text-sm mb-8">Effective Date: {effectiveDate}</p>

                {/* Table of Contents */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-12">
                    <h2 className="text-lg font-semibold text-slate-100 mb-4">Table of Contents</h2>
                    <nav className="space-y-2">
                        {tableOfContents.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className="block text-left text-teal-400 hover:text-teal-300 transition-colors text-sm"
                            >
                                {item.title}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="prose prose-invert prose-slate max-w-none">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800 bg-slate-900/30 mt-16">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <div className="text-center text-slate-400 text-sm">
                        <p className="mb-4">© 2026 PPN Research Portal. All rights reserved.</p>
                        <div className="flex justify-center gap-6">
                            <a href="/#/terms" className="text-slate-400 hover:text-teal-400 transition-colors">
                                Terms of Service
                            </a>
                            <a href="/#/privacy" className="text-slate-400 hover:text-teal-400 transition-colors">
                                Privacy Policy
                            </a>
                            <a href="/#/baa" className="text-slate-400 hover:text-teal-400 transition-colors">
                                Business Associate Agreement
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
