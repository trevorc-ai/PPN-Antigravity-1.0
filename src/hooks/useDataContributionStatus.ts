import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

export interface DataContributionStatus {
    isContributor: boolean;
    totalOutcomes: number;
    outcomesNeeded: number;
    isLoading: boolean;
    error: string | null;
}

const OUTCOMES_REQUIRED = 5; // Configurable threshold for 'Give-to-Get'

export const useDataContributionStatus = (): DataContributionStatus => {
    const { user } = useAuth();
    const [status, setStatus] = useState<Omit<DataContributionStatus, 'isLoading' | 'error'>>({
        isContributor: false,
        totalOutcomes: 0,
        outcomesNeeded: OUTCOMES_REQUIRED
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const checkStatus = async () => {
            if (!user) {
                if (isMounted) setIsLoading(false);
                return;
            }

            try {
                // Fetch contributor status from user_profiles table
                const { data, error: fetchError } = await supabase
                    .from('user_profiles')
                    .select('data_contributor_status, total_valid_outcomes')
                    .eq('user_id', user.id)
                    .single();

                if (fetchError) {
                    if (fetchError.code !== 'PGRST116') { // PGRST116 is "Rows not found", which is handled by falling back to false.
                        throw fetchError;
                    }
                }

                if (isMounted) {
                    const totalOutcomes = data?.total_valid_outcomes || 0;
                    const isContributor = data?.data_contributor_status || totalOutcomes >= OUTCOMES_REQUIRED;

                    setStatus({
                        isContributor,
                        totalOutcomes,
                        outcomesNeeded: Math.max(0, OUTCOMES_REQUIRED - totalOutcomes)
                    });
                    setError(null);
                }
            } catch (err) {
                console.error('Error fetching contribution status:', err);
                if (isMounted) {
                    setError('Failed to load data contribution status.');
                    // Default to non-contributor on error to be safe
                    setStatus(s => ({ ...s, isContributor: false }));
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        checkStatus();

        return () => {
            isMounted = false;
        };
    }, [user?.id]);

    return { ...status, isLoading, error };
};
