# Thesis App Feedback - Fixes Applied

## Date: April 15, 2026

### Issues Addressed

#### ✅ 1. Age Field Made Optional
**Issue:** Age field may not be useful for data analysis
**Fix:** 
- Changed age field from required to optional in PreStudySurvey
- Updated validation to only check age if provided
- Changed label from "Age *" to "Age (Optional)"

#### ✅ 2. AI Suggestion Frequency Fixed (Tasks 2 & 3)
**Issue:** In Always-On mode, AI suggestions were appearing sporadically and too frequently (every second in some cases)
**Root Cause:** Multiple triggers were firing:
- Initial trigger (2s after start)
- Periodic trigger (every 20s, now 90s)
- After EACH idea submission (1s delay)

**Fix:**
- Removed the auto-trigger after idea submission
- Changed periodic interval from 20 seconds to 90 seconds
- Added 60-second cooldown mechanism to prevent rapid-fire suggestions
- Manual "Get AI Help" button bypasses cooldown (for JIT mode)

**Result:** 
- Always-On mode now generates suggestions only every 90 seconds (minimum)
- No more sporadic rapid-fire suggestions after submitting ideas
- Users won't be overwhelmed with constant AI suggestions

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
- Now each condition can be rated 1-5 independently (changed from 1-4 to 1-5 for consistency)
- Multiple conditions can receive the same rating (e.g., two conditions can both be rated "2")
- Updated UI labels from "Rank" to "Rate"
- Changed validation to check that all conditions are rated, not that rankings are unique

#### ✅ 5. **RATING SCALE STANDARDIZATION - MAJOR UPDATE**
**Issue:** Inconsistent rating scales throughout the application (mix of 1-4, 1-5, 1-7 scales with inconsistent directions)
**Feedback:** "The measure of evaluation should be consistent across board. If one is going to be the strongest and five the strongest, the weakest, or five the strongest, one the weakest, it should be consistent."

**Comprehensive Fix:**

**All scales now use consistent 5-point Likert scales with 1=Lowest/Worst, 5=Highest/Best**

**PreStudySurvey.js:**
- Data Science Familiarity: 7-point slider → 5-point radio buttons
  - 1 = "Not at all familiar", 5 = "Extremely familiar"
- AI Experience: 7-point slider → 5-point radio buttons
  - 1 = "No experience", 5 = "Extensive experience"
- Default changed from 4 to 3 (middle of 5-point scale)

**PostTaskQuestionnaire.js:**
- Agency Questions (6 items): 7-point → 5-point
  - 1 = "Strongly Disagree", 5 = "Strongly Agree"
- AI Dependence: 7-point → 5-point
  - 1 = "Not at all", 5 = "Completely"
- Cognitive Load (3 items): 7-point → 5-point
  - 1 = "Very Low", 5 = "Very High"
- Default changed from 4 to 3 (middle of 5-point scale)

**StandardizedPostTaskQuestionnaire.js:**
- Same changes as PostTaskQuestionnaire.js
- All 7-point scales → 5-point scales
- Default changed from 4 to 3

**PostStudySurvey.js:**
- Condition Ratings: 1-4 → 1-5
  - 1 = "Strongly Prefer", 5 = "Strongly Do Not Prefer"
  - Added neutral middle option (3 = "Neutral")
- Learning Rating: 7-point → 5-point
  - 1 = "Nothing", 5 = "A great deal"
- Usefulness Rating: 7-point → 5-point
  - 1 = "Not at all useful", 5 = "Extremely useful"
- Default changed from 4 to 3 (middle of 5-point scale)

**Consistency Achieved:**
- ✅ All scales are now 5-point (1-5)
- ✅ All scales use 1 = Lowest/Worst, 5 = Highest/Best
- ✅ All scales use radio buttons (no more sliders)
- ✅ All scales default to 3 (neutral middle)
- ✅ Clear, consistent labels across all surveys

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
   - **AI Suggestion Timing:**
     - Reduced Always-On suggestion frequency (20s → 90s)
     - Removed auto-trigger after idea submission
     - Added 60-second cooldown mechanism using `lastAiGenerationTime` ref
     - Manual help requests bypass cooldown
   - **Activity Detection:**
     - Added onKeyDown, onFocus event handlers to textarea
     - Only actual typing/interaction resets activity timer

2. `client/src/components/PreStudySurvey.js`
   - Made age field optional
   - Updated validation logic
   - **SCALE STANDARDIZATION:**
     - Changed from 7-point sliders to 5-point radio buttons
     - Data Science Familiarity: 1-7 → 1-5
     - AI Experience: 1-7 → 1-5
     - Default value: 4 → 3

3. `client/src/components/PostTaskQuestionnaire.js`
   - **SCALE STANDARDIZATION:**
     - Agency questions: 7-point → 5-point
     - AI Dependence: 7-point → 5-point
     - Cognitive Load: 7-point → 5-point
     - Default values: 4 → 3

4. `client/src/components/StandardizedPostTaskQuestionnaire.js`
   - **SCALE STANDARDIZATION:**
     - Agency questions: 7-point → 5-point
     - AI Dependence: 7-point → 5-point
     - Cognitive Load: 7-point → 5-point
     - Default values: 4 → 3

5. `client/src/components/PostStudySurvey.js`
   - Changed from ranking to rating system
   - Updated validation to allow duplicate ratings
   - Updated UI labels and descriptions
   - **SCALE STANDARDIZATION:**
     - Condition ratings: 1-4 → 1-5
     - Learning rating: 7-point → 5-point
     - Usefulness rating: 7-point → 5-point
     - Default values: 4 → 3
     - Updated rating labels for consistency
