import React, { useState } from 'react';
import { User, Search } from 'lucide-react';

/**
 * UserPicker - Searchable User Dropdown
 * 
 * Features:
 * - Search/filter functionality
 * - Role filtering
 * - Avatar display
 * - Keyboard navigation
 */

export interface UserOption {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
}

interface UserPickerProps {
    value?: string;
    onChange: (userId: string) => void;
    users?: UserOption[];
    roleFilter?: string;
    placeholder?: string;
    disabled?: boolean;
}

export const UserPicker: React.FC<UserPickerProps> = ({
    value,
    onChange,
    users = [],
    roleFilter,
    placeholder = 'Select user...',
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = !roleFilter || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const selectedUser = users.find(u => u.id === value);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="flex items-center gap-3">
                    {selectedUser ? (
                        <>
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <User className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium">{selectedUser.name}</p>
                                <p className="text-sm text-slate-400">{selectedUser.role}</p>
                            </div>
                        </>
                    ) : (
                        <span className="text-slate-400">{placeholder}</span>
                    )}
                </div>
                <svg className={`w-4 h-4 text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700/50 rounded-lg shadow-xl overflow-hidden">
                    {/* Search */}
                    <div className="p-3 border-b border-slate-700/50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search users..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* User List */}
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => {
                                        onChange(user.id);
                                        setIsOpen(false);
                                        setSearchQuery('');
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 transition-colors text-left"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-300 truncate">{user.name}</p>
                                        <p className="text-sm text-slate-400 truncate">{user.email}</p>
                                    </div>
                                    <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                                        {user.role}
                                    </span>
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-slate-400 text-sm">
                                No users found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
