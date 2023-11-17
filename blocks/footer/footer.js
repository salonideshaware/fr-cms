import { readBlockConfig, decorateIcons } from '../../scripts/aem.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch footer content
  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();

    // decorate footer DOM
    const footer = document.createElement('div');
    footer.innerHTML = html;

    decorateIcons(footer);
    block.append(footer);
    const copyright = document.createElement('div');
    copyright.setAttribute('id', 'footer-end');
    copyright.setAttribute('class', 'copyright');
    var sec1 = document.createElement("div");
    var sec2 = document.createElement("div");
    var sec3 = document.createElement("div");
    document.getElementById("footer-end").appendChild(sec1);
    document.getElementById("footer-end").appendChild(sec2);
    document.getElementById("footer-end").appendChild(sec3);
    decorateIcons(copyright);
    block.append(copyright);
  }
}
