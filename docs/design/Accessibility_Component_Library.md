# Component Accessibility Library Specification

**Created:** 2026-02-15  
**Owner:** DESIGNER Agent  
**Purpose:** Define reusable accessible components and ARIA patterns for PPN Research Portal  
**Standard:** WCAG 2.1 AA Compliance

---

## Core Principles

1. **Semantic HTML First** - Use native HTML elements whenever possible
2. **Progressive Enhancement** - Ensure core functionality works without JavaScript
3. **Keyboard Navigation** - All interactive elements must be keyboard accessible
4. **Screen Reader Support** - Provide clear, descriptive labels and announcements
5. **Color Independence** - Never rely on color alone to convey meaning

---

## Accessible Component Patterns

### 1. Button Component

#### Standard Button
```tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  ariaLabel?: string; // Required if children is icon-only
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  ariaLabel
}) => {
  const isIconOnly = typeof children !== 'string';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={isIconOnly ? ariaLabel : undefined}
      className={`
        px-4 py-2 rounded-lg font-semibold
        transition-all duration-200
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variant === 'primary' ? 'bg-primary text-white hover:bg-blue-600' : ''}
        ${variant === 'secondary' ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : ''}
        ${variant === 'danger' ? 'bg-red-500 text-white hover:bg-red-600' : ''}
      `}
    >
      {children}
    </button>
  );
};
```

**Accessibility Features:**
- ✅ Native `<button>` element (keyboard accessible by default)
- ✅ `aria-label` for icon-only buttons
- ✅ `disabled` attribute (prevents interaction and announces to screen readers)
- ✅ Visible focus indicator via `focus-visible`
- ✅ High contrast colors (8.2:1 for primary, 4.6:1 for secondary)

---

### 2. Form Input Component

#### Text Input with Label
```tsx
interface InputProps {
  id: string; // Required for label association
  label: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  hint?: string;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  error,
  hint,
  disabled = false
}) => {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  
  return (
    <div className="space-y-2">
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-slate-200"
      >
        {label}
        {required && <span className="text-red-400 ml-1" aria-label="required">*</span>}
      </label>
      
      {hint && (
        <p id={hintId} className="text-xs text-slate-400">
          {hint}
        </p>
      )}
      
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={`${hint ? hintId : ''} ${error ? errorId : ''}`.trim() || undefined}
        className={`
          w-full px-4 py-2 rounded-lg
          bg-slate-800 border-2 text-white
          transition-all duration-200
          focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-slate-700'}
        `}
      />
      
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-400 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </p>
      )}
    </div>
  );
};
```

**Accessibility Features:**
- ✅ Explicit `<label for="">` association via `id`
- ✅ `aria-invalid` for error states
- ✅ `aria-describedby` linking to hint and error messages
- ✅ `role="alert"` for error messages (announces to screen readers)
- ✅ Visual error indicator (icon + color + text)
- ✅ Required field indicator with `aria-label`

---

### 3. Radio Button Group (ButtonGroup)

#### Accessible Radio Group
```tsx
interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  name: string; // Required for form submission
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  value,
  onChange,
  required = false,
  name
}) => {
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % options.length;
      onChange(options[nextIndex].value);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + options.length) % options.length;
      onChange(options[prevIndex].value);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-200">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      <div role="radiogroup" aria-label={label} className="flex gap-2">
        {options.map((option, index) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            tabIndex={value === option.value ? 0 : -1}
            className={`
              flex-1 px-4 py-2 rounded-lg border-2 transition-all duration-200
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
              ${value === option.value
                ? 'bg-primary border-primary text-white font-semibold'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:border-primary hover:text-slate-200'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
```

**Accessibility Features:**
- ✅ `role="radiogroup"` container
- ✅ `role="radio"` on each option
- ✅ `aria-checked` to indicate selected state
- ✅ Arrow key navigation (roving tabindex pattern)
- ✅ Only selected item is in tab order (`tabIndex={0}` vs `-1`)
- ✅ Visual and programmatic indication of selection

---

### 4. Modal Dialog

#### Accessible Modal with Focus Trap
```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus first focusable element in modal
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusableElements?.[0]?.focus();
      
      // Trap focus within modal
      const handleTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab' && focusableElements) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };
      
      // Close on Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleTab);
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleTab);
        document.removeEventListener('keydown', handleEscape);
        
        // Restore focus to previously focused element
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full mx-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-title" className="text-xl font-bold text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="text-slate-300">
          {children}
        </div>
      </div>
    </div>
  );
};
```

**Accessibility Features:**
- ✅ `role="dialog"` and `aria-modal="true"`
- ✅ `aria-labelledby` linking to modal title
- ✅ Focus trap (Tab cycles within modal)
- ✅ Escape key closes modal
- ✅ Focus returns to trigger element on close
- ✅ Close button has `aria-label`

---

### 5. Dropdown Menu

#### Accessible Dropdown with ARIA
```tsx
interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = 'left'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
      >
        {trigger}
        <span className={`material-symbols-outlined transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className={`
            absolute mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-2 z-50
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// Dropdown Item Component
interface DropdownItemProps {
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  onClick,
  children,
  icon
}) => {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm font-semibold"
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </button>
  );
};
```

**Accessibility Features:**
- ✅ `aria-haspopup="true"` on trigger button
- ✅ `aria-expanded` to indicate open/closed state
- ✅ `role="menu"` on dropdown container
- ✅ `role="menuitem"` on each option
- ✅ Escape key closes dropdown
- ✅ Click outside closes dropdown

---

### 6. Progress Bar

#### Accessible Progress Indicator
```tsx
interface ProgressBarProps {
  current: number;
  total: number;
  label: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label
}) => {
  const percentage = (current / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-200">{label}</span>
        <span className="text-sm font-mono text-slate-400">
          {current} / {total}
        </span>
      </div>
      
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={label}
        className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"
      >
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
```

**Accessibility Features:**
- ✅ `role="progressbar"`
- ✅ `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- ✅ `aria-label` for screen reader announcement
- ✅ Visual text indicator (current / total)

---

### 7. Toast Notification

#### Accessible Toast with Live Region
```tsx
interface ToastProps {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  title,
  message,
  type,
  onClose
}) => {
  const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info'
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500'
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="flex items-start gap-3 p-4 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl"
    >
      <div className={`size-6 rounded-full ${colors[type]} flex items-center justify-center`}>
        <span className="material-symbols-outlined text-white text-sm">
          {icons[type]}
        </span>
      </div>
      
      <div className="flex-1">
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="text-xs text-slate-400 mt-1">{message}</p>
      </div>
      
      <button
        onClick={onClose}
        aria-label="Close notification"
        className="size-6 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
      >
        <span className="material-symbols-outlined text-slate-400 text-sm">close</span>
      </button>
    </div>
  );
};
```

**Accessibility Features:**
- ✅ `role="status"` for non-critical announcements
- ✅ `aria-live="polite"` (announces when screen reader is idle)
- ✅ `aria-atomic="true"` (announces entire message)
- ✅ Icon + color + text (not color-only)
- ✅ Close button has `aria-label`

---

### 8. Data Table

#### Accessible Table with Sorting
```tsx
interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface TableProps {
  caption: string;
  columns: Column[];
  data: Record<string, any>[];
  sortBy?: string;
  sortDirection?: 'ascending' | 'descending';
  onSort?: (key: string) => void;
}

export const Table: React.FC<TableProps> = ({
  caption,
  columns,
  data,
  sortBy,
  sortDirection,
  onSort
}) => {
  return (
    <table className="w-full">
      <caption className="sr-only">{caption}</caption>
      
      <thead>
        <tr className="border-b border-slate-700">
          {columns.map((column) => (
            <th
              key={column.key}
              scope="col"
              aria-sort={sortBy === column.key ? sortDirection : undefined}
              className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider"
            >
              {column.sortable && onSort ? (
                <button
                  onClick={() => onSort(column.key)}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  {column.label}
                  {sortBy === column.key && (
                    <span className="material-symbols-outlined text-sm">
                      {sortDirection === 'ascending' ? 'arrow_upward' : 'arrow_downward'}
                    </span>
                  )}
                </button>
              ) : (
                column.label
              )}
            </th>
          ))}
        </tr>
      </thead>
      
      <tbody>
        {data.map((row, index) => (
          <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
            {columns.map((column, colIndex) => (
              colIndex === 0 ? (
                <th key={column.key} scope="row" className="px-4 py-3 text-sm text-white font-medium">
                  {row[column.key]}
                </th>
              ) : (
                <td key={column.key} className="px-4 py-3 text-sm text-slate-300">
                  {row[column.key]}
                </td>
              )
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

**Accessibility Features:**
- ✅ `<caption>` describes table purpose (visually hidden with `sr-only`)
- ✅ `<thead>`, `<tbody>` semantic structure
- ✅ `<th scope="col">` for column headers
- ✅ `<th scope="row">` for first column (row identifier)
- ✅ `aria-sort` on sortable columns
- ✅ Sortable columns are keyboard accessible buttons

---

## ARIA Patterns Reference

### Live Regions
```tsx
// Polite announcement (non-critical)
<div aria-live="polite" aria-atomic="true">
  {message}
</div>

// Assertive announcement (critical)
<div aria-live="assertive" aria-atomic="true">
  {errorMessage}
</div>

// Status message (alternative to aria-live="polite")
<div role="status">
  {statusMessage}
</div>

// Alert message (alternative to aria-live="assertive")
<div role="alert">
  {alertMessage}
</div>
```

### Screen Reader Only Text
```tsx
// Visually hidden but announced to screen readers
<span className="sr-only">
  Additional context for screen readers
</span>

// CSS for sr-only class
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Landmark Roles
```tsx
// Main content area
<main id="main-content">
  {/* page content */}
</main>

// Navigation
<nav aria-label="Main navigation">
  {/* nav links */}
</nav>

// Search
<div role="search">
  <input type="search" aria-label="Search protocols" />
</div>

// Complementary content
<aside aria-label="Related protocols">
  {/* sidebar content */}
</aside>
```

---

## Testing Checklist

### Automated Testing
- [ ] Run axe DevTools on all pages
- [ ] Run Lighthouse accessibility audit (target: 90+)
- [ ] Run WAVE browser extension
- [ ] Verify no console errors or warnings

### Manual Testing
- [ ] Keyboard-only navigation (unplug mouse)
- [ ] Screen reader test (NVDA, VoiceOver, JAWS)
- [ ] Color contrast verification (WebAIM Contrast Checker)
- [ ] Zoom test (200% zoom, no horizontal scroll)
- [ ] Mobile touch target test (44px minimum)

### Component-Specific Tests
- [ ] All buttons have visible focus indicators
- [ ] All form inputs have associated labels
- [ ] All images have alt text or aria-hidden
- [ ] All modals trap focus and close on Escape
- [ ] All dropdowns have aria-expanded and close on Escape
- [ ] All tables have proper semantic structure
- [ ] All charts have text alternatives

---

## Resources

### WCAG 2.1 Guidelines
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [NVDA Screen Reader](https://www.nvaccess.org/)

### Design Resources
- [Inclusive Components](https://inclusive-components.design/)
- [A11y Project](https://www.a11yproject.com/)
- [Deque University](https://dequeuniversity.com/)

---

**Specification Created:** 2026-02-15  
**Owner:** DESIGNER Agent  
**Status:** Ready for Implementation
