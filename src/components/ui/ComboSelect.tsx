/**
 * ComboSelect — Shared reusable combobox for InteractionChecker (WO-524)
 *
 * Features:
 *  - Type-to-filter with case-insensitive substring match (WAI-ARIA standard)
 *  - Click dropdown arrow to browse full list
 *  - Keyboard navigation: Arrow Up/Down, Enter to select, Escape to close
 *  - Tab-accessible (no focus traps)
 *  - Clearable via Backspace or explicit clear
 *  - Matches `h-16 bg-black border-slate-800 rounded-2xl` styling
 *
 * Props:
 *  - options: { value: string; label: string }[]
 *  - value: string (currently selected value)
 *  - onChange: (val: string) => void
 *  - placeholder?: string
 *  - disabled?: boolean
 *  - leftIcon?: string  (material-symbols name)
 *  - id?: string
 */

import React, { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';

export interface ComboOption {
    value: string;
    label: string;
}

interface ComboSelectProps {
    options: ComboOption[];
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    disabled?: boolean;
    leftIcon?: string;
    id?: string;
}

function toTitleCase(str: string): string {
    return str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export const ComboSelect: React.FC<ComboSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    disabled = false,
    leftIcon,
    id,
}) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // The label shown for the currently selected value
    const selectedOption = options.find((o) => o.value === value);
    const displayLabel = selectedOption ? toTitleCase(selectedOption.label) : '';

    // Filtered options based on query (contains match, case-insensitive)
    const filtered = query
        ? options.filter((o) =>
            o.label.toLowerCase().includes(query.toLowerCase())
        )
        : options;

    // ── Open the dropdown ───────────────────────────────────────────────────────
    const openDropdown = useCallback(() => {
        if (disabled) return;
        setQuery('');
        setFocusedIndex(-1);
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    }, [disabled]);

    // ── Close the dropdown ──────────────────────────────────────────────────────
    const closeDropdown = useCallback(() => {
        setOpen(false);
        setQuery('');
        setFocusedIndex(-1);
    }, []);

    // ── Select an option ────────────────────────────────────────────────────────
    const selectOption = useCallback(
        (opt: ComboOption) => {
            onChange(opt.value);
            closeDropdown();
        },
        [onChange, closeDropdown]
    );

    // ── Click outside handler ────────────────────────────────────────────────────
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                closeDropdown();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [closeDropdown]);

    // ── Escape key handler (stop bubble so SlideOutPanel doesn't catch it) ──────
    useEffect(() => {
        const handler = (e: globalThis.KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                e.stopPropagation();
                closeDropdown();
            }
        };
        document.addEventListener('keydown', handler, true);
        return () => document.removeEventListener('keydown', handler, true);
    }, [open, closeDropdown]);

    // ── Scroll focused item into view ────────────────────────────────────────────
    useEffect(() => {
        if (focusedIndex >= 0 && listRef.current) {
            const items = listRef.current.querySelectorAll('[role="option"]');
            items[focusedIndex]?.scrollIntoView({ block: 'nearest' });
        }
    }, [focusedIndex]);

    // ── Keyboard navigation inside the input ────────────────────────────────────
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!open) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                openDropdown();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setFocusedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedIndex((prev) => Math.max(prev - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (focusedIndex >= 0 && filtered[focusedIndex]) {
                    selectOption(filtered[focusedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                closeDropdown();
                break;
            case 'Tab':
                closeDropdown();
                break;
            default:
                break;
        }
    };

    // ── Input change (type-to-filter) ────────────────────────────────────────────
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setFocusedIndex(-1);
        setOpen(true);

        // If user clears input, clear selection
        if (e.target.value === '' && value) {
            onChange('');
        }
    };

    return (
        <div ref={containerRef} className="relative w-full" id={id}>
            {/* ── Input trigger (the combobox field itself) ─── */}
            <div
                className={`w-full h-16 bg-black border rounded-2xl flex items-center transition-all
          ${disabled ? 'opacity-50 cursor-wait' : 'cursor-text'}
          ${open ? 'border-primary ring-1 ring-primary' : 'border-slate-800 hover:border-slate-700'}
        `}
            >
                {/* Left icon */}
                {leftIcon && (
                    <span className="material-symbols-outlined text-xl text-slate-300 ml-5 shrink-0 pointer-events-none">
                        {leftIcon}
                    </span>
                )}

                {/* Text input */}
                <input
                    ref={inputRef}
                    type="text"
                    role="combobox"
                    aria-expanded={open}
                    aria-autocomplete="list"
                    aria-controls={`${id}-listbox`}
                    aria-activedescendant={focusedIndex >= 0 ? `${id}-option-${focusedIndex}` : undefined}
                    autoComplete="off"
                    disabled={disabled}
                    placeholder={open ? 'Type to filter...' : (displayLabel || placeholder)}
                    value={open ? query : displayLabel}
                    onChange={handleInputChange}
                    onFocus={openDropdown}
                    onKeyDown={handleKeyDown}
                    className={`flex-1 bg-transparent outline-none text-base font-bold px-4 py-0 placeholder:font-bold min-w-0
            ${displayLabel && !open ? '' : ''}
          `}
                    style={{ color: open ? '#e2e8f0' : (value ? '#8B9DC3' : '#4B5E7A') }}
                />

                {/* Chevron button (click to toggle dropdown without focusing input) */}
                <button
                    type="button"
                    tabIndex={-1}
                    aria-label="Open dropdown"
                    disabled={disabled}
                    onMouseDown={(e) => {
                        e.preventDefault(); // prevent input blur
                        if (open) {
                            closeDropdown();
                        } else {
                            openDropdown();
                        }
                    }}
                    className="mr-5 shrink-0 text-slate-600 hover:text-slate-400 transition-colors"
                >
                    <span className="material-symbols-outlined text-xl">
                        {open ? 'expand_less' : 'expand_more'}
                    </span>
                </button>
            </div>

            {/* ── Dropdown listbox ─────────────────────────────────────── */}
            {open && (
                <div className="absolute z-50 left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                    {filtered.length === 0 ? (
                        <div className="px-5 py-4 text-sm text-slate-500 font-medium">
                            No matches for &quot;{query}&quot;
                        </div>
                    ) : (
                        <ul
                            ref={listRef}
                            id={`${id}-listbox`}
                            role="listbox"
                            aria-label={placeholder}
                            className="max-h-72 overflow-y-auto py-2 custom-scrollbar"
                        >
                            {filtered.map((opt, idx) => {
                                const isSelected = opt.value === value;
                                const isFocused = idx === focusedIndex;
                                return (
                                    <li
                                        key={opt.value}
                                        id={`${id}-option-${idx}`}
                                        role="option"
                                        aria-selected={isSelected}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            selectOption(opt);
                                        }}
                                        onMouseEnter={() => setFocusedIndex(idx)}
                                        className={`px-5 py-2.5 text-sm cursor-pointer transition-colors font-medium
                      ${isSelected
                                                ? 'bg-indigo-600/40 text-indigo-100 font-semibold'
                                                : isFocused
                                                    ? 'bg-slate-800 text-slate-200'
                                                    : 'text-slate-300 hover:bg-slate-800'
                                            }`}
                                    >
                                        {toTitleCase(opt.label)}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default ComboSelect;
