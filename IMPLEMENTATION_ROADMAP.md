# Research Prototype Implementation Roadmap

## Critical Issues Identified from Supervisor Meeting

### 1. **Inconsistent Post-Task Questionnaires** ⚠️ HIGH PRIORITY
**Problem**: Different conditions use different questionnaires, making comparison impossible.

**Solution**: 
- ✅ Created `StandardizedPostTaskQuestionnaire.js` 
- 🔄 **TODO**: Replace existing questionnaire usage in:
  - `TransferTasks.js` - Add questionnaire after each transfer task
  - `ExperimentalTask.js` - Replace current `PostTaskQuestionnaire` import
  - Ensure all conditions use same 7-point Likert scales

**Research Impact**: Without this fix, you cannot compare agency, control, and satisfaction across conditions.

### 2. **AI Suggestions Ignore User Context** ⚠️ HIGH PRIORITY  
**Problem**: AI generates completely new ideas instead of building on user's existing ideas.

**Solution**:
- ✅ Enhanced AI prompt in `server/routes/ai.js` to consider existing ideas
- ✅ Created `IterativeAIHelper.js` for multiple interaction rounds
- 🔄 **TODO**: Integrate iterative helper into main experimental task

**Research Impact**: Current system doesn't support Research Question about user agency and idea ownership.

### 3. **Limited Interaction Rounds** 🔄 MEDIUM PRIORITY
**Problem**: Users can only interact with AI once, limiting refinement opportunities.

**Solution**:
- ✅ Created iterative AI helper component
- ✅ Enhanced server to support refinement requests
- 🔄 **TODO**: Integrate into main experimental flow
- 🔄 **TODO**: Add "reject suggestion" and "ask for different direction" options

### 4. **Scale Consistency Issues** ⚠️ HIGH PRIORITY
**Problem**: Mixing 4-point and 7-point Likert scales complicates analysis.

**Solution**:
- ✅ Standardized all scales to 7-point in new questionnaire component
- 🔄 **TODO**: Update `PostStudySurvey.js` to use consistent 7-point scales

### 5. **Rationale System Needs Enhancement** 🔄 MEDIUM PRIORITY
**Problem**: Current rationale system doesn't allow idea refinement after reflection.

**Solution**:
- ✅ Created `EnhancedRationaleModal.js` with idea refinement capability
- 🔄 **TODO**: Integrate into experimental task
- 🔄 **TODO**: Track whether ideas were refined post-rationale for RQ4 analysis

## Implementation Steps (Priority Order)

### Phase 1: Critical Fixes (Week 1)
1. **Replace questionnaire components**:
   ```javascript
   // In TransferTasks.js - add after task completion
   import StandardizedPostTaskQuestionnaire from './StandardizedPostTaskQuestionnaire';
   
   // In ExperimentalTask.js - replace existing import
   import StandardizedPostTaskQuestionnaire from './StandardizedPostTaskQuestionnaire';
   ```

2. **Update PostStudySurvey to 7-point scales**:
   - Change all rating scales from mixed scales to consistent 7-point
   - Update validation logic accordingly

3. **Test questionnaire consistency**:
   - Ensure same questions appear for all conditions
   - Verify data collection captures all required metrics

### Phase 2: AI Enhancement (Week 2)
1. **Integrate IterativeAIHelper**:
   ```javascript
   // In ExperimentalTask.js
   import IterativeAIHelper from './IterativeAIHelper';
   // Replace simple AI suggestion logic with iterative helper
   ```

2. **Add refinement tracking**:
   - Log all AI interaction rounds
   - Track suggestion acceptance/rejection patterns
   - Record refinement requests and responses

3. **Test AI suggestion quality**:
   - Verify suggestions build on existing ideas
   - Test refinement request functionality

### Phase 3: Advanced Features (Week 3)
1. **Integrate EnhancedRationaleModal**:
   - Replace simple rationale modal
   - Track idea refinements post-rationale
   - Log metacognitive reflection quality

2. **Add interaction analytics**:
   - Track time spent on each interaction
   - Monitor suggestion-to-acceptance ratios
   - Record user feedback patterns

## Data Collection Alignment with Research Questions

### RQ1: How does timing affect creativity and quality?
- ✅ Already captured: timing condition, idea count, idea quality metrics
- 🔄 **Need**: Standardized creativity assessment across conditions

### RQ2: How does timing affect perceived agency?
- ⚠️ **Critical**: Requires standardized questionnaire (Phase 1)
- 🔄 **Need**: Same agency questions for all conditions

### RQ3: How does reflection requirement affect critical engagement?
- ✅ Already captured: rationale text, reflection quality
- 🔄 **Enhancement**: Track idea refinement post-rationale

### RQ4: Does requiring rationale affect creative output quality?
- ⚠️ **Critical**: Need to compare ideas before/after rationale
- 🔄 **Need**: Enhanced rationale modal with refinement tracking

### RQ5: Are there interaction effects?
- ⚠️ **Critical**: Requires all above fixes for proper comparison
- 🔄 **Need**: Consistent data collection across all conditions

## Testing Checklist

### Before Next Supervisor Meeting:
- [ ] All conditions use StandardizedPostTaskQuestionnaire
- [ ] All scales are consistent 7-point Likert
- [ ] AI suggestions build on existing user ideas
- [ ] Transfer tasks include post-task questionnaires
- [ ] Data export includes all required metrics for RQs

### For Pilot Testing:
- [ ] Test complete user journey for each condition
- [ ] Verify data collection completeness
- [ ] Check questionnaire response validation
- [ ] Test AI suggestion quality and relevance
- [ ] Validate timing mechanisms work correctly

## Notes for Supervisor Discussion

1. **Consent Form**: As supervisor mentioned, update consent to clarify data anonymization limitations
2. **Multiple Rounds**: Consider allowing 2-3 AI interaction rounds per task
3. **Suggestion Rejection**: Add ability to reject suggestions and request different directions
4. **Transfer Task Questionnaires**: Confirm whether transfer tasks should have same questionnaires
5. **Creativity Assessment**: Discuss how to measure creativity consistently across conditions

## Quick Wins for Next Meeting

1. Replace questionnaire components (30 minutes)
2. Update PostStudySurvey scales (15 minutes)  
3. Test one complete user journey (20 minutes)
4. Export sample data to verify completeness (10 minutes)

Total estimated time for critical fixes: ~2-3 hours