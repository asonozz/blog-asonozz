// === CONFIGURAÇÃO DO FIREBASE ===
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCEqUzJpfX4l4hSjHpOUr9n2o8F4anRsVA",
  authDomain: "blog-asonozz.firebaseapp.com",
  projectId: "blog-asonozz",
  storageBucket: "blog-asonozz.firebasestorage.app",
  messagingSenderId: "7978098749",
  appId: "1:7978098749:web:bd3a2508b094aa6d43a394"
};

const STORAGE_KEYS = {
  profile: "asonozz_v3_profile",
  posts: "asonozz_v3_posts",
  photos: "asonozz_v3_photos",
  projects: "asonozz_v3_projects",
  comments: "asonozz_v3_comments",
  theme: "asonozz_v3_theme",
  demoOwner: "asonozz_v3_demo_owner"
};

function createStarterArt(bg, accent, mainSymbol, label, sublabel, ratio = "4/5") {
  const height = ratio === "4/5" ? 500 : 400;
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 ${height}">`,
    `<rect width="400" height="${height}" fill="${bg}"/>`,
    `<rect x="18" y="18" width="364" height="${height - 36}" fill="none" stroke="${accent}" stroke-opacity="0.28" stroke-dasharray="6 6" stroke-width="1.5"/>`,
    `<circle cx="200" cy="${Math.round(height * 0.44)}" r="72" fill="${accent}" fill-opacity="0.13"/>`,
    `<text x="200" y="${Math.round(height * 0.49)}" text-anchor="middle" fill="${accent}" font-family="serif" font-weight="700" font-size="88">${mainSymbol}</text>`,
    `<text x="34" y="${height - 54}" fill="${accent}" font-family="monospace" font-size="13" letter-spacing="2">${label}</text>`,
    `<text x="34" y="${height - 34}" fill="${accent}" fill-opacity="0.68" font-family="monospace" font-size="11">${sublabel}</text>`,
    `</svg>`
  ].join("");
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

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

const DEFAULT_POSTS = [
  {
    id: "post-1",
    title: "Um pequeno quarto na internet",
    category: "pensamentos",
    date: "2026-11-24",
    pinned: false,
    image: "",
    content:
      "Nem todo projeto chega ao destino final, mas cada um deles deixa alguma coisa para trás.\n\nCriei este caderno para fugir do barulho das redes sociais. Aqui não tem algoritmo nem contagem de curtidas — só textos, polaroids no mural e ideias soltas que aparecem no meio da madrugada.\n\n> \"e se eu tentasse isso?\"\n\nSinta-se em casa."
  },
  {
    id: "post-2",
    title: "Construindo meu espaço do zero",
    category: "código",
    date: "2026-11-22",
    pinned: false,
    image: "",
    content:
      "Escolhi manter tudo em HTML, CSS e JavaScript puro: leve, rápido e completamente meu. O vermelho carmesim sobre o papel branco nasceu da minha identidade visual — direto, calmo e cheio de detalhes pequenos.\n\nA ideia é ir mexendo, colando novas fotos e transformando este canto junto comigo."
  },
  {
    id: "post-3",
    title: "Coisas que só fazem sentido de madrugada",
    category: "devaneios",
    date: "2026-11-18",
    pinned: false,
    image: "",
    content:
      "Existe um silêncio diferente depois da meia-noite. A tela acesa, nenhuma pressa e a vontade de experimentar qualquer projeto aleatório sem precisar explicar para ninguém.\n\nEste blog existe justamente para guardar esses fragmentos antes que sumam de manhã."
  }
];

const DEFAULT_PHOTOS = [
  {
    id: "photo-1",
    url: createStarterArt("#181213", "#e33d48", "愛", "SELO // 01", "carmesim & silêncio", "4/5"),
    caption: "identidade visual — entre no modo dono para colar suas fotos",
    date: "2026-11-24"
  },
  {
    id: "photo-2",
    url: createStarterArt("#fcfaf7", "#b81d27", "02", "MADRUGADA // 02", "quiet thoughts", "1/1"),
    caption: "noites longas & pensamentos calmos",
    date: "2026-11-21"
  },
  {
    id: "photo-3",
    url: createStarterArt("#b81d27", "#ffffff", "★", "DEVANEIOS // 03", "building things", "1/1"),
    caption: "recortes de coisas que quero lembrar",
    date: "2026-11-18"
  },
  {
    id: "photo-4",
    url: createStarterArt("#22191b", "#f5eeee", "☾", "ARQUIVO // 04", "look at the light", "4/5"),
    caption: "um mural aberto para atmosferas e memórias",
    date: "2026-11-14"
  }
];

const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    title: "blog-asonozz",
    status: "em construção",
    description: "Meu blog pessoal em estética scrapbook — feito em HTML, CSS e JS puro.",
    url: "https://github.com/asonozz/blog-asonozz"
  },
  {
    id: "proj-2",
    title: "experimentos em código",
    status: "caderno de estudos",
    description: "Scripts em Python e Java, testes soltos e aprendizados do dia a dia.",
    url: "https://github.com/asonozz"
  },
  {
    id: "proj-3",
    title: "ideias da madrugada",
    status: "rascunhos",
    description: "Pequenos protótipos que começaram com curiosidade e viraram referência.",
    url: ""
  }
];

const DEFAULT_COMMENTS = [
  {
    id: "comm-1",
    postId: "post-1",
    author: "visitante da madrugada",
    text: "Adorei o clima de caderno desse blog! Muito mais calmo do que as redes sociais.",
    date: "2026-11-24",
    approved: true,
    reply: "valeu por passar por aqui! era exatamente essa a ideia.",
    replyDate: "2026-11-24"
  }
];

let cloud = {
  enabled: false,
  auth: null,
  db: null,
  fns: null
};

let state = {
  profile: { ...DEFAULT_PROFILE, ...loadFromStorage(STORAGE_KEYS.profile, DEFAULT_PROFILE) },
  posts: loadFromStorage(STORAGE_KEYS.posts, DEFAULT_POSTS),
  photos: loadFromStorage(STORAGE_KEYS.photos, DEFAULT_PHOTOS),
  projects: loadFromStorage(STORAGE_KEYS.projects, DEFAULT_PROJECTS),
  comments: loadFromStorage(STORAGE_KEYS.comments, DEFAULT_COMMENTS),
  isOwner: false,
  activeView: "home",
  activeCategory: "todos",
  searchQuery: "",
  currentPostId: null,
  currentLightboxPhotoId: null,
  tempPostImage: "",
  tempProfileAvatar: "",
  tempMuralPhoto: ""
};

// Utilitários seguros
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
    alert("O armazenamento do navegador ficou cheio. Tente usar links de imagem ou fotos menores.");
  }
}

function escapeHtml(text = "") {
  const div = document.createElement("div");
  div.textContent = String(text);
  return div.innerHTML
    .replaceAll("\u0022", "&" + "quot;")
    .replaceAll("\u0027", "&" + "#39;");
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

function getExcerpt(content = "") {
  const plain = content.replace(/^>\s?/gm, "").replace(/\s+/g, " ").trim();
  return plain.length > 165 ? plain.slice(0, 165) + "..." : plain;
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
      callback(canvas.toDataURL("image/jpeg", 0.78));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// === CAMADA DE PERSISTÊNCIA (LOCAL OU FIREBASE) ===
async function initFirebaseIfConfigured() {
  if (!FIREBASE_CONFIG.apiKey || !FIREBASE_CONFIG.projectId) {
    state.isOwner = localStorage.getItem(STORAGE_KEYS.demoOwner) === "true";
    syncOwnerUI();
    checkAdminHash();
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

    cloud.fns.onAuthStateChanged(cloud.auth, async user => {
      state.isOwner = Boolean(user);
      if (user) closeLoginModal();
      syncOwnerUI();
      await loadAllFromCloud();
      checkAdminHash();
    });

    await loadAllFromCloud();
  } catch (err) {
    console.error("Erro ao iniciar Firebase:", err);
  }
}

async function loadAllFromCloud() {
  if (!cloud.enabled) return;
  const { doc, getDoc, collection, getDocs } = cloud.fns;

  try {
    const profileSnap = await getDoc(doc(cloud.db, "site", "profile"));
    if (profileSnap.exists()) {
      state.profile = { ...DEFAULT_PROFILE, ...profileSnap.data() };
    }

    const [postsSnap, photosSnap, projSnap, commSnap] = await Promise.all([
      getDocs(collection(cloud.db, "posts")),
      getDocs(collection(cloud.db, "photos")),
      getDocs(collection(cloud.db, "projects")),
      getDocs(collection(cloud.db, "comments"))
    ]);

    if (!postsSnap.empty) {
      state.posts = postsSnap.docs.map(d => d.data()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }
    if (!photosSnap.empty) {
      state.photos = photosSnap.docs.map(d => d.data()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }
    if (!projSnap.empty) {
      state.projects = projSnap.docs.map(d => d.data()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }
    state.comments = commSnap.docs.map(d => d.data()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    renderAll();
  } catch (err) {
    console.error("Erro ao carregar dados do Firebase:", err);
  }
}

async function persistProfile() {
  saveToStorage(STORAGE_KEYS.profile, state.profile);
  if (cloud.enabled && state.isOwner) {
    await cloud.fns.setDoc(cloud.fns.doc(cloud.db, "site", "profile"), state.profile);
  }
}

async function persistDoc(colName, item) {
  if (colName === "posts") saveToStorage(STORAGE_KEYS.posts, state.posts);
  if (colName === "photos") saveToStorage(STORAGE_KEYS.photos, state.photos);
  if (colName === "projects") saveToStorage(STORAGE_KEYS.projects, state.projects);
  if (colName === "comments") saveToStorage(STORAGE_KEYS.comments, state.comments);

  if (cloud.enabled) {
    await cloud.fns.setDoc(cloud.fns.doc(cloud.db, colName, item.id), item);
  }
}

async function removeDoc(colName, id) {
  if (colName === "posts") saveToStorage(STORAGE_KEYS.posts, state.posts);
  if (colName === "photos") saveToStorage(STORAGE_KEYS.photos, state.photos);
  if (colName === "projects") saveToStorage(STORAGE_KEYS.projects, state.projects);
  if (colName === "comments") saveToStorage(STORAGE_KEYS.comments, state.comments);

  if (cloud.enabled && state.isOwner) {
    await cloud.fns.deleteDoc(cloud.fns.doc(cloud.db, colName, id));
  }
}

// Modo dono / visitante
function syncOwnerUI() {
  document.body.classList.toggle("is-owner", state.isOwner);
  const pendingCount = state.comments.filter(c => !c.approved).length;
  const label = pendingCount === 1 ? "1 bilhetinho pendente" : `${pendingCount} bilhetinhos pendentes`;
  document.getElementById("pendingCountText").textContent = label;

  if (state.activeView === "post" && state.currentPostId) {
    renderCommentsForPost(state.currentPostId);
  }
}

function checkAdminHash() {
  if (window.location.hash === "#admin" && !state.isOwner) {
    openLoginModal();
    history.replaceState(null, "", window.location.pathname + window.location.search);
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

  // Cartão "Coisas que eu curto" (editável)
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
              <span class="post-cat">${escapeHtml(post.category)}</span>
              <span>${formatDate(post.date)}</span>
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
  const detailEl = document.getElementById("postDetailContent");
  detailEl.innerHTML = `
    <div class="post-meta">
      ${post.pinned ? `<span class="post-pinned-badge">★ fixado</span>` : ""}
      <span class="post-cat">${escapeHtml(post.category)}</span>
      <span>${formatDate(post.date)}</span>
      <span>·</span>
      <span>${estimateReadingTime(post.content)}</span>
    </div>
    <h1 class="post-detail-title">${escapeHtml(post.title)}</h1>
    ${post.image ? `<img class="post-detail-cover" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}">` : ""}
    <div class="post-body">${formatPostContent(post.content)}</div>
    <div class="post-detail-actions owner-only-flex">
      <button class="btn btn-outline btn-sm" id="togglePinPostBtn">${post.pinned ? "Desafixar" : "★ Fixar no topo"}</button>
      <button class="btn btn-outline btn-sm" id="editCurrentPostBtn">Editar texto</button>
      <button class="btn btn-danger btn-sm" id="deleteCurrentPostBtn">Excluir</button>
    </div>
  `;

  document.getElementById("togglePinPostBtn").addEventListener("click", () => togglePinPost(post.id));
  document.getElementById("editCurrentPostBtn").addEventListener("click", () => openPostModal(post));
  document.getElementById("deleteCurrentPostBtn").addEventListener("click", () => deletePost(post.id));
  document.getElementById("commentFeedback").textContent = "";

  renderCommentsForPost(postId);
  if (shouldSwitch) switchView("post");
}

async function togglePinPost(postId) {
  if (!state.isOwner) return;
  const post = state.posts.find(p => p.id === postId);
  if (!post) return;
  post.pinned = !post.pinned;
  await persistDoc("posts", post);
  renderPosts();
  openPostDetail(postId, false);
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
  comment.replyDate = new Date().toISOString().slice(0, 10);
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

  container.innerHTML = state.posts
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
      state.projects = state.projects.filter(p => p.id !== id);
      await removeDoc("projects", id);
      renderProjects();
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
  state.posts = state.posts.filter(p => p.id !== postId);
  await removeDoc("posts", postId);
  renderPosts();
  switchView("home", true);
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
  state.photos = state.photos.filter(p => p.id !== id);
  await removeDoc("photos", id);
  closeLightbox();
  renderMural();
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
  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed.profile) {
        state.profile = { ...DEFAULT_PROFILE, ...parsed.profile };
        saveToStorage(STORAGE_KEYS.profile, state.profile);
      }
      if (Array.isArray(parsed.posts)) {
        state.posts = parsed.posts;
        saveToStorage(STORAGE_KEYS.posts, state.posts);
      }
      if (Array.isArray(parsed.photos)) {
        state.photos = parsed.photos;
        saveToStorage(STORAGE_KEYS.photos, state.photos);
      }
      if (Array.isArray(parsed.projects)) {
        state.projects = parsed.projects;
        saveToStorage(STORAGE_KEYS.projects, state.projects);
      }
      if (Array.isArray(parsed.comments)) {
        state.comments = parsed.comments;
        saveToStorage(STORAGE_KEYS.comments, state.comments);
      }
      renderAll();
      switchView("home");
      alert("Backup importado com sucesso!");
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

  // Atalho secreto 2: /#admin na URL
  window.addEventListener("hashchange", checkAdminHash);

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
      date: new Date().toISOString().slice(0, 10),
      createdAt: Date.now(),
      approved: state.isOwner,
      reply: "",
      replyDate: ""
    };

    state.comments.unshift(newComment);
    await persistDoc("comments", newComment);

    document.getElementById("commentAuthorInput").value = "";
    document.getElementById("commentTextInput").value = "";
    document.getElementById("commentFeedback").textContent = state.isOwner
      ? "Bilhetinho publicado!"
      : "Bilhetinho enviado! Vai aparecer aqui assim que @asonozz aprovar.";

    syncOwnerUI();
    renderPosts();
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
    const content = document.getElementById("postContentInput").value.trim();
    const pinned = Boolean(document.getElementById("postPinnedInput")?.checked);
    const image = state.tempPostImage;
    if (!title || !content) return;

    let savedPost;
    if (id) {
      const existing = state.posts.find(p => p.id === id);
      savedPost = { ...existing, title, category, content, image, pinned };
      state.posts = state.posts.map(p => (p.id === id ? savedPost : p));
    } else {
      savedPost = {
        id: "post-" + Date.now(),
        title,
        category,
        date: new Date().toISOString().slice(0, 10),
        createdAt: Date.now(),
        pinned,
        image,
        content
      };
      state.posts.unshift(savedPost);
    }

    await persistDoc("posts", savedPost);
    renderPosts();
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
      date: new Date().toISOString().slice(0, 10),
      createdAt: Date.now()
    };

    state.photos.unshift(newPhoto);
    await persistDoc("photos", newPhoto);
    renderMural();
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

    state.projects.unshift(newProj);
    await persistDoc("projects", newProj);
    renderProjects();
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
    await persistProfile();
    renderProfile();
    closeProfileModal();
  });

  // Backup
  document.getElementById("exportDataBtn").addEventListener("click", exportBackup);
  document.getElementById("importDataInput").addEventListener("change", e => {
    if (e.target.files[0]) importBackup(e.target.files[0]);
    e.target.value = "";
  });

  // Fechar modais ao clicar fora ou apertar Escape
  ["postModal", "profileModal", "photoModal", "projectModal", "lightboxModal", "loginModal", "moderationModal"].forEach(modalId => {
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
initFirebaseIfConfigured();