/**
 * RefPicker.tsx — WO-214
 *
 * Universal ref_ table multi-select component.
 * Auto-selects one of 3 rendering modes based on item count:
 *   ≤ 12  → Mode 1: Chip Grid
 *   13-40 → Mode 2: Grouped Collapsible sections
 *   41+   → Mode 3: Searchable Dropdown
 *
 * CRITICAL: onChange ALWAYS returns number[] (FK integer IDs). Never labels.
 */

import React, { useState, useRef, useCallback } from 'react';
import { Check, ChevronDown, ChevronUp, Search, X, AlertTriangle } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RefPickerItem {
    id: number;
    label: string;
    category?: string;
}

export interface RefPickerProps {
    items: RefPickerItem[];
    selected: number[];                    // selected IDs (FK integers)
    onChange: (ids: number[]) => void;     // always returns number[] — never strings
    multi?: boolean;                       // default: true
    label: string;                         // aria-label + visible section label
    maxItems?: number;                     // cardinality guard
    recentlyUsed?: number[];              // IDs surfaced to top in modes 2 & 3
    className?: string;
}

// ─── Mode 1: Chip Grid (≤ 12 items) ──────────────────────────────────────────

interface ChipGridProps {
    items: RefPickerItem[];
    selected: number[];
    onToggle: (id: number) => void;
    label: string;
    atMax: boolean;
}

const ChipGrid: React.FC<ChipGridProps> = ({ items, selected, onToggle, label, atMax }) => (
    <div role="group" aria-label={label} className="grid grid-cols-2 gap-2">
        {items.map((item) => {
            const isSelected = selected.includes(item.id);
            const isDisabled = atMax && !isSelected;
            return (
                <button
                    key={item.id}
                    type="button"
                    aria-pressed={isSelected}
                    aria-disabled={isDisabled}
                    disabled={isDisabled}
                    onClick={() => !isDisabled && onToggle(item.id)}
                    className={`
                        relative flex items-center gap-2 px-3 py-3 rounded-xl border text-left
                        text-sm font-semibold transition-all duration-150
                        min-h-[44px] focus:outline-none focus:ring-2 focus:ring-violet-500/60
                        ${isSelected
                            ? 'bg-violet-500/20 border-violet-500/60 text-violet-200'
                            : isDisabled
                                ? 'bg-slate-800/30 border-slate-700/30 text-slate-600 cursor-not-allowed'
                                : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800/80'
                        }
                    `}
                >
                    {/* Selection indicator — never color-only */}
                    <span className={`
                        flex-shrink-0 w-4 h-4 rounded flex items-center justify-center border
                        ${isSelected
                            ? 'bg-violet-500 border-violet-400'
                            : 'border-slate-600 bg-slate-700/50'
                        }
                    `}>
                        {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </span>
                    <span className="leading-tight">{item.label}</span>
                </button>
            );
        })}
    </div>
);

// ─── Mode 2: Grouped Collapsible (13-40 items) ────────────────────────────────

interface GroupedCollapsibleProps {
    items: RefPickerItem[];
    selected: number[];
    onToggle: (id: number) => void;
    label: string;
    atMax: boolean;
    recentlyUsed: number[];
}

const GroupedCollapsible: React.FC<GroupedCollapsibleProps> = ({
    items, selected, onToggle, label, atMax, recentlyUsed,
}) => {
    // Use string[] instead of Set<string> — avoids 'untyped function call' lint on Set<T> generic
    const [openGroups, setOpenGroups] = useState<string[]>(['__recent__']);

    const toggleGroup = (cat: string) =>
        setOpenGroups(prev =>
            prev.includes(cat) ? prev.filter(g => g !== cat) : [...prev, cat]
        );

    // Build groups with explicit type so Object.entries preserves RefPickerItem[] (not unknown)
    const groups: Record<string, RefPickerItem[]> = {};
    items.forEach(item => {
        const cat = item.category ?? 'Other';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(item);
    });

    const recentItems = recentlyUsed.length > 0
        ? items.filter(i => recentlyUsed.includes(i.id)).slice(0, 3)
        : [];

    const renderChip = (item: RefPickerItem) => {
        const isSelected = selected.includes(item.id);
        const isDisabled = atMax && !isSelected;
        return (
            <button
                key={item.id}
                type="button"
                aria-pressed={isSelected}
                aria-disabled={isDisabled}
                disabled={isDisabled}
                onClick={() => !isDisabled && onToggle(item.id)}
                className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium
                    min-h-[44px] w-full text-left transition-all duration-150
                    focus:outline-none focus:ring-2 focus:ring-violet-500/60
                    ${isSelected
                        ? 'bg-violet-500/20 border-violet-500/60 text-violet-200'
                        : isDisabled
                            ? 'bg-slate-800/30 border-slate-700/30 text-slate-600 cursor-not-allowed'
                            : 'bg-slate-800/40 border-slate-700/40 text-slate-300 hover:border-slate-600'
                    }
                `}
            >
                <span className={`
                    flex-shrink-0 w-4 h-4 rounded flex items-center justify-center border
                    ${isSelected ? 'bg-violet-500 border-violet-400' : 'border-slate-600 bg-slate-700/50'}
                `}>
                    {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </span>
                {item.label}
            </button>
        );
    };

    return (
        <div role="group" aria-label={label} className="space-y-1">
            {/* Recently used pinned section */}
            {recentItems.length > 0 && (
                <div>
                    <button
                        type="button"
                        onClick={() => toggleGroup('__recent__')}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-all"
                    >
                        <span>Recently Used</span>
                        <span className="flex items-center gap-2">
                            <span className="bg-amber-500/30 text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full">{recentItems.length}</span>
                            {openGroups.includes('__recent__') ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </span>
                    </button>
                    {openGroups.includes('__recent__') && (
                        <div className="mt-1 space-y-1 pl-2">
                            {recentItems.map(renderChip)}
                        </div>
                    )}
                </div>
            )}

            {/* Category groups */}
            {(Object.entries(groups) as [string, RefPickerItem[]][]).map(([cat, groupItems]) => {
                const isOpen = openGroups.includes(cat);
                const selectedInGroup = groupItems.filter(i => selected.includes(i.id)).length;
                return (
                    <div key={cat}>
                        <button
                            type="button"
                            onClick={() => toggleGroup(cat)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-800/40 border border-slate-700/40 hover:bg-slate-800/60 transition-all"
                        >
                            <span>{cat}</span>
                            <span className="flex items-center gap-2">
                                {selectedInGroup > 0 && (
                                    <span className="bg-violet-500/30 text-violet-300 text-xs font-bold px-2 py-0.5 rounded-full">
                                        {selectedInGroup} selected
                                    </span>
                                )}
                                <span className="text-slate-500 text-xs">{groupItems.length}</span>
                                {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </span>
                        </button>
                        {isOpen && (
                            <div className="mt-1 space-y-1 pl-2">
                                {groupItems.map(renderChip)}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// ─── Mode 3: Searchable Dropdown (41+ items) ──────────────────────────────────

interface SearchableDropdownProps {
    items: RefPickerItem[];
    selected: number[];
    onToggle: (id: number) => void;
    label: string;
    atMax: boolean;
    recentlyUsed: number[];
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
    items, selected, onToggle, label, atMax, recentlyUsed,
}) => {
    const [query, setQuery] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(0);
    const listRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const recentItems = items.filter(i => recentlyUsed.includes(i.id));

    const filteredItems = query.trim()
        ? items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
        : [];

    // Display list: when no query, show recently-used + count hint
    const displayItems = query.trim() ? filteredItems : recentItems;

    const handleKey = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocusedIndex(i => Math.min(i + 1, displayItems.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocusedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && displayItems[focusedIndex]) {
            e.preventDefault();
            const item = displayItems[focusedIndex];
            if (!(atMax && !selected.includes(item.id))) {
                onToggle(item.id);
            }
        }
    }, [displayItems, focusedIndex, atMax, selected, onToggle]);

    return (
        <div role="group" aria-label={label} className="space-y-3">
            {/* Search input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                    ref={searchRef}
                    type="text"
                    value={query}
                    onChange={e => { setQuery(e.target.value); setFocusedIndex(0); }}
                    onKeyDown={handleKey}
                    placeholder={`Search ${items.length} options...`}
                    aria-label={`Search ${label}`}
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-300 placeholder-slate-600 focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500/40 outline-none transition-all"
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => { setQuery(''); searchRef.current?.focus(); }}
                        aria-label="Clear search"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Selected tags */}
            {selected.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {selected.map(id => {
                        const item = items.find(i => i.id === id);
                        if (!item) return null;
                        return (
                            <span
                                key={id}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-500/20 border border-violet-500/40 text-violet-200 text-xs font-semibold"
                            >
                                {item.label}
                                <button
                                    type="button"
                                    onClick={() => onToggle(id)}
                                    aria-label={`Remove ${item.label}`}
                                    className="hover:text-white transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        );
                    })}
                </div>
            )}

            {/* Results list */}
            <div ref={listRef} className="max-h-48 overflow-y-auto space-y-1 rounded-xl">
                {!query && recentItems.length > 0 && (
                    <p className="text-sm font-black text-amber-400 uppercase tracking-widest px-2 py-1">
                        Recently Used
                    </p>
                )}
                {!query && recentItems.length === 0 && (
                    <p className="text-sm text-slate-500 px-2 py-4 text-center">
                        Start typing to search {items.length} options
                    </p>
                )}
                {displayItems.map((item, idx) => {
                    const isSelected = selected.includes(item.id);
                    const isDisabled = atMax && !isSelected;
                    const isFocused = idx === focusedIndex;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            aria-pressed={isSelected}
                            aria-disabled={isDisabled}
                            disabled={isDisabled}
                            onClick={() => !isDisabled && onToggle(item.id)}
                            className={`
                                flex items-center gap-2 w-full px-3 py-2 rounded-lg border text-sm
                                min-h-[44px] text-left transition-all duration-100
                                focus:outline-none
                                ${isSelected
                                    ? 'bg-violet-500/20 border-violet-500/60 text-violet-200'
                                    : isFocused
                                        ? 'bg-slate-700/60 border-slate-600/60 text-[#A8B5D1]'
                                        : isDisabled
                                            ? 'bg-slate-800/20 border-slate-700/20 text-slate-600 cursor-not-allowed'
                                            : 'bg-slate-800/40 border-slate-700/40 text-slate-300 hover:border-slate-600'
                                }
                            `}
                        >
                            <span className={`
                                flex-shrink-0 w-4 h-4 rounded flex items-center justify-center border
                                ${isSelected ? 'bg-violet-500 border-violet-400' : 'border-slate-600 bg-slate-700/50'}
                            `}>
                                {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                            </span>
                            <span className="flex-1">{item.label}</span>
                            {item.category && (
                                <span className="text-xs text-slate-600 flex-shrink-0">{item.category}</span>
                            )}
                        </button>
                    );
                })}
                {query && filteredItems.length === 0 && (
                    <p className="text-sm text-slate-500 px-2 py-4 text-center">
                        No options matching "{query}"
                    </p>
                )}
            </div>
        </div>
    );
};

// ─── Main RefPicker ───────────────────────────────────────────────────────────

export const RefPicker: React.FC<RefPickerProps> = ({
    items,
    selected,
    onChange,
    multi = true,
    label,
    maxItems,
    recentlyUsed = [],
    className = '',
}) => {
    const atMax = multi && maxItems !== undefined && selected.length >= maxItems;

    const handleToggle = useCallback((id: number) => {
        if (!multi) {
            // Single-select: replace
            onChange(selected.includes(id) ? [] : [id]);
            return;
        }
        // Multi-select: toggle
        if (selected.includes(id)) {
            onChange(selected.filter(s => s !== id));
        } else if (!atMax) {
            onChange([...selected, id]);
        }
    }, [multi, selected, onChange, atMax]);

    // Auto-select mode
    const mode: 1 | 2 | 3 =
        items.length <= 12 ? 1 :
            items.length <= 40 ? 2 :
                3;

    const selectedCount = selected.length;

    return (
        <div className={`space-y-2 ${className}`}>
            {/* Label row */}
            <div className="flex items-center justify-between">
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                    {label}
                </p>
                <div className="flex items-center gap-2 text-xs">
                    {selectedCount > 0 && (
                        <span className="bg-violet-500/20 text-violet-300 font-bold px-2 py-0.5 rounded-full">
                            {selectedCount} selected
                        </span>
                    )}
                    {maxItems !== undefined && (
                        <span className="text-slate-600">
                            max {maxItems}
                        </span>
                    )}
                </div>
            </div>

            {/* Max items warning */}
            {atMax && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <p className="text-sm text-amber-300 font-semibold">
                        Maximum {maxItems} selections reached. Deselect one to choose another.
                    </p>
                </div>
            )}

            {/* Mode renderer */}
            {mode === 1 && (
                <ChipGrid
                    items={items}
                    selected={selected}
                    onToggle={handleToggle}
                    label={label}
                    atMax={atMax}
                />
            )}
            {mode === 2 && (
                <GroupedCollapsible
                    items={items}
                    selected={selected}
                    onToggle={handleToggle}
                    label={label}
                    atMax={atMax}
                    recentlyUsed={recentlyUsed}
                />
            )}
            {mode === 3 && (
                <SearchableDropdown
                    items={items}
                    selected={selected}
                    onToggle={handleToggle}
                    label={label}
                    atMax={atMax}
                    recentlyUsed={recentlyUsed}
                />
            )}
        </div>
    );
};

export default RefPicker;
