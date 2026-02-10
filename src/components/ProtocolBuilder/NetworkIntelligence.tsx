import React from 'react';

interface NetworkIntelligenceProps {
    stats: {
        similar_protocols: number;
        remission_rate: number;
        confidence: number;
    };
}

export const NetworkIntelligence: React.FC<NetworkIntelligenceProps> = ({ stats }) => {
    if (!stats.similar_protocols) return null;

    return (
        <div className="network-intelligence">
            <h4>📊 Network Intelligence</h4>
            <div className="stat-item">
                <span className="stat-value">{stats.similar_protocols}</span>
                <span className="stat-label">similar protocols in network</span>
            </div>
            <div className="stat-item">
                <span className="stat-value">{stats.remission_rate}%</span>
                <span className="stat-label">remission rate observed</span>
            </div>
            <div className="confidence-indicator">
                <span className="confidence-label">Confidence:</span>
                <div className="confidence-bar">
                    <div
                        className="confidence-fill"
                        style={{ width: `${stats.confidence}%` }}
                    />
                </div>
            </div>
            <div className="disclaimer">
                ℹ️ Observational data only. Clinical decisions remain with practitioner.
            </div>
            <style jsx>{`
        .network-intelligence {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 8px;
          padding: 16px;
          margin-top: 16px;
          border-left: 3px solid #8b5cf6;
        }
        
        h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: #c4b5fd;
        }
        
        .stat-item {
          display: flex;
          align-items: baseline;
          margin-bottom: 8px;
        }
        
        .stat-value {
          font-size: 18px;
          font-weight: 700;
          color: #f8f9fa;
          margin-right: 8px;
        }
        
        .stat-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .confidence-indicator {
          margin-top: 12px;
          margin-bottom: 8px;
        }
        
        .confidence-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          margin-top: 4px;
        }
        
        .confidence-fill {
          height: 100%;
          background: #10b981;
          border-radius: 2px;
        }
        
        .disclaimer {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 12px;
          font-style: italic;
        }
      `}</style>
        </div>
    );
};
