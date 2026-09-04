const STORAGE_KEY = "private-archive-notes-v1";
const TAG_STORAGE_KEY = "private-archive-tags-v1";
const CATEGORY_STORAGE_KEY = "private-archive-categories-v1";
const HIDDEN_CATEGORY_STORAGE_KEY = "private-archive-hidden-v1";
const FOLDER_DB_NAME = "su-knowledge-base";
const FOLDER_DB_STORE = "settings";

const categories = [
  { id: "全部", label: "全部笔记", symbol: "＊", color: "#b84e30" },
  { id: "工作", label: "工作与项目", symbol: "□", color: "#55778a" },
  { id: "阅读", label: "阅读摘录", symbol: "≡", color: "#a26b42" },
  { id: "生活", label: "生活观察", symbol: "○", color: "#7b8b6b" },
  { id: "灵感", label: "灵感碎片", symbol: "✳", color: "#8c6381" }
];

const seedNotes = [
  {
    id: "seed-01",
    title: "先做一个可以被看见的版本",
    category: "工作",
    tags: ["行动", "项目", "复盘"],
    content: "很多项目不是输在能力，而是迟迟没有一个可以被讨论的版本。\n\n先把模糊的想法做成一个粗糙但真实的东西，反馈会自然出现。公开一个半成品，不是降低标准，而是让标准有机会被校准。",
    pinned: true,
    createdAt: "2026-08-28T09:20:00.000Z",
    updatedAt: "2026-09-02T14:10:00.000Z"
  },
  {
    id: "seed-02",
    title: "深度工作的前提是减少切换",
    category: "阅读",
    tags: ["专注", "系统"],
    content: "注意力并不是一盏可以随时打开的灯，它更像是一条需要慢慢走进去的小路。\n\n把通知关掉、把入口藏起来、一次只处理一个上下文。真正有效的效率工具，往往是在帮助我们少做选择。",
    pinned: false,
    createdAt: "2026-08-25T06:30:00.000Z",
    updatedAt: "2026-08-30T08:45:00.000Z"
  },
  {
    id: "seed-03",
    title: "散步时，问题会自己变小",
    category: "生活",
    tags: ["身体", "情绪"],
    content: "当一个问题在脑海里变得巨大，先离开桌面。\n\n走路会把思考从一个封闭的房间带回到真实的世界。很多时候我们需要的不是更用力地想，而是让身体先替我们松动一点。",
    pinned: false,
    createdAt: "2026-08-21T12:00:00.000Z",
    updatedAt: "2026-08-29T16:20:00.000Z"
  },
  {
    id: "seed-04",
    title: "把灵感留在它出现的地方",
    category: "灵感",
    tags: ["创作", "记录"],
    content: "灵感最脆弱的时刻，通常正是我们觉得它不值得记录的时刻。\n\n不要等它变成完整的句子。保留一个词、一种感觉、一段对话，未来的自己会知道该如何把它接起来。",
    pinned: false,
    createdAt: "2026-08-19T18:10:00.000Z",
    updatedAt: "2026-08-27T11:05:00.000Z"
  },
  {
    id: "seed-05",
    title: "每周只问三个问题",
    category: "工作",
    tags: ["复盘", "习惯"],
    content: "这一周什么事情真正推进了我？\n\n什么事情消耗了我，却没有带来进展？\n\n下周只做哪一件事，会让其他事情变得更容易？\n\n复盘的价值不在于证明自己做得好，而在于重新找回选择的主动权。",
    pinned: false,
    createdAt: "2026-08-17T10:15:00.000Z",
    updatedAt: "2026-08-24T09:00:00.000Z"
  },
  {
    id: "seed-06",
    title: "好的工具应该让人更像自己",
    category: "阅读",
    tags: ["工具", "设计"],
    content: "工具不是为了把人变成某一种更高效的样子。\n\n它应该减少重复和摩擦，把时间还给判断、感受与创造。一个真正适合自己的系统，最后会安静地退到背景里。",
    pinned: false,
    createdAt: "2026-08-13T07:45:00.000Z",
    updatedAt: "2026-08-22T13:40:00.000Z"
  }
];

const initialNotes = loadNotes();
const initialCustomTags = loadTags(initialNotes);
const initialCustomCategories = loadCategories();
const initialHiddenCategories = loadHiddenCategories();

const state = {
  notes: initialNotes,
  customTags: initialCustomTags,
  customCategories: initialCustomCategories,
  hiddenCategories: initialHiddenCategories,
  activeCategory: "全部",
  activeTag: "全部",
  query: "",
  selectedNoteId: null
};

const elements = {
  categoryList: document.querySelector("#category-list"),
  tagList: document.querySelector("#tag-list"),
  notesGrid: document.querySelector("#notes-grid"),
  resultCount: document.querySelector("#result-count"),
  currentLocation: document.querySelector("#current-location"),
  todayLabel: document.querySelector("#today-label"),
  searchInput: document.querySelector("#search-input"),
  composerModal: document.querySelector("#composer-modal"),
  detailModal: document.querySelector("#detail-modal"),
  noteForm: document.querySelector("#note-form"),
  composerTitle: document.querySelector("#composer-title"),
  noteId: document.querySelector("#note-id"),
  noteTitle: document.querySelector("#note-title"),
  noteCategory: document.querySelector("#note-category"),
  noteTags: document.querySelector("#note-tags"),
  noteContent: document.querySelector("#note-content"),
  notePinned: document.querySelector("#note-pinned"),
  tagForm: document.querySelector("#tag-form"),
  tagInput: document.querySelector("#tag-input"),
  customTagCount: document.querySelector("#custom-tag-count"),
  customTagList: document.querySelector("#custom-tag-list"),
  categoryForm: document.querySelector("#category-form"),
  categoryInput: document.querySelector("#category-input"),
  customCategoryCount: document.querySelector("#custom-category-count"),
  customCategoryList: document.querySelector("#custom-category-list"),
  detailCategory: document.querySelector("#detail-category"),
  detailTitle: document.querySelector("#detail-title"),
  detailDate: document.querySelector("#detail-date"),
  detailReadTime: document.querySelector("#detail-read-time"),
  detailPinned: document.querySelector("#detail-pinned"),
  detailTags: document.querySelector("#detail-tags"),
  detailContent: document.querySelector("#detail-content"),
  importFile: document.querySelector("#import-file")
};

let saveFolderHandle = null;

function loadNotes() {
  try {
    const savedNotes = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedNotes) ? savedNotes : seedNotes;
  } catch {
    return seedNotes;
  }
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.notes));
  syncToFolder();
}

function loadTags(notes = []) {
  try {
    const savedTagsRaw = localStorage.getItem(TAG_STORAGE_KEY);
    if (savedTagsRaw == null) {
      return [...new Set(notes.flatMap((note) => note.tags || []).map(normalizeTag).filter(Boolean))];
    }
    const savedTags = JSON.parse(savedTagsRaw);
    return Array.isArray(savedTags) ? [...new Set(savedTags.filter(Boolean).map(normalizeTag))] : [];
  } catch {
    return [];
  }
}

function saveTags() {
  localStorage.setItem(TAG_STORAGE_KEY, JSON.stringify(state.customTags));
  syncToFolder();
}

function loadCategories() {
  try {
    const saved = JSON.parse(localStorage.getItem(CATEGORY_STORAGE_KEY));
    return Array.isArray(saved) ? saved.filter((item) => item && item.id && item.label) : [];
  } catch {
    return [];
  }
}

function saveCategories() {
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(state.customCategories));
  syncToFolder();
}

function openFolderDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(FOLDER_DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(FOLDER_DB_STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function loadFolderHandle() {
  try {
    const db = await openFolderDb();
    const request = db.transaction(FOLDER_DB_STORE).objectStore(FOLDER_DB_STORE).get("handle");
    request.onsuccess = () => { saveFolderHandle = request.result || null; };
  } catch { /* Folder saving is optional. */ }
}

async function chooseSaveFolder() {
  if (!window.showDirectoryPicker) {
    window.alert("当前浏览器不支持直接保存到文件夹，请使用最新版 Chrome 或 Edge。");
    return;
  }
  try {
    saveFolderHandle = await window.showDirectoryPicker({ mode: "readwrite" });
    const db = await openFolderDb();
    db.transaction(FOLDER_DB_STORE, "readwrite").objectStore(FOLDER_DB_STORE).put(saveFolderHandle, "handle");
    await syncToFolder();
    window.alert("已连接保存文件夹，之后的修改会自动同步。");
  } catch (error) {
    if (error.name !== "AbortError") window.alert("文件夹连接失败，请重试。");
  }
}

async function syncToFolder() {
  if (!saveFolderHandle) return;
  try {
    if ((await saveFolderHandle.queryPermission({ mode: "readwrite" })) !== "granted") return;
    const fileHandle = await saveFolderHandle.getFileHandle("Su-知识库.json", { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify({ version: 3, notes: state.notes, customTags: state.customTags, customCategories: state.customCategories, hiddenCategories: state.hiddenCategories }, null, 2));
    await writable.close();
  } catch { /* Keep localStorage available if folder access is revoked. */ }
}

function loadHiddenCategories() {
  try {
    const saved = JSON.parse(localStorage.getItem(HIDDEN_CATEGORY_STORAGE_KEY));
    return Array.isArray(saved) ? saved.filter((id) => categories.some((category) => category.id === id && id !== "全部")) : [];
  } catch {
    return [];
  }
}

function saveHiddenCategories() {
  localStorage.setItem(HIDDEN_CATEGORY_STORAGE_KEY, JSON.stringify(state.hiddenCategories));
  syncToFolder();
}

function normalizeCategory(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

function getAllCategories() {
  return categories.filter((category) => !state.hiddenCategories.includes(category.id) || category.id === "全部")
    .concat(state.customCategories);
}

function normalizeTag(value = "") {
  return String(value)
    .replace(/^#+/, "")
    .replace(/[，,]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitTagList(value = "") {
  return String(value)
    .split(/[,，]/)
    .map(normalizeTag)
    .filter(Boolean);
}

function dedupeTags(tags) {
  return [...new Set(tags.map(normalizeTag).filter(Boolean))];
}

function getAllTags() {
  return dedupeTags([
    ...state.customTags,
    ...state.notes.flatMap((note) => note.tags)
  ]).sort((a, b) => a.localeCompare(b, "zh-CN"));
}

function makeId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `note-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(dateString));
}

function formatToday() {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short"
  }).format(new Date());
}

function getCategory(categoryId) {
  return getAllCategories().find((category) => category.id === categoryId) || categories[0];
}

function getFilteredNotes() {
  const normalizedQuery = state.query.trim().toLowerCase();

  return state.notes
    .filter((note) => {
      const matchesCategory = state.activeCategory === "全部" || note.category === state.activeCategory;
      const matchesTag = state.activeTag === "全部" || note.tags.includes(state.activeTag);
      const searchableText = [note.title, note.content, note.category, note.tags.join(" ")].join(" ").toLowerCase();
      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
      return matchesCategory && matchesTag && matchesQuery;
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return Number(b.pinned) - Number(a.pinned);
      }
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
}

function renderCategories() {
  elements.categoryList.innerHTML = getAllCategories().map((category) => {
    const count = category.id === "全部"
      ? state.notes.length
      : state.notes.filter((note) => note.category === category.id).length;
    const active = state.activeCategory === category.id ? "active" : "";
    return `
      <div class="category-row">
        <button class="category-item ${active}" type="button" data-category="${escapeHTML(category.id)}" style="--category-color: ${category.color}">
        <span class="category-symbol">${category.symbol}</span>
        <span class="category-name">${escapeHTML(category.label)}</span>
        <span class="category-count">${String(count).padStart(2, "0")}</span>
        </button>
        ${category.id !== "全部" ? `<button class="category-action" type="button" data-category-rename="${escapeHTML(category.id)}" aria-label="重命名分类 ${escapeHTML(category.label)}" title="重命名">改</button><button class="category-delete" type="button" data-category-delete="${escapeHTML(category.id)}" aria-label="删除分类 ${escapeHTML(category.label)}" title="删除">删</button>` : ""}
      </div>
    `;
  }).join("");
}

function renderCustomCategories() {
  elements.customCategoryCount.textContent = String(state.customCategories.length).padStart(2, "0");
  elements.customCategoryList.innerHTML = state.customCategories.length
    ? state.customCategories.map((category) => `
      <div class="managed-category-item">
        <button class="managed-category-main" type="button" data-category="${escapeHTML(category.id)}">
          <span class="category-symbol" style="--category-color: ${category.color}">${category.symbol}</span>
          <span>${escapeHTML(category.label)}</span>
        </button>
        <button class="managed-tag-action" type="button" data-category-rename="${escapeHTML(category.id)}" aria-label="重命名分类 ${escapeHTML(category.label)}" title="重命名">改</button>
        <button class="managed-tag-action danger" type="button" data-category-delete="${escapeHTML(category.id)}" aria-label="删除分类 ${escapeHTML(category.label)}" title="删除">删</button>
      </div>
    `).join("")
    : '<span class="managed-tag-empty">还没有自定义分类</span>';
}

function renderCategorySelect() {
  const currentValue = elements.noteCategory.value;
  elements.noteCategory.innerHTML = getAllCategories()
    .filter((category) => category.id !== "全部")
    .map((category) => `<option value="${escapeHTML(category.id)}">${escapeHTML(category.label)}</option>`)
    .join("");
  if (getAllCategories().some((category) => category.id === currentValue)) {
    elements.noteCategory.value = currentValue;
  }
}

function renderTags() {
  const tags = getAllTags();
  const allTags = ["全部", ...tags];
  elements.tagList.innerHTML = allTags.map((tag) => {
    const active = state.activeTag === tag ? "active" : "";
    return `<button class="tag-chip ${active}" type="button" data-tag="${escapeHTML(tag)}">${tag === "全部" ? "所有标签" : `# ${escapeHTML(tag)}`}</button>`;
  }).join("");
}

function renderCustomTags() {
  const tags = state.customTags;
  elements.customTagCount.textContent = String(tags.length).padStart(2, "0");
  elements.customTagList.innerHTML = tags.length
    ? tags.map((tag) => {
      const active = state.activeTag === tag ? "active" : "";
      return `
        <div class="managed-tag-item">
          <button class="managed-tag-main ${active}" type="button" data-tag-value="${escapeHTML(tag)}" title="编辑器打开时可插入到笔记，未打开时可用于筛选">
            <span>#${escapeHTML(tag)}</span>
          </button>
          <button class="managed-tag-action" type="button" data-tag-rename="${escapeHTML(tag)}" aria-label="重命名标签 ${escapeHTML(tag)}" title="重命名">改</button>
          <button class="managed-tag-action danger" type="button" data-tag-delete="${escapeHTML(tag)}" aria-label="删除标签 ${escapeHTML(tag)}" title="删除">删</button>
        </div>
      `;
    }).join("")
    : '<span class="managed-tag-empty">还没有标签</span>';
}

function renderNotes() {
  const notes = getFilteredNotes();
  const currentCategory = getCategory(state.activeCategory);
  elements.currentLocation.textContent = currentCategory.label;
  elements.resultCount.textContent = `${notes.length} / ${state.notes.length} 条笔记`;

  if (!notes.length) {
    elements.notesGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-symbol">∅</div>
        <h3>这里暂时没有笔记</h3>
        <p>${state.query || state.activeTag !== "全部" ? "换一个搜索词或筛选条件试试。" : "把第一个想法放进来，让这张地图开始生长。"}</p>
        <button class="button button-primary" data-empty-action type="button">记录第一条</button>
      </div>
    `;
    return;
  }

  elements.notesGrid.innerHTML = notes.map((note) => {
    const category = getCategory(note.category);
    const excerpt = note.content.replace(/\s+/g, " ").trim();
    const tags = note.tags.slice(0, 3).map((tag) => `<span class="card-tag">${escapeHTML(tag)}</span>`).join("");
    return `
      <article class="note-card ${note.pinned ? "pinned" : ""}" data-note-id="${escapeHTML(note.id)}" style="--category-color: ${category.color}" tabindex="0" role="button" aria-label="打开笔记：${escapeHTML(note.title)}">
        <div class="card-head">
          <span class="note-category">${escapeHTML(category.label)}</span>
          ${note.pinned ? '<span class="pin-mark">PINNED</span>' : ""}
        </div>
        <h3>${escapeHTML(note.title)}</h3>
        <p class="note-excerpt">${escapeHTML(excerpt)}</p>
        <div class="card-footer">
          <div class="card-tags">${tags}</div>
          <time class="note-date" datetime="${escapeHTML(note.updatedAt)}">${formatDate(note.updatedAt)}</time>
        </div>
      </article>
    `;
  }).join("");
}

function render() {
  renderCategories();
  renderCustomCategories();
  renderCategorySelect();
  renderTags();
  renderCustomTags();
  renderNotes();
}

function insertTagIntoComposer(tag) {
  const normalizedTag = normalizeTag(tag);
  if (!normalizedTag) {
    return false;
  }

  const tags = splitTagList(elements.noteTags.value);
  if (tags.includes(normalizedTag)) {
    elements.noteTags.focus();
    return true;
  }

  tags.push(normalizedTag);
  elements.noteTags.value = tags.join(", ");
  elements.noteTags.focus();
  window.setTimeout(() => {
    const length = elements.noteTags.value.length;
    elements.noteTags.setSelectionRange(length, length);
  }, 0);
  return true;
}

function refreshOpenDetail() {
  if (elements.detailModal.hidden || !state.selectedNoteId) {
    return;
  }

  const note = state.notes.find((item) => item.id === state.selectedNoteId);
  if (note) {
    openDetail(note);
  } else {
    closeModal(elements.detailModal);
  }
}

function syncOpenComposerTags(oldTag, replacementTag) {
  if (elements.composerModal.hidden) {
    return;
  }

  const tags = splitTagList(elements.noteTags.value);
  const nextTags = tags
    .map((tag) => (tag === oldTag ? replacementTag : tag))
    .filter(Boolean);
  elements.noteTags.value = dedupeTags(nextTags).join(", ");
}

function applyTagChange(oldTag, replacementTag = null) {
  const sourceTag = normalizeTag(oldTag);
  const nextTag = replacementTag === null ? null : normalizeTag(replacementTag);
  if (!sourceTag) {
    return;
  }

  if (replacementTag !== null && !nextTag) {
    window.alert("标签名称不能为空。");
    return;
  }

  if (nextTag && nextTag === sourceTag) {
    return;
  }

  const now = new Date().toISOString();
  state.notes = state.notes.map((note) => {
    if (!note.tags.includes(sourceTag)) {
      return note;
    }

    const updatedTags = note.tags
      .map((tag) => (tag === sourceTag ? nextTag : tag))
      .filter(Boolean);

    return {
      ...note,
      tags: dedupeTags(updatedTags),
      updatedAt: now
    };
  });

  if (nextTag) {
    state.customTags = dedupeTags([
      ...state.customTags.map((tag) => (tag === sourceTag ? nextTag : tag)),
      nextTag
    ]);
    if (state.activeTag === sourceTag) {
      state.activeTag = nextTag;
    }
  } else {
    state.customTags = state.customTags.filter((tag) => tag !== sourceTag);
    if (state.activeTag === sourceTag) {
      state.activeTag = "全部";
    }
  }

  syncOpenComposerTags(sourceTag, nextTag);
  saveNotes();
  saveTags();
  render();
  refreshOpenDetail();
}

function renameCustomTag(tag) {
  const currentTag = normalizeTag(tag);
  if (!currentTag) {
    return;
  }

  const nextTag = normalizeTag(window.prompt(`请输入“${currentTag}”的新名称`, currentTag) || "");
  if (!nextTag || nextTag === currentTag) {
    return;
  }

  applyTagChange(currentTag, nextTag);
}

function deleteCustomTag(tag) {
  const currentTag = normalizeTag(tag);
  if (!currentTag) {
    return;
  }

  const usageCount = state.notes.filter((note) => note.tags.includes(currentTag)).length;
  if (!window.confirm(`确定删除标签“${currentTag}”吗？这会从 ${usageCount} 条笔记中移除它。`)) {
    return;
  }

  applyTagChange(currentTag, null);
}

function openModal(modal) {
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  if (modal === elements.composerModal) {
    document.body.classList.add("composer-active");
  }
}

function closeModal(modal) {
  modal.hidden = true;
  if (modal === elements.composerModal) {
    document.body.classList.remove("composer-active");
  }
  if (elements.composerModal.hidden && elements.detailModal.hidden) {
    document.body.style.overflow = "";
  }
}

function resetForm() {
  elements.noteForm.reset();
  elements.noteId.value = "";
  elements.composerTitle.textContent = "记录一个想法";
  elements.noteCategory.value = "灵感";
}

function openComposer(note = null) {
  if (note) {
    elements.composerTitle.textContent = "编辑这条笔记";
    elements.noteId.value = note.id;
    elements.noteTitle.value = note.title;
    elements.noteCategory.value = note.category;
    elements.noteTags.value = note.tags.join(", ");
    elements.noteContent.value = note.content;
    elements.notePinned.checked = note.pinned;
  } else {
    resetForm();
  }
  openModal(elements.composerModal);
  window.setTimeout(() => elements.noteTitle.focus(), 50);
}

function openDetail(note) {
  state.selectedNoteId = note.id;
  const category = getCategory(note.category);
  elements.detailCategory.textContent = category.label;
  elements.detailCategory.style.color = category.color;
  elements.detailTitle.textContent = note.title;
  elements.detailDate.textContent = `更新于 ${formatDate(note.updatedAt)}`;
  elements.detailReadTime.textContent = `${Math.max(1, Math.ceil(note.content.length / 300))} 分钟阅读`;
  elements.detailPinned.hidden = !note.pinned;
  elements.detailTags.innerHTML = note.tags.map((tag) => `<span class="detail-tag">${escapeHTML(tag)}</span>`).join("");
  elements.detailContent.textContent = note.content;
  openModal(elements.detailModal);
}

function submitNote(event) {
  event.preventDefault();
  const now = new Date().toISOString();
  const existingId = elements.noteId.value;
  const note = {
    id: existingId || makeId(),
    title: elements.noteTitle.value.trim(),
    category: elements.noteCategory.value,
    tags: splitTagList(elements.noteTags.value).slice(0, 8),
    content: elements.noteContent.value.trim(),
    pinned: elements.notePinned.checked,
    createdAt: existingId
      ? state.notes.find((item) => item.id === existingId)?.createdAt || now
      : now,
    updatedAt: now
  };

  if (!note.title || !note.content) {
    return;
  }

  if (existingId) {
    state.notes = state.notes.map((item) => item.id === existingId ? note : item);
  } else {
    state.notes = [note, ...state.notes];
  }

  state.customTags = dedupeTags([...state.customTags, ...note.tags]);
  saveNotes();
  saveTags();
  render();
  closeModal(elements.composerModal);
  openDetail(note);
}

function deleteSelectedNote() {
  const note = state.notes.find((item) => item.id === state.selectedNoteId);
  if (!note || !window.confirm(`确定删除《${note.title}》吗？`)) {
    return;
  }
  state.notes = state.notes.filter((item) => item.id !== state.selectedNoteId);
  saveNotes();
  closeModal(elements.detailModal);
  render();
}

function exportNotes() {
  const data = JSON.stringify({
    version: 2,
    notes: state.notes,
    customTags: state.customTags
  }, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `私藏知识库-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importNotes(event) {
  const [file] = event.target.files;
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      let importedNotes = [];
      let importedTags = [];

      if (Array.isArray(imported)) {
        importedNotes = imported;
        importedTags = imported.flatMap((note) => note.tags || []);
      } else if (imported && Array.isArray(imported.notes)) {
        importedNotes = imported.notes;
        importedTags = [
          ...(Array.isArray(imported.customTags) ? imported.customTags : []),
          ...imported.notes.flatMap((note) => note.tags || [])
        ];
      } else {
        throw new Error("invalid data");
      }

      if (importedNotes.some((note) => !note.id || !note.title || !note.content)) {
        throw new Error("invalid data");
      }

      if (window.confirm(`将导入 ${importedNotes.length} 条笔记，并替换当前内容，是否继续？`)) {
        state.notes = importedNotes;
        state.customTags = dedupeTags(importedTags);
        saveNotes();
        saveTags();
        state.activeCategory = "全部";
        state.activeTag = "全部";
        state.query = "";
        elements.searchInput.value = "";
        render();
      }
    } catch {
      window.alert("导入失败：文件不是有效的知识库备份。");
    } finally {
      elements.importFile.value = "";
    }
  };
  reader.readAsText(file);
}

function handleKeyboard(event) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    elements.searchInput.focus();
  }

  if (event.key.toLowerCase() === "n" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
    event.preventDefault();
    openComposer();
  }

  if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && !elements.composerModal.hidden) {
    elements.noteForm.requestSubmit();
  }

  if (event.key === "Escape") {
    closeModal(elements.composerModal);
    closeModal(elements.detailModal);
  }
}

function bindEvents() {
  document.querySelector("#open-composer").addEventListener("click", () => openComposer());
  document.querySelector("#export-notes").addEventListener("click", exportNotes);
  document.querySelector("#import-notes").addEventListener("click", () => elements.importFile.click());
  elements.importFile.addEventListener("change", importNotes);
  document.querySelector("#choose-folder").addEventListener("click", chooseSaveFolder);
  elements.noteForm.addEventListener("submit", submitNote);
  elements.tagForm.addEventListener("submit", addCustomTag);
  elements.categoryForm.addEventListener("submit", addCustomCategory);
  document.querySelector("#delete-note").addEventListener("click", deleteSelectedNote);
  document.querySelector("#edit-note").addEventListener("click", () => {
    const note = state.notes.find((item) => item.id === state.selectedNoteId);
    if (note) {
      closeModal(elements.detailModal);
      openComposer(note);
    }
  });

  document.addEventListener("click", (event) => {
    const categoryButton = event.target.closest("[data-category]");
    if (categoryButton) {
      state.activeCategory = categoryButton.dataset.category;
      render();
      return;
    }

    const renameButton = event.target.closest("[data-tag-rename]");
    if (renameButton) {
      renameCustomTag(renameButton.dataset.tagRename);
      return;
    }

    const deleteButton = event.target.closest("[data-tag-delete]");
    if (deleteButton) {
      deleteCustomTag(deleteButton.dataset.tagDelete);
      return;
    }

    const categoryDeleteButton = event.target.closest("[data-category-delete]");
    if (categoryDeleteButton) {
      deleteCustomCategory(categoryDeleteButton.dataset.categoryDelete);
      return;
    }

    const categoryRenameButton = event.target.closest("[data-category-rename]");
    if (categoryRenameButton) {
      renameCategory(categoryRenameButton.dataset.categoryRename);
      return;
    }

    const managedTagButton = event.target.closest("[data-tag-value]");
    if (managedTagButton && managedTagButton.closest(".managed-tag-item")) {
      const tag = managedTagButton.dataset.tagValue;
      if (!elements.composerModal.hidden && insertTagIntoComposer(tag)) {
        return;
      }
      state.activeTag = tag;
      render();
      return;
    }

    const tagButton = event.target.closest("[data-tag]");
    if (tagButton) {
      state.activeTag = tagButton.dataset.tag;
      render();
      return;
    }

    const noteCard = event.target.closest("[data-note-id]");
    if (noteCard) {
      const note = state.notes.find((item) => item.id === noteCard.dataset.noteId);
      if (note) {
        openDetail(note);
      }
      return;
    }

    if (event.target.closest("[data-empty-action]")) {
      openComposer();
    }

    if (event.target.matches("[data-close-modal]") || event.target === elements.detailModal) {
      closeModal(event.target.closest(".modal-backdrop"));
    }
  });

  document.addEventListener("keydown", (event) => {
    const noteCard = event.target.closest("[data-note-id]");
    if (noteCard && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      const note = state.notes.find((item) => item.id === noteCard.dataset.noteId);
      if (note) {
        openDetail(note);
      }
    }
  });

  elements.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderNotes();
  });
  document.addEventListener("keydown", handleKeyboard);
}

function addCustomCategory(event) {
  event.preventDefault();
  const label = normalizeCategory(elements.categoryInput.value);
  if (!label) {
    elements.categoryInput.focus();
    return;
  }
  if (getAllCategories().some((category) => category.label === label)) {
    elements.categoryInput.select();
    return;
  }
  const colors = ["#4df3ff", "#d9ff5e", "#ff3dbb", "#ffb347"];
  state.customCategories = [...state.customCategories, {
    id: `custom-${Date.now()}`,
    label,
    symbol: "◇",
    color: colors[state.customCategories.length % colors.length]
  }];
  saveCategories();
  elements.categoryInput.value = "";
  render();
  elements.categoryInput.focus();
}

function deleteCustomCategory(categoryId) {
  const category = getAllCategories().find((item) => item.id === categoryId);
  if (!category || !window.confirm(`删除分类“${category.label}”？其中的笔记会迁移到仍保留的分类。`)) return;
  if (category.id.startsWith("custom-")) {
    state.customCategories = state.customCategories.filter((item) => item.id !== categoryId);
  } else {
    state.hiddenCategories = [...state.hiddenCategories, categoryId];
  }
  const fallback = getAllCategories().find((item) => item.id !== "全部")?.id || "全部";
  state.notes = state.notes.map((note) => note.category === categoryId ? { ...note, category: fallback } : note);
  if (state.activeCategory === categoryId) state.activeCategory = "全部";
  saveCategories();
  saveHiddenCategories();
  saveNotes();
  render();
}

function renameCategory(categoryId) {
  const category = getAllCategories().find((item) => item.id === categoryId);
  if (!category) return;
  const nextLabel = normalizeCategory(window.prompt(`请输入“${category.label}”的新名称`, category.label) || "");
  if (!nextLabel || nextLabel === category.label) return;
  if (getAllCategories().some((item) => item.id !== categoryId && item.label === nextLabel)) {
    window.alert("分类名称已经存在。");
    return;
  }
  if (category.id.startsWith("custom-")) {
    state.customCategories = state.customCategories.map((item) => item.id === categoryId ? { ...item, label: nextLabel } : item);
    saveCategories();
  } else {
    category.label = nextLabel;
  }
  render();
}

function addCustomTag(event) {
  event.preventDefault();
  const tag = normalizeTag(elements.tagInput.value);
  if (!tag) {
    elements.tagInput.focus();
    return;
  }

  if (!getAllTags().includes(tag)) {
    state.customTags = [...state.customTags, tag];
    saveTags();
  }

  elements.tagInput.value = "";
  render();
  elements.tagInput.focus();
}

renderCategorySelect();
elements.todayLabel.textContent = formatToday();
bindEvents();
loadFolderHandle();
render();
