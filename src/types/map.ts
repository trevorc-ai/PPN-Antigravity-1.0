export interface USMapFilterProps {
    selectedStates?: string[];
    onStateClick: (stateCode: string, stateName: string) => void;
    multiSelect?: boolean;
    className?: string;
    showSelectedBadges?: boolean;
    disabled?: boolean;
}

export interface StateGeography {
    rsmKey: string;
    properties: {
        name: string;
    };
}
