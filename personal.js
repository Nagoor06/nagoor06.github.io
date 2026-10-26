'use strict';

(() => {
  const track = document.querySelector('#skills-track');
  if (!track) return;
  const cards = [...track.querySelectorAll('.skill-card')];
  const navigation = document.querySelector('.skills-navigation');
  const previous = document.querySelector('#skills-prev');
  const next = document.querySelector('#skills-next');
  const label = document.querySelector('#skills-page');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, queued = false;
  const maxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);
  const positions = () => {
    const start = cards[0].getBoundingClientRect().left;
    return cards.map(card => Math.min(maxScroll(), card.getBoundingClientRect().left - start));
  };
  const update = () => {
    const max = maxScroll();
    navigation.hidden = max < 3;
    track.tabIndex = max < 3 ? -1 : 0;
    const offsets = positions();
    index = track.scrollLeft >= max - 3 && max > 3 ? cards.length - 1 : offsets.reduce((best, offset, i) => Math.abs(offset - track.scrollLeft) < Math.abs(offsets[best] - track.scrollLeft) ? i : best, 0);
    previous.disabled = track.scrollLeft <= 3;
    next.disabled = track.scrollLeft >= max - 3;
    const text = `${index + 1} / ${cards.length}`;
    if (label.textContent !== text) label.textContent = text;
    queued = false;
  };
  const queueUpdate = () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  };
  const move = destination => {
    const target = Math.max(0, Math.min(cards.length - 1, destination));
    track.scrollTo({left: positions()[target], behavior: reducedMotion.matches ? 'instant' : 'smooth'});
  };
  previous.addEventListener('click', () => move(index - 1));
  next.addEventListener('click', () => move(index + 1));
  track.addEventListener('keydown', event => {
    if (event.target !== track || maxScroll() < 3) return;
    let destination;
    if (event.key === 'ArrowLeft') destination = index - 1;
    else if (event.key === 'ArrowRight') destination = index + 1;
    else if (event.key === 'Home') destination = 0;
    else if (event.key === 'End') destination = cards.length - 1;
    else return;
    event.preventDefault();
    move(destination);
  });
  track.addEventListener('scroll', queueUpdate, {passive:true});
  if ('ResizeObserver' in window) new ResizeObserver(queueUpdate).observe(track);
  else window.addEventListener('resize', queueUpdate, {passive:true});
  document.fonts.ready.then(queueUpdate);
  update();
})();
