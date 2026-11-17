// Exact pointer tracking; ring expansion is handled by CSS, without an animation loop.
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const root = document.documentElement;
const nativeSelector = 'input, textarea, select, [role="textbox"]';
const interactiveSelector = 'a, button, summary, [role="button"], [role="link"], label, [data-hero-robot]';

function hideCursor() {
  root.classList.remove('dot-cursor-active');
}

function usesNativeCursor(target) {
  return target instanceof Element &&
    (target.closest(nativeSelector) || target.isContentEditable);
}

function createCursor() {
  const element = document.createElement('div');
  element.className = 'dot-cursor';
  element.setAttribute('aria-hidden', 'true');
  element.innerHTML = '<span class="dot-cursor-dot"></span><span class="dot-cursor-ring"></span>';
  document.body.append(element);
  return element;
}

let cursor;
try {
  cursor = createCursor();

  function updateCursor(event) {
    const target = event.target;
    if (!cursor.isConnected || !finePointer.matches || event.pointerType !== 'mouse' ||
        !(target instanceof Element) || usesNativeCursor(target)) {
      hideCursor();
      return;
    }

    // Selection never disables the dot or cancels the browser's selection events.
    cursor.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
    cursor.classList.toggle('is-interactive', Boolean(target.closest(interactiveSelector)));
    root.classList.add('dot-cursor-active');
  }

  for (const eventName of ['pointermove', 'pointerover', 'pointerdown']) {
    document.addEventListener(eventName, updateCursor, { passive: true });
  }

  document.addEventListener('focusin', event => {
    if (usesNativeCursor(event.target)) hideCursor();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Tab' || event.key === 'Escape') hideCursor();
  });

  root.addEventListener('pointerleave', hideCursor);
  document.addEventListener('pointercancel', hideCursor);
  document.addEventListener('visibilitychange', hideCursor);
  window.addEventListener('blur', hideCursor);
  window.addEventListener('pagehide', hideCursor);
  finePointer.addEventListener('change', hideCursor);
} catch {
  // A failed enhancement must always leave the native cursor available.
  hideCursor();
  cursor?.remove();
}
