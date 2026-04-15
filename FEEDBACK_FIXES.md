# Thesis App Feedback - Fixes Applied

## Date: April 15, 2026

### Issues Addressed

#### ✅ 1. Age Field Made Optional
**Issue:** Age field may not be useful for data analysis
**Fix:** 
- Changed age field from required to optional in PreStudySurvey
- Updated validation to only check age if provided
- Changed label from "Age *" to "Age (Optional)"

#### ✅ 2. AI Suggestion Frequency Reduced (Tasks 2 & 3)
**Issue:** In Always-On mode, AI suggestions were appearing every 20 seconds, which was too frequent
**Fix:**
- Changed Always-On AI suggestion refresh interval from 20 seconds to 90 seconds
- This provides a better balance between continuous assistance and not overwhelming users

#### ✅ 3. Activity Detection Improved
**Issue:** Mouse/trackpad movement (even aimless scrolling) was counting as activity, preventing JIT AI triggers
**Fix:**
- Added `onKeyDown` and `onFocus` event handlers to the textarea
- Now only actual typing/interaction with the input field resets the activity timer
- Passive scrolling or mouse movement won't prevent the 60-second inactivity trigger

#### ✅ 4. Condition Preferences Rating System Updated
**Issue:** The ranking system didn't allow selecting the same number across different conditions
**Fix:**
- Changed from unique ranking system (1-4, each used once) to independent rating system
- Now each condition can be rated 1-4 independently
- Multiple conditions can receive the same rating (e.g., two conditions can both be rated "2")
- Updated UI labels from "Rank" to "Rate"
- Changed validation to check that all conditions are rated, not that rankings are unique

### Remaining Issues to Consider

#### ⚠️ 5. No AI Suggestion to Refine Initial Ideas
**Status:** Needs design decision
**Current State:** The IterativeAIHelper component exists but isn't integrated into ExperimentalTask
**Options:**
1. Add a "Refine this idea" button next to each submitted idea
2. Add AI refinement suggestions in the sidebar
3. Allow users to request refinement of specific ideas

**Recommendation:** This requires UX design input on how refinement should work in the experimental flow.

#### ⚠️ 6. JIT AI Trigger After 60s Inactivity
**Status:** Implemented but needs testing
**Current Implementation:**
- Activity timer checks every 5 seconds
- Triggers JIT help after 60 seconds of no activity
- Only triggers if ideas.length > 0 and suggestions aren't already showing
- Activity is now properly tracked only on actual input interaction

**Testing Needed:** Verify that the 60-second auto-trigger works correctly with the improved activity detection.

#### ⚠️ 7. Vercel.app Branding
**Status:** No issues found
**Current State:** 
- No vercel.app references in index.html
- App title is "iNSIGHT AI"
- All meta tags reference the study name
- If vercel.app appears in the URL, this is a deployment configuration issue, not a code issue

### Scale Consistency Check

All rating scales in the application now use **7-point scales** consistently:

- **PreStudySurvey:** 7-point scales for familiarity and experience
- **PostTaskQuestionnaire:** 7-point scales for agency, dependence, and cognitive load
- **StandardizedPostTaskQuestionnaire:** 7-point scales (same as above)
- **PostStudySurvey:** 
  - 4-point rating scale for condition preferences (1-4)
  - 7-point scales for learning and usefulness ratings

The 4-point scale for condition preferences is intentional and different from the others, as it's a comparative rating system rather than an agreement/intensity scale.

### Testing Recommendations

1. **Activity Detection:** Test that scrolling/mouse movement doesn't reset the activity timer
2. **JIT Auto-trigger:** Verify 60-second inactivity trigger works correctly
3. **Always-On Frequency:** Confirm 90-second intervals feel appropriate
4. **Condition Ratings:** Test that multiple conditions can receive the same rating
5. **Age Field:** Verify form submits successfully with or without age

### Files Modified

1. `client/src/components/ExperimentalTask.js`
   - Reduced Always-On suggestion frequency (20s → 90s)
   - Improved activity detection (added onKeyDown, onFocus)

2. `client/src/components/PreStudySurvey.js`
   - Made age field optional
   - Updated validation logic

3. `client/src/components/PostStudySurvey.js`
   - Changed from ranking to rating system
   - Updated validation to allow duplicate ratings
   - Updated UI labels and descriptions
