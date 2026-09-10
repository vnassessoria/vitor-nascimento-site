/* ============================================================
   CONFIGURAÇÃO DE CONTATO (valores padrão)
   Esses valores agora são gerenciados pelo painel administrativo
   (/admin), que salva tudo no Supabase. Os valores abaixo só são
   usados como reserva, caso o Supabase esteja indisponível.
   ============================================================ */
const CONTACT = {
  whatsappNumber: "5571999517948",
  whatsappDisplay: "(71) 99951-7948",
  whatsappMessage: "Olá! Vim pelo site e gostaria de saber mais sobre os serviços de contabilidade.",
  email: "vitorn.contabilidade@outlook.com",
  instagramHandle: "@vnassessoriacontabil",
  instagramUrl: "https://instagram.com/vnassessoriacontabil",
  presencialDisplay: "Presencial: Salvador, BA",
  onlineDisplay: "Online: Em todo o Brasil",
  crcDisplay: "CONTADOR - CRC BA - N° 044908/O-9",
};

function buildWhatsappUrl(message) {
  const text = encodeURIComponent(message || CONTACT.whatsappMessage);
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${text}`;
}

function applyContactData() {
  document.querySelectorAll('[data-contact="whatsapp-link"]').forEach((el) => {
    el.href = buildWhatsappUrl();
  });
  document.querySelectorAll('[data-contact="email-link"]').forEach((el) => {
    el.href = `mailto:${CONTACT.email}`;
  });
  document.querySelectorAll('[data-contact="instagram-link"]').forEach((el) => {
    el.href = CONTACT.instagramUrl;
  });

  document.querySelectorAll('[data-contact-text="whatsapp-display"]').forEach((el) => (el.textContent = CONTACT.whatsappDisplay));
  document.querySelectorAll('[data-contact-text="email-display"]').forEach((el) => (el.textContent = CONTACT.email));
  document.querySelectorAll('[data-contact-text="instagram-display"]').forEach((el) => (el.textContent = CONTACT.instagramHandle));
  document.querySelectorAll('[data-contact-text="presencial-display"]').forEach((el) => (el.textContent = CONTACT.presencialDisplay));
  document.querySelectorAll('[data-contact-text="online-display"]').forEach((el) => (el.textContent = CONTACT.onlineDisplay));
  document.querySelectorAll('[data-contact-text="crc-display"]').forEach((el) => (el.textContent = CONTACT.crcDisplay));
}

/* ============ Util ============ */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

/* Tenta transformar uma URL de fonte legal num rótulo curto e
   reconhecível (ex.: "LC 116/2003", "Decreto 9.580/2018") em vez de
   mostrar sempre "planalto.gov.br" para leis diferentes. */
function labelFonte(url) {
  let host = "";
  let path = "";
  try {
    const u = new URL(url);
    host = u.hostname.replace(/^www\.?/, "");
    path = u.pathname + u.hash;
  } catch (err) {
    return url;
  }

  if (host === "planalto.gov.br") {
    let m = path.match(/lcp(\d+)\.htm/i);
    if (m) return `LC ${m[1]}`;
    m = path.match(/decreto\/d(\d+)\.htm/i);
    if (m) return `Decreto ${m[1]}`;
    m = path.match(/\/l([\d.]+)(?:cons)?\.htm/i);
    if (m) return `Lei ${m[1]}`;
    if (/Mensagem_Veto/i.test(path)) return "Mensagem de veto (Planalto)";
    return "Planalto";
  }
  if (host === "servicodados.ibge.gov.br") return "IBGE — CNAE";
  if (host === "normasinternet2.receita.fazenda.gov.br") return "Receita Federal (IN)";
  if (host === "www8.receita.fazenda.gov.br" || host === "receita.fazenda.gov.br") return "Receita Federal";
  if (host === "gov.br" && /\/drei\//i.test(path)) return "DREI/gov.br";
  if (host.endsWith("receita.rs.gov.br")) return "Receita Estadual (RS)";
  if (host === "legismap.com.br") return "LegisMap";
  if (host === "portal.stf.jus.br") return "STF";
  return host;
}

/* Monta a lista de "Base legal" (fontes oficiais) exibida no fim das
   páginas de detalhe de Consulta CNAE e Consulta Retenções. Recebe um
   array de URLs e devolve o HTML pronto, ou string vazia se não houver
   fontes. */
function renderFontes(fontes) {
  if (!fontes || !fontes.length) return "";
  const links = fontes
    .map((url) => `<li><a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(labelFonte(url))}</a></li>`)
    .join("");
  return `
    <div class="fontes-legais">
      <h3>Base legal</h3>
      <ul>${links}</ul>
    </div>`;
}

/* Converte o texto simples salvo no painel em HTML:
   parágrafos separados por linha em branco, e linhas
   iniciadas com "## " viram subtítulos. */
function renderArticleBody(text) {
  if (!text) return "";
  // Notícias criadas com o editor de texto rico já vêm em HTML — exibimos direto.
  if (/<[a-z][\s\S]*>/i.test(text)) return text;
  // Compatibilidade com notícias antigas (texto simples com "## " para subtítulos).
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (block.startsWith("## ")) {
        return `<h2>${escapeHtml(block.slice(3).trim())}</h2>`;
      }
      return `<p>${escapeHtml(block)}</p>`;
    })
    .join("\n");
}

/* ============ Carrega configurações do Supabase ============ */
async function loadSettings() {
  try {
    const { data, error } = await supabaseClient.from("settings").select("key, value");
    if (error) throw error;
    const map = {};
    (data || []).forEach((row) => (map[row.key] = row.value));

    if (map.whatsapp_number) CONTACT.whatsappNumber = map.whatsapp_number;
    if (map.whatsapp_display) CONTACT.whatsappDisplay = map.whatsapp_display;
    if (map.whatsapp_message) CONTACT.whatsappMessage = map.whatsapp_message;
    if (map.email) CONTACT.email = map.email;
    if (map.instagram_handle) CONTACT.instagramHandle = map.instagram_handle;
    if (map.instagram_url) CONTACT.instagramUrl = map.instagram_url;
    if (map.presencial_display) CONTACT.presencialDisplay = map.presencial_display;
    if (map.online_display) CONTACT.onlineDisplay = map.online_display;
    if (map.crc_display) CONTACT.crcDisplay = map.crc_display;
  } catch (err) {
    console.warn("Não foi possível carregar configurações do Supabase, usando valores padrão.", err);
  }
  applyContactData();
}

/* ============ Header scroll state ============ */
function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ============ Mobile nav ============ */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("mobile-open");
    toggle.classList.toggle("active", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("mobile-open");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ============ Menu suspenso (ex.: Conteúdo) ============ */
function initNavDropdowns() {
  const dropdowns = document.querySelectorAll(".nav-dropdown");
  if (!dropdowns.length) return;

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(".nav-dropdown__trigger");
    if (!trigger) return;
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = dropdown.classList.toggle("is-open");
      dropdowns.forEach((other) => {
        if (other !== dropdown) other.classList.remove("is-open");
      });
      trigger.setAttribute("aria-expanded", String(isOpen));
    });
  });

  document.addEventListener("click", () => {
    dropdowns.forEach((dropdown) => dropdown.classList.remove("is-open"));
  });
}

/* ============ Balão flutuante de convite à consultoria ============
   Presente só nas páginas de Consulta CNAE e Consulta Retenções. */
function initFloatingCta() {
  const cta = document.getElementById("floatingCta");
  if (!cta) return;

  const closeBtn = document.getElementById("floatingCtaClose");
  const dismissedKey = "vn_floating_cta_dismissed";

  if (sessionStorage.getItem(dismissedKey) === "1") return;

  setTimeout(() => cta.classList.add("is-visible"), 1500);

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      cta.classList.remove("is-visible");
      sessionStorage.setItem(dismissedKey, "1");
    });
  }
}

/* ============ Scroll reveal ============ */
function initReveal() {
  const elements = document.querySelectorAll("[data-reveal]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  elements.forEach((el) => observer.observe(el));
}

/* ============ Serviços (dinâmico) ============ */
async function loadServices() {
  const grid = document.getElementById("servicesGrid");
  if (!grid) return;

  try {
    const { data, error } = await supabaseClient.from("services").select("*").order("sort_order");
    if (error) throw error;
    const services = data || [];

    if (services.length === 0) {
      grid.innerHTML = '<p style="color:var(--text-muted, #b9ad97);">Nenhum serviço cadastrado no momento.</p>';
      return;
    }

    grid.innerHTML = services
      .map(
        (s) => `
      <div class="card" data-reveal>
        <div class="card__icon">${typeof iconSvg === "function" ? iconSvg(s.icon_key) : ""}</div>
        <h3>${escapeHtml(s.title)}</h3>
        <p>${escapeHtml(s.description)}</p>
      </div>`
      )
      .join("");

    initReveal();
  } catch (err) {
    grid.innerHTML = '<p style="color:var(--text-muted, #b9ad97);">Não foi possível carregar os serviços agora. Tente novamente em instantes.</p>';
    console.warn(err);
  }
}

/* ============ Contact form -> WhatsApp + salva mensagem ============ */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const nome = data.get("nome") || "";
    const email = data.get("email") || "";
    const telefone = data.get("telefone") || "";
    const mensagem = data.get("mensagem") || "";

    try {
      const { error } = await supabaseClient.from("messages").insert({ nome, email, telefone, mensagem });
      if (error) throw error;
    } catch (err) {
      console.warn("Não foi possível salvar a mensagem no Supabase.", err);
    }

    const message = [
      `Olá! Meu nome é ${nome}.`,
      email ? `E-mail: ${email}` : null,
      telefone ? `Telefone: ${telefone}` : null,
      `Mensagem: ${mensagem}`,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(buildWhatsappUrl(message), "_blank", "noopener");
    form.reset();
  });
}

/* ============ Footer year ============ */
function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

/* ============ Carrossel de notícias (dinâmico) ============ */
async function initNewsCarousel() {
  const track = document.getElementById("newsTrack");
  const dotsWrap = document.getElementById("newsDots");
  const prevBtn = document.getElementById("newsPrev");
  const nextBtn = document.getElementById("newsNext");
  if (!track || !dotsWrap || !prevBtn || !nextBtn) return;

  let items = [];
  try {
    const { data, error } = await supabaseClient
      .from("news")
      .select("id, tag, title, summary, slug, image_url")
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw error;
    items = data || [];
  } catch (err) {
    console.warn("Não foi possível carregar notícias do Supabase.", err);
  }

  const carousel = track.closest(".news-carousel");

  if (items.length === 0) {
    if (carousel) carousel.style.display = "none";
    return;
  }

  track.innerHTML = items
    .map(
      (item) => `
    <a class="news-slide" href="noticia.html?slug=${encodeURIComponent(item.slug)}">
      <article class="news-card">
        ${item.image_url ? `<div class="news-card__image-wrap"><img src="${escapeHtml(item.image_url)}" alt="" loading="lazy"></div>` : ""}
        <span class="news-card__tag">${escapeHtml(item.tag)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.summary)}</p>
        <span class="news-card__date">Ler notícia completa →</span>
      </article>
    </a>`
    )
    .join("");

  const slides = [...track.children];

  const AUTOPLAY_MS = 5000;
  let current = 0;
  let timer = null;

  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "news-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir para notícia ${i + 1}`);
    dot.addEventListener("click", () => goTo(i, true));
    dotsWrap.appendChild(dot);
  });
  const dots = [...dotsWrap.children];

  function render() {
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === current));
  }

  function goTo(index, userTriggered) {
    current = (index + slides.length) % slides.length;
    render();
    if (userTriggered) restartAutoplay();
  }

  function next(userTriggered) { goTo(current + 1, userTriggered); }
  function prev(userTriggered) { goTo(current - 1, userTriggered); }

  function startAutoplay() {
    if (slides.length < 2) return;
    timer = setInterval(() => next(false), AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (timer) clearInterval(timer);
    timer = null;
  }
  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  prevBtn.addEventListener("click", () => prev(true));
  nextBtn.addEventListener("click", () => next(true));

  if (carousel) {
    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
  }

  render();
  startAutoplay();
  initReveal();
}

/* ============ Contador de visitas ============ */
function getVisitorId() {
  try {
    let id = localStorage.getItem("vn_visitor_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("vn_visitor_id", id);
    }
    return id;
  } catch (err) {
    return null;
  }
}

async function trackPageView() {
  try {
    await supabaseClient.from("page_views").insert({
      path: window.location.pathname,
      visitor_id: getVisitorId(),
    });
  } catch (err) {
    console.warn("Não foi possível registrar a visita.", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadSettings();
  initHeaderScroll();
  initMobileNav();
  initNavDropdowns();
  initFloatingCta();
  initReveal();
  initContactForm();
  initNewsCarousel();
  loadServices();
  initYear();
  trackPageView();
});
