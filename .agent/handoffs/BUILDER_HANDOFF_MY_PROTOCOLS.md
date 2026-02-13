# BUILDER Handoff - Restore My Protocols Page (Quick Fix)

**From:** LEAD  
**To:** BUILDER  
**Priority:** HIGH - Immediate Fix  
**Estimated Time:** 30 minutes

---

## Objective

Restore My Protocols page as a protocols list table (not Protocol Builder workflow). This is a quick fix to unblock the user while DESIGNER works on complete redesign.

---

## Files to Modify

### 1. Fix `/src/pages/MyProtocols.tsx`

**Current Issue:** Imports modal component and uses modal state

**Required Changes:**

```tsx
// REMOVE these lines:
import { ProtocolBuilderModal } from '../components/ProtocolBuilder/ProtocolBuilderModal';
const [showProtocolBuilder, setShowProtocolBuilder] = useState(false);

// UPDATE "New Protocol" button (line ~100):
<button
  onClick={() => navigate('/protocol-builder')}  // Changed
  className="flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors duration-200 font-medium"
>
  <Plus className="w-5 h-5" />
  New Protocol
</button>

// REMOVE modal component at bottom (lines ~260-270):
{showProtocolBuilder && (
  <ProtocolBuilderModal
    isOpen={showProtocolBuilder}
    onClose={() => {
      setShowProtocolBuilder(false);
      fetchProtocols();
    }}
  />
)}
```

---

### 2. Update `/src/App.tsx`

**Current Routing:**
```tsx
<Route path="/protocols" element={<ProtocolBuilder />} />
```

**Required Changes:**
```tsx
import { MyProtocols } from './pages/MyProtocols';

// Update routing:
<Route path="/protocols" element={<MyProtocols />} />
<Route path="/protocol-builder" element={<ProtocolBuilder />} />
```

---

### 3. Update `/src/pages/ProtocolBuilder.tsx`

**Add back button to return to My Protocols**

**Location:** In `PatientSelectionScreen` component (or at top of page)

```tsx
// Add import:
import { ArrowLeft } from 'lucide-react';

// Add back button at top:
<button
  onClick={() => navigate('/protocols')}
  className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors mb-4"
>
  <ArrowLeft className="w-4 h-4" />
  Back to My Protocols
</button>
```

**Add auto-navigation after submission:**

```tsx
// In handleSubmit function, after successful submission:
if (data) {
  setScreen('success');
  
  // Add this:
  setTimeout(() => {
    navigate('/protocols');
  }, 3000);
}
```

---

## Testing Checklist

- [ ] Navigate to `/protocols` → see My Protocols table (not Protocol Builder)
- [ ] Click "New Protocol" button → navigate to `/protocol-builder`
- [ ] Protocol Builder shows back button
- [ ] Click back button → return to `/protocols`
- [ ] Complete Protocol Builder workflow → auto-return to `/protocols` after 3 seconds
- [ ] See new protocol in table

---

## Success Criteria

✅ `/protocols` shows protocols list table  
✅ "New Protocol" button navigates to `/protocol-builder`  
✅ Protocol Builder has back button  
✅ After submission, auto-return to `/protocols`  
✅ No console errors  

---

## Notes

- This is a **temporary fix** to unblock user
- DESIGNER is working on complete redesign in parallel
- You may need to re-implement after DESIGNER's redesign is approved
- Focus on speed, not perfection

---

**Ready to implement?**
