document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }
  function updateIcon() {
    btn.textContent = currentTheme() === 'light' ? '☀️' : '🌙';
  }

  updateIcon();

  btn.addEventListener('click', function () {
    var next = currentTheme() === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon();
  });
});
