const templates = [
  {
    id: "classic",
    name: "Classic",
    primary: "#00563f",
    accent: "#ffc72c",
    text: "#ffffff",
    style: "gradient",
  },
  {
    id: "gold-band",
    name: "Gold Band",
    primary: "#003d2e",
    accent: "#ffc72c",
    text: "#ffffff",
    style: "band",
  },
  {
    id: "minimal",
    name: "Minimal",
    primary: "#ffffff",
    accent: "#00563f",
    text: "#0f1a17",
    style: "minimal",
  },
  {
    id: "night",
    name: "Night",
    primary: "#0a1612",
    accent: "#ffc72c",
    text: "#f5f5f0",
    style: "gradient",
  },
];

const defaultState = {
  templateId: "classic",
  headline: "Excellence in Honors",
  subheadline: "University of Arkansas at Pine Bluff",
  tagline: "Scholarship · Leadership · Service",
  primary: "#00563f",
  accent: "#ffc72c",
  text: "#ffffff",
  width: 1200,
  height: 630,
  showSeal: true,
  style: "gradient",
};

let state = { ...defaultState };

const canvas = document.getElementById("bannerCanvas");
const ctx = canvas.getContext("2d");

const els = {
  templateGrid: document.getElementById("templateGrid"),
  headline: document.getElementById("headline"),
  subheadline: document.getElementById("subheadline"),
  tagline: document.getElementById("tagline"),
  colorPrimary: document.getElementById("colorPrimary"),
  colorAccent: document.getElementById("colorAccent"),
  colorText: document.getElementById("colorText"),
  sizePreset: document.getElementById("sizePreset"),
  showSeal: document.getElementById("showSeal"),
  downloadBtn: document.getElementById("downloadBtn"),
  resetBtn: document.getElementById("resetBtn"),
  previewMeta: document.getElementById("previewMeta"),
};

function wrapText(context, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (context.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawSeal(x, y, radius, primary, accent) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = accent;
  ctx.fill();
  ctx.lineWidth = Math.max(3, radius * 0.12);
  ctx.strokeStyle = primary;
  ctx.stroke();

  ctx.fillStyle = primary;
  ctx.font = `700 ${radius * 0.55}px "Cormorant Garamond", Georgia, serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("BH", x, y + radius * 0.02);
  ctx.restore();
}

function drawBackground() {
  const { width, height, primary, accent, style } = state;

  if (style === "minimal") {
    ctx.fillStyle = primary;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = accent;
    ctx.fillRect(0, height - height * 0.08, width, height * 0.08);
    return;
  }

  if (style === "band") {
    ctx.fillStyle = primary;
    ctx.fillRect(0, 0, width, height);
    const bandH = height * 0.22;
    ctx.fillStyle = accent;
    ctx.fillRect(0, height - bandH, width, bandH);
    return;
  }

  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, primary);
  grad.addColorStop(0.55, shade(primary, -15));
  grad.addColorStop(1, mix(primary, accent, 0.25));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = 0.15;
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.ellipse(width * 0.85, height * 0.2, width * 0.35, height * 0.5, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawBanner() {
  const { width, height, headline, subheadline, tagline, text, showSeal } = state;
  canvas.width = width;
  canvas.height = height;

  drawBackground();

  const pad = width * 0.07;
  const contentW = width - pad * 2;

  if (showSeal) {
    drawSeal(pad + width * 0.06, pad + width * 0.06, width * 0.045, state.primary, state.accent);
  }

  ctx.fillStyle = text;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const headlineSize = Math.round(width * 0.055);
  ctx.font = `700 ${headlineSize}px "Cormorant Garamond", Georgia, serif`;
  const headlineLines = wrapText(ctx, headline, contentW);
  let y = height * 0.38;
  headlineLines.forEach((line) => {
    ctx.fillText(line, pad, y);
    y += headlineSize * 1.15;
  });

  const subSize = Math.round(width * 0.028);
  ctx.font = `600 ${subSize}px "Source Sans 3", sans-serif`;
  ctx.globalAlpha = 0.92;
  ctx.fillText(subheadline, pad, y + height * 0.02);
  ctx.globalAlpha = 1;

  const tagSize = Math.round(width * 0.022);
  ctx.font = `600 ${tagSize}px "Source Sans 3", sans-serif`;
  ctx.fillStyle = state.style === "minimal" ? state.accent : state.accent;
  const tagY = height - pad - tagSize * 1.2;
  ctx.fillText(tagline.toUpperCase(), pad, tagY);

  ctx.fillStyle = text;
  ctx.globalAlpha = 0.35;
  ctx.font = `600 ${Math.round(width * 0.014)}px "Source Sans 3", sans-serif`;
  ctx.textAlign = "right";
  ctx.fillText("Blakely Honors Banner Studio", width - pad, height - pad - width * 0.008);
  ctx.globalAlpha = 1;
}

function shade(hex, percent) {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + percent));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent));
  const b = Math.min(255, Math.max(0, (num & 0xff) + percent));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function mix(a, b, t) {
  const parse = (h) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `#${((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)}`;
}

function syncInputsFromState() {
  els.headline.value = state.headline;
  els.subheadline.value = state.subheadline;
  els.tagline.value = state.tagline;
  els.colorPrimary.value = state.primary;
  els.colorAccent.value = state.accent;
  els.colorText.value = state.text;
  els.showSeal.checked = state.showSeal;
  els.sizePreset.value = `${state.width}x${state.height}`;
  els.previewMeta.textContent = `${state.width} × ${state.height} px`;
  document.querySelectorAll(".template-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.id === state.templateId);
  });
}

function applyTemplate(template) {
  state.templateId = template.id;
  state.primary = template.primary;
  state.accent = template.accent;
  state.text = template.text;
  state.style = template.style;
  syncInputsFromState();
  drawBanner();
}

function readStateFromInputs() {
  state.headline = els.headline.value.trim() || defaultState.headline;
  state.subheadline = els.subheadline.value.trim() || defaultState.subheadline;
  state.tagline = els.tagline.value.trim() || defaultState.tagline;
  state.primary = els.colorPrimary.value;
  state.accent = els.colorAccent.value;
  state.text = els.colorText.value;
  state.showSeal = els.showSeal.checked;
  const [w, h] = els.sizePreset.value.split("x").map(Number);
  state.width = w;
  state.height = h;
  els.previewMeta.textContent = `${w} × ${h} px`;
  drawBanner();
}

function buildTemplateGrid() {
  els.templateGrid.innerHTML = "";
  templates.forEach((t) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "template-btn";
    btn.dataset.id = t.id;
    btn.setAttribute("aria-label", `Template ${t.name}`);
    btn.innerHTML = `<div class="template-swatch" style="background:linear-gradient(135deg,${t.primary},${t.accent})">${t.name}</div>`;
    btn.addEventListener("click", () => applyTemplate(t));
    els.templateGrid.appendChild(btn);
  });
}

function downloadPng() {
  const link = document.createElement("a");
  const safeName = state.headline.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "banner";
  link.download = `blakely-honors-${safeName.toLowerCase()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function resetAll() {
  state = { ...defaultState };
  syncInputsFromState();
  drawBanner();
}

buildTemplateGrid();
syncInputsFromState();
drawBanner();

["input", "change"].forEach((ev) => {
  els.headline.addEventListener(ev, readStateFromInputs);
  els.subheadline.addEventListener(ev, readStateFromInputs);
  els.tagline.addEventListener(ev, readStateFromInputs);
  els.colorPrimary.addEventListener(ev, readStateFromInputs);
  els.colorAccent.addEventListener(ev, readStateFromInputs);
  els.colorText.addEventListener(ev, readStateFromInputs);
  els.sizePreset.addEventListener(ev, readStateFromInputs);
  els.showSeal.addEventListener(ev, readStateFromInputs);
});

els.downloadBtn.addEventListener("click", downloadPng);
els.resetBtn.addEventListener("click", resetAll);
