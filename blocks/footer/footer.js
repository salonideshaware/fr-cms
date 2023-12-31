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
    copyright.innerHTML = '<div class="footer-section"><div class="footer-blk"><div class="sec1 semibold"><a href="https://www.bdo.com.ph/terms-and-conditions/">Terms and Conditions</a></div><div class="sec2 semibold"><a href="https://www.bdo.com.ph/privacy-statement">Privacy Statement</a></div><div class="sec3 semibold"><a href="https://www.bdo.com.ph/site-map">Site Map</a></div></div><hr class="separator"><div class="footer-blk2">The BDO, BDO Unibank and other BDO-related trademarks are owned by BDO Unibank, Inc. All Rights Reserved.</div></div>';
    decorateIcons(copyright);
    block.append(copyright);
  }
}
