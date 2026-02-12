import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { generateSubjectID } from '../utils/subjectIdGenerator';
import { generateSmartProtocol } from '../services/protocolIntelligence';
import { Section1_Indication } from '../components/ProtocolBuilder/Section1_Indication';
import { Section2_Treatment } from '../components/ProtocolBuilder/Section2_Treatment';
import { Section3_Context } from '../components/ProtocolBuilder/Section3_Context';
import { PreviewPanel } from '../components/ProtocolBuilder/PreviewPanel';
import { SuccessAnimation } from '../components/ProtocolBuilder/SuccessAnimation';
import { ProgressBar } from '../components/ProtocolBuilder/ProgressBar';

export const ProtocolBuilder = () => {
  // --- STATE ---
  const [protocol, setProtocol] = useState({
    subject_id: generateSubjectID(),
    indication_id: null,
    substance_id: null,
    route_id: null,
    session_number: 1,
    session_date: new Date(),
    // Add other fields as needed
  });

  const [networkStats, setNetworkStats] = useState({
    similar_protocols: 0,
    remission_rate: 0,
    confidence: 0
  });

  const [uiState, setUiState] = useState({
    autoFilled: false,
    loading: false,
    showSuccess: false,
    timeSaved: 0
  });

  // --- LOGIC ---

  const handleIndicationSelect = async (indication_id: number) => {
    setUiState(prev => ({ ...prev, loading: true }));

    // Simulate API call to intelligence engine
    // In real app: const smartData = await generateSmartProtocol(indication_id, 'current_user_id');

    // MOCK DATA FOR DEMO
    setTimeout(() => {
      setProtocol(prev => ({
        ...prev,
        indication_id,
        substance_id: 1, // Mock: Psilocybin
        route_id: 1,     // Mock: Oral
        session_number: 1
      }));

      setNetworkStats({
        similar_protocols: 847,
        remission_rate: 68,
        confidence: 90
      });

      setUiState(prev => ({
        ...prev,
        loading: false,
        autoFilled: true,
        timeSaved: 263 // Mock seconds saved
      }));
    }, 600);
  };

  const handleProtocolChange = (field: string, value: any) => {
    setProtocol(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Save to Supabase logic here
    setUiState(prev => ({ ...prev, showSuccess: true }));

    // Reset after success
    setTimeout(() => {
      setUiState(prev => ({ ...prev, showSuccess: false }));
      // Generate new ID for next one
      setProtocol(prev => ({ ...prev, subject_id: generateSubjectID() }));
    }, 2500);
  };

  // --- RENDER ---

  const completionPercentage = [
    protocol.indication_id,
    protocol.substance_id,
    protocol.route_id
  ].filter(Boolean).length / 3 * 100;

  return (
    <div className="protocol-builder-page">
      <div className="builder-container">

        <div className="header-row">
          <h1>Clinical Command Center</h1>
          <div className="progress-wrapper">
            <ProgressBar progress={completionPercentage} />
          </div>
        </div>

        <div className="grid-layout">
          {/* LEFT COLUMN: INPUTS */}
          <div className="input-column">
            <Section1_Indication
              selectedId={protocol.indication_id}
              onSelect={handleIndicationSelect}
            />

            {protocol.indication_id && (
              <>
                <Section2_Treatment
                  protocol={protocol}
                  onChange={handleProtocolChange}
                  autoFilled={uiState.autoFilled}
                />

                <Section3_Context
                  protocol={protocol}
                  onChange={handleProtocolChange}
                />
              </>
            )}
          </div>

          {/* RIGHT COLUMN: PREVIEW */}
          <div className="preview-column">
            <PreviewPanel
              protocol={protocol}
              networkStats={networkStats}
              timeSaved={uiState.timeSaved}
              onSave={handleSave}
              isValid={completionPercentage === 100}
            />
          </div>
        </div>

      </div>

      {uiState.showSuccess && (
        <SuccessAnimation
          onComplete={() => { }}
          message="Protocol Saved!"
          subMessage="Network intelligence updated."
        />
      )}

      <style jsx>{`
        .protocol-builder-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
          color: #fff;
          padding: 40px;
          font-family: 'Inter', sans-serif;
        }

        .builder-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        h1 {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(90deg, #fff, #c4b5fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .progress-wrapper {
          width: 300px;
        }

        .grid-layout {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 32px;
        }

        .input-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .preview-column {
          position: relative;
        }

        @media (max-width: 1024px) {
          .grid-layout {
            grid-template-columns: 1fr;
          }
          
          .preview-column {
            order: -1; /* Show preview on top on mobile? Or bottom */
            margin-bottom: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProtocolBuilder;