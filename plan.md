# Celebrate — Event Planning Assistant

## Implementation approach

Celebrate is a responsive React workspace backed by the existing web-db-user Express/tRPC starter. The main screen is a single event workspace with focused views for overview, budget, timeline, vendors, and ideas. The first release keeps the interaction fast and demo-friendly: event data is modeled in client state and mirrored to localStorage so the demo survives a refresh, while the existing server exposes an `/api/ideas` endpoint that uses the managed platform LLM when available and falls back to curated deterministic recommendations if the service is unavailable. This keeps the product functional in preview without requiring an external API key.

The application will include: event creation/editing (event type, title, date, location, guests, budget, theme/preferences), budget categories with estimated and actual amounts and payment status, a dated timeline with completion controls, a vendor checklist with notes/status, a personalized ideas generator, and the ability to save an idea back into the workspace. The server health route and the existing platform configuration remain intact.

## Project structure

- `client/src/pages/Home.tsx` — primary planning workspace, view switching, modals, client-side persistence, and functional controls.
- `client/src/index.css` — global palette, typography, responsive layout, editorial dashboard styling, and motion.
- `server/_core/index.ts` — existing server plus the `/api/ideas` LLM proxy/fallback endpoint.
- `public/manus-routes.json` — route manifest for the single-page app.
- `app.config.ts` — project logo metadata.
- `TODO.md` — outcome-based delivery checklist.

## Design direction

Three possible styles considered:

1. **Editorial garden ledger** — 0.07 probability. A warm, paper-like planning journal with deep green ink, clay accents, serif headlines, and narrow rail navigation.
2. **Studio control room** — 0.05 probability. A dark, high-contrast operations console with neon status colors and dense information blocks.
3. **Sunday market planner** — 0.06 probability. A bright, playful planning board with stickers, color-coded tabs, and hand-drawn accents.

Chosen style: **Editorial garden ledger**.

### Design Movement

Modern editorial hospitality: the calm authority of a boutique wedding planner's notebook translated into an airy digital workspace.

### Core Principles

- Calm hierarchy: let the event story lead, then surface only the next useful action.
- Warm precision: pair tactile neutrals with crisp numbers and progress indicators.
- Visible momentum: every section shows what is finished, what is next, and how close the plan is.
- Gentle personality: use small botanical motifs, encouraging microcopy, and restrained motion.

### Color Philosophy

Deep evergreen is the signature ink color: dependable, grounded, and ownable. Oat paper keeps the canvas human and reduces dashboard fatigue. Clay coral marks moments worth attention without feeling like an error state; marigold is reserved for in-progress and payment reminders. Soft sage surfaces create breathing room between planning modules.

### Layout Paradigm

Use a slim left rail for the planner identity and view navigation, then a wide asymmetric workspace: a story-led hero strip, a narrow “next up” column, and a flexible content canvas. On mobile, the rail becomes a horizontal tab bar and the asymmetric blocks stack in priority order.

### Signature Elements

- A seed/leaf mark built from a small sprout icon and circular ink seal.
- Dashed “paper edge” dividers and compact status stamps for completed/in-progress work.
- A rounded progress dial and clay accent line that connect planning detail to celebration energy.

### Interaction Philosophy

Controls should feel like marking a planning notebook: checkboxes resolve tasks, select menus change the plan context, and saving an idea gives immediate feedback with a small toast. Avoid destructive actions; edits are optimistic and recover through local persistence.

### Animation

Use short 180–240ms ease-out transitions for view changes, checklist completion, and modal entry. The hero progress dial can gently draw in once on first load. Do not animate every card; reserve motion for state changes and the “Generating ideas” state.

### Typography System

Use `DM Sans` for interface text and numerals with strong 600/700 weights. Use `Fraunces` for hero headlines and section titles to create the editorial planner feel. Uppercase micro-labels use 10–11px letter spacing with the evergreen ink color.

### Brand Essence

**Celebrate turns a blank calendar into a plan people can feel.** It is for hosts who care about the details but want the process to stay joyful. Personality: warm, clever, grounding.

### Brand Voice

Headlines are specific and reassuring. CTAs are active but never pushy. Example lines: “Make room for the good stuff.” and “A few smart choices now, more dancing later.”

### Wordmark & Logo

A lowercase `celebrate` wordmark paired with a two-leaf sprout seal: one leaf for the plan, one for the people. The seal sits in a soft oat circle and becomes the app favicon/rail mark.

### Signature Brand Color

**Evergreen Ink `#193c34`** — the unmistakable brand color used for the rail, primary actions, and key numbers.
