# Dimensions of Expression

A local-first, non-commercial expression interpretation game for studying complex facial expressions.

The public repository is designed to contain the app, frameworks, and placeholder/demo materials. Copyrighted reference frames should stay outside the public repo unless there is a deliberate, documented fair-use rationale for each image.

## Run Locally

```sh
npm run dev
```

Then open <http://localhost:5173>.

## Collaboration Pattern

- Codex edits the local repository.
- The app stores readings in the browser during early prototyping.
- User-provided frames can be added through `assets/private/` without being committed.
- Public demo assets should be generated, public-domain, or permissively licensed.
- When ready, sync to `https://github.com/Farechiga/dimensionsofexpression`.

## Current Prototype

- Asset workflow with `assets/manifest.json`
- Per-image micro-module completion tracking
- Contained workspace with one active decision space at a time
- Progressive flow from vocabulary sorting to specific interpretation
- Emotion wheel umbrella sliders
- External/internal vocabulary bins for conflicting messages
- Expandable taxonomy with multi-select nuanced terms
- Interpretation/subtext prompt
- Local comparison of readings per image

## Taxonomy Backbone

The expressive vocabulary lives in `src/taxonomy.js` so categories and terms can expand without rewriting the interface. The first taxonomy pass draws from:

- Russell/PAD affect models: valence, activation, dominance/control
- Appraisal theory: novelty, goal relevance, agency, coping, certainty
- Display rules: masking, leakage, social performance, impression management
- Acting vocabulary: objective and social intention
- Embodied state vocabulary: held/released breath, tightened/expanded, rooted/unsteady

## Adding Local Images

1. Put image files in `assets/`.
2. Add entries to `assets/manifest.json`.
3. Run the local site and use the character dropdown plus arrows to browse frames.

Images inside `assets/private/` are ignored by Git. This keeps study frames local unless you deliberately move public-safe assets elsewhere. The static browser app cannot write files back into `assets/`; repository images should be added through the folder and manifest.

## Preserved Uploads

The plus button uploads approved PNG/JPG files to a private Supabase Storage bucket and stores character, title, video URL, storage path, owner, and timestamps in `public.images`. Private files are displayed with expiring signed URLs.

Run [`supabase/images.sql`](supabase/images.sql) in the Supabase SQL editor, enable anonymous sign-ins, then add the project URL and publishable key to `src/app-config.js`.

```js
export const appConfig = {
  supabaseUrl: "https://YOUR_PROJECT.supabase.co",
  supabasePublishableKey: "YOUR_PUBLISHABLE_KEY",
  supabaseImageBucket: "expression-images"
};
```

When Supabase is unavailable or unconfigured, uploads fall back to IndexedDB. Existing IndexedDB uploads are migrated automatically when Supabase becomes available. The four-digit browser PIN remains a lightweight workflow gate; durable access control is enforced by anonymous authentication and row-level policies.
