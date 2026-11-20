const root = document.documentElement;
const themeButton = document.querySelector("#theme");
const deviceTheme = window.matchMedia("(prefers-color-scheme: dark)");
let hasManualTheme = false;
try { hasManualTheme = ["light", "dark"].includes(localStorage.getItem("gs-portfolio-theme")); } catch {}
function syncTheme() {
  const dark = root.dataset.theme !== "light";
  themeButton.textContent = dark ? "Claro" : "Oscuro";
  themeButton.setAttribute("aria-label", dark ? "Activar tema claro" : "Activar tema oscuro");
}
themeButton.addEventListener("click", () => {
  hasManualTheme = true;
  root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
  try { localStorage.setItem("gs-portfolio-theme", root.dataset.theme); } catch {}
  syncTheme();
});
syncTheme();
deviceTheme.addEventListener("change", (event) => {
  if (hasManualTheme) return;
  root.dataset.theme = event.matches ? "dark" : "light";
  syncTheme();
});
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

// Show the return-to-top control only after the visitor scrolls down.
const backToTop = document.querySelector('.back-to-top');
function syncBackToTop() { backToTop.hidden = window.scrollY < 500; }
window.addEventListener('scroll', syncBackToTop, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: motion.matches ? 'instant' : 'smooth' }));
syncBackToTop();
