const STORAGE_KEY = "bloom_todos_v1";

const state = {
  todos: [],
  targetVideoTime: 0,
  playMode: "idle",
  reverseRaf: null,
  reverseLastTs: 0,
  reverseSpeed: 0.55,
};

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const lilyVideo = document.getElementById("lily-video");

function makeId() {
  if (window.crypto && "randomUUID" in window.crypto) {
    return window.crypto.randomUUID();
  }
  return `todo-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((todo) => todo && typeof todo.id === "string")
      .map((todo) => ({
        id: todo.id,
        text: typeof todo.text === "string" ? todo.text : "",
        completed: Boolean(todo.completed),
      }));
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
}

function getCounts() {
  const total = state.todos.length;
  const completed = state.todos.filter((todo) => todo.completed).length;
  return { total, completed };
}

function moveVideoToRatio(ratio) {
  if (!lilyVideo.duration || Number.isNaN(lilyVideo.duration)) return;

  const maxTime = Math.max(0, lilyVideo.duration - 0.01);
  const nextTime = Math.min(maxTime, Math.max(0, ratio * lilyVideo.duration));
  const current = lilyVideo.currentTime || 0;

  state.targetVideoTime = nextTime;

  if (Math.abs(nextTime - current) <= 0.02) {
    stopReversePlayback();
    state.playMode = "idle";
    lilyVideo.pause();
    lilyVideo.currentTime = nextTime;
    setBloomRatioFromTime(nextTime);
    return;
  }

  if (nextTime > current) {
    startForwardPlayback();
    return;
  }

  startReversePlayback();
}

function syncVideoProgress() {
  setBloomRatioFromTime(lilyVideo.currentTime);

  if (state.playMode !== "forward") return;
  if (lilyVideo.currentTime < state.targetVideoTime - 0.02) return;

  lilyVideo.pause();
  lilyVideo.currentTime = state.targetVideoTime;
  setBloomRatioFromTime(state.targetVideoTime);
  state.playMode = "idle";
}

function updateVideoProgress() {
  const { total, completed } = getCounts();
  const ratio = total === 0 ? 0 : completed / total;
  moveVideoToRatio(ratio);
}

function stopReversePlayback() {
  if (state.reverseRaf !== null) {
    cancelAnimationFrame(state.reverseRaf);
    state.reverseRaf = null;
  }
  state.reverseLastTs = 0;
}

function setBloomRatioFromTime(timeInSeconds) {
  if (!lilyVideo.duration || Number.isNaN(lilyVideo.duration) || lilyVideo.duration <= 0) return;
  const ratio = Math.min(1, Math.max(0, timeInSeconds / lilyVideo.duration));
  document.documentElement.style.setProperty("--bloom-ratio", ratio.toFixed(4));
}

function startForwardPlayback() {
  stopReversePlayback();
  state.playMode = "forward";
  lilyVideo.playbackRate = 1;
  lilyVideo.play().catch(() => {
    state.playMode = "idle";
  });
}

function startReversePlayback() {
  stopReversePlayback();
  state.playMode = "reverse";
  lilyVideo.pause();

  const step = (timestamp) => {
    if (state.playMode !== "reverse") return;

    if (!state.reverseLastTs) {
      state.reverseLastTs = timestamp;
    }

    const elapsed = (timestamp - state.reverseLastTs) / 1000;
    state.reverseLastTs = timestamp;
    const nextTime = Math.max(
      state.targetVideoTime,
      lilyVideo.currentTime - elapsed * state.reverseSpeed,
    );
    lilyVideo.currentTime = nextTime;
    setBloomRatioFromTime(nextTime);

    if (nextTime <= state.targetVideoTime + 0.02) {
      lilyVideo.currentTime = state.targetVideoTime;
      setBloomRatioFromTime(state.targetVideoTime);
      state.playMode = "idle";
      stopReversePlayback();
      return;
    }

    state.reverseRaf = requestAnimationFrame(step);
  };

  state.reverseRaf = requestAnimationFrame(step);
}

function renderTodos() {
  list.innerHTML = "";

  if (state.todos.length === 0) {
    const empty = document.createElement("li");
    empty.className = "todo-item empty-state";
    empty.textContent = "No tasks yet";
    list.appendChild(empty);
    return;
  }

  state.todos.forEach((todo, index) => {
    const item = document.createElement("li");
    item.className = `todo-item${todo.completed ? " completed" : ""}`;
    item.style.setProperty("--i", String(index));

    const toggle = document.createElement("input");
    toggle.className = "todo-toggle";
    toggle.type = "checkbox";
    toggle.checked = todo.completed;
    toggle.setAttribute("aria-label", `Mark "${todo.text || "task"}" complete`);
    toggle.addEventListener("change", () => {
      todo.completed = toggle.checked;
      saveTodos();
      item.classList.toggle("completed", todo.completed);
      updateVideoProgress();
    });

    const text = document.createElement("input");
    text.className = "todo-text";
    text.type = "text";
    text.value = todo.text;
    text.maxLength = 160;
    text.placeholder = "Edit task";
    text.addEventListener("input", () => {
      todo.text = text.value;
      saveTodos();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.type = "button";
    deleteBtn.setAttribute("aria-label", "Delete todo");
    deleteBtn.textContent = "×";
    deleteBtn.addEventListener("click", () => {
      state.todos = state.todos.filter((itemTodo) => itemTodo.id !== todo.id);
      saveTodos();
      render();
    });

    item.append(toggle, text, deleteBtn);
    list.appendChild(item);
  });
}

function addTodo(todoText) {
  const cleaned = todoText.trim();
  if (!cleaned) return;

  state.todos.unshift({
    id: makeId(),
    text: cleaned,
    completed: false,
  });

  saveTodos();
  render();
}

function render() {
  renderTodos();
  updateVideoProgress();
}

function init() {
  state.todos = loadTodos();
  render();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    addTodo(input.value);
    input.value = "";
    input.focus();
  });

  lilyVideo.addEventListener("loadedmetadata", updateVideoProgress);
  lilyVideo.addEventListener("timeupdate", syncVideoProgress);
  lilyVideo.addEventListener("play", syncVideoProgress);

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    state.todos = loadTodos();
    render();
  });
}

init();
