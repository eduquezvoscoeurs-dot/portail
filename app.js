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
  { id:1, key:"communication", name:"Communication",     icon:"megaphone",     color:"#e8a020", bgColor:"rgba(232,160,32,0.12)",  rs:"À confirmer", tasks:0, status:"Actif",
    baseline:"Faire rayonner l'association partout dans le monde.",
    departements:[
      { icon:"📱", nom:"Réseaux Sociaux", chef:"Chef Réseaux Sociaux", effectif:"2 à 3 membres", mission:"Gérer, animer et faire grandir tous les comptes officiels de l'association sur les plateformes digitales." },
      { icon:"🌟", nom:"Influenceurs & Ambassadeurs", chef:"Chef Influence", effectif:"1 à 2 membres", mission:"Recruter, briefer et coordonner les influenceurs membres pour maximiser la visibilité de l'association." },
      { icon:"📰", nom:"Presse & Partenariats Externes", chef:"Chef Relations Externes", effectif:"1 à 2 membres", mission:"Construire la notoriété de l'association auprès des médias, institutions et partenaires." },
      { icon:"📩", nom:"Communication Interne", chef:"Chef Com Interne", effectif:"1 à 2 membres", mission:"Assurer la fluidité de l'information entre toutes les sections et tous les membres de l'association." },
    ],
    synergies:[ ["Événementiel","Promotion de tous les événements — affiches, stories, couverture live"], ["Bénévolat","Diffusion des appels à candidatures bénévoles"], ["Don","Campagnes de collecte et témoignages de bénéficiaires"], ["Formation","Promotion des sessions de formation ouvertes"], ["Direction","Relais de toutes les communications officielles"] ] },

  { id:2, key:"santeMentale", name:"Santé Mentale",     icon:"brain",         color:"#8e44ad", bgColor:"rgba(142,68,173,0.12)",  rs:"À confirmer", tasks:0, status:"Actif",
    baseline:"Prendre soin des cœurs autant que des esprits.",
    departements:[
      { icon:"👂", nom:"Écoute & Soutien", chef:"Chef Écoute", effectif:"2 à 4 membres", mission:"Offrir un espace d'écoute sécurisé et bienveillant aux bénéficiaires et aux membres de l'association." },
      { icon:"🧘", nom:"Ateliers & Bien-être", chef:"Chef Ateliers", effectif:"2 à 3 membres", mission:"Concevoir et animer des ateliers pratiques pour développer la résilience et le bien-être des jeunes et bénéficiaires." },
      { icon:"🤲", nom:"Bien-être des Membres", chef:"Chef Bien-être Interne", effectif:"1 à 2 membres", mission:"Veiller à la santé mentale et à l'équilibre des bénévoles et formateurs pour prévenir l'épuisement." },
      { icon:"🤝", nom:"Partenariats Santé", chef:"Chef Partenariats Santé", effectif:"1 membre", mission:"Établir et entretenir des partenariats avec des professionnels de santé mentale pour renforcer les capacités de la section." },
    ],
    synergies:[ ["Bénévolat","Suivi du bien-être des bénévoles — signalement des situations à risque"], ["Formation","Co-animation de formations bien-être pour les membres"], ["Événementiel","Ateliers bien-être intégrés aux événements de l'association"], ["Communication","Sensibilisation du public à la santé mentale sur les réseaux"] ] },

  { id:3, key:"don", name:"Don & Distribution",icon:"gift",          color:"#2980b9", bgColor:"rgba(41,128,185,0.12)",  rs:"À confirmer", tasks:0, status:"Actif",
    baseline:"Chaque don reçu doit trouver les mains qui en ont besoin.",
    departements:[
      { icon:"🎁", nom:"Collecte des Dons", chef:"Chef Collecte", effectif:"2 à 3 membres", mission:"Organiser et maximiser la collecte de dons matériels et financiers via tous les canaux disponibles." },
      { icon:"📋", nom:"Inventaire & Stocks", chef:"Chef Stocks", effectif:"1 à 2 membres", mission:"Gérer rigoureusement les stocks de dons matériels pour garantir traçabilité et disponibilité." },
      { icon:"🚚", nom:"Logistique & Distribution", chef:"Chef Distribution", effectif:"2 à 4 membres", mission:"Planifier et exécuter la distribution équitable des dons aux bénéficiaires identifiés." },
      { icon:"📊", nom:"Transparence & Reporting", chef:"Chef Reporting Don", effectif:"1 membre", mission:"Garantir la totale transparence des flux de dons pour maintenir la confiance des donateurs." },
    ],
    synergies:[ ["Finance","Transmission mensuelle du registre dons pour la comptabilité"], ["Communication","Campagnes de collecte et publication des reportages de distribution"], ["Bénévolat","Mobilisation des bénévoles pour les distributions terrain"], ["Événementiel","Collectes de dons lors des événements de l'association"] ] },

  { id:4, key:"benevolat", name:"Bénévolat",         icon:"handshake",     color:"#e74c3c", bgColor:"rgba(231,76,60,0.12)",   rs:"À confirmer", tasks:0, status:"Actif",
    baseline:"Les bénévoles sont le moteur — on en prend soin.",
    departements:[
      { icon:"🔍", nom:"Recrutement", chef:"Chef Recrutement", effectif:"1 à 2 membres", mission:"Identifier, attirer et sélectionner les bénévoles qui correspondent aux valeurs et besoins de l'association." },
      { icon:"🎓", nom:"Intégration & Formation", chef:"Chef Onboarding", effectif:"1 à 2 membres", mission:"Accueillir chaque nouveau bénévole et lui donner toutes les clés pour réussir sa mission dès le premier jour." },
      { icon:"📅", nom:"Suivi & Animation", chef:"Chef Animation Bénévoles", effectif:"1 à 2 membres", mission:"Maintenir l'engagement, la motivation et la cohésion de tous les bénévoles tout au long de leur mandat." },
      { icon:"📝", nom:"Administration Bénévole", chef:"Chef Admin Bénévole", effectif:"1 membre", mission:"Gérer la dimension administrative et documentaire du cycle de vie des bénévoles." },
    ],
    synergies:[ ["Toutes les sections","Fourniture de bénévoles selon les besoins exprimés"], ["Formation","Formation des nouveaux bénévoles en coordination avec RS Formation"], ["Santé Mentale","Suivi du bien-être — signalement des bénévoles en difficulté"], ["Communication","Promotion des appels à bénévoles sur les réseaux"] ] },

  { id:5, key:"evenementiel", name:"Événementiel",      icon:"calendar-check",color:"#16a085", bgColor:"rgba(22,160,133,0.12)",  rs:"À confirmer", tasks:0, status:"Actif",
    baseline:"Chaque événement est une opportunité de changer des vies.",
    departements:[
      { icon:"🗓️", nom:"Planification & Programmation", chef:"Chef Planning", effectif:"1 à 2 membres", mission:"Définir la stratégie événementielle annuelle et planifier chaque événement dans les moindres détails." },
      { icon:"🔧", nom:"Logistique Événementielle", chef:"Chef Logistique Événement", effectif:"2 à 3 membres", mission:"Assurer la parfaite organisation matérielle et logistique de chaque événement." },
      { icon:"📸", nom:"Promotion & Médias Événement", chef:"Chef Médias Événement", effectif:"1 à 2 membres", mission:"Assurer la visibilité maximale de chaque événement avant, pendant et après." },
      { icon:"📊", nom:"Bilan & Amélioration Continue", chef:"Chef Bilan Événement", effectif:"1 membre", mission:"Évaluer l'impact de chaque événement et capitaliser pour améliorer continuellement les prochaines éditions." },
    ],
    synergies:[ ["Communication","Promotion de tous les événements avant/pendant/après"], ["Finance","Validation du budget et bilan financier post-événement"], ["Bénévolat","Mobilisation des bénévoles pour chaque événement"], ["Don","Collectes de dons organisées lors des événements"], ["Santé Mentale","Ateliers bien-être intégrés aux événements"] ] },

  { id:6, key:"finance", name:"Finance",           icon:"landmark",      color:"#27ae60", bgColor:"rgba(39,174,96,0.12)",   rs:"À confirmer", tasks:0, status:"Actif",
    baseline:"La transparence financière, c'est la confiance gagnée.",
    departements:[
      { icon:"📒", nom:"Comptabilité", chef:"Chef Comptabilité", effectif:"1 à 2 membres", mission:"Tenir rigoureusement la comptabilité de l'association et assurer la traçabilité de chaque opération financière." },
      { icon:"📈", nom:"Budget & Contrôle", chef:"Chef Budget", effectif:"1 membre", mission:"Piloter le budget de l'association, contrôler les dépenses et alerter en cas d'écart." },
      { icon:"📋", nom:"Reporting & Audit", chef:"Chef Reporting Finance", effectif:"1 membre", mission:"Garantir la transparence financière totale de l'association à travers des rapports clairs et vérifiables." },
      { icon:"💳", nom:"Mobilisation des Ressources", chef:"Chef Financement", effectif:"1 à 2 membres", mission:"Identifier et sécuriser des financements externes pour garantir la viabilité et le développement de l'association." },
    ],
    synergies:[ ["Toutes les sections","Allocation budgétaire et contrôle des dépenses"], ["Don","Réception et comptabilisation du registre des dons"], ["Événementiel","Validation des budgets et bilan financier des événements"], ["Direction","Reporting financier pour les décisions stratégiques"] ] },

  { id:7, key:"formation", name:"Formation",         icon:"graduation-cap",color:"#1e3d59", bgColor:"rgba(30,61,89,0.12)",    rs:"À confirmer", tasks:0, status:"Actif",
    baseline:"Former aujourd'hui pour impacter demain.",
    departements:[
      { icon:"🎨", nom:"Ingénierie Pédagogique", chef:"Chef Pédagogie", effectif:"1 à 2 membres", mission:"Concevoir des programmes de formation adaptés, pertinents et progressifs pour toutes les cibles de l'association." },
      { icon:"👨‍🏫", nom:"Gestion des Formateurs", chef:"Chef Formateurs", effectif:"1 à 2 membres", mission:"Recruter, former, accompagner et évaluer les formateurs de l'association (mandat 6 mois)." },
      { icon:"📅", nom:"Animation & Planification", chef:"Chef Animation Formation", effectif:"1 à 2 membres", mission:"Planifier, coordonner et assurer le bon déroulement de toutes les sessions de formation." },
      { icon:"🏆", nom:"Certification & Impact", chef:"Chef Certification", effectif:"1 membre", mission:"Évaluer l'impact des formations et valoriser officiellement les acquis des participants." },
    ],
    synergies:[ ["Bénévolat","Formation d'intégration des nouveaux bénévoles"], ["Santé Mentale","Co-animation des formations bien-être et résilience"], ["Communication","Formation des membres aux outils digitaux et communication"], ["Toutes les sections","Réponse aux besoins de montée en compétences exprimés"] ] },
];

const MANDATE_TYPES = {
  "Bénévole":                       90,   // 3 mois renouvelables
  "Formateur":                      180,  // 6 mois renouvelables
  "Responsable de Section":         180,
  "Délégué(e) National(e)":         365,
  "Présidence / Administration":    36500,
};

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
let videosUnsub   = null;
let allEvents     = [];
let allDocs       = [];
let allVideos     = [];
let allNews       = [];

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

// Le compte ci-dessus (ADMIN_EMAIL) a toujours les droits d'administration.
// Un second accès spécial (ex. la présidente) peut être accordé depuis
// l'Annuaire — voir toggleAdmin() — sans toucher au code.
async function chargerProfil(firebaseUser) {
  const isSuperAdmin = firebaseUser.email === ADMIN_EMAIL;
  try {
    const doc = await db.collection("users").doc(firebaseUser.uid).get();
    if (doc.exists) {
      const data = doc.data();
      currentUser = {
        uid: firebaseUser.uid, email: firebaseUser.email, ...data,
        isSuperAdmin, isAdmin: isSuperAdmin || data.isAdmin === true,
      };
    } else {
      const profil = {
        name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
        email: firebaseUser.email,
        initials: firebaseUser.email.substring(0, 2).toUpperCase(),
        role: isSuperAdmin ? "Présidence / Administration" : "Bénévole",
        section: "–", country: "–",
        mandateType: isSuperAdmin ? "Permanent" : "Bénévole",
        mandateStart: new Date().toISOString().split("T")[0],
        mandateDays: isSuperAdmin ? 36500 : 90, color: isSuperAdmin ? "#1e3d59" : "#17a589",
        isAdmin: isSuperAdmin,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      await db.collection("users").doc(firebaseUser.uid).set(profil);
      currentUser = { uid: firebaseUser.uid, email: firebaseUser.email, ...profil, isSuperAdmin, isAdmin: isSuperAdmin };
    }
  } catch (e) {
    currentUser = {
      uid: firebaseUser.uid, email: firebaseUser.email, isSuperAdmin, isAdmin: isSuperAdmin,
      name: firebaseUser.email, initials: "??",
      role: isSuperAdmin ? "Présidence / Administration" : "Membre",
      section: "–", country: "–",
      mandateStart: new Date().toISOString().split("T")[0],
      mandateDays: 90, color: "#17a589",
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
  document.getElementById("video-submit")?.addEventListener("click", publierVideo);
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

let selectedMandateType = "Bénévole";
function selectMandateType(el) {
  document.querySelectorAll(".radio-pill-group .radio-pill").forEach(p => p.classList.remove("selected"));
  el.classList.add("selected");
  selectedMandateType = el.dataset.mandate;
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
      name, email, initials, color,
      role: selectedMandateType, section: "–", country: "–",
      mandateType: selectedMandateType,
      mandateStart: new Date().toISOString().split("T")[0],
      mandateDays: MANDATE_TYPES[selectedMandateType] || 90,
      isAdmin: false,
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
  if (videosUnsub) videosUnsub();
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
  listenToVideos();
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
    news:"Actualités", videos:"Vidéos", sections:"Mes Sections", about:"À propos & Organisation",
    documents:"Médiathèque", members:"Annuaire", profile:"Mon Profil" };
  document.getElementById("page-title").textContent = titres[page] || page;
  if (page === "videos") marquerVideosVues();
  window.scrollTo(0, 0);
}

// =================== ACTUALITÉS (temps réel) ===================

function listenToNews() {
  if (newsUnsub) newsUnsub();
  newsUnsub = db.collection("news").orderBy("createdAt", "desc").limit(20)
    .onSnapshot(snap => {
      allNews = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderNewsFeed(allNews);
      renderNewsPreview(allNews);
      renderTicker();
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

// =================== TICKER (bandeau LIVE) ===================

function renderTicker() {
  const el = document.getElementById("ticker-scroll");
  if (!el) return;
  const items = [
    ...allVideos.slice(0, 5).map(v => `🎬 Nouvelle vidéo : « ${v.title} »`),
    ...allNews.slice(0, 5).map(n => `📢 ${n.title}`),
  ];
  el.textContent = items.length
    ? items.join("   •   ")
    : "Les actualités de l'association apparaîtront ici";
}

// =================== VIDÉOS ===================

function extractYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

function listenToVideos() {
  if (videosUnsub) videosUnsub();
  videosUnsub = db.collection("videos").orderBy("createdAt", "desc").limit(30)
    .onSnapshot(snap => {
      allVideos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderVideosGrid(allVideos);
      renderVideosPreview(allVideos);
      updateVideosBadge(allVideos);
      renderTicker();
    }, err => console.error("Vidéos:", err));
}

function updateVideosBadge(videos) {
  const badge = document.getElementById("nav-badge-videos");
  if (!badge) return;
  const seen = JSON.parse(localStorage.getItem("evc_videos_seen") || "[]");
  const nouvelles = videos.filter(v => !seen.includes(v.id)).length;
  badge.textContent = nouvelles;
  badge.style.display = nouvelles > 0 ? "flex" : "none";
}

function marquerVideosVues() {
  localStorage.setItem("evc_videos_seen", JSON.stringify(allVideos.map(v => v.id)));
  const badge = document.getElementById("nav-badge-videos");
  if (badge) badge.style.display = "none";
}

function videoCardHTML(v, context) {
  const yid = extractYouTubeId(v.url);
  const thumb = yid ? `https://img.youtube.com/vi/${yid}/hqdefault.jpg` : "";
  const time = v.createdAt?.toDate ? tempsRelatif(v.createdAt.toDate()) : "";
  const isNew = v.createdAt?.toDate ? (Date.now() - v.createdAt.toDate().getTime()) < 7 * 86400000 : false;
  const domId = `video-thumb-${context}-${v.id}`;
  const onclick = context === "preview" ? `navigateTo('videos')` : `lireVideo('${context}','${v.id}')`;
  return `
    <div class="video-card">
      <div class="video-thumb" id="${domId}" onclick="${onclick}">
        ${isNew ? '<span class="video-new-badge">Nouveau</span>' : ""}
        ${thumb ? `<img src="${thumb}" alt="${v.title||""}" loading="lazy">` : ""}
        <div class="video-play-btn"><span><i data-lucide="play"></i></span></div>
      </div>
      <div class="video-body">
        <div class="video-title">${v.title || "Vidéo"}</div>
        ${v.description ? `<div class="video-desc">${v.description}</div>` : ""}
        <div class="video-meta">
          <span>${v.author || "Éduquer Vos Cœurs"}</span>
          <span>${time}</span>
        </div>
      </div>
    </div>`;
}

function renderVideosGrid(videos) {
  const c = document.getElementById("videos-grid");
  if (!c) return;
  if (!videos.length) {
    c.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted)">
      <i data-lucide="video" style="width:36px;height:36px;opacity:0.3;margin-bottom:10px;display:block;margin-inline:auto"></i>
      Aucune vidéo pour le moment.<br>Les vidéos publiées sur nos pages apparaîtront ici.</div>`;
    if (window.lucide) lucide.createIcons();
    return;
  }
  c.innerHTML = videos.map(v => videoCardHTML(v, "grid")).join("");
  if (window.lucide) lucide.createIcons();
}

function renderVideosPreview(videos) {
  const c = document.getElementById("videos-preview");
  if (!c) return;
  if (!videos.length) {
    c.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:24px;color:var(--text-muted);font-size:13px">Aucune vidéo publiée pour le moment.</div>';
    return;
  }
  c.innerHTML = videos.slice(0, 3).map(v => videoCardHTML(v, "preview")).join("");
  if (window.lucide) lucide.createIcons();
}

function lireVideo(context, id) {
  const v = allVideos.find(x => x.id === id);
  const yid = v && extractYouTubeId(v.url);
  const domId = `video-thumb-${context}-${id}`;
  const wrap = document.getElementById(domId);
  if (!wrap) return;
  if (!yid) { showToast("Lien vidéo invalide.", "error"); return; }
  wrap.outerHTML = `<div class="video-embed-wrap" id="${domId}">
    <iframe src="https://www.youtube.com/embed/${yid}?autoplay=1" title="${v.title||""}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </div>`;
}

async function publierVideo() {
  const titre = document.getElementById("video-title").value.trim();
  const url   = document.getElementById("video-url").value.trim();
  const desc  = document.getElementById("video-desc").value.trim();
  if (!titre || !url) { showToast("Entrez un titre et un lien YouTube.", "warning"); return; }
  if (!extractYouTubeId(url)) { showToast("Lien YouTube invalide.", "warning"); return; }
  try {
    await db.collection("videos").add({
      title: titre, url, description: desc,
      author: currentUser.name, authorInitials: currentUser.initials,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    await db.collection("notifications").add({
      title: "Nouvelle vidéo publiée 🎬", body: titre, icon: "video",
      bg: "rgba(231,76,60,0.12)", unread: true,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    document.getElementById("video-title").value = "";
    document.getElementById("video-url").value = "";
    document.getElementById("video-desc").value = "";
    showToast("Vidéo annoncée avec succès !", "success");
    navigateTo("videos");
  } catch (e) { showToast("Erreur lors de la publication.", "error"); console.error(e); }
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
    <div class="section-card" onclick="ouvrirSectionDetail(${sec.id})">
      <div class="sc-header">
        <div class="sc-icon sc-logo-wrap" style="background:${sec.bgColor}">${sectionLogoSVG(sec.key, sec.color, 40)}</div>
        <div>
          <div class="sc-name">${sec.name}</div>
          <div class="sc-country"><i data-lucide="map-pin" style="width:12px;height:12px"></i> BF / CI / Niger</div>
        </div>
        <span class="pill pill-green" style="margin-left:auto">${sec.status}</span>
      </div>
      <p style="font-size:12px;color:var(--text-light);margin:2px 0 10px;font-style:italic">« ${sec.baseline} »</p>
      <div class="sc-stats">
        <div class="sc-stat"><div class="val">4</div><div class="lbl">Départements</div></div>
        <div class="sc-stat"><div class="val">Actif</div><div class="lbl">Statut</div></div>
      </div>
      <div class="sc-rs">
        <div style="width:16px;height:16px;color:${sec.color}"><i data-lucide="${sec.icon}"></i></div>
        <span>RS : ${sec.rs}</span>
        <button class="btn btn-xs btn-secondary" style="margin-left:auto" onclick="event.stopPropagation();showToast('Messagerie bientôt disponible !','info')"><i data-lucide="message-circle" style="width:13px;height:13px"></i> Écrire</button>
      </div>
    </div>`).join("");
  if (window.lucide) lucide.createIcons();
}

function ouvrirSectionDetail(id) {
  const sec = SECTIONS_DATA.find(s => s.id === id);
  if (!sec) return;
  const modal = document.getElementById("section-detail-modal");
  document.getElementById("sdm-logo").innerHTML = sectionLogoSVG(sec.key, sec.color, 64);
  document.getElementById("sdm-name").textContent = sec.name;
  document.getElementById("sdm-baseline").textContent = `« ${sec.baseline} »`;
  document.getElementById("sdm-departements").innerHTML = sec.departements.map(d => `
    <div class="sdm-dept">
      <span class="sdm-dept-icon">${d.icon}</span>
      <div>
        <div class="sdm-dept-name">${d.nom}</div>
        <div class="sdm-dept-meta">Responsable : ${d.chef} · Effectif recommandé : ${d.effectif}</div>
        <div class="sdm-dept-mission">${d.mission}</div>
      </div>
    </div>`).join("");
  document.getElementById("sdm-synergies").innerHTML = sec.synergies.map(([nom,desc]) => `
    <div class="sdm-syn"><strong>${nom}</strong><span>${desc}</span></div>`).join("");
  modal.classList.add("open");
  if (window.lucide) lucide.createIcons();
}
function fermerSectionDetail() {
  document.getElementById("section-detail-modal").classList.remove("open");
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

let allMembers = [];

async function chargerMembres() {
  try {
    const snap = await db.collection("users").limit(100).get();
    allMembers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderMembers(allMembers);
  } catch { allMembers = []; renderMembers([]); }
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
    const estAdmin  = u.isAdmin === true || u.email === ADMIN_EMAIL;
    return `
      <div class="member-card">
        ${estAdmin ? `<span class="admin-badge" style="position:absolute;top:10px;right:10px"><i data-lucide="shield-check"></i> Admin</span>` : ""}
        <div class="member-avatar" style="background:${u.color||"#17a589"}">${u.initials||"?"}</div>
        <div class="member-name">${u.name||"Membre"}</div>
        <div class="member-role">${u.role||"Bénévole"}</div>
        <div class="member-country"><i data-lucide="map-pin" style="width:12px;height:12px"></i> ${u.country||"–"} • ${u.section||"–"}</div>
        <span class="member-mandate">${remaining>0
          ? `<i data-lucide="clock" style="width:12px;height:12px"></i> ${remaining}j de mandat`
          : `<i data-lucide="check-circle" style="width:12px;height:12px"></i> Mandat expiré`}</span>
        <div style="margin-top:12px;display:flex;gap:6px;justify-content:center">
          <button class="btn btn-xs btn-secondary" onclick="showToast('Messagerie bientôt disponible !','info')"><i data-lucide="message-circle" style="width:13px;height:13px"></i></button>
          <button class="btn btn-xs btn-secondary admin-only" onclick="ouvrirEditionMembre('${u.id}')"><i data-lucide="pencil" style="width:13px;height:13px"></i> Gérer</button>
        </div>
      </div>`;
  }).join("");
  if (window.lucide) lucide.createIcons();
  applyAdminUI();
}

let editingMemberId = null;

function ouvrirEditionMembre(uid) {
  if (!currentUser?.isAdmin) return;
  const u = allMembers.find(m => m.id === uid);
  if (!u) return;
  editingMemberId = uid;

  document.getElementById("mem-edit-avatar").textContent = u.initials || "?";
  document.getElementById("mem-edit-avatar").style.background = u.color || "#17a589";
  document.getElementById("mem-edit-name").textContent = u.name || "Membre";
  document.getElementById("mem-edit-email").textContent = u.email || "–";

  const mandateSel = document.getElementById("mem-edit-mandatetype");
  mandateSel.innerHTML = Object.keys(MANDATE_TYPES).map(t =>
    `<option value="${t}" ${u.mandateType===t || (!u.mandateType && u.role===t) ? "selected" : ""}>${t}</option>`).join("");

  const sectionSel = document.getElementById("mem-edit-section");
  sectionSel.innerHTML = `<option value="–">–</option>` + SECTIONS_DATA.map(s =>
    `<option value="${s.name}" ${u.section===s.name?"selected":""}>${s.name}</option>`).join("");

  const countrySel = document.getElementById("mem-edit-country");
  countrySel.innerHTML = COUNTRIES.map(p =>
    `<option value="${p.name}" ${u.country===p.name?"selected":""}>${p.flag} ${p.name}</option>`).join("");

  document.getElementById("mem-edit-renew").checked = false;
  document.getElementById("mem-edit-isadmin").checked = u.isAdmin === true;

  const isSuperAdminRow = u.email === ADMIN_EMAIL;
  const adminRow = document.getElementById("mem-edit-admin-row");
  adminRow.style.display = isSuperAdminRow ? "none" : "flex";

  document.getElementById("member-edit-modal").classList.add("open");
  if (window.lucide) lucide.createIcons();
}

function fermerEditionMembre() {
  document.getElementById("member-edit-modal").classList.remove("open");
  editingMemberId = null;
}

async function sauvegarderMembre() {
  if (!editingMemberId || !currentUser?.isAdmin) return;
  const mandateType = document.getElementById("mem-edit-mandatetype").value;
  const section      = document.getElementById("mem-edit-section").value;
  const country       = document.getElementById("mem-edit-country").value;
  const renew         = document.getElementById("mem-edit-renew").checked;
  const isAdmin        = document.getElementById("mem-edit-isadmin").checked;

  const updates = {
    role: mandateType, mandateType, section, country,
    mandateDays: MANDATE_TYPES[mandateType] || 90,
    isAdmin,
  };
  if (renew) updates.mandateStart = new Date().toISOString().split("T")[0];

  const targetId = editingMemberId;
  try {
    await db.collection("users").doc(targetId).update(updates);
    showToast("Membre mis à jour avec succès.", "success");
    fermerEditionMembre();
    await chargerMembres();
    if (targetId === currentUser.uid) { await chargerProfil(auth.currentUser); populateUserInfo(); renderMandateProgress(); applyAdminUI(); }
  } catch (e) {
    showToast("Erreur lors de la mise à jour.", "error");
    console.error(e);
  }
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
  const html = COUNTRIES.map(p => `
    <div class="country-chip ${p.status}" onclick="showToast('${p.name} — ${p.label}','info')">
      <span class="flag">${p.flag}</span><span class="cname">${p.name}</span><span class="cstatus">${p.label}</span>
    </div>`).join("");
  ["country-grid", "about-country-grid"].forEach(id => {
    const c = document.getElementById(id);
    if (c) c.innerHTML = html;
  });
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
