const storage = {
  wallNotes: "soc.wallNotes",
  letters: "soc.letters",
  receipt: "soc.receipt",
  grade: "soc.grade",
};

const gradeClasses = ["grade-cinema", "grade-clouds", "grade-milk"];

const homeThoughts = [
  {
    title: "the wall waits better than a feed",
    copy: "sometimes silence and staring at a wall is necessary.",
  },
  {
    title: "solid colors are an ethic",
    copy: "let one color hold the room instead of decorating around the feeling.",
  },
  {
    title: "no online third space",
    copy: "one string between two cups beats a crowd that only breadcrumbs connection.",
  },
  {
    title: "customer calendar",
    copy: "80 percent talking to real people, 20 percent turning the rough material into something useful.",
  },
  {
    title: "the frame is already there",
    copy: "coding all day still counts as an expressive outlet when the thing you care about is feeling.",
  },
];

const scenes = [
  {
    title: "no hands",
    kicker: "scene 01 / harmless falling",
    copy:
      "a world where falling only hurts as a feeling would still have stairs, but some people would jump every time.",
    image: "../blogs/img/me_jumping.jpg",
  },
  {
    title: "dark room moon",
    kicker: "scene 02 / silence",
    copy:
      "the room is better when it is dark enough that nothing competes with the frame.",
    image: "../img/moon.jpg",
  },
  {
    title: "imagined versus real",
    kicker: "scene 03 / blank paper logic",
    copy:
      "the gap between what is drawn and what is imagined is where the website should live.",
    image: "../blogs/img/banner_edge.jpeg",
  },
  {
    title: "crosswalk icon",
    kicker: "scene 04 / tiny public theater",
    copy:
      "a little walking person glows at the corner and the city briefly becomes a toy.",
    art: {
      bg: "#0d7a55",
      insetA: "24%",
      insetB: "42%",
      radiusA: "8px",
      rotateA: "0deg",
    },
  },
  {
    title: "fun balloons",
    kicker: "scene 05 / cute things matter",
    copy:
      "people should stop being so serious and make more small objects that were clearly thought about.",
    art: {
      bg: "#d76a89",
      insetA: "15%",
      insetB: "30%",
      radiusA: "50%",
      rotateA: "-12deg",
    },
  },
  {
    title: "idling cars",
    kicker: "scene 06 / background rhythm",
    copy:
      "the low hum is not silence, but it gives silence a shape.",
    art: {
      bg: "#176b8f",
      insetA: "20% 10%",
      insetB: "44% 18%",
      radiusA: "6px",
      rotateA: "2deg",
    },
  },
];

const storeItems = [
  {
    name: "glass bottle milk",
    note: "fancy for no reason",
    price: 2.19,
    color: "#fff6cf",
    icon: "#d9eef2",
  },
  {
    name: "paper carton milk",
    note: "nostalgia with a fold",
    price: 1.79,
    color: "#d9eef2",
    icon: "#fffdf5",
  },
  {
    name: "hawaiian mac salad",
    note: "best in the world",
    price: 4.49,
    color: "#f1bf2f",
    icon: "#fff7d6",
  },
  {
    name: "plastic-coated coupon",
    note: "5 percent still feels ceremonial",
    price: 0.05,
    color: "#a9d9cc",
    icon: "#c8372a",
  },
  {
    name: "fun balloon",
    note: "a serious adult deterrent",
    price: 1.25,
    color: "#d76a89",
    icon: "#f7c2d1",
  },
  {
    name: "marker for waymo",
    note: "human disobedience aisle",
    price: 3.2,
    color: "#b7a7ef",
    icon: "#111111",
  },
];

const fieldNotes = [
  {
    tag: "love",
    title: "valuable love cannot be sprayed everywhere",
    copy:
      "say it often, but make sure the recipient knows it is not cheap.",
    color: "#f3c5cf",
  },
  {
    tag: "taste",
    title: "people who care about the pen, the socks, the hair",
    copy:
      "not for other people. because they know what they want and choose accordingly.",
    color: "#fff0b8",
  },
  {
    tag: "work",
    title: "software for software teams feels too inward",
    copy:
      "the better room is full of real people with difficult, real problems.",
    color: "#bfe4dc",
  },
  {
    tag: "personality",
    title: "stop listing the impressive thing",
    copy:
      "say why it mattered, what went wrong, and what it made you notice.",
    color: "#b9d8ed",
  },
  {
    tag: "art",
    title: "consuming art in isolation still changes the work",
    copy:
      "the trick is noticing the thoughts that appear while the movie, song, or frame is still moving.",
    color: "#d8cdf1",
  },
  {
    tag: "speed",
    title: "luck is a weak explanation",
    copy:
      "iteration speed and the ability to turn rough material into gold explain more.",
    color: "#f2a35f",
  },
];

const tastes = [
  ["pen", "ink should feel decisive"],
  ["socks", "color belongs in private"],
  ["car", "fun beats merely acceptable"],
  ["slide", "one graded image"],
  ["cofounder", "calmly blunt early"],
  ["store", "visit the local one"],
];

let currentThought = 0;
let currentScene = 0;
let stareInterval = null;
let stareSeconds = 0;
let idleAudio = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function getJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function setJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function routeFromHash() {
  const candidate = window.location.hash.replace("#", "") || "home";
  return $(`#route-${candidate}`) ? candidate : "home";
}

function setRoute(route) {
  $$(".view").forEach((view) => view.classList.remove("active"));
  $(`#route-${route}`)?.classList.add("active");
  $$("[data-route-link]").forEach((link) => {
    const active = link.dataset.routeLink === route;
    link.classList.toggle("active", active);
    link.toggleAttribute("aria-current", active);
  });
  document.body.dataset.route = route;
  window.scrollTo({ top: 0, behavior: "auto" });
}

function applyGrade(grade) {
  document.body.classList.remove(...gradeClasses);
  document.body.classList.add(grade);
  setJson(storage.grade, grade);
  $$("[data-grade]").forEach((button) => {
    const active = button.dataset.grade === grade;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderHomeThought() {
  const thought = homeThoughts[currentThought % homeThoughts.length];
  $("#current-reel-title").textContent = thought.title;
  $("#current-reel-copy").textContent = thought.copy;
}

function renderScene(index) {
  currentScene = (index + scenes.length) % scenes.length;
  const scene = scenes[currentScene];
  $("#scene-title").textContent = scene.title;
  $("#scene-kicker").textContent = scene.kicker;
  $("#scene-copy").textContent = scene.copy;

  const image = $("#projector-image");
  if (scene.image) {
    image.src = scene.image;
    image.alt = scene.title;
    image.style.display = "block";
    $(".projector").style.setProperty("--fallback-art", "transparent");
  } else {
    image.removeAttribute("src");
    image.alt = "";
    image.style.display = "none";
    $(".projector").style.setProperty("--fallback-art", scene.art.bg);
  }

  $$(".still-card").forEach((card, cardIndex) => {
    card.classList.toggle("active", cardIndex === currentScene);
  });
}

function stillVisual(scene) {
  if (scene.image) {
    return `<img src="${scene.image}" alt="${scene.title}" />`;
  }
  const style = [
    `--art-bg:${scene.art.bg}`,
    `--inset-a:${scene.art.insetA}`,
    `--inset-b:${scene.art.insetB}`,
    `--radius-a:${scene.art.radiusA}`,
    `--rotate-a:${scene.art.rotateA}`,
  ].join(";");
  return `<span class="still-art" style="${style}" aria-hidden="true"></span>`;
}

function renderStills() {
  const grid = $("#still-grid");
  grid.innerHTML = scenes
    .map(
      (scene, index) => `
        <button class="still-card" type="button" data-scene="${index}">
          ${stillVisual(scene)}
          <div>
            <h2>${scene.title}</h2>
            <p>${scene.copy}</p>
          </div>
        </button>
      `,
    )
    .join("");
  grid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-scene]");
    if (!card) return;
    renderScene(Number(card.dataset.scene));
    window.location.hash = "cinema";
  });
}

function renderWallNotes() {
  const layer = $("#wall-note-layer");
  const notes = getJson(storage.wallNotes, []);
  layer.replaceChildren();
  notes.forEach((note) => {
    const node = document.createElement("div");
    node.className = "wall-note";
    node.textContent = note.text;
    node.style.left = `${note.x}%`;
    node.style.top = `${note.y}%`;
    node.style.transform = `rotate(${note.rotate}deg)`;
    layer.appendChild(node);
  });
}

function pinWallNote() {
  const input = $("#wall-note");
  const text = input.value.trim() || " ";
  const notes = getJson(storage.wallNotes, []);
  notes.push({
    text,
    x: Math.round(8 + Math.random() * 64),
    y: Math.round(10 + Math.random() * 62),
    rotate: Math.round(-4 + Math.random() * 8),
  });
  setJson(storage.wallNotes, notes.slice(-18));
  input.value = "";
  renderWallNotes();
}

function updateStareClock() {
  const minutes = String(Math.floor(stareSeconds / 60)).padStart(2, "0");
  const seconds = String(stareSeconds % 60).padStart(2, "0");
  $("#stare-clock").textContent = `${minutes}:${seconds}`;
}

function toggleStare() {
  const button = $("#stare-toggle");
  if (stareInterval) {
    clearInterval(stareInterval);
    stareInterval = null;
    button.textContent = "start";
    return;
  }
  button.textContent = "pause";
  stareInterval = setInterval(() => {
    stareSeconds += 1;
    updateStareClock();
  }, 1000);
}

function renderStore() {
  const shelves = $("#shelves");
  shelves.replaceChildren();
  storeItems.forEach((item, index) => {
    const button = document.createElement("button");
    button.className = "shelf-item";
    button.type = "button";
    button.dataset.itemIndex = String(index);
    button.style.setProperty("--item-color", item.color);
    button.style.setProperty("--icon-color", item.icon);

    const icon = document.createElement("span");
    icon.className = "shelf-icon";
    icon.setAttribute("aria-hidden", "true");
    const name = document.createElement("strong");
    name.textContent = item.name;
    const note = document.createElement("small");
    note.textContent = item.note;
    button.append(icon, name, note);
    shelves.appendChild(button);
  });
}

function renderReceipt() {
  const receipt = getJson(storage.receipt, []);
  const lines = $("#receipt-lines");
  lines.replaceChildren();

  if (!receipt.length) {
    const empty = document.createElement("p");
    empty.textContent = "no purchases yet";
    lines.appendChild(empty);
  } else {
    receipt.forEach((entry) => {
      const line = document.createElement("div");
      line.className = "receipt-line";
      const name = document.createElement("span");
      name.textContent = entry.name;
      const price = document.createElement("span");
      price.textContent = `$${entry.price.toFixed(2)}`;
      line.append(name, price);
      lines.appendChild(line);
    });
  }

  const total = receipt.reduce((sum, entry) => sum + entry.price, 0);
  $("#receipt-total").textContent = `$${total.toFixed(2)}`;
}

function addReceiptItem(index) {
  const item = storeItems[index];
  const receipt = getJson(storage.receipt, []);
  receipt.push({ name: item.name, price: item.price });
  setJson(storage.receipt, receipt.slice(-12));
  renderReceipt();
}

function printCoupon() {
  const coupon = $("#coupon");
  const options = [
    "5% off nostalgic milk",
    "free tiny luxury with any errand",
    "one mac salad with proof of sincerity",
    "coupon valid within a two-mile radius",
  ];
  coupon.querySelector("strong").textContent =
    options[Math.floor(Math.random() * options.length)];
  coupon.classList.remove("pop");
  void coupon.offsetWidth;
  coupon.classList.add("pop");
}

function renderLetters() {
  const letters = getJson(storage.letters, []);
  const bin = $("#mail-bin");
  bin.replaceChildren();
  letters.forEach((letter) => {
    const card = document.createElement("article");
    card.className = "mailer";
    const to = document.createElement("strong");
    to.textContent = `to: ${letter.to}`;
    const date = document.createElement("span");
    date.textContent = letter.date;
    const body = document.createElement("p");
    body.textContent = letter.body;
    card.append(to, date, body);
    bin.appendChild(card);
  });
}

function sendLetter() {
  const toInput = $("#letter-to");
  const bodyInput = $("#letter-body");
  const to = toInput.value.trim() || "someone specific";
  const body = bodyInput.value.trim() || "i love you, and i mean it.";
  const letters = getJson(storage.letters, []);
  letters.unshift({
    to,
    body,
    date: new Date().toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  });
  setJson(storage.letters, letters.slice(0, 9));
  toInput.value = "";
  bodyInput.value = "";
  animateMessage(body);
  renderLetters();
}

function animateMessage(text) {
  const message = $("#traveling-message");
  message.textContent = text.length > 50 ? `${text.slice(0, 47)}...` : text;
  message.classList.remove("travel");
  void message.offsetWidth;
  message.classList.add("travel");
}

function renderFieldbook() {
  const board = $("#notes-board");
  board.replaceChildren();
  fieldNotes.forEach((note) => {
    const card = document.createElement("article");
    card.className = "note-card";
    card.style.setProperty("--note-color", note.color);
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = note.tag;
    const title = document.createElement("h2");
    title.textContent = note.title;
    const copy = document.createElement("p");
    copy.textContent = note.copy;
    card.append(tag, title, copy);
    board.appendChild(card);
  });

  const tasteList = $("#taste-list");
  tasteList.replaceChildren();
  tastes.forEach(([name, note]) => {
    const row = document.createElement("div");
    row.className = "taste-pill";
    const label = document.createElement("strong");
    label.textContent = name;
    const copy = document.createElement("span");
    copy.textContent = note;
    row.append(label, copy);
    tasteList.appendChild(row);
  });
}

function updateCustomerSplit(value) {
  const customer = Number(value);
  const build = 100 - customer;
  $("#customer-percent").textContent = `${customer}%`;
  $("#build-percent").textContent = `${build}%`;
  $(".split-meter").style.setProperty("--customer", `${customer}%`);

  const customerBlocks = Math.round(customer / 10);
  const strip = $("#calendar-strip");
  strip.replaceChildren();
  for (let i = 0; i < 10; i += 1) {
    const block = document.createElement("span");
    block.className = `calendar-block${i >= customerBlocks ? " build" : ""}`;
    block.title = i >= customerBlocks ? "building" : "customers";
    strip.appendChild(block);
  }
}

function startIdleAudio() {
  if (idleAudio) {
    idleAudio.context.close();
    idleAudio = null;
    $("#idle-sound").textContent = "start idling track";
    return;
  }

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    $("#idle-sound").textContent = "audio unavailable";
    return;
  }

  const context = new AudioContext();
  const gain = context.createGain();
  const low = context.createOscillator();
  const wobble = context.createOscillator();
  const wobbleGain = context.createGain();
  const filter = context.createBiquadFilter();

  low.type = "sawtooth";
  low.frequency.value = 41;
  wobble.type = "sine";
  wobble.frequency.value = 6.3;
  wobbleGain.gain.value = 3.5;
  filter.type = "lowpass";
  filter.frequency.value = 160;
  gain.gain.value = 0.035;

  wobble.connect(wobbleGain);
  wobbleGain.connect(low.frequency);
  low.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  low.start();
  wobble.start();

  idleAudio = { context };
  $("#idle-sound").textContent = "stop idling track";
}

function bindEvents() {
  window.addEventListener("hashchange", () => setRoute(routeFromHash()));

  $("#shuffle-reel").addEventListener("click", () => {
    currentThought = (currentThought + 1) % homeThoughts.length;
    renderHomeThought();
  });

  $$("[data-grade]").forEach((button) => {
    button.addEventListener("click", () => applyGrade(button.dataset.grade));
  });

  $("#prev-scene").addEventListener("click", () => renderScene(currentScene - 1));
  $("#next-scene").addEventListener("click", () => renderScene(currentScene + 1));

  $("#grain-range").addEventListener("input", (event) => {
    document.documentElement.style.setProperty(
      "--grain-opacity",
      String(Number(event.target.value) / 100),
    );
  });

  $("#leak-range").addEventListener("input", (event) => {
    document.documentElement.style.setProperty(
      "--leak-opacity",
      String(Number(event.target.value) / 100),
    );
  });

  $("#idle-sound").addEventListener("click", startIdleAudio);
  $("#pin-wall-note").addEventListener("click", pinWallNote);
  $("#clear-wall").addEventListener("click", () => {
    setJson(storage.wallNotes, []);
    renderWallNotes();
  });
  $("#stare-toggle").addEventListener("click", toggleStare);
  $("#blank-toggle").addEventListener("click", () => {
    $("#polar-caption").classList.toggle("visible");
  });

  $("#shelves").addEventListener("click", (event) => {
    const item = event.target.closest("[data-item-index]");
    if (!item) return;
    addReceiptItem(Number(item.dataset.itemIndex));
  });
  $("#print-coupon").addEventListener("click", printCoupon);
  $("#send-letter").addEventListener("click", sendLetter);
  $("#clear-letters").addEventListener("click", () => {
    setJson(storage.letters, []);
    renderLetters();
  });
  $("#customer-range").addEventListener("input", (event) => {
    updateCustomerSplit(event.target.value);
  });
}

function init() {
  applyGrade(getJson(storage.grade, "grade-cinema"));
  renderHomeThought();
  renderStills();
  renderScene(0);
  renderWallNotes();
  renderStore();
  renderReceipt();
  renderLetters();
  renderFieldbook();
  updateCustomerSplit($("#customer-range").value);
  bindEvents();
  setRoute(routeFromHash());
}

init();
