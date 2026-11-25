// === CONFIGURAÇÃO DO FIREBASE ===
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCEqUzJpfX4l4hSjHpOUr9n2o8F4anRsVA",
  authDomain: "blog-asonozz.firebaseapp.com",
  projectId: "blog-asonozz",
  storageBucket: "blog-asonozz.firebasestorage.app",
  messagingSenderId: "7978098749",
  appId: "1:7978098749:web:bd3a2508b094aa6d43a394"
};

const HAS_FIREBASE = Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId);

const STORAGE_KEYS = {
  profile: "asonozz_v3_profile",
  posts: "asonozz_v3_posts",
  photos: "asonozz_v3_photos",
  projects: "asonozz_v3_projects",
  comments: "asonozz_v3_comments",
  theme: "asonozz_v3_theme",
  demoOwner: "asonozz_v3_demo_owner"
};

const DEFAULT_PROFILE = {
  name: "asonozz.",
  handle: "@asonozz",
  tagline: "noites longas, pensamentos calmos e coisas que ainda estão tomando forma.",
  bio: "building things. learning along the way. um pequeno quarto na internet para guardar textos, fotos, tentativas e ideias que começaram com um 'e se eu tentasse isso?'.",
  quote: "Look at the light.",
  avatar: "",
  likesTitle: "Coisas que eu curto",
  likes: ["jogos", "código", "madrugadas calmas", "criar coisas aleatórias"],
  aboutExtra: "Este espaço nasceu para guardar ideias, textos, polaroids e experimentos sem a pressa das redes sociais. Tudo aqui é feito à mão de propósito: um pequeno quarto na internet que muda conforme eu mudo.",
  links: {
    github: "https://github.com/asonozz",
    instagram: "https://instagram.com/asonozz",
    x: "https://x.com/asonozz",
    guns: "https://guns.lol/asonozz"
  }
};

let cloud = {
  enabled: false,
  auth: null,
  db: null,
  fns: null,
  subscribed: false
};

let state = {
  profile: HAS_FIREBASE
    ? structuredClone(DEFAULT_PROFILE)
    : { ...DEFAULT_PROFILE, ...loadFromStorage(STORAGE_KEYS.profile, DEFAULT_PROFILE) },
  posts: HAS_FIREBASE ? [] : loadFromStorage(STORAGE_KEYS.posts, []),
  photos: HAS_FIREBASE ? [] : loadFromStorage(STORAGE_KEYS.photos, []),
  projects: HAS_FIREBASE ? [] : loadFromStorage(STORAGE_KEYS.projects, []),
  comments: HAS_FIREBASE ? [] : loadFromStorage(STORAGE_KEYS.comments, []),
  isOwner: false,
  activeView: "home",
  activeCategory: "todos",
  searchQuery: "",
  currentPostId: null,
  pendingPostIdFromHash: null,
  storyTheme: "light",
  storyFormat: "story",
  storyPhotoMode: "cover",
  storyPhotoScale: 44,
  cachedStoryImgSrc: "",
  cachedStoryImg: null,
  currentLightboxPhotoId: null,
  tempPostImage: "",
  tempProfileAvatar: "",
  tempMuralPhoto: ""
};

// Utilitários seguros
function getLocalTodayIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    alert("O armazenamento local do navegador ficou cheio. Tente usar links de imagem ou fotos menores.");
  }
}

function escapeHtml(text = "") {
  const div = document.createElement("div");
  div.textContent = String(text);
  return div.innerHTML
    .replace(/"/g, "&" + "quot;")
    .replace(/'/g, "&" + "#39;");
}

function formatDate(isoDate) {
  const [y, m, d] = String(isoDate || "").split("-");
  if (!y || !m || !d) return isoDate || "";
  const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${d} ${months[Number(m) - 1]} ${y}`;
}

function estimateReadingTime(text = "") {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.ceil(words / 180));
  return `${mins} min de leitura`;
}

function formatPostContent(content = "") {
  return content
    .split(/\n\s*\n/)
    .map(block => block.trim())
    .filter(Boolean)
    .map(block => {
      if (block.startsWith(">")) {
        const clean = block.replace(/^>\s?/, "");
        return `<blockquote>${escapeHtml(clean).replaceAll("\n", "<br>")}</blockquote>`;
      }
      return `<p>${escapeHtml(block).replaceAll("\n", "<br>")}</p>`;
    })
    .join("");
}

function getExcerpt(content = "", maxLen = 165) {
  const plain = content.replace(/^>\s?/gm, "").replace(/\s+/g, " ").trim();
  return plain.length > maxLen ? plain.slice(0, maxLen) + "..." : plain;
}

function getPostShareUrl(postId) {
  const base = window.location.origin + window.location.pathname;
  return `${base}#post=${encodeURIComponent(postId)}`;
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  ta.remove();
}

function compressImageFile(file, maxWidth, callback) {
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      callback(canvas.toDataURL("image/jpeg", 0.74));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// === CAMADA DE PERSISTÊNCIA EM TEMPO REAL (FIREBASE) ===
async function initFirebaseIfConfigured() {
  if (!HAS_FIREBASE) {
    state.isOwner = localStorage.getItem(STORAGE_KEYS.demoOwner) === "true";
    syncOwnerUI();
    checkUrlHash();
    return;
  }

  try {
    const [appMod, authMod, fsMod] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js")
    ]);

    const app = appMod.initializeApp(FIREBASE_CONFIG);
    cloud.auth = authMod.getAuth(app);
    cloud.db = fsMod.getFirestore(app);
    cloud.fns = { ...authMod, ...fsMod };
    cloud.enabled = true;

    document.getElementById("firebaseNotice").textContent = "Conectado ao Firebase. Entre com seu e-mail e senha de dono.";
    document.getElementById("demoLoginBtn").hidden = true;

    subscribeToCloud();

    cloud.fns.onAuthStateChanged(cloud.auth, user => {
      state.isOwner = Boolean(user);
      if (user) closeLoginModal();
      syncOwnerUI();
      checkUrlHash();
    });
  } catch (err) {
    console.error("Erro ao iniciar Firebase:", err);
  }
}

function subscribeToCloud() {
  if (!cloud.enabled || cloud.subscribed) return;
  cloud.subscribed = true;

  const { doc, collection, onSnapshot } = cloud.fns;

  onSnapshot(
    doc(cloud.db, "site", "profile"),
    snap => {
      if (snap.exists()) {
        state.profile = { ...DEFAULT_PROFILE, ...snap.data() };
      } else {
        state.profile = structuredClone(DEFAULT_PROFILE);
      }
      renderProfile();
    },
    err => console.error("Erro ao sincronizar perfil:", err)
  );

  onSnapshot(
    collection(cloud.db, "posts"),
    snap => {
      state.posts = snap.docs
        .map(d => d.data())
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      renderPosts();
      if (state.activeView === "archive") renderArchive();

      if (state.pendingPostIdFromHash) {
        const targetId = state.pendingPostIdFromHash;
        if (state.posts.some(p => p.id === targetId)) {
          state.pendingPostIdFromHash = null;
          openPostDetail(targetId, true);
          return;
        }
      }

      if (state.activeView === "post" && state.currentPostId) {
        const stillExists = state.posts.some(p => p.id === state.currentPostId);
        if (stillExists) openPostDetail(state.currentPostId, false);
        else switchView("home");
      }
    },
    err => console.error("Erro ao sincronizar textos:", err)
  );

  onSnapshot(
    collection(cloud.db, "photos"),
    snap => {
      state.photos = snap.docs
        .map(d => d.data())
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      renderMural();
    },
    err => console.error("Erro ao sincronizar mural:", err)
  );

  onSnapshot(
    collection(cloud.db, "projects"),
    snap => {
      state.projects = snap.docs
        .map(d => d.data())
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      renderProjects();
    },
    err => console.error("Erro ao sincronizar devaneios:", err)
  );

  onSnapshot(
    collection(cloud.db, "comments"),
    snap => {
      state.comments = snap.docs
        .map(d => d.data())
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      syncOwnerUI();
      renderPosts();
      if (!document.getElementById("moderationModal").hidden) {
        renderModerationModal();
      }
    },
    err => console.error("Erro ao sincronizar bilhetinhos:", err)
  );
}

async function persistProfile() {
  if (!cloud.enabled) {
    saveToStorage(STORAGE_KEYS.profile, state.profile);
    return true;
  }
  if (!state.isOwner) return false;
  try {
    await cloud.fns.setDoc(cloud.fns.doc(cloud.db, "site", "profile"), state.profile);
    return true;
  } catch (err) {
    console.error("Erro ao salvar perfil no Firebase:", err);
    alert("Não foi possível salvar no Firebase. Confira se você está logado como dono e se a imagem não é grande demais.");
    return false;
  }
}

async function persistDoc(colName, item) {
  if (!cloud.enabled) {
    if (colName === "posts") saveToStorage(STORAGE_KEYS.posts, state.posts);
    if (colName === "photos") saveToStorage(STORAGE_KEYS.photos, state.photos);
    if (colName === "projects") saveToStorage(STORAGE_KEYS.projects, state.projects);
    if (colName === "comments") saveToStorage(STORAGE_KEYS.comments, state.comments);
    return true;
  }

  try {
    await cloud.fns.setDoc(cloud.fns.doc(cloud.db, colName, item.id), item);
    return true;
  } catch (err) {
    console.error(`Erro ao salvar em ${colName}:`, err);
    alert("Não foi possível salvar no Firebase. Confira sua conexão ou se as regras de segurança estão com o seu UID certo.");
    return false;
  }
}

async function removeDoc(colName, id) {
  if (!cloud.enabled) {
    if (colName === "posts") saveToStorage(STORAGE_KEYS.posts, state.posts);
    if (colName === "photos") saveToStorage(STORAGE_KEYS.photos, state.photos);
    if (colName === "projects") saveToStorage(STORAGE_KEYS.projects, state.projects);
    if (colName === "comments") saveToStorage(STORAGE_KEYS.comments, state.comments);
    return true;
  }
  if (!state.isOwner) return false;

  try {
    await cloud.fns.deleteDoc(cloud.fns.doc(cloud.db, colName, id));
    return true;
  } catch (err) {
    console.error(`Erro ao apagar em ${colName}:`, err);
    alert("Não foi possível apagar no Firebase. Confira se você está logado na conta de dono.");
    return false;
  }
}

// Modo dono / visitante & URLs diretas
function syncOwnerUI() {
  document.body.classList.toggle("is-owner", state.isOwner);
  const pendingCount = state.comments.filter(c => !c.approved).length;
  const label = pendingCount === 1 ? "1 bilhetinho pendente" : `${pendingCount} bilhetinhos pendentes`;
  document.getElementById("pendingCountText").textContent = label;

  if (state.activeView === "post" && state.currentPostId) {
    renderCommentsForPost(state.currentPostId);
  }
}

function checkUrlHash() {
  const hash = window.location.hash || "";

  if (hash === "#admin" && !state.isOwner) {
    openLoginModal();
    history.replaceState(null, "", window.location.pathname + window.location.search);
    return;
  }

  if (hash.startsWith("#post=")) {
    const postId = decodeURIComponent(hash.slice(6));
    if (!postId) return;
    const found = state.posts.find(p => p.id === postId);
    if (found) {
      state.pendingPostIdFromHash = null;
      openPostDetail(postId, true);
    } else {
      state.pendingPostIdFromHash = postId;
    }
  }
}

// Tema Claro / Noturno
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.getElementById("themeIcon").textContent = theme === "dark" ? "☀" : "☾";
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}

function initTheme() {
  applyTheme(localStorage.getItem(STORAGE_KEYS.theme) || "light");
}

// Renderização
function renderAll() {
  renderProfile();
  renderPosts();
  renderMural();
  renderProjects();
  syncOwnerUI();
  if (state.activeView === "archive") renderArchive();
  if (state.activeView === "post" && state.currentPostId) openPostDetail(state.currentPostId, false);
}

function renderCoverStats() {
  const statsEl = document.getElementById("coverStats");
  const postLabel = state.posts.length === 1 ? "texto no caderno" : "textos no caderno";
  const photoLabel = state.photos.length === 1 ? "polaroid no mural" : "polaroids no mural";
  statsEl.innerHTML = `
    <span><strong>${state.posts.length}</strong> ${postLabel}</span>
    <span>⋆</span>
    <span><strong>${state.photos.length}</strong> ${photoLabel}</span>
  `;
}

function renderCoverPolaroids() {
  const container = document.getElementById("coverPolaroids");
  const picks = state.photos.slice(0, 3);
  if (!picks.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = picks
    .map(photo => `
      <div class="cover-polaroid" data-photo-id="${escapeHtml(photo.id)}" title="Clique para ampliar">
        <img src="${escapeHtml(photo.url)}" alt="${escapeHtml(photo.caption || "Polaroid")}">
        <span>${escapeHtml(photo.caption || formatDate(photo.date))}</span>
      </div>
    `)
    .join("");

  container.querySelectorAll(".cover-polaroid").forEach(card => {
    card.addEventListener("click", () => openLightbox(card.dataset.photoId));
  });
}

function renderProfile() {
  const p = state.profile;
  const cleanName = p.name.replace(/\.$/, "");
  document.getElementById("headerBrandName").textContent = p.name;
  document.getElementById("coverTitle").innerHTML = `${escapeHtml(cleanName)}<span class="dot">.</span>`;
  document.getElementById("coverHandle").textContent = p.handle;
  document.getElementById("coverTagline").textContent = p.tagline;

  document.getElementById("sidebarName").textContent = p.name;
  document.getElementById("sidebarHandle").textContent = p.handle;
  document.getElementById("sidebarBio").textContent = p.bio;
  document.getElementById("footerText").textContent = `${p.name} — ${p.quote || "construído sem pressa."}`;

  const quoteEl = document.getElementById("sidebarQuote");
  if (p.quote && p.quote.trim()) {
    quoteEl.textContent = `"${p.quote}"`;
    quoteEl.hidden = false;
  } else {
    quoteEl.hidden = true;
  }

  const avatarEl = document.getElementById("sidebarAvatar");
  if (p.avatar && p.avatar.trim()) {
    avatarEl.innerHTML = `<img src="${escapeHtml(p.avatar)}" alt="${escapeHtml(p.name)}">`;
  } else {
    avatarEl.innerHTML = `<span class="avatar-seal">愛</span>`;
  }

  const linksContainer = document.getElementById("sidebarLinks");
  const linkItems = [
    { label: "GitHub", url: p.links?.github },
    { label: "Instagram", url: p.links?.instagram },
    { label: "X", url: p.links?.x },
    { label: "guns.lol", url: p.links?.guns }
  ].filter(item => item.url && item.url.trim());

  linksContainer.innerHTML = linkItems
    .map(item => `<a class="social-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${item.label}</a>`)
    .join("");

  const likesCard = document.getElementById("sidebarLikesCard");
  const likesTitleEl = document.getElementById("sidebarLikesTitle");
  const likesListEl = document.getElementById("sidebarLikesList");
  const likesItems = Array.isArray(p.likes) ? p.likes : DEFAULT_PROFILE.likes;

  if (likesCard && likesTitleEl && likesListEl) {
    if (!likesItems.length) {
      likesCard.hidden = true;
    } else {
      likesCard.hidden = false;
      likesTitleEl.textContent = p.likesTitle || "Coisas que eu curto";
      likesListEl.innerHTML = likesItems
        .map(item => `<li>${escapeHtml(item)}</li>`)
        .join("");
    }
  }

  renderAbout();
  renderCoverStats();
}

function renderPosts() {
  const container = document.getElementById("postsList");
  const emptyState = document.getElementById("emptyState");

  const filtered = state.posts
    .filter(post => {
      const matchesCat = state.activeCategory === "todos" || post.category === state.activeCategory;
      const q = state.searchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    })
    .sort((a, b) => {
      const pinDiff = (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
      if (pinDiff !== 0) return pinDiff;
      const dateDiff = String(b.date || "").localeCompare(String(a.date || ""));
      if (dateDiff !== 0) return dateDiff;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

  if (!filtered.length) {
    container.innerHTML = "";
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;
  container.innerHTML = filtered
    .map(post => {
      const approvedCount = state.comments.filter(c => c.postId === post.id && c.approved).length;
      const countText = approvedCount === 1 ? "1 bilhetinho" : `${approvedCount} bilhetinhos`;
      return `
        <article class="post-card ${post.pinned ? "is-pinned" : ""}" data-post-id="${escapeHtml(post.id)}">
          ${post.image ? `<div class="post-card-cover-wrap"><img class="post-card-cover" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}"></div>` : ""}
          <div class="post-card-body">
            <div class="post-meta">
              ${post.pinned ? `<span class="post-pinned-badge">★ fixado</span>` : ""}
              <span class="post-date">${formatDate(post.date)}</span>
              <span class="post-cat">${escapeHtml(post.category)}</span>
              <span>·</span>
              <span>${estimateReadingTime(post.content)}</span>
            </div>
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            <p class="post-excerpt">${escapeHtml(getExcerpt(post.content))}</p>
            <div class="post-card-footer">
              <span class="read-more">Ler página inteira →</span>
              <span class="comment-count-tag">${countText}</span>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  container.querySelectorAll(".post-card").forEach(card => {
    card.addEventListener("click", () => openPostDetail(card.dataset.postId));
  });

  renderCoverStats();
}

function renderMural() {
  const grid = document.getElementById("muralGrid");
  const empty = document.getElementById("muralEmptyState");

  if (!state.photos.length) {
    grid.innerHTML = "";
    empty.hidden = false;
  } else {
    empty.hidden = true;
    grid.innerHTML = state.photos
      .map(photo => `
        <figure class="mural-item" data-photo-id="${escapeHtml(photo.id)}">
          <img src="${escapeHtml(photo.url)}" alt="${escapeHtml(photo.caption || "Foto do mural")}" loading="lazy">
          <figcaption class="mural-caption-wrap">
            ${photo.caption ? `<p class="mural-caption">${escapeHtml(photo.caption)}</p>` : ""}
            <span class="mural-date">${formatDate(photo.date)}</span>
          </figcaption>
        </figure>
      `)
      .join("");

    grid.querySelectorAll(".mural-item").forEach(item => {
      item.addEventListener("click", () => openLightbox(item.dataset.photoId));
    });
  }

  renderSidebarMuralPreview();
  renderCoverPolaroids();
  renderCoverStats();
}

function renderSidebarMuralPreview() {
  const container = document.getElementById("sidebarMuralPreview");
  const previewItems = state.photos.slice(0, 4);

  if (!previewItems.length) {
    container.innerHTML = `<p class="muted-small">Sem fotos ainda.</p>`;
    return;
  }

  container.innerHTML = previewItems
    .map(photo => `
      <div class="sidebar-mural-thumb" data-photo-id="${escapeHtml(photo.id)}" title="${escapeHtml(photo.caption || "Abrir foto")}">
        <img src="${escapeHtml(photo.url)}" alt="${escapeHtml(photo.caption || "Miniatura do mural")}">
      </div>
    `)
    .join("");

  container.querySelectorAll(".sidebar-mural-thumb").forEach(thumb => {
    thumb.addEventListener("click", () => openLightbox(thumb.dataset.photoId));
  });
}

function openPostDetail(postId, shouldSwitch = true) {
  const post = state.posts.find(p => p.id === postId);
  if (!post) return;

  state.currentPostId = postId;

  const targetHash = `#post=${encodeURIComponent(postId)}`;
  if (window.location.hash !== targetHash) {
    history.replaceState(null, "", targetHash);
  }

  const detailEl = document.getElementById("postDetailContent");
  detailEl.innerHTML = `
    <div class="post-meta">
      ${post.pinned ? `<span class="post-pinned-badge">★ fixado</span>` : ""}
      <span class="post-date">${formatDate(post.date)}</span>
      <span class="post-cat">${escapeHtml(post.category)}</span>
      <span>·</span>
      <span>${estimateReadingTime(post.content)}</span>
    </div>
    <h1 class="post-detail-title">${escapeHtml(post.title)}</h1>
    ${post.image ? `<img class="post-detail-cover" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}">` : ""}
    <div class="post-body">${formatPostContent(post.content)}</div>

    <div class="post-share-bar">
      <span class="post-share-label">⋆ compartilhar esta página</span>
      <div class="post-share-buttons">
        <button class="btn btn-outline btn-sm" id="copyPostLinkBtn">Copiar link</button>
        <button class="btn btn-primary btn-sm" id="openStoryModalBtn">Card pro Story</button>
      </div>
    </div>

    <div class="post-detail-actions owner-only-flex">
      <button class="btn btn-outline btn-sm" id="togglePinPostBtn">${post.pinned ? "Desafixar" : "★ Fixar no topo"}</button>
      <button class="btn btn-outline btn-sm" id="editCurrentPostBtn">Editar texto</button>
      <button class="btn btn-danger btn-sm" id="deleteCurrentPostBtn">Excluir</button>
    </div>
  `;

  const copyBtn = document.getElementById("copyPostLinkBtn");
  copyBtn.addEventListener("click", async () => {
    try {
      await copyTextToClipboard(getPostShareUrl(post.id));
      copyBtn.textContent = "✓ Link copiado!";
      setTimeout(() => (copyBtn.textContent = "Copiar link"), 2200);
    } catch {
      alert("Não foi possível copiar o link automaticamente.");
    }
  });

  document.getElementById("openStoryModalBtn").addEventListener("click", () => openShareStoryModal(post));
  document.getElementById("togglePinPostBtn").addEventListener("click", () => togglePinPost(post.id));
  document.getElementById("editCurrentPostBtn").addEventListener("click", () => openPostModal(post));
  document.getElementById("deleteCurrentPostBtn").addEventListener("click", () => deletePost(post.id));

  if (shouldSwitch) {
    document.getElementById("commentFeedback").textContent = "";
    switchView("post");
  }

  renderCommentsForPost(postId);
}

// === GERADOR DE CARD PARA STORIES / FEED / QUADRADO ===
function tryLoadImg(url, useCors) {
  return new Promise(resolve => {
    const img = new Image();
    if (useCors) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

async function loadImageForCanvas(src) {
  if (!src) return null;
  if (state.cachedStoryImgSrc === src && state.cachedStoryImg) {
    return state.cachedStoryImg;
  }

  let img = null;
  if (src.startsWith("data:") || src.startsWith("blob:")) {
    img = await tryLoadImg(src, false);
  } else {
    // 1. Tenta direto com permissão para exportar PNG
    img = await tryLoadImg(src, true);

    // 2. Se o servidor externo bloquear CORS, carrega via proxy mantendo o download funcionando
    if (!img) {
      const stripped = src.replace(/^https?:\/\//i, "");
      img = await tryLoadImg(`https://wsrv.nl/?url=${encodeURIComponent(stripped)}&output=jpg`, true);
    }

    // 3. Último recurso: exibe na prévia mesmo se o host bloquear exportação
    if (!img) {
      img = await tryLoadImg(src, false);
    }
  }

  if (img) {
    state.cachedStoryImgSrc = src;
    state.cachedStoryImg = img;
  }
  return img;
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawImageCover(ctx, img, x, y, w, h) {
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let sx = 0, sy = 0, sw = img.width, sh = img.height;

  if (imgRatio > boxRatio) {
    sw = img.height * boxRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / boxRatio;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function wrapCanvasText(ctx, text, maxWidth, maxLines) {
  const words = String(text || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (!words.length || maxLines < 1) return [];

  const lines = [];
  let current = "";
  let consumed = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
      consumed = i + 1;
    } else {
      if (current) {
        lines.push(current);
        if (lines.length === maxLines) {
          current = "";
          break;
        }
        current = word;
        consumed = i + 1;
      } else {
        // Palavra maior que a linha
        lines.push(word);
        consumed = i + 1;
        if (lines.length === maxLines) {
          current = "";
          break;
        }
      }
    }
  }
  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  if (consumed < words.length && lines.length > 0) {
    let last = lines[lines.length - 1];
    while (ctx.measureText(last + "…").width > maxWidth && last.length > 3) {
      last = last.slice(0, -1).trim();
    }
    lines[lines.length - 1] = last + "…";
  }

  return lines;
}

function computeAdaptiveTypography(ctx, title, excerpt, maxWidth, totalHeight, format) {
  const isStory = format === "story";
  const isSquare = format === "square";

  // Define teto e piso proporcionais ao espaço livre restante
  const maxTitleSize = isStory ? 68 : isSquare ? 48 : 56;
  const minTitleSize = isStory ? 34 : 28;
  const maxBodySize = isStory ? 36 : isSquare ? 27 : 30;
  const minBodySize = isStory ? 22 : 19;

  // Escala inicial baseada na altura disponível para texto
  const refHeight = isStory ? 680 : isSquare ? 380 : 460;
  const ratio = Math.max(0.35, Math.min(1.15, totalHeight / refHeight));

  let titleSize = Math.round(minTitleSize + (maxTitleSize - minTitleSize) * Math.min(1, ratio));
  let titleLineH = Math.round(titleSize * 1.16);
  let titleLines = [];

  const titleBudget = Math.max(titleLineH, Math.floor(totalHeight * (excerpt ? 0.44 : 0.85)));

  // Ajusta o tamanho do título até caber no orçamento sem esmagar o trecho
  while (titleSize >= minTitleSize) {
    titleLineH = Math.round(titleSize * 1.16);
    const maxTLines = Math.max(1, Math.min(4, Math.floor(titleBudget / titleLineH)));
    ctx.font = `700 ${titleSize}px 'Coolvetica', 'Quicksand', sans-serif`;
    titleLines = wrapCanvasText(ctx, title, maxWidth, maxTLines);
    const fullTitleFit = titleLines.join(" ").indexOf("…") === -1;
    const usedH = titleLines.length * titleLineH;
    if ((fullTitleFit && usedH <= titleBudget) || titleSize === minTitleSize) break;
    titleSize -= 2;
  }

  const titleBlockH = titleLines.length * titleLineH;
  const gapBetween = Math.max(10, Math.min(26, Math.round(totalHeight * 0.045)));
  const bodyBudget = Math.max(0, totalHeight - titleBlockH - gapBetween);

  let bodySize = Math.round(minBodySize + (maxBodySize - minBodySize) * Math.min(1, ratio));
  let bodyLineH = Math.round(bodySize * 1.38);
  let bodyLines = [];

  if (excerpt && bodyBudget >= minBodySize * 1.3) {
    // Se sobrou pouco espaço (foto grande), reduz o texto para sempre exibir algumas linhas legíveis
    while (bodySize > minBodySize) {
      bodyLineH = Math.round(bodySize * 1.38);
      const possibleLines = Math.floor(bodyBudget / bodyLineH);
      if (possibleLines >= 3) break;
      bodySize -= 2;
    }

    // Se o espaço é grande mas o texto é curto, cresce um pouco para equilibrar
    ctx.font = `500 ${bodySize}px 'Coolvetica', 'Quicksand', sans-serif`;
    bodyLineH = Math.round(bodySize * 1.38);
    let maxBLines = Math.max(1, Math.floor(bodyBudget / bodyLineH));
    bodyLines = wrapCanvasText(ctx, excerpt, maxWidth, maxBLines);

    while (
      bodySize < maxBodySize &&
      bodyLines.join(" ").indexOf("…") === -1 &&
      bodyLines.length * Math.round((bodySize + 2) * 1.38) < bodyBudget * 0.65
    ) {
      bodySize += 2;
      bodyLineH = Math.round(bodySize * 1.38);
      ctx.font = `500 ${bodySize}px 'Coolvetica', 'Quicksand', sans-serif`;
      maxBLines = Math.max(1, Math.floor(bodyBudget / bodyLineH));
      bodyLines = wrapCanvasText(ctx, excerpt, maxWidth, maxBLines);
    }
  }

  return {
    titleSize,
    titleLineH,
    titleLines,
    gapBetween,
    bodySize,
    bodyLineH,
    bodyLines
  };
}

async function renderStoryCard(post) {
  const canvas = document.getElementById("storyCanvas");
  const ctx = canvas.getContext("2d");

  const format = state.storyFormat || "story";
  const theme = state.storyTheme || "light";
  const photoMode = state.storyPhotoMode || "cover";
  const photoScale = Number(state.storyPhotoScale) || 44;

  const presets = {
    story: { W: 1080, H: 1920, padX: 72, cardY: 100, bottomGap: 230, innerPad: 64, headerH: 106, footerH: 118 },
    portrait: { W: 1080, H: 1350, padX: 56, cardY: 52, bottomGap: 52, innerPad: 54, headerH: 92, footerH: 102 },
    square: { W: 1080, H: 1080, padX: 44, cardY: 44, bottomGap: 44, innerPad: 48, headerH: 84, footerH: 92 }
  };
  const cfg = presets[format] || presets.story;
  const { W, H, padX, cardY, bottomGap, innerPad, headerH, footerH } = cfg;

  canvas.width = W;
  canvas.height = H;
  canvas.style.aspectRatio = `${W} / ${H}`;

  if (document.fonts && document.fonts.ready) {
    try { await document.fonts.ready; } catch {}
  }

  const isDark = theme === "dark";
  const palette = isDark
    ? {
        bg: "#130f10",
        card: "#1b1517",
        border: "rgba(227, 61, 72, 0.34)",
        dot: "rgba(255, 255, 255, 0.05)",
        crimson: "#e33d48",
        text: "#f7f1f1",
        muted: "#b9a8ab",
        pillBg: "#271d20",
        pillBorder: "rgba(255, 255, 255, 0.12)",
        polaroidBg: "#f8f4ef",
        watermark: "rgba(227, 61, 72, 0.07)"
      }
    : {
        bg: "#f7f2ec",
        card: "#fcfaf7",
        border: "rgba(184, 29, 39, 0.30)",
        dot: "rgba(184, 29, 39, 0.08)",
        crimson: "#b81d27",
        text: "#221a1c",
        muted: "#6d5c60",
        pillBg: "#f2ebe4",
        pillBorder: "rgba(34, 26, 28, 0.12)",
        polaroidBg: "#ffffff",
        watermark: "rgba(184, 29, 39, 0.055)"
      };

  // Fundo base
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, W, H);

  // Textura pontilhada de caderno
  ctx.fillStyle = palette.dot;
  for (let gx = 48; gx < W; gx += 42) {
    for (let gy = 48; gy < H; gy += 42) {
      ctx.beginPath();
      ctx.arc(gx, gy, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Cartão central tipo folha de scrapbook
  const cardW = W - padX * 2;
  const cardH = H - cardY - bottomGap;

  ctx.save();
  ctx.shadowColor = isDark ? "rgba(0,0,0,0.45)" : "rgba(34,26,28,0.12)";
  ctx.shadowBlur = 46;
  ctx.shadowOffsetY = 20;
  drawRoundedRect(ctx, padX, cardY, cardW, cardH, 34);
  ctx.fillStyle = palette.card;
  ctx.fill();
  ctx.restore();

  // Borda interna tracejada
  ctx.save();
  drawRoundedRect(ctx, padX + 20, cardY + 20, cardW - 40, cardH - 40, 24);
  ctx.setLineDash([12, 12]);
  ctx.lineWidth = 3;
  ctx.strokeStyle = palette.border;
  ctx.stroke();
  ctx.restore();

  // Marca d'água 愛
  ctx.save();
  ctx.fillStyle = palette.watermark;
  ctx.font = `700 ${format === "square" ? 400 : 520}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("愛", W / 2 + 110, cardY + cardH * 0.62);
  ctx.restore();

  const contentX = padX + innerPad;
  const contentW = cardW - innerPad * 2;
  const footerY = cardY + cardH - footerH;
  let cursorY = cardY + (format === "story" ? 64 : 44);

  // Selo hanko vermelho + nome do blog
  const sealSize = format === "story" ? 68 : 58;
  drawRoundedRect(ctx, contentX, cursorY, sealSize, sealSize, 15);
  ctx.fillStyle = palette.crimson;
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 ${format === "story" ? 38 : 34}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("愛", contentX + sealSize / 2, cursorY + sealSize / 2 + 2);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = palette.text;
  ctx.font = `700 ${format === "story" ? 38 : 34}px 'Coolvetica', 'Quicksand', sans-serif`;
  ctx.fillText(state.profile.name || "asonozz.", contentX + sealSize + 18, cursorY + Math.round(sealSize * 0.48));

  ctx.fillStyle = palette.muted;
  ctx.font = `500 ${format === "story" ? 22 : 19}px 'JetBrains Mono', monospace`;
  ctx.fillText("⋆⭒˚.⋆ novo texto no caderno", contentX + sealSize + 18, cursorY + Math.round(sealSize * 0.90));

  cursorY += headerH;

  const availableH = footerY - cursorY - 20;

  // Foto do post (sempre carregada quando existir e não estiver oculta)
  const loadedImg = (photoMode === "none" || !post.image) ? null : await loadImageForCanvas(post.image);

  if (loadedImg) {
    const framePad = format === "square" ? 14 : 18;
    const polaroidBottomLip = format === "square" ? 22 : 34;
    const maxPolH = Math.round(availableH * (photoScale / 100));

    let polW = contentW;
    let polH = maxPolH;

    if (photoMode === "contain") {
      // Sem corte: moldura acompanha exatamente a proporção original da foto
      const maxImgW = contentW - framePad * 2;
      const maxImgH = Math.max(80, maxPolH - framePad * 2 - polaroidBottomLip);
      const ratio = Math.min(maxImgW / loadedImg.width, maxImgH / loadedImg.height);
      const drawW = Math.round(loadedImg.width * ratio);
      const drawH = Math.round(loadedImg.height * ratio);
      polW = drawW + framePad * 2;
      polH = drawH + framePad * 2 + polaroidBottomLip;
    } else {
      // Preencher: largura acompanha sutilmente fotos bem pequenas para ficar harmônico
      if (photoScale <= 30) {
        polW = Math.round(contentW * (0.76 + ((photoScale - 22) / 8) * 0.24));
      }
      polH = maxPolH;
    }

    const imgBoxW = Math.max(40, polW - framePad * 2);
    const imgBoxH = Math.max(40, polH - framePad * 2 - polaroidBottomLip);
    const polCenterX = contentX + contentW / 2;
    const polCenterY = cursorY + polH / 2;

    ctx.save();
    ctx.translate(polCenterX, polCenterY);
    ctx.rotate(-0.01);

    ctx.shadowColor = "rgba(0,0,0,0.18)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 10;
    drawRoundedRect(ctx, -polW / 2, -polH / 2, polW, polH, 14);
    ctx.fillStyle = palette.polaroidBg;
    ctx.fill();
    ctx.shadowColor = "transparent";

    ctx.save();
    drawRoundedRect(ctx, -polW / 2 + framePad, -polH / 2 + framePad, imgBoxW, imgBoxH, 8);
    ctx.clip();
    if (photoMode === "contain") {
      ctx.drawImage(loadedImg, -polW / 2 + framePad, -polH / 2 + framePad, imgBoxW, imgBoxH);
    } else {
      drawImageCover(ctx, loadedImg, -polW / 2 + framePad, -polH / 2 + framePad, imgBoxW, imgBoxH);
    }
    ctx.restore();

    // Fita adesiva decorativa no topo da polaroid
    const tapeW = Math.min(136, Math.round(polW * 0.26));
    ctx.fillStyle = isDark ? "rgba(227, 61, 72, 0.35)" : "rgba(184, 29, 39, 0.22)";
    ctx.fillRect(-tapeW / 2, -polH / 2 - 10, tapeW, 24);

    ctx.restore();
    cursorY += polH + (format === "square" ? 20 : 32);
  } else {
    cursorY += format === "story" ? 28 : 16;
    ctx.fillStyle = palette.crimson;
    ctx.fillRect(contentX, cursorY, 88, 6);
    cursorY += format === "story" ? 48 : 34;
  }

  // Etiquetas de Data e Categoria (ajustam tamanho se sobrar pouco espaço)
  const remBeforePills = footerY - cursorY;
  const compactMeta = remBeforePills < 260;
  const pillH = compactMeta ? 36 : format === "square" ? 40 : 46;
  const metaFontSize = compactMeta ? 18 : format === "square" ? 19 : 22;

  const dateText = formatDate(post.date);
  const catText = (post.category || "pensamentos").toUpperCase();

  ctx.font = `600 ${metaFontSize}px 'JetBrains Mono', monospace`;
  const dateW = ctx.measureText(dateText).width + 34;
  const catW = ctx.measureText(catText).width + 34;

  drawRoundedRect(ctx, contentX, cursorY, dateW, pillH, pillH / 2);
  ctx.fillStyle = palette.pillBg;
  ctx.fill();
  ctx.strokeStyle = palette.pillBorder;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = palette.text;
  ctx.textBaseline = "middle";
  ctx.fillText(dateText, contentX + 17, cursorY + pillH / 2 + 1);

  drawRoundedRect(ctx, contentX + dateW + 12, cursorY, catW, pillH, pillH / 2);
  ctx.fillStyle = palette.crimson;
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.fillText(catText, contentX + dateW + 29, cursorY + pillH / 2 + 1);

  cursorY += pillH + (compactMeta ? 18 : format === "square" ? 26 : 34);

  // Texto adaptável ao espaço exato que sobrou abaixo da foto
  const cleanExcerpt = String(post.content || "")
    .replace(/^>\s?/gm, "")
    .replace(/\s+/g, " ")
    .trim();

  const textZoneH = Math.max(80, footerY - cursorY - 16);
  const typo = computeAdaptiveTypography(ctx, post.title, cleanExcerpt, contentW, textZoneH, format);

  // Desenha título
  ctx.textBaseline = "top";
  ctx.fillStyle = palette.text;
  ctx.font = `700 ${typo.titleSize}px 'Coolvetica', 'Quicksand', sans-serif`;
  for (const line of typo.titleLines) {
    ctx.fillText(line, contentX, cursorY);
    cursorY += typo.titleLineH;
  }

  // Desenha trecho do post
  if (typo.bodyLines.length) {
    cursorY += typo.gapBetween;
    ctx.fillStyle = palette.muted;
    ctx.font = `500 ${typo.bodySize}px 'Coolvetica', 'Quicksand', sans-serif`;
    for (const line of typo.bodyLines) {
      ctx.fillText(line, contentX, cursorY);
      cursorY += typo.bodyLineH;
    }
  }

  // Rodapé interno do cartão
  ctx.textBaseline = "alphabetic";
  ctx.strokeStyle = palette.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(contentX, footerY);
  ctx.lineTo(contentX + contentW, footerY);
  ctx.stroke();

  ctx.fillStyle = palette.crimson;
  ctx.font = `600 ${format === "square" ? 21 : 24}px 'JetBrains Mono', monospace`;
  const ctaLine = format === "story"
    ? "toque no link abaixo para ler ↓"
    : "leia o texto completo no blog →";
  ctx.fillText(ctaLine, contentX, footerY + (format === "square" ? 40 : 48));

  ctx.fillStyle = palette.muted;
  ctx.font = `500 ${format === "square" ? 19 : 21}px 'JetBrains Mono', monospace`;
  const hostDisplay = window.location.host || "blog-asonozz.vercel.app";
  ctx.fillText(`${state.profile.handle || "@asonozz"}  ·  ${hostDisplay}`, contentX, footerY + (format === "square" ? 70 : 82));
}

function getStoryBlob() {
  const canvas = document.getElementById("storyCanvas");
  return new Promise(resolve => {
    try {
      canvas.toBlob(blob => resolve(blob), "image/png");
    } catch {
      resolve(null);
    }
  });
}

function syncStoryPhotoControls(post) {
  const hasImg = Boolean(post?.image);
  const modeRow = document.getElementById("storyPhotoModeRow");
  const scaleRow = document.getElementById("storyPhotoScaleRow");
  modeRow.hidden = !hasImg;
  scaleRow.hidden = !hasImg || state.storyPhotoMode === "none";

  document.querySelectorAll("#storyPhotoModeGroup .pill").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.storyPhotoMode === state.storyPhotoMode);
  });

  document.getElementById("storyPhotoScaleInput").value = String(state.storyPhotoScale);
  document.getElementById("storyPhotoScaleValue").textContent = `${state.storyPhotoScale}%`;
}

async function openShareStoryModal(post) {
  const currentTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  state.storyTheme = currentTheme;
  state.storyFormat = "story";
  state.storyPhotoMode = "cover";
  state.storyPhotoScale = 44;

  document.getElementById("storyThemeLightBtn").classList.toggle("active", currentTheme === "light");
  document.getElementById("storyThemeDarkBtn").classList.toggle("active", currentTheme === "dark");

  document.querySelectorAll("#storyFormatGroup .pill").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.storyFormat === state.storyFormat);
  });

  syncStoryPhotoControls(post);

  document.getElementById("storyShareFeedback").textContent = "";
  document.getElementById("shareStoryModal").hidden = false;

  await renderStoryCard(post);

  const nativeBtn = document.getElementById("nativeShareStoryBtn");
  const blob = await getStoryBlob();
  if (blob && navigator.canShare) {
    const testFile = new File([blob], "story-asonozz.png", { type: "image/png" });
    nativeBtn.hidden = !navigator.canShare({ files: [testFile] });
  } else {
    nativeBtn.hidden = true;
  }
}

function closeShareStoryModal() {
  document.getElementById("shareStoryModal").hidden = true;
}

async function togglePinPost(postId) {
  if (!state.isOwner) return;
  const post = state.posts.find(p => p.id === postId);
  if (!post) return;
  post.pinned = !post.pinned;
  const ok = await persistDoc("posts", post);
  if (ok) {
    renderPosts();
    openPostDetail(postId, false);
  }
}

function renderCommentsForPost(postId) {
  const listEl = document.getElementById("commentsList");
  const visibleComments = state.comments.filter(
    c => c.postId === postId && (c.approved || state.isOwner)
  );

  if (!visibleComments.length) {
    listEl.innerHTML = `<p class="muted-small">Nenhum bilhetinho por aqui ainda. Seja o primeiro a deixar um recado.</p>`;
    return;
  }

  listEl.innerHTML = visibleComments
    .map(c => `
      <div class="comment-note ${c.approved ? "" : "is-pending"}">
        <div class="comment-note-head">
          <div>
            <span class="comment-author">${escapeHtml(c.author)}</span>
            ${c.approved ? "" : `<span class="pending-pill">aguardando aprovação</span>`}
          </div>
          <span class="comment-date">${formatDate(c.date)}</span>
        </div>
        <p class="comment-body">${escapeHtml(c.text).replaceAll("\n", "<br>")}</p>
        ${c.reply ? `
          <div class="owner-reply-box">
            <span class="owner-reply-badge">愛 ${escapeHtml(state.profile.handle)} respondeu:</span>
            <p>${escapeHtml(c.reply).replaceAll("\n", "<br>")}</p>
          </div>
        ` : ""}
        <div class="comment-owner-actions owner-only-flex">
          ${c.approved ? "" : `<button class="btn btn-primary btn-sm" data-approve-id="${escapeHtml(c.id)}">Aprovar</button>`}
          <button class="btn btn-outline btn-sm" data-reply-id="${escapeHtml(c.id)}">${c.reply ? "Editar resposta" : "Responder"}</button>
          <button class="btn btn-danger btn-sm" data-delete-comment-id="${escapeHtml(c.id)}">Apagar</button>
        </div>
      </div>
    `)
    .join("");

  listEl.querySelectorAll("[data-approve-id]").forEach(btn => {
    btn.addEventListener("click", () => approveComment(btn.dataset.approveId));
  });
  listEl.querySelectorAll("[data-reply-id]").forEach(btn => {
    btn.addEventListener("click", () => replyToComment(btn.dataset.replyId));
  });
  listEl.querySelectorAll("[data-delete-comment-id]").forEach(btn => {
    btn.addEventListener("click", () => deleteComment(btn.dataset.deleteCommentId));
  });
}

async function approveComment(commentId) {
  const comment = state.comments.find(c => c.id === commentId);
  if (!comment) return;
  comment.approved = true;
  await persistDoc("comments", comment);
  syncOwnerUI();
  renderPosts();
  renderModerationModal();
}

async function replyToComment(commentId) {
  const comment = state.comments.find(c => c.id === commentId);
  if (!comment) return;
  const answer = prompt(`Responder bilhetinho de ${comment.author}:`, comment.reply || "");
  if (answer === null) return;
  comment.reply = answer.trim();
  comment.replyDate = getLocalTodayIso();
  comment.approved = true;
  await persistDoc("comments", comment);
  syncOwnerUI();
  renderPosts();
  renderModerationModal();
}

async function deleteComment(commentId) {
  if (!confirm("Apagar este bilhetinho?")) return;
  state.comments = state.comments.filter(c => c.id !== commentId);
  await removeDoc("comments", commentId);
  syncOwnerUI();
  renderPosts();
  renderModerationModal();
}

function renderModerationModal() {
  const listEl = document.getElementById("moderationList");
  const pending = state.comments.filter(c => !c.approved);

  if (!pending.length) {
    listEl.innerHTML = `<p class="muted-small">Tudo em dia! Nenhum bilhetinho esperando aprovação.</p>`;
    return;
  }

  listEl.innerHTML = pending
    .map(c => {
      const post = state.posts.find(p => p.id === c.postId);
      const postTitle = post ? post.title : "Texto removido";
      return `
        <div class="comment-note is-pending">
          <div class="comment-note-head">
            <span class="comment-author">${escapeHtml(c.author)}</span>
            <span class="comment-date">${formatDate(c.date)} · em "${escapeHtml(postTitle)}"</span>
          </div>
          <p class="comment-body">${escapeHtml(c.text)}</p>
          <div class="comment-owner-actions owner-only-flex">
            <button class="btn btn-primary btn-sm" data-mod-approve="${escapeHtml(c.id)}">Aprovar</button>
            <button class="btn btn-outline btn-sm" data-mod-reply="${escapeHtml(c.id)}">Aprovar e responder</button>
            <button class="btn btn-danger btn-sm" data-mod-delete="${escapeHtml(c.id)}">Apagar</button>
          </div>
        </div>
      `;
    })
    .join("");

  listEl.querySelectorAll("[data-mod-approve]").forEach(btn => {
    btn.addEventListener("click", () => approveComment(btn.dataset.modApprove));
  });
  listEl.querySelectorAll("[data-mod-reply]").forEach(btn => {
    btn.addEventListener("click", () => replyToComment(btn.dataset.modReply));
  });
  listEl.querySelectorAll("[data-mod-delete]").forEach(btn => {
    btn.addEventListener("click", () => deleteComment(btn.dataset.modDelete));
  });
}

function renderArchive() {
  const container = document.getElementById("archiveList");
  if (!state.posts.length) {
    container.innerHTML = `<div class="empty-state"><p>Ainda não há textos no arquivo.</p></div>`;
    return;
  }

  const ordered = [...state.posts].sort((a, b) => {
    const dateDiff = String(b.date || "").localeCompare(String(a.date || ""));
    if (dateDiff !== 0) return dateDiff;
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  container.innerHTML = ordered
    .map(post => `
      <div class="archive-item" data-post-id="${escapeHtml(post.id)}">
        <span class="archive-item-title">${post.pinned ? "★ " : ""}${escapeHtml(post.title)}</span>
        <span class="archive-item-date">${formatDate(post.date)} · ${escapeHtml(post.category)}</span>
      </div>
    `)
    .join("");

  container.querySelectorAll(".archive-item").forEach(item => {
    item.addEventListener("click", () => openPostDetail(item.dataset.postId));
  });
}

function renderProjects() {
  const container = document.getElementById("projectsGrid");
  const empty = document.getElementById("projectsEmptyState");

  if (!state.projects.length) {
    container.innerHTML = "";
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  container.innerHTML = state.projects
    .map(proj => `
      <div class="project-card">
        <div class="project-card-top">
          <span class="project-status">${escapeHtml(proj.status || "ideia")}</span>
          <button class="project-delete owner-only" data-project-id="${escapeHtml(proj.id)}" title="Remover devaneio" aria-label="Remover devaneio">✕</button>
        </div>
        <h3>${escapeHtml(proj.title)}</h3>
        <p>${escapeHtml(proj.description)}</p>
        ${proj.url ? `<a class="project-link" href="${escapeHtml(proj.url)}" target="_blank" rel="noopener noreferrer">abrir link →</a>` : ""}
      </div>
    `)
    .join("");

  container.querySelectorAll(".project-delete").forEach(btn => {
    btn.addEventListener("click", async () => {
      if (!confirm("Remover esta ficha de devaneio?")) return;
      const id = btn.dataset.projectId;
      const ok = await removeDoc("projects", id);
      if (ok) {
        state.projects = state.projects.filter(p => p.id !== id);
        renderProjects();
      }
    });
  });
}

function renderAbout() {
  const p = state.profile;
  const extra = p.aboutExtra !== undefined ? p.aboutExtra : DEFAULT_PROFILE.aboutExtra;
  document.getElementById("aboutContent").innerHTML = `
    <span class="section-kicker">⋆˚࿔ quem escreve</span>
    <h2>Sobre ${escapeHtml(p.name)}</h2>
    <p>${escapeHtml(p.bio)}</p>
    ${extra && extra.trim() ? `<p>${escapeHtml(extra).replaceAll("\n", "<br>")}</p>` : ""}
    ${p.quote ? `<blockquote class="profile-quote">"${escapeHtml(p.quote)}"</blockquote>` : ""}
  `;
}

// Navegação
function switchView(viewName, scrollToFeed = false) {
  state.activeView = viewName;
  document.getElementById("siteCover").hidden = viewName !== "home";

  if (viewName !== "post") {
    state.currentPostId = null;
    if (window.location.hash.startsWith("#post=")) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }

  document.querySelectorAll(".view").forEach(v => (v.hidden = true));
  const target = document.getElementById(`view-${viewName}`);
  if (target) target.hidden = false;

  document.querySelectorAll(".nav-link").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === viewName);
  });

  document.getElementById("mobileNav").hidden = true;

  if (viewName === "mural") renderMural();
  if (viewName === "archive") renderArchive();
  if (viewName === "projects") renderProjects();
  if (viewName === "about") renderAbout();

  if (scrollToFeed && viewName === "home") {
    document.getElementById("feedStart").scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// Modais
function updateImagePreview(wrapId, imgId, src) {
  const wrap = document.getElementById(wrapId);
  const img = document.getElementById(imgId);
  if (src) {
    img.src = src;
    wrap.hidden = false;
  } else {
    img.src = "";
    wrap.hidden = true;
  }
}

function openLoginModal() {
  document.getElementById("loginStatusMsg").textContent = "";
  document.getElementById("loginModal").hidden = false;
}

function closeLoginModal() {
  document.getElementById("loginModal").hidden = true;
}

function openPostModal(post = null) {
  if (!state.isOwner) return;
  const modal = document.getElementById("postModal");
  document.getElementById("postModalTitle").textContent = post ? "Editar texto" : "Novo texto";
  document.getElementById("postIdInput").value = post ? post.id : "";
  document.getElementById("postTitleInput").value = post ? post.title : "";
  document.getElementById("postCategoryInput").value = post ? post.category : "pensamentos";
  document.getElementById("postContentInput").value = post ? post.content : "";
  document.getElementById("postImageFileInput").value = "";

  const dateInput = document.getElementById("postDateInput");
  if (dateInput) dateInput.value = post?.date || getLocalTodayIso();

  const pinInput = document.getElementById("postPinnedInput");
  if (pinInput) pinInput.checked = Boolean(post?.pinned);

  const isDataUrl = post?.image?.startsWith("data:");
  document.getElementById("postImageUrlInput").value = post?.image && !isDataUrl ? post.image : "";
  state.tempPostImage = post?.image || "";
  updateImagePreview("postImagePreview", "postImagePreviewImg", state.tempPostImage);
  modal.hidden = false;
}

function closePostModal() {
  document.getElementById("postModal").hidden = true;
}

async function deletePost(postId) {
  if (!state.isOwner) return;
  if (!confirm("Tem certeza que deseja excluir este texto?")) return;
  const ok = await removeDoc("posts", postId);
  if (ok) {
    state.posts = state.posts.filter(p => p.id !== postId);
    renderPosts();
    switchView("home", true);
  }
}

function openPhotoModal() {
  if (!state.isOwner) return;
  document.getElementById("photoUrlInput").value = "";
  document.getElementById("photoFileInput").value = "";
  document.getElementById("photoCaptionInput").value = "";
  state.tempMuralPhoto = "";
  updateImagePreview("photoPreviewWrap", "photoPreviewImg", "");
  document.getElementById("photoModal").hidden = false;
}

function closePhotoModal() {
  document.getElementById("photoModal").hidden = true;
}

function openProjectModal() {
  if (!state.isOwner) return;
  document.getElementById("projectTitleInput").value = "";
  document.getElementById("projectStatusInput").value = "em construção";
  document.getElementById("projectDescInput").value = "";
  document.getElementById("projectUrlInput").value = "";
  document.getElementById("projectModal").hidden = false;
}

function closeProjectModal() {
  document.getElementById("projectModal").hidden = true;
}

function openLightbox(photoId) {
  const photo = state.photos.find(p => p.id === photoId);
  if (!photo) return;
  state.currentLightboxPhotoId = photoId;
  document.getElementById("lightboxImg").src = photo.url;
  document.getElementById("lightboxCaption").textContent = photo.caption || "Sem legenda";
  document.getElementById("lightboxDate").textContent = formatDate(photo.date);
  document.getElementById("lightboxModal").hidden = false;
}

function closeLightbox() {
  document.getElementById("lightboxModal").hidden = true;
  state.currentLightboxPhotoId = null;
}

async function deleteCurrentPhoto() {
  if (!state.isOwner || !state.currentLightboxPhotoId) return;
  if (!confirm("Remover esta foto do mural?")) return;
  const id = state.currentLightboxPhotoId;
  const ok = await removeDoc("photos", id);
  if (ok) {
    state.photos = state.photos.filter(p => p.id !== id);
    closeLightbox();
    renderMural();
  }
}

function openProfileModal() {
  if (!state.isOwner) return;
  const p = state.profile;
  document.getElementById("profileNameInput").value = p.name || "";
  document.getElementById("profileHandleInput").value = p.handle || "";
  document.getElementById("profileTaglineInput").value = p.tagline || "";
  document.getElementById("profileBioInput").value = p.bio || "";
  document.getElementById("profileQuoteInput").value = p.quote || "";
  document.getElementById("profileAvatarFileInput").value = "";

  const likesTitleInput = document.getElementById("profileLikesTitleInput");
  const likesInput = document.getElementById("profileLikesInput");
  const aboutExtraInput = document.getElementById("profileAboutExtraInput");
  if (likesTitleInput) likesTitleInput.value = p.likesTitle || "Coisas que eu curto";
  if (likesInput) {
    const items = Array.isArray(p.likes) ? p.likes : DEFAULT_PROFILE.likes;
    likesInput.value = items.join("\n");
  }
  if (aboutExtraInput) {
    aboutExtraInput.value = p.aboutExtra !== undefined ? p.aboutExtra : DEFAULT_PROFILE.aboutExtra;
  }

  const isDataUrl = p.avatar?.startsWith("data:");
  document.getElementById("profileAvatarUrlInput").value = p.avatar && !isDataUrl ? p.avatar : "";
  state.tempProfileAvatar = p.avatar || "";

  document.getElementById("profileGithubInput").value = p.links?.github || "";
  document.getElementById("profileInstagramInput").value = p.links?.instagram || "";
  document.getElementById("profileXInput").value = p.links?.x || "";
  document.getElementById("profileGunsInput").value = p.links?.guns || "";
  document.getElementById("profileModal").hidden = false;
}

function closeProfileModal() {
  document.getElementById("profileModal").hidden = true;
}

// Backup
function exportBackup() {
  const data = {
    profile: state.profile,
    posts: state.posts,
    photos: state.photos,
    projects: state.projects,
    comments: state.comments,
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "blog-asonozz-backup.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importBackup(file) {
  const reader = new FileReader();
  reader.onload = async e => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed.profile) {
        state.profile = { ...DEFAULT_PROFILE, ...parsed.profile };
        await persistProfile();
      }
      if (Array.isArray(parsed.posts)) {
        state.posts = parsed.posts;
        await Promise.all(parsed.posts.map(item => persistDoc("posts", item)));
      }
      if (Array.isArray(parsed.photos)) {
        state.photos = parsed.photos;
        await Promise.all(parsed.photos.map(item => persistDoc("photos", item)));
      }
      if (Array.isArray(parsed.projects)) {
        state.projects = parsed.projects;
        await Promise.all(parsed.projects.map(item => persistDoc("projects", item)));
      }
      if (Array.isArray(parsed.comments)) {
        state.comments = parsed.comments;
        await Promise.all(parsed.comments.map(item => persistDoc("comments", item)));
      }
      renderAll();
      switchView("home");
      alert("Backup importado e sincronizado com sucesso!");
    } catch {
      alert("Arquivo inválido. Selecione um backup .json gerado pelo blog.");
    }
  };
  reader.readAsText(file);
}

// Eventos
function bindEvents() {
  // Atalho secreto 1: 3 cliques rápidos no selo 愛
  let sealClicks = 0;
  let sealTimer = null;
  document.getElementById("headerSeal").addEventListener("click", e => {
    sealClicks += 1;
    clearTimeout(sealTimer);
    if (sealClicks >= 3) {
      e.preventDefault();
      e.stopPropagation();
      sealClicks = 0;
      if (!state.isOwner) openLoginModal();
      return;
    }
    sealTimer = setTimeout(() => (sealClicks = 0), 650);
  });

  // Atalho secreto 2 (/#admin) + links diretos de post (/#post=...)
  window.addEventListener("hashchange", checkUrlHash);

  // Modal de Card / Story
  document.getElementById("closeShareStoryModalBtn").addEventListener("click", closeShareStoryModal);

  ["storyThemeLightBtn", "storyThemeDarkBtn"].forEach(btnId => {
    document.getElementById(btnId).addEventListener("click", async e => {
      const theme = e.currentTarget.dataset.storyTheme;
      state.storyTheme = theme;
      document.getElementById("storyThemeLightBtn").classList.toggle("active", theme === "light");
      document.getElementById("storyThemeDarkBtn").classList.toggle("active", theme === "dark");
      const post = state.posts.find(p => p.id === state.currentPostId);
      if (post) await renderStoryCard(post);
    });
  });

  document.querySelectorAll("#storyFormatGroup .pill").forEach(btn => {
    btn.addEventListener("click", async () => {
      state.storyFormat = btn.dataset.storyFormat;
      document.querySelectorAll("#storyFormatGroup .pill").forEach(b => {
        b.classList.toggle("active", b === btn);
      });
      const post = state.posts.find(p => p.id === state.currentPostId);
      if (post) await renderStoryCard(post);
    });
  });

  document.querySelectorAll("#storyPhotoModeGroup .pill").forEach(btn => {
    btn.addEventListener("click", async () => {
      state.storyPhotoMode = btn.dataset.storyPhotoMode;
      const post = state.posts.find(p => p.id === state.currentPostId);
      syncStoryPhotoControls(post);
      if (post) await renderStoryCard(post);
    });
  });

  document.getElementById("storyPhotoScaleInput").addEventListener("input", async e => {
    state.storyPhotoScale = Number(e.target.value);
    document.getElementById("storyPhotoScaleValue").textContent = `${state.storyPhotoScale}%`;
    const post = state.posts.find(p => p.id === state.currentPostId);
    if (post) await renderStoryCard(post);
  });

  document.getElementById("downloadStoryBtn").addEventListener("click", async () => {
    const post = state.posts.find(p => p.id === state.currentPostId);
    const blob = await getStoryBlob();
    if (!blob) {
      document.getElementById("storyShareFeedback").textContent = "O site da foto bloqueou o download direto. Envie a foto do computador/celular no post para baixar.";
      return;
    }
    const slug = (post?.title || "post")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 32);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `asonozz-${state.storyFormat}-${slug || "texto"}.png`;
    a.click();
    URL.revokeObjectURL(url);

    try {
      if (state.currentPostId) {
        await copyTextToClipboard(getPostShareUrl(state.currentPostId));
      }
      document.getElementById("storyShareFeedback").textContent = "✓ Card baixado e link copiado! Cole na figurinha de Link do Story.";
    } catch {
      document.getElementById("storyShareFeedback").textContent = "Card baixado! Use 'Só copiar link' para colar no Story.";
    }
  });

  document.getElementById("nativeShareStoryBtn").addEventListener("click", async () => {
    const post = state.posts.find(p => p.id === state.currentPostId);
    const blob = await getStoryBlob();
    if (!post || !blob) return;
    try {
      await copyTextToClipboard(getPostShareUrl(post.id));
    } catch {}
    const file = new File([blob], "story-asonozz.png", { type: "image/png" });
    try {
      await navigator.share({
        files: [file],
        title: post.title,
        text: `${post.title} — ${getPostShareUrl(post.id)}`
      });
    } catch {}
  });

  document.getElementById("copyStoryLinkBtn").addEventListener("click", async () => {
    if (!state.currentPostId) return;
    try {
      await copyTextToClipboard(getPostShareUrl(state.currentPostId));
      document.getElementById("storyShareFeedback").textContent = "✓ Link direto copiado para a figurinha do Story!";
    } catch {
      document.getElementById("storyShareFeedback").textContent = "Não foi possível copiar o link.";
    }
  });

  // Login e Logout
  document.getElementById("closeLoginModalBtn").addEventListener("click", closeLoginModal);

  document.getElementById("demoLoginBtn").addEventListener("click", () => {
    state.isOwner = true;
    localStorage.setItem(STORAGE_KEYS.demoOwner, "true");
    syncOwnerUI();
    closeLoginModal();
  });

  document.getElementById("loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    const statusEl = document.getElementById("loginStatusMsg");
    if (!cloud.enabled) {
      statusEl.textContent = "Firebase ainda não configurado. Clique em 'Entrar no modo demonstração' abaixo.";
      return;
    }
    const email = document.getElementById("loginEmailInput").value.trim();
    const password = document.getElementById("loginPasswordInput").value;
    statusEl.textContent = "Entrando...";
    try {
      await cloud.fns.signInWithEmailAndPassword(cloud.auth, email, password);
      closeLoginModal();
    } catch {
      statusEl.textContent = "E-mail ou senha incorretos.";
    }
  });

  document.getElementById("logoutOwnerBtn").addEventListener("click", async () => {
    if (cloud.enabled && cloud.auth) {
      await cloud.fns.signOut(cloud.auth);
    } else {
      state.isOwner = false;
      localStorage.removeItem(STORAGE_KEYS.demoOwner);
      syncOwnerUI();
    }
  });

  // Moderação
  document.getElementById("pendingBadgeBtn").addEventListener("click", () => {
    renderModerationModal();
    document.getElementById("moderationModal").hidden = false;
  });
  document.getElementById("closeModerationModalBtn").addEventListener("click", () => {
    document.getElementById("moderationModal").hidden = true;
  });

  // Navegação
  document.querySelectorAll("[data-view]").forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();
      switchView(el.dataset.view);
    });
  });

  document.getElementById("scrollToFeedBtn").addEventListener("click", () => {
    document.getElementById("feedStart").scrollIntoView({ behavior: "smooth" });
  });
  document.getElementById("scrollCueBtn").addEventListener("click", () => {
    document.getElementById("feedStart").scrollIntoView({ behavior: "smooth" });
  });
  document.getElementById("openMuralFromCoverBtn").addEventListener("click", () => switchView("mural"));
  document.getElementById("backToHomeBtn").addEventListener("click", () => switchView("home", true));

  document.getElementById("mobileMenuBtn").addEventListener("click", () => {
    const nav = document.getElementById("mobileNav");
    nav.hidden = !nav.hidden;
  });

  document.getElementById("themeToggleBtn").addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });

  document.getElementById("searchInput").addEventListener("input", e => {
    state.searchQuery = e.target.value;
    renderPosts();
  });

  document.querySelectorAll("#categoryFilters .pill").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#categoryFilters .pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.activeCategory = btn.dataset.category;
      renderPosts();
    });
  });

  // Enviar Bilhetinho
  document.getElementById("commentForm").addEventListener("submit", async e => {
    e.preventDefault();
    if (!state.currentPostId) return;
    const author = document.getElementById("commentAuthorInput").value.trim();
    const text = document.getElementById("commentTextInput").value.trim();
    if (!author || !text) return;

    const newComment = {
      id: "comm-" + Date.now(),
      postId: state.currentPostId,
      author,
      text,
      date: getLocalTodayIso(),
      createdAt: Date.now(),
      approved: state.isOwner,
      reply: "",
      replyDate: ""
    };

    const ok = await persistDoc("comments", newComment);
    if (!ok) return;

    if (!cloud.enabled) {
      state.comments.unshift(newComment);
      syncOwnerUI();
      renderPosts();
    }

    document.getElementById("commentAuthorInput").value = "";
    document.getElementById("commentTextInput").value = "";
    document.getElementById("commentFeedback").textContent = state.isOwner
      ? "Bilhetinho publicado!"
      : "Bilhetinho enviado! Vai aparecer aqui assim que @asonozz aprovar.";
  });

  // Modal de Post
  document.getElementById("newPostBtn").addEventListener("click", () => openPostModal(null));
  document.getElementById("closePostModalBtn").addEventListener("click", closePostModal);
  document.getElementById("cancelPostBtn").addEventListener("click", closePostModal);

  document.getElementById("postImageUrlInput").addEventListener("input", e => {
    state.tempPostImage = e.target.value.trim();
    updateImagePreview("postImagePreview", "postImagePreviewImg", state.tempPostImage);
  });

  document.getElementById("postImageFileInput").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    compressImageFile(file, 960, dataUrl => {
      state.tempPostImage = dataUrl;
      document.getElementById("postImageUrlInput").value = "";
      updateImagePreview("postImagePreview", "postImagePreviewImg", dataUrl);
    });
  });

  document.getElementById("clearPostImageBtn").addEventListener("click", () => {
    state.tempPostImage = "";
    document.getElementById("postImageUrlInput").value = "";
    document.getElementById("postImageFileInput").value = "";
    updateImagePreview("postImagePreview", "postImagePreviewImg", "");
  });

  document.getElementById("postForm").addEventListener("submit", async e => {
    e.preventDefault();
    if (!state.isOwner) return;
    const id = document.getElementById("postIdInput").value;
    const title = document.getElementById("postTitleInput").value.trim();
    const category = document.getElementById("postCategoryInput").value;
    const date = document.getElementById("postDateInput")?.value || getLocalTodayIso();
    const content = document.getElementById("postContentInput").value.trim();
    const pinned = Boolean(document.getElementById("postPinnedInput")?.checked);
    const image = state.tempPostImage;
    if (!title || !content) return;

    let savedPost;
    if (id) {
      const existing = state.posts.find(p => p.id === id);
      savedPost = { ...existing, title, category, date, content, image, pinned };
    } else {
      savedPost = {
        id: "post-" + Date.now(),
        title,
        category,
        date,
        createdAt: Date.now(),
        pinned,
        image,
        content
      };
    }

    const ok = await persistDoc("posts", savedPost);
    if (!ok) return;

    if (!cloud.enabled) {
      if (id) state.posts = state.posts.map(p => (p.id === id ? savedPost : p));
      else state.posts.unshift(savedPost);
      renderPosts();
    }

    closePostModal();
    if (id) openPostDetail(id);
    else switchView("home", true);
  });

  // Modal de Foto (Mural)
  document.getElementById("addPhotoBtn").addEventListener("click", openPhotoModal);
  document.getElementById("closePhotoModalBtn").addEventListener("click", closePhotoModal);
  document.getElementById("cancelPhotoBtn").addEventListener("click", closePhotoModal);

  document.getElementById("photoUrlInput").addEventListener("input", e => {
    state.tempMuralPhoto = e.target.value.trim();
    updateImagePreview("photoPreviewWrap", "photoPreviewImg", state.tempMuralPhoto);
  });

  document.getElementById("photoFileInput").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    compressImageFile(file, 960, dataUrl => {
      state.tempMuralPhoto = dataUrl;
      document.getElementById("photoUrlInput").value = "";
      updateImagePreview("photoPreviewWrap", "photoPreviewImg", dataUrl);
    });
  });

  document.getElementById("clearPhotoInputBtn").addEventListener("click", () => {
    state.tempMuralPhoto = "";
    document.getElementById("photoUrlInput").value = "";
    document.getElementById("photoFileInput").value = "";
    updateImagePreview("photoPreviewWrap", "photoPreviewImg", "");
  });

  document.getElementById("photoForm").addEventListener("submit", async e => {
    e.preventDefault();
    if (!state.isOwner) return;
    if (!state.tempMuralPhoto) {
      alert("Escolha uma imagem do computador ou cole o link de uma foto.");
      return;
    }

    const newPhoto = {
      id: "photo-" + Date.now(),
      url: state.tempMuralPhoto,
      caption: document.getElementById("photoCaptionInput").value.trim(),
      date: getLocalTodayIso(),
      createdAt: Date.now()
    };

    const ok = await persistDoc("photos", newPhoto);
    if (!ok) return;

    if (!cloud.enabled) {
      state.photos.unshift(newPhoto);
      renderMural();
    }
    closePhotoModal();
  });

  // Modal de Devaneio
  document.getElementById("addProjectBtn").addEventListener("click", openProjectModal);
  document.getElementById("closeProjectModalBtn").addEventListener("click", closeProjectModal);
  document.getElementById("cancelProjectBtn").addEventListener("click", closeProjectModal);

  document.getElementById("projectForm").addEventListener("submit", async e => {
    e.preventDefault();
    if (!state.isOwner) return;
    const title = document.getElementById("projectTitleInput").value.trim();
    const status = document.getElementById("projectStatusInput").value.trim() || "ideia";
    const description = document.getElementById("projectDescInput").value.trim();
    const url = document.getElementById("projectUrlInput").value.trim();
    if (!title || !description) return;

    const newProj = {
      id: "proj-" + Date.now(),
      title,
      status,
      description,
      url,
      createdAt: Date.now()
    };

    const ok = await persistDoc("projects", newProj);
    if (!ok) return;

    if (!cloud.enabled) {
      state.projects.unshift(newProj);
      renderProjects();
    }
    closeProjectModal();
  });

  // Lightbox
  document.getElementById("closeLightboxBtn").addEventListener("click", closeLightbox);
  document.getElementById("deletePhotoBtn").addEventListener("click", deleteCurrentPhoto);

  // Modal de Perfil
  document.getElementById("editProfileBtn").addEventListener("click", openProfileModal);
  document.getElementById("closeProfileModalBtn").addEventListener("click", closeProfileModal);
  document.getElementById("cancelProfileBtn").addEventListener("click", closeProfileModal);

  document.getElementById("profileAvatarUrlInput").addEventListener("input", e => {
    state.tempProfileAvatar = e.target.value.trim();
  });

  document.getElementById("profileAvatarFileInput").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    compressImageFile(file, 400, dataUrl => {
      state.tempProfileAvatar = dataUrl;
      document.getElementById("profileAvatarUrlInput").value = "";
    });
  });

  document.getElementById("clearAvatarBtn").addEventListener("click", () => {
    state.tempProfileAvatar = "";
    document.getElementById("profileAvatarUrlInput").value = "";
    document.getElementById("profileAvatarFileInput").value = "";
  });

  document.getElementById("profileForm").addEventListener("submit", async e => {
    e.preventDefault();
    if (!state.isOwner) return;

    const likesTitleInput = document.getElementById("profileLikesTitleInput");
    const likesInput = document.getElementById("profileLikesInput");
    const aboutExtraInput = document.getElementById("profileAboutExtraInput");

    const parsedLikes = likesInput
      ? likesInput.value
          .split("\n")
          .map(line => line.trim())
          .filter(Boolean)
      : state.profile.likes;

    state.profile = {
      name: document.getElementById("profileNameInput").value.trim() || "asonozz.",
      handle: document.getElementById("profileHandleInput").value.trim() || "@asonozz",
      tagline: document.getElementById("profileTaglineInput").value.trim(),
      bio: document.getElementById("profileBioInput").value.trim(),
      quote: document.getElementById("profileQuoteInput").value.trim(),
      avatar: state.tempProfileAvatar,
      likesTitle: likesTitleInput ? likesTitleInput.value.trim() || "Coisas que eu curto" : state.profile.likesTitle,
      likes: parsedLikes,
      aboutExtra: aboutExtraInput ? aboutExtraInput.value.trim() : state.profile.aboutExtra,
      links: {
        github: document.getElementById("profileGithubInput").value.trim(),
        instagram: document.getElementById("profileInstagramInput").value.trim(),
        x: document.getElementById("profileXInput").value.trim(),
        guns: document.getElementById("profileGunsInput").value.trim()
      }
    };

    const ok = await persistProfile();
    if (ok) {
      renderProfile();
      closeProfileModal();
    }
  });

  // Backup
  document.getElementById("exportDataBtn").addEventListener("click", exportBackup);
  document.getElementById("importDataInput").addEventListener("change", e => {
    if (e.target.files[0]) importBackup(e.target.files[0]);
    e.target.value = "";
  });

  // Fechar modais ao clicar fora ou apertar Escape
  ["postModal", "profileModal", "photoModal", "projectModal", "lightboxModal", "loginModal", "moderationModal", "shareStoryModal"].forEach(modalId => {
    const modal = document.getElementById(modalId);
    modal.addEventListener("click", e => {
      if (e.target === modal) modal.hidden = true;
    });
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closePostModal();
      closeProfileModal();
      closePhotoModal();
      closeProjectModal();
      closeLightbox();
      closeLoginModal();
      closeShareStoryModal();
      document.getElementById("moderationModal").hidden = true;
    }
  });
}

// === SCROLLTELLING & PARALLAX ===
function initScrollTelling() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const progressBar = document.getElementById("scrollProgress");
  const header = document.getElementById("siteHeader");
  const cover = document.getElementById("siteCover");
  const coverInner = document.getElementById("coverInner");
  const coverWatermark = document.getElementById("coverWatermark");
  let ticking = false;

  function updateOnScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;

    progressBar.style.transform = `scaleX(${progress})`;
    header.classList.toggle("is-scrolled", scrollTop > 14);

    if (!prefersReducedMotion && cover && !cover.hidden) {
      const coverHeight = cover.offsetHeight || window.innerHeight;
      const ratio = Math.min(1, scrollTop / coverHeight);
      coverInner.style.transform = `translateY(${scrollTop * 0.22}px)`;
      coverInner.style.opacity = String(Math.max(0, 1 - ratio * 1.15));
      coverWatermark.style.transform = `translate(-50%, calc(-50% + ${scrollTop * 0.34}px)) scale(${1 + ratio * 0.14})`;
    }

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
      }
    },
    { passive: true }
  );
  updateOnScroll();

  if (prefersReducedMotion) return;

  const revealSelectors = [
    ".feed-intro",
    ".toolbar",
    ".post-card",
    ".mural-item",
    ".post-detail-title",
    ".post-detail-cover",
    ".post-body > *",
    ".archive-item",
    ".project-card",
    ".about-card > *",
    ".sidebar .paper-card"
  ].join(", ");

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          requestAnimationFrame(() => el.classList.add("is-visible"));
          revealObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
  );

  function registerReveals(root = document, reset = false) {
    const elements = root.querySelectorAll(revealSelectors);
    let idx = 0;

    elements.forEach(el => {
      if (el.closest(".view[hidden]")) return;

      if (reset) {
        el.classList.remove("is-visible");
        delete el.dataset.revealReady;
      }

      if (el.dataset.revealReady) return;

      el.dataset.revealReady = "true";
      el.classList.add("reveal");
      el.style.transitionDelay = `${(idx % 5) * 75}ms`;
      idx += 1;
      revealObserver.observe(el);
    });
  }

  const mainCol = document.querySelector(".main-column");
  if (mainCol) {
    const domObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === "attributes" && mutation.attributeName === "hidden") {
          const view = mutation.target;
          if (!view.hidden) {
            registerReveals(view, true);
            updateOnScroll();
          }
        } else if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          registerReveals(mutation.target, false);
          updateOnScroll();
        }
      });
    });

    domObserver.observe(mainCol, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["hidden"]
    });
  }

  registerReveals(document, false);
}

// Inicialização
initTheme();
renderAll();
bindEvents();
initScrollTelling();
checkUrlHash();
initFirebaseIfConfigured();