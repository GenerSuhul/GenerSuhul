// Apply the saved preference or the device theme before the page paints.
(function () {
  let savedTheme;
  try { savedTheme = localStorage.getItem("gs-portfolio-theme"); } catch {}
  const validSavedTheme = savedTheme === "light" || savedTheme === "dark";
  const devicePrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = validSavedTheme ? savedTheme : (devicePrefersDark ? "dark" : "light");
})();
