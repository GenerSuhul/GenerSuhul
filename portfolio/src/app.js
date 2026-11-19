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
const lightbox = document.querySelector("#lightbox");
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-image]");
  if (!button) return;
  document.querySelector("#lightbox-image").src = button.dataset.image;
  document.querySelector("#lightbox-image").alt = button.dataset.caption;
  document.querySelector("#lightbox-caption").textContent = button.dataset.caption;
  lightbox.showModal();
});
lightbox.querySelector("[data-close]").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => { if (event.target === lightbox) lightbox.close(); });
document.querySelector("#copy-email")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("gsuhula1@miumg.edu.gt");
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
