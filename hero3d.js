// Shared presentation controls. Content, archive filters and project data live in site.js.
export const control = { progress: 0, started: false };
export const mousePos = { x: 99, y: 99, isDown: false };
export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isHome = document.body.classList.contains('home-page');
export const selectedPalette = { color: '#2F69FF' };
const background = document.createElement('div');
background.className = 'gravity-background';
background.setAttribute('aria-hidden', 'true');
document.body.prepend(background);

let target = window.scrollY, expected = window.scrollY, smoothing = false, frame = 0;
const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - innerHeight);
const clamp = value => Math.max(0, Math.min(maxScroll(), value));
const stops = isHome ? ['home', 'overview', 'experience', 'technologies', 'contact'].map(id => document.getElementById(id)) : [];
let offsets = [];
function measure() { offsets = stops.map(el => el.getBoundingClientRect().top + scrollY); target = clamp(target); updateProgress(); }
function updateProgress() {
  // Anchor physics stages to the real sections; long text and mobile layouts can grow freely.
  let progress = 0;
  if (isHome && offsets.length) {
    let index = 0;
    while (index < offsets.length - 1 && scrollY >= offsets[index + 1]) index++;
    const start = offsets[index], end = offsets[index + 1] ?? start + innerHeight;
    progress = Math.min(4, index + Math.max(0, (scrollY - start) / Math.max(1, end - start)));
  }
  control.progress = progress;
  background.dataset.stage = progress > 1.55 ? '2' : progress > .7 ? '1' : '0';
}
function tick() {
  frame = 0;
  if (smoothing) {
    target = clamp(target);
    const next = scrollY + (target - scrollY) * .09;
    if (Math.abs(next - target) < .7) { window.scrollTo(0, target); smoothing = false; }
    else window.scrollTo(0, next);
    expected = scrollY;
  }
  updateProgress();
  if (smoothing) frame = requestAnimationFrame(tick);
}
function schedule() { if (!frame) frame = requestAnimationFrame(tick); }
function stopSmoothing() { smoothing = false; target = scrollY; }
window.addEventListener('wheel', event => {
  if (event.ctrlKey || reducedMotion || document.body.classList.contains('lightbox-open')) return;
  // Preserve native scrolling in code samples, tables and other nested scroll panes.
  let node = event.target instanceof Element ? event.target : null;
  while (node && node !== document.body) {
    const style = getComputedStyle(node);
    if ((/(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 1) || (Math.abs(event.deltaX) > 0 && node.scrollWidth > node.clientWidth + 1)) return;
    node = node.parentElement;
  }
  event.preventDefault();
  if (!smoothing) target = scrollY;
  target = clamp(target + event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1));
  smoothing = true; schedule();
}, { passive: false });
window.addEventListener('scroll', () => { if (Math.abs(scrollY - expected) > 2) stopSmoothing(); schedule(); }, { passive: true });
window.addEventListener('touchstart', stopSmoothing, { passive: true });
window.addEventListener('keydown', event => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) stopSmoothing(); });
window.addEventListener('pointerdown', event => { if (event.clientX >= document.documentElement.clientWidth) stopSmoothing(); });
window.addEventListener('resize', measure);
window.addEventListener('load', measure);
new ResizeObserver(measure).observe(document.querySelector('main'));
document.fonts?.ready.then(measure);
measure();
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href').slice(1), destination = document.getElementById(id);
  if (!destination) return;
  event.preventDefault();
  target = clamp(destination.getBoundingClientRect().top + scrollY - (id === 'home' ? 0 : 96));
  if (reducedMotion) { window.scrollTo(0, target); expected = scrollY; schedule(); }
  else { smoothing = true; schedule(); }
  history.replaceState(null, '', '#' + id);
  if (link.classList.contains('skip-link')) { destination.tabIndex = -1; destination.focus({ preventScroll: true }); }
});
window.addEventListener('pointermove', event => { mousePos.x = event.clientX / innerWidth * 2 - 1; mousePos.y = -(event.clientY / innerHeight) * 2 + 1; }, { passive: true });
window.addEventListener('pointerdown', () => mousePos.isDown = true);
window.addEventListener('pointerup', () => mousePos.isDown = false);
window.addEventListener('pointercancel', () => mousePos.isDown = false);
const resetPointer = () => { mousePos.x = mousePos.y = 99; mousePos.isDown = false; };
window.addEventListener('blur', resetPointer);
document.documentElement.addEventListener('pointerleave', resetPointer);

export function setupThemeToggle() {
  const header = document.querySelector('.site-header'), nav = document.querySelector('[data-site-nav]'), menu = document.querySelector('[data-menu-toggle]');
  if (!header || !nav || !menu) return;
  const controls = document.createElement('div'); controls.className = 'header-controls';
  const button = document.createElement('button'); button.type = 'button'; button.className = 'theme-toggle';
  button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle class="palette-ring-dot" cx="18.5" cy="5.5" r="4"/></svg>';
  nav.replaceWith(controls); controls.append(nav, button, menu);
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const dark = theme === 'dark';
    button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    button.title = dark ? 'Light mode' : 'Dark mode';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#101522' : '#ecefff');
  }
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  button.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    try { localStorage.setItem('eunha-theme', theme); } catch { /* Session-only preference. */ }
  });
  window.addEventListener('storage', event => {
    if (event.key === 'eunha-theme') applyTheme(event.newValue === 'dark' ? 'dark' : 'light');
  });
}
