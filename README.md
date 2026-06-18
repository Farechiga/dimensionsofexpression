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
- User-provided frames can be uploaded locally without being committed.
- Public demo assets should be generated, public-domain, or permissively licensed.
- When ready, sync to `https://github.com/Farechiga/dimensionsofexpression`.

## Current Prototype

- Asset drop workflow with `assets/manifest.json`
- Per-image micro-module completion tracking
- Contained workspace with one active decision space at a time
- Progressive flow from vocabulary sorting to specific interpretation
- Emotion blend sliders
- External/internal vocabulary bins for conflicting messages
- Expandable taxonomy with multi-select nuanced terms
- Acting/subtext prompt
- Local comparison of multiple readings

## Taxonomy Backbone

The expressive vocabulary lives in `src/taxonomy.js` so categories and terms can expand without rewriting the interface. The first taxonomy pass draws from:

- FACS and facial coding: visible movement before interpretation
- Russell/PAD affect models: valence, arousal, dominance/control
- Appraisal theory: novelty, goal relevance, agency, coping, certainty
- Display rules: masking, leakage, social performance, impression management
- Acting vocabulary: objective, obstacle, intention, subtext
- Laban movement analysis: direct/indirect, strong/light, sudden/sustained, bound/free

## Adding Local Images

1. Put image files in `assets/private/`.
2. Add entries to `assets/manifest.json`.
3. Run the local site and select images from the Frame Library.

Images inside `assets/private/` are ignored by Git. This keeps study frames local unless you deliberately move public-safe assets elsewhere.

Browser upload previews an image in the viewer, but it does not write files into `assets/`. To persist uploaded images into the repository, use `assets/private/` and update `assets/manifest.json`, or add a small local import script/backend later.
