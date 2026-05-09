const assets = [
  {
    src: "../img/bug_yolo.gif",
    title: "Bug Hunter",
    text: "Vision-heavy build energy with playful technical grit.",
  },
  {
    src: "../img/hvac_poster.svg",
    title: "HVAC Poster",
    text: "Clarity-first design for people doing hard physical work.",
  },
  {
    src: "../img/justice-chamber.gif",
    title: "Justice Chamber",
    text: "Civic storytelling turned into motion and atmosphere.",
  },
  {
    src: "../img/thankyou_bags.gif",
    title: "Thank You Bags",
    text: "Warm visual narratives with community-centered texture.",
  },
  {
    src: "../img/press_shield.png",
    title: "Press Shield",
    text: "Bold marks and shape language for confident product voice.",
  },
  {
    src: "../img/grid-wave4-gif.gif",
    title: "Grid Wave",
    text: "Experimental motion systems and rhythm-driven graphics.",
  },
  {
    src: "../img/nuggy_gradient.png",
    title: "Nuggy Gradient",
    text: "Color experiments built for delight over perfection.",
  },
  {
    src: "../img/me.PNG",
    title: "Maker Portrait",
    text: "Human behind the prototypes, systems, and visual weirdness.",
  },
];

const board = document.getElementById("board");
const gallery = document.getElementById("gallery");
const cardTemplate = document.getElementById("card-template");
const energyEl = document.getElementById("energy");
const explosionsEl = document.getElementById("explosions");
const moodEl = document.getElementById("mood");

const state = {
  tiles: [],
  energy: 0,
  explosions: 0,
  compact: false,
};

function pickAsset() {
  return assets[Math.floor(Math.random() * assets.length)];
}

function buildField() {
  board.innerHTML = "";
  gallery.innerHTML = "";
  state.tiles = [];
  state.energy = 0;
  state.explosions = 0;
  updateMeters();

  state.compact = window.innerWidth < 980;
  const tileCount = state.compact ? 40 : 60;

  for (let i = 0; i < tileCount; i += 1) {
    const asset = pickAsset();
    const tile = document.createElement("button");
    tile.className = "tile";
    tile.type = "button";
    tile.style.backgroundImage = `url('${asset.src}')`;
    tile.dataset.asset = String(assets.findIndex((a) => a.src === asset.src));
    tile.dataset.mine = Math.random() < 0.2 ? "1" : "0";
    tile.dataset.open = "0";
    tile.addEventListener("click", () => openTile(tile, true));
    board.appendChild(tile);
    state.tiles.push(tile);
  }
}

function openTile(tile, manual = false) {
  if (tile.dataset.open === "1") return;

  tile.dataset.open = "1";
  tile.classList.add("open");

  const isMine = tile.dataset.mine === "1";

  if (isMine) {
    tile.classList.add("mine");
    triggerRipple(tile);
    burstNeighbors(tile);
    state.explosions += 1;
    state.energy += 6;
    moodEl.textContent = state.explosions > 8 ? "Chaotic Joy" : "Wild";
  } else {
    tile.classList.add("sparkle");
    state.energy += manual ? 4 : 2;
    moodEl.textContent = state.energy > 70 ? "Transcendent" : "Dreamy";
  }

  addDiscovery(tile, isMine);
  updateMeters();

  setTimeout(() => {
    tile.classList.remove("sparkle");
  }, 800);
}

function burstNeighbors(sourceTile) {
  const tiles = [...board.children];
  const sourceIndex = tiles.indexOf(sourceTile);
  const width = window.innerWidth < 980 ? 8 : 10;

  const neighbors = [
    sourceIndex - 1,
    sourceIndex + 1,
    sourceIndex - width,
    sourceIndex + width,
    sourceIndex - width - 1,
    sourceIndex - width + 1,
    sourceIndex + width - 1,
    sourceIndex + width + 1,
  ].filter((i) => i >= 0 && i < tiles.length);

  neighbors.forEach((idx, n) => {
    const t = tiles[idx];
    if (!t || t.dataset.open === "1") return;
    setTimeout(() => {
      openTile(t, false);
    }, 90 + n * 55);
  });
}

function triggerRipple(tile) {
  const shell = document.querySelector(".board-shell");
  const tileRect = tile.getBoundingClientRect();
  const shellRect = shell.getBoundingClientRect();

  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.left = `${tileRect.left - shellRect.left + tileRect.width / 2}px`;
  ripple.style.top = `${tileRect.top - shellRect.top + tileRect.height / 2}px`;

  shell.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
}

function addDiscovery(tile, isMine) {
  const idx = Number(tile.dataset.asset);
  const asset = assets[idx] || pickAsset();
  const fragment = cardTemplate.content.cloneNode(true);

  const img = fragment.querySelector("img");
  const h3 = fragment.querySelector("h3");
  const p = fragment.querySelector("p");

  img.src = asset.src;
  img.alt = asset.title;
  h3.textContent = isMine ? `${asset.title} (Blast Reveal)` : asset.title;
  p.textContent = isMine
    ? `${asset.text} The tile detonated and expanded the scene.`
    : `${asset.text} This area opened softly and added momentum.`;

  gallery.prepend(fragment);

  while (gallery.children.length > 10) {
    gallery.removeChild(gallery.lastChild);
  }
}

function updateMeters() {
  energyEl.textContent = String(state.energy);
  explosionsEl.textContent = String(state.explosions);
}

document.getElementById("remix").addEventListener("click", buildField);

document.getElementById("spark").addEventListener("click", () => {
  const unopened = state.tiles.filter((t) => t.dataset.open === "0");
  if (!unopened.length) return;

  const picks = unopened.sort(() => 0.5 - Math.random()).slice(0, Math.min(6, unopened.length));
  picks.forEach((tile, idx) => {
    setTimeout(() => openTile(tile, false), idx * 120);
  });
});

window.addEventListener("resize", () => {
  const nextCompact = window.innerWidth < 980;
  if (nextCompact !== state.compact) {
    buildField();
  }
});

buildField();
