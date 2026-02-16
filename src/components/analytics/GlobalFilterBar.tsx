import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export interface GlobalFilters {
    siteIds: string[];
    dateRange: {
        start: string;
        end: string;
    };
    substanceIds: number[];
    routeIds: number[];
    supportModalityIds: number[];
    protocolIds: string[];
}

interface GlobalFilterBarProps {
    filters: GlobalFilters;
    onChange: (filters: GlobalFilters) => void;
    className?: string;
}

interface Site {
    id: string;
    name: string;
}

interface Substance {
    substance_id: number;
    substance_name: string;
}

interface Route {
    route_id: number;
    route_name: string;
}

interface SupportModality {
    support_modality_id: number;
    support_modality: string;
}

interface Protocol {
    id: string;
    name: string;
}

const GlobalFilterBar: React.FC<GlobalFilterBarProps> = ({ filters, onChange, className = '' }) => {
    const [sites, setSites] = useState<Site[]>([]);
    const [substances, setSubstances] = useState<Substance[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [supportModalities, setSupportModalities] = useState<SupportModality[]>([]);
    const [protocols, setProtocols] = useState<Protocol[]>([]);
    const [loading, setLoading] = useState(true);

    // Load filter options from Supabase
    useEffect(() => {
        const loadFilterOptions = async () => {
            try {
                setLoading(true);

                // Load sites (user can only see their assigned sites due to RLS)
                const { data: sitesData } = await supabase
                    .from('log_sites')
                    .select('site_id, site_name')
                    .eq('is_active', true)
                    .order('site_name');

                // Load substances
                const { data: substancesData } = await supabase
                    .from('ref_substances')
                    .select('substance_id, substance_name')
                    .order('substance_name');

                // Load routes
                const { data: routesData } = await supabase
                    .from('ref_routes')
                    .select('route_id, route_name')
                    .order('route_name');

                // Load support modalities
                const { data: modalitiesData } = await supabase
                    .from('ref_support_modality')
                    .select('support_modality_id, support_modality')
                    .order('support_modality');

                // Load protocols
                const { data: protocolsData } = await supabase
                    .from('log_protocols')
                    .select('protocol_id, protocol_name')
                    .order('protocol_name');

                setSites(sitesData || []);
                setSubstances(substancesData || []);
                setRoutes(routesData || []);
                setSupportModalities(modalitiesData || []);
                setProtocols(protocolsData || []);
            } catch (error) {
                console.error('Error loading filter options:', error);
            } finally {
                setLoading(false);
            }
        };

        loadFilterOptions();
    }, []);

    const handleSiteChange = (siteId: string) => {
        const newSiteIds = filters.siteIds.includes(siteId)
            ? filters.siteIds.filter(id => id !== siteId)
            : [...filters.siteIds, siteId];

        onChange({ ...filters, siteIds: newSiteIds });
    };

    const handleSubstanceChange = (substanceId: number) => {
        const newSubstanceIds = filters.substanceIds.includes(substanceId)
            ? filters.substanceIds.filter(id => id !== substanceId)
            : [...filters.substanceIds, substanceId];

        onChange({ ...filters, substanceIds: newSubstanceIds });
    };

    const handleRouteChange = (routeId: number) => {
        const newRouteIds = filters.routeIds.includes(routeId)
            ? filters.routeIds.filter(id => id !== routeId)
            : [...filters.routeIds, routeId];

        onChange({ ...filters, routeIds: newRouteIds });
    };

    const handleModalityChange = (modalityId: number) => {
        const newModalityIds = filters.supportModalityIds.includes(modalityId)
            ? filters.supportModalityIds.filter(id => id !== modalityId)
            : [...filters.supportModalityIds, modalityId];

        onChange({ ...filters, supportModalityIds: newModalityIds });
    };

    const handleProtocolChange = (protocolId: string) => {
        const newProtocolIds = filters.protocolIds.includes(protocolId)
            ? filters.protocolIds.filter(id => id !== protocolId)
            : [...filters.protocolIds, protocolId];

        onChange({ ...filters, protocolIds: newProtocolIds });
    };

    const handleDateChange = (field: 'start' | 'end', value: string) => {
        onChange({
            ...filters,
            dateRange: {
                ...filters.dateRange,
                [field]: value
            }
        });
    };

    const handleClearFilters = () => {
        onChange({
            siteIds: [],
            dateRange: { start: '', end: '' },
            substanceIds: [],
            routeIds: [],
            supportModalityIds: [],
            protocolIds: []
        });
    };

    const activeFilterCount =
        filters.siteIds.length +
        filters.substanceIds.length +
        filters.routeIds.length +
        filters.supportModalityIds.length +
        filters.protocolIds.length +
        (filters.dateRange.start ? 1 : 0) +
        (filters.dateRange.end ? 1 : 0);

    if (loading) {
        return (
            <div className={`card-glass rounded-3xl p-6 ${className}`}>
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400 animate-spin">progress_activity</span>
                    <span className="text-sm font-medium text-slate-400">Loading filters...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`card-glass rounded-3xl p-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-2xl text-primary">filter_alt</span>
                    <h3 className="text-lg font-black text-slate-200">Global Filters</h3>
                    {activeFilterCount > 0 && (
                        <span className="px-2.5 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-bold text-primary">
                            {activeFilterCount} active
                        </span>
                    )}
                </div>

                {activeFilterCount > 0 && (
                    <button
                        onClick={handleClearFilters}
                        className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl uppercase tracking-widest transition-all"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Date Range */}
                <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 tracking-widest uppercase">
                        Date Range
                    </label>
                    <div className="space-y-2">
                        <input
                            type="date"
                            value={filters.dateRange.start}
                            onChange={(e) => handleDateChange('start', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-300 text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                            placeholder="Start date"
                        />
                        <input
                            type="date"
                            value={filters.dateRange.end}
                            onChange={(e) => handleDateChange('end', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-300 text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                            placeholder="End date"
                        />
                    </div>
                </div>

                {/* Sites */}
                {sites.length > 1 && (
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 tracking-widest uppercase">
                            Sites ({filters.siteIds.length} selected)
                        </label>
                        <div className="max-h-32 overflow-y-auto space-y-2 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                            {sites.map((site) => (
                                <label key={site.id} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filters.siteIds.includes(site.id)}
                                        onChange={() => handleSiteChange(site.id)}
                                        className="size-4 rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary focus:ring-offset-0"
                                    />
                                    <span className="text-sm font-medium text-slate-300 group-hover:text-slate-200 transition-colors">
                                        {site.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Substances */}
                <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 tracking-widest uppercase">
                        Substances ({filters.substanceIds.length} selected)
                    </label>
                    <div className="max-h-32 overflow-y-auto space-y-2 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                        {substances.map((substance) => (
                            <label key={substance.substance_id} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.substanceIds.includes(substance.substance_id)}
                                    onChange={() => handleSubstanceChange(substance.substance_id)}
                                    className="size-4 rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary focus:ring-offset-0"
                                />
                                <span className="text-sm font-medium text-slate-300 group-hover:text-slate-200 transition-colors">
                                    {substance.substance_name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Routes */}
                <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 tracking-widest uppercase">
                        Routes ({filters.routeIds.length} selected)
                    </label>
                    <div className="max-h-32 overflow-y-auto space-y-2 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                        {routes.map((route) => (
                            <label key={route.route_id} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.routeIds.includes(route.route_id)}
                                    onChange={() => handleRouteChange(route.route_id)}
                                    className="size-4 rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary focus:ring-offset-0"
                                />
                                <span className="text-sm font-medium text-slate-300 group-hover:text-slate-200 transition-colors">
                                    {route.route_name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Support Modalities */}
                <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 tracking-widest uppercase">
                        Support Modality ({filters.supportModalityIds.length} selected)
                    </label>
                    <div className="max-h-32 overflow-y-auto space-y-2 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                        {supportModalities.map((modality) => (
                            <label key={modality.support_modality_id} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.supportModalityIds.includes(modality.support_modality_id)}
                                    onChange={() => handleModalityChange(modality.support_modality_id)}
                                    className="size-4 rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary focus:ring-offset-0"
                                />
                                <span className="text-sm font-medium text-slate-300 group-hover:text-slate-200 transition-colors">
                                    {modality.support_modality}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Protocols */}
                <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 tracking-widest uppercase">
                        Protocols ({filters.protocolIds.length} selected)
                    </label>
                    <div className="max-h-32 overflow-y-auto space-y-2 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                        {protocols.length > 0 ? (
                            protocols.map((protocol) => (
                                <label key={protocol.id} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filters.protocolIds.includes(protocol.id)}
                                        onChange={() => handleProtocolChange(protocol.id)}
                                        className="size-4 rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary focus:ring-offset-0"
                                    />
                                    <span className="text-sm font-medium text-slate-300 group-hover:text-slate-200 transition-colors">
                                        {protocol.name}
                                    </span>
                                </label>
                            ))
                        ) : (
                            <p className="text-xs text-slate-3000 italic">No protocols available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalFilterBar;
