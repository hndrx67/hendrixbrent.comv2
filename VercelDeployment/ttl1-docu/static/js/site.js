(function(){
  const root = document.documentElement;
  const checkbox = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  let theme;
  if (saved) {
    theme = saved;
  } else {
    theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }
  root.setAttribute('data-theme', theme);
  if (checkbox) checkbox.checked = theme === 'dark';

  if (checkbox) checkbox.addEventListener('change', () => {
    const newTheme = checkbox.checked ? 'dark' : 'light';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // Active nav link
  const path = location.pathname.split('/').pop() || 'english-ttl1.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.endsWith(path)) a.classList.add('active');
  });

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
