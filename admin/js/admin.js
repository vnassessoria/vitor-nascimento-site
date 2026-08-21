/* ============ Mostrar/ocultar senha ============ */
document.querySelectorAll("[data-toggle-password]").forEach((btn) => {
  const input = btn.previousElementSibling;
  btn.addEventListener("click", () => {
    const isVisible = input.type === "text";
    input.type = isVisible ? "password" : "text";
    btn.setAttribute("aria-pressed", String(!isVisible));
    btn.setAttribute("aria-label", isVisible ? "Mostrar senha" : "Ocultar senha");
  });
});

/* ============ Autenticação ============ */
const loginScreen = document.getElementById("loginScreen");
const dashboard = document.getElementById("dashboard");
let currentUserEmail = "";

async function checkAuth() {
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) {
    currentUserEmail = data.session.user.email;
    showDashboard();
  } else {
    showLogin();
  }
}

function showLogin() {
  loginScreen.style.display = "flex";
  dashboard.classList.remove("visible");
}

function showDashboard() {
  loginScreen.style.display = "none";
  dashboard.classList.add("visible");
  loadNews();
  loadMessages();
  loadServices();
  loadSettings();
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const errorBox = document.getElementById("loginError");
  errorBox.classList.remove("visible");
  const data = new FormData(e.target);
  const { data: authData, error } = await supabaseClient.auth.signInWithPassword({
    email: data.get("email"),
    password: data.get("password"),
  });
  if (error) {
    errorBox.textContent = "E-mail ou senha inválidos.";
    errorBox.classList.add("visible");
    return;
  }
  currentUserEmail = authData.user.email;
  e.target.reset();
  showDashboard();
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  showLogin();
});

/* ============ Navegação entre painéis ============ */
document.querySelectorAll(".sidebar nav button[data-panel]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".sidebar nav button[data-panel]").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`panel-${btn.dataset.panel}`).classList.add("active");
  });
});

/* ============ Util ============ */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

function slugify(text) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(base, ignoreId) {
  let slug = slugify(base) || "noticia";
  let n = 2;
  while (true) {
    let query = supabaseClient.from("news").select("id").eq("slug", slug);
    if (ignoreId) query = query.neq("id", ignoreId);
    const { data } = await query.maybeSingle();
    if (!data) return slug;
    slug = `${slugify(base)}-${n}`;
    n += 1;
  }
}

function showAlert(message) {
  alert(message);
}

/* ============ Notícias ============ */
const newsForm = document.getElementById("newsForm");
const newsFormCard = document.getElementById("newsFormCard");
const newsTableBody = document.querySelector("#newsTable tbody");

document.getElementById("newNewsBtn").addEventListener("click", () => openNewsForm());
document.getElementById("cancelNewsBtn").addEventListener("click", () => closeNewsForm());

function openNewsForm(item) {
  newsForm.reset();
  newsForm.id.value = item ? item.id : "";
  document.getElementById("newsFormTitle").textContent = item ? "Editar notícia" : "Nova notícia";
  if (item) {
    newsForm.tag.value = item.tag;
    newsForm.title.value = item.title;
    newsForm.summary.value = item.summary;
    newsForm.body.value = item.body || "";
    newsForm.sort_order.value = item.sort_order;
    newsForm.is_active.checked = !!item.is_active;
  } else {
    newsForm.is_active.checked = true;
  }
  newsFormCard.style.display = "block";
  newsFormCard.scrollIntoView({ behavior: "smooth", block: "start" });
}
function closeNewsForm() {
  newsFormCard.style.display = "none";
  newsForm.reset();
}

newsForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = newsForm.id.value;
  try {
    const slug = await uniqueSlug(newsForm.title.value, id || undefined);
    const payload = {
      tag: newsForm.tag.value,
      title: newsForm.title.value,
      summary: newsForm.summary.value,
      body: newsForm.body.value,
      sort_order: Number(newsForm.sort_order.value) || 0,
      is_active: newsForm.is_active.checked,
      slug,
      updated_at: new Date().toISOString(),
    };
    let error;
    if (id) {
      ({ error } = await supabaseClient.from("news").update(payload).eq("id", id));
    } else {
      payload.created_at = new Date().toISOString();
      ({ error } = await supabaseClient.from("news").insert(payload));
    }
    if (error) throw error;
    closeNewsForm();
    loadNews();
  } catch (err) {
    showAlert(err.message || "Erro ao salvar notícia.");
  }
});

async function loadNews() {
  const { data, error } = await supabaseClient.from("news").select("*").order("sort_order");
  if (error) { showAlert(error.message); return; }
  const items = data || [];
  newsTableBody.innerHTML = "";
  document.getElementById("newsEmpty").style.display = items.length ? "none" : "block";
  items.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.sort_order}</td>
      <td>${escapeHtml(item.tag)}</td>
      <td>${escapeHtml(item.title)}</td>
      <td><span class="badge ${item.is_active ? "badge--active" : "badge--inactive"}">${item.is_active ? "Ativa" : "Inativa"}</span></td>
      <td class="actions">
        <button class="btn btn--outline btn--sm" data-action="edit">Editar</button>
        <button class="btn btn--danger btn--sm" data-action="delete">Excluir</button>
      </td>`;
    tr.querySelector('[data-action="edit"]').addEventListener("click", () => openNewsForm(item));
    tr.querySelector('[data-action="delete"]').addEventListener("click", async () => {
      if (!confirm(`Excluir a notícia "${item.title}"? Essa ação não pode ser desfeita.`)) return;
      const { error: delError } = await supabaseClient.from("news").delete().eq("id", item.id);
      if (delError) { showAlert(delError.message); return; }
      loadNews();
    });
    newsTableBody.appendChild(tr);
  });
}

/* ============ Mensagens ============ */
const messagesTableBody = document.querySelector("#messagesTable tbody");

async function loadMessages() {
  const { data, error } = await supabaseClient.from("messages").select("*").order("created_at", { ascending: false });
  if (error) { showAlert(error.message); return; }
  const items = data || [];
  messagesTableBody.innerHTML = "";
  document.getElementById("messagesEmpty").style.display = items.length ? "none" : "block";

  const unread = items.filter((m) => !m.is_read).length;
  const badge = document.getElementById("unreadBadge");
  badge.textContent = unread > 0 ? unread : "";

  items.forEach((item) => {
    const tr = document.createElement("tr");
    const date = new Date(item.created_at).toLocaleString("pt-BR");
    const contato = [item.email, item.telefone].filter(Boolean).join(" · ");
    tr.innerHTML = `
      <td>${date}</td>
      <td>${escapeHtml(item.nome)}</td>
      <td>${escapeHtml(contato)}</td>
      <td class="message-body">${escapeHtml(item.mensagem)}</td>
      <td>${item.is_read ? "" : '<span class="badge badge--unread">Nova</span>'}</td>
      <td class="actions">
        ${item.is_read ? "" : '<button class="btn btn--outline btn--sm" data-action="read">Marcar como lida</button>'}
        <button class="btn btn--danger btn--sm" data-action="delete">Excluir</button>
      </td>`;
    const readBtn = tr.querySelector('[data-action="read"]');
    if (readBtn) {
      readBtn.addEventListener("click", async () => {
        await supabaseClient.from("messages").update({ is_read: true }).eq("id", item.id);
        loadMessages();
      });
    }
    tr.querySelector('[data-action="delete"]').addEventListener("click", async () => {
      if (!confirm("Excluir esta mensagem?")) return;
      await supabaseClient.from("messages").delete().eq("id", item.id);
      loadMessages();
    });
    messagesTableBody.appendChild(tr);
  });
}

/* ============ Serviços ============ */
const serviceForm = document.getElementById("serviceForm");
const serviceFormCard = document.getElementById("serviceFormCard");
const servicesTableBody = document.querySelector("#servicesTable tbody");
const iconPicker = document.getElementById("iconPicker");

iconPicker.innerHTML = Object.keys(ICONS)
  .map(
    (key) => `
    <label title="${ICON_LABELS[key]}">
      <input type="radio" name="icon_key" value="${key}">
      <svg viewBox="0 0 24 24">${ICONS[key]}</svg>
    </label>`
  )
  .join("");

document.getElementById("newServiceBtn").addEventListener("click", () => openServiceForm());
document.getElementById("cancelServiceBtn").addEventListener("click", () => closeServiceForm());

function openServiceForm(item) {
  serviceForm.reset();
  serviceForm.id.value = item ? item.id : "";
  document.getElementById("serviceFormTitle").textContent = item ? "Editar serviço" : "Novo serviço";
  if (item) {
    serviceForm.title.value = item.title;
    serviceForm.description.value = item.description;
    serviceForm.sort_order.value = item.sort_order;
    const radio = serviceForm.querySelector(`input[name="icon_key"][value="${item.icon_key}"]`);
    if (radio) radio.checked = true;
  } else {
    serviceForm.querySelector('input[name="icon_key"][value="building"]').checked = true;
  }
  serviceFormCard.style.display = "block";
  serviceFormCard.scrollIntoView({ behavior: "smooth", block: "start" });
}
function closeServiceForm() {
  serviceFormCard.style.display = "none";
  serviceForm.reset();
}

serviceForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = serviceForm.id.value;
  const iconInput = serviceForm.querySelector('input[name="icon_key"]:checked');
  const payload = {
    icon_key: iconInput ? iconInput.value : "building",
    title: serviceForm.title.value,
    description: serviceForm.description.value,
    sort_order: Number(serviceForm.sort_order.value) || 0,
  };
  try {
    let error;
    if (id) {
      ({ error } = await supabaseClient.from("services").update(payload).eq("id", id));
    } else {
      ({ error } = await supabaseClient.from("services").insert(payload));
    }
    if (error) throw error;
    closeServiceForm();
    loadServices();
  } catch (err) {
    showAlert(err.message || "Erro ao salvar serviço.");
  }
});

async function loadServices() {
  const { data, error } = await supabaseClient.from("services").select("*").order("sort_order");
  if (error) { showAlert(error.message); return; }
  const items = data || [];
  servicesTableBody.innerHTML = "";
  document.getElementById("servicesEmpty").style.display = items.length ? "none" : "block";
  items.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.sort_order}</td>
      <td><svg viewBox="0 0 24 24" style="width:20px;height:20px;stroke:#96794a;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;">${ICONS[item.icon_key] || ""}</svg></td>
      <td>${escapeHtml(item.title)}</td>
      <td>${escapeHtml(item.description)}</td>
      <td class="actions">
        <button class="btn btn--outline btn--sm" data-action="edit">Editar</button>
        <button class="btn btn--danger btn--sm" data-action="delete">Excluir</button>
      </td>`;
    tr.querySelector('[data-action="edit"]').addEventListener("click", () => openServiceForm(item));
    tr.querySelector('[data-action="delete"]').addEventListener("click", async () => {
      if (!confirm(`Excluir o serviço "${item.title}"?`)) return;
      await supabaseClient.from("services").delete().eq("id", item.id);
      loadServices();
    });
    servicesTableBody.appendChild(tr);
  });
}

/* ============ Configurações ============ */
const configForm = document.getElementById("configForm");

async function loadSettings() {
  const { data, error } = await supabaseClient.from("settings").select("key, value");
  if (error) { showAlert(error.message); return; }
  (data || []).forEach(({ key, value }) => {
    const field = configForm.elements.namedItem(key);
    if (field) field.value = value;
  });
}

configForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(configForm);
  const rows = [...data.entries()].map(([key, value]) => ({ key, value: String(value) }));
  const successBox = document.getElementById("configSuccess");
  try {
    const { error } = await supabaseClient.from("settings").upsert(rows, { onConflict: "key" });
    if (error) throw error;
    successBox.classList.add("visible");
    setTimeout(() => successBox.classList.remove("visible"), 3000);
  } catch (err) {
    showAlert(err.message || "Erro ao salvar configurações.");
  }
});

/* ============ Minha conta ============ */
const passwordForm = document.getElementById("passwordForm");
passwordForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const errorBox = document.getElementById("passwordError");
  const successBox = document.getElementById("passwordSuccess");
  errorBox.classList.remove("visible");
  successBox.classList.remove("visible");
  const data = new FormData(passwordForm);
  const currentPassword = data.get("currentPassword");
  const newPassword = data.get("newPassword");

  try {
    const { error: verifyError } = await supabaseClient.auth.signInWithPassword({
      email: currentUserEmail,
      password: currentPassword,
    });
    if (verifyError) throw new Error("Senha atual incorreta.");

    const { error: updateError } = await supabaseClient.auth.updateUser({ password: newPassword });
    if (updateError) throw updateError;

    passwordForm.reset();
    successBox.classList.add("visible");
  } catch (err) {
    errorBox.textContent = err.message || "Não foi possível trocar a senha.";
    errorBox.classList.add("visible");
  }
});

checkAuth();
