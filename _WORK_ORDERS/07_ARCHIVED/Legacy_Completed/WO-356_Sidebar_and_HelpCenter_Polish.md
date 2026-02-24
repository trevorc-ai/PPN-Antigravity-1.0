---
status: 00_INBOX
owner: PENDING
failure_count: 0
---

## USER PROMPT
*Screenshot uploaded: Sidebar Integrations*
- The image shows the word "Scanner" highlighted/selected in the sidebar, with an unexpected background color on the selected text compared to the rest of the menu item row. It appears to highlight just the word rather than the full row block, possibly indicating a styling issue or errant selection artifact in the `Mobile Scanner` menu item.

*Screenshot uploaded: Help Center*
- The image shows the Help Center page. The sidebar has `Help & FAQ` active, but the left sub-navigation (Getting Started, Clinical Tools, etc.) looks unstyled or missing hover/active states compared to the main dashboard layout. There may also be design refinement needed on the search bar or cards.

## CUE ANALYSIS & REQUIREMENTS
1. **Sidebar Navigation Styling Issue**: 
   - Inspect the `Integrations` section of the sidebar. It seems there's an issue where the text "Scanner" has a weird highlighted background. Fix any selection pseudo-classes or background-color issues on inner spans vs the actual `<a>` or `<button>` container.
2. **Help Center Layout/Styling**: 
   - Review the Help Center page (`HelpFAQ.tsx`). 
   - The sub-navigation menu currently looks plain; enhance the styling of these links to match the global design guidelines (hover states, active states, padding).
   - Check if any structural spacing or card layout issues need refinement based on the provided screenshot.
