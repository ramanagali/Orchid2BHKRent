// Minimal lightbox: open clicked image in a modal, navigate with arrows/keyboard, swipe support basic
(function () {
  'use strict';
  const items = Array.from(document.querySelectorAll('.gallery .gallery-item'));
  if (!items.length) return;

  let currentIndex = 0;
  let overlay, imgEl, closeBtn, prevBtn, nextBtn;

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'lb-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    const content = document.createElement('div');
    content.className = 'lb-content';

    imgEl = document.createElement('img');
    imgEl.className = 'lb-img';
    imgEl.alt = '';

    closeBtn = document.createElement('button');
    closeBtn.className = 'lb-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', close);

    prevBtn = document.createElement('button');
    prevBtn.className = 'lb-arrow lb-prev';
    prevBtn.innerHTML = '&#10094;';
    prevBtn.addEventListener('click', showPrev);

    nextBtn = document.createElement('button');
    nextBtn.className = 'lb-arrow lb-next';
    nextBtn.innerHTML = '&#10095;';
    nextBtn.addEventListener('click', showNext);

    content.appendChild(prevBtn);
    content.appendChild(imgEl);
    content.appendChild(nextBtn);
    content.appendChild(closeBtn);
    overlay.appendChild(content);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    // keyboard
    window.addEventListener('keydown', onKey);
    // basic touch swipe support
    let startX = 0;
    imgEl.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, {passive:true});
    imgEl.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) showNext(); else showPrev();
      }
    }, {passive:true});
  }

  function open(index) {
    currentIndex = index;
    if (!overlay) createOverlay();
    updateImage();
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    // set focus to close button for accessibility
    closeBtn.focus();
  }

  function close() {
    if (!overlay) return;
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  function updateImage() {
    const el = items[currentIndex];
    if (!el) return;
    const src = el.getAttribute('src') || el.getAttribute('data-src');
    const alt = el.getAttribute('alt') || '';
    imgEl.src = src;
    imgEl.alt = alt;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateImage();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % items.length;
    updateImage();
  }

  function onKey(e) {
    if (!overlay || overlay.style.display === 'none') return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  }

  // attach click handlers
  items.forEach((it, idx) => {
    it.style.cursor = 'zoom-in';
    it.addEventListener('click', (e) => {
      e.preventDefault();
      open(idx);
    });
    // also allow keyboard activation
    it.tabIndex = 0;
    it.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        open(idx);
      }
    });
  });

})();
