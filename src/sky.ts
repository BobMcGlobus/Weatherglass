import { html, svg, nothing } from 'lit';
import type { TemplateResult } from 'lit';

export interface SkyOpts {
  /** Home Assistant condition string (sunny, rainy, snowy, …) */
  condition?: string;
  /** daytime vs night — fallback when no elevation is available */
  isDay: boolean;
  /** sun elevation in degrees (sun.sun attribute) — drives sky colors & sun position */
  elevation?: number;
  /** 0..1 — stronger wind drifts the clouds faster and slants the rain */
  wind: number;
  /** 0..1 — background warning/alert glow intensity */
  glow: number;
  /** CSS color for the warning glow */
  glowColor: string;
}

/* ---- color helpers -------------------------------------------------------- */

type RGB = [number, number, number];

function hex(c: string): RGB {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hex(a);
  const [r2, g2, b2] = hex(b);
  const q = Math.max(0, Math.min(t, 1));
  const r = Math.round(r1 + (r2 - r1) * q);
  const g = Math.round(g1 + (g2 - g1) * q);
  const bl = Math.round(b1 + (b2 - b1) * q);
  return `rgb(${r},${g},${bl})`;
}

function mix3(a: string[], b: string[], t: number): string[] {
  return a.map((c, i) => mix(c, b[i], t));
}

/* [top, mid, bottom] sky palettes along the day cycle */
const NIGHT = ['#060b22', '#141f45', '#28406e'];
const TWILIGHT = ['#2c2a5e', '#84487c', '#f0925c'];
const GOLDEN = ['#3a76c4', '#7fb2e2', '#ffd08c'];
const DAY = ['#3c86dd', '#7cb8ee', '#d2ecff'];
const GREY_DAY = ['#67788c', '#90a2b2', '#c5cfd9'];
const STORM_DAY = ['#414c5c', '#5f6c7c', '#8d99a6'];
const GREY_NIGHT = ['#10151f', '#1f2a3a', '#354356'];

interface Scene {
  sky: string[];
  hillBack: string;
  hillFront: string;
  tree: string;
  cloudFill: string;
  cloudOpacity: number;
  isNight: boolean;
  sunY: number;
  showSun: boolean;
  showRays: boolean;
  sunColor: string;
  showMoon: boolean;
  clouds: number;
  rain: 0 | 1 | 2;
  snow: boolean;
  lightning: boolean;
  fog: boolean;
  stars: boolean;
  windy: boolean;
}

function derive(o: SkyOpts): Scene {
  const c = o.condition ?? (o.isDay ? 'partlycloudy' : 'clear-night');
  const stormy = ['pouring', 'lightning', 'lightning-rainy', 'hail'].includes(c);
  const rainySoft = ['rainy', 'snowy', 'snowy-rainy'].includes(c);
  const overcast = ['cloudy', 'fog', 'exceptional'].includes(c) || stormy || rainySoft;
  const gloom = stormy ? 0.85 : rainySoft ? 0.68 : overcast ? 0.55 : c === 'partlycloudy' ? 0.14 : 0;

  // base palette from the sun elevation (twilight ramps included)
  const e = o.elevation ?? (o.isDay ? 40 : -20);
  let base: string[];
  if (e <= -8) base = NIGHT;
  else if (e <= 2) base = mix3(NIGHT, TWILIGHT, (e + 8) / 10);
  else if (e <= 14) base = mix3(TWILIGHT, GOLDEN, (e - 2) / 12);
  else if (e <= 35) base = mix3(GOLDEN, DAY, (e - 14) / 21);
  else base = DAY;
  const isNight = e <= -4;
  const greyTarget = isNight ? GREY_NIGHT : stormy ? STORM_DAY : GREY_DAY;
  const sky = mix3(base, greyTarget, gloom);

  const groundBase = sky[2];
  const hillBack = mix(mixToHex(groundBase), '#0a0f18', isNight ? 0.72 : 0.4);
  const hillFront = mix(mixToHex(groundBase), '#0a0f18', isNight ? 0.84 : 0.56);
  const tree = mix(mixToHex(groundBase), '#060a12', isNight ? 0.9 : 0.68);

  const cloudFill = isNight
    ? mix('#93a3c0', '#55627a', gloom)
    : mix('#ffffff', '#a9b6c4', gloom);

  const clouds =
    c === 'sunny' || c === 'clear-night'
      ? 0
      : c === 'partlycloudy' || c === 'windy' || c === 'windy-variant'
        ? 2
        : stormy || rainySoft
          ? 4
          : 3;

  return {
    sky,
    hillBack,
    hillFront,
    tree,
    cloudFill,
    cloudOpacity: isNight ? 0.75 : 0.94,
    isNight,
    sunY: e <= 0 ? 150 : 150 - (Math.min(e, 55) / 55) * 112,
    showSun: !isNight && e > -3 && clouds < 3,
    showRays: gloom < 0.3 && e > 8,
    sunColor: e < 15 ? '#ffb347' : '#ffdf5e',
    showMoon: isNight && clouds < 3,
    clouds,
    rain: c === 'pouring' || c === 'lightning-rainy' ? 2 : c === 'rainy' || c === 'snowy-rainy' || c === 'hail' ? 1 : 0,
    snow: c === 'snowy' || c === 'snowy-rainy' || c === 'hail',
    lightning: c === 'lightning' || c === 'lightning-rainy',
    fog: c === 'fog',
    stars: isNight && gloom < 0.4,
    windy: c === 'windy' || c === 'windy-variant' || o.wind > 0.55,
  };
}

/** rgb(...) → #hex so mix() can chew on derived colors */
function mixToHex(rgb: string): string {
  const m = /rgb\((\d+),(\d+),(\d+)\)/.exec(rgb.replace(/\s/g, ''));
  if (!m) return rgb;
  const to2 = (x: string) => (+x).toString(16).padStart(2, '0');
  return `#${to2(m[1])}${to2(m[2])}${to2(m[3])}`;
}

/* ---- scene pieces --------------------------------------------------------- */

function puffCloud(fill: string, opacity: number) {
  return svg`<g fill=${fill} opacity=${opacity}>
    <ellipse cx="0" cy="0" rx="27" ry="16"/>
    <ellipse cx="21" cy="4" rx="22" ry="13"/>
    <ellipse cx="-21" cy="5" rx="20" ry="12"/>
    <ellipse cx="2" cy="9" rx="31" ry="11"/>
  </g>`;
}

/** One drifting cloud on its own lane (negative delay staggers the phase). */
function cloud(
  fill: string,
  opacity: number,
  y: number,
  scale: number,
  dur: number,
  delay: number,
  blurred = false
) {
  return svg`<g transform="translate(0 ${y})">
    <g class="cloud" style="animation-duration:${dur}s;animation-delay:${delay}s"
       filter=${blurred ? 'url(#wc-blur-far)' : nothing}>
      <g transform="scale(${scale})">${puffCloud(fill, opacity)}</g>
    </g>
  </g>`;
}

const TREES: Array<[number, number, number]> = [
  // x, ground y, scale
  [52, 172, 1],
  [64, 174, 0.75],
  [226, 168, 1.1],
  [243, 171, 0.8],
];

/**
 * Animated weather scene — the visual centrepiece of the card. Everything is
 * derived from live state: the sky gradient follows the real sun elevation
 * (night → twilight → golden hour → day) and darkens with the condition, the
 * sun rises and sets at its true height, clouds drift on three parallax lanes
 * at wind speed, rain slants with the wind (with ground splashes when
 * pouring), snow sways down, lightning flashes the whole scene, fog banks
 * drift, stars twinkle (with the occasional shooting star) and birds cross a
 * clear sky. A layered hill silhouette grounds the scene; a pulsing vignette
 * warns when a `score_entity` reports trouble. Self-contained SVG + CSS.
 */
export function skyScene(o: SkyOpts): TemplateResult {
  const sc = derive(o);
  const drift = 1 + o.wind * 1.6;
  const rainSlant = 3 + o.wind * 9;

  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return svg`<line x1=${Math.cos(a) * 21} y1=${Math.sin(a) * 21}
      x2=${Math.cos(a) * 31} y2=${Math.sin(a) * 31} stroke="#ffe08a"
      stroke-width="3" stroke-linecap="round"/>`;
  });

  const stars = sc.stars
    ? Array.from({ length: 26 }, (_, i) => {
        const x = 10 + ((i * 61) % 280);
        const y = 8 + ((i * 37) % 92);
        const r = 0.6 + ((i * 13) % 10) / 9;
        return svg`<circle class="star" cx=${x} cy=${y} r=${r} fill="#fff"
          style="animation-delay:${(i % 9) * 0.45}s"/>`;
      })
    : [];

  const rainLayer = (n: number, cls: string, w: number, op: number) =>
    Array.from({ length: n }, (_, i) => {
      const x = 14 + ((i * 53) % 272);
      const y = 62 + ((i * 29) % 96);
      return svg`<line class=${cls} x1=${x} y1=${y} x2=${x - rainSlant} y2=${y + 11}
        stroke="#cfe6ff" stroke-width=${w} stroke-linecap="round" opacity=${op}
        style="animation-delay:${(i % 7) * 0.09}s"/>`;
    });
  const rain =
    sc.rain > 0
      ? [
          ...rainLayer(sc.rain === 2 ? 30 : 16, 'rain-back', 1.1, 0.4),
          ...rainLayer(sc.rain === 2 ? 34 : 18, 'rain', 1.7, 0.85),
        ]
      : [];

  const splashes =
    sc.rain === 2
      ? Array.from({ length: 7 }, (_, i) => {
          const x = 28 + ((i * 41) % 246);
          return svg`<ellipse class="splash" cx=${x} cy="181" rx="5" ry="1.6"
            fill="none" stroke="#cfe6ff" stroke-width="1"
            style="animation-delay:${(i % 5) * 0.24}s"/>`;
        })
      : [];

  const snow = sc.snow
    ? Array.from({ length: 32 }, (_, i) => {
        const x = 12 + ((i * 47) % 276);
        const y = 56 + ((i * 31) % 104);
        return svg`<circle class=${i % 2 ? 'snow' : 'snow2'} cx=${x} cy=${y}
          r=${1.3 + (i % 3) * 0.7} fill="#fff" opacity="0.9"
          style="animation-delay:${(i % 8) * 0.4}s;animation-duration:${3.2 + (i % 5) * 0.8}s"/>`;
      })
    : [];

  // three parallax lanes: far (blurred, slow) → mid → near (big, fast)
  const lanes = [
    { y: 30, s: 0.5, dur: 34, blur: true, op: 0.55 },
    { y: 46, s: 0.9, dur: 22, blur: false, op: 0.85 },
    { y: 64, s: 1.25, dur: 15, blur: false, op: 1 },
    { y: 38, s: 0.7, dur: 27, blur: false, op: 0.7 },
  ];
  const clouds = lanes
    .slice(0, sc.clouds)
    .map((l, i) =>
      cloud(sc.cloudFill, sc.cloudOpacity * l.op, l.y, l.s, l.dur / drift, -i * 5.5, l.blur)
    );

  const birds =
    !sc.isNight && sc.clouds <= 2 && !sc.rain && !sc.snow
      ? svg`<g class="birds">
          <path d="M -7 0 Q -3.5 -4.5 0 0 Q 3.5 -4.5 7 0" transform="translate(0 34)"/>
          <path d="M -5 0 Q -2.5 -3.5 0 0 Q 2.5 -3.5 5 0" transform="translate(16 42)"/>
        </g>`
      : nothing;

  return html`<svg
    class="skyscene"
    viewBox="0 0 300 190"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="wc-sky-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color=${sc.sky[0]} />
        <stop offset="55%" stop-color=${sc.sky[1]} />
        <stop offset="100%" stop-color=${sc.sky[2]} />
      </linearGradient>
      <radialGradient id="wc-sun-glow">
        <stop offset="0%" stop-color="#fff3c4" stop-opacity="0.95" />
        <stop offset="55%" stop-color=${sc.sunColor} stop-opacity="0.4" />
        <stop offset="100%" stop-color=${sc.sunColor} stop-opacity="0" />
      </radialGradient>
      <radialGradient id="wc-moon-halo">
        <stop offset="0%" stop-color="#e8edf8" stop-opacity="0.55" />
        <stop offset="100%" stop-color="#e8edf8" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="wc-warn" cx="50%" cy="50%" r="72%">
        <stop offset="55%" stop-color=${o.glowColor} stop-opacity="0" />
        <stop offset="100%" stop-color=${o.glowColor} stop-opacity="0.55" />
      </radialGradient>
      <filter id="wc-blur-far" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="1.6" />
      </filter>
      <filter id="wc-bolt-glow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="3.5" />
      </filter>
    </defs>
    <style>
      .skyscene .cloud { animation-name: wc-drift; animation-timing-function: linear; animation-iteration-count: infinite; }
      @keyframes wc-drift { from { transform: translateX(-85px); } to { transform: translateX(385px); } }
      .skyscene .sunrays { animation: wc-spin 80s linear infinite; }
      @keyframes wc-spin { to { transform: rotate(360deg); } }
      .skyscene .sunglow { animation: wc-breathe 5s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
      @keyframes wc-breathe { 0%,100% { transform: scale(1); opacity: 0.95; } 50% { transform: scale(1.12); opacity: 1; } }
      .skyscene .star { animation: wc-twinkle 3.4s ease-in-out infinite; }
      @keyframes wc-twinkle { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }
      .skyscene .shooting { animation: wc-shoot 13s linear infinite; opacity: 0; }
      @keyframes wc-shoot { 0%,92% { opacity: 0; transform: translate(0,0); } 93% { opacity: 1; } 97% { opacity: 0; transform: translate(-90px,44px); } 100% { opacity: 0; } }
      .skyscene .rain { animation: wc-rain 0.55s linear infinite; }
      .skyscene .rain-back { animation: wc-rain 0.8s linear infinite; }
      @keyframes wc-rain { from { transform: translate(4px,-14px); opacity: 0; } 25% { opacity: 1; } to { transform: translate(-4px,18px); opacity: 0; } }
      .skyscene .splash { animation: wc-splash 1.1s ease-out infinite; transform-origin: center; transform-box: fill-box; }
      @keyframes wc-splash { 0% { transform: scale(0.2); opacity: 0.9; } 70% { transform: scale(1.4); opacity: 0; } 100% { opacity: 0; } }
      .skyscene .snow { animation-name: wc-snow; animation-timing-function: linear; animation-iteration-count: infinite; }
      .skyscene .snow2 { animation-name: wc-snow2; animation-timing-function: linear; animation-iteration-count: infinite; }
      @keyframes wc-snow { 0% { transform: translate(0,-14px); opacity: 0; } 15% { opacity: 1; } 100% { transform: translate(12px,26px); opacity: 0; } }
      @keyframes wc-snow2 { 0% { transform: translate(0,-14px); opacity: 0; } 15% { opacity: 1; } 100% { transform: translate(-10px,26px); opacity: 0; } }
      .skyscene .bolt { animation: wc-bolt 4.5s steps(1) infinite; opacity: 0; }
      @keyframes wc-bolt { 0%,100% { opacity: 0; } 3% { opacity: 1; } 5% { opacity: 0.25; } 6.5% { opacity: 0.95; } 9% { opacity: 0; } }
      .skyscene .flash { animation: wc-flash 4.5s steps(1) infinite; opacity: 0; }
      @keyframes wc-flash { 0%,100% { opacity: 0; } 3% { opacity: 0.32; } 5% { opacity: 0.06; } 6.5% { opacity: 0.26; } 9% { opacity: 0; } }
      .skyscene .fogband { animation: wc-fog 8s ease-in-out infinite alternate; }
      @keyframes wc-fog { from { transform: translateX(-10px); } to { transform: translateX(14px); } }
      .skyscene .gust { stroke-dasharray: 34 90; animation: wc-gust 2.8s linear infinite; }
      @keyframes wc-gust { from { stroke-dashoffset: 124; } to { stroke-dashoffset: 0; } }
      .skyscene .birds { fill: none; stroke: rgba(30,40,55,0.65); stroke-width: 1.4; stroke-linecap: round; animation: wc-birds 36s linear infinite; }
      @keyframes wc-birds { from { transform: translateX(-24px); } to { transform: translateX(330px); } }
      .skyscene .warnglow { animation: wc-warnpulse 2.4s ease-in-out infinite; }
      @keyframes wc-warnpulse { 0%,100% { opacity: 0.55; } 50% { opacity: 1; } }
    </style>

    <rect x="0" y="0" width="300" height="190" fill="url(#wc-sky-grad)" />

    ${stars}
    ${sc.stars
      ? svg`<line class="shooting" x1="238" y1="26" x2="252" y2="19"
          stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`
      : nothing}

    ${sc.showSun
      ? svg`<g transform="translate(208 ${sc.sunY})">
          <circle class="sunglow" r="44" fill="url(#wc-sun-glow)"/>
          ${sc.showRays ? svg`<g class="sunrays">${rays}</g>` : nothing}
          <circle r="16" fill=${sc.sunColor}/>
        </g>`
      : nothing}
    ${sc.showMoon
      ? svg`<g transform="translate(230 42)">
          <circle r="30" fill="url(#wc-moon-halo)"/>
          <circle r="15" fill="#eef1f7"/>
          <circle cx="-6.5" cy="-4" r="13.5" fill=${sc.sky[0]}/>
        </g>`
      : nothing}

    ${birds}
    ${clouds}

    ${sc.windy
      ? svg`<g fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.6" stroke-linecap="round">
          <path class="gust" d="M 20 58 q 40 -12 86 -2 q 30 6 52 -4"/>
          <path class="gust" style="animation-delay:-1.2s" d="M 60 96 q 46 -10 92 0 q 26 5 48 -5"/>
        </g>`
      : nothing}

    <!-- layered landscape -->
    <path d="M 0 162 Q 40 138 85 154 T 170 150 Q 215 142 250 156 T 300 152 L 300 190 L 0 190 Z"
      fill=${sc.hillBack}/>
    <path d="M 0 176 Q 55 158 110 172 T 220 170 Q 260 164 300 174 L 300 190 L 0 190 Z"
      fill=${sc.hillFront}/>
    ${TREES.map(
      ([x, y, s]) => svg`<g transform="translate(${x} ${y}) scale(${s})" fill=${sc.tree}>
        <polygon points="0,-16 6,-4 -6,-4"/>
        <polygon points="0,-10 7.5,3 -7.5,3"/>
        <rect x="-1.2" y="3" width="2.4" height="4" rx="1"/>
      </g>`
    )}

    ${sc.fog
      ? svg`<g fill="rgba(255,255,255,0.5)">
          <rect class="fogband" x="-24" y="112" width="348" height="11" rx="5.5"/>
          <rect class="fogband" style="animation-delay:-2.5s" x="-24" y="134" width="348" height="13" rx="6.5" opacity="0.85"/>
          <rect class="fogband" style="animation-delay:-5s" x="-24" y="158" width="348" height="16" rx="8" opacity="0.7"/>
        </g>`
      : nothing}

    ${rain}
    ${splashes}
    ${snow}

    ${sc.lightning
      ? svg`
        <rect class="flash" x="0" y="0" width="300" height="190" fill="#eaf2ff"/>
        <g class="bolt">
          <polygon points="152,64 139,112 153,112 141,156 178,100 159,100 170,64"
            fill="#fff1a8" filter="url(#wc-bolt-glow)"/>
          <polygon points="152,64 139,112 153,112 141,156 178,100 159,100 170,64"
            fill="#fff8d6" stroke="#ffd83a" stroke-width="1"/>
        </g>`
      : nothing}

    ${o.glow > 0
      ? svg`<rect class="warnglow" x="0" y="0" width="300" height="190"
          fill="url(#wc-warn)" opacity=${Math.min(o.glow, 1)}/>`
      : nothing}
  </svg>`;
}
