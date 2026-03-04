import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export type CompassMode = 'daily' | 'report';

export interface CompassModeData {
    mode: CompassMode;
    practitionerView: boolean; // ?pv=1
    demoMode: boolean;          // ?demo=1 or NODE_ENV !== 'production'
}

export function useCompassMode(emaPointCount: number): CompassModeData {
    const [searchParams] = useSearchParams();

    return useMemo(() => {
        const practitionerView = searchParams.get('pv') === '1';
        const demoMode =
            searchParams.get('demo') === '1' ||
            import.meta.env.MODE !== 'production';
        // Daily mode: patient has submitted at least one check-in after returning
        const mode: CompassMode = emaPointCount > 0 ? 'daily' : 'report';
        return { mode, practitionerView, demoMode };
    }, [searchParams, emaPointCount]);
}
