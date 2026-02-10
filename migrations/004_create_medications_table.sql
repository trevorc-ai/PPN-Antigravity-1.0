-- 004_create_medications_table.sql
-- Create reference table for concomitant medications to replace free-text storage

CREATE TABLE IF NOT EXISTS public.ref_medications (
    medication_id BIGSERIAL PRIMARY KEY,
    medication_name TEXT NOT NULL UNIQUE,
    rxnorm_cui BIGINT, -- Future integration point
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.ref_medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read access for authenticated users" ON public.ref_medications
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Write access for network_admin only" ON public.ref_medications
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_sites
            WHERE user_id = auth.uid() AND role = 'network_admin'
        )
    );

-- Seed Data from constants.ts
INSERT INTO public.ref_medications (medication_name) VALUES
('Fluoxetine (Prozac)'),
('Sertraline (Zoloft)'),
('Citalopram (Celexa)'),
('Escitalopram (Lexapro)'),
('Paroxetine (Paxil)'),
('Venlafaxine (Effexor)'),
('Duloxetine (Cymbalta)'),
('Phenelzine (Nardil)'),
('Tranylcypromine (Parnate)'),
('Selegiline (Emsam)'),
('Lithium'),
('Valproate (Depakote)'),
('Lamotrigine (Lamictal)'),
('Carbamazepine (Tegretol)'),
('Alprazolam (Xanax)'),
('Clonazepam (Klonopin)'),
('Diazepam (Valium)'),
('Lorazepam (Ativan)'),
('Quetiapine (Seroquel)'),
('Olanzapine (Zyprexa)'),
('Risperidone (Risperdal)'),
('Aripiprazole (Abilify)'),
('Amphetamine/Dextroamphetamine (Adderall)'),
('Methylphenidate (Ritalin)'),
('Lisdexamfetamine (Vyvanse)'),
('Modafinil (Provigil)'),
('Propranolol'),
('Atenolol'),
('Atorvastatin'),
('Simvastatin'),
('Levothyroxine'),
('Metformin'),
('Omeprazole'),
('Lisinopril'),
('Bupropion (Wellbutrin)'),
('Trazodone'),
('Buspirone'),
('Gabapentin'),
('Pregabalin (Lyrica)')
ON CONFLICT (medication_name) DO NOTHING;
