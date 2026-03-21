# Changelog

All notable changes to the PPN Research Portal will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-02-12

### Added
- **Accessibility Protocols** - Mandatory "Identity Headers" and "Sidebar Naming" for all agent responses.
- **Agent Configuration** - Updated `agent.yaml` to enforce accessibility rules in system prompt.
- **Documentation** - Updated `TEAM_HANDOFF_PROTOCOLS.md` with Section 5 (Accessibility Standards).

## [1.0.0] - 2026-02-10

### Added
- **New SVG Logo Component** (`PPNLogo.tsx`) - Premium molecular network design with gradients and optional animation
- **Comprehensive Site Audit** - Full-stack review documented in `_agent_status.md`
- **Advanced Tooltip System** - 3-tier tooltip component with accessibility features
- **Print Optimization** - Analytics and ProtocolDetail pages now print-friendly
- **Protocol Builder V1 Spec** - Complete implementation guide with 24-hour timeline
- **Glassmorphic Design System** - Consistent card components and visual language

### Changed
- **Header Layout** - All elements now right-justified for improved visual hierarchy
- **Font Size Compliance** - All text-[9px] instances upgraded to text-[10px] minimum (33 files affected)
- **Tooltip Standardization** - Migrated from SimpleTooltip to AdvancedTooltip in ProtocolDetail
- **Package Version** - Bumped from 0.0.0 to 1.0.0 for production readiness

### Fixed
- **Double Scroll Issue** - Resolved nested overflow in ClinicPerformanceRadar component
- **Print Styles** - Chart tooltips now render correctly on paper
- **Accessibility** - Minimum font size now enforced site-wide (10px minimum)

### Security
- **Removed Development Bypass** - Eliminated console.log statement exposing dev backdoor in Landing.tsx

### Deprecated
- **SimpleTooltip Component** - Replaced by AdvancedTooltip (to be removed in 2.0.0)

## [0.9.0] - 2026-02-09

### Added
- Patient Flow analytics page
- Deep dive pages for clinical intelligence
- Protocol Builder redesign (V1 implementation)
- Supabase authentication integration

### Changed
- Migrated from React 18 to React 19
- Updated routing to React Router DOM v7

## [0.8.0] - 2026-02-08

### Added
- Initial Analytics dashboard
- Substance catalog and monograph pages
- Interaction checker tool
- Clinician directory and profiles

---

## Versioning Guidelines

**Major (X.0.0):** Breaking changes, major feature releases  
**Minor (1.X.0):** New features, non-breaking changes  
**Patch (1.0.X):** Bug fixes, security patches

---

**Next Release:** 1.1.0 (Planned: 2026-03-01)
- Toast notification system
- Testing framework (Vitest)
- Code splitting for performance
- Protocol Builder consolidation
