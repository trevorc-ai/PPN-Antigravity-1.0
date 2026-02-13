import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { generateSubjectID } from '../utils/subjectIdGenerator';
import { PatientSelectionScreen } from '../components/ProtocolBuilder/PatientSelectionScreen';
import { PatientLookupModal } from '../components/ProtocolBuilder/PatientLookupModal';
import { TabNavigation } from '../components/ProtocolBuilder/TabNavigation';
import { Tab1_PatientInfo } from '../components/ProtocolBuilder/Tab1_PatientInfo';
import { Tab2_Medications } from '../components/ProtocolBuilder/Tab2_Medications';
import { Tab3_ProtocolDetails } from '../components/ProtocolBuilder/Tab3_ProtocolDetails';
import { ClinicalInsightsPanel } from '../components/ProtocolBuilder/ClinicalInsightsPanel';
import { SubmissionSuccessScreen } from '../components/ProtocolBuilder/SubmissionSuccessScreen';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type WorkflowScreen = 'selection' | 'form' | 'success';

interface ProtocolFormData {
  subject_id: string;
  session_number: number;
  patient_age: string;
  patient_sex: string;
  patient_weight_range: string;
  smoking_status: string;
  prior_experience: string;
  concomitant_medication_ids: number[];
  indication_id: number | null;
  substance_id: number | null;
  dosage_mg: number | null;
  dosage_unit: string;
  route_id: number | null;
  session_date: string;
  consent_verified: boolean;
}

export const ProtocolBuilder = () => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<WorkflowScreen>('selection');
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [completedTabs, setCompletedTabs] = useState<number[]>([]);
  const [isPreFilled, setIsPreFilled] = useState(false);
  const [preFillDate, setPreFillDate] = useState<string>('');

  const [formData, setFormData] = useState<ProtocolFormData>({
    subject_id: generateSubjectID(),
    session_number: 1,
    patient_age: '',
    patient_sex: '',
    patient_weight_range: '',
    smoking_status: '',
    prior_experience: '',
    concomitant_medication_ids: [],
    indication_id: null,
    substance_id: null,
    dosage_mg: null,
    dosage_unit: 'mg',
    route_id: null,
    session_date: new Date().toISOString().split('T')[0],
    consent_verified: false,
  });

  // --- HANDLERS ---

  const handleNewPatient = () => {
    setFormData({
      ...formData,
      subject_id: generateSubjectID(),
      session_number: 1,
    });
    setScreen('form');
    setActiveTab(1);
    setCompletedTabs([]);
    setIsPreFilled(false);
  };

  const handleExistingPatient = () => {
    setShowLookupModal(true);
  };

  const handleSelectPatient = async (patient: any) => {
    // Fetch last record for this patient
    const { data, error } = await supabase
      .from('log_clinical_records')
      .select('*')
      .eq('subject_id', patient.subject_id)
      .order('session_number', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      console.error('Error fetching patient record:', error);
      return;
    }

    // Pre-fill form with last session data
    setFormData({
      subject_id: data.subject_id,
      session_number: data.session_number + 1, // Auto-increment
      patient_age: data.patient_age || '',
      patient_sex: data.patient_sex || '',
      patient_weight_range: data.patient_weight_range || '',
      smoking_status: data.smoking_status || '',
      prior_experience: data.prior_experience || '',
      concomitant_medication_ids: data.concomitant_medication_ids || [],
      indication_id: data.indication_id,
      substance_id: data.substance_id,
      dosage_mg: data.dosage_mg,
      dosage_unit: data.dosage_unit || 'mg',
      route_id: data.route_id,
      session_date: new Date().toISOString().split('T')[0], // Today's date
      consent_verified: false, // Reset consent
    });

    setIsPreFilled(true);
    setPreFillDate(data.session_date);
    setShowLookupModal(false);
    setScreen('form');
    setActiveTab(1);
    setCompletedTabs([]);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTabChange = (tab: number) => {
    setActiveTab(tab);
  };

  const handleNextTab = () => {
    if (!completedTabs.includes(activeTab)) {
      setCompletedTabs([...completedTabs, activeTab]);
    }
    setActiveTab(activeTab + 1);
  };

  const handlePreviousTab = () => {
    setActiveTab(activeTab - 1);
  };

  const isTabComplete = (tab: number): boolean => {
    switch (tab) {
      case 1:
        return !!(formData.patient_age && formData.patient_sex && formData.patient_weight_range);
      case 2:
        return true; // Medications are optional
      case 3:
        return !!(
          formData.indication_id &&
          formData.substance_id &&
          formData.dosage_mg &&
          formData.route_id &&
          formData.session_date &&
          formData.consent_verified
        );
      default:
        return false;
    }
  };

  const canSubmit = (): boolean => {
    return isTabComplete(1) && isTabComplete(3);
  };

  const handleSubmit = async () => {
    if (!canSubmit()) {
      alert('Please complete all required fields');
      return;
    }

    // Insert into database
    const { data, error } = await supabase
      .from('log_clinical_records')
      .insert([
        {
          ...formData,
          submitted_at: new Date().toISOString(), // Set submission timestamp
          is_submitted: true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Submission error:', error);
      alert('Error submitting protocol. Please try again.');
      return;
    }

    console.log('Protocol submitted successfully:', data);
    setScreen('success');
  };

  const handleBackToReview = () => {
    setScreen('form');
    setActiveTab(3);
  };

  const handleTrackAnother = () => {
    setScreen('selection');
    setFormData({
      subject_id: generateSubjectID(),
      session_number: 1,
      patient_age: '',
      patient_sex: '',
      patient_weight_range: '',
      smoking_status: '',
      prior_experience: '',
      concomitant_medication_ids: [],
      indication_id: null,
      substance_id: null,
      dosage_mg: null,
      dosage_unit: 'mg',
      route_id: null,
      session_date: new Date().toISOString().split('T')[0],
      consent_verified: false,
    });
    setActiveTab(1);
    setCompletedTabs([]);
    setIsPreFilled(false);
  };

  const handleReturnToDashboard = () => {
    navigate('/');
  };

  // --- RENDER ---

  if (screen === 'selection') {
    return (
      <>
        <PatientSelectionScreen
          onNewPatient={handleNewPatient}
          onExistingPatient={handleExistingPatient}
        />
        <PatientLookupModal
          isOpen={showLookupModal}
          onClose={() => setShowLookupModal(false)}
          onSelectPatient={handleSelectPatient}
        />
      </>
    );
  }

  if (screen === 'success') {
    return (
      <SubmissionSuccessScreen
        subjectId={formData.subject_id}
        sessionNumber={formData.session_number}
        onBackToReview={handleBackToReview}
        onTrackAnother={handleTrackAnother}
        onReturnToDashboard={handleReturnToDashboard}
      />
    );
  }

  // Form Screen
  const showClinicalInsights = isTabComplete(1) && formData.indication_id && formData.substance_id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020408] via-[#0a0e1a] to-[#020408] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-[#f8fafc]">Protocol Builder</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#94a3b8]">
                Subject ID: <span className="font-mono text-[#14b8a6]">{formData.subject_id}</span>
              </span>
              <span className="text-sm text-[#94a3b8]">
                Session {formData.session_number}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content: 60/40 Split */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column: Form (60%) */}
          <div className="lg:col-span-3">
            <div className="bg-[#0f1218] border border-[#1e293b] rounded-xl p-6">
              <TabNavigation
                activeTab={activeTab}
                completedTabs={completedTabs}
                onTabChange={handleTabChange}
              />

              {/* Tab Content */}
              <div className="mt-6">
                {activeTab === 1 && (
                  <Tab1_PatientInfo
                    formData={{
                      patient_age: formData.patient_age,
                      patient_sex: formData.patient_sex,
                      patient_weight_range: formData.patient_weight_range,
                      smoking_status: formData.smoking_status,
                      prior_experience: formData.prior_experience,
                    }}
                    onChange={handleFormChange}
                    isPreFilled={isPreFilled}
                    preFillDate={preFillDate}
                  />
                )}

                {activeTab === 2 && (
                  <Tab2_Medications
                    selectedMedications={formData.concomitant_medication_ids}
                    onChange={(meds) => handleFormChange('concomitant_medication_ids', meds)}
                  />
                )}

                {activeTab === 3 && (
                  <Tab3_ProtocolDetails
                    formData={{
                      indication_id: formData.indication_id,
                      substance_id: formData.substance_id,
                      dosage_mg: formData.dosage_mg,
                      dosage_unit: formData.dosage_unit,
                      route_id: formData.route_id,
                      session_number: formData.session_number,
                      session_date: formData.session_date,
                      consent_verified: formData.consent_verified,
                    }}
                    onChange={handleFormChange}
                    patientWeight={formData.patient_weight_range}
                  />
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#1e293b]">
                <button
                  onClick={handlePreviousTab}
                  disabled={activeTab === 1}
                  className="flex items-center gap-2 px-6 py-3 bg-[#020408] border border-[#1e293b] text-[#f8fafc] rounded-lg font-medium hover:border-[#14b8a6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {activeTab < 3 ? (
                  <button
                    onClick={handleNextTab}
                    disabled={!isTabComplete(activeTab)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit()}
                    className="px-8 py-3 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit to Registry
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Clinical Insights (40%) */}
          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <ClinicalInsightsPanel isVisible={showClinicalInsights} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolBuilder;