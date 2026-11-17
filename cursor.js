// One exact-position cursor, with CSS-only hover transitions and no animation loop.
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const root = document.documentElement;
let cursor;
const hide = () => root.classList.remove('dot-cursor-active');
try {
  cursor = document.createElement('div');
  cursor.className = 'dot-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<span class="dot-cursor-dot"></span><span class="dot-cursor-ring"></span>';
  document.body.append(cursor);
  const nativeSelector = 'input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"],p,h1,h2,h3,h4,h5,h6,dt,dd,pre,code';
  const interactiveSelector = 'a,button,summary,[role="button"],[role="link"],label,[data-hero-robot]';
  function update(event) {
    try {
      if (!finePointer.matches || event.pointerType !== 'mouse' || !event.target.closest) return hide();
      const interactive = event.target.closest(interactiveSelector);
      const native = event.target.closest(nativeSelector);
      if ((native && (!interactive || native.contains(interactive))) || getComputedStyle(event.target).cursor === 'text') return hide();
      cursor.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
      cursor.classList.toggle('is-interactive', !!interactive);
      root.classList.add('dot-cursor-active');
    } catch { hide(); }
  }
  document.addEventListener('pointermove', update, { passive:true });
  document.addEventListener('pointerover', update, { passive:true });
  document.documentElement.addEventListener('pointerleave', hide);
  document.addEventListener('pointercancel', hide);
  document.addEventListener('keydown', hide);
  document.addEventListener('visibilitychange', hide);
  window.addEventListener('blur', hide);
  window.addEventListener('pagehide', hide);
  finePointer.addEventListener('change', hide);
} catch { hide(); cursor?.remove(); }
