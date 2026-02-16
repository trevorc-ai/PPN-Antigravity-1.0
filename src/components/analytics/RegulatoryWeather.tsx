import { AlertTriangle, CheckCircle, Info, Shield } from 'lucide-react';

interface ComplianceItem {
    id: string;
    title: string;
    status: 'warning' | 'good' | 'info';
    detail: string;
}

const mockData: ComplianceItem[] = [
    {
        id: '1',
        title: 'OHA License',
        status: 'warning',
        detail: 'Expires in 12 days'
    },
    {
        id: '2',
        title: 'DORA Compliance',
        status: 'good',
        detail: 'Reporting Active v2.1'
    },
    {
        id: '3',
        title: 'FDA Update',
        status: 'info',
        detail: 'Public Hearing Scheduled'
    }
];

const statusConfig = {
    warning: {
        icon: AlertTriangle,
        color: 'text-amber-400',
        dotColor: 'bg-amber-400'
    },
    good: {
        icon: CheckCircle,
        color: 'text-emerald-400',
        dotColor: 'bg-emerald-400'
    },
    info: {
        icon: Info,
        color: 'text-blue-400',
        dotColor: 'bg-blue-400'
    }
};

export default function RegulatoryWeather() {
    return (
        <div className="bg-[#0f1218] border border-slate-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-200">Regulatory Weather</h3>
            </div>

            <div className="space-y-4">
                {mockData.map((item) => {
                    const config = statusConfig[item.status];
                    const Icon = config.icon;

                    return (
                        <div key={item.id} className="flex items-start gap-3">
                            <div className={`mt-1 w-2 h-2 rounded-full ${config.dotColor} flex-shrink-0`} />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <Icon className={`w-4 h-4 ${config.color} flex-shrink-0`} />
                                    <h4 className="text-sm font-medium text-slate-300">{item.title}</h4>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">{item.detail}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
