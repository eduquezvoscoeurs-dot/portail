/* =========================================
   ÉDUQUER VOS CŒURS — Portail Interne
   Version Firebase — Données réelles
   =========================================

   ÉTAPE 1 : Allez sur console.firebase.google.com
   ÉTAPE 2 : Créez un projet, copiez la config ci-dessous
   ========================================= */

const firebaseConfig = {
  apiKey: "AIzaSyBPGRm--B8CQAA_nUQMETojqBZX_6nwFCk",
  authDomain: "fir-coeurs.firebaseapp.com",
  projectId: "fir-coeurs",
  storageBucket: "fir-coeurs.firebasestorage.app",
  messagingSenderId: "882167235117",
  appId: "1:882167235117:web:3e5cce98c9c61d5aa02ea4",
  measurementId: "G-4292KC7D1J"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();
const storage = firebase.storage();

const ADMIN_EMAIL = "eduquezvoscoeurs@gmail.com";

// =================== DONNÉES STATIQUES ===================

const SECTIONS_DATA = [
  { id:1, name:"Communication",     icon:"megaphone",     color:"#e8a020", bgColor:"rgba(232,160,32,0.12)",  rs:"À confirmer", tasks:0, status:"Actif" },
  { id:2, name:"Santé Mentale",     icon:"brain",         color:"#8e44ad", bgColor:"rgba(142,68,173,0.12)",  rs:"À confirmer", tasks:0, status:"Actif" },
  { id:3, name:"Don & Distribution",icon:"gift",          color:"#2980b9", bgColor:"rgba(41,128,185,0.12)",  rs:"À confirmer", tasks:0, status:"Actif" },
  { id:4, name:"Bénévolat",         icon:"handshake",     color:"#e74c3c", bgColor:"rgba(231,76,60,0.12)",   rs:"À confirmer", tasks:0, status:"Actif" },
  { id:5, name:"Événementiel",      icon:"calendar-check",color:"#16a085", bgColor:"rgba(22,160,133,0.12)",  rs:"À confirmer", tasks:0, status:"Actif" },
  { id:6, name:"Finance",           icon:"landmark",      color:"#27ae60", bgColor:"rgba(39,174,96,0.12)",   rs:"À confirmer", tasks:0, status:"Actif" },
  { id:7, name:"Formation",         icon:"graduation-cap",color:"#1e3d59", bgColor:"rgba(30,61,89,0.12)",    rs:"À confirmer", tasks:0, status:"Actif" },
];

const COUNTRIES = [
  { flag:"🇧🇫", name:"Burkina Faso",  status:"active",    label:"Actif" },
  { flag:"🇨🇮", name:"Côte d'Ivoire", status:"active",    label:"Actif" },
  { flag:"🇳🇪", name:"Niger",         status:"active",    label:"Actif" },
  { flag:"🇲🇦", name:"Maroc",         status:"extension", label:"Extension" },
  { flag:"🇨🇦", name:"Canada",        status:"extension", label:"Extension" },
  { flag:"🇫🇷", name:"France",        status:"extension", label:"Extension" },
  { flag:"🇬🇧", name:"Angleterre",    status:"extension", label:"Extension" },
  { flag:"🇷🇺", name:"Russie",        status:"planned",   label:"Prévu" },
  { flag:"🇨🇳", name:"Chine",         status:"active",    label:"Partenaire" },
];

// =================== ÉTAT ===================

let currentUser   = null;
let isDarkMode    = false;
let notifOpen     = false;
let calendarDate  = new Date();
let newsUnsub     = null;
let allEvents     = [];
let allDocs       = [];

// =================== INIT ===================

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("evc_theme");
  if (saved === "dark") {
    isDarkMode = true;
    document.documentElement.setAttribute("data-theme", "dark");
  }

  auth.onAuthStateChanged(async firebaseUser => {
    if (firebaseUser) {
      await chargerProfil(firebaseUser);
      showApp();
    } else {
      showLogin();
    }
  });

  setupListeners();
});

async function chargerProfil(firebaseUser) {
  const isAdmin = firebaseUser.email === ADMIN_EMAIL;
  try {
    const doc = await db.collection("users").doc(firebaseUser.uid).get();
    if (doc.exists) {
      currentUser = { uid: firebaseUser.uid, email: firebaseUser.email, isAdmin, ...doc.data() };
    } else {
      const profil = {
        name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
        initials: firebaseUser.email.substring(0, 2).toUpperCase(),
        role: isAdmin ? "Administratrice" : "Bénévole",
        section: "–", country: "–",
        mandateStart: new Date().toISOString().split("T")[0],
        mandateDays: 365, color: isAdmin ? "#1e3d59" : "#17a589",
        isAdmin,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      await db.collection("users").doc(firebaseUser.uid).set(profil);
      currentUser = { uid: firebaseUser.uid, email: firebaseUser.email, ...profil };
    }
  } catch (e) {
    currentUser = {
      uid: firebaseUser.uid, email: firebaseUser.email, isAdmin,
      name: firebaseUser.email, initials: "??",
      role: isAdmin ? "Administratrice" : "Membre",
      section: "–", country: "–",
      mandateStart: new Date().toISOString().split("T")[0],
      mandateDays: 365, color: "#17a589",
    };
  }
}

function setupListeners() {
  document.getElementById("login-form")?.addEventListener("submit", handleLogin);
  document.getElementById("register-form")?.addEventListener("submit", handleRegister);
  document.getElementById("show-register")?.addEventListener("click", () => toggleAuthMode(false));
  document.getElementById("show-login")?.addEventListener("click", () => toggleAuthMode(true));
  document.getElementById("forgot-password")?.addEventListener("click", handleForgotPassword);
  document.getElementById("theme-toggle")?.addEventListener("click", toggleTheme);
  document.getElementById("notif-btn")?.addEventListener("click", toggleNotifPanel);
  document.getElementById("notif-close")?.addEventListener("click", () => setNotifPanel(false));
  document.getElementById("menu-toggle")?.addEventListener("click", toggleSidebar);
  document.getElementById("sidebar-overlay")?.addEventListener("click", closeSidebar);
  document.getElementById("logout-btn")?.addEventListener("click", logout);
  document.getElementById("alert-close")?.addEventListener("click", e => e.target.closest(".alert-banner")?.remove());
  document.getElementById("cal-prev")?.addEventListener("click", () => { calendarDate.setMonth(calendarDate.getMonth()-1); renderCalendar(); });
  document.getElementById("cal-next")?.addEventListener("click", () => { calendarDate.setMonth(calendarDate.getMonth()+1); renderCalendar(); });
  document.getElementById("news-submit")?.addEventListener("click", publierActualite);
  document.getElementById("upload-btn")?.addEventListener("click", () => document.getElementById("file-input")?.click());
  document.getElementById("file-input")?.addEventListener("change", handleUpload);
  document.getElementById("invite-btn")?.addEventListener("click", envoyerInvitation);
  document.querySelectorAll(".nav-item[data-page]").forEach(item => {
    item.addEventListener("click", () => { navigateTo(item.dataset.page); closeSidebar(); });
  });
  document.querySelectorAll(".mood-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mood-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      showToast(`Humeur "${btn.querySelector(".mood-label").textContent}" enregistrée. 💚`, "success");
    });
  });
  document.querySelectorAll(".qa-item[data-page]").forEach(item => {
    item.addEventListener("click", () => navigateTo(item.dataset.page));
  });
  document.getElementById("global-search")?.addEventListener("input", e => {
    if (e.target.value.length > 2) showToast(`Recherche : "${e.target.value}"…`, "info");
  });
}

function toggleAuthMode(showLoginForm) {
  document.getElementById("login-form-wrap").style.display  = showLoginForm ? "block" : "none";
  document.getElementById("register-form-wrap").style.display = showLoginForm ? "none" : "block";
}

// =================== AUTH ===================

async function handleLogin(e) {
  e.preventDefault();
  const email    = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const btn      = document.getElementById("login-btn");
  btn.disabled = true; btn.textContent = "Connexion…";
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    const msgs = {
      "auth/user-not-found":    "Aucun compte trouvé pour cet email",
      "auth/wrong-password":    "Mot de passe incorrect",
      "auth/too-many-requests": "Trop de tentatives — réessayez plus tard",
      "auth/invalid-email":     "Format d'email invalide",
    };
    btn.style.background = "#e74c3c";
    btn.textContent = msgs[err.code] || "Identifiants incorrects";
    setTimeout(() => { btn.style.background = ""; btn.textContent = "Se connecter →"; btn.disabled = false; }, 3000);
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const name     = document.getElementById("register-name").value.trim();
  const email    = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value;
  const btn      = document.getElementById("register-btn");
  if (!name) { showToast("Entrez votre nom complet.", "warning"); return; }
  btn.disabled = true; btn.textContent = "Création…";
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    const initials = name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
    const colors   = ["#1e3d59","#17a589","#e8a020","#8e44ad","#e74c3c","#27ae60","#2980b9"];
    const color    = colors[Math.floor(Math.random() * colors.length)];
    await db.collection("users").doc(cred.user.uid).set({
      name, initials, color,
      role: "Bénévole", section: "Bénévolat", country: "Burkina Faso",
      mandateStart: new Date().toISOString().split("T")[0], mandateDays: 90,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch (err) {
    const msgs = {
      "auth/email-already-in-use": "Cet email est déjà utilisé",
      "auth/weak-password":        "Mot de passe trop court (6 caractères minimum)",
      "auth/invalid-email":        "Format d'email invalide",
    };
    btn.style.background = "#e74c3c";
    btn.textContent = msgs[err.code] || "Erreur lors de la création";
    setTimeout(() => { btn.style.background = ""; btn.textContent = "Créer mon compte"; btn.disabled = false; }, 3000);
  }
}

async function handleForgotPassword() {
  const email = document.getElementById("login-email").value.trim();
  if (!email) { showToast("Entrez votre email dans le champ ci-dessus.", "warning"); return; }
  try {
    await auth.sendPasswordResetEmail(email);
    showToast(`Email de réinitialisation envoyé à ${email}`, "success");
  } catch {
    showToast("Email introuvable.", "error");
  }
}

function logout() {
  if (newsUnsub) newsUnsub();
  auth.signOut();
}

// =================== AFFICHAGE ===================

function showLogin() {
  document.getElementById("app").style.display = "none";
  document.getElementById("login-page").style.display = "flex";
  if (window.lucide) lucide.createIcons();
}

function applyAdminUI() {
  document.querySelectorAll(".admin-only").forEach(el => {
    el.style.display = currentUser?.isAdmin ? "" : "none";
  });
}

function showApp() {
  document.getElementById("login-page").style.display = "none";
  document.getElementById("app").style.display = "flex";
  populateUserInfo();
  applyAdminUI();
  renderMandateProgress();
  listenToNews();
  chargerEvenements();
  renderCalendar();
  renderSections();
  chargerDocuments();
  chargerMembres();
  chargerNotifications();
  renderCountries();
  animateCounters();
  navigateTo("dashboard");
  setTimeout(() => {
    if (window.lucide) lucide.createIcons();
    // Filtres événements
    document.querySelectorAll("#page-events .filter-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("#page-events .filter-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        renderEvents(chip.dataset.filter);
      });
    });
  }, 200);
}

// =================== PROFIL ===================

function populateUserInfo() {
  if (!currentUser) return;
  const j = new Date();
  const jours   = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
  const mois    = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
  const dateStr = `${jours[j.getDay()]} ${j.getDate()} ${mois[j.getMonth()]} ${j.getFullYear()}`;

  document.getElementById("sidebar-name").textContent   = currentUser.name;
  document.getElementById("sidebar-role").textContent   = currentUser.role;
  document.getElementById("sidebar-avatar").textContent = currentUser.initials;
  document.getElementById("sidebar-avatar").style.background = currentUser.color;
  document.getElementById("header-avatar").textContent  = currentUser.initials;
  document.getElementById("welcome-name").textContent   = currentUser.name.split(" ")[0];
  document.getElementById("welcome-role").textContent   = `${currentUser.role} • ${currentUser.section} • ${currentUser.country}`;
  document.getElementById("welcome-date").textContent   = dateStr;
  document.getElementById("profile-name").textContent   = currentUser.name;
  document.getElementById("profile-role").textContent   = `${currentUser.role} — ${currentUser.section}`;
  document.getElementById("profile-initials").textContent = currentUser.initials;
  document.getElementById("profile-initials").style.background = currentUser.color;
  document.getElementById("profile-country").textContent = currentUser.country;
}

function renderMandateProgress() {
  if (!currentUser) return;
  const start     = new Date(currentUser.mandateStart || new Date());
  const elapsed   = Math.max(0, Math.floor((new Date() - start) / 86400000));
  const total     = currentUser.mandateDays || 90;
  const remaining = Math.max(0, total - elapsed);
  const pct       = Math.min(100, Math.round((elapsed / total) * 100));

  document.getElementById("mandate-label").textContent      = `Mandat — ${currentUser.role}`;
  document.getElementById("mandate-remaining").textContent  = `${remaining}j restants`;
  document.getElementById("mandate-bar").style.width        = pct + "%";
  document.getElementById("profile-mandate-pct").textContent = `${pct}%`;
  document.getElementById("profile-mandate-bar").style.width = pct + "%";
  document.getElementById("profile-mandate-days").textContent = `${remaining} jours restants sur ${total} jours`;
}

// =================== NAVIGATION ===================

function navigateTo(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(`page-${page}`)?.classList.add("active");
  document.querySelectorAll(".nav-item[data-page]").forEach(i => i.classList.toggle("active", i.dataset.page === page));
  const titres = { dashboard:"Tableau de bord", planning:"Planning & Calendrier", events:"Événements",
    news:"Actualités", sections:"Mes Sections", documents:"Médiathèque", members:"Annuaire", profile:"Mon Profil" };
  document.getElementById("page-title").textContent = titres[page] || page;
  window.scrollTo(0, 0);
}

// =================== ACTUALITÉS (temps réel) ===================

function listenToNews() {
  if (newsUnsub) newsUnsub();
  newsUnsub = db.collection("news").orderBy("createdAt", "desc").limit(20)
    .onSnapshot(snap => {
      const news = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderNewsFeed(news);
      renderNewsPreview(news);
    }, err => console.error("News:", err));
}

function renderNewsFeed(news) {
  const c = document.getElementById("news-feed");
  if (!c) return;
  if (!news.length) {
    c.innerHTML = '<div style="text-align:center;padding:48px;color:var(--text-muted)">Aucune actualité.<br>Soyez le premier à publier !</div>';
    return;
  }
  c.innerHTML = news.map(item => {
    const reactions = item.reactions || {};
    const time = item.createdAt?.toDate ? tempsRelatif(item.createdAt.toDate()) : "";
    return `
    <div class="news-item ${item.pinned ? "pinned" : ""}">
      <div class="news-header">
        <div class="news-avatar" style="background:${item.authorColor||"#17a589"}">${item.authorInitials||"?"}</div>
        <div class="news-meta">
          <div class="author">${item.author||"Membre"}</div>
          <div class="time">${time}${item.pinned ? " · Épinglé" : ""}</div>
        </div>
        <span class="news-tag tag-${item.tag||"general"}">${item.tagLabel||"Général"}</span>
      </div>
      <div class="news-content"><h4>${item.title}</h4><p>${item.content}</p></div>
      <div class="news-reactions">
        ${["👏","💚","🎉"].map(emoji => `
          <button class="reaction-btn ${reactions[currentUser?.uid]?.emoji===emoji?"active":""}" onclick="toggleReaction('${item.id}','${emoji}',this)">
            ${emoji} <span class="react-count">${compterReaction(reactions,emoji)}</span>
          </button>`).join("")}
        <button class="reaction-btn" onclick="showToast('Répondre — bientôt disponible !','info')"><i data-lucide="message-circle" style="width:14px;height:14px"></i> Répondre</button>
        <button class="reaction-btn" onclick="showToast('Lien copié !','success')"><i data-lucide="share-2" style="width:14px;height:14px"></i> Partager</button>
      </div>
    </div>`;
  }).join("");
  if (window.lucide) lucide.createIcons();
}

function renderNewsPreview(news) {
  const c = document.getElementById("news-preview");
  if (!c) return;
  if (!news.length) { c.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:13px">Aucune actualité.</div>'; return; }
  c.innerHTML = news.slice(0,3).map(item => `
    <div style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);align-items:flex-start">
      <div style="width:36px;height:36px;border-radius:50%;background:${item.authorColor||"#17a589"};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:white;flex-shrink:0">${item.authorInitials||"?"}</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:2px">${item.title}</div>
        <div style="font-size:12px;color:var(--text-muted)">${item.author||"Membre"} · ${item.createdAt?.toDate?tempsRelatif(item.createdAt.toDate()):""}</div>
      </div>
      <span class="news-tag tag-${item.tag||"general"}">${item.tagLabel||"Général"}</span>
    </div>`).join("") +
    '<div style="padding-top:12px;text-align:center"><button class="btn btn-secondary btn-sm" onclick="navigateTo(\'news\')">Voir toutes les actualités →</button></div>';
}

function compterReaction(reactions, emoji) {
  return Object.values(reactions).filter(r => r.emoji === emoji).length;
}

async function toggleReaction(newsId, emoji, btn) {
  if (!currentUser) return;
  const ref = db.collection("news").doc(newsId);
  const snap = await ref.get();
  if (!snap.exists) return;
  const reactions = { ...snap.data().reactions || {} };
  if (reactions[currentUser.uid]?.emoji === emoji) delete reactions[currentUser.uid];
  else reactions[currentUser.uid] = { emoji };
  await ref.update({ reactions });
}

async function publierActualite() {
  const titre   = document.getElementById("news-title").value.trim();
  const contenu = document.getElementById("news-content-input").value.trim();
  const tag     = document.getElementById("news-tag-select")?.value || "general";
  if (!titre || !contenu) { showToast("Remplissez le titre et le contenu.", "warning"); return; }
  const tagLabels = { general:"Général", event:"Événement", urgent:"Urgent", finance:"Finance", info:"Info" };
  try {
    await db.collection("news").add({
      author: currentUser.name, authorInitials: currentUser.initials, authorColor: currentUser.color,
      title: titre, content: contenu, tag, tagLabel: tagLabels[tag]||"Général",
      pinned: false, reactions: {},
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    document.getElementById("news-title").value = "";
    document.getElementById("news-content-input").value = "";
    showToast("Actualité publiée avec succès !", "success");
    navigateTo("news");
  } catch (e) { showToast("Erreur lors de la publication.", "error"); }
}

// =================== ÉVÉNEMENTS ===================

async function chargerEvenements(filtre = "all") {
  try {
    const snap = await db.collection("events").orderBy("createdAt", "desc").get();
    allEvents = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch { allEvents = []; }
  renderEvents(filtre);
  renderCalendar();
}

function renderEvents(filtre = "all") {
  const c = document.getElementById("events-grid");
  if (!c) return;
  const liste = filtre === "all" ? allEvents :
    allEvents.filter(e => e.status===filtre || e.country===filtre || e.section===filtre);
  if (!liste.length) {
    c.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted)">
      <p>Aucun événement trouvé.</p></div>`;
    return;
  }
  c.innerHTML = liste.map(ev => {
    const pct = ev.maxParticipants ? Math.round(((ev.participants||0)/ev.maxParticipants)*100) : 0;
    return `
      <div class="event-card">
        <div class="event-banner" style="background:${ev.colorLight||"#f0f4f8"}">
          <div class="event-banner-icon" style="color:${ev.color||"#17a589"}"><i data-lucide="${ev.icon||"calendar"}"></i></div>
          <span class="event-status-badge badge-${ev.status||"upcoming"}">${ev.status==="ongoing"?"En cours":ev.status==="upcoming"?"À venir":"Terminé"}</span>
        </div>
        <div class="event-body">
          <h4>${ev.title}</h4>
          <div class="event-meta">
            <span class="meta-tag"><i data-lucide="calendar" style="width:12px;height:12px"></i> ${ev.date||""}</span>
            <span class="meta-tag"><i data-lucide="map-pin" style="width:12px;height:12px"></i> ${ev.location||""}</span>
            <span class="meta-tag"><i data-lucide="tag" style="width:12px;height:12px"></i> ${ev.section||""}</span>
          </div>
          <p style="font-size:13px;color:var(--text-light);line-height:1.6;margin-bottom:12px">${(ev.description||"").substring(0,100)}…</p>
          <div class="event-progress">
            <div class="ep-label">
              <span><i data-lucide="users" style="width:12px;height:12px"></i> ${ev.participants||0}/${ev.maxParticipants||"–"}</span>
              <span>${pct}%</span>
            </div>
            <div class="progress-bar-outer"><div class="progress-bar-inner" style="width:${pct}%;background:${ev.color||"#17a589"}"></div></div>
          </div>
          <div style="margin-top:12px;display:flex;gap:8px">
            <button class="btn btn-sm" style="background:${ev.color||"#17a589"};color:white;flex:1" onclick="sInscrire('${ev.id}',this)">S'inscrire</button>
            <button class="btn btn-sm btn-secondary" onclick="showToast('Détails envoyés par email.','info')">Détails</button>
          </div>
        </div>
      </div>`;
  }).join("");
  if (window.lucide) lucide.createIcons();
}

async function sInscrire(eventId, btn) {
  btn.disabled = true; btn.textContent = "…";
  try {
    await db.runTransaction(async t => {
      const ref  = db.collection("events").doc(eventId);
      const snap = await t.get(ref);
      if (!snap.exists) throw new Error("Introuvable");
      const cur = snap.data().participants || 0;
      const max = snap.data().maxParticipants || 9999;
      if (cur >= max) throw new Error("Complet");
      t.update(ref, { participants: cur + 1 });
    });
    showToast("Inscription confirmée ! 🎉", "success");
    await chargerEvenements();
  } catch (e) {
    showToast(e.message === "Complet" ? "Cet événement est complet." : "Erreur lors de l'inscription.", "error");
    btn.disabled = false; btn.textContent = "S'inscrire";
  }
}

// =================== CALENDRIER ===================

function renderCalendar() {
  const y = calendarDate.getFullYear();
  const m = calendarDate.getMonth();
  const noms = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const el = document.getElementById("cal-month-label");
  if (el) el.textContent = `${noms[m]} ${y}`;
  const firstDay   = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m+1, 0).getDate();
  const daysInPrev  = new Date(y, m, 0).getDate();
  const offset      = firstDay === 0 ? 6 : firstDay - 1;
  const todayStr    = new Date().toISOString().split("T")[0];
  const calEvts     = {};
  allEvents.forEach(ev => {
    if (ev.dateISO) {
      if (!calEvts[ev.dateISO]) calEvts[ev.dateISO] = [];
      calEvts[ev.dateISO].push({ label: (ev.title||"").substring(0,14), color: ev.color||"#17a589" });
    }
  });
  const grid = document.getElementById("cal-grid");
  if (!grid) return;
  grid.innerHTML = "";
  for (let i = offset-1; i >= 0; i--) grid.innerHTML += `<div class="cal-day other-month"><div class="day-num">${daysInPrev-i}</div></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const evts = calEvts[ds] || [];
    grid.innerHTML += `<div class="cal-day ${ds===todayStr?"today":""}"><div class="day-num">${d}</div>${evts.map(ev=>`<div class="cal-event-dot" style="background:${ev.color}">${ev.label}</div>`).join("")}</div>`;
  }
  const total = Math.ceil((offset+daysInMonth)/7)*7;
  for (let d=1; d<=total-offset-daysInMonth; d++) grid.innerHTML += `<div class="cal-day other-month"><div class="day-num">${d}</div></div>`;
}

// =================== SECTIONS ===================

function renderSections() {
  const c = document.getElementById("sections-grid");
  if (!c) return;
  c.innerHTML = SECTIONS_DATA.map(sec => `
    <div class="section-card">
      <div class="sc-header">
        <div class="sc-icon" style="background:${sec.bgColor};color:${sec.color}"><i data-lucide="${sec.icon}"></i></div>
        <div>
          <div class="sc-name">${sec.name}</div>
          <div class="sc-country"><i data-lucide="map-pin" style="width:12px;height:12px"></i> BF / CI / Niger</div>
        </div>
        <span class="pill pill-green" style="margin-left:auto">${sec.status}</span>
      </div>
      <div class="sc-stats">
        <div class="sc-stat"><div class="val">${sec.tasks}</div><div class="lbl">Tâches</div></div>
        <div class="sc-stat"><div class="val">Actif</div><div class="lbl">Statut</div></div>
      </div>
      <div class="sc-rs">
        <div style="width:16px;height:16px;color:${sec.color}"><i data-lucide="${sec.icon}"></i></div>
        <span>RS : ${sec.rs}</span>
        <button class="btn btn-xs btn-secondary" style="margin-left:auto" onclick="showToast('Messagerie bientôt disponible !','info')"><i data-lucide="message-circle" style="width:13px;height:13px"></i> Écrire</button>
      </div>
    </div>`).join("");
  if (window.lucide) lucide.createIcons();
}

// =================== DOCUMENTS ===================

async function chargerDocuments() {
  try {
    const snap = await db.collection("documents").orderBy("createdAt","desc").get();
    allDocs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch { allDocs = []; }
  renderDocuments(allDocs);
}

function renderDocuments(liste) {
  const c = document.getElementById("docs-list");
  if (!c) return;
  if (!liste.length) {
    c.innerHTML = '<div style="text-align:center;padding:48px;color:var(--text-muted)">Aucun document.<br>Déposez votre premier fichier !</div>';
    return;
  }
  c.innerHTML = liste.map(doc => `
    <div class="doc-item" onclick="telecharger('${doc.downloadURL||""}','${doc.name}')">
      <div class="doc-icon" style="background:rgba(${hexToRgb(doc.color||"#17a589")},0.12);color:${doc.color||"#17a589"}"><i data-lucide="${doc.icon||"file-text"}"></i></div>
      <div class="doc-info">
        <div class="doc-name">${doc.name}</div>
        <div class="doc-meta">${doc.section||"–"} • ${doc.size||"–"} • ${doc.date||""}</div>
      </div>
      <span class="doc-action"><i data-lucide="download"></i></span>
    </div>`).join("");
  if (window.lucide) lucide.createIcons();
}

function filterDocs(q) {
  renderDocuments(allDocs.filter(d => d.name.toLowerCase().includes(q.toLowerCase())));
}

async function handleUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const btn = document.getElementById("upload-btn");
  btn.disabled = true; btn.innerHTML = "Upload…";
  try {
    const ref  = storage.ref(`documents/${currentUser.uid}/${Date.now()}_${file.name}`);
    const snap = await ref.put(file);
    const url  = await snap.ref.getDownloadURL();
    const types = {
      "application/pdf": { icon:"file-text", color:"#e74c3c" },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { icon:"bar-chart-2", color:"#27ae60" },
      "application/vnd.ms-excel": { icon:"bar-chart-2", color:"#27ae60" },
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": { icon:"clipboard-list", color:"#2980b9" },
      "application/zip": { icon:"package", color:"#e8a020" },
      "image/png":  { icon:"image", color:"#8e44ad" },
      "image/jpeg": { icon:"image", color:"#8e44ad" },
    };
    const meta  = types[file.type] || { icon:"file", color:"#7f8c8d" };
    const taille = file.size < 1048576 ? `${(file.size/1024).toFixed(0)} KB` : `${(file.size/1048576).toFixed(1)} MB`;
    const j = new Date();
    const mois = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Aoû","Sep","Oct","Nov","Déc"];
    await db.collection("documents").add({
      name: file.name, type: file.type, section: currentUser.section||"–",
      size: taille, date: `${j.getDate()} ${mois[j.getMonth()]} ${j.getFullYear()}`,
      icon: meta.icon, color: meta.color, downloadURL: url,
      uploadedBy: currentUser.uid, uploaderName: currentUser.name,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    showToast(`"${file.name}" uploadé avec succès !`, "success");
    await chargerDocuments();
  } catch (err) {
    showToast("Erreur lors de l'upload.", "error");
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i data-lucide="upload"></i> Déposer un fichier';
    if (window.lucide) lucide.createIcons();
    e.target.value = "";
  }
}

function telecharger(url, nom) {
  if (!url) { showToast("Lien indisponible.", "error"); return; }
  const a = document.createElement("a");
  a.href = url; a.download = nom; a.target = "_blank"; a.click();
  showToast(`Téléchargement de "${nom}" démarré.`, "info");
}

// =================== MEMBRES ===================

async function chargerMembres() {
  try {
    const snap = await db.collection("users").limit(30).get();
    renderMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch { renderMembers([]); }
}

function renderMembers(liste) {
  const c = document.getElementById("members-grid");
  if (!c) return;
  if (!liste.length) {
    c.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted)">Aucun membre inscrit pour le moment.</div>';
    return;
  }
  c.innerHTML = liste.map(u => {
    const elapsed   = Math.max(0, Math.floor((new Date()-new Date(u.mandateStart||new Date()))/86400000));
    const remaining = Math.max(0, (u.mandateDays||90)-elapsed);
    return `
      <div class="member-card">
        <div class="member-avatar" style="background:${u.color||"#17a589"}">${u.initials||"?"}</div>
        <div class="member-name">${u.name||"Membre"}</div>
        <div class="member-role">${u.role||"Bénévole"}</div>
        <div class="member-country"><i data-lucide="map-pin" style="width:12px;height:12px"></i> ${u.country||"–"} • ${u.section||"–"}</div>
        <span class="member-mandate">${remaining>0
          ? `<i data-lucide="clock" style="width:12px;height:12px"></i> ${remaining}j de mandat`
          : `<i data-lucide="check-circle" style="width:12px;height:12px"></i> Mandat expiré`}</span>
        <div style="margin-top:12px;display:flex;gap:6px;justify-content:center">
          <button class="btn btn-xs btn-secondary" onclick="showToast('Messagerie bientôt disponible !','info')"><i data-lucide="message-circle" style="width:13px;height:13px"></i></button>
          <button class="btn btn-xs btn-secondary" onclick="showToast('Profil ouvert.','info')"><i data-lucide="eye" style="width:13px;height:13px"></i></button>
        </div>
      </div>`;
  }).join("");
  if (window.lucide) lucide.createIcons();
}

async function envoyerInvitation() {
  const input = document.querySelector("#page-members input[type='email']");
  const email = input?.value?.trim();
  if (!email) { showToast("Entrez un email valide.", "warning"); return; }
  try {
    await auth.sendPasswordResetEmail(email);
    showToast(`Email d'invitation envoyé à ${email} !`, "success");
    if (input) input.value = "";
  } catch (e) {
    showToast("Compte introuvable. Créez-le d'abord dans Firebase Console.", "warning");
  }
}

// =================== NOTIFICATIONS ===================

async function chargerNotifications() {
  try {
    const snap = await db.collection("notifications").orderBy("createdAt","desc").limit(10).get();
    renderNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch { renderNotifications([]); }
}

function renderNotifications(liste) {
  const c = document.getElementById("notif-list");
  if (!c) return;
  if (!liste.length) {
    c.innerHTML = '<div style="text-align:center;padding:32px;color:var(--text-muted);font-size:13px">Aucune notification.</div>';
    document.getElementById("notif-badge").style.display = "none";
    return;
  }
  c.innerHTML = liste.map(n => `
    <div class="notif-item ${n.unread?"unread":""}" onclick="marquerLu('${n.id}')">
      <div class="notif-icon" style="background:${n.bg||"rgba(23,165,137,0.1)"}"><i data-lucide="${n.icon||"bell"}"></i></div>
      <div class="notif-text">
        <div class="title">${n.title}</div>
        <div class="body">${n.body}</div>
        <div class="time">${n.createdAt?.toDate?tempsRelatif(n.createdAt.toDate()):n.time||""}</div>
      </div>
      ${n.unread?'<span style="width:8px;height:8px;background:var(--secondary);border-radius:50%;flex-shrink:0"></span>':""}
    </div>`).join("");
  if (window.lucide) lucide.createIcons();
  const unread = liste.filter(n => n.unread).length;
  const badge  = document.getElementById("notif-badge");
  badge.textContent = unread;
  badge.style.display = unread > 0 ? "flex" : "none";
}

async function marquerLu(id) {
  await db.collection("notifications").doc(id).update({ unread: false }).catch(()=>{});
  chargerNotifications();
}

async function markAllRead() {
  const snap = await db.collection("notifications").where("unread","==",true).get().catch(()=>null);
  if (!snap) return;
  const batch = db.batch();
  snap.docs.forEach(d => batch.update(d.ref, { unread: false }));
  await batch.commit().catch(()=>{});
  chargerNotifications();
  showToast("Toutes les notifications marquées comme lues.", "success");
}

// =================== PAYS ===================

function renderCountries() {
  const c = document.getElementById("country-grid");
  if (!c) return;
  c.innerHTML = COUNTRIES.map(p => `
    <div class="country-chip ${p.status}" onclick="showToast('${p.name} — ${p.label}','info')">
      <span class="flag">${p.flag}</span><span class="cname">${p.name}</span><span class="cstatus">${p.label}</span>
    </div>`).join("");
}

// =================== SONDAGE ===================

function votePoll(el) {
  if (document.querySelector(".poll-option.voted")) return;
  document.querySelectorAll(".poll-option").forEach(o => o.classList.remove("voted"));
  el.classList.add("voted");
  const results = [42, 35, 23];
  document.querySelectorAll(".poll-option").forEach((o,i) => {
    o.querySelector(".poll-pct").textContent = results[i] + "%";
    o.style.setProperty("--poll-w", results[i] + "%");
  });
  showToast("Vote enregistré ! Merci.", "success");
}

// =================== COMPTEURS ===================

async function animateCounters() {
  try {
    const [evSnap, usSnap, statsSnap] = await Promise.all([
      db.collection("events").get(),
      db.collection("users").get(),
      db.collection("stats").doc("impact").get(),
    ]);
    const s = statsSnap.exists ? statsSnap.data() : {};
    const targets = {
      "count-enfants":    s.enfants    || 0,
      "count-benevoles":  usSnap.size,
      "count-evenements": evSnap.size,
      "count-kits":       s.kits       || 0,
    };
    const statEvents  = document.getElementById("stat-events");
    const statMembers = document.getElementById("stat-members");
    if (statEvents)  statEvents.textContent  = evSnap.size;
    if (statMembers) statMembers.textContent = usSnap.size;

    Object.entries(targets).forEach(([id, target]) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (target === 0) { el.textContent = "0"; return; }
      let cur = 0;
      const step = target / 60;
      const iv = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = Math.round(cur).toLocaleString("fr-FR");
        if (cur >= target) clearInterval(iv);
      }, 20);
    });
  } catch {
    ["count-enfants","count-benevoles","count-evenements","count-kits"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = "0";
    });
  }
}

// =================== THÈME ===================

function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  localStorage.setItem("evc_theme", isDarkMode ? "dark" : "light");
  const btn = document.getElementById("theme-toggle");
  btn.innerHTML = isDarkMode ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
  if (window.lucide) lucide.createIcons();
  showToast(isDarkMode ? "Mode sombre activé" : "Mode clair activé", "info");
}

// =================== SIDEBAR ===================

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
  document.getElementById("sidebar-overlay").classList.toggle("visible");
}
function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebar-overlay").classList.remove("visible");
}

// =================== NOTIFICATIONS PANEL ===================

function toggleNotifPanel() { notifOpen = !notifOpen; setNotifPanel(notifOpen); }
function setNotifPanel(open) {
  notifOpen = open;
  document.getElementById("notif-panel").classList.toggle("open", open);
}

// =================== TOAST ===================

function showToast(message, type = "info") {
  const dotColors = { success:"#27ae60", info:"#17a589", warning:"#e8a020", error:"#e74c3c" };
  const c = document.getElementById("toast-container");
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon" style="color:${dotColors[type]};font-size:8px">●</span><span>${message}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.style.animation = "toastIn 0.4s reverse"; setTimeout(() => t.remove(), 400); }, 3500);
}

// =================== UTILITAIRES ===================

function hexToRgb(hex) {
  if (!hex?.startsWith("#")) return "23,165,137";
  return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`;
}

function tempsRelatif(date) {
  const diff = Math.floor((new Date()-date)/1000);
  if (diff < 60)     return "À l'instant";
  if (diff < 3600)   return `Il y a ${Math.floor(diff/60)} min`;
  if (diff < 86400)  return `Il y a ${Math.floor(diff/3600)}h`;
  if (diff < 172800) return "Hier";
  if (diff < 604800) return `Il y a ${Math.floor(diff/86400)} jours`;
  return date.toLocaleDateString("fr-FR");
}
