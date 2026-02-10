import React from 'react';
import { motion } from 'framer-motion';
import { GravityButton } from '../components/GravityButton';

/**
 * Demo page showcasing the Antigravity Physics Engine
 * Demonstrates: Glassmorphism, Magnetic Cursor, and Kinetic Entry effects
 */
const PhysicsDemo: React.FC = () => {
  return (
    <div className="physics-demo">
      <motion.div
        className="demo-container"
        // KINETIC ENTRY - Staggered load (Domino effect)
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <motion.h1
          className="demo-title"
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          Antigravity Physics Engine
        </motion.h1>

        <motion.p
          className="demo-subtitle"
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          Demonstrating: Glassmorphism • Magnetic Cursor • Kinetic Entry
        </motion.p>

        <motion.div
          className="button-grid"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
        >
          <GravityButton onClick={() => { /* Demo button */ }}>
            Primary Action
          </GravityButton>

          <GravityButton onClick={() => { /* Demo button */ }}>
            Secondary Action
          </GravityButton>

          <GravityButton onClick={() => { /* Demo button */ }}>
            Tertiary Action
          </GravityButton>
        </motion.div>

        <motion.div
          className="info-box"
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1 },
          }}
        >
          <h2>How it works:</h2>
          <ul>
            <li>
              <strong>Glassmorphism:</strong> backdrop-filter: blur(12px) with semi-transparent background
            </li>
            <li>
              <strong>Magnetic Cursor:</strong> Buttons move towards mouse within 50px radius at 20% intensity
            </li>
            <li>
              <strong>Kinetic Entry:</strong> Elements fly in with staggered timing (0.1s delay)
            </li>
          </ul>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .physics-demo {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .demo-container {
          max-width: 900px;
          width: 100%;
          text-align: center;
        }

        .demo-title {
          font-size: 48px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 16px;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .demo-subtitle {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 60px;
          font-weight: 500;
        }

        .button-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 60px;
        }

        .info-box {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 32px;
          text-align: left;
        }

        .info-box h2 {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 20px;
        }

        .info-box ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .info-box li {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 16px;
          line-height: 1.6;
        }

        .info-box strong {
          color: #ffffff;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .demo-title {
            font-size: 36px;
          }

          .demo-subtitle {
            font-size: 16px;
          }

          .button-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PhysicsDemo;
