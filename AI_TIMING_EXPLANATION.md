# AI Suggestion Timing - Before & After

## The Problem

Users reported AI suggestions appearing "sporadically" and "too fast" with "no time gap between generations."

## Root Cause Analysis

### BEFORE (Broken Behavior)

In **Always-On mode**, there were THREE triggers:

```
Timeline Example (user submits 3 ideas quickly):

0:00  - Task starts
0:02  - ✅ Initial AI suggestions (trigger #1)
0:10  - User submits Idea 1
0:11  - ✅ AI suggestions (trigger #3 - after idea)
0:15  - User submits Idea 2  
0:16  - ✅ AI suggestions (trigger #3 - after idea)
0:20  - ✅ AI suggestions (trigger #2 - periodic)
0:22  - User submits Idea 3
0:23  - ✅ AI suggestions (trigger #3 - after idea)
0:40  - ✅ AI suggestions (trigger #2 - periodic)
1:00  - ✅ AI suggestions (trigger #2 - periodic)
```

**Result:** 7 AI suggestion generations in 60 seconds! 😱

### Triggers Identified:

1. **Initial Trigger** - 2 seconds after task starts
   ```javascript
   useEffect(() => {
     if (taskStarted && condition.timing === 'always_on') {
       setTimeout(() => generateAiSuggestions(), 2000);
     }
   }, [taskStarted, condition.timing]);
   ```

2. **Periodic Trigger** - Every 20 seconds
   ```javascript
   setInterval(() => {
     generateAiSuggestions();
   }, 20000);
   ```

3. **After Idea Submission** - 1 second after each idea
   ```javascript
   if (condition.timing === 'always_on') {
     setTimeout(() => generateAiSuggestions(), 1000);
   }
   ```

## The Solution

### AFTER (Fixed Behavior)

```
Timeline Example (same scenario):

0:00  - Task starts
0:02  - ✅ Initial AI suggestions (trigger #1)
0:10  - User submits Idea 1
      - ❌ No trigger (removed)
0:15  - User submits Idea 2  
      - ❌ No trigger (removed)
0:22  - User submits Idea 3
      - ❌ No trigger (removed)
1:32  - ✅ AI suggestions (trigger #2 - periodic, 90s after last)
3:02  - ✅ AI suggestions (trigger #2 - periodic, 90s after last)
```

**Result:** 3 AI suggestion generations in 3 minutes ✅

### Changes Made:

1. ✅ **Removed** trigger #3 (after idea submission)
   ```javascript
   // Removed this entire block:
   // if (condition.timing === 'always_on') {
   //   setTimeout(() => generateAiSuggestions(), 1000);
   // }
   ```

2. ✅ **Increased** periodic interval from 20s → 90s
   ```javascript
   setInterval(() => {
     generateAiSuggestions(true);
   }, 90000); // Was 20000
   ```

3. ✅ **Added** 60-second cooldown mechanism
   ```javascript
   const lastAiGenerationTime = useRef(0);
   
   const generateAiSuggestions = useCallback(async (isAutoTrigger = false) => {
     // Cooldown: Don't generate if we generated within the last 60 seconds
     const timeSinceLastGeneration = Date.now() - lastAiGenerationTime.current;
     if (timeSinceLastGeneration < 60000) {
       console.log('AI suggestion cooldown active, skipping generation');
       return;
     }
     
     lastAiGenerationTime.current = Date.now();
     // ... rest of generation logic
   });
   ```

4. ✅ **Manual override** for JIT "Get AI Help" button
   ```javascript
   const requestAiHelp = useCallback((isAutoTrigger = false) => {
     // For manual requests, bypass cooldown
     if (!isAutoTrigger) {
       lastAiGenerationTime.current = 0;
     }
     generateAiSuggestions(isAutoTrigger);
   });
   ```

## Timing Summary

### Always-On Mode
- **Initial:** 2 seconds after task starts
- **Periodic:** Every 90 seconds (minimum)
- **Cooldown:** 60 seconds between any generations
- **After ideas:** None (removed)

### JIT Mode
- **Manual:** When user clicks "Get AI Help" (bypasses cooldown)
- **Auto:** After 60 seconds of inactivity (if ideas.length > 0)
- **Cooldown:** 60 seconds for auto-triggers only

## Expected User Experience

### Always-On Mode
- Users see initial suggestions within 2 seconds
- New suggestions appear approximately every 90 seconds
- No interruptions when actively submitting ideas
- Smooth, predictable cadence

### JIT Mode
- Users can request help anytime (no cooldown)
- System offers help after 60s of inactivity
- User maintains full control

## Testing Checklist

- [ ] Always-On: Verify suggestions appear ~90 seconds apart
- [ ] Always-On: Submit multiple ideas quickly, verify no rapid suggestions
- [ ] JIT: Click "Get AI Help" multiple times, verify it works each time
- [ ] JIT: Wait 60s inactive, verify auto-trigger works
- [ ] Both: Verify cooldown prevents rapid-fire generations
- [ ] Both: Check console for "cooldown active" messages when appropriate
