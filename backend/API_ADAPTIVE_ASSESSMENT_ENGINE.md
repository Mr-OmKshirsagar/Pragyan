# Pragyan Adaptive Career Assessment Engine API

## Architecture Overview

- Frontend: React + TypeScript + Tailwind + Framer Motion
- Backend: Node.js + Express + TypeScript
- Database: MongoDB Atlas via Prisma
- Cache: Redis with in-memory fallback
- Auth: JWT via existing auth middleware
- AI Layer: Gemini via Pragyan AI provider in explainer-only mode

## Endpoints

### Assessment Engine

#### POST /api/assessment/start
Starts a new adaptive assessment session.

Response:

```json
{
  "sessionId": "uuid",
  "question": {
    "id": "root_career_path",
    "question": "What type of career path are you interested in?",
    "category": "Root",
    "type": "single-choice",
    "options": ["Government Job", "Private Job", "Defence", "Freelancing", "Business / Entrepreneurship", "Higher Studies", "Undecided"]
  },
  "confidence": 0,
  "progress": { "answered": 0, "totalRelevant": 6 }
}
```

#### POST /api/assessment/answer
Submits one answer and returns the next adaptive question.

Request:

```json
{
  "sessionId": "uuid",
  "questionId": "tech_track",
  "answer": "AI/ML"
}
```

Response:

```json
{
  "sessionId": "uuid",
  "confidence": 0.57,
  "nextQuestion": {
    "id": "ml_interest",
    "question": "How interested are you in machine learning models and applied AI projects?",
    "category": "AI-ML-Fit",
    "type": "likert",
    "options": ["Strongly Agree", "Agree", "Neutral", "Disagree"]
  },
  "shouldSubmit": false,
  "progress": { "answered": 4, "totalRelevant": 7 }
}
```

#### POST /api/assessment/next
Returns the currently pending adaptive question for a session.

Request:

```json
{ "sessionId": "uuid" }
```

#### POST /api/assessment/submit
Finalizes adaptive assessment, computes weighted + cosine matches, persists results.

Request:

```json
{ "sessionId": "uuid" }
```

Response fields:

- resultId
- confidence
- topMatches
- allMatches
- summary (scores, strengths, weaknesses, roadmap)
- ai (Gemini explainer output, non-authoritative)

#### GET /api/assessment/results/:id
Fetches persisted adaptive result by ID for authenticated user.

### Careers API

#### GET /api/careers
Returns career profile catalog with:

- title
- category
- requiredSkills
- personalityTraits
- salaryRange
- growthRate
- futureDemand
- roadmap

#### GET /api/careers/:id
Returns one career profile in detail.

### AI Explainer Layer

#### POST /api/ai/report
Generates personalized report text from deterministic output.

Constraints:

- AI must not choose careers
- AI only explains and enriches

#### POST /api/ai/roadmap
Generates learning roadmap for pre-selected target career.

### Admin APIs

#### GET /api/admin/assessments/completion-rates
Assessment completion analytics.

#### POST /api/admin/assessment-questions
Adds a question to an assessment.

#### GET /api/admin/adaptive/decision-tree
Reads current admin decision-tree config.

#### PUT /api/admin/adaptive/decision-tree
Updates adaptive decision-tree config.

#### GET /api/admin/adaptive/weights
Reads adaptive weights config.

#### PUT /api/admin/adaptive/weights
Updates adaptive weights config.

#### POST /api/admin/careers
Adds a new career profile and mappings.

#### PUT /api/admin/careers/:id/weights
Updates skill and interest weights for a career.

## Engine Behavior

- Dynamic decision tree branching by user path
- Relevant-question-only traversal
- Weighted scoring updates on every answer
- Confidence tracking using:

```text
confidence = answeredRelevantQuestions / totalRelevantQuestions
```

- Cosine similarity between user vector and career vectors
- Top-N ranking with demand and growth signal blend

## Persistence

The engine persists:

- AssessmentSession (full trajectory and confidence)
- AssessmentAnswer (every answer)
- AssessmentResult (scores and recommendations)
- RecommendationHistory (top recommendations)

## Redis

Session state stored under:

```text
adaptive:assessment:session:{sessionId}
```

TTL: 2 hours.
