import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { User, Building2, Stethoscope, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Section } from '../components/layouts/Section';

interface ProfileFormData {
    first_name: string;
    last_name: string;
    display_name: string;
    specialty: string;
    organization_name: string;
}

const SPECIALTIES = [
    'Psychiatry',
    'Psychology',
    'Counseling',
    'Social Work',
    'Nursing',
    'Research',
    'Other'
];

const ProfileSetup: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<ProfileFormData>({
        first_name: '',
        last_name: '',
        display_name: '',
        specialty: '',
        organization_name: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    throw error;
                }

                if (data) {
                    setFormData({
                        first_name: data.first_name || '',
                        last_name: data.last_name || '',
                        display_name: data.display_name || '',
                        specialty: data.specialty || '',
                        organization_name: data.organization_name || ''
                    });
                }
            } catch (err: any) {
                console.error('Error fetching profile:', err);
                // Don't block the UI, just log the error
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setError(null);
        setSaving(true);

        try {
            const updates = {
                user_id: user.id,
                ...formData,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from('user_profiles')
                .upsert(updates);

            if (error) throw error;

            navigate('/dashboard');
        } catch (err: any) {
            console.error('Error updating profile:', err);
            setError(err.message || 'Failed to update profile');
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0c12]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0c12] text-slate-200 flex flex-col relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-lg">
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                            <User className="w-8 h-8 text-blue-400" />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Complete Your Profile</h1>
                        <p className="text-slate-400">Please provide a few details to set up your clinical workspace.</p>
                    </div>

                    <div className="bg-[#0e121b] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                        {/* Form Glow */}
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                                <span className="material-symbols-outlined">error</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="first_name" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        First Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        id="first_name"
                                        name="first_name"
                                        type="text"
                                        required
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                        placeholder="Jane"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="last_name" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Last Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        id="last_name"
                                        name="last_name"
                                        type="text"
                                        required
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="display_name" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Display Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-600" />
                                    <input
                                        id="display_name"
                                        name="display_name"
                                        type="text"
                                        value={formData.display_name}
                                        onChange={handleChange}
                                        className="w-full bg-[#0a0c12] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                        placeholder="Dr. Jane Doe (How you'll appear in the system)"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="specialty" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Specialty
                                </label>
                                <div className="relative">
                                    <Stethoscope className="absolute left-4 top-3.5 w-4 h-4 text-slate-600" />
                                    <select
                                        id="specialty"
                                        name="specialty"
                                        value={formData.specialty}
                                        onChange={handleChange}
                                        className="w-full bg-[#0a0c12] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
                                    >
                                        <option value="">Select your specialty...</option>
                                        {SPECIALTIES.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-4 pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-600 text-sm">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="organization_name" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Organization
                                </label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-3.5 w-4 h-4 text-slate-600" />
                                    <input
                                        id="organization_name"
                                        name="organization_name"
                                        type="text"
                                        value={formData.organization_name}
                                        onChange={handleChange}
                                        className="w-full bg-[#0a0c12] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                        placeholder="Clinic or Hospital Name"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_25px_rgba(37,99,235,0.5)] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {saving ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Complete Setup
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 flex justify-center gap-2 text-slate-500 text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Secure Encrypted</span>
                        </div>
                        <span className="text-slate-700">•</span>
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>HIPAA Compliant</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetup;
