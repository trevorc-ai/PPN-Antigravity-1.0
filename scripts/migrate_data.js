import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Hardcoded state data to avoid import issues with TS files
const STATE_DATA = [
    { id: 'WA', name: 'Washington', status: 'Pending', license: 'Under Review', news_count: 12 },
    { id: 'OR', name: 'Oregon', status: 'Legal (Regulated)', license: 'Facilitator Required', keyForm: 'Consent for Touch', formUrl: 'https://drive.google.com/file/d/example', news_count: 45 },
    { id: 'CA', name: 'California', status: 'Medical Only', license: 'Research Protocol', news_count: 89 },
    { id: 'AK', name: 'Alaska', status: 'Illegal', license: 'N/A', news_count: 2 },
    { id: 'HI', name: 'Hawaii', status: 'Pending', license: 'Working Group', news_count: 5 },
    { id: 'ID', name: 'Idaho', status: 'Illegal', license: 'N/A', news_count: 1 },
    { id: 'NV', name: 'Nevada', status: 'Decriminalized', license: 'Pending Regulations', news_count: 15 },
    { id: 'AZ', name: 'Arizona', status: 'Illegal', license: 'N/A', news_count: 8 },
    { id: 'UT', name: 'Utah', status: 'Medical Only', license: 'Clinical Only', news_count: 6 },
    { id: 'MT', name: 'Montana', status: 'Illegal', license: 'N/A', news_count: 3 },
    { id: 'WY', name: 'Wyoming', status: 'Illegal', license: 'N/A', news_count: 0 },
    { id: 'CO', name: 'Colorado', status: 'Decriminalized', license: 'NMHA Program', news_count: 67 },
    { id: 'NM', name: 'New Mexico', status: 'Medical Only', license: 'Research', news_count: 4 },
    { id: 'ND', name: 'North Dakota', status: 'Illegal', license: 'N/A', news_count: 1 },
    { id: 'SD', name: 'South Dakota', status: 'Illegal', license: 'N/A', news_count: 0 },
    { id: 'NE', name: 'Nebraska', status: 'Illegal', license: 'N/A', news_count: 2 },
    { id: 'KS', name: 'Kansas', status: 'Illegal', license: 'N/A', news_count: 1 },
    { id: 'OK', name: 'Oklahoma', status: 'Illegal', license: 'N/A', news_count: 3 },
    { id: 'TX', name: 'Texas', status: 'Medical Only', license: 'Research (HB 1802)', news_count: 22 },
    { id: 'MN', name: 'Minnesota', status: 'Pending', license: 'Task Force', news_count: 9 },
    { id: 'IA', name: 'Iowa', status: 'Illegal', license: 'N/A', news_count: 1 },
    { id: 'MO', name: 'Missouri', status: 'Illegal', license: 'N/A', news_count: 4 },
    { id: 'AR', name: 'Arkansas', status: 'Illegal', license: 'N/A', news_count: 0 },
    { id: 'LA', name: 'Louisiana', status: 'Illegal', license: 'N/A', news_count: 1 },
    { id: 'WI', name: 'Wisconsin', status: 'Illegal', license: 'N/A', news_count: 5 },
    { id: 'IL', name: 'Illinois', status: 'Pending', license: 'CURE Act Pending', news_count: 18 },
    { id: 'MI', name: 'Michigan', status: 'Decriminalized', license: 'Local Decrim', news_count: 14 },
    { id: 'IN', name: 'Indiana', status: 'Illegal', license: 'N/A', news_count: 2 },
    { id: 'OH', name: 'Ohio', status: 'Illegal', license: 'N/A', news_count: 6 },
    { id: 'KY', name: 'Kentucky', status: 'Illegal', license: 'Opioid Research', news_count: 3 },
    { id: 'TN', name: 'Tennessee', status: 'Illegal', license: 'N/A', news_count: 2 },
    { id: 'MS', name: 'Mississippi', status: 'Illegal', license: 'N/A', news_count: 0 },
    { id: 'AL', name: 'Alabama', status: 'Illegal', license: 'N/A', news_count: 1 },
    { id: 'ME', name: 'Maine', status: 'Pending', license: 'Bill LD 1914', news_count: 7 },
    { id: 'NH', name: 'New Hampshire', status: 'Illegal', license: 'N/A', news_count: 3 },
    { id: 'VT', name: 'Vermont', status: 'Pending', license: 'S.114', news_count: 4 },
    { id: 'NY', name: 'New York', status: 'Pending', license: 'Action Pending', news_count: 28 },
    { id: 'MA', name: 'Massachusetts', status: 'Pending', license: 'Question 4', news_count: 31 },
    { id: 'RI', name: 'Rhode Island', status: 'Pending', license: 'H 5923', news_count: 5 },
    { id: 'CT', name: 'Connecticut', status: 'Pending', license: 'HB 6734', news_count: 8 },
    { id: 'NJ', name: 'New Jersey', status: 'Pending', license: 'S2934', news_count: 11 },
    { id: 'PA', name: 'Pennsylvania', status: 'Pending', license: 'HB 1393', news_count: 9 },
    { id: 'DE', name: 'Delaware', status: 'Illegal', license: 'N/A', news_count: 1 },
    { id: 'MD', name: 'Maryland', status: 'Pending', license: 'Wellness Fund', news_count: 6 },
    { id: 'DC', name: 'Dist. of Columbia', status: 'Decriminalized', license: 'I-81', news_count: 10 },
    { id: 'VA', name: 'Virginia', status: 'Illegal', license: 'N/A', news_count: 5 },
    { id: 'WV', name: 'West Virginia', status: 'Illegal', license: 'N/A', news_count: 0 },
    { id: 'NC', name: 'North Carolina', status: 'Pending', license: 'Research Bill', news_count: 4 },
    { id: 'SC', name: 'South Carolina', status: 'Illegal', license: 'N/A', news_count: 1 },
    { id: 'GA', name: 'Georgia', status: 'Illegal', license: 'N/A', news_count: 3 },
    { id: 'FL', name: 'Florida', status: 'Illegal', license: 'N/A', news_count: 12 },
];

async function migrate() {
    console.log('Starting migration to Supabase...');

    // 1. Regulatory States (Existing Goal)
    const records = STATE_DATA.map(state => ({
        id: state.id,
        name: state.name,
        status: state.status,
        license_info: state.license,
        key_form: state.keyForm,
        form_url: state.formUrl,
        news_count: state.news_count,
        updated_at: new Date().toISOString()
    }));

    // Upsert Regulatory Data
    const { error: regError } = await supabase
        .from('regulatory_states')
        .upsert(records, { onConflict: 'id' });

    if (regError) {
        console.error('Error migrating regulatory_states:', regError.message);
    } else {
        console.log(`✅ Successfully migrated ${records.length} regulatory states.`);
    }
}

migrate();
