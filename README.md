<div align="center">
  <img width="1200" height="475" alt="PPN Research Portal Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
  
  # PPN Research Portal
  
  **A comprehensive clinical research platform for psychedelic-assisted therapy**
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19.2.3-61dafb.svg)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.2.0-646cff.svg)](https://vitejs.dev/)
  [![Supabase](https://img.shields.io/badge/Supabase-2.95.3-3ecf8e.svg)](https://supabase.com/)
  
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Key Pages](#-key-pages)
- [Design System](#-design-system)
- [Database Schema](#-database-schema)
- [Authentication](#-authentication)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

The **PPN Research Portal** is a secure, HIPAA-compliant platform designed for clinical researchers, practitioners, and network administrators to manage, analyze, and collaborate on psychedelic-assisted therapy research. The portal provides structured data collection, advanced analytics, safety monitoring, and network-wide insights while maintaining strict privacy standards.

### Key Objectives

- **Structured Data Collection**: Capture clinical data without PHI/PII exposure
- **Network-Level Analytics**: Aggregate insights across research sites
- **Safety Monitoring**: Real-time drug interaction checking and adverse event tracking
- **Protocol Management**: Design, share, and optimize treatment protocols
- **Regulatory Compliance**: Built-in compliance with research standards

---

## ✨ Features

### 🔬 Core Research Tools
- **Advanced Search Portal**: Multi-modal search across patients, substances, and clinicians
- **Protocol Builder**: Step-by-step protocol creation with safety validation
- **Substance Catalog**: Comprehensive database of psychedelic compounds with monographs
- **Clinician Directory**: Network-wide practitioner profiles and collaboration tools

### 📊 Analytics & Intelligence
- **Dashboard**: Real-time telemetry and key performance indicators
- **Deep Dives**: 10+ specialized analytics modules:
  - Patient Flow Analysis (Sankey diagrams)
  - Regulatory Landscape Mapping
  - Clinic Performance Radar
  - Patient Constellation (outcome clustering)
  - Molecular Pharmacology
  - Protocol Efficiency ROI
  - Risk Matrix Heatmaps
  - Safety Surveillance
  - Patient Journey Timelines
  - Comparative Efficacy

### 🛡️ Safety & Compliance
- **Interaction Checker**: Real-time drug-drug interaction analysis
- **Audit Logs**: Comprehensive activity tracking
- **Safety Event Reporting**: Structured adverse event capture
- **RLS (Row-Level Security)**: Site-isolated data access

### 📰 Knowledge Sharing
- **News Feed**: Curated research updates with sentiment filtering
- **Help Center**: Comprehensive FAQ and guided tours
- **Neural Copilot**: AI-powered research assistant (Google Gemini integration)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.2.3 with TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0
- **Routing**: React Router DOM 7.13.0 (HashRouter)
- **Styling**: Tailwind CSS (custom design system)
- **Animations**: Framer Motion 12.33.0
- **Charts**: Recharts 3.7.0
- **Icons**: Lucide React 0.563.0

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage (for molecule images)

### AI/ML
- **LLM**: Google Gemini 1.5 Pro (via @google/genai)
- **Use Cases**: Research assistance, data analysis, protocol suggestions

### Data Processing
- **CSV Parsing**: PapaParse 5.5.3
- **Data Validation**: TypeScript interfaces + runtime checks

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Supabase Account**: [Create one here](https://supabase.com)
- **Google AI API Key**: [Get one here](https://ai.google.dev/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/trevorc-ai/PPN-Antigravity-1.0.git
   cd PPN-Antigravity-1.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` with your credentials:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Google Gemini AI
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

---

## 📁 Project Structure

```
PPN-Antigravity-1.0/
├── public/                      # Static assets
│   ├── molecules/              # Molecule structure images
│   └── ...
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── analytics/         # Chart components (15 modules)
│   │   ├── layouts/           # PageContainer, Section
│   │   ├── ui/                # ConnectFeedButton, etc.
│   │   ├── Breadcrumbs.tsx
│   │   ├── Footer.tsx
│   │   ├── GuidedTour.tsx
│   │   ├── NeuralCopilot.tsx
│   │   ├── Sidebar.tsx
│   │   └── TopHeader.tsx
│   ├── contexts/              # React contexts
│   │   └── AuthContext.tsx    # Authentication state
│   ├── pages/                 # Route components (38 pages)
│   │   ├── deep-dives/       # Analytics deep dive pages
│   │   ├── Dashboard.tsx
│   │   ├── News.tsx
│   │   ├── ClinicianDirectory.tsx
│   │   ├── ProtocolBuilder.tsx
│   │   ├── SearchPortal.tsx
│   │   └── ...
│   ├── services/              # API services
│   │   └── newsService.ts
│   ├── constants/             # Mock data & constants
│   │   └── index.ts
│   ├── App.tsx                # Main app component & routing
│   ├── index.css              # Global styles & Tailwind
│   ├── types.ts               # TypeScript interfaces
│   └── supabaseClient.ts      # Supabase initialization
├── DESIGN_SYSTEM.md           # Comprehensive design documentation
├── WORKSPACE_RULES.md         # Development guidelines
├── schema.sql                 # Database schema
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🔐 Environment Variables

Create a `.env` file with the following variables:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_GEMINI_API_KEY` | Google Gemini API key | ⚠️ Optional | `AIzaSyXXXXXXXXXXXXXXXXXXXX` |

**Security Notes:**
- Never commit `.env` to version control (already in `.gitignore`)
- Rotate keys if accidentally exposed
- Use Supabase RLS policies to protect data
- The `VITE_` prefix exposes variables to the browser (safe for public keys)

---

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start Vite dev server (hot reload)

# Production
npm run build        # Build for production (outputs to /dist)
npm run preview      # Preview production build locally

# Database (if using local scripts)
node check_tables.js    # Verify Supabase table structure
node migrate_data.js    # Run data migrations
```

---

## 📄 Key Pages

### Public Routes
- `/landing` - Marketing landing page
- `/about` - About the PPN network
- `/secure-gate` - Access request page
- `/signup` - User registration (disabled in production)

### Protected Routes (Require Authentication)

#### Core Research
- `/dashboard` - Main dashboard with telemetry
- `/advanced-search` - Multi-modal search portal
- `/news` - Research news feed
- `/clinicians` - Practitioner directory
- `/catalog` - Substance catalog
- `/builder` - Protocol builder

#### Analytics Deep Dives
- `/deep-dives/patient-flow` - Patient journey Sankey diagrams
- `/deep-dives/regulatory-map` - Regulatory landscape
- `/deep-dives/clinic-performance` - Clinic performance radar
- `/deep-dives/patient-constellation` - Outcome clustering
- `/deep-dives/molecular-pharmacology` - Drug mechanism analysis
- `/deep-dives/protocol-efficiency` - Protocol ROI analysis

#### Clinical Safety
- `/interactions` - Drug interaction checker
- `/audit` - Audit log viewer

#### User Management
- `/settings` - User preferences
- `/help` - Help center & FAQ
- `/notifications` - System notifications

---

## 🎨 Design System

The PPN Portal uses a comprehensive design system documented in [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).

### Key Design Principles

1. **3-Tier Width System**
   - Default: `max-w-7xl` (1280px) - Standard pages
   - Wide: `max-w-[1600px]` - Data-heavy interfaces
   - Focused: `max-w-4xl` (896px) - Reading content

2. **Spacing Tokens**
   - `spacing="tight"` - 16px (1rem)
   - `spacing="default"` - 32px (2rem)
   - `spacing="loose"` - 48px (3rem)

3. **Color System**
   - Primary: `#2b74f3` (Blue)
   - Clinical Green: `#53d22d`
   - Warning: `#f59e0b`
   - Background: `#0e1117` (Dark mode)

4. **Typography**
   - Headings: Font-black, tight tracking
   - Body: Font-medium, relaxed leading
   - Mono: Font-mono for data/codes

### Component Standards

All components follow these patterns:
- Use `PageContainer` for page-level layout
- Use `Section` for vertical spacing
- Use design tokens (no hardcoded values)
- Maintain consistent card styles (`card-glass` utility)

---

## 🗄️ Database Schema

The application uses Supabase (PostgreSQL) with the following key tables:

### Core Tables
- `sites` - Research site information
- `user_sites` - User-to-site relationships with roles
- `system_events` - Audit trail

### Clinical Data Tables (Structured, No PHI)
- `log_clinical_records` - De-identified patient records
- `log_consent` - Consent tracking
- `log_interventions` - Treatment interventions
- `log_outcomes` - Assessment results
- `log_safety_events` - Adverse events

### Reference Tables (Dropdown Data)
- `ref_substances` - Substance catalog
- `ref_assessments` - Assessment types
- `ref_routes` - Administration routes
- `ref_severity_grade` - Safety event severity
- `ref_smoking_status` - Patient demographics
- And 10+ more reference tables

### Row-Level Security (RLS)

All tables enforce site isolation:
- Users can only access data from their assigned site(s)
- `network_admin` role has cross-site access
- Reference tables are read-only for most users

**Schema File**: See [`schema.sql`](./schema.sql) for full DDL.

---

## 🔒 Authentication

### Current Status
⚠️ **Authentication is currently DISABLED for development/review purposes.**

The auth check is commented out in `App.tsx`:
```typescript
// DISABLED AUTH CHECK FOR VISUAL AUDIT (Supabase Deferred)
// useEffect(() => {
//   if (!isAuthenticated) {
//     navigate('/login');
//   }
// }, [isAuthenticated, navigate]);
```

### Before Production Deployment

1. **Uncomment the auth check** in `src/App.tsx` (lines 86-90)
2. **Test the login flow** thoroughly
3. **Verify Supabase RLS policies** are active
4. **Set up email confirmation** (if required)
5. **Configure password policies** in Supabase dashboard

### User Roles

The system supports 5 roles (stored in `user_sites.role`):

| Role | Permissions |
|------|-------------|
| `network_admin` | Full access across all sites, can manage users and reference data |
| `site_admin` | Manages their own site's operational setup |
| `clinician` | Creates/edits clinical logs for their site |
| `analyst` | Read-only access to their site's data |
| `auditor` | Read-only access for compliance review |

---

## 🚢 Deployment

### Production Build

```bash
# Build the application
npm run build

# Preview the build locally
npm run preview
```

The build outputs to `/dist` directory.

### Deployment Options

#### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Option 3: Supabase Hosting
Follow [Supabase hosting guide](https://supabase.com/docs/guides/hosting)

### Environment Variables in Production

Set the following in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY`

### Pre-Deployment Checklist

- [ ] Enable authentication (uncomment in `App.tsx`)
- [ ] Verify all environment variables are set
- [ ] Test all routes and navigation
- [ ] Run `npm run build` successfully
- [ ] Verify Supabase RLS policies
- [ ] Test login/logout flow
- [ ] Check for console errors
- [ ] Verify mobile responsiveness
- [ ] Test on multiple browsers
- [ ] Set up error monitoring (e.g., Sentry)

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow the design system guidelines
   - Add TypeScript types (no `any` types)
   - Test your changes thoroughly
4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add patient flow visualization"
   ```
5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Standards

- **TypeScript**: Use proper types, avoid `any`
- **Components**: Follow existing patterns in `DESIGN_SYSTEM.md`
- **Styling**: Use Tailwind classes, no inline styles
- **Accessibility**: Include ARIA labels and keyboard navigation
- **Testing**: Add tests for new features (when test suite is set up)

### Commit Message Format

```
type(scope): description

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## 📚 Additional Resources

- **Design System**: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)
- **Workspace Rules**: [`WORKSPACE_RULES.md`](./WORKSPACE_RULES.md)
- **Database Schema**: [`schema.sql`](./schema.sql)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **React Router**: [reactrouter.com](https://reactrouter.com)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)

---

## 🐛 Known Issues

1. **TypeScript `any` types**: 33 instances need proper typing (see audit report)
2. **Build permissions**: `npm run build` may fail due to file permissions
3. **PatientFlowPage**: Route added but component may need creation

---

## 📝 License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

**Copyright © 2026 PPN Research Network. All rights reserved.**

---

## 👥 Support

For questions or issues:
- **Email**: support@ppn-research.org
- **Documentation**: See `/help` page in the application
- **GitHub Issues**: [Create an issue](https://github.com/trevorc-ai/PPN-Antigravity-1.0/issues)

---

<div align="center">
  
  **Built with ❤️ by the PPN Research Team**
  
  [Website](https://ppn-research.org) • [Documentation](./DESIGN_SYSTEM.md) • [Support](mailto:support@ppn-research.org)
  
</div>
