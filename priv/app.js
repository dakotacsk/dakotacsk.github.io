const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalKicker = document.getElementById("modal-kicker");
const modalMeta = document.getElementById("modal-meta");
const modalContent = document.getElementById("modal-content");

let entries = {};

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  match[1].split("\n").forEach((line) => {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (m) meta[m[1]] = m[2].trim();
  });
  return { meta, body: match[2].trim() };
}

function parseMarkdownToBlocks(md) {
  const html = marked.parse(md);
  const div = document.createElement("div");
  div.innerHTML = html;

  const blocks = [];
  const textParts = [];

  div.childNodes.forEach((node) => {
    if (node.tagName === "IMG") {
      if (textParts.length) {
        blocks.push({ type: "text", html: textParts.join("") });
        textParts.length = 0;
      }
      const src = node.getAttribute("src") || "";
      const caption = node.getAttribute("alt") || "";
      blocks.push({ type: "image", src, caption });
    } else if (node.nodeType === Node.ELEMENT_NODE && node.innerHTML) {
      textParts.push(node.outerHTML);
    }
  });
  if (textParts.length) {
    blocks.push({ type: "text", html: textParts.join("") });
  }
  return blocks;
}

async function loadEntries() {
  const topics = ["civics", "skating", "music"];
  await Promise.all(
    topics.map(async (topic) => {
      const res = await fetch(`entries/${topic}.md`);
      const raw = await res.text();
      const { meta, body } = parseFrontmatter(raw);
      const blocks = parseMarkdownToBlocks(body);
      entries[topic] = {
        kicker: meta.kicker || "",
        title: meta.title || topic,
        meta: meta.meta || "",
        blocks,
      };
    })
  );
}


function openModal(topicKey) {
  const entry = entries[topicKey];
  if (!entry) return;

  modalKicker.textContent = entry.kicker;
  modalTitle.textContent = entry.title;
  modalMeta.textContent = entry.meta;

  // Single continuous flow: render blocks in markdown order
  modalContent.innerHTML = "";
  entry.blocks.forEach((b) => {
    if (b.type === "text") {
      const div = document.createElement("div");
      div.className = "journal__prose";
      div.innerHTML = b.html;
      modalContent.appendChild(div);
    } else {
      const figure = document.createElement("figure");
      figure.className = "journal__figure";
      figure.innerHTML = `
        <img class="journal__img" src="${b.src}" alt="${b.caption.replace(/"/g, "&quot;")}" loading="lazy" />
        <figcaption class="journal__caption">${b.caption}</figcaption>
      `;
      modalContent.appendChild(figure);
    }
  });

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // prevent background scrolling
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "hidden";
}

// load entries (handlers work once loaded)
loadEntries().catch((err) => console.error("Failed to load entries:", err));

// click cutouts – attach immediately so they always respond
document.querySelectorAll(".cutout").forEach((btn) => {
  btn.addEventListener("click", () => openModal(btn.dataset.topic));
});

// click overlay / close button
modal.addEventListener("click", (e) => {
  if (e.target?.dataset?.close === "true") closeModal();
});

// esc to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});

// Scroll down → scroll horizontally (on wide screens only, for smoother feel)
const cutoutsGrid = document.querySelector(".cutouts-grid");
cutoutsGrid.addEventListener(
  "wheel",
  (e) => {
    if (modal.classList.contains("is-open")) return;
    if (e.deltaY === 0) return;
    if (window.innerWidth < 768) return;
    e.preventDefault();
    cutoutsGrid.scrollLeft += e.deltaY * 0.65;
  },
  { passive: false }
);
