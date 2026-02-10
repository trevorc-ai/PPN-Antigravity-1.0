# Contributing to PPN Research Portal

First off, thank you for considering contributing to the PPN Research Portal! It's people like you that make this platform a valuable tool for the psychedelic research community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Community](#community)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Our Standards

**Positive behaviors include:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behaviors include:**
- Harassment, trolling, or derogatory comments
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- Node.js v18.0.0 or higher
- npm v9.0.0 or higher
- Git installed and configured
- A Supabase account (for database access)
- Familiarity with React, TypeScript, and Tailwind CSS

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/PPN-Antigravity-1.0.git
   cd PPN-Antigravity-1.0
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/trevorc-ai/PPN-Antigravity-1.0.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```
6. **Start the dev server**:
   ```bash
   npm run dev
   ```

---

## 🔄 Development Workflow

### Branching Strategy

We use a simplified Git Flow:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring

### Creating a Feature Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a new feature branch
git checkout -b feature/your-feature-name

# Example:
git checkout -b feature/add-patient-retention-chart
```

### Keeping Your Branch Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Rebase your branch on upstream/main
git rebase upstream/main

# If conflicts occur, resolve them and continue
git rebase --continue
```

---

## 💻 Coding Standards

### TypeScript Guidelines

#### ✅ DO:
```typescript
// Use proper TypeScript interfaces
interface PatientCardProps {
  patient: PatientRecord;
  onSelect: (id: string) => void;
  variant?: 'compact' | 'full';
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onSelect, variant = 'full' }) => {
  // Component logic
};
```

#### ❌ DON'T:
```typescript
// Avoid 'any' types
const PatientCard: React.FC<{ patient: any }> = ({ patient }) => {
  // This is not type-safe
};
```

### Component Structure

Follow this pattern for all components:

```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientRecord } from '../types';

// 2. Interfaces/Types
interface ComponentProps {
  // Props definition
}

// 3. Component
const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // 4. Hooks
  const navigate = useNavigate();
  const [state, setState] = useState<Type>(initialValue);

  // 5. Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  // 6. Handlers
  const handleClick = () => {
    // Handler logic
  };

  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 8. Export
export default ComponentName;
```

### Styling Guidelines

#### Use Design System Tokens

```tsx
// ✅ DO: Use design system classes
<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
  <Section spacing="default">
    <h1 className="text-5xl font-black tracking-tighter text-white">
      Title
    </h1>
  </Section>
</div>

// ❌ DON'T: Use arbitrary values
<div className="max-w-[1234px] mx-auto px-[23px]">
  <div className="mb-[37px]">
    <h1 className="text-[52px] font-[900] tracking-[-0.05em] text-[#ffffff]">
      Title
    </h1>
  </div>
</div>
```

#### Component Width Standards

- **Default pages**: `max-w-7xl` (Dashboard, News, Settings)
- **Data-heavy pages**: `max-w-[1600px]` (SearchPortal, ProtocolBuilder)
- **Reading content**: `max-w-4xl` (HelpFAQ, About)

See [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) for complete guidelines.

### Accessibility Requirements

All components must be accessible:

```tsx
// ✅ Include ARIA labels
<button
  onClick={handleClick}
  aria-label="Close modal"
  className="..."
>
  <span className="material-symbols-outlined">close</span>
</button>

// ✅ Keyboard navigation
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  onClick={handleClick}
>
  Clickable div
</div>

// ✅ Focus states
<Link
  to="/path"
  className="... focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
>
  Link
</Link>
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `PatientCard.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)
- **Types**: PascalCase (e.g., `PatientRecord`)

---

## 📝 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(analytics): add patient retention funnel chart"

# Bug fix
git commit -m "fix(sidebar): resolve navigation redirect issue on mobile"

# Documentation
git commit -m "docs(readme): add deployment instructions for Vercel"

# Refactor
git commit -m "refactor(dashboard): replace 'any' types with proper interfaces"

# With body
git commit -m "feat(news): add sentiment filtering to news feed

- Added sentiment field to NewsArticle interface
- Implemented filter toggle in News component
- Updated NEWS_ARTICLES with sentiment data"
```

### Commit Best Practices

- **Keep commits atomic**: One logical change per commit
- **Write clear messages**: Explain *what* and *why*, not *how*
- **Reference issues**: Include issue numbers (e.g., `fixes #123`)
- **Sign commits**: Use GPG signing for security

---

## 🔀 Pull Request Process

### Before Submitting

1. **Update your branch** with latest upstream changes
2. **Test thoroughly** - ensure no regressions
3. **Run the build** - `npm run build` should succeed
4. **Check for console errors** - no warnings in dev tools
5. **Review your changes** - self-review the diff
6. **Update documentation** - if adding features

### PR Title Format

Use the same format as commit messages:

```
feat(scope): add new feature
fix(scope): resolve bug
docs: update README
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested locally
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Accessibility checked

## Screenshots (if applicable)
[Add screenshots here]

## Related Issues
Fixes #123
Relates to #456

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings introduced
```

### Review Process

1. **Automated checks** must pass (when CI/CD is set up)
2. **At least one approval** required from maintainers
3. **Address feedback** promptly and professionally
4. **Squash commits** if requested before merge

---

## 🧪 Testing Guidelines

### Manual Testing Checklist

For every PR, test:

- [ ] **Functionality**: Feature works as expected
- [ ] **Responsive design**: Mobile, tablet, desktop
- [ ] **Browser compatibility**: Chrome, Firefox, Safari
- [ ] **Accessibility**: Keyboard navigation, screen readers
- [ ] **Error handling**: Edge cases and error states
- [ ] **Performance**: No significant slowdowns

### Future: Automated Testing

We plan to add:
- **Unit tests**: Jest + React Testing Library
- **Integration tests**: Testing user flows
- **E2E tests**: Playwright or Cypress
- **Visual regression**: Percy or Chromatic

---

## 📚 Documentation

### Code Comments

```typescript
// ✅ Good: Explain WHY, not WHAT
// Filter out patients without consent to comply with research ethics
const consentedPatients = patients.filter(p => p.consent.verified);

// ❌ Bad: Obvious comment
// Filter patients
const consentedPatients = patients.filter(p => p.consent.verified);
```

### JSDoc for Complex Functions

```typescript
/**
 * Calculates the efficacy improvement percentage between baseline and endpoint
 * 
 * @param baseline - Initial assessment score (higher = worse)
 * @param endpoint - Final assessment score (higher = worse)
 * @returns Percentage improvement (positive = better outcome)
 * 
 * @example
 * calculateImprovement(25, 10) // Returns 60 (60% improvement)
 */
function calculateImprovement(baseline: number, endpoint: number): number {
  return ((baseline - endpoint) / baseline) * 100;
}
```

### Updating Documentation

When adding features, update:
- `README.md` - If adding new pages or major features
- `DESIGN_SYSTEM.md` - If introducing new design patterns
- Component comments - For complex logic
- This file (`CONTRIBUTING.md`) - If changing workflow

---

## 🤝 Community

### Getting Help

- **GitHub Discussions**: Ask questions, share ideas
- **GitHub Issues**: Report bugs, request features
- **Email**: support@ppn-research.org

### Recognition

Contributors will be:
- Listed in `CONTRIBUTORS.md` (coming soon)
- Mentioned in release notes
- Credited in the application (if significant contribution)

---

## 🎯 Priority Areas for Contribution

We especially welcome contributions in these areas:

### High Priority
1. **TypeScript Migration**: Replace `any` types with proper interfaces
2. **Error Boundaries**: Add React error boundaries
3. **Loading States**: Implement skeleton loaders
4. **Unit Tests**: Add test coverage

### Medium Priority
1. **Accessibility**: WCAG 2.1 AA compliance
2. **Performance**: Code splitting, lazy loading
3. **Documentation**: Component documentation
4. **Internationalization**: i18n support

### Nice to Have
1. **Dark/Light mode toggle**: Currently dark-only
2. **Export features**: CSV/PDF exports
3. **Advanced filters**: More search options
4. **Keyboard shortcuts**: Power user features

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

## 🙏 Thank You!

Your contributions make the PPN Research Portal better for everyone. We appreciate your time and effort!

**Questions?** Open an issue or reach out to the maintainers.

---

<div align="center">
  
**Happy Contributing! 🚀**

</div>
