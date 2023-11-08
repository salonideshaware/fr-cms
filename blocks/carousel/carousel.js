import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';

async function insertGallerySlides(block) {
  const damPrefix = 'https://www.pgatour.com';
  const config = readBlockConfig(block);
  const galleryURL = config.source;
  const limit = config.limit || 12;
  block.innerHTML = '';

  const directURL = `${galleryURL}&size=${limit}`;
  const resp = await fetch(`https://little-forest-58aa.david8603.workers.dev/?url=${encodeURIComponent(directURL)}`);
  const json = await resp.json();

  json.items.forEach((photo) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="gallery-image"><picture><img src="${damPrefix}${photo.image}" alt="${photo.description}"/ ></picture></div>
      <div class="gallery-text">
        <p class="gallery-text-title">Photo Gallery${config.title ? `: ${config.title}` : ''}</p>
        ${photo.description ? `<p class="gallery-text-desc">${photo.description}</p>` : ''}
        ${photo.credit ? `<p class="gallery-text-credit">Photo by <strong>${photo.credit}</strong></p>` : ''}
      </div>
    `;
    block.append(div);
  });
}

export default async function decorate(block) {
  const blockClasses = [...block.classList];
  const buttons = document.createElement('div');
  buttons.className = 'carousel-buttons';
  if (blockClasses.includes('course')) buttons.classList.add('course-buttons');
  /* gallery carousel */
  if (blockClasses.includes('gallery')) {
    buttons.classList.add('gallery-buttons');
    block.closest('.carousel-container').classList.add('gallery-container');
    await insertGallerySlides(block);
  }
  [...block.children].forEach((row, i) => {
    const classes = ['image', 'text'];
    classes.forEach((e, j) => {
      if (row.children[j]) row.children[j].classList.add(`carousel-${e}`);
    });
    /* buttons */
    const button = document.createElement('button');
    if (!i) button.classList.add('selected');
    button.onclick = () => {
      block.scrollTo({ top: 0, left: row.offsetLeft - row.parentNode.offsetLeft, behavior: 'smooth' });
      [...buttons.children].forEach((r) => r.classList.remove('selected'));
      button.classList.add('selected');
    };
    buttons.append(button);
  });
  block.parentElement.prepend(buttons);

  const nav = document.createElement('div');
  nav.className = 'carousel-nav';

  const next = document.createElement('button');
  next.innerHTML = '<span class="icon icon-arrow"/>';
  next.className = 'carousel-next';
  next.onclick = () => {
    let current = buttons.querySelector('.selected') || buttons.firstElementChild;
    if (current === buttons.lastElementChild) {
      current = buttons.firstElementChild;
    } else {
      current = current.nextElementSibling;
    }
    current.click();
  };

  const prev = next.cloneNode(true);
  prev.className = 'carousel-prev';
  prev.onclick = () => {
    let current = buttons.querySelector('.selected') || buttons.firstElementChild;
    if (current === buttons.firstElementChild) {
      current = buttons.lastElementChild;
    } else {
      current = current.previousElementSibling;
    }
    current.click();
  };
  nav.append(prev, next);
  block.parentElement.prepend(nav);
  decorateIcons(nav);

  if (!blockClasses.includes('course') && !blockClasses.includes('gallery')) {
    const carouselTextItems = block.querySelectorAll('.carousel-text');

    carouselTextItems.forEach((textEl, i) => {
      const buttonsClone = buttons.cloneNode(true);
      buttonsClone.querySelectorAll('button').forEach((button, k) => {
        button.classList.remove('selected');
        button.onclick = buttons.querySelector(`button:nth-child(${k + 1})`).onclick;
      });
      buttonsClone.querySelector(`button:nth-child(${i + 1})`).classList.add('selected');

      textEl.append(buttonsClone);
    });

    const truncateDescription = () => {
      carouselTextItems.forEach((textEl) => {
        const descriptionEl = textEl.querySelector('p:nth-child(3)');
        descriptionEl.classList.toggle('is-truncated', textEl.clientHeight > block.clientHeight);
      });
    };

    requestAnimationFrame(truncateDescription);
    window.addEventListener('resize', truncateDescription);
  }
}