
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import TopHeader from '../components/TopHeader';

export const ProfileEdit: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        display_name: '',
        specialty: '',
        organization_name: '',
        bio: '',
        is_public: false
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error('No user found');

            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) throw error;

            if (data) {
                setFormData({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    display_name: data.display_name || '',
                    specialty: data.specialty || '',
                    organization_name: data.organization_name || '',
                    bio: data.bio || '', // Assuming 'bio' column exists, if not we might need to add it or ignore
                    is_public: data.features?.is_public || false // Storing visibility in features jsonb if no column
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggle = (checked: boolean) => {
        setFormData(prev => ({ ...prev, is_public: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            const updates = {
                user_id: user.id,
                first_name: formData.first_name,
                last_name: formData.last_name,
                display_name: formData.display_name,
                specialty: formData.specialty,
                organization_name: formData.organization_name,
                updated_at: new Date().toISOString(),
                // Store bio and visibility in features jsonb if columns don't exist yet, 
                // or map to columns if they do. For safety, let's assume we update the known columns
                // and maybe jam the rest into features if needed, but let's stick to the SQL schema we saw.
                // The SQL showed: first_name, last_name, display_name, specialty, organization_name.
                // It did NOT show 'bio'. It showed 'features' JSONB.
                features: {
                    is_public: formData.is_public,
                    bio: formData.bio
                }
            };

            const { error } = await supabase
                .from('user_profiles')
                .upsert(updates)
                .eq('user_id', user.id);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            // Dispatch event to update TopHeader
            window.dispatchEvent(new Event('profile-updated'));

        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center text-slate-400">Loading profile...</div>;
    }

    return (
        <div className="min-h-screen bg-[#0B0E11] font-sans">
            <TopHeader />

            <main className="max-w-3xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-100">Edit Profile</h1>
                    <p className="text-slate-400 mt-2">Manage your public presence and professional details.</p>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Public Visibility */}
                    <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-200">Public Profile</h3>
                                <p className="text-slate-400 text-sm mt-1">Allow other researchers to see your profile.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleToggle(!formData.is_public)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.is_public ? 'bg-teal-500' : 'bg-slate-700'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.is_public ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 space-y-6">
                        <h3 className="text-xl font-semibold text-slate-200 mb-4">Basic Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="w-full bg-[#0B0E11] border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="w-full bg-[#0B0E11] border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Display Name</label>
                            <input
                                type="text"
                                name="display_name"
                                value={formData.display_name}
                                onChange={handleChange}
                                placeholder="e.g. Dr. Jane Smith"
                                className="w-full bg-[#0B0E11] border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                            />
                            <p className="text-xs text-slate-500 mt-1">This is how your name will appear to others.</p>
                        </div>
                    </div>

                    {/* Professional Details */}
                    <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 space-y-6">
                        <h3 className="text-xl font-semibold text-slate-200 mb-4">Professional Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Specialty</label>
                                <input
                                    type="text"
                                    name="specialty"
                                    value={formData.specialty}
                                    onChange={handleChange}
                                    placeholder="e.g. Psychiatry, Neuroscience"
                                    className="w-full bg-[#0B0E11] border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Organization / Clinic</label>
                                <input
                                    type="text"
                                    name="organization_name"
                                    value={formData.organization_name}
                                    onChange={handleChange}
                                    placeholder="e.g. Pacific Neuroscience Institute"
                                    className="w-full bg-[#0B0E11] border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Tell us about your research focus..."
                                className="w-full bg-[#0B0E11] border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`px-8 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-lg shadow-lg hover:shadow-teal-500/25 transition-all ${saving ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default ProfileEdit;
