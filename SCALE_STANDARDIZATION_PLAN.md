# Rating Scale Standardization Plan

## Current State Audit

### PreStudySurvey.js
- **Data Science Familiarity:** 1-7 scale (slider)
  - 1 = "Not familiar", 7 = "Very familiar"
- **AI Experience:** 1-7 scale (slider)
  - 1 = "No experience", 7 = "Very experienced"

### PostTaskQuestionnaire.js
- **Agency Questions (6 items):** 1-7 scale (radio buttons)
  - 1 = "Strongly Disagree", 7 = "Strongly Agree"
- **AI Dependence:** 1-7 scale (radio buttons)
  - 1 = "Not at all", 7 = "Completely"
- **Cognitive Load (3 items):** 1-7 scale (radio buttons)
  - 1 = "Very Low", 7 = "Very High"

### StandardizedPostTaskQuestionnaire.js
- Same as PostTaskQuestionnaire.js (1-7 scales)

### PostStudySurvey.js
- **Condition Ratings:** 1-4 scale (radio buttons)
  - 1 = "Most Preferred", 4 = "Least Preferred"
- **Learning Rating:** 1-7 scale (radio buttons)
  - 1 = "Nothing", 7 = "A lot"
- **Usefulness Rating:** 1-7 scale (radio buttons)
  - 1 = "Not useful", 7 = "Very useful"

## Problems Identified

1. ❌ **Inconsistent scale lengths:** Mix of 1-4, 1-5, and 1-7 scales
2. ❌ **Inconsistent direction:** Sometimes 1=best, sometimes 1=worst
3. ❌ **Different input types:** Sliders vs radio buttons

## Standardization Decision

### ✅ Use 5-Point Likert Scale Throughout

**Why 5-point?**
- Standard in research (most common)
- Easier for participants to understand
- Reduces cognitive load
- Provides sufficient granularity without overwhelming
- Consistent with feedback request

### ✅ Consistent Direction: 1 = Lowest/Worst, 5 = Highest/Best

**Exceptions:**
- Reverse-scored items will be clearly labeled
- Negative constructs (e.g., "frustration") will use 1=Low, 5=High

### ✅ Use Radio Buttons (Not Sliders)

**Why?**
- More precise selection
- Clearer visual feedback
- Better for research data quality
- Consistent interaction pattern

## Implementation Plan

### 1. PreStudySurvey.js
**Changes:**
- Data Science Familiarity: 7-point slider → 5-point radio buttons
  - 1 = "Not at all familiar", 5 = "Extremely familiar"
- AI Experience: 7-point slider → 5-point radio buttons
  - 1 = "No experience", 5 = "Extensive experience"

### 2. PostTaskQuestionnaire.js
**Changes:**
- Agency Questions: 7-point → 5-point
  - 1 = "Strongly Disagree", 5 = "Strongly Agree"
- AI Dependence: 7-point → 5-point
  - 1 = "Not at all", 5 = "Completely"
- Cognitive Load: 7-point → 5-point
  - 1 = "Very Low", 5 = "Very High"

### 3. StandardizedPostTaskQuestionnaire.js
**Changes:**
- Same as PostTaskQuestionnaire.js (all 7-point → 5-point)

### 4. PostStudySurvey.js
**Changes:**
- Condition Ratings: Keep 1-4 → Change to 1-5
  - 1 = "Strongly Prefer", 5 = "Strongly Do Not Prefer"
- Learning Rating: 7-point → 5-point
  - 1 = "Nothing", 5 = "A great deal"
- Usefulness Rating: 7-point → 5-point
  - 1 = "Not at all useful", 5 = "Extremely useful"

## Standard 5-Point Scale Labels

### Agreement Scale
1. Strongly Disagree
2. Disagree
3. Neutral
4. Agree
5. Strongly Agree

### Frequency/Intensity Scale
1. Not at all / Very Low
2. Slightly / Low
3. Moderately / Medium
4. Very / High
5. Extremely / Very High

### Preference Scale
1. Strongly Prefer
2. Prefer
3. Neutral
4. Do Not Prefer
5. Strongly Do Not Prefer

## Default Values
- All scales will default to **3 (Neutral/Middle)** to avoid bias
- Currently many default to 4 (which was middle of 7-point scale)

## Visual Design
- Circular radio buttons with numbers
- Clear labels on both ends
- Hover states for better UX
- Selected state with color coding
- Consistent spacing and sizing
