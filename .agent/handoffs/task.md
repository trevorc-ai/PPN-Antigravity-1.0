# Protocol Builder - Restore & Redesign

**Current Phase:** Execution (Parallel Work)  
**Priority:** HIGH  
**Overall Goal:** Restore My Protocols page immediately, then complete full redesign

---

## BUILDER Tasks (IMMEDIATE - 30 min)

### Restore My Protocols Page
- [x] Fix `MyProtocols.tsx` - Remove modal logic, use navigation
- [x] Update `App.tsx` - Add routing for `/protocols` and `/protocol-builder`
- [x] Update `ProtocolBuilder.tsx` - Add back button and auto-navigation
- [ ] Test workflow - Verify navigation and functionality (BLOCKED: node_modules permission error)
- [ ] No console errors (BLOCKED: cannot run dev server)

**Handoff Document:** [BUILDER_HANDOFF_MY_PROTOCOLS.md](file:///Users/trevorcalton/.gemini/antigravity/brain/e5446f39-13de-4e35-853b-08b74d5de42d/BUILDER_HANDOFF_MY_PROTOCOLS.md)  
**Status:** In Progress  
**Estimated Time:** 30 minutes

**Files to Modify:**
1. `/src/pages/MyProtocols.tsx`
2. `/src/App.tsx`
3. `/src/pages/ProtocolBuilder.tsx`

---

## DESIGNER Tasks (PARALLEL - 10-12 hours)

### Protocol Builder Complete Redesign
- [x] Review critical analysis and requirements
- [x] Create My Protocols page mockup (protocols list table with color-coded substances)
- [x] Create Protocol Builder redesign mockup (single-page, dense layout)
- [x] Design medication selection component (hybrid: buttons + dropdown, scalable)
- [x] Design Clinical Insights panel (all 6 sections with real data viz)
- [x] Create component specifications (.md files)
- [x] Submit for LEAD approval
- [x] Iterate based on feedback (color-coded substances + hybrid medication selector)
- [x] **APPROVED BY LEAD** ✅

**Deliverables:**
- [implementation_plan.md](file:///Users/trevorcalton/.gemini/antigravity/brain/485b3f02-6c43-4018-859a-4db5e0cd9413/implementation_plan.md) - Complete redesign specifications
- [design_system.md](file:///Users/trevorcalton/.gemini/antigravity/brain/485b3f02-6c43-4018-859a-4db5e0cd9413/design_system.md) - Design tokens and component styles
- 3 high-fidelity mockups (My Protocols, Protocol Builder, Hybrid Medication Selector)

**Status:** ✅ COMPLETE - Ready for BUILDER  
**Actual Time:** 3 hours

**Critical Requirements:**
- ✅ Zero text entry (hybrid medication selector: buttons + dropdown)
- ✅ Sliders for dosage (not steppers)
- ✅ Tooltips on all complex fields
- ✅ Remove session date field entirely
- ✅ Single-page layout (no tabs)
- ✅ Vibrant visual design (color-coded substances, teal/emerald/amber accents)
- ✅ All Clinical Insights implemented (no Phase 2)

---

## SOOP Tasks (PARALLEL - 8-12 hours)

### Clinical Insights Database Implementation
- [ ] Create materialized views for outcomes data
- [ ] Populate receptor affinity data (8 substances × 7 receptors)
- [ ] Populate drug interaction data (8 substances × 60 medications)
- [ ] Create `ref_medications` table (60 most common medications)
- [ ] Optimize query performance (<100ms for all queries)
- [ ] Create indexes for patient lookup
- [ ] Test data integrity

**Handoff Document:** [SOOP_HANDOFF_PROTOCOL_BUILDER.md](file:///Users/trevorcalton/.gemini/antigravity/brain/e5446f39-13de-4e35-853b-08b74d5de42d/SOOP_HANDOFF_PROTOCOL_BUILDER.md)  
**Status:** Not Started  
**Estimated Time:** 8-12 hours

**Deliverables:**
1. Materialized views: `mv_outcomes_summary`, `mv_clinic_benchmarks`, `mv_network_averages`
2. Receptor affinity data in `ref_substances` table
3. Drug interactions in `ref_knowledge_graph` table
4. Medications list in `ref_medications` table
5. Performance optimization (all queries <100ms)

---

## Dependencies

**BUILDER (Phase 1):**
- ✅ No dependencies - can start immediately
- ✅ Works independently

**DESIGNER:**
- ✅ No dependencies - can start immediately
- ✅ Works in parallel with BUILDER and SOOP

**SOOP:**
- ✅ No dependencies - can start immediately
- ✅ Works in parallel with BUILDER and DESIGNER

**BUILDER (Phase 2 - After DESIGNER approval):**
- ⏳ Waits for DESIGNER mockups to be approved by LEAD
- ⏳ Implements final design after approval

---

## Workflow

### Phase 1: Immediate Fix (BUILDER)
1. BUILDER restores My Protocols page (30 min)
2. User can access protocols list again
3. DESIGNER and SOOP work in parallel

### Phase 2: Redesign (DESIGNER)
1. DESIGNER creates mockups and specifications (10-12 hours)
2. LEAD reviews and approves
3. Iterate if needed

### Phase 3: Database (SOOP)
1. SOOP implements Clinical Insights database (8-12 hours)
2. Provides data for DESIGNER's mockups
3. Ready for BUILDER's final implementation

### Phase 4: Final Implementation (BUILDER)
1. BUILDER implements approved DESIGNER mockups (6-8 hours)
2. Integrates with SOOP's database
3. Complete testing and verification

---

## Success Criteria

### Phase 1 (BUILDER Quick Fix)
- [ ] `/protocols` shows protocols list table
- [ ] "New Protocol" button navigates to `/protocol-builder`
- [ ] Protocol Builder has back button
- [ ] Auto-return to `/protocols` after submission

### Phase 2 (DESIGNER Redesign)
- [ ] My Protocols mockup approved
- [ ] Protocol Builder mockup approved
- [ ] Component specifications complete
- [ ] All critical requirements met

### Phase 3 (SOOP Database)
- [ ] All materialized views created
- [ ] Receptor affinity data populated
- [ ] Drug interaction data populated
- [ ] Medications list created
- [ ] Query performance <100ms

### Phase 4 (BUILDER Final)
- [ ] Final design implemented
- [ ] Clinical Insights panel functional
- [ ] All workflows tested
- [ ] User acceptance

---

## Notes

- **BUILDER:** Start Phase 1 immediately (quick fix)
- **DESIGNER:** Start redesign work immediately (parallel)
- **SOOP:** Start database work immediately (parallel)
- **Temperature:** DESIGNER set to 3 (refinement mode)
- **Workflow:** See [agent_task_assignment_workflow.md](file:///Users/trevorcalton/.gemini/antigravity/brain/e5446f39-13de-4e35-853b-08b74d5de42d/agent_task_assignment_workflow.md)

