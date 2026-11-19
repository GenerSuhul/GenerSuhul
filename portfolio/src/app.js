const root = document.documentElement;
const themeButton = document.querySelector("#theme");
function syncTheme() {
  const dark = root.dataset.theme !== "light";
  themeButton.textContent = dark ? "Claro" : "Oscuro";
  themeButton.setAttribute("aria-label", dark ? "Activar tema claro" : "Activar tema oscuro");
}
themeButton.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
  try { localStorage.setItem("gs-portfolio-theme", root.dataset.theme); } catch {}
  syncTheme();
});
syncTheme();
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
function closeMenu() { navigation.classList.remove("open"); menuButton.setAttribute("aria-expanded", "false"); }
menuButton.addEventListener("click", () => {
  const open = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
navigation.addEventListener("click", (event) => { if (event.target.closest("a")) closeMenu(); });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("open")) { closeMenu(); menuButton.focus(); }
});
document.querySelector("#copy-email")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("generalexandersuhul22@gmail.com");
    document.querySelector("#status").textContent = "Correo copiado";
  } catch {
    document.querySelector("#status").textContent = "Puedes copiar el correo visible o abrir el enlace de contacto.";
  }
});
const motion = matchMedia("(prefers-reduced-motion: reduce)");
if (!motion.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
  }, {threshold:0.05});
  document.querySelectorAll(".expertise article, .impact-grid article").forEach((element) => {
    element.classList.add("reveal-ready"); observer.observe(element);
  });
}

// Animate the project image and text independently as each case enters the viewport.
if (!motion.matches && "IntersectionObserver" in window) {
  const projectObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      entry.target.classList.toggle("project-in-view", entry.isIntersecting);
    }
  }, { rootMargin: "-8% 0px -12% 0px", threshold: 0.12 });
  document.querySelectorAll(".featured").forEach((project) => {
    project.classList.add("project-motion-ready");
    projectObserver.observe(project);
  });
}

// The panel opens once after seven seconds, unless the visitor already used it.
const whatsappTrigger = document.querySelector(".whatsapp-trigger");
const whatsappPanel = document.querySelector("#whatsapp-panel");
const whatsappClose = document.querySelector(".whatsapp-close");
let whatsappInteracted = false;
function setWhatsappOpen(open) {
  whatsappPanel.hidden = !open;
  whatsappTrigger.setAttribute("aria-expanded", String(open));
  whatsappTrigger.setAttribute("aria-label", open ? "Cerrar contacto de WhatsApp" : "Abrir contacto de WhatsApp");
}
whatsappTrigger.addEventListener("click", () => {
  whatsappInteracted = true;
  setWhatsappOpen(whatsappPanel.hidden);
});
whatsappClose.addEventListener("click", () => {
  whatsappInteracted = true;
  setWhatsappOpen(false);
  whatsappTrigger.focus();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !whatsappPanel.hidden) {
    whatsappInteracted = true;
    setWhatsappOpen(false);
    whatsappTrigger.focus();
  }
});
setTimeout(() => {
  if (!whatsappInteracted) setWhatsappOpen(true);
}, 7000);
