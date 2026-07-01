/* =========================================
   ÉDUQUER VOS CŒURS — Logos des sections
   Marque commune : cœur formé de deux silhouettes
   tenant un livre ouvert, surmonté d'un pictogramme
   propre à chaque section (couleur = SECTIONS_DATA.color)
   ========================================= */

const SECTION_LOGO_TOPPERS = {
  communication: `
    <g transform="translate(60,4)">
      <path d="M-15,-5 q0,-11 13,-11 h4 q13,0 13,11 q0,11 -13,11 h-2.5 l-6,7 l-1,-7 h-0.5 q-13,0 -13,-11 z" fill="{c}"/>
      <circle cx="-6.5" cy="-5" r="1.7" fill="#fff"/>
      <circle cx="0" cy="-5" r="1.7" fill="#fff"/>
      <circle cx="6.5" cy="-5" r="1.7" fill="#fff"/>
    </g>`,
  santeMentale: `
    <g transform="translate(60,2)" fill="{c}">
      <path d="M0,-13 L3.2,-3.2 L13,0 L3.2,3.2 L0,13 L-3.2,3.2 L-13,0 L-3.2,-3.2 Z"/>
      <circle cx="15" cy="-9" r="2.4"/>
    </g>`,
  don: `
    <g transform="translate(60,3)">
      <path d="M0,13 C-15,3 -15,-9 -5,-9 C-1.5,-9 0,-6 0,-6 C0,-6 1.5,-9 5,-9 C15,-9 15,3 0,13 Z" fill="{c}"/>
    </g>`,
  finance: `
    <g transform="translate(58,1)">
      <circle cx="-6" cy="0" r="9.5" fill="{c}" stroke="#fff" stroke-width="1.6"/>
      <circle cx="8" cy="-7" r="9.5" fill="{c}" stroke="#fff" stroke-width="1.6"/>
      <text x="8" y="-3.2" font-size="10" font-weight="900" fill="#fff" text-anchor="middle" font-family="Arial,sans-serif">€</text>
    </g>`,
  benevolat: `
    <g transform="translate(60,1)" fill="{c}">
      <circle cx="0" cy="-7" r="6.2"/>
      <circle cx="-12" cy="2" r="5.2"/>
      <circle cx="12" cy="2" r="5.2"/>
    </g>`,
  evenementiel: `
    <g transform="translate(60,3)" fill="{c}">
      <path d="M0,-13 L3.8,-4.4 L13,-3.2 L6,3 L7.6,12 L0,7.2 L-7.6,12 L-6,3 L-13,-3.2 L-3.8,-4.4 Z"/>
    </g>`,
  formation: `
    <g transform="translate(60,3)">
      <path d="M-17,-3 L0,-10 L17,-3 L0,4 Z" fill="{c}"/>
      <path d="M-9,0 L-9,8 C-9,11.5 9,11.5 9,8 L9,0" fill="none" stroke="{c}" stroke-width="2.6"/>
      <line x1="15" y1="-3" x2="15" y2="8" stroke="{c}" stroke-width="2.2"/>
      <circle cx="15" cy="9.5" r="1.9" fill="{c}"/>
    </g>`,
};

function sectionLogoSVG(key, color, size = 56) {
  const topperTpl = SECTION_LOGO_TOPPERS[key] || "";
  const topper = topperTpl.split("{c}").join(color);
  return `
  <svg viewBox="0 0 120 134" width="${size}" height="${size}" class="section-logo" aria-hidden="true">
    <path d="M60,120 C18,90 6,63 6,43 C6,24 21,10 39,10 C50,10 58,16 60,20 C62,16 70,10 81,10 C99,10 114,24 114,43 C114,63 102,90 60,120 Z"
          fill="none" stroke="#1B2A6B" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="39" cy="27" r="10" fill="#1B2A6B"/>
    <circle cx="81" cy="27" r="10" fill="#1B2A6B"/>
    <g fill="#2E9E6E">
      <path d="M60,53 L60,93 L36,85 C32,83 30,80 30,76 L30,56 C30,52 34,50 38,51 L60,53 Z"/>
      <path d="M60,53 L60,93 L84,85 C88,83 90,80 90,76 L90,56 C90,52 86,50 82,51 L60,53 Z"/>
    </g>
    <path d="M60,51 L60,93" stroke="#0d1b2a" stroke-width="1.4" opacity="0.35"/>
    <path d="M33,81 C26,87 23,94 27,101" fill="none" stroke="#1B2A6B" stroke-width="6" stroke-linecap="round"/>
    <path d="M87,81 C94,87 97,94 93,101" fill="none" stroke="#1B2A6B" stroke-width="6" stroke-linecap="round"/>
    ${topper}
  </svg>`;
}
