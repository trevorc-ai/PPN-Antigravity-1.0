import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useToast } from '../contexts/ToastContext';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import { ArrowLeft, Save, X } from 'lucide-react';

interface ProfileFormData {
    display_name: string;
    specialty: string;
    is_profile_public: boolean;
}

const ProfileEdit: React.FC = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<ProfileFormData>({
        display_name: '',
        specialty: '',
        is_profile_public: false
    });
    const [errors, setErrors] = useState<Partial<ProfileFormData>>({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/');
                return;
            }

            const { data: profile, error } = await supabase
                .from('log_user_profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) throw error;

            if (profile) {
                setFormData({
                    display_name: profile.display_name || '',
                    specialty: profile.specialty || '',
                    is_profile_public: profile.is_profile_public || false
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            addToast({
                title: 'Error',
                message: 'Failed to load profile data',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<ProfileFormData> = {};

        if (!formData.display_name.trim()) {
            newErrors.display_name = 'Display name is required';
        } else if (formData.display_name.length > 100) {
            newErrors.display_name = 'Display name must be 100 characters or less';
        } else if (!/^[a-zA-Z0-9\s\-\.]+$/.test(formData.display_name)) {
            newErrors.display_name = 'Display name contains invalid characters';
        }

        if (formData.specialty && formData.specialty.length > 100) {
            newErrors.specialty = 'Specialty must be 100 characters or less';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            addToast({
                title: 'Validation Error',
                message: 'Please fix the errors before saving',
                type: 'error'
            });
            return;
        }

        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('log_user_profiles')
                .update({
                    display_name: formData.display_name.trim(),
                    specialty: formData.specialty.trim(),
                    is_profile_public: formData.is_profile_public,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', user.id);

            if (error) throw error;

            addToast({
                title: 'Success',
                message: 'Profile updated successfully',
                type: 'success'
            });

            navigate(-1);
        } catch (error) {
            console.error('Error updating profile:', error);
            addToast({
                title: 'Error',
                message: 'Failed to update profile',
                type: 'error'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <PageContainer className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-slate-300">Loading profile...</p>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer className="max-w-3xl py-8">
            <Section spacing="tight">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={handleCancel}
                        className="size-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-slate-300 transition-all"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-300 tracking-tight">Edit Profile</h1>
                        <p className="text-sm text-slate-300 mt-1">Update your display name, specialty, and privacy settings</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-[#0a0c12]/50 border border-slate-800/50 rounded-2xl p-8">
                    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">

                        {/* Display Name */}
                        <div>
                            <label htmlFor="display_name" className="block text-sm font-bold text-slate-300 mb-2">
                                Display Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="display_name"
                                type="text"
                                value={formData.display_name}
                                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                className={`w-full px-4 py-3 bg-black/40 border ${errors.display_name ? 'border-red-500' : 'border-slate-700/50'} rounded-xl text-slate-300 placeholder-slate-500 focus:outline-none focus:border-primary transition-colors`}
                                placeholder="Dr. Jane Smith"
                                maxLength={100}
                                required
                                aria-invalid={!!errors.display_name}
                                aria-describedby={errors.display_name ? 'display_name_error' : undefined}
                            />
                            {errors.display_name && (
                                <p id="display_name_error" className="text-red-400 text-sm mt-2" role="alert">
                                    {errors.display_name}
                                </p>
                            )}
                            <p className="text-xs text-slate-3000 mt-1">
                                {formData.display_name.length}/100 characters
                            </p>
                        </div>

                        {/* Specialty */}
                        <div>
                            <label htmlFor="specialty" className="block text-sm font-bold text-slate-300 mb-2">
                                Specialty
                            </label>
                            <input
                                id="specialty"
                                type="text"
                                value={formData.specialty}
                                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                className={`w-full px-4 py-3 bg-black/40 border ${errors.specialty ? 'border-red-500' : 'border-slate-700/50'} rounded-xl text-slate-300 placeholder-slate-500 focus:outline-none focus:border-primary transition-colors`}
                                placeholder="Psychiatrist, Therapist, Researcher"
                                maxLength={100}
                                aria-invalid={!!errors.specialty}
                                aria-describedby={errors.specialty ? 'specialty_error' : undefined}
                            />
                            {errors.specialty && (
                                <p id="specialty_error" className="text-red-400 text-sm mt-2" role="alert">
                                    {errors.specialty}
                                </p>
                            )}
                            <p className="text-xs text-slate-3000 mt-1">
                                {formData.specialty.length}/100 characters
                            </p>
                        </div>

                        {/* Privacy Toggle */}
                        <div className="pt-4 border-t border-slate-800">
                            <div className="flex items-start gap-4">
                                <div className="flex items-center h-6">
                                    <input
                                        id="is_profile_public"
                                        type="checkbox"
                                        checked={formData.is_profile_public}
                                        onChange={(e) => setFormData({ ...formData, is_profile_public: e.target.checked })}
                                        className="size-5 rounded bg-black/40 border-slate-700 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 cursor-pointer"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="is_profile_public" className="block text-sm font-bold text-slate-300 cursor-pointer">
                                        Make my profile public
                                    </label>
                                    <p className="text-xs text-slate-300 mt-1">
                                        Allow other practitioners in the network to view your profile and credentials
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4 pt-6">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 px-6 py-3 bg-primary hover:bg-blue-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-300 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                            >
                                <Save className="w-5 h-5" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={saving}
                                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 hover:text-slate-300 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <X className="w-5 h-5" />
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </Section>
        </PageContainer>
    );
};

export default ProfileEdit;
