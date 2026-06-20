import { taxonomy } from "./taxonomy.js?v=0.7.9";

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
  { id: "emotion", label: "Emotion", isComplete: (draft) => Object.keys(draft.blend || {}).length > 0 },
  { id: "signals", label: "Signals", isComplete: (draft) => hasNonDefault(draft.signals, 0) || Object.keys(draft.signalDescriptors || {}).length > 0 },
  { id: "interpret", label: "Interpret", isComplete: (draft) => Boolean(draft.name && draft.name !== "Untitled reading" && draft.subtext && draft.evidence) },
  { id: "compare", label: "Compare", isComplete: (draft) => draft.savedReadings > 0 }
];

const signalAttributes = [
  {
    name: "Brows",
    terms: ["furrowed", "knitted", "pinched", "raised inner brows", "arched", "skeptical", "pleading", "alarmed", "brooding", "compressed", "tilted", "softened", "asymmetrical", "drawn together", "lifted in worry"]
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
    terms: ["lifted cheeks", "flushed", "tight cheeks", "slack cheeks", "wrinkled nose", "softened cheeks", "strained nasolabial fold", "tearful fullness", "smiling cheeks", "suppressed disgust", "compressed midface", "warmed", "drained", "tense nostrils", "micro-flinch"]
  },
  {
    name: "Head and posture",
    terms: ["chin lifted", "chin tucked", "head tilted", "head withdrawn", "leaning in", "leaning away", "braced shoulders", "open posture", "collapsed posture", "held still", "turning away", "offering", "protective", "formal", "unsteady"]
  }
];

const emotions = [
  "Happy",
  "Sad",
  "Disgusted",
  "Angry",
  "Fearful",
  "Uncomfortable",
  "Surprised",
  "Unsure",
  "Weary"
];

const referenceReadings = [
  {
    id: "reference-belle-defeated-compassionate-shock",
    createdAt: "2026-06-19T00:00:00.000Z",
    imageId: "belle-defeated-astonished-reflective-empathetic-horrified-compassionate",
    imageName: "Belle defeated astonished reflective empathetic horrified compassionate",
    source: "Reference assessment",
    name: "compassionate shock under strain",
    subtext: "I understand what this means, and it hurts to see it. I am trying to stay present for you even though I am alarmed by what I am witnessing.",
    evidence: "The brows lift and soften with worry; the eyes stay searching and exposed; the mouth is parted as if mid-response. Her body leans toward the other person, creating an external offering of care while the face carries internal alarm and empathic pain.",
    externalTerms: [
      "Social Display: Objective: to comfort",
      "Social Display: Objective: to protect",
      "Social Display: Masking and leakage: controlled face",
      "Social Display: Audience orientation: offering comfort",
      "Social Display: Relational stance: pleading",
      "Social Display: Relational stance: protective",
      "Appraisal: Time direction: present recognition",
      "Appraisal: Coping and certainty: bracing",
      "Affect: Felt body state: held breath",
      "State and Bearing: Composure: composed"
    ],
    internalTerms: [
      "Emotions: Disgusted: horrified",
      "Emotions: Fearful: worried",
      "Emotions: Fearful: overwhelmed",
      "Emotions: Sad: vulnerable",
      "Emotions: Sad: powerless",
      "Emotions: Sad: hurt",
      "Emotions: Surprised: dismayed",
      "Appraisal: Coping and certainty: uncertain outcome",
      "Appraisal: Goal relation: cost recognized",
      "Write-in: empathic pain",
      "State and Bearing: Dysregulated: on edge",
      "Affect: Felt body state: tightened"
    ],
    taxonomyTerms: [],
    signals: {
      Brows: 70,
      Eyes: 65,
      Gaze: 60,
      Mouth: 74,
      Jaw: 48,
      "Cheeks and nose": 42,
      "Head and posture": 55
    },
    signalDescriptors: {
      Brows: ["raised inner brows", "softened", "asymmetrical", "lifted in worry"],
      Eyes: ["wide", "searching", "alert", "pleading", "soft"],
      Gaze: ["direct", "measuring", "seeking safety"],
      Mouth: ["parted", "open in shock", "downturned", "suppressed speech"],
      Jaw: ["slack", "braced", "held back"],
      "Cheeks and nose": ["drained", "softened cheeks", "compressed midface"],
      "Head and posture": ["leaning in", "protective", "unsteady", "offering"]
    },
    blend: {
      Fearful: 78,
      Sad: 72,
      Unsure: 65,
      Surprised: 58,
      Uncomfortable: 52,
      Weary: 38,
      Disgusted: 20,
      Angry: 12,
      Happy: 5
    }
  }
].map((reading) => ({
  ...reading,
  taxonomyTerms: [...reading.externalTerms, ...reading.internalTerms]
}));

function loadSavedReadings() {
  try {
    const saved = window.localStorage?.getItem("expressionReadings");
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const state = {
  step: 0,
  readings: loadSavedReadings(),
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
  characterFilter: "all"
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
  return [...state.readings, ...referenceReadings];
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
  $("#readingForm").reset();
  renderBins();
  buildTaxonomy();
  bindSliders();
  renderModuleChecklist();
}

function hasUnsavedSelections() {
  const draft = collectDraftFields();
  return Boolean(
    draft.externalTerms.length ||
    draft.internalTerms.length ||
    Object.keys(draft.blend).length ||
    hasNonDefault(draft.signals, 0) ||
    Object.keys(draft.signalDescriptors).length ||
    draft.name ||
    draft.subtext ||
    draft.evidence
  );
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
      <article class="signal-card">
        ${sliderRow(attribute.name, { value: 0 })}
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
  $("#emotionBlend").innerHTML = emotions.map((emotion) => {
    const id = `emotion-${slug(emotion)}`;
    return `
      <div class="blend-chip">
        <label for="${id}"><span>${emotion}</span><span data-output="${id}">0</span></label>
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
}

function setStep(nextStep) {
  state.step = Math.max(0, Math.min(5, nextStep));
  $$(".step").forEach((button) => button.classList.toggle("is-active", Number(button.dataset.step) === state.step));
  $$(".screen").forEach((screen) => screen.classList.toggle("is-active", Number(screen.dataset.screen) === state.step));
  $("#backBtn").disabled = state.step === 0;
  $("#readingForm").classList.toggle("is-final", state.step === 5);
  $("#readingForm").classList.toggle("is-saveable", state.step >= 3);
  window.expressionDebug = { step: state.step, readings: state.readings.length };
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
  const blend = Object.fromEntries(emotions.map((emotion) => {
    const id = `emotion-${slug(emotion)}`;
    return [emotion, Number($(`#${id}`).value)];
  }).filter(([, value]) => value > 0));

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
    blend
  };
}

function saveReading(event) {
  event.preventDefault();
  state.readings.unshift(collectReading());
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
    $("#consensus").innerHTML = `<p class="rights-note">Consensus appears after this image has at least one reading.</p>`;
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
  const totals = {};
  readings.forEach((reading) => {
    Object.entries(reading.blend).forEach(([label, value]) => {
      totals[label] = (totals[label] || 0) + value;
    });
  });
  return Object.entries(totals)
    .map(([label, total]) => [label, Math.round(total / readings.length)])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([label, value]) => miniBar(label, value))
    .join("") || `<p class="rights-note">No blend data yet.</p>`;
}

function hasDraftContent(draft) {
  return Boolean(
    draft.externalTerms.length ||
    draft.internalTerms.length ||
    Object.keys(draft.blend || {}).length ||
    hasNonDefault(draft.signals, 0) ||
    Object.keys(draft.signalDescriptors || {}).length ||
    draft.name ||
    draft.subtext ||
    draft.evidence
  );
}

function dashboardReading() {
  const draft = currentDraft();
  if (hasDraftContent(draft)) return { ...draft, source: "Current draft" };
  const latest = getLatestReading();
  if (latest) return { ...normalizeSavedReading(latest), source: latest.source || "Latest saved reading" };
  return { ...draft, source: "No coding yet" };
}

function renderDashboard() {
  const panel = $("#dashboardPanel");
  if (!panel) return;

  const reading = dashboardReading();
  const imageReadings = getImageReadings();
  const status = moduleStatus({ ...reading, savedReadings: imageReadings.length });
  const descriptors = flattenSignalDescriptors(reading.signalDescriptors);
  const consensusHtml = imageReadings.length ? consensusBars(imageReadings) : `<em>No saved readings yet</em>`;
  const topBlend = emotions
    .map((emotion) => [emotion, Number(reading.blend?.[emotion] || 0)])
    .sort((a, b) => b[1] - a[1]);
  const signalRows = signalAttributes.map((attribute) => [attribute.name, Number(reading.signals?.[attribute.name] || 0)]);

  panel.innerHTML = `
    <section class="dashboard-card dashboard-overview">
      <header><h3>Overview</h3><span>${escapeHtml(reading.source)}</span></header>
      <div class="dashboard-stats">
        <strong>${imageReadings.length}</strong><span>saved reading${imageReadings.length === 1 ? "" : "s"}</span>
        <strong>${status.filter((item) => item.complete).length}/${status.length}</strong><span>modules</span>
      </div>
      <div class="dashboard-progress">
        ${status.map((item) => `<span class="${item.complete ? "is-complete" : ""}" title="${escapeHtml(item.label)}"></span>`).join("")}
      </div>
    </section>

    <section class="dashboard-card dashboard-vocab">
      <header><h3>External</h3><span>${reading.externalTerms.length}</span></header>
      <div class="dashboard-chip-list">${dashboardChips(reading.externalTerms)}</div>
      <header><h3>Internal</h3><span>${reading.internalTerms.length}</span></header>
      <div class="dashboard-chip-list">${dashboardChips(reading.internalTerms)}</div>
    </section>

    <section class="dashboard-card">
      <header><h3>Emotion</h3><span>blend</span></header>
      <div class="dashboard-bars">
        ${topBlend.map(([label, value]) => dashboardBar(label, value)).join("")}
      </div>
    </section>

    <section class="dashboard-card">
      <header><h3>Signals</h3><span>intensity</span></header>
      <div class="dashboard-bars">
        ${signalRows.map(([label, value]) => dashboardBar(label, value)).join("")}
      </div>
    </section>

    <section class="dashboard-card dashboard-wide">
      <header><h3>Interpretation</h3><span>${escapeHtml(reading.name || "Untitled")}</span></header>
      <p>${escapeHtml(reading.subtext || "No subtext yet.")}</p>
      <p>${escapeHtml(reading.evidence || "No evidence note yet.")}</p>
    </section>

    <section class="dashboard-card">
      <header><h3>Descriptors</h3><span>${descriptors.length}</span></header>
      <div class="dashboard-chip-list">${dashboardChips(descriptors)}</div>
    </section>

    <section class="dashboard-card">
      <header><h3>Consensus</h3><span>this image</span></header>
      <div class="dashboard-bars">${consensusHtml}</div>
    </section>
  `;
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

function flattenSignalDescriptors(descriptors = {}) {
  return Object.entries(descriptors).flatMap(([attribute, terms]) => (
    (terms || []).map((term) => `${attribute}: ${term}`)
  ));
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
    signals: {},
    signalDescriptors: {},
    name: "",
    subtext: "",
    evidence: "",
    savedReadings: 0
  };
}

function normalizeSavedReading(reading) {
  return {
    ...emptyDraft(),
    ...reading,
    externalTerms: reading.externalTerms || [],
    internalTerms: reading.internalTerms || [],
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
  const blend = Object.fromEntries(emotions.map((emotion) => {
    const input = $(`#emotion-${slug(emotion)}`);
    return [emotion, Number(input?.value || 0)];
  }).filter(([, value]) => value > 0));
  const signals = Object.fromEntries(signalAttributes.map((attribute) => {
    const input = $(`#${slug(attribute.name)}`);
    return [attribute.name, Number(input?.value || 0)];
  }));
  return {
    imageName: $("#previewImage")?.dataset.name || "",
    externalTerms: Array.from(state.termsByBin.external),
    internalTerms: Array.from(state.termsByBin.internal),
    blend,
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
  await loadAssetManifest();
  if (!state.assets.length) ensureGeneratedImages();
  showImageAt(0);
  renderModuleChecklist();
}

buildSliders();
buildTaxonomy();
bindSliders();
bindBins();
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
