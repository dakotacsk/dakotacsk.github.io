const routes = ["screening", "stills", "wall", "store", "letters", "notes"];

const scenes = [
  {
    title: "convenience green",
    kicker: "scene 01 / convenience green",
    image: "../archive/img/me_at_urban.jpeg",
    grade: "neon",
    copy:
      "i love when one image does the whole thing. no overexplaining. just a frame that makes you feel like maybe your life was already cinematic and you were too busy coding to notice.",
    caption: "a funny hat, fake flowers, fluorescent light, and taste that does not need to explain itself.",
  },
  {
    title: "ceiling light",
    kicker: "scene 02 / look up",
    image: "../blogs/img/town_hall.jpeg",
    grade: "folksy",
    copy:
      "i love looking at ceilings because people don't look at them often. they feel boring until you realize the ceiling is basically the room's private face.",
    caption: "a town hall but mostly a ceiling study. honestly the ceiling is doing so much.",
  },
  {
    title: "falling weather",
    kicker: "scene 03 / falling without injury",
    image: "../blogs/img/me_jumping.jpg",
    grade: "cloud",
    copy:
      "i imagined jumping from my balcony not to die but to feel the thrill of falling. in a world where falling only hurt as feeling, elevators would still exist. i would still jump.",
    caption: "the body in a cloud frame. the thought of descent made weirdly gentle.",
  },
  {
    title: "blank paper snow",
    kicker: "scene 04 / imagined versus real",
    image: "../blogs/img/banner_edge.jpeg",
    grade: "cloud",
    copy:
      "i think about the blank paper story a lot. it's a polar bear in snow looking at snowflakes and everything is white. obviously. that's the whole point.",
    caption: "imagined versus real, except the imagined side might be doing more work.",
  },
  {
    title: "one image slide",
    kicker: "scene 05 / moon slide",
    image: "../img/moon.jpg",
    grade: "midnight",
    copy:
      "i love slides that just have a well color graded image on them. it tells a story. it lets the room do the thinking instead of yelling bullet points at everyone.",
    caption: "a moon, centered, with enough silence around it to make the slide feel intentional.",
  },
  {
    title: "nice day bag",
    kicker: "scene 06 / cute object theory",
    image: "../img/thankyou_bags.gif",
    grade: "neon",
    copy:
      "i love cute things that people clearly thought about and created. people need to stop being so serious. a plastic bag with a smile can carry a whole worldview.",
    caption: "a bag that says have a nice day and somehow means it more than most software does.",
  },
];

const grades = [
  { key: "neon", label: "convenience neon", swatch: "#0a7f61" },
  { key: "midnight", label: "room in the dark", swatch: "#171717" },
  { key: "cloud", label: "cloudless blue", swatch: "#5fb2ef" },
  { key: "folksy", label: "old folksy", swatch: "#cb573d" },
];

const storeItems = [
  { name: "glass bottle milk", note: "cold, heavy, weirdly fancy.", price: 2.79 },
  { name: "plastic coupon", note: "cheap but laminated so it matters.", price: 0.05 },
  { name: "mac salad", note: "hawaiians are correct about this.", price: 4.49 },
  { name: "fun balloon", note: "a solid color trying to leave.", price: 1.99 },
  { name: "paper carton", note: "childhood as packaging.", price: 2.19 },
  { name: "thank you bag", note: "perfect cheap graphic design.", price: 0.1 },
  { name: "late night snack", note: "a city meal in one hand.", price: 3.25 },
  { name: "cloud receipt", note: "san francisco owes me clouds.", price: 0 },
];

const notes = [
  {
    title: "art as weather",
    text:
      "i care so much about film and music and art, but i do not always talk about it because i consume it in isolation. this site should catch those thoughts before they disappear.",
    footer: "references: wong kar-wai, coco, old frames, lonely rooms",
  },
  {
    title: "taste is specific",
    text:
      "i need people with taste in my life. people who care what pen they use and what color their socks are because they know what they want.",
    footer: "rule: know what you want before looking around",
  },
  {
    title: "stop performing",
    text:
      "i do not care that you hacked nasa or whatever. tell me why you did it, what was funny, what changed. have some personality ffs.",
    footer: "anti-introduction: fewer credentials, better story",
  },
  {
    title: "real problems",
    text:
      "i don't really like software ideas for software teams. i like working with real people who have difficult, real problems.",
    footer: "schedule: 80% talking to customers and 20% everything else",
  },
  {
    title: "disconnect to return",
    text:
      "i don't think social media should exist. people need to be more disconnected so they can come back together for real.",
    footer: "protocol: one message, one person, no audience",
  },
  {
    title: "iteration as luck",
    text:
      "i don't believe in luck. i believe in speed of iteration and personal ability to turn shit into gold.",
    footer: "material: scraps, wrong turns, field notes",
  },
];

const storage = {
  get(key, fallback) {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Persistence is optional.
    }
  },
};

const state = {
  sceneIndex: 0,
  receipt: [],
  wallNotes: storage.get("altCinemaWallNotes", []),
  letters: storage.get("altCinemaLetters", []),
  stareTimer: null,
  stareStartedAt: 0,
  stareElapsed: 0,
  idleAudio: null,
};

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

function setRoute(route) {
  const safeRoute = routes.includes(route) ? route : "screening";

  qsa(".view").forEach((view) => {
    view.classList.toggle("active", view.id === `view-${safeRoute}`);
  });

  qsa("[data-route]").forEach((node) => {
    node.classList.toggle("active", node.dataset.route === safeRoute);
  });

  if (window.location.hash.replace("#", "") !== safeRoute) {
    window.history.replaceState(null, "", `#${safeRoute}`);
  }

  window.scrollTo({ top: 0, behavior: "auto" });
}

function bindRoutes() {
  qsa("[data-route]").forEach((node) => {
    const open = () => setRoute(node.dataset.route);
    node.addEventListener("click", open);
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });

  window.addEventListener("hashchange", () => setRoute(window.location.hash.replace("#", "")));
  setRoute(window.location.hash.replace("#", "") || "screening");
}

function applyGrade(key) {
  grades.forEach((grade) => document.body.classList.remove(`grade-${grade.key}`));
  document.body.classList.add(`grade-${key}`);

  qsa(".grade-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.grade === key);
  });
}

function renderScene(index) {
  state.sceneIndex = (index + scenes.length) % scenes.length;
  const scene = scenes[state.sceneIndex];

  qs("#hero-still").src = scene.image;
  qs("#hero-still").alt = scene.title;
  qs("#scene-title").textContent = scene.title;
  qs("#scene-kicker").textContent = scene.kicker;
  qs("#scene-copy").textContent = scene.copy;
  applyGrade(scene.grade);

  qsa(".filmstrip-button").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.index) === state.sceneIndex);
  });
}

function setupFilm() {
  const filmstrip = qs("#filmstrip");
  const gradeButtons = qs("#grade-buttons");
  const stillGrid = qs("#still-grid");

  scenes.forEach((scene, index) => {
    const button = document.createElement("button");
    button.className = "filmstrip-button";
    button.type = "button";
    button.dataset.index = String(index);
    button.innerHTML = `<img src="${scene.image}" alt=""><span>${scene.title}</span>`;
    button.addEventListener("click", () => renderScene(index));
    filmstrip.appendChild(button);

    const card = document.createElement("article");
    card.className = "still-card";
    card.tabIndex = 0;
    card.innerHTML = `
      <img src="${scene.image}" alt="${scene.title}">
      <div class="still-caption">
        <span class="still-kicker">${scene.kicker}</span>
        <h2>${scene.title}</h2>
        <p>${scene.caption}</p>
      </div>
    `;
    const openStill = () => {
      renderScene(index);
      setRoute("screening");
    };
    card.addEventListener("click", openStill);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openStill();
      }
    });
    stillGrid.appendChild(card);
  });

  grades.forEach((grade) => {
    const button = document.createElement("button");
    button.className = "grade-button";
    button.type = "button";
    button.dataset.grade = grade.key;
    button.innerHTML = `<span class="swatch" style="background:${grade.swatch}"></span><span>${grade.label}</span>`;
    button.addEventListener("click", () => applyGrade(grade.key));
    gradeButtons.appendChild(button);
  });

  qs("#previous-scene").addEventListener("click", () => renderScene(state.sceneIndex - 1));
  qs("#next-scene").addEventListener("click", () => renderScene(state.sceneIndex + 1));

  qs("#grain-range").addEventListener("input", (event) => {
    document.documentElement.style.setProperty("--grain", String(Number(event.target.value) / 100));
  });

  qs("#light-range").addEventListener("input", (event) => {
    document.documentElement.style.setProperty("--leak", String(Number(event.target.value) / 100));
  });

  renderScene(0);
}

function setupIdleAudio() {
  const toggle = qs("#idle-toggle");
  const meter = qs(".projection-meter");

  function stopIdle() {
    if (!state.idleAudio) return;

    const { context, nodes, interval } = state.idleAudio;
    window.clearInterval(interval);
    nodes.forEach((node) => {
      try {
        node.stop();
      } catch {
        node.disconnect();
      }
    });
    context.close();
    state.idleAudio = null;
    toggle.textContent = "start idling track";
    toggle.classList.remove("active");
    meter.classList.remove("active");
  }

  function startIdle() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const context = new AudioContext();
    const master = context.createGain();
    master.gain.value = 0.036;
    master.connect(context.destination);

    const low = context.createOscillator();
    low.type = "sawtooth";
    low.frequency.value = 45;

    const wobble = context.createOscillator();
    wobble.type = "sine";
    wobble.frequency.value = 91;

    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 165;

    low.connect(filter);
    wobble.connect(filter);
    filter.connect(master);
    low.start();
    wobble.start();

    const interval = window.setInterval(() => {
      const drift = 43 + Math.random() * 7;
      low.frequency.setTargetAtTime(drift, context.currentTime, 0.22);
      wobble.frequency.setTargetAtTime(drift * 2 + Math.random() * 8, context.currentTime, 0.22);
      filter.frequency.setTargetAtTime(145 + Math.random() * 90, context.currentTime, 0.25);
    }, 420);

    state.idleAudio = { context, nodes: [low, wobble], interval };
    toggle.textContent = "stop idling track";
    toggle.classList.add("active");
    meter.classList.add("active");
  }

  toggle.addEventListener("click", () => {
    if (state.idleAudio) stopIdle();
    else startIdle();
  });
}

function setupWall() {
  const input = qs("#wall-input");
  const notesEl = qs("#wall-notes");
  const snow = qs("#snow-caption");
  const snowToggle = qs("#snow-toggle");
  const stareTime = qs("#stare-time");
  const stareToggle = qs("#stare-toggle");

  function renderWall() {
    notesEl.innerHTML = "";
    state.wallNotes.forEach((note) => {
      const el = document.createElement("article");
      el.className = "wall-note";
      el.textContent = note.text;
      el.style.left = `${note.x}%`;
      el.style.top = `${note.y}%`;
      el.style.transform = `rotate(${note.r}deg)`;
      notesEl.appendChild(el);
    });
  }

  function saveNote() {
    const text = input.value.trim();
    if (!text) return;

    state.wallNotes.push({
      text,
      x: 6 + Math.random() * 62,
      y: 10 + Math.random() * 66,
      r: -3 + Math.random() * 6,
    });
    state.wallNotes = state.wallNotes.slice(-12);
    storage.set("altCinemaWallNotes", state.wallNotes);
    input.value = "";
    renderWall();
  }

  function renderStareTime() {
    const elapsed = state.stareTimer ? state.stareElapsed + Date.now() - state.stareStartedAt : state.stareElapsed;
    const seconds = Math.floor(elapsed / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    stareTime.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  qs("#pin-note").addEventListener("click", saveNote);
  input.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") saveNote();
  });

  qs("#clear-wall").addEventListener("click", () => {
    state.wallNotes = [];
    storage.set("altCinemaWallNotes", state.wallNotes);
    renderWall();
  });

  snowToggle.addEventListener("click", () => {
    snow.classList.toggle("active");
    snowToggle.textContent = snow.classList.contains("active") ? "hide the blank drawing" : "reveal the blank drawing";
  });

  stareToggle.addEventListener("click", () => {
    if (state.stareTimer) {
      window.clearInterval(state.stareTimer);
      state.stareTimer = null;
      state.stareElapsed += Date.now() - state.stareStartedAt;
      stareToggle.textContent = "start";
      renderStareTime();
      return;
    }

    state.stareStartedAt = Date.now();
    state.stareTimer = window.setInterval(renderStareTime, 250);
    stareToggle.textContent = "pause";
  });

  renderWall();
  renderStareTime();
}

function setupStore() {
  const shelf = qs("#shelf-row");
  const list = qs("#receipt-list");
  const total = qs("#receipt-total");
  const coupon = qs("#coupon-output");

  function renderReceipt() {
    list.innerHTML = "";
    if (!state.receipt.length) {
      const empty = document.createElement("p");
      empty.textContent = "no tiny luxuries yet.";
      list.appendChild(empty);
    }

    state.receipt.forEach((item) => {
      const line = document.createElement("div");
      line.className = "receipt-line";
      line.innerHTML = `<span>${item.name}</span><strong>$${item.price.toFixed(2)}</strong>`;
      list.appendChild(line);
    });

    const sum = state.receipt.reduce((acc, item) => acc + item.price, 0);
    total.textContent = `$${sum.toFixed(2)}`;
  }

  storeItems.forEach((item) => {
    const button = document.createElement("button");
    button.className = "shelf-item";
    button.type = "button";
    button.innerHTML = `
      <span class="product-shape" aria-hidden="true"></span>
      <span>
        <h3>${item.name}</h3>
        <p>${item.note}</p>
        <span class="price">$${item.price.toFixed(2)}</span>
      </span>
    `;
    button.addEventListener("click", () => {
      state.receipt.push(item);
      renderReceipt();
    });
    shelf.appendChild(button);
  });

  qs("#print-coupon").addEventListener("click", () => {
    const item = storeItems[Math.floor(Math.random() * storeItems.length)];
    coupon.innerHTML = `
      <span>coupon</span>
      <strong>${5 + Math.floor(Math.random() * 20)}% off ${item.name.toLowerCase()}</strong>
      <small>valid inside a two-mile radius</small>
    `;
  });

  renderReceipt();
}

function setupLetters() {
  const to = qs("#letter-to");
  const body = qs("#letter-body");
  const bin = qs("#mail-bin");
  const traveling = qs("#traveling-message");

  function renderLetters() {
    bin.innerHTML = "";

    if (!state.letters.length) {
      const empty = document.createElement("article");
      empty.className = "letter-card";
      empty.innerHTML = `
        <span class="letter-stamp">local</span>
        <h3>unsent</h3>
        <p>the quietest inbox is waiting for one deliberate note.</p>
      `;
      bin.appendChild(empty);
      return;
    }

    state.letters.forEach((letter) => {
      const card = document.createElement("article");
      card.className = "letter-card";
      card.innerHTML = `
        <span class="letter-stamp">sent</span>
        <h3>to ${letter.to}</h3>
        <p>${letter.body}</p>
      `;
      bin.prepend(card);
    });
  }

  function sendLetter() {
    const recipient = to.value.trim() || "someone specific";
    const message = body.value.trim();
    if (!message) return;

    state.letters.push({ to: recipient, body: message });
    state.letters = state.letters.slice(-9);
    storage.set("altCinemaLetters", state.letters);

    traveling.classList.remove("traveling");
    void traveling.offsetWidth;
    traveling.classList.add("traveling");

    to.value = "";
    body.value = "";
    renderLetters();
  }

  qs("#send-letter").addEventListener("click", sendLetter);
  qs("#clear-letters").addEventListener("click", () => {
    state.letters = [];
    storage.set("altCinemaLetters", state.letters);
    renderLetters();
  });

  renderLetters();
}

function setupNotes() {
  const grid = qs("#notes-grid");
  notes.forEach((note, index) => {
    const card = document.createElement("article");
    card.className = "note-card";
    card.innerHTML = `
      <span class="note-number">${String(index + 1).padStart(2, "0")}</span>
      <h2>${note.title}</h2>
      <p>${note.text}</p>
      <footer>${note.footer}</footer>
    `;
    grid.appendChild(card);
  });
}

function init() {
  bindRoutes();
  setupFilm();
  setupIdleAudio();
  setupWall();
  setupStore();
  setupLetters();
  setupNotes();
}

init();
