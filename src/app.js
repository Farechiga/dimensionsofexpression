import { taxonomy } from "./taxonomy.js?v=0.7.4";

const taxonomyOrder = [
  "emotion-wheel",
  "state-bearing",
  "core-affect",
  "appraisal",
  "social-display",
  "temporal-narrative",
  "emotion-blend",
  "acting-intention",
  "embodiment",
  "visible-anatomy"
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
  "Surprised"
];

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
  generatedCount: 0,
  imageIndex: 0,
  generatedImages: [],
  imageHistory: [],
  imageHistoryIndex: -1
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const slug = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const categoryLabels = {
  "emotion-wheel": "Emotions",
  "core-affect": "Affect",
  "social-display": "Social",
  "temporal-narrative": "Narrative",
  "emotion-blend": "Blend",
  "state-bearing": "State",
  "acting-intention": "Acting",
  "embodiment": "Effort",
  "visible-anatomy": "Evidence"
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
  renderAssetLibrary();
}

function assetTitle(asset) {
  return asset?.title || asset?.id || asset?.src?.split("/").pop() || "Untitled frame";
}

function getImageReadings(image = state.currentImage) {
  if (!image) return [];
  return state.readings.filter((reading) => reading.imageId === image.id || reading.imageName === image.name || reading.imageName === image.title);
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
  return state.assets.length ? state.assets : state.generatedImages;
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

function showImageAt(index, options = {}) {
  const images = allBrowsableImages();
  if (!images.length) return;
  const { recordHistory = true } = options;
  state.imageIndex = (index + images.length) % images.length;
  const image = images[state.imageIndex];
  $("#previewImage").src = image.src;
  $("#previewImage").alt = assetTitle(image);
  $("#previewImage").dataset.id = image.id;
  $("#previewImage").dataset.name = assetTitle(image);
  $("#imageStage").classList.add("has-image");
  if (recordHistory) {
    state.imageHistory = state.imageHistory.slice(0, state.imageHistoryIndex + 1);
    state.imageHistory.push(state.imageIndex);
    state.imageHistoryIndex = state.imageHistory.length - 1;
  }
  setCurrentImage(image);
}

function randomImageIndex() {
  const images = allBrowsableImages();
  if (images.length <= 1) return state.imageIndex;
  let nextIndex = state.imageIndex;
  while (nextIndex === state.imageIndex) {
    nextIndex = Math.floor(Math.random() * images.length);
  }
  return nextIndex;
}

function changeImage(delta) {
  if (!confirmImageChange()) return;
  if (!state.assets.length) ensureGeneratedImages();
  clearCurrentSelections();
  if (delta < 0 && state.imageHistoryIndex > 0) {
    state.imageHistoryIndex -= 1;
    showImageAt(state.imageHistory[state.imageHistoryIndex], { recordHistory: false });
    return;
  }
  showImageAt(randomImageIndex());
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
  state.step = Math.max(0, Math.min(4, nextStep));
  $$(".step").forEach((button) => button.classList.toggle("is-active", Number(button.dataset.step) === state.step));
  $$(".screen").forEach((screen) => screen.classList.toggle("is-active", Number(screen.dataset.screen) === state.step));
  $("#backBtn").disabled = state.step === 0;
  $("#readingForm").classList.toggle("is-final", state.step === 4);
  $("#readingForm").classList.toggle("is-saveable", state.step >= 3);
  window.expressionDebug = { step: state.step, readings: state.readings.length };
  renderReadings();
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

  if (!state.readings.length) {
    list.innerHTML = `<div class="reading-card"><h3>No readings yet</h3><p>Save a reading to start building a comparison cloud.</p></div>`;
    $("#consensus").innerHTML = `<p class="rights-note">Consensus appears after at least one reading.</p>`;
    return;
  }

  list.innerHTML = state.readings.map((reading) => {
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

  $("#consensus").innerHTML = consensusBars();
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

function consensusBars() {
  const totals = {};
  state.readings.forEach((reading) => {
    Object.entries(reading.blend).forEach(([label, value]) => {
      totals[label] = (totals[label] || 0) + value;
    });
  });
  return Object.entries(totals)
    .map(([label, total]) => [label, Math.round(total / state.readings.length)])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([label, value]) => miniBar(label, value))
    .join("") || `<p class="rights-note">No blend data yet.</p>`;
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
    target.innerHTML = terms.map((term) => `
      <button class="bin-chip" type="button" data-term="${escapeHtml(term)}">
        ${escapeHtml(term.split(": ").pop())}
      </button>
    `).join("");
    target.querySelectorAll(".bin-chip").forEach((chip) => {
      chip.addEventListener("click", () => removeTerm(chip.dataset.term));
    });
  });
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
  showImageAt(randomImageIndex());
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
["expressionName", "subtext", "evidence"].forEach((id) => {
  $(`#${id}`).addEventListener("input", renderModuleChecklist);
});
setStep(0);
