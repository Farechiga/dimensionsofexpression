export const taxonomy = [
  {
    id: "visible-anatomy",
    title: "Visible Anatomy",
    source: "FACS / facial coding",
    description: "Observable facial and bodily cues before interpretation.",
    groups: [
      {
        label: "Brows and forehead",
        terms: ["inner brow raise", "outer brow raise", "brow knit", "brow compression", "asymmetrical brow", "forehead tension", "grief brow", "skeptical brow"]
      },
      {
        label: "Eyes and gaze",
        terms: ["soft gaze", "wide eyes", "squint", "wet eyes", "averted gaze", "direct gaze", "searching gaze", "faraway gaze", "darting gaze", "held eye contact"]
      },
      {
        label: "Mouth and jaw",
        terms: ["Duchenne smile", "social smile", "pressed smile", "half smile", "trembling lip", "lip press", "open mouth", "jaw clench", "jaw drop", "teeth display"]
      },
      {
        label: "Head and body",
        terms: ["head tilt", "chin lift", "chin tuck", "retreating posture", "leaning in", "braced shoulders", "open chest", "collapsed posture", "protective turn"]
      }
    ]
  },
  {
    id: "core-affect",
    title: "Core Affect",
    source: "Russell circumplex / PAD",
    description: "Low-level feeling tone that can be rated without naming a discrete emotion.",
    groups: [
      {
        label: "Valence",
        terms: ["pleasant", "unpleasant", "bittersweet", "ambivalent", "neutral", "wounded", "warmed", "soured", "relieved"]
      },
      {
        label: "Activation",
        terms: ["calm", "alert", "agitated", "startled", "frozen", "energized", "depleted", "simmering", "overwhelmed"]
      },
      {
        label: "Control",
        terms: ["dominant", "submissive", "in command", "unmoored", "helpless", "self-possessed", "yielding", "defiant", "composed"]
      }
    ]
  },
  {
    id: "emotion-blend",
    title: "Emotion Blend",
    source: "Basic emotion and high-dimensional emotion models",
    description: "Named emotions and blended categories that can coexist in one expression.",
    groups: [
      {
        label: "Affiliative and positive",
        terms: ["joy", "tenderness", "affection", "admiration", "gratitude", "pride", "hope", "relief", "awe", "amusement", "satisfaction"]
      },
      {
        label: "Pain and vulnerability",
        terms: ["sadness", "grief", "longing", "shame", "embarrassment", "hurt", "regret", "nostalgia", "empathic pain", "disappointment"]
      },
      {
        label: "Threat and defense",
        terms: ["fear", "anxiety", "anger", "irritation", "resentment", "contempt", "disgust", "suspicion", "defiance", "alarm"]
      },
      {
        label: "Cognitive-social states",
        terms: ["confusion", "recognition", "realization", "uncertainty", "awkwardness", "interest", "surprise", "acceptance", "resignation"]
      }
    ]
  },
  {
    id: "appraisal",
    title: "Appraisal",
    source: "Scherer / Lazarus appraisal theory",
    description: "What the character seems to be evaluating about the situation.",
    groups: [
      {
        label: "Event meaning",
        terms: ["novel", "familiar", "expected", "unexpected", "important", "trivial", "irreversible", "repairable", "threatening", "promising"]
      },
      {
        label: "Goal relation",
        terms: ["goal opening", "goal blocked", "loss confirmed", "hope restored", "obligation activated", "choice narrowing", "choice expanding", "cost recognized"]
      },
      {
        label: "Agency and blame",
        terms: ["self-caused", "other-caused", "shared responsibility", "fate-driven", "earned", "undeserved", "forgiven", "accused", "witnessing"]
      },
      {
        label: "Coping and certainty",
        terms: ["can cope", "cannot cope", "uncertain outcome", "certainty arriving", "bracing", "surrendering", "reframing", "accepting"]
      }
    ]
  },
  {
    id: "social-display",
    title: "Social Display",
    source: "Display rules / impression management",
    description: "How the expression manages other people, norms, and social risk.",
    groups: [
      {
        label: "Masking and leakage",
        terms: ["masked pain", "feigned smile", "polite smile", "leaking anger", "suppressed tears", "strained graciousness", "cheerful cover", "controlled face"]
      },
      {
        label: "Relational stance",
        terms: ["inviting", "appeasing", "reassuring", "withholding", "defensive", "challenging", "protective", "submissive", "commanding", "pleading"]
      },
      {
        label: "Audience orientation",
        terms: ["performing for group", "private break", "seeking approval", "saving face", "avoiding burden", "offering comfort", "testing safety", "keeping peace"]
      }
    ]
  },
  {
    id: "temporal-narrative",
    title: "Temporal and Narrative Meaning",
    source: "Narrative analysis / appraisal over time",
    description: "Whether the face is carrying memory, present reaction, anticipation, or a beat change.",
    groups: [
      {
        label: "Time direction",
        terms: ["past wound", "present recognition", "future hope", "future dread", "memory surfacing", "anticipation", "aftershock", "turning point"]
      },
      {
        label: "Change process",
        terms: ["melting", "hardening", "cracking", "softening", "realizing", "recovering", "withdrawing", "opening", "bracing", "letting go"]
      },
      {
        label: "Narrative function",
        terms: ["reversal", "reconciliation", "confession", "farewell", "discovery", "betrayal absorbed", "forgiveness offered", "burden hidden"]
      }
    ]
  },
  {
    id: "acting-intention",
    title: "Acting Intention",
    source: "Stanislavski-derived acting vocabulary",
    description: "The playable objective, obstacle, and subtext inside the expression.",
    groups: [
      {
        label: "Objective",
        terms: ["to comfort", "to persuade", "to hide", "to protect", "to invite", "to resist", "to confess", "to endure", "to reassure", "to test"]
      },
      {
        label: "Obstacle",
        terms: ["fear of rejection", "public scrutiny", "old wound", "guilt", "anger", "shame", "power imbalance", "conflicting loyalty", "uncertainty"]
      },
      {
        label: "Subtext",
        terms: ["please do not see this", "I need you to believe me", "I am happy and hurting", "I cannot say what I feel", "this changes everything", "I am trying to be kind"]
      }
    ]
  },
  {
    id: "embodiment",
    title: "Embodiment and Effort",
    source: "Laban movement analysis",
    description: "Movement quality implied by the face and pose.",
    groups: [
      {
        label: "Effort factors",
        terms: ["direct", "indirect", "strong", "light", "sudden", "sustained", "bound", "free"]
      },
      {
        label: "Effort actions",
        terms: ["float", "glide", "dab", "flick", "punch", "slash", "press", "wring"]
      },
      {
        label: "Felt body state",
        terms: ["held breath", "released breath", "tightened", "expanded", "collapsed", "lifted", "rooted", "unsteady", "buoyant"]
      }
    ]
  },
  {
    id: "animation-readability",
    title: "Animation Readability",
    source: "Disney animation principles / performance animation",
    description: "How the frame stages and clarifies emotion for a viewer.",
    groups: [
      {
        label: "Readability tools",
        terms: ["staging", "exaggeration", "appeal", "silhouette clarity", "contrast", "asymmetry", "held pose", "anticipation", "secondary action"]
      },
      {
        label: "Design emphasis",
        terms: ["eyes carry meaning", "mouth contradicts eyes", "brow leads emotion", "pose supports face", "lighting softens", "composition isolates", "gesture reveals"]
      }
    ]
  }
];

export const literatureNotes = [
  "FACS keeps visible movement separate from interpretation by coding action units.",
  "Russell and PAD models support continuous valence, arousal, and dominance/control ratings.",
  "Appraisal theories describe emotion as evaluation of novelty, goal relevance, agency, coping, and norm fit.",
  "Display-rule research helps name masking, intensifying, suppressing, and socially managed expressions.",
  "Laban and acting vocabularies help translate static expressions into playable intention, obstacle, and embodied effort.",
  "Animation principles help explain why a freeze frame is readable: staging, exaggeration, contrast, and appeal."
];
