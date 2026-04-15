# AI Idea Refinement Feature - Implementation Proposal

## Issue #2: No AI Suggestion to Refine Initial Ideas

### Current State
- Users can submit ideas
- AI provides suggestions for new ideas
- No way to refine or improve existing ideas with AI help

### Proposed Solution

#### Option A: Inline Refinement Button (Recommended)
Add a "Refine with AI" button next to each submitted idea that allows users to get AI suggestions for improving that specific idea.

**User Flow:**
1. User submits an idea
2. Idea appears in the ideas list with a "Refine" button
3. User clicks "Refine" on a specific idea
4. AI generates 2-3 refinement suggestions based on that idea
5. User can accept a refinement (replaces original) or dismiss

**Implementation:**
```javascript
// Add to each idea card in ExperimentalTask.js
<button
  onClick={() => requestIdeaRefinement(idea)}
  className="text-blue-600 hover:text-blue-700 text-xs font-medium"
>
  ✨ Refine with AI
</button>

// New function
const requestIdeaRefinement = async (idea) => {
  setIsLoadingAI(true);
  try {
    const response = await axios.post(`${API_BASE}/ai/refine`, {
      originalIdea: idea.content,
      taskId: condition.taskId,
      participantId
    });
    
    // Show refinement suggestions in a modal
    setRefinementSuggestions(response.data.refinements);
    setRefinementTarget(idea);
    setShowRefinementModal(true);
  } catch (error) {
    console.error('Error getting refinements:', error);
  } finally {
    setIsLoadingAI(false);
  }
};
```

**Backend API Endpoint Needed:**
```javascript
// server/routes/ai.js
router.post('/refine', async (req, res) => {
  const { originalIdea, taskId, participantId } = req.body;
  
  const prompt = `Given this research question: "${originalIdea}"
  
  Provide 3 refined versions that:
  1. Make it more specific and measurable
  2. Add relevant context or constraints
  3. Suggest related angles to explore
  
  Keep each refinement concise and actionable.`;
  
  // Call OpenAI API
  const refinements = await generateRefinements(prompt);
  
  res.json({ refinements });
});
```

#### Option B: Automatic Refinement Suggestions
After a user submits an idea, automatically show 1-2 quick refinement suggestions.

**Pros:**
- Proactive assistance
- Encourages iteration
- No extra clicks needed

**Cons:**
- May slow down idea generation flow
- Could feel intrusive
- Adds complexity to the submission flow

#### Option C: Dedicated Refinement Phase
Add a "Refinement Phase" after initial idea generation where users can review and refine all their ideas.

**Pros:**
- Clear separation of generation vs. refinement
- Allows focused refinement time
- Good for research data collection

**Cons:**
- Adds another step to the workflow
- May feel forced
- Increases total task time

### Recommendation

**Implement Option A (Inline Refinement Button)** because:
1. ✅ User-initiated (respects agency)
2. ✅ Flexible (use when needed)
3. ✅ Minimal disruption to current flow
4. ✅ Easy to track in research data
5. ✅ Works with both JIT and Always-On conditions

### Design Considerations

**For JIT Condition:**
- Refinement button always visible
- Clicking triggers AI refinement request
- Shows refinements in modal (similar to current JIT suggestions)

**For Always-On Condition:**
- Refinement button always visible
- Refinements appear in sidebar alongside new idea suggestions
- Clear visual distinction between "new ideas" and "refinements"

**Logging for Research:**
```javascript
logInteraction('idea_refinement_requested', {
  originalIdea: idea,
  timestamp: new Date()
});

logInteraction('refinement_accepted', {
  originalIdea: idea,
  refinedIdea: refinement,
  timestamp: new Date()
});
```

### UI Mockup (Text Description)

```
┌─────────────────────────────────────────┐
│ Idea 1                    [10:23 AM]    │
│ How does student engagement correlate   │
│ with course completion rates?           │
│                                         │
│ [✨ Refine with AI]  [🗑️ Delete]       │
└─────────────────────────────────────────┘
```

When clicked:
```
┌─────────────────────────────────────────┐
│ Refinement Suggestions                  │
│                                         │
│ Original: How does student engagement   │
│ correlate with course completion rates? │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 1. How do specific engagement       │ │
│ │    metrics (forum posts, video      │ │
│ │    views) predict completion?       │ │
│ │    [Use This] [Dismiss]             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 2. What engagement threshold        │ │
│ │    indicates high completion risk?  │ │
│ │    [Use This] [Dismiss]             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Close]                                 │
└─────────────────────────────────────────┘
```

### Implementation Checklist

- [ ] Add refinement button to idea cards
- [ ] Create refinement modal component
- [ ] Add backend `/ai/refine` endpoint
- [ ] Implement refinement prompt engineering
- [ ] Add interaction logging
- [ ] Update both JIT and Always-On flows
- [ ] Add loading states
- [ ] Test with both conditions
- [ ] Update documentation

### Estimated Effort
- Frontend: 2-3 hours
- Backend: 1-2 hours
- Testing: 1 hour
- **Total: 4-6 hours**
