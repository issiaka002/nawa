/* NAWA: page-local behaviour. The engine is untouched; everything here reads
   the --sc-p the engine publishes, or the pointer. */
(function () {
  'use strict';

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var POINTER_LERP = 0.08;
  var CRACK_FROM = 0.16;   // act progress where the fracture starts to open
  var BREAK_AT = 0.56;     // act progress where the square comes away

  var clamp01 = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };

  // ---- hero: the planes lean with the pointer ----------------------------
  var heroStage = document.querySelector('.hero__stage');
  if (heroStage && fine && !reduce) {
    var target = { x: 0, y: 0 }, cur = { x: 0, y: 0 }, running = false;
    var step = function () {
      cur.x += (target.x - cur.x) * POINTER_LERP;
      cur.y += (target.y - cur.y) * POINTER_LERP;
      heroStage.style.setProperty('--px', cur.x.toFixed(4));
      heroStage.style.setProperty('--py', cur.y.toFixed(4));
      running = Math.abs(target.x - cur.x) + Math.abs(target.y - cur.y) > 0.001;
      if (running) requestAnimationFrame(step);
    };
    addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' || scrollY > innerHeight * 2.2) return;
      target.x = (e.clientX / innerWidth) * 2 - 1;
      target.y = (e.clientY / innerHeight) * 2 - 1;
      if (!running) { running = true; requestAnimationFrame(step); }
    }, { passive: true });
  }

  // ---- close: the wheel breaks the bar -----------------------------------
  var closeAct = document.getElementById('reserver');
  var tab = document.querySelector('[data-nawa-tab]');
  var closeStage = closeAct && closeAct.querySelector('[data-sc-stage]');
  var lastState = '';

  function readBar() {
    if (!closeAct || !tab) return;
    var p = parseFloat(closeAct.style.getPropertyValue('--sc-p')) || 0;
    var strain = clamp01((p - CRACK_FROM) / (BREAK_AT - CRACK_FROM));
    var broken = p >= BREAK_AT;
    var k = broken ? 1 : strain * strain;
    tab.style.setProperty('--k', k.toFixed(3));
    tab.classList.toggle('is-broken', broken);
    // The harness cannot see this bespoke state, so publish what is painted.
    var state = (broken ? 'broken' : 'whole') + ':' + k.toFixed(2);
    if (state !== lastState) { lastState = state; closeStage.setAttribute('data-sc-verify-state', state); }
    closeStage.setAttribute('data-sc-verify-hold', String(broken || p < CRACK_FROM));
  }
  var queued = false;
  var onScroll = function () {
    if (queued) return;
    queued = true;
    // Two frames: the engine writes --sc-p in its own rAF, read after it.
    requestAnimationFrame(function () { requestAnimationFrame(function () { queued = false; readBar(); }); });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  // The light on the chocolate follows the pointer.
  if (tab && fine && !reduce) {
    tab.addEventListener('pointermove', function (e) {
      var r = tab.getBoundingClientRect();
      tab.style.setProperty('--lx', (clamp01((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
      tab.style.setProperty('--ly', (clamp01((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
    }, { passive: true });
  }

  // ---- reaching the square ------------------------------------------------
  // The square only exists as a button once the act has run. Jumps and keyboard
  // focus park the page at the end of the act, where it has come away.
  function toEnd(instant) {
    var max = document.documentElement.scrollHeight - innerHeight;
    scrollTo({ top: max, behavior: instant || reduce ? 'instant' : 'smooth' });
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-nawa-jump]'), function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); toEnd(false); });
  });

  var piece = document.querySelector('[data-nawa-reserve]');
  var note = document.getElementById('reservation');
  if (piece && note) {
    piece.addEventListener('focus', function () {
      if (!tab.classList.contains('is-broken')) toEnd(true);
    });
    piece.addEventListener('click', function (e) {
      e.preventDefault();
      if (!tab.classList.contains('is-broken')) { toEnd(false); return; }
      if (typeof note.showModal === 'function') note.showModal();
    });
    note.addEventListener('close', function () { piece.focus({ preventScroll: true }); });
  }
})();
