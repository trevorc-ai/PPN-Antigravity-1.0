import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { USMapFilterProps, StateGeography } from '../../types/map';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

export const USMapFilter: React.FC<USMapFilterProps> = ({
    selectedStates = [],
    onStateClick,
    multiSelect = true,
    className = '',
    showSelectedBadges = true,
    disabled = false,
}) => {
    const [hoveredState, setHoveredState] = useState<string | null>(null);

    const handleStateClick = (geo: StateGeography) => {
        if (disabled) return;

        const stateName = geo.properties.name;
        const stateCode = geo.rsmKey;

        onStateClick(stateCode, stateName);
    };

    const handleRemoveState = (stateCode: string) => {
        if (disabled) return;

        // Find the state name from selected states
        const stateName = stateCode; // In a real implementation, you'd look this up
        onStateClick(stateCode, stateName);
    };

    const isSelected = (geo: StateGeography) => {
        return selectedStates.includes(geo.rsmKey) || selectedStates.includes(geo.properties.name);
    };

    return (
        <div className={`bg-[#1c222d]/40 border border-slate-800 rounded-[2.5rem] p-8 backdrop-blur-md ${className}`}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">
                        map
                    </span>
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-200 tracking-tight">
                        State Filter
                    </h3>
                    <p className="text-xs text-slate-400">
                        Click states to filter data
                    </p>
                </div>
            </div>

            {/* Map */}
            <div className="relative w-full" style={{ paddingBottom: '60%' }}>
                <div className="absolute inset-0">
                    <ComposableMap
                        projection="geoAlbersUsa"
                        className="w-full h-full"
                    >
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo: StateGeography) => {
                                    const selected = isSelected(geo);
                                    const hovered = hoveredState === geo.rsmKey;

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            onClick={() => handleStateClick(geo)}
                                            onMouseEnter={() => setHoveredState(geo.rsmKey)}
                                            onMouseLeave={() => setHoveredState(null)}
                                            style={{
                                                default: {
                                                    fill: selected ? 'rgba(99, 102, 241, 0.8)' : 'rgba(71, 85, 105, 0.5)',
                                                    stroke: selected ? '#6366f1' : 'rgba(51, 65, 85, 0.5)',
                                                    strokeWidth: selected ? 2 : 1,
                                                    outline: 'none',
                                                    transition: 'all 300ms ease',
                                                },
                                                hover: {
                                                    fill: selected ? 'rgba(99, 102, 241, 0.9)' : 'rgba(71, 85, 105, 0.7)',
                                                    stroke: selected ? '#6366f1' : 'rgba(71, 85, 105, 0.7)',
                                                    strokeWidth: 2,
                                                    outline: 'none',
                                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                                },
                                                pressed: {
                                                    fill: selected ? 'rgba(99, 102, 241, 1)' : 'rgba(71, 85, 105, 0.8)',
                                                    stroke: selected ? '#6366f1' : 'rgba(71, 85, 105, 0.8)',
                                                    strokeWidth: 2,
                                                    outline: 'none',
                                                },
                                            }}
                                            tabIndex={0}
                                            role="button"
                                            aria-label={`${selected ? 'Deselect' : 'Select'} ${geo.properties.name}`}
                                            aria-pressed={selected}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    handleStateClick(geo);
                                                }
                                            }}
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    </ComposableMap>
                </div>
            </div>

            {/* Hover Tooltip */}
            {hoveredState && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-slate-400">
                        Hover: <span className="text-slate-200 font-bold">{hoveredState}</span>
                    </p>
                </div>
            )}

            {/* Selected States Badges */}
            {showSelectedBadges && selectedStates.length > 0 && (
                <div className="mt-6">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
                        Selected States ({selectedStates.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {selectedStates.map((state) => (
                            <span
                                key={state}
                                className="group px-3 py-1.5 bg-primary/20 border border-primary/30 rounded-full text-xs font-bold text-primary flex items-center gap-2 transition-all hover:bg-primary/30"
                            >
                                {state}
                                <button
                                    onClick={() => handleRemoveState(state)}
                                    disabled={disabled}
                                    className="text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label={`Remove ${state}`}
                                >
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Instructions */}
            {selectedStates.length === 0 && (
                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-500">
                        {multiSelect ? 'Click states to select multiple' : 'Click a state to select'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default USMapFilter;
