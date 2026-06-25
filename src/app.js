import { taxonomy } from "./taxonomy.js?v=1.0.1";

const taxonomyOrder = [
  "emotion-wheel",
  "state-bearing",
  "core-affect",
  "appraisal",
  "social-display"
];
const orderedTaxonomy = taxonomyOrder
  .map((id) => taxonomy.find((category) => category.id === id))
  .filter(Boolean);

const modules = [
  { id: "image", label: "Image", isComplete: (draft) => Boolean(draft.imageName) },
  { id: "vocabulary", label: "Vocabulary", isComplete: (draft) => draft.externalTerms?.length > 0 || draft.internalTerms?.length > 0 },
  {
    id: "emotion",
    label: "Emotion",
    isComplete: (draft) => Object.keys(draft.blend || {}).length > 0 || Object.keys(draft.whatJustHappened || {}).length > 0
  },
  { id: "signals", label: "Features Activated", isComplete: (draft) => hasNonDefault(draft.signals, 0) || Object.keys(draft.signalDescriptors || {}).length > 0 },
  { id: "interpret", label: "Interpret", isComplete: (draft) => Boolean(draft.name && draft.name !== "Untitled reading" && draft.subtext && draft.evidence) },
  { id: "compare", label: "Compare", isComplete: (draft) => draft.savedReadings > 0 }
];

const signalAttributes = [
  {
    name: "Brows",
    terms: ["furrowed", "knitted", "pinched", "raised inner brows", "raised in delight", "raised in surprise", "arched", "skeptical", "pleading", "alarmed", "brooding", "compressed", "tilted", "softened", "asymmetrical", "drawn together", "lifted in worry"]
  },
  {
    name: "Eyes",
    terms: ["wide", "glassy", "wet", "searching", "guarded", "soft", "hollow", "alert", "startled", "focused", "unfocused", "narrowed", "pleading", "watchful", "faraway"]
  },
  {
    name: "Gaze",
    terms: ["direct", "averted", "downcast", "sideward", "fixed", "flickering", "approaching", "withdrawing", "measuring", "exposed", "deflecting", "locked in", "looking through", "seeking safety", "performing contact"]
  },
  {
    name: "Mouth",
    terms: ["pressed", "parted", "tensed smile", "soft smile", "half smile", "held smile", "trembling", "flattened", "strained", "open in shock", "bitten lip", "downturned", "tight corners", "polite smile", "suppressed speech"]
  },
  {
    name: "Jaw",
    terms: ["clenched", "slack", "braced", "dropped", "set", "tight", "controlled", "quivering", "held back", "jutting", "swallowing emotion", "locked", "released", "stiffened", "restrained"]
  },
  {
    name: "Cheeks and nose",
    terms: ["lifted cheeks", "flushed", "tight cheeks", "slack cheeks", "wrinkled nose", "softened cheeks", "strained nasolabial fold", "tearful fullness", "smiling cheeks", "suppressed disgust", "compressed midface", "warmed", "drained", "tense nostrils", "flared nostrils", "micro-flinch"]
  },
  {
    name: "Head and posture",
    terms: ["chin lifted", "chin tucked", "head tilted", "head withdrawn", "leaning in", "leaning away", "braced shoulders", "open posture", "collapsed posture", "held still", "turning away", "offering", "protective", "formal", "unsteady"]
  }
];

const emotionFamilies = [
  {
    name: "Anger",
    defaults: ["Angry", "Exasperated"],
    terms: ["Angry", "Irritable", "Annoyed", "Aggravated", "Envy", "Resentful", "Jealous", "Disgust", "Contempt", "Revolted", "Exasperated", "Frustrated", "Agitated", "Rage", "Hostile", "Hate"]
  },
  {
    name: "Sadness",
    defaults: ["Sad", "Depressed"],
    terms: ["Sad", "Suffering", "Agony", "Hurt", "Depressed", "Sorrow", "Disappointed", "Dismayed", "Displeased", "Shameful", "Regretful", "Guilty", "Neglected", "Isolated", "Lonely", "Despair", "Grief", "Powerless"]
  },
  {
    name: "Surprise",
    defaults: ["Dismayed", "Surprised"],
    terms: ["Surprised", "Stunned", "Shocked", "Confused", "Dismayed", "Disillusioned", "Amazed", "Perplexed", "Astonished", "Overcome", "Awe-struck", "Speechless", "Moved", "Astounded", "Stimulated", "Touched"]
  },
  {
    name: "Joy",
    defaults: ["Delighted", "Excited"],
    terms: ["Joyful", "Content", "Pleased", "Satisfied", "Amused", "Happy", "Jovial", "Delighted", "Cheerful", "Blissful", "Triumphant", "Proud", "Illustrious", "Eager", "Optimistic", "Hopeful", "Excited", "Enthusiastic", "Zeal", "Euphoric", "Elation", "Jubilation", "Enchanted"]
  },
  {
    name: "Fear",
    defaults: ["Frightened", "Anxious"],
    terms: ["Fearful", "Scared", "Frightened", "Helpless", "Terror", "Panic", "Hysterical", "Insecure", "Inferior", "Inadequate", "Nervous", "Worried", "Anxious", "Horror", "Mortified", "Dread"]
  }
];
const whatJustHappenedDimensions = [
  {
    name: "What changed?",
    defaultTerm: "new possibility opened",
    terms: [
      "new possibility opened",
      "belief overturned",
      "hidden information surfaced",
      "choice narrowed",
      "choice expanded",
      "identity or status shifted",
      "expectation failed",
      "threat appeared",
      "harm witnessed",
      "internalizing loss",
      "betrayal or boundary violation",
      "connection strengthened"
    ]
  },
  {
    name: "Emotional leakage",
    defaultTerm: "mixed signal",
    terms: [
      "fully masked",
      "controlled surface",
      "faint leakage",
      "mixed signal",
      "visible strain",
      "emotion breaking through",
      "involuntary flash",
      "delayed reaction",
      "overcorrection",
      "openly expressed",
      "emotion flooding",
      "mask collapsing"
    ]
  },
  {
    name: "Certainty",
    defaultTerm: "undecided",
    terms: [
      "undecided",
      "wondering",
      "doubtful",
      "suspicious",
      "wavering",
      "conflicted",
      "testing",
      "cautiously considering",
      "reluctantly convinced",
      "settling",
      "dawning realization",
      "certain",
      "adamant",
      "entrenched",
      "bullheaded"
    ]
  },
  {
    name: "Engagement",
    defaultTerm: "observing",
    terms: [
      "disengaged",
      "checked out",
      "withdrawn",
      "distant",
      "observing",
      "monitoring",
      "cautiously attentive",
      "considering",
      "curious",
      "attentive",
      "absorbed",
      "compelled",
      "fully engaged"
    ]
  },
  {
    name: "Openness",
    defaultTerm: "cautious",
    terms: [
      "sealed off",
      "guarded",
      "cautious",
      "withholding",
      "reserved",
      "ambivalent",
      "tentative",
      "receptive",
      "softening",
      "vulnerable",
      "inviting"
    ]
  },
  {
    name: "Social orientation",
    defaultTerm: "monitoring others",
    terms: [
      "self-protective",
      "inward-focused",
      "private processing",
      "guarded contact",
      "monitoring others",
      "seeking safety",
      "testing connection",
      "seeking approval",
      "receptive",
      "affiliative",
      "offering support",
      "other-directed",
      "group-oriented"
    ]
  }
];
const emotionFamilyAliases = {
  angry: "Anger",
  disgusted: "Anger",
  uncomfortable: "Fear",
  fearful: "Fear",
  unsure: "Fear",
  sad: "Sadness",
  weary: "Sadness",
  surprised: "Surprise",
  happy: "Joy"
};
const radarColors = ["#246a73", "#bd5d4e", "#7a6fa5", "#c99a2e", "#577a4a", "#9a5573"];

const readingsDatabasePath = "./data/readings.json";

function sortedEntries(values = {}, transform = (value) => value) {
  return Object.fromEntries(
    Object.entries(values)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => [key, transform(value)])
  );
}

function readingFingerprint(reading = {}) {
  return JSON.stringify({
    imageId: reading.imageId || "",
    imageName: reading.imageName || "",
    name: reading.name === "Untitled reading" ? "" : (reading.name || ""),
    subtext: reading.subtext || "",
    evidence: reading.evidence || "",
    externalTerms: [...(reading.externalTerms || [])].sort(),
    internalTerms: [...(reading.internalTerms || [])].sort(),
    blend: sortedEntries(reading.blend, (value) => Number(value) || 0),
    whatJustHappened: sortedEntries(reading.whatJustHappened, (value) => ({
      term: value?.term || "",
      intensity: Number(value?.intensity) || 0
    })),
    signals: sortedEntries(reading.signals, (value) => Number(value) || 0),
    signalDescriptors: sortedEntries(
      reading.signalDescriptors,
      (terms) => [...(terms || [])].sort()
    )
  });
}

function deduplicateReadings(readings = []) {
  const fingerprints = new Set();
  return readings.filter((reading) => {
    const fingerprint = readingFingerprint(reading);
    if (fingerprints.has(fingerprint)) return false;
    fingerprints.add(fingerprint);
    return true;
  });
}

function loadSavedReadings() {
  try {
    const saved = window.localStorage?.getItem("expressionReadings");
    const parsed = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(parsed)) return [];
    const uniqueReadings = deduplicateReadings(parsed);
    if (uniqueReadings.length !== parsed.length) {
      window.localStorage?.setItem("expressionReadings", JSON.stringify(uniqueReadings));
    }
    return uniqueReadings;
  } catch {
    return [];
  }
}

const state = {
  step: 0,
  readings: loadSavedReadings(),
  databaseReadings: [],
  assets: [],
  currentImage: null,
  taxonomyIndex: 0,
  taxonomyGroupIndex: 0,
  termsByBin: {
    external: new Set(),
    internal: new Set()
  },
  writeInBin: null,
  generatedCount: 0,
  imageIndex: 0,
  generatedImages: [],
  characterFilter: "all",
  dashboardReadingId: "",
  lastSavedSignature: "",
  searchSelection: null,
  searchDestination: "",
  searchResults: [],
  searchActiveIndex: -1
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const slug = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const categoryLabels = {
  "emotion-wheel": "Emotions",
  "core-affect": "Affect",
  "social-display": "Social",
  "state-bearing": "State"
};

function buildSearchIndex() {
  const items = [];
  taxonomy.forEach((category) => {
    category.groups.forEach((group) => {
      group.terms.forEach((term) => {
        items.push({
          id: `vocabulary-${slug(category.id)}-${slug(group.label)}-${slug(term)}`,
          type: "vocabulary",
          term,
          context: `${categoryLabels[category.id] || category.title} / ${group.label}`,
          fullTerm: `${category.title}: ${group.label}: ${term}`
        });
      });
    });
  });
  signalAttributes.forEach((feature) => {
    feature.terms.forEach((term) => {
      items.push({
        id: `feature-${slug(feature.name)}-${slug(term)}`,
        type: "feature",
        term,
        context: `Features Activated / ${feature.name}`,
        featureName: feature.name
      });
    });
  });
  emotionFamilies.forEach((family) => {
    family.terms.forEach((term) => {
      items.push({
        id: `emotion-${slug(family.name)}-${slug(term)}`,
        type: "emotion",
        term,
        context: `Emotion / ${family.name}`,
        familyName: family.name
      });
    });
  });
  whatJustHappenedDimensions.forEach((dimension) => {
    dimension.terms.forEach((term) => {
      items.push({
        id: `event-${slug(dimension.name)}-${slug(term)}`,
        type: "event",
        term,
        context: `What just happened / ${dimension.name}`,
        dimensionName: dimension.name
      });
    });
  });
  return items;
}

const taxonomySearchIndex = buildSearchIndex();

function hasNonDefault(values = {}, defaultValue) {
  return Object.values(values).some((value) => Number(value) !== defaultValue);
}

async function loadAssetManifest() {
  try {
    const response = await fetch("./assets/manifest.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Manifest unavailable");
    const manifest = await response.json();
    state.assets = Array.isArray(manifest.images) ? manifest.images : [];
  } catch {
    state.assets = [];
  }
  renderCharacterFilter();
  renderAssetLibrary();
}

async function loadReadingDatabase() {
  try {
    const response = await fetch(readingsDatabasePath, { cache: "no-store" });
    if (!response.ok) throw new Error("Readings database unavailable");
    const database = await response.json();
    state.databaseReadings = Array.isArray(database.readings)
      ? database.readings.map(normalizeSavedReading)
      : [];
  } catch {
    state.databaseReadings = [];
  }
}

function assetTitle(asset) {
  return asset?.title || asset?.id || asset?.src?.split("/").pop() || "Untitled frame";
}

function assetFileName(asset) {
  return decodeURIComponent(asset?.src?.split("/").pop() || assetTitle(asset));
}

function assetCharacter(asset) {
  const baseName = assetFileName(asset).replace(/\.[^.]+$/, "").trim();
  const underscoreIndex = baseName.indexOf("_");
  const rawName = underscoreIndex > 0 ? baseName.slice(0, underscoreIndex).trim() : baseName.split(/\s+/)[0] || "Unknown";
  return normalizeCharacterName(rawName);
}

function normalizeCharacterName(name) {
  const fixes = {
    Cinderalla: "Cinderella",
    Mirable: "Mirabel"
  };
  return fixes[name] || name;
}

function characterOptions() {
  return Array.from(new Set(state.assets.map(assetCharacter))).filter(Boolean).sort((a, b) => a.localeCompare(b));
}

function renderCharacterFilter() {
  const select = $("#characterFilter");
  if (!select) return;
  const characters = characterOptions();
  select.innerHTML = [
    `<option value="all">All characters</option>`,
    ...characters.map((character) => `<option value="${escapeHtml(character)}">${escapeHtml(character)}</option>`)
  ].join("");
  select.value = characters.includes(state.characterFilter) ? state.characterFilter : "all";
  state.characterFilter = select.value;
}

function allReadings() {
  return [...state.readings, ...state.databaseReadings];
}

function getImageReadings(image = state.currentImage) {
  if (!image) return [];
  return allReadings().filter((reading) => reading.imageId === image.id || reading.imageName === image.name || reading.imageName === image.title);
}

function getLatestReading(image = state.currentImage) {
  return getImageReadings(image)[0] || null;
}

function moduleStatus(draft = currentDraft()) {
  return modules.map((module) => ({
    ...module,
    complete: module.isComplete(draft)
  }));
}

function renderAssetLibrary() {
  if (!$("#assetLibrary") || !$("#assetCount")) return;
  const builtIns = [
    {
      id: "generated-face",
      title: "Expression set",
      src: "",
      rightsMode: "generated-demo",
      notes: "Use arrows until a face is worth coding."
    }
  ];
  const allAssets = [...builtIns, ...state.assets];
  $("#assetCount").textContent = `${allAssets.length} frame${allAssets.length === 1 ? "" : "s"}`;
  $("#assetLibrary").innerHTML = allAssets.map((asset) => {
    const readings = getImageReadings({ id: asset.id, name: asset.title, title: asset.title });
    const selected = state.currentImage?.id === asset.id;
    return `
      <button class="asset-card${selected ? " is-selected" : ""}" type="button" data-asset-id="${escapeHtml(asset.id)}">
        <span class="asset-thumb">${asset.src ? `<img src="${escapeHtml(asset.src)}" alt="">` : "demo"}</span>
        <span class="asset-meta">
          <strong>${escapeHtml(assetTitle(asset))}</strong>
          <small>${escapeHtml(asset.rightsMode || "local-study")} · ${readings.length} reading${readings.length === 1 ? "" : "s"}</small>
        </span>
      </button>
    `;
  }).join("");

  $$(".asset-card").forEach((button) => {
    button.addEventListener("click", () => {
      const asset = allAssets.find((item) => item.id === button.dataset.assetId);
      if (asset) selectAsset(asset);
    });
  });
}

function renderModuleChecklist() {
  const status = moduleStatus();
  const complete = status.filter((module) => module.complete).length;
  $("#moduleChecklist").innerHTML = status.map((module) => `
    <span class="progress-dot${module.complete ? " is-complete" : ""}" title="${escapeHtml(module.label)}"></span>
  `).join("");
}

function setCurrentImage(image) {
  state.currentImage = image;
  renderAssetLibrary();
  renderReadings();
  renderDashboard();
  renderModuleChecklist();
}

function clearCurrentSelections() {
  state.termsByBin.external.clear();
  state.termsByBin.internal.clear();
  state.lastSavedSignature = "";
  $("#readingForm").reset();
  renderBins();
  buildTaxonomy();
  bindSliders();
  renderModuleChecklist();
}

function hasUnsavedSelections() {
  const draft = collectDraftFields();
  const hasContent = Boolean(
    draft.externalTerms.length ||
    draft.internalTerms.length ||
    Object.keys(draft.blend).length ||
    Object.keys(draft.whatJustHappened).length ||
    hasNonDefault(draft.signals, 0) ||
    Object.keys(draft.signalDescriptors).length ||
    draft.name ||
    draft.subtext ||
    draft.evidence
  );
  return hasContent && readingFingerprint(draft) !== state.lastSavedSignature;
}

function confirmImageChange() {
  if (!hasUnsavedSelections()) return true;
  return window.confirm("Are you sure? Your selections will be lost.");
}

function allBrowsableImages() {
  if (!state.assets.length) return state.generatedImages;
  if (state.characterFilter === "all") return state.assets;
  const filtered = state.assets.filter((asset) => assetCharacter(asset) === state.characterFilter);
  return filtered.length ? filtered : state.assets;
}

function ensureGeneratedImages(count = 8) {
  while (state.generatedImages.length < count) {
    state.generatedCount += 1;
    const id = `generated-expression-${state.generatedCount}`;
    state.generatedImages.push({
      id,
      title: `Generated expression ${state.generatedCount}`,
      name: id,
      src: generatedFace(9000 + state.generatedCount * 97, state.generatedCount),
      rightsMode: "generated-demo"
    });
  }
}

function showImageAt(index) {
  const images = allBrowsableImages();
  if (!images.length) return;
  state.imageIndex = (index + images.length) % images.length;
  const image = images[state.imageIndex];
  $("#previewImage").src = image.src;
  $("#previewImage").alt = assetTitle(image);
  $("#previewImage").dataset.id = image.id;
  $("#previewImage").dataset.name = assetTitle(image);
  $("#imageStage").classList.add("has-image");
  setCurrentImage(image);
}

function changeImage(delta) {
  if (!confirmImageChange()) return;
  if (!state.assets.length) ensureGeneratedImages();
  clearCurrentSelections();
  showImageAt(state.imageIndex + delta);
}

function sliderRow(name, options = {}) {
  const min = options.min ?? 0;
  const max = options.max ?? 100;
  const value = options.value ?? 0;
  const label = Array.isArray(name) ? `${name[0]} / ${name[1]}` : name;
  const id = slug(label);
  const left = Array.isArray(name) ? name[0] : "Low";
  const right = Array.isArray(name) ? name[1] : "High";
  return `
    <div class="slider-row">
      <div class="slider-meta">
        <strong>${label}</strong>
        <span data-output="${id}">${value}</span>
      </div>
      <input id="${id}" name="${id}" type="range" min="${min}" max="${max}" value="${value}" data-slider>
      <div class="axis-labels"><span>${left}</span><span>${right}</span></div>
    </div>
  `;
}

function buildSliders() {
  $("#signalSliders").innerHTML = signalAttributes.map((attribute) => {
    const id = slug(attribute.name);
    return `
      <article class="feature-row">
        <div class="feature-control">
          <div class="feature-heading">
            <strong>${escapeHtml(attribute.name)}</strong>
            <span data-output="${id}">0</span>
          </div>
          <input id="${id}" name="${id}" type="range" min="0" max="100" value="0" data-slider>
        </div>
        <div class="descriptor-list">
          ${attribute.terms.map((term) => `
            <label class="descriptor-chip">
              <input type="checkbox" name="signalDescriptor" value="${escapeHtml(`${attribute.name}: ${term}`)}">
              <span>${escapeHtml(term)}</span>
            </label>
          `).join("")}
        </div>
      </article>
    `;
  }).join("");
  $("#emotionBlend").innerHTML = emotionFamilies.flatMap((family, familyIndex) => (
    family.defaults.map((defaultTerm, slotIndex) => {
      const id = `emotion-slot-${familyIndex}-${slotIndex}`;
      return `
        <div class="blend-chip" data-emotion-family="${escapeHtml(family.name)}">
          <label for="${id}">
            <span class="emotion-family">${escapeHtml(family.name)}</span>
            <span data-output="${id}">0</span>
          </label>
          <select class="emotion-term-select" aria-label="${escapeHtml(`${family.name} emotion ${slotIndex + 1}`)}">
            ${family.terms.map((term) => `
              <option value="${escapeHtml(term)}"${term === defaultTerm ? " selected" : ""}>${escapeHtml(term)}</option>
            `).join("")}
          </select>
          <input id="${id}" name="${id}" type="range" min="0" max="100" value="0" data-slider>
        </div>
      `;
    })
  )).join("");
  $("#whatJustHappened").innerHTML = whatJustHappenedDimensions.map((dimension, index) => {
    const id = `event-dimension-${index}`;
    return `
      <div class="event-chip">
        <label for="${id}">
          <span>${escapeHtml(dimension.name)}</span>
          <span data-output="${id}">0</span>
        </label>
        <select class="event-term-select" aria-label="${escapeHtml(dimension.name)}">
          ${dimension.terms.map((term) => `
            <option value="${escapeHtml(term)}"${term === dimension.defaultTerm ? " selected" : ""}>${escapeHtml(term)}</option>
          `).join("")}
        </select>
        <input id="${id}" name="${id}" type="range" min="0" max="100" value="0" data-slider>
      </div>
    `;
  }).join("");
}

function buildTaxonomy() {
  $("#taxonomyTabs").innerHTML = orderedTaxonomy.map((category, index) => `
    <button class="taxonomy-tab${index === state.taxonomyIndex ? " is-active" : ""}" type="button" data-taxonomy-index="${index}" title="${escapeHtml(category.title)}">
      ${escapeHtml(categoryLabels[category.id] || category.title)}
    </button>
  `).join("");

  const category = orderedTaxonomy[state.taxonomyIndex] || orderedTaxonomy[0];
  const activeGroup = category.groups[state.taxonomyGroupIndex] || category.groups[0];
  $("#taxonomyGrid").innerHTML = `
    <article class="taxonomy-card">
      <header>
        <strong>${escapeHtml(category.title)}</strong>
        <small>${escapeHtml(category.source)}</small>
      </header>
      <div class="taxonomy-subtabs">
        ${category.groups.map((group, index) => `
          <button class="taxonomy-subtab${group === activeGroup ? " is-active" : ""}" type="button" data-taxonomy-group-index="${index}">
            ${escapeHtml(group.label)}
          </button>
        `).join("")}
      </div>
      <div class="taxonomy-groups">
        <div class="term-group">
          <div class="term-list">
            ${activeGroup.terms.map((term) => `
              <span class="term-chip${termBin(`${category.title}: ${activeGroup.label}: ${term}`) ? " is-assigned" : ""}" draggable="true" data-term="${escapeHtml(`${category.title}: ${activeGroup.label}: ${term}`)}">
                <span>${escapeHtml(term)}</span>
                <button type="button" data-assign="external">Ext</button>
                <button type="button" data-assign="internal">Int</button>
              </span>
            `).join("")}
          </div>
        </div>
      </div>
    </article>
  `;

  $$(".taxonomy-tab").forEach((button) => {
    button.addEventListener("click", () => {
      state.taxonomyIndex = Number(button.dataset.taxonomyIndex);
      state.taxonomyGroupIndex = 0;
      buildTaxonomy();
    });
  });
  $$(".taxonomy-subtab").forEach((button) => {
    button.addEventListener("click", () => {
      state.taxonomyGroupIndex = Number(button.dataset.taxonomyGroupIndex);
      buildTaxonomy();
    });
  });
  renderBins();
}

function bindSliders() {
  $$("[data-slider]").forEach((slider) => {
    slider.addEventListener("input", () => {
      const output = document.querySelector(`[data-output="${slider.id}"]`);
      if (output) output.textContent = slider.value;
      renderModuleChecklist();
    });
  });
  $$("input[name='signalDescriptor']").forEach((input) => {
    input.addEventListener("change", renderModuleChecklist);
  });
  $$(".emotion-term-select").forEach((select) => {
    select.addEventListener("change", renderModuleChecklist);
  });
  $$(".event-term-select").forEach((select) => {
    select.addEventListener("change", renderModuleChecklist);
  });
}

function collectEmotionBlend() {
  const blend = {};
  $$(".blend-chip").forEach((chip) => {
    const label = chip.querySelector(".emotion-term-select")?.value;
    const value = Number(chip.querySelector("input[type='range']")?.value || 0);
    if (label && value > 0) blend[label] = Math.max(blend[label] || 0, value);
  });
  return blend;
}

function collectWhatJustHappened() {
  const dimensions = {};
  $$(".event-chip").forEach((chip) => {
    const name = chip.querySelector("label span")?.textContent?.trim();
    const term = chip.querySelector(".event-term-select")?.value;
    const intensity = Number(chip.querySelector("input[type='range']")?.value || 0);
    if (name && term && intensity > 0) {
      dimensions[name] = { term, intensity };
    }
  });
  return dimensions;
}

function setStep(nextStep) {
  state.step = Math.max(0, Math.min(5, nextStep));
  $$(".step").forEach((button) => button.classList.toggle("is-active", Number(button.dataset.step) === state.step));
  $$(".screen").forEach((screen) => screen.classList.toggle("is-active", Number(screen.dataset.screen) === state.step));
  $("#backBtn").disabled = state.step === 0;
  $("#readingForm").classList.toggle("is-final", state.step === 5);
  $("#readingForm").classList.toggle("is-saveable", state.step >= 3);
  window.expressionDebug = {
    step: state.step,
    readings: state.readings.length,
    hasUnsavedSelections: hasUnsavedSelections()
  };
  renderReadings();
  renderDashboard();
  renderModuleChecklist();
}

function collectReading() {
  const signalValues = Object.fromEntries(signalAttributes.map((attribute) => {
    const id = slug(attribute.name);
    return [attribute.name, Number($(`#${id}`).value)];
  }));
  const signalDescriptors = collectSignalDescriptors();
  const blend = collectEmotionBlend();
  const whatJustHappened = collectWhatJustHappened();

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    imageId: state.currentImage?.id || $("#previewImage").dataset.id || "local-upload",
    imageName: $("#previewImage").dataset.name || "local upload or sample",
    name: $("#expressionName").value.trim() || "Untitled reading",
    subtext: $("#subtext").value.trim(),
    evidence: $("#evidence").value.trim(),
    externalTerms: Array.from(state.termsByBin.external),
    internalTerms: Array.from(state.termsByBin.internal),
    taxonomyTerms: [...state.termsByBin.external, ...state.termsByBin.internal],
    signals: signalValues,
    signalDescriptors,
    blend,
    whatJustHappened
  };
}

function saveReading(event) {
  event.preventDefault();
  const reading = collectReading();
  const fingerprint = readingFingerprint(reading);
  const existing = state.readings.find((candidate) => readingFingerprint(candidate) === fingerprint);

  if (!existing) {
    state.readings.unshift(reading);
  }
  state.lastSavedSignature = fingerprint;
  state.dashboardReadingId = existing?.id || reading.id;
  window.localStorage?.setItem("expressionReadings", JSON.stringify(state.readings));
  renderAssetLibrary();
  setStep(4);
}

function renderReadings() {
  const list = $("#readingList");
  if (!list) return;
  const imageReadings = getImageReadings();
  const imageName = assetTitle(state.currentImage);

  if (!imageReadings.length) {
    list.innerHTML = `<div class="reading-card"><h3>No readings for this image yet</h3><p>Save a reading for ${escapeHtml(imageName)} to compare interpretations of this frame.</p></div>`;
    $("#consensus").innerHTML = `<p class="empty-state">No additional assessment yet.</p>`;
    return;
  }

  list.innerHTML = imageReadings.map((reading) => {
    const topBlend = Object.entries(reading.blend)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
    return `
      <article class="reading-card">
        <h3>${escapeHtml(reading.name)}</h3>
        <p>${escapeHtml(reading.subtext || "No subtext entered yet.")}</p>
        <p class="reading-meta">${escapeHtml(reading.imageName || "Unknown frame")} · ${reading.externalTerms?.length || 0} external · ${reading.internalTerms?.length || 0} internal</p>
        <div class="mini-bars">
          ${topBlend.map(([label, value]) => miniBar(label, value)).join("") || "<p>No emotion blend values set.</p>"}
        </div>
      </article>
    `;
  }).join("");

  $("#consensus").innerHTML = consensusBars(imageReadings);
}

function miniBar(label, value) {
  return `
    <div class="mini-bar">
      <span>${escapeHtml(label)}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${value}%"></div></div>
      <span>${value}</span>
    </div>
  `;
}

function consensusBars(readings = getImageReadings()) {
  if (readings.length < 2) {
    return `<p class="empty-state">No additional assessment yet.</p>`;
  }
  return radarChart(readings);
}

function hasDraftContent(draft) {
  return Boolean(
    draft.externalTerms.length ||
    draft.internalTerms.length ||
    Object.keys(draft.blend || {}).length ||
    Object.keys(draft.whatJustHappened || {}).length ||
    hasNonDefault(draft.signals, 0) ||
    Object.keys(draft.signalDescriptors || {}).length ||
    draft.name ||
    draft.subtext ||
    draft.evidence
  );
}

function dashboardReading() {
  const options = dashboardReadingOptions();
  const selected = options.find((option) => option.id === state.dashboardReadingId) || options[0];
  state.dashboardReadingId = selected.id;
  return selected.reading;
}

function dashboardReadingOptions() {
  const draft = currentDraft();
  const options = [];

  if (hasDraftContent(draft)) {
    options.push({
      id: "current-draft",
      label: "Current draft",
      reading: { ...draft, source: "Current draft" }
    });
  }

  getImageReadings().forEach((reading, index) => {
    const normalized = normalizeSavedReading(reading);
    options.push({
      id: normalized.id || `reading-${index}`,
      label: `${normalized.source || "Saved reading"}: ${normalized.name || `Reading ${index + 1}`}`,
      reading: { ...normalized, source: normalized.source || "Saved reading" }
    });
  });

  if (!options.length) {
    options.push({
      id: "empty-dashboard",
      label: "No coding yet",
      reading: { ...draft, source: "No coding yet" }
    });
  }

  return options;
}

function renderDashboard() {
  const panel = $("#dashboardPanel");
  if (!panel) return;

  const reading = dashboardReading();
  const dashboardOptions = dashboardReadingOptions();
  const imageReadings = getImageReadings();
  const consensusHtml = consensusBars(imageReadings);
  const topBlend = Object.entries(reading.blend || {})
    .map(([emotion, value]) => [emotion, Number(value || 0)])
    .sort((a, b) => b[1] - a[1]);
  const eventRows = Object.entries(reading.whatJustHappened || {})
    .sort(([, left], [, right]) => Number(right.intensity || 0) - Number(left.intensity || 0));
  const featureRows = signalAttributes.map((attribute) => ({
    name: attribute.name,
    value: Number(reading.signals?.[attribute.name] || 0),
    descriptors: reading.signalDescriptors?.[attribute.name] || []
  }));

  panel.innerHTML = `
    <div class="dashboard-toolbar">
      <label class="dashboard-selector">
        <span>Interpretation</span>
        <select id="dashboardReadingSelect">
          ${dashboardOptions.map((option) => `
            <option value="${escapeHtml(option.id)}"${option.id === state.dashboardReadingId ? " selected" : ""}>${escapeHtml(option.label)}</option>
          `).join("")}
        </select>
      </label>
      <span>${imageReadings.length} interpretation${imageReadings.length === 1 ? "" : "s"} for this image</span>
    </div>

    <section class="dashboard-card dashboard-external">
      <header><h3>External</h3><span>${reading.externalTerms.length}</span></header>
      <div class="dashboard-chip-list">${dashboardChips(reading.externalTerms)}</div>
    </section>

    <section class="dashboard-card dashboard-internal">
      <header><h3>Internal</h3><span>${reading.internalTerms.length}</span></header>
      <div class="dashboard-chip-list">${dashboardChips(reading.internalTerms)}</div>
    </section>

    <section class="dashboard-card dashboard-emotion">
      <header><h3>Emotion</h3><span>blend</span></header>
      <div class="dashboard-bars">
        ${topBlend.length ? topBlend.map(([label, value]) => dashboardBar(label, value)).join("") : `<p class="empty-state">No emotion activation yet.</p>`}
      </div>
    </section>

    <section class="dashboard-card dashboard-features">
      <header><h3>Features Activated</h3><span>intensity and descriptors</span></header>
      <div class="dashboard-feature-list">
        ${featureRows.map((feature) => dashboardFeatureRow(feature)).join("")}
      </div>
    </section>

    <section class="dashboard-card dashboard-interpretation">
      <header><h3>Interpretation</h3><span>${escapeHtml(reading.name || "Untitled")}</span></header>
      <p>${escapeHtml(reading.subtext || "No subtext yet.")}</p>
      <p>${escapeHtml(reading.evidence || "No evidence note yet.")}</p>
      ${eventRows.length ? `
        <div class="dashboard-event-summary">
          <strong>What just happened</strong>
          ${eventRows.map(([name, value]) => `
            <span><b>${escapeHtml(name)}</b>${escapeHtml(value.term)} <em>${Number(value.intensity) || 0}</em></span>
          `).join("")}
        </div>
      ` : ""}
    </section>

    <section class="dashboard-card dashboard-consensus">
      <header><h3>Consensus</h3><span>${imageReadings.length > 1 ? `${imageReadings.length} assessments` : "this image"}</span></header>
      <div class="dashboard-radar">${consensusHtml}</div>
    </section>
  `;

  $("#dashboardReadingSelect")?.addEventListener("change", (event) => {
    state.dashboardReadingId = event.target.value;
    renderDashboard();
  });
}

function dashboardChips(terms = []) {
  return terms.length
    ? terms.map((term) => `<span>${escapeHtml(displayTerm(term))}</span>`).join("")
    : `<em>empty</em>`;
}

function dashboardBar(label, value) {
  return `
    <div class="dashboard-bar">
      <span>${escapeHtml(label)}</span>
      <div><i style="width:${Math.max(0, Math.min(100, value))}%"></i></div>
      <b>${value}</b>
    </div>
  `;
}

function emotionFamilyForTerm(term) {
  const normalized = String(term).trim().toLowerCase();
  const directFamily = emotionFamilies.find((family) => (
    family.terms.some((candidate) => candidate.toLowerCase() === normalized)
  ));
  return directFamily?.name || emotionFamilyAliases[normalized] || "";
}

function familyEmotionValues(reading) {
  const grouped = Object.fromEntries(emotionFamilies.map((family) => [family.name, []]));
  Object.entries(reading.blend || {}).forEach(([term, rawValue]) => {
    const family = emotionFamilyForTerm(term);
    if (family) grouped[family].push(Number(rawValue) || 0);
  });
  return emotionFamilies.map((family) => {
    const values = grouped[family.name];
    const intensity = values.length
      ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
      : 0;
    return [family.name, intensity];
  });
}

function radarPoint(index, value, radius = 70, centerX = 120, centerY = 105) {
  const angle = -Math.PI / 2 + index * (Math.PI * 2 / emotionFamilies.length);
  const scaledRadius = radius * (value / 100);
  return [
    centerX + Math.cos(angle) * scaledRadius,
    centerY + Math.sin(angle) * scaledRadius
  ];
}

function radarPolygon(values, level = 100) {
  return values.map((_, index) => radarPoint(index, level).map((value) => value.toFixed(1)).join(",")).join(" ");
}

function radarChart(readings) {
  const labels = emotionFamilies.map((family) => family.name);
  const series = readings.map((reading, index) => ({
    label: reading.name || `Assessment ${index + 1}`,
    color: radarColors[index % radarColors.length],
    values: familyEmotionValues(reading).map(([, value]) => value)
  }));
  const axes = labels.map((label, index) => {
    const [x, y] = radarPoint(index, 100);
    const [labelX, labelY] = radarPoint(index, 114);
    const anchor = labelX < 105 ? "end" : labelX > 135 ? "start" : "middle";
    return `
      <line x1="120" y1="105" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"></line>
      <text x="${labelX.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="${anchor}" dominant-baseline="middle">${escapeHtml(label)}</text>
    `;
  }).join("");
  const shapes = series.map((item) => {
    const points = item.values.map((value, index) => radarPoint(index, value).map((point) => point.toFixed(1)).join(",")).join(" ");
    return `<polygon points="${points}" style="--radar-color:${item.color}"></polygon>`;
  }).join("");
  const legend = series.map((item) => `
    <span><i style="background:${item.color}"></i>${escapeHtml(item.label)}</span>
  `).join("");

  return `
    <div class="radar-wrap">
      <svg class="radar-chart" viewBox="0 0 240 200" role="img" aria-label="Five emotion family comparison">
        <g class="radar-grid">
          ${[25, 50, 75, 100].map((level) => `<polygon points="${radarPolygon(labels, level)}"></polygon>`).join("")}
          ${axes}
        </g>
        <g class="radar-series">${shapes}</g>
      </svg>
      <div class="radar-legend">${legend}</div>
    </div>
  `;
}

function dashboardFeatureRow(feature) {
  return `
    <div class="dashboard-feature-row">
      <strong>${escapeHtml(feature.name)}</strong>
      <div class="dashboard-feature-meter"><i style="width:${Math.max(0, Math.min(100, feature.value))}%"></i></div>
      <b>${feature.value}</b>
      <div class="dashboard-feature-descriptors">
        ${feature.descriptors.length
          ? feature.descriptors.map((term) => `<span>${escapeHtml(term)}</span>`).join("")
          : `<em>none selected</em>`}
      </div>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[char]));
}

function loadImage(file) {
  const reader = new FileReader();
  reader.onload = () => {
    $("#previewImage").src = reader.result;
    $("#previewImage").alt = file.name;
    $("#previewImage").dataset.id = `upload-${slug(file.name)}`;
    $("#previewImage").dataset.name = file.name;
    $("#imageStage").classList.add("has-image");
    setCurrentImage({
      id: `upload-${slug(file.name)}`,
      title: file.name,
      name: file.name,
      src: reader.result,
      rightsMode: "browser-upload"
    });
  };
  reader.readAsDataURL(file);
}

function generatedFace(seed = Date.now(), label = state.generatedCount) {
  const rand = seededRandom(seed);
  const browTilt = Math.round((rand() - 0.5) * 90);
  const browLift = Math.round((rand() - 0.5) * 60);
  const mouthCurve = Math.round((rand() - 0.5) * 120);
  const eyeOpen = 34 + Math.round(rand() * 24);
  const gazeShift = Math.round((rand() - 0.5) * 28);
  const cheek = 60 + Math.round(rand() * 50);
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
      <rect width="800" height="800" fill="#ece8dd"/>
      <circle cx="400" cy="360" r="226" fill="#d7a085"/>
      <ellipse cx="305" cy="385" rx="62" ry="${eyeOpen}" fill="#fff"/>
      <ellipse cx="505" cy="385" rx="62" ry="${Math.max(30, eyeOpen - 8)}" fill="#fff"/>
      <circle cx="${305 + gazeShift}" cy="390" r="23" fill="#263d44"/>
      <circle cx="${505 + gazeShift}" cy="390" r="23" fill="#263d44"/>
      <path d="M235 ${312 + browLift} Q300 ${250 + browLift - browTilt} 365 ${314 + browLift}" fill="none" stroke="#3f2b2b" stroke-width="22" stroke-linecap="round"/>
      <path d="M440 ${316 - browLift} Q505 ${250 - browLift + browTilt} 575 ${326 - browLift}" fill="none" stroke="#3f2b2b" stroke-width="22" stroke-linecap="round"/>
      <path d="M292 526 Q400 ${570 - mouthCurve} 520 526" fill="none" stroke="#6b2d36" stroke-width="18" stroke-linecap="round"/>
      <path d="M255 462 Q300 ${cheek} 338 462" stroke="#b86c63" stroke-width="9" stroke-linecap="round" opacity="0.75"/>
      <path d="M470 462 Q515 ${cheek} 560 462" stroke="#b86c63" stroke-width="9" stroke-linecap="round" opacity="0.75"/>
      <text x="400" y="720" text-anchor="middle" font-family="Arial" font-size="28" fill="#6a635c">generated expression ${label}</text>
    </svg>
  `);
  return `data:image/svg+xml;charset=utf-8,${svg}`;
}

function selectAsset(asset) {
  if (asset.id === "generated-face") {
    changeImage(1);
    return;
  }
  if (!confirmImageChange()) return;
  clearCurrentSelections();
  $("#previewImage").src = asset.src;
  $("#previewImage").alt = assetTitle(asset);
  $("#previewImage").dataset.id = asset.id;
  $("#previewImage").dataset.name = assetTitle(asset);
  $("#imageStage").classList.add("has-image");
  setCurrentImage({
    id: asset.id,
    title: assetTitle(asset),
    name: assetTitle(asset),
    src: asset.src,
    rightsMode: asset.rightsMode || "local-study"
  });
}

function resetAll() {
  window.localStorage?.removeItem("expressionReadings");
  state.readings = [];
  state.lastSavedSignature = "";
  state.termsByBin.external.clear();
  state.termsByBin.internal.clear();
  $("#readingForm").reset();
  renderBins();
  renderAssetLibrary();
  setStep(0);
}

function emptyDraft() {
  return {
    imageName: "",
    externalTerms: [],
    internalTerms: [],
    blend: {},
    whatJustHappened: {},
    signals: {},
    signalDescriptors: {},
    name: "",
    subtext: "",
    evidence: "",
    savedReadings: 0
  };
}

function normalizeSavedReading(reading) {
  const externalTerms = reading.externalTerms || [];
  const internalTerms = reading.internalTerms || [];
  return {
    ...emptyDraft(),
    ...reading,
    externalTerms,
    internalTerms,
    taxonomyTerms: reading.taxonomyTerms || [...externalTerms, ...internalTerms],
    signals: reading.signals || {},
    signalDescriptors: reading.signalDescriptors || {},
    blend: reading.blend || {},
    whatJustHappened: reading.whatJustHappened || {},
    savedReadings: 1
  };
}

function currentDraft() {
  return {
    ...collectDraftFields(),
    savedReadings: getImageReadings().length
  };
}

function collectDraftFields() {
  const blend = collectEmotionBlend();
  const whatJustHappened = collectWhatJustHappened();
  const signals = Object.fromEntries(signalAttributes.map((attribute) => {
    const input = $(`#${slug(attribute.name)}`);
    return [attribute.name, Number(input?.value || 0)];
  }));
  return {
    imageId: state.currentImage?.id || $("#previewImage")?.dataset.id || "",
    imageName: $("#previewImage")?.dataset.name || "",
    externalTerms: Array.from(state.termsByBin.external),
    internalTerms: Array.from(state.termsByBin.internal),
    blend,
    whatJustHappened,
    signals,
    signalDescriptors: collectSignalDescriptors(),
    name: $("#expressionName")?.value.trim() || "",
    subtext: $("#subtext")?.value.trim() || "",
    evidence: $("#evidence")?.value.trim() || ""
  };
}

function collectSignalDescriptors() {
  const descriptors = {};
  $$("input[name='signalDescriptor']:checked").forEach((input) => {
    const [attribute, term] = input.value.split(": ");
    descriptors[attribute] ||= [];
    descriptors[attribute].push(term);
  });
  return descriptors;
}

function termBin(term) {
  if (state.termsByBin.external.has(term)) return "external";
  if (state.termsByBin.internal.has(term)) return "internal";
  return "";
}

function addTermToBin(term, bin) {
  if (!term || !state.termsByBin[bin]) return;
  state.termsByBin.external.delete(term);
  state.termsByBin.internal.delete(term);
  state.termsByBin[bin].add(term);
  buildTaxonomy();
  renderBins();
  renderModuleChecklist();
}

function taxonomySearchMatches(query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  return taxonomySearchIndex
    .map((item) => {
      const term = item.term.toLowerCase();
      const context = item.context.toLowerCase();
      const termIndex = term.indexOf(needle);
      const contextIndex = context.indexOf(needle);
      if (termIndex < 0 && contextIndex < 0) return null;
      const wordStart = term.split(/\s+/).some((word) => word.startsWith(needle));
      return {
        item,
        rank: term === needle ? 0 : term.startsWith(needle) ? 1 : wordStart ? 2 : termIndex >= 0 ? 3 : 4,
        position: termIndex >= 0 ? termIndex : contextIndex
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.rank - b.rank || a.position - b.position || a.item.term.length - b.item.term.length)
    .slice(0, 10)
    .map(({ item }) => item);
}

function setSearchResultsOpen(isOpen) {
  $("#taxonomySearch").setAttribute("aria-expanded", String(isOpen));
  $("#taxonomySearchResults").classList.toggle("is-open", isOpen);
}

function renderTaxonomySearchResults(query) {
  const results = taxonomySearchMatches(query);
  state.searchResults = results;
  state.searchActiveIndex = results.length ? 0 : -1;
  const target = $("#taxonomySearchResults");
  target.innerHTML = results.map((item, index) => `
    <button
      type="button"
      role="option"
      class="taxonomy-search-result${index === state.searchActiveIndex ? " is-active" : ""}"
      data-search-id="${escapeHtml(item.id)}"
      aria-selected="${index === state.searchActiveIndex}"
    >
      <strong>${escapeHtml(item.term)}</strong>
      <span>${escapeHtml(item.context)}</span>
    </button>
  `).join("");
  setSearchResultsOpen(Boolean(query.trim() && results.length));
}

function updateSearchResultFocus() {
  $$(".taxonomy-search-result").forEach((result, index) => {
    const isActive = index === state.searchActiveIndex;
    result.classList.toggle("is-active", isActive);
    result.setAttribute("aria-selected", String(isActive));
  });
}

function selectTaxonomySearchItem(item) {
  if (!item) return;
  state.searchSelection = item;
  state.searchDestination = "";
  $("#taxonomySearch").value = item.term;
  setSearchResultsOpen(false);
  renderTaxonomySearchAction();
}

function renderTaxonomySearchAction(message = "") {
  const target = $("#taxonomySearchAction");
  const item = state.searchSelection;
  if (!item) {
    target.innerHTML = `<span class="taxonomy-search-hint">${escapeHtml(message || "Choose a tag to code it")}</span>`;
    return;
  }
  if (item.type === "vocabulary") {
    target.innerHTML = `
      <span class="taxonomy-search-context">${escapeHtml(item.context)}</span>
      <div class="search-destination" role="group" aria-label="Required expression destination">
        <button type="button" data-search-destination="external" aria-pressed="${state.searchDestination === "external"}">External</button>
        <button type="button" data-search-destination="internal" aria-pressed="${state.searchDestination === "internal"}">Internal</button>
      </div>
      <button class="search-add-button" type="button" data-search-add${state.searchDestination ? "" : " disabled"}>Add</button>
    `;
    return;
  }
  target.innerHTML = `
    <span class="taxonomy-search-context">${escapeHtml(item.context)}</span>
    <label class="search-intensity" for="taxonomySearchIntensity">
      <span>Intensity</span>
      <input id="taxonomySearchIntensity" type="range" min="1" max="100" value="50">
      <output for="taxonomySearchIntensity">50</output>
    </label>
    <button class="search-add-button" type="button" data-search-add>Add</button>
  `;
}

function clearTaxonomySearch(message = "") {
  state.searchSelection = null;
  state.searchDestination = "";
  state.searchResults = [];
  state.searchActiveIndex = -1;
  $("#taxonomySearch").value = "";
  $("#taxonomySearchResults").innerHTML = "";
  setSearchResultsOpen(false);
  renderTaxonomySearchAction(message);
}

function setControlIntensity(input, intensity) {
  if (!input) return;
  input.value = String(intensity);
  const output = document.querySelector(`[data-output="${input.id}"]`);
  if (output) output.textContent = String(intensity);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function applyFeatureSearchItem(item, intensity) {
  const value = `${item.featureName}: ${item.term}`;
  const checkbox = $$("input[name='signalDescriptor']").find((input) => input.value === value);
  if (checkbox) {
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
  }
  setControlIntensity($(`#${slug(item.featureName)}`), intensity);
  setStep(2);
}

function applyEmotionSearchItem(item, intensity) {
  const familyChips = $$(".blend-chip").filter((chip) => chip.dataset.emotionFamily === item.familyName);
  const matchingChips = familyChips.filter((chip) => (
    Array.from(chip.querySelector(".emotion-term-select")?.options || []).some((option) => option.value === item.term)
  ));
  const chip = matchingChips.find((candidate) => Number(candidate.querySelector("input[type='range']")?.value || 0) === 0)
    || matchingChips[0];
  if (!chip) return;
  const select = chip.querySelector(".emotion-term-select");
  select.value = item.term;
  select.dispatchEvent(new Event("change", { bubbles: true }));
  setControlIntensity(chip.querySelector("input[type='range']"), intensity);
  setStep(1);
}

function applyEventSearchItem(item, intensity) {
  const dimensionIndex = whatJustHappenedDimensions.findIndex((dimension) => dimension.name === item.dimensionName);
  const chip = $$(".event-chip")[dimensionIndex];
  if (!chip) return;
  const select = chip.querySelector(".event-term-select");
  select.value = item.term;
  select.dispatchEvent(new Event("change", { bubbles: true }));
  setControlIntensity(chip.querySelector("input[type='range']"), intensity);
  setStep(1);
}

function applyTaxonomySearchSelection() {
  const item = state.searchSelection;
  if (!item) return;
  if (item.type === "vocabulary") {
    if (!state.searchDestination) return;
    const destination = state.searchDestination;
    addTermToBin(item.fullTerm, destination);
    setStep(0);
    clearTaxonomySearch(`Added ${item.term} to ${destination}`);
    return;
  }
  const intensity = Number($("#taxonomySearchIntensity")?.value || 50);
  if (item.type === "feature") applyFeatureSearchItem(item, intensity);
  if (item.type === "emotion") applyEmotionSearchItem(item, intensity);
  if (item.type === "event") applyEventSearchItem(item, intensity);
  clearTaxonomySearch(`Added ${item.term} at ${intensity}`);
}

function bindTaxonomySearch() {
  const input = $("#taxonomySearch");
  const results = $("#taxonomySearchResults");
  const action = $("#taxonomySearchAction");
  input.addEventListener("input", () => {
    state.searchSelection = null;
    state.searchDestination = "";
    renderTaxonomySearchAction();
    renderTaxonomySearchResults(input.value);
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" && state.searchResults.length) {
      event.preventDefault();
      state.searchActiveIndex = (state.searchActiveIndex + 1) % state.searchResults.length;
      updateSearchResultFocus();
    } else if (event.key === "ArrowUp" && state.searchResults.length) {
      event.preventDefault();
      state.searchActiveIndex = (state.searchActiveIndex - 1 + state.searchResults.length) % state.searchResults.length;
      updateSearchResultFocus();
    } else if (event.key === "Enter" && state.searchActiveIndex >= 0) {
      event.preventDefault();
      selectTaxonomySearchItem(state.searchResults[state.searchActiveIndex]);
    } else if (event.key === "Escape") {
      setSearchResultsOpen(false);
    }
  });
  input.addEventListener("search", () => {
    if (!input.value) clearTaxonomySearch();
  });
  results.addEventListener("click", (event) => {
    const result = event.target.closest("[data-search-id]");
    if (!result) return;
    selectTaxonomySearchItem(taxonomySearchIndex.find((item) => item.id === result.dataset.searchId));
  });
  action.addEventListener("click", (event) => {
    const destination = event.target.closest("[data-search-destination]")?.dataset.searchDestination;
    if (destination) {
      state.searchDestination = destination;
      renderTaxonomySearchAction();
      return;
    }
    if (event.target.closest("[data-search-add]")) applyTaxonomySearchSelection();
  });
  action.addEventListener("input", (event) => {
    if (event.target.id === "taxonomySearchIntensity") {
      action.querySelector("output").textContent = event.target.value;
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".taxonomy-search-combobox")) setSearchResultsOpen(false);
  });
}

function openWriteIn(bin) {
  if (!state.termsByBin[bin]) return;
  state.writeInBin = bin;
  renderBins();
  $(`#${bin}WriteIn`)?.focus();
}

function addWriteInTerm(bin, label) {
  if (!state.termsByBin[bin]) return;
  const cleanLabel = label.trim();
  if (!cleanLabel) return;
  state.writeInBin = null;
  addTermToBin(`Write-in: ${cleanLabel}`, bin);
}

function removeTerm(term) {
  state.termsByBin.external.delete(term);
  state.termsByBin.internal.delete(term);
  buildTaxonomy();
  renderBins();
  renderModuleChecklist();
}

function renderBins() {
  ["external", "internal"].forEach((bin) => {
    const target = $(`#${bin}Bin`);
    if (!target) return;
    const terms = Array.from(state.termsByBin[bin]);
    target.innerHTML = `${terms.map((term) => `
      <button class="bin-chip" type="button" data-term="${escapeHtml(term)}">
        ${escapeHtml(displayTerm(term))}
      </button>
    `).join("")}${state.writeInBin === bin ? `
      <form class="write-in-form" data-write-in-form="${bin}">
        <input id="${bin}WriteIn" type="text" placeholder="write in" aria-label="${bin} write-in text">
        <button type="submit">Save</button>
      </form>
    ` : ""}`;
    target.querySelectorAll(".bin-chip").forEach((chip) => {
      chip.addEventListener("click", () => removeTerm(chip.dataset.term));
    });
    target.querySelector("[data-write-in-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      addWriteInTerm(bin, event.target.querySelector("input").value);
    });
    target.querySelector(".write-in-form input")?.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        state.writeInBin = null;
        renderBins();
      }
    });
  });
}

function displayTerm(term) {
  return term.startsWith("Write-in: ") ? term.slice("Write-in: ".length) : term.split(": ").pop();
}

function bindBins() {
  $("#taxonomyGrid").addEventListener("click", (event) => {
    const chip = event.target.closest(".term-chip");
    const assignment = event.target.closest("[data-assign]")?.dataset.assign || "external";
    if (chip) addTermToBin(chip.dataset.term, assignment);
  });
  $("#taxonomyGrid").addEventListener("dragstart", (event) => {
    const chip = event.target.closest(".term-chip");
    if (chip) event.dataTransfer.setData("text/plain", chip.dataset.term);
  });
  $$(".message-bin").forEach((bin) => {
    bin.querySelector("[data-write-in]")?.addEventListener("click", () => {
      openWriteIn(bin.dataset.bin);
    });
    bin.addEventListener("dragover", (event) => {
      event.preventDefault();
      bin.classList.add("is-over");
    });
    bin.addEventListener("dragleave", () => bin.classList.remove("is-over"));
    bin.addEventListener("drop", (event) => {
      event.preventDefault();
      bin.classList.remove("is-over");
      addTermToBin(event.dataTransfer.getData("text/plain"), bin.dataset.bin);
    });
  });
}

function seededRandom(seed) {
  let value = seed % 2147483647;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

async function initializeImages() {
  await Promise.all([loadAssetManifest(), loadReadingDatabase()]);
  if (!state.assets.length) ensureGeneratedImages();
  showImageAt(0);
  renderModuleChecklist();
}

buildSliders();
buildTaxonomy();
bindSliders();
bindBins();
bindTaxonomySearch();
initializeImages();

$$(".step").forEach((button) => button.addEventListener("click", () => setStep(Number(button.dataset.step))));
$("#backBtn").addEventListener("click", () => setStep(state.step - 1));
$("#nextBtn").addEventListener("click", () => setStep(state.step + 1));
$("#readingForm").addEventListener("submit", saveReading);
$("#prevImageBtn").addEventListener("click", () => changeImage(-1));
$("#nextImageBtn").addEventListener("click", () => changeImage(1));
$("#characterFilter").addEventListener("change", (event) => {
  const previousFilter = state.characterFilter;
  if (!confirmImageChange()) {
    event.target.value = previousFilter;
    return;
  }
  state.characterFilter = event.target.value;
  clearCurrentSelections();
  showImageAt(0);
});
["expressionName", "subtext", "evidence"].forEach((id) => {
  $(`#${id}`).addEventListener("input", renderModuleChecklist);
});
setStep(0);
