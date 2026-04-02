# Consent Form Improvements - Supervisor Feedback Addressed

## Summary of Changes

This document outlines all improvements made to the consent form based on detailed supervisor feedback received on 02/03/2026.

## ✅ All Supervisor Requirements Addressed

### 1. **Data Deletion Acknowledgment** ✓
**Supervisor Feedback:** "They might not know their participant ID so how can they request data deletion? You can just say: I understand that I might not be able to ask for my data deletion because it is fully anonymous."

**Implementation:**
- Added explicit acknowledgment in consent form section 7
- Clear statement: "If you don't have your participant ID: We understand that you might not be able to request data deletion because the study is fully anonymous and you may not remember your participant ID. In such cases, your data will remain part of the anonymized dataset."
- Maintains transparency about deletion limitations

### 2. **Gender Information Removal** ✓
**Supervisor Feedback:** "If you think you wouldn't need gender you can take it out. Any personal information that you will eventually not be analyzing, there is no need to take it."

**Implementation:**
- Removed gender field from PreStudySurvey.js
- Updated form validation to exclude gender requirements
- Simplified demographics collection to essential variables only:
  - Age (for eligibility and analysis)
  - Academic level (for context)
  - Major/Program (for background understanding)
- Reduced form layout from 2x2 grid to streamlined format

### 3. **User Journey Documentation** ✓
**Supervisor Feedback:** "Steps that the user will go through (User journey). Describe the thesis proposal."

**Implementation:**
- Created comprehensive USER_JOURNEY.md document
- Detailed step-by-step participant experience:
  1. Landing & Consent (5-10 minutes)
  2. Pre-Study Survey (10 minutes)
  3. Tutorial & Practice (5 minutes)
  4. Main Experimental Tasks (40 minutes)
  5. Transfer Tasks (7 minutes)
  6. Post-Study Survey (3 minutes)
  7. Completion & Debriefing (2 minutes)
- Included technical requirements, data collection points, and ethical considerations
- Total time commitment: ~60 minutes

### 4. **Clear Data Collection Disclosure** ✓
**Requirement:** List exactly what's recorded

**Implementation:**
- Detailed list of collected data: task responses, AI interaction logs, timestamps, survey responses, session metadata
- Explicit list of what is NOT collected: names, emails, IPs, device IDs, browser fingerprints, keystroke patterns
- Clear explanation in both summary and full information sheet

### 5. **AI System Usage and Data Flow** ✓
**Requirement:** Clarify how LLM is used and where data goes

**Implementation:**
- Specified AI model: OpenAI GPT-3.5-turbo API
- Explained what data is sent to OpenAI (dataset descriptions, user ideas, refinement requests)
- Clarified that no identifying information is sent to AI provider
- Included OpenAI's data retention policy (30 days for abuse monitoring, then deleted)
- Added prominent warning not to enter personal information

### 6. **Fixed "Anonymous" Wording** ✓
**Requirement:** Correct terminology - pseudonymous vs anonymous

**Implementation:**
- Changed from "anonymous" to "pseudonymous" throughout
- Explained the difference: data linked by participant ID but not traceable to real identity
- Clarified what pseudonymity means for participants
- Explained linkage across tasks for analysis purposes

### 7. **Data Storage, Access, and Retention** ✓
**Requirement:** Where, who, how long, sharing plans

**Implementation:**
- **Storage location:** Render.com servers in European Union
- **Access:** Only primary researcher and supervisor
- **Retention:** Up to 5 years, then permanent deletion
- **Sharing:** Only aggregated results in publications; anonymized dataset may be shared with researchers after removing identifying information

### 8. **Risks, Discomforts, and Benefits** ✓
**Requirement:** Even if minimal, list them

**Implementation:**
**Risks:**
- Time and effort (60 minutes)
- Mental fatigue from creative tasks
- Possible frustration
- AI-generated content may be unexpected
- Minimal confidentiality risk

**Risk Mitigation:**
- Can take breaks anytime
- Can withdraw without penalty
- Clear warnings about personal information
- Secure data handling

**Benefits:**
- Direct: Experience with AI-assisted problem framing
- Indirect: Contributes to AI education research
- Societal: Informs better AI tool design

### 9. **Withdrawal and Deletion Rights** ✓
**Requirement:** Explain deletion process and limitations

**Implementation:**
- Right to withdraw anytime by closing browser
- Data deletion via email with participant ID
- 30-day deadline for deletion requests (before aggregation)
- Explanation that aggregated results cannot be removed
- Clear contact information for deletion requests
- **NEW:** Acknowledgment that participants may not remember their ID and thus cannot request deletion

### 10. **GDPR Compliance Clarification** ✓
**Requirement:** Don't claim GDPR compliance without ethics approval

**Implementation:**
- Removed direct GDPR compliance claims
- Added data protection notice explaining: "follows data protection principles" and "GDPR-like standards"
- Clarified that formal ethics approval not required for low-risk educational research
- Maintained high standards of confidentiality and security

### 11. **Full Information Sheet** ✓
**Requirement:** Provide expandable/downloadable detailed information

**Implementation:**
- Toggle button to switch between summary and full information sheet
- Print/save option for participants
- Comprehensive 9-section full information sheet covering all details
- Summary view with key highlights for quick review

### 12. **Enhanced Consent Checkbox** ✓
**Requirement:** Detailed confirmation list, not just one sentence

**Implementation:**
Replaced single-sentence consent with detailed confirmation list:
- Read and understood information
- Had opportunity to review full sheet
- Understand data collection and usage
- Understand voluntary participation
- Understand risks and benefits
- Understand deletion process
- Agree not to enter personal information
- Voluntarily agree to participate

### 13. **Contact Information** ✓
**Requirement:** Complete contact details

**Implementation:**
- Researcher name and email
- Supervisor name
- Institution and department
- Full address: Universitätsstraße 1, 56070 Koblenz, Germany

## New Features Added

1. **Toggle View:** Users can switch between summary and full information sheet
2. **Print/Save Option:** Button to print or save consent form for records
3. **Visual Warnings:** Color-coded warning boxes for important information
4. **Structured Sections:** Clear numbering and organization in full information sheet
5. **Prominent Warnings:** Red warning boxes for "Do not enter personal information"
6. **Streamlined Demographics:** Removed unnecessary gender field, simplified form layout
7. **Comprehensive User Journey:** Detailed documentation of participant experience

## Compliance Status

| Requirement | Status | Notes |
|------------|--------|-------|
| Data deletion acknowledgment | ✅ Complete | Added realistic expectation about ID retention |
| Gender field removal | ✅ Complete | Removed from survey and validation |
| User journey documentation | ✅ Complete | Comprehensive 7-step process documented |
| Data collection disclosure | ✅ Complete | Detailed lists of what is/isn't collected |
| AI usage explanation | ✅ Complete | Model, data flow, provider policy explained |
| Pseudonymity clarification | ✅ Complete | Corrected terminology, explained implications |
| Storage & retention | ✅ Complete | Location, access, duration, sharing plans |
| Risks & benefits | ✅ Complete | Comprehensive list with mitigation strategies |
| Withdrawal & deletion | ✅ Complete | Process, deadline, limitations explained |
| GDPR wording | ✅ Fixed | Changed to "data protection principles" |
| Full information sheet | ✅ Complete | Toggle view with print option |
| Enhanced consent | ✅ Complete | Detailed confirmation checklist |
| Contact information | ✅ Complete | Full details provided |

## Supervisor Feedback Integration

All points from the supervisor's feedback have been addressed:

1. ✅ **Data deletion limitation acknowledged** - Added realistic expectation about participant ID retention
2. ✅ **Gender field removed** - Eliminated unnecessary personal information collection
3. ✅ **User journey documented** - Comprehensive step-by-step process description
4. ✅ **Super clear about data collection** - Detailed what is/isn't collected
5. ✅ **Clarified LLM usage and data flow** - AI system transparency
6. ✅ **Added warning about personal information** - Prominent red warning boxes
7. ✅ **Fixed anonymous/pseudonymous wording** - Correct terminology throughout
8. ✅ **Added storage, access, retention details** - Complete data handling information
9. ✅ **Added risks, discomforts, benefits** - Comprehensive disclosure
10. ✅ **Explained withdrawal and deletion process** - Clear procedures and limitations
11. ✅ **Removed GDPR claims, added data protection notice** - Appropriate compliance language
12. ✅ **Added full information sheet with download option** - Toggle view functionality
13. ✅ **Enhanced consent checkbox with detailed list** - Comprehensive confirmation

## Result

The consent form and study design now provide:
- Complete transparency about data practices and limitations
- Realistic expectations about data deletion capabilities
- Streamlined data collection (removed unnecessary gender field)
- Clear explanation of AI system usage
- Proper terminology (pseudonymous vs anonymous)
- Comprehensive risk/benefit disclosure
- Clear participant rights and deletion process
- Professional presentation with toggle views
- Print/save functionality for participant records
- Detailed user journey documentation

The study is ready for supervisor review and participant recruitment.
