import React, { useState, useEffect, useRef } from 'react';

interface Option {
    id: number | string;
    label: string;
    [key: string]: any;
}

interface SearchableDropdownProps {
    options: any[];
    value: number | string | null;
    onChange: (value: any) => void;
    placeholder?: string;
    labelKey?: string;
    valueKey?: string;
    loading?: boolean;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    labelKey = 'label',
    valueKey = 'id',
    loading = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(option =>
        option[labelKey].toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = options.find(o => o[valueKey] === value);

    return (
        <div className="searchable-dropdown" ref={wrapperRef}>
            <div className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
                {selectedOption ? selectedOption[labelKey] : placeholder}
                <span className="arrow">▼</span>
            </div>

            {isOpen && (
                <div className="dropdown-menu">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                    <div className="options-list">
                        {loading ? (
                            <div className="loading">Loading...</div>
                        ) : filteredOptions.length > 0 ? (
                            filteredOptions.map(option => (
                                <div
                                    key={option[valueKey]}
                                    className={`option ${value === option[valueKey] ? 'selected' : ''}`}
                                    onClick={() => {
                                        onChange(option[valueKey]);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                >
                                    {option[labelKey]}
                                </div>
                            ))
                        ) : (
                            <div className="no-results">No results found</div>
                        )}
                    </div>
                </div>
            )}
            <style jsx>{`
        .searchable-dropdown {
          position: relative;
          width: 100%;
        }
        
        .dropdown-trigger {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 12px 16px;
          color: #f8f9fa;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: #1e1b2e;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          margin-top: 4px;
          z-index: 100;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
          overflow: hidden;
        }
        
        .search-input {
          width: 100%;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          outline: none;
        }
        
        .options-list {
          max-height: 200px;
          overflow-y: auto;
        }
        
        .option {
          padding: 10px 16px;
          cursor: pointer;
          color: #c4b5fd;
        }
        
        .option:hover {
          background: rgba(139, 92, 246, 0.1);
          color: #fff;
        }
        
        .option.selected {
          background: rgba(139, 92, 246, 0.2);
          color: #fff;
        }
      `}</style>
        </div>
    );
};
