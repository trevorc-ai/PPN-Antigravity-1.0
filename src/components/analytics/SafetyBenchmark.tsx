import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
    {
        name: 'Your Node',
        value: 4.2,
        fill: '#10b981'
    },
    {
        name: 'National Avg',
        value: 12.8,
        fill: '#64748b'
    }
];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 border border-slate-700 rounded px-3 py-2">
                <p className="text-slate-300 text-sm font-medium">{payload[0].payload.name}</p>
                <p className="text-slate-300 text-xs">{payload[0].value} events per 1000 patients</p>
            </div>
        );
    }
    return null;
};

export default function SafetyBenchmark() {
    return (
        <div className="bg-[#0f1218] border border-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Safety Benchmark</h3>

            <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={mockData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                        <XAxis type="number" hide />
                        <YAxis
                            type="category"
                            dataKey="name"
                            hide
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
                        <Bar
                            dataKey="value"
                            radius={[0, 4, 4, 0]}
                            fill="#10b981"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-400 leading-relaxed">
                    Your adverse event rate is <span className="text-emerald-400 font-semibold">67% lower</span> than national average.
                </p>
            </div>
        </div>
    );
}
