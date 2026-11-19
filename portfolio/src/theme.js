// Read before styles paint. Storage is optional in private browsing.
(function () {
  let theme;
  try { theme = localStorage.getItem("gs-portfolio-theme"); } catch {}
  document.documentElement.dataset.theme = theme === "light" ? "light" : "dark";
})();
