// ThemeToggle — cockpit mode was removed (ThemeContext is a no-op stub).
// This component now returns null to avoid dead TS comparisons.
// If a theme toggle is re-introduced in future, this is the component to restore.
import React from 'react';
export const ThemeToggle: React.FC = () => null;
export default ThemeToggle;
