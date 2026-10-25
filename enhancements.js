'use strict';

(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const routeDialogs = new Map([
    ['#explore', document.querySelector('#explore-dialog')],
    ['#logic-lens', document.querySelector('#logic-dialog')],
    ['#commutecircle', document.querySelector('#commute-dialog')],
    ['#logic-lens-demo', document.querySelector('#demo-dialog')]
  ]);
  let trigger = null;
  let pushedOverlay = false;

  const setOverlayState = () => {
    const open = Boolean(document.querySelector('dialog[open]'));
    document.body.classList.toggle('modal-open', open);
    document.dispatchEvent(new Event('portfolio:overlaychange'));
    document.querySelectorAll('[aria-controls="explore-dialog"]').forEach(button => {
      button.setAttribute('aria-expanded', String(routeDialogs.get('#explore').open));
    });
  };

  const syncRoute = () => {
    const selected = routeDialogs.get(location.hash);
    routeDialogs.forEach(dialog => {
      if (dialog !== selected && dialog.open) dialog.close();
    });
    if (selected && !selected.open) {
      selected.showModal();
      selected.scrollTop = 0;
      selected.querySelector('.dialog-close').focus({ preventScroll: true });
    }
    setOverlayState();
  };

  // These are real links: direct URLs, browser Back and opening in a new tab work.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-overlay]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const route = link.hash;
    if (!routeDialogs.has(route)) return;
    event.preventDefault();
    const switching = routeDialogs.has(location.hash);
    if (!switching) {
      trigger = link;
      pushedOverlay = true;
      history.pushState({ portfolioOverlay: true }, '', route);
    } else {
      history.replaceState(history.state, '', route);
    }
    syncRoute();
  });

  routeDialogs.forEach((dialog, route) => {
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      if (location.hash === route) {
        if (pushedOverlay) {
          pushedOverlay = false;
          history.back();
        } else {
          const destination = route === '#explore' ? '#home' : '#work';
          history.replaceState(null, '', destination);
          document.querySelector(destination)?.scrollIntoView({ behavior: 'instant' });
        }
        trigger?.focus({ preventScroll: true });
      }
      setOverlayState();
    });
    dialog.querySelectorAll('a[href^="#"]:not([data-overlay])').forEach(link => {
      link.addEventListener('click', event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const target = document.querySelector(link.hash);
        if (!target) return;
        event.preventDefault();
        history.replaceState(null, '', link.hash);
        pushedOverlay = false;
        dialog.close();
        target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
        const heading = target.querySelector('h1,h2') || target;
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      });
    });
  });
  window.addEventListener('popstate', syncRoute);
  window.addEventListener('hashchange', syncRoute);
  syncRoute();

  const exploreLinks = document.querySelectorAll('[data-explore-preview]');
  const showPreview = link => {
    exploreLinks.forEach(item => item.classList.toggle('is-previewed', item === link));
    document.querySelectorAll('[data-preview-panel]').forEach(panel => {
      panel.hidden = panel.dataset.previewPanel !== link.dataset.explorePreview;
    });
  };
  exploreLinks.forEach(link => {
    link.addEventListener('pointerenter', () => showPreview(link));
    link.addEventListener('focus', () => showPreview(link));
  });

  document.querySelectorAll('[data-copy-study]').forEach(button => {
    let reset;
    button.addEventListener('click', async () => {
      const url = new URL(button.dataset.copyStudy, location.href).href;
      const status = button.nextElementSibling;
      try {
        await navigator.clipboard.writeText(url);
        status.textContent = 'Project link copied.';
      } catch {
        status.textContent = `Share this link: ${url}`;
      }
      clearTimeout(reset);
      reset = setTimeout(() => { status.textContent = ''; }, 7000);
    });
  });

  // Keep the dock clear of a mobile keyboard without hiding contact controls.
  const viewport = window.visualViewport;
  const updateKeyboard = () => {
    const editing = document.activeElement?.matches('input,textarea,select');
    document.body.classList.toggle('keyboard-open', Boolean(editing && viewport && innerHeight - viewport.height > 120));
  };
  viewport?.addEventListener('resize', updateKeyboard, { passive: true });
  document.addEventListener('focusin', updateKeyboard);
  document.addEventListener('focusout', () => requestAnimationFrame(updateKeyboard));

  const demo = document.querySelector('#demo-dialog');
  const tabs = [...demo.querySelectorAll('[data-demo-step]')];
  const panels = [...demo.querySelectorAll('[data-demo-panel]')];
  const playback = demo.querySelector('#demo-play');
  const progress = demo.querySelector('#demo-progress');
  const progressLabel = demo.querySelector('#demo-progress-label');
  let step = 0;
  let frame = 0;
  let playing = false;
  let elapsed = 0;
  let lastTick = 0;
  const stageDuration = 8000;

  const renderProgress = () => {
    progress.style.transform = `scaleX(${elapsed / (stageDuration * 3)})`;
    progressLabel.textContent = `${Math.floor(elapsed / 1000)} / 24 sec`;
  };
  const renderStep = index => {
    step = index;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
  };
  const pause = () => {
    playing = false;
    cancelAnimationFrame(frame);
    frame = 0;
    lastTick = 0;
    playback.setAttribute('aria-pressed', 'false');
    playback.textContent = elapsed >= stageDuration * 3 ? 'Replay walkthrough' : 'Play walkthrough';
  };
  const tick = now => {
    if (!playing) return;
    if (lastTick) elapsed = Math.min(stageDuration * 3, elapsed + Math.min(now - lastTick, 100));
    lastTick = now;
    const next = Math.min(2, Math.floor(elapsed / stageDuration));
    if (next !== step) renderStep(next);
    renderProgress();
    if (elapsed >= stageDuration * 3) pause();
    else frame = requestAnimationFrame(tick);
  };
  const pickStep = index => {
    pause();
    elapsed = index * stageDuration;
    renderStep(index);
    renderProgress();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => pickStep(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      pickStep(next);
      tabs[next].focus();
    });
  });
  playback.addEventListener('click', () => {
    if (playing) { pause(); return; }
    if (reducedMotion.matches) return;
    if (elapsed >= stageDuration * 3) { elapsed = 0; renderStep(0); }
    playing = true;
    playback.textContent = 'Pause walkthrough';
    playback.setAttribute('aria-pressed', 'true');
    frame = requestAnimationFrame(tick);
  });
  const configureMotion = () => {
    pause();
    playback.disabled = reducedMotion.matches;
    if (reducedMotion.matches) playback.textContent = 'Explore steps manually';
  };
  reducedMotion.addEventListener('change', configureMotion);
  demo.addEventListener('close', pause);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  configureMotion();

  const examples = [
    { nums: [2, 7, 11, 15], target: 9 },
    { nums: [3, 3], target: 6 },
    { nums: [1, 2, 3], target: 10 }
  ];
  const findPair = (nums, target) => {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
      const complement = target - nums[i];
      if (seen.has(complement)) return [seen.get(complement), i];
      seen.set(nums[i], i);
    }
    return [];
  };
  demo.querySelectorAll('[data-demo-example]').forEach(button => {
    button.addEventListener('click', () => {
      pause();
      const example = examples[Number(button.dataset.demoExample)];
      const answer = findPair(example.nums, example.target);
      demo.querySelectorAll('[data-demo-example]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      demo.querySelector('#demo-example-input').textContent = `nums = [${example.nums.join(', ')}], target = ${example.target}`;
      demo.querySelector('#demo-example-result').textContent = answer.length ? `Indices [${answer.join(', ')}] → ${example.nums[answer[0]]} + ${example.nums[answer[1]]} = ${example.target}` : '[] → No matching pair';
    });
  });
})();
