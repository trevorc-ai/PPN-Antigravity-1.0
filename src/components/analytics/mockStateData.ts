
// import { StateData } from './RegulatoryHexMap';

export const DEFAULT_STATES: Record<string, any> = {
    OR: { id: 'OR', name: 'Oregon', status: 'Legal (Regulated)', license: 'Facilitator Required', keyForm: 'Consent for Touch', formUrl: '#', news_count: 45 },
    CO: { id: 'CO', name: 'Colorado', status: 'Decriminalized', license: 'Healing Center License', keyForm: 'Natural Medicine Act', formUrl: '#', news_count: 32 },
    CA: { id: 'CA', name: 'California', status: 'Pending', license: 'Senate Bill 58 (Vetoed)', keyForm: 'Legislative text', formUrl: '#', news_count: 12 },
    WA: { id: 'WA', name: 'Washington', status: 'Pending', license: 'S.B. 5263 Proposed', keyForm: 'Wellness Service', formUrl: '#', news_count: 8 },
    AK: { id: 'AK', name: 'Alaska', status: 'Illegal', license: 'None', keyForm: '', news_count: 0 },
    // ... Add more as needed for the visual map to not be empty
    NY: { id: 'NY', name: 'New York', status: 'Pending', license: 'Assembly Bill A0114', keyForm: '', news_count: 5 },
    MA: { id: 'MA', name: 'Massachusetts', status: 'Pending', license: 'Ballot Initiative', keyForm: '', news_count: 15 },
    TX: { id: 'TX', name: 'Texas', status: 'Medical Only', license: 'Clinical Trial Only', keyForm: '', news_count: 3 },
};
