export const taxonomy = [
  {
    id: "emotion-wheel",
    title: "Emotions",
    source: "Emotion vocabulary",
    description: "Broad affect umbrellas with more specific feeling words.",
    groups: [
      {
        label: "Happy",
        terms: ["playful", "cheeky", "content", "free", "joyful", "interested", "curious", "inquisitive", "proud", "successful", "confident", "accepted", "respected", "valued", "powerful", "courageous", "creative", "peaceful", "loving", "thankful", "trusting", "sensitive", "close", "optimistic", "hopeful", "inspired"]
      },
      {
        label: "Sad",
        terms: ["lonely", "isolated", "abandoned", "vulnerable", "victimized", "fragile", "despair", "grief", "powerless", "guilty", "ashamed", "remorseful", "depressed", "empty", "inferior", "hurt", "disappointed", "embarrassed", "wistful", "yearning", "forlorn", "wronged"]
      },
      {
        label: "Disgusted",
        terms: ["repelled", "hesitant", "horrified", "awful", "detestable", "nauseated", "disappointed", "revolted", "appalled", "disapproving", "judgmental", "embarrassed", "distant", "withdrawn", "numb", "critical", "skeptical", "dismissive"]
      },
      {
        label: "Angry",
        terms: ["let down", "betrayed", "resentful", "humiliated", "disrespected", "ridiculed", "bitter", "indignant", "violated", "mad", "furious", "jealous", "aggressive", "provoked", "hostile", "frustrated", "infuriated", "annoyed"]
      },
      {
        label: "Fearful",
        terms: ["scared", "helpless", "frightened", "anxious", "overwhelmed", "worried", "insecure", "inadequate", "inferior", "weak", "worthless", "insignificant", "rejected", "excluded", "persecuted", "threatened", "nervous", "exposed"]
      },
      {
        label: "Uncomfortable",
        terms: ["bored", "indifferent", "apathetic", "busy", "pressured", "rushed", "stressed", "overwhelmed", "out of control", "tired", "sleepy", "unfocused"]
      },
      {
        label: "Surprised",
        terms: ["startled", "shocked", "dismayed", "confused", "disillusioned", "perplexed", "amazed", "astonished", "awe", "excited", "eager", "energetic"]
      },
      {
        label: "Care",
        terms: ["compassionate", "tender", "protective", "affectionate", "attuned", "nurturing", "devoted", "forgiving", "grateful", "longing", "concerned", "mournful care", "loyal", "gentle", "emotionally present"]
      }
    ]
  },
  {
    id: "state-bearing",
    title: "State and Bearing",
    source: "Performance state vocabulary",
    description: "Overall state, bearing, and presentation that can be external, internal, or mixed.",
    groups: [
      {
        label: "Composure",
        terms: ["poised", "composed", "collected", "steady", "self-possessed", "controlled", "formal", "gracious", "contained", "polished", "serene", "unruffled", "measured", "resolved", "dignified", "brittle", "diplomatic", "professional", "self-monitoring", "ceremonious", "stoic", "deliberate", "restrained", "watchful", "quietly resolute"]
      },
      {
        label: "Agitation",
        terms: ["harried", "frazzled", "rattled", "flustered", "frantic", "keyed up", "strained", "overextended", "restless", "jittery", "panicked", "pressured", "rushed", "scattered", "overloaded", "frayed", "bristling", "twitchy", "breathless", "short-fused", "shakily contained", "overclocked", "simmering", "fraying", "vibrating with tension"]
      },
      {
        label: "Dysregulated",
        terms: ["paranoid", "spooked", "jittery", "absent-minded", "lost in thought", "haunted", "dissociated", "unsettled", "skittish", "overstimulated", "disoriented", "on edge", "checked out", "preoccupied", "ungrounded", "flooded", "spiraling", "shut down", "numbed", "scrambled", "emotionally overloaded", "dissociating", "unmoored", "stunned", "unable to organize thought"]
      },
      {
        label: "Postural state",
        terms: ["slumped", "upright", "braced", "collapsed", "lifted", "hunched", "guarded", "open", "withdrawn", "leaning in", "leaning away", "stiff", "loose", "rooted", "unsteady", "recoiled", "folded inward", "squared up", "half-turned", "suspended", "poised to move", "shrinking", "presenting", "shielding", "reaching", "rooted in place", "interrupted mid-motion"]
      },
      {
        label: "Energy state",
        terms: ["buoyant", "drained", "depleted", "charged", "alert", "dulled", "sleepy", "wired", "heavy", "light", "frozen", "fluid", "activated", "subdued", "sparked", "vigilant", "spent", "tremulous", "gathered", "low-burning", "collapsing", "reviving", "suspended", "heavy-limbed", "sparking back to life"]
      }
    ]
  },
  {
    id: "core-affect",
    title: "Affect",
    source: "Russell circumplex / PAD / narrative change",
    description: "Low-level feeling tone, bodily quality, and affective change process.",
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
      },
      {
        label: "Felt body state",
        terms: ["held breath", "released breath", "tightened", "expanded", "collapsed", "lifted", "rooted", "unsteady", "buoyant"]
      },
      {
        label: "Change process",
        terms: ["melting", "hardening", "cracking", "softening", "realizing", "recovering", "withdrawing", "opening", "bracing", "letting go"]
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
        label: "Time direction",
        terms: ["past wound", "present recognition", "future hope", "future dread", "memory surfacing", "anticipation", "aftershock", "turning point"]
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
      },
      {
        label: "Stakes",
        terms: ["trivial", "inconvenience", "consequential", "escalating", "contained", "temporary", "reparable", "irreversible", "preventable", "inevitable", "identity-shaping", "relationship-altering", "life-changing", "sacred or value-laden"]
      },
      {
        label: "Moral assessment",
        terms: ["fair", "unfair", "deserved", "undeserved", "compassionate", "cruel", "violating", "honorable", "shameful", "innocent", "boundary crossed", "promise broken", "obligation unmet", "mercy received", "responsibility claimed"]
      },
      {
        label: "Relational meaning",
        terms: ["safe", "unsafe", "trusted", "betrayed", "seen", "misunderstood", "believed", "dismissed", "welcomed", "excluded", "protected", "abandoned", "forgiven", "accountable", "emotionally held"]
      }
    ]
  },
  {
    id: "social-display",
    title: "Social Display",
    source: "Display rules / impression management / acting objective",
    description: "How the expression manages other people, norms, objectives, and social risk.",
    groups: [
      {
        label: "Objective",
        terms: ["to comfort", "to persuade", "to hide", "to protect", "to invite", "to resist", "to confess", "to endure", "to reassure", "to test"]
      },
      {
        label: "Masking and leakage",
        terms: ["masked pain", "feigned smile", "polite smile", "leaking anger", "suppressed tears", "strained graciousness", "cheerful cover", "controlled face"]
      },
      {
        label: "Relational stance",
        terms: ["inviting", "appeasing", "reassuring", "compromising", "forbearance", "contrite", "deferential", "reverent", "sorry", "apologetic", "withholding", "defensive", "challenging", "protective", "submissive", "commanding", "pleading"]
      },
      {
        label: "Audience orientation",
        terms: ["performing for group", "private break", "seeking approval", "saving face", "avoiding burden", "offering comfort", "testing safety", "keeping peace"]
      }
    ]
  }
];

export const literatureNotes = [
  "FACS keeps visible movement separate from interpretation by coding action units.",
  "Russell and PAD models support continuous valence, activation, and dominance/control ratings.",
  "Appraisal theories describe emotion as evaluation of novelty, goal relevance, agency, coping, and norm fit.",
  "Display-rule research helps name masking, intensifying, suppressing, and socially managed expressions.",
  "Acting and embodied vocabularies help translate static expressions into playable intention and felt state."
];
