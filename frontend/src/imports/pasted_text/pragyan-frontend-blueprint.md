**Pragyan Frontend Blueprint**

Build the frontend as a premium AI product with 3 connected experiences:

1. Public AI marketing experience
2. Authenticated AI operating system
3. Adaptive assessment and results journey

The current routing shell already lives in frontend/src/app/App.tsx, auth in frontend/src/app/pages/NewAuth.tsx, and the dashboard in frontend/src/app/pages/Dashboard.tsx. The backend is already providing auth, assessment, AI status, recommendations, roadmaps, and jobs through backend/src/app.ts.

**What the frontend should do**
The frontend should not behave like a dashboard app. It should feel like an AI career operating system. That means the UI must communicate intelligence, personalization, motion, and trust at every step.

The product should make users feel:
- “This understands my career.”
- “This is guiding me.”
- “This is premium.”
- “This is alive.”

**Core pages you should build**

1. Landing page  
This is the emotional sales page. It should sell Pragyan in under 5 seconds with:
- cinematic AI hero
- animated gradient and neural background
- glowing primary CTA: Start AI Career Assessment
- AI explanation section
- adaptive assessment preview
- roadmap ecosystem preview
- recommendation preview
- testimonials or social proof
- career domains section
- final CTA and premium footer

2. Auth pages  
Login, signup, and forgot password should feel minimal, elegant, and trustworthy. Use glassmorphism cards, strong focus states, soft motion, and simple forms. Keep the path short and clean.

3. Dashboard  
This is the main AI OS surface. It should include:
- AI hero banner
- personalized greeting
- AI intelligence summary
- dominant Start AI Assessment CTA
- learning streak
- XP system
- roadmap progress
- top career match preview
- AI recommendations
- progress analytics
- adaptive insights

4. Adaptive assessment  
This is the heart of the product. It should feel like an intelligent multi-step process, not a normal quiz:
- animated question cards
- progress tracking
- category switching
- AI-thinking moments
- smooth transitions
- emotionally paced flow
- cinematic completion

5. Career results  
This should feel cinematic and confidence-building:
- top career matches
- deterministic match percentages
- strengths and gaps
- roadmap recommendations
- hiring readiness
- growth potential
- AI-assisted insights label
- animated reveals and glowing charts

6. Roadmaps  
Roadmaps should feel like interactive learning journeys:
- timeline progression
- milestones
- skill trees
- progress tracking
- dependencies
- estimated learning time
- AI guidance suggestions

7. AI career assistant chat  
This should feel like a modern assistant interface inspired by ChatGPT, Perplexity, and Notion AI:
- streaming responses
- typing indicators
- markdown support
- quick prompts
- career help
- roadmap help
- resume help
- interview help

8. Job recommendations  
This should be smart and opportunity-driven:
- match %
- hiring status
- salary range
- required skills
- roadmap alignment
- readiness score
- AI hiring insights
- bookmark and filter actions

9. Profile  
This should feel like a career identity hub:
- profile summary
- strengths
- interests
- learning analytics
- saved roadmaps
- saved careers
- achievements
- assessment history

10. Admin analytics  
Future-ready only, but visually planned:
- user growth
- AI provider health
- assessment metrics
- recommendation performance
- roadmap completion
- telemetry insights

**Design language**
Use one coherent visual system across everything:
- deep navy background
- purple gradients
- cyan highlights
- electric blue accents
- subtle pink glow
- glassmorphism surfaces
- layered blur
- glowing borders
- floating cards
- subtle grid overlays
- neural network background motion

Avoid:
- flat admin cards
- gray-on-gray layouts
- crowded screens
- cheap gradients
- outdated LMS patterns

**Frontend architecture**
I would structure the frontend like this:

- `app/` for route orchestration and page shells
- `components/` for reusable product components
- `layouts/` for public and authenticated shells
- `animations/` for Framer Motion presets and motion helpers
- `services/` for API and backend communication
- `hooks/` for data and UI hooks
- `store/` for Zustand or Context-based state
- `themes/` for color tokens and gradients
- `pages/` for page-level composition
- `ui/` for shared visual primitives
- `utils/` for helpers and formatting

**Reusable component system**
Build these first and use them everywhere:
- GlassCard
- GlowButton
- AIHero
- NeuralBackground
- FloatingParticles
- AIThinkingLoader
- AssessmentCard
- CareerMatchCard
- RoadmapTimeline
- AnimatedProgress
- GradientIconWrapper
- SectionHeader
- StatCard
- SkeletonLoader
- AIInsightCard

That gives you scale and consistency.

**Motion system**
Use Framer Motion for:
- page transitions
- staggered reveals
- floating motion
- hover scaling
- glow transitions
- progress animations
- card tilt effects
- loading states

Motion should feel premium and intelligent, not decorative.

**State model**
Keep state focused:
- auth state
- user profile state
- assessment state
- recommendations state
- roadmap state
- assistant/chat state
- UI state like sidebars, modals, and tab selection

Avoid heavy global state for everything. Use local component state where possible and store only what needs to survive page transitions.

**What backend data the frontend should consume**
The backend already handles the intelligence. The frontend should only present it well.

Use the backend for:
- auth and session management
- current user profile
- assessment questions and latest results
- recommendation bundles
- roadmap recommendations
- AI status and telemetry
- jobs feed
- career match explanation

Useful backend surfaces already exist in:
- backend/src/routes/auth.ts
- backend/src/routes/assessment.ts
- backend/src/routes/recommendations.ts
- backend/src/routes/ai.ts

**Frontend UX rules**
- The Start AI Assessment CTA must be the biggest visual element in the dashboard.
- AI guidance content should always appear before utility content.
- Deterministic score should be visually dominant in results.
- The app should feel responsive and smooth on mobile.
- Loading states should feel intelligent, not blank.
- Errors should be readable, soft, and helpful.

**Build order**
1. Design system and component primitives
2. Landing page
3. Auth flow
4. Dashboard
5. Adaptive assessment
6. Results page
7. Roadmaps
8. Chat assistant
9. Job recommendations
10. Profile and admin analytics

**Recommended product hierarchy**
If you want the UI to feel like a venture-scale AI product, the information hierarchy should be:
- assessment
- top match
- roadmap guidance
- recommendations
- learning analytics
- jobs
- profile

If you want, I can next give you:
1. a concrete folder-by-folder frontend architecture,
2. a wireframe spec for each page,
3. or a component inventory with exact props and responsibilities.