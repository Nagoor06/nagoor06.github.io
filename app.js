'use strict';

(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    mobileNav.hidden = true;
  };
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    mobileNav.hidden = expanded;
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.matchMedia('(min-width: 561px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  document.querySelector('#year').textContent = String(new Date().getFullYear());
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-enabled');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  }
  const progress = document.querySelector('.scroll-progress');
  let scrollQueued = false;
  const updateProgress = () => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${height > 0 ? Math.min(100, window.scrollY / height * 100) : 0}%`;
    scrollQueued = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; window.requestAnimationFrame(updateProgress); }
  }, { passive: true });
  updateProgress();

  const sampleContent = {
    review: { label: 'A CLEARER WAY FORWARD', text: 'The nested loop checks every pair. A lookup map can find each complement in one pass.', before: 'O(n²)', after: 'O(n)', note: 'with a hash map' },
    hint: { label: 'ONE HINT AT A TIME', text: 'For each number, the value you need is target − number. Could you remember the numbers you have already seen?', before: 'pair scan', after: 'lookup', note: 'store value → index' },
    complexity: { label: 'UNDERSTAND THE TRADE-OFF', text: 'The current approach uses O(n²) time and O(1) extra space. A hash map trades O(n) space for expected O(n) time.', before: 'O(1)', after: 'O(n)', note: 'extra space for speed' }
  };
  const reviewTabs = [...document.querySelectorAll('[data-review]')];
  const selectReview = button => {
    const sample = sampleContent[button.dataset.review];
    reviewTabs.forEach(tab => { const selected = tab === button; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; });
    document.querySelector('#sample-panel').setAttribute('aria-labelledby', button.id);
    document.querySelector('#output-label').textContent = sample.label;
    document.querySelector('#sample-output').textContent = sample.text;
    document.querySelector('.complexity-before').textContent = sample.before;
    document.querySelector('.complexity-after').textContent = sample.after;
    document.querySelector('#code-insight small').textContent = sample.note;
  };
  reviewTabs.forEach((button, index) => {
    button.addEventListener('click', () => selectReview(button));
    button.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % reviewTabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + reviewTabs.length) % reviewTabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = reviewTabs.length - 1;
      else return;
      event.preventDefault(); selectReview(reviewTabs[next]); reviewTabs[next].focus();
    });
  });

  document.querySelectorAll('[data-map]').forEach(button => button.addEventListener('click', () => {
    const privacy = button.dataset.map === 'privacy';
    document.querySelectorAll('[data-map]').forEach(item => { const selected = item === button; item.classList.toggle('is-active', selected); item.setAttribute('aria-pressed', String(selected)); });
    document.querySelector('#commute-map').classList.toggle('is-private', privacy);
    const label = document.querySelector('#map-label');
    label.firstChild.textContent = privacy ? 'A pickup, not a home address.' : 'Meet along the way.';
    document.querySelector('#map-label-detail').textContent = privacy ? 'Public meeting points · design exploration' : 'A shared route. A nearby pickup.';
  }));

  // Keep the native mail app flow on mobile; open Gmail compose on desktop browsers.
  const commuteContactLink = document.querySelector('.commute-contact-link');
  if (commuteContactLink && window.matchMedia('(max-width: 560px)').matches) {
    commuteContactLink.href = commuteContactLink.dataset.mobileMailto;
    commuteContactLink.removeAttribute('target');
    commuteContactLink.removeAttribute('rel');
  }

  let dialogTrigger = null;
  document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.open);
    dialogTrigger = button;
    dialog.showModal();
    document.body.classList.add('modal-open');
  }));
  document.querySelectorAll('.case-dialog').forEach(dialog => {
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
    dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); if (dialogTrigger) dialogTrigger.focus({ preventScroll: true }); });
  });

  let copyTimer;
  document.querySelector('#copy-email').addEventListener('click', async () => {
    const email = 'veeraboinanagoor@gmail.com';
    const status = document.querySelector('#copy-status');
    const label = document.querySelector('#copy-label');
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(email);
      label.textContent = 'Copied!'; status.textContent = 'Email address copied to clipboard.';
    } catch {
      label.textContent = 'Select email';
      const range = document.createRange(); range.selectNodeContents(document.querySelector('.contact-email'));
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
      status.textContent = 'Email selected. Use your device’s copy command.';
    }
    window.clearTimeout(copyTimer);
    copyTimer = window.setTimeout(() => { label.textContent = 'Copy email'; status.textContent = ''; }, 4000);
  });

  // Lightweight, procedural artwork: all motion stays local to the browser.
  const canvas = document.querySelector('#intelligence-orb');
  const context = canvas.getContext('2d');
  let width = 500, height = 450, radius = 158, stage = 0, frame = 0, active = true, elapsed = 0;
  const stageColors = [[205,237,164],[152,213,194],[212,244,154]];
  const captions = ['Retrieve relevant context.', 'Connect the context. Reason through it.', 'Turn the result into a useful experience.'];
  const stageButtons = document.querySelectorAll('[data-stage]');
  stageButtons.forEach(button => button.addEventListener('click', () => {
    stage = Number(button.dataset.stage);
    stageButtons.forEach(item => { const selected = item === button; item.classList.toggle('is-active', selected); item.setAttribute('aria-pressed', String(selected)); });
    document.querySelector('#workflow-caption').textContent = captions[stage];
    document.querySelector('#visual-index').textContent = `0${stage + 1} / 03`;
    if (reducedMotion.matches) draw(elapsed);
  }));
  const sizeCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    width = rect.width; height = rect.height; radius = Math.min(width * .33, height * .39);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(elapsed);
  };
  const project = (x, y, z, angle) => {
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const xx = x * cos + z * sin, zz = -x * sin + z * cos;
    const yy = y * .92 - zz * .39, depth = y * .39 + zz * .92;
    const scale = 650 / (650 + depth);
    return [width / 2 + xx * scale, height / 2 + yy * scale, depth, scale];
  };
  const color = opacity => `rgba(${stageColors[stage].join(',')},${opacity})`;
  function draw(time) {
    if (!context || !width) return;
    context.clearRect(0, 0, width, height);
    const angle = time * .00009 + .38;
    const glow = context.createRadialGradient(width / 2, height / 2, radius * .2, width / 2, height / 2, radius * 1.45);
    glow.addColorStop(0,color(.025));glow.addColorStop(.6,color(.045));glow.addColorStop(1,color(0));
    context.fillStyle = glow;context.fillRect(0,0,width,height);
    for (let lat = -6; lat <= 6; lat++) {
      const phi = lat * Math.PI / 15;
      context.beginPath();
      for (let j = 0; j <= 100; j++) {
        const theta = j * Math.PI * 2 / 100;
        const p = project(radius*Math.cos(phi)*Math.cos(theta), radius*Math.sin(phi),radius*Math.cos(phi)*Math.sin(theta),angle);
        if(j === 0)context.moveTo(p[0],p[1]);else context.lineTo(p[0],p[1]);
      }
      context.lineWidth = .6;context.strokeStyle = color(.15);context.stroke();
    }
    for (let lon = 0; lon < 20; lon++) {
      const theta = lon * Math.PI / 10;
      context.beginPath();
      for (let j = 0; j <= 70; j++) {
        const phi = j * Math.PI / 70;
        const p = project(radius*Math.sin(phi)*Math.cos(theta),radius*Math.cos(phi),radius*Math.sin(phi)*Math.sin(theta),angle);
        if(j===0)context.moveTo(p[0],p[1]);else context.lineTo(p[0],p[1]);
      }
      context.strokeStyle=color(.13);context.lineWidth=.6;context.stroke();
    }
    for(let orbit=0;orbit<3;orbit++){
      const orbitRadius=radius*(1.16+orbit*.08); const tilt=.35+orbit*.68;
      context.beginPath();
      for(let j=0;j<=120;j++){
        const theta=j*Math.PI*2/120;
        const p=project(orbitRadius*Math.cos(theta),orbitRadius*Math.sin(theta)*Math.sin(tilt),orbitRadius*Math.sin(theta)*Math.cos(tilt),angle+orbit*.6);
        if(j===0)context.moveTo(p[0],p[1]);else context.lineTo(p[0],p[1]);
      }
      context.strokeStyle=color(orbit===stage?.38:.11);context.lineWidth=orbit===stage?1:.65;context.stroke();
      const t=time*.00025*(orbit%2?-1:1)+orbit*2;
      const p=project(orbitRadius*Math.cos(t),orbitRadius*Math.sin(t)*Math.sin(tilt),orbitRadius*Math.sin(t)*Math.cos(tilt),angle+orbit*.6);
      context.beginPath();context.arc(p[0],p[1],orbit===stage?3.3:2.1,0,Math.PI*2);context.fillStyle=color(.9);context.fill();
      if(orbit===stage){context.beginPath();context.arc(p[0],p[1],7,0,Math.PI*2);context.strokeStyle=color(.22);context.stroke();}
    }
    for(let i=0;i<68;i++){
      const theta=i*2.39996323, yy=1-(i/67)*2, rr=Math.sqrt(1-yy*yy);
      const p=project(radius*rr*Math.cos(theta),radius*yy,radius*rr*Math.sin(theta),angle);
      const alpha=Math.max(.13,Math.min(.85,.48-p[2]/radius*.3));
      context.beginPath();context.arc(p[0],p[1],i%9===stage?2.4:1.1,0,Math.PI*2);context.fillStyle=color(alpha);context.fill();
    }
  }
  const animate = time => { elapsed = time; draw(time); if(active&&!reducedMotion.matches)frame=window.requestAnimationFrame(animate); };
  const startAnimation = () => { window.cancelAnimationFrame(frame); if(active&&!reducedMotion.matches)frame=window.requestAnimationFrame(animate);else draw(elapsed); };
  if(context){
    new ResizeObserver(sizeCanvas).observe(canvas);
    if('IntersectionObserver' in window)new IntersectionObserver(entries=>{active=entries[0].isIntersecting&&!document.hidden;startAnimation();},{threshold:0}).observe(canvas);
    document.addEventListener('visibilitychange',()=>{active=!document.hidden;startAnimation();});
    reducedMotion.addEventListener('change',startAnimation);sizeCanvas();startAnimation();
  }


  // Creative hover physics: pointer spotlight + restrained 3D tilt on project cards.
  // Disabled on touch devices and when reduced motion is requested.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (finePointer.matches && !reducedMotion.matches) {
    document.querySelectorAll('.project').forEach(card => {
      let bounds;
      const move = event => {
        bounds = bounds || card.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        const px = x / bounds.width;
        const py = y / bounds.height;
        card.style.setProperty('--spot-x', `${Math.round(px * 100)}%`);
        card.style.setProperty('--spot-y', `${Math.round(py * 100)}%`);
        const tiltY = (px - .5) * 2.2;
        const tiltX = (.5 - py) * 1.7;
        card.style.transform = `perspective(1100px) translateY(-5px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      };
      card.addEventListener('pointerenter', () => { bounds = card.getBoundingClientRect(); });
      card.addEventListener('pointermove', move);
      card.addEventListener('pointerleave', () => {
        bounds = null;
        card.style.transform = '';
        card.style.removeProperty('--spot-x');
        card.style.removeProperty('--spot-y');
      });
    });
  }

})();
