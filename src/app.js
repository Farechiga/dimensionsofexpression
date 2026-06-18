import { taxonomy } from "./taxonomy.js";

const modules = [
  { id: "image", label: "Reference image", isComplete: (reading) => Boolean(reading.imageName) },
  { id: "cues", label: "Visible cue pass", isComplete: (reading) => reading.cues?.length > 0 },
  { id: "signals", label: "Facial signal ratings", isComplete: (reading) => hasNonDefault(reading.signals, 35) },
  { id: "axes", label: "Meaning-map axes", isComplete: (reading) => hasNonDefault(reading.axes, 50) },
  { id: "taxonomy", label: "Nuanced vocabulary", isComplete: (reading) => reading.taxonomyTerms?.length > 0 },
  { id: "blend", label: "Emotion blend", isComplete: (reading) => Object.keys(reading.blend || {}).length > 0 },
  { id: "subtext", label: "Name and subtext", isComplete: (reading) => Boolean(reading.name && reading.name !== "Untitled reading" && reading.subtext) },
  { id: "evidence", label: "Evidence note", isComplete: (reading) => Boolean(reading.evidence) }
];

const cues = [
  ["Brows", "Inner lift, compression, asymmetry, or grief tension."],
  ["Eyes", "Widening, softness, wetness, squint, gaze target, avoidance."],
  ["Mouth", "Smile shape, corners, teeth, lip press, tremor, restraint."],
  ["Cheeks", "Raised warmth, social smile pressure, blush, slackness."],
  ["Jaw", "Clench, drop, held composure, or suppressed speech."],
  ["Head", "Tilt, retreat, offering, bracing, or sudden beat change."],
  ["Body", "Open/closed posture, approach/avoidance, protective tension."],
  ["Animation", "Exaggeration, staging, appeal, and readable silhouette."]
];

const signals = [
  "Smile warmth",
  "Smile tension",
  "Brow pain",
  "Eye openness",
  "Gaze connection",
  "Facial asymmetry",
  "Jaw control",
  "Composure leakage"
];

const axes = [
  ["Pleasant", "Painful"],
  ["Low arousal", "High arousal"],
  ["Powerless", "In control"],
  ["Internal realization", "External recognition"],
  ["Past wound", "Present repair"],
  ["Private feeling", "Social performance"],
  ["Open connection", "Defensive protection"],
  ["Certainty", "Uncertainty"],
  ["Goal closing", "Goal opening"],
  ["Self-directed", "Other-directed"]
];

const emotions = [
  "Joy",
  "Sadness",
  "Anger",
  "Fear",
  "Embarrassment",
  "Hope",
  "Relief",
  "Empathic pain",
  "Tenderness"
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
  currentImage: null
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const slug = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

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

function moduleStatus(reading = getLatestReading()) {
  return modules.map((module) => ({
    ...module,
    complete: reading ? module.isComplete(reading) : false
  }));
}

function renderAssetLibrary() {
  const builtIns = [
    {
      id: "abstract-demo-face",
      title: "Abstract demo face",
      src: "",
      rightsMode: "generated-demo",
      notes: "Built-in synthetic sample."
    }
  ];
  const allAssets = [...builtIns, ...state.assets];
  $("#assetCount").textContent = `${allAssets.length} frame${allAssets.length === 1 ? "" : "s"}`;
  $("#assetLibrary").innerHTML = allAssets.map((asset) => {
    const readings = getImageReadings({ id: asset.id, name: asset.title, title: asset.title });
    const status = moduleStatus(readings[0]);
    const complete = status.filter((module) => module.complete).length;
    const percent = Math.round((complete / modules.length) * 100);
    const selected = state.currentImage?.id === asset.id;
    return `
      <button class="asset-card${selected ? " is-selected" : ""}" type="button" data-asset-id="${escapeHtml(asset.id)}">
        <span class="asset-thumb">${asset.src ? `<img src="${escapeHtml(asset.src)}" alt="">` : "demo"}</span>
        <span class="asset-meta">
          <strong>${escapeHtml(assetTitle(asset))}</strong>
          <small>${escapeHtml(asset.rightsMode || "local-study")} · ${readings.length} reading${readings.length === 1 ? "" : "s"}</small>
          <span class="progress-track"><span style="width:${percent}%"></span></span>
        </span>
        <span class="asset-percent">${percent}%</span>
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
  const percent = Math.round((complete / modules.length) * 100);
  $("#completionPercent").textContent = `${percent}%`;
  $("#moduleChecklist").innerHTML = status.map((module) => `
    <div class="module-item${module.complete ? " is-complete" : ""}">
      <span>${module.complete ? "✓" : ""}</span>
      <strong>${escapeHtml(module.label)}</strong>
    </div>
  `).join("");
}

function setCurrentImage(image) {
  state.currentImage = image;
  renderAssetLibrary();
  renderModuleChecklist();
}

function buildCues() {
  $("#cueGrid").innerHTML = cues.map(([name, detail]) => `
    <label class="cue-card">
      <input type="checkbox" name="cue" value="${name}">
      <span><strong>${name}</strong><span>${detail}</span></span>
    </label>
  `).join("");
}

function sliderRow(name, options = {}) {
  const min = options.min ?? 0;
  const max = options.max ?? 100;
  const value = options.value ?? 50;
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
  $("#signalSliders").innerHTML = signals.map((signal) => sliderRow(signal, { value: 35 })).join("");
  $("#axisSliders").innerHTML = axes.map((axis) => sliderRow(axis, { value: 50 })).join("");
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
  $("#taxonomyGrid").innerHTML = taxonomy.map((category) => `
    <details class="taxonomy-card" open>
      <summary>
        <span>
          <strong>${escapeHtml(category.title)}</strong>
          <small>${escapeHtml(category.source)}</small>
        </span>
      </summary>
      <p>${escapeHtml(category.description)}</p>
      ${category.groups.map((group) => `
        <div class="term-group">
          <h3>${escapeHtml(group.label)}</h3>
          <div class="term-list">
            ${group.terms.map((term) => `
              <label class="term-chip">
                <input type="checkbox" name="taxonomyTerm" value="${escapeHtml(`${category.title}: ${group.label}: ${term}`)}">
                <span>${escapeHtml(term)}</span>
              </label>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </details>
  `).join("");
}

function bindSliders() {
  $$("[data-slider]").forEach((slider) => {
    slider.addEventListener("input", () => {
      const output = document.querySelector(`[data-output="${slider.id}"]`);
      if (output) output.textContent = slider.value;
    });
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
  const checkedCues = $$("input[name='cue']:checked").map((input) => input.value);
  const selectedTerms = $$("input[name='taxonomyTerm']:checked").map((input) => input.value);
  const signalValues = Object.fromEntries(signals.map((signal) => {
    const id = slug(signal);
    return [signal, Number($(`#${id}`).value)];
  }));
  const axisValues = Object.fromEntries(axes.map((axis) => {
    const id = slug(`${axis[0]} / ${axis[1]}`);
    return [`${axis[0]} / ${axis[1]}`, Number($(`#${id}`).value)];
  }));
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
    cues: checkedCues,
    taxonomyTerms: selectedTerms,
    signals: signalValues,
    axes: axisValues,
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
        <p class="reading-meta">${escapeHtml(reading.imageName || "Unknown frame")} · ${reading.taxonomyTerms?.length || 0} selected terms</p>
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

function useSample() {
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
      <rect width="800" height="800" fill="#efe9dd"/>
      <circle cx="400" cy="360" r="230" fill="#d79b82"/>
      <path d="M235 315 Q305 258 360 318" fill="none" stroke="#3f2b2b" stroke-width="24" stroke-linecap="round"/>
      <path d="M445 320 Q510 255 575 330" fill="none" stroke="#3f2b2b" stroke-width="24" stroke-linecap="round"/>
      <ellipse cx="315" cy="385" rx="58" ry="42" fill="#fff"/>
      <ellipse cx="505" cy="385" rx="58" ry="42" fill="#fff"/>
      <circle cx="330" cy="392" r="23" fill="#24434a"/>
      <circle cx="490" cy="392" r="23" fill="#24434a"/>
      <path d="M292 520 Q400 585 520 520" fill="none" stroke="#6b2d36" stroke-width="18" stroke-linecap="round"/>
      <path d="M340 526 Q406 548 474 526" fill="none" stroke="#fff4ee" stroke-width="10" stroke-linecap="round" opacity="0.85"/>
      <path d="M255 465 Q295 480 330 462" stroke="#b86c63" stroke-width="10" stroke-linecap="round"/>
      <path d="M475 462 Q520 482 560 463" stroke="#b86c63" stroke-width="10" stroke-linecap="round"/>
      <text x="400" y="720" text-anchor="middle" font-family="Arial" font-size="28" fill="#6a635c">abstract demo face</text>
    </svg>
  `);
  $("#previewImage").src = `data:image/svg+xml;charset=utf-8,${svg}`;
  $("#previewImage").alt = "Abstract demo face";
  $("#previewImage").dataset.id = "abstract-demo-face";
  $("#previewImage").dataset.name = "abstract-demo-face";
  $("#imageStage").classList.add("has-image");
  setCurrentImage({
    id: "abstract-demo-face",
    title: "Abstract demo face",
    name: "abstract-demo-face",
    src: "",
    rightsMode: "generated-demo"
  });
}

function selectAsset(asset) {
  if (asset.id === "abstract-demo-face") {
    useSample();
    return;
  }
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

function exportJson() {
  const blob = new Blob([JSON.stringify(state.readings, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `expression-readings-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function resetAll() {
  window.localStorage?.removeItem("expressionReadings");
  state.readings = [];
  $("#readingForm").reset();
  renderAssetLibrary();
  setStep(0);
}

buildCues();
buildSliders();
buildTaxonomy();
bindSliders();
loadAssetManifest();
renderModuleChecklist();

$$(".step").forEach((button) => button.addEventListener("click", () => setStep(Number(button.dataset.step))));
$("#backBtn").addEventListener("click", () => setStep(state.step - 1));
$("#nextBtn").addEventListener("click", () => setStep(state.step + 1));
$("#readingForm").addEventListener("submit", saveReading);
$("#imageInput").addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (file) loadImage(file);
});
$("#imageStage").addEventListener("dragover", (event) => event.preventDefault());
$("#imageStage").addEventListener("drop", (event) => {
  event.preventDefault();
  const [file] = event.dataTransfer.files;
  if (file && file.type.startsWith("image/")) loadImage(file);
});
$("#sampleBtn").addEventListener("click", useSample);
$("#exportBtn").addEventListener("click", exportJson);
$("#resetBtn").addEventListener("click", resetAll);
$("#mockupBtn").addEventListener("click", () => $("#mockupPanel").classList.toggle("is-collapsed"));
setStep(0);
