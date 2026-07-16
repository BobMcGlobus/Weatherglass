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
  const to2 = (x: number) => x.toString(16).padStart(2, '0');
  return `#${to2(r)}${to2(g)}${to2(bl)}`;
}

function mix3(a: string[], b: string[], t: number): string[] {
  return a.map((c, i) => mix(c, b[i], t));
}

/* [top, mid, bottom] sky palettes along the day cycle */
const NIGHT = ['#050a20', '#101c40', '#2a4270'];
const TWILIGHT = ['#292a5e', '#8c4a7c', '#ff9d5e'];
const GOLDEN = ['#3572bf', '#7fb2e2', '#ffd994'.slice(0, 7)];
const DAY = ['#2f80dc', '#79b7ee', '#d4edff'];
const GREY_DAY = ['#64758a', '#8fa1b1', '#c4ced8'];
const STORM_DAY = ['#3d4857', '#5c6976', '#8a96a3'];
const GREY_NIGHT = ['#0e131d', '#1e2938', '#344254'];

interface Scene {
  sky: string[];
  ridgeFar: string;
  hillBack: string;
  hillFront: string;
  tree: string;
  cloudFill: string;
  cloudShade: string;
  cloudLight: string;
  cloudOpacity: number;
  isNight: boolean;
  sunY: number;
  sunR: number;
  showSun: boolean;
  showRays: boolean;
  sunColor: string;
  /** sunrise/sunset horizon glow strength 0..1 and its warm color */
  horizon: number;
  horizonColor: string;
  /** rim light on the hill crests (golden hour) */
  rim: number;
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

  // sunrise/sunset glow peaks with the sun at the horizon, killed by gloom
  const horizon = Math.max(0, 1 - Math.abs(e - 1) / 13) * (1 - gloom * 0.8);
  const horizonColor = e <= 2 ? '#ff7d4a' : mix('#ff9d5c', '#ffd28a', Math.min((e - 2) / 12, 1));

  // lush green meadows in fair weather — dulled by gloom, snow-covered when
  // it snows, washed warm at golden hour, darkening into silhouettes at night
  const snowGround = c === 'snowy' || c === 'snowy-rainy' || c === 'hail';
  const nightF = e >= 10 ? 0 : e <= -8 ? 1 : (10 - e) / 18;
  let backBase = snowGround ? '#dfe7f0' : mix('#69a86b', '#7c8794', gloom * 0.5);
  let frontBase = snowGround ? '#cdd8e4' : mix('#4a8a54', '#5c6875', gloom * 0.5);
  backBase = mix(backBase, horizonColor, horizon * 0.18);
  frontBase = mix(frontBase, horizonColor, horizon * 0.12);
  // atmospheric perspective: the farther the ridge, the closer to the sky
  const ridgeFar = mix(mix(backBase, sky[1], 0.62), '#0b1220', nightF * 0.6);
  const hillBack = mix(mix(backBase, sky[2], 0.26), '#0b1220', nightF * 0.75);
  const hillFront = mix(mix(frontBase, sky[2], 0.1), '#080d18', nightF * 0.85);
  const tree = mix(snowGround ? '#2a4d36' : '#2f5f3a', '#050a10', nightF * 0.85 + gloom * 0.08);

  const cloudFill = isNight
    ? mix('#93a3c0', '#4f5c74', gloom)
    : mix('#ffffff', '#a9b6c4', gloom);
  // clouds catch the warm light at sunrise/sunset
  const litFill = horizon > 0.15 ? mix(cloudFill, horizonColor, horizon * 0.45) : cloudFill;
  const cloudShade = mix(litFill, isNight ? '#232e44' : '#7e91a6', 0.4);
  const cloudLight = mix(litFill, '#ffffff', isNight ? 0.22 : 0.8);

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
    ridgeFar,
    hillBack,
    hillFront,
    tree,
    cloudFill: litFill,
    cloudShade,
    cloudLight,
    cloudOpacity: isNight ? 0.75 : 0.95,
    isNight,
    sunY: e <= 0 ? 150 + Math.min(-e, 6) * 2 : 150 - (Math.min(e, 55) / 55) * 112,
    // the low sun looms larger
    sunR: 15 + Math.max(0, 14 - Math.min(Math.max(e, 0), 14)) * 0.45,
    showSun: !isNight && e > -3 && clouds < 3,
    showRays: gloom < 0.3 && e > 10,
    sunColor: e <= 2 ? '#ff8a4b' : mix('#ffb347', '#ffdf5e', Math.min((e - 2) / 13, 1)),
    horizon,
    horizonColor,
    rim: horizon * 0.85,
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

/* ---- scene pieces --------------------------------------------------------- */

/** Shaded puff cloud: darker underside, lit body, bright cap. */
function puffCloud(sc: Scene, opacity: number) {
  return svg`<g opacity=${opacity}>
    <g fill=${sc.cloudShade} transform="translate(1 3.5)">
      <ellipse cx="0" cy="0" rx="27" ry="16"/>
      <ellipse cx="21" cy="4" rx="22" ry="13"/>
      <ellipse cx="-21" cy="5" rx="20" ry="12"/>
      <ellipse cx="2" cy="9" rx="31" ry="11"/>
    </g>
    <g fill=${sc.cloudFill}>
      <ellipse cx="0" cy="0" rx="27" ry="16"/>
      <ellipse cx="21" cy="4" rx="22" ry="13"/>
      <ellipse cx="-21" cy="5" rx="20" ry="12"/>
      <ellipse cx="2" cy="9" rx="31" ry="11"/>
    </g>
    <ellipse cx="-5" cy="-8" rx="15" ry="7.5" fill=${sc.cloudLight} opacity="0.75"/>
    <ellipse cx="17" cy="-3" rx="10" ry="5" fill=${sc.cloudLight} opacity="0.5"/>
  </g>`;
}

/** One drifting cloud on its own lane, gently bobbing while it travels. */
function cloud(
  sc: Scene,
  opacity: number,
  y: number,
  scale: number,
  dur: number,
  delay: number,
  bobDur: number,
  blurred = false
) {
  return svg`<g transform="translate(0 ${y})">
    <g class="cloud" style="animation-duration:${dur}s;animation-delay:${delay}s"
       filter=${blurred ? 'url(#wc-blur-far)' : nothing}>
      <g class="cloudbob" style="animation-duration:${bobDur}s">
        <g transform="scale(${scale})">${puffCloud(sc, opacity)}</g>
      </g>
    </g>
  </g>`;
}

/* hill crests as open paths so the golden-hour rim light can stroke them */
const CREST_FAR = 'M 0 152 Q 60 134 120 146 T 240 142 Q 272 138 300 145';
const CREST_BACK = 'M 0 162 Q 40 138 85 154 T 170 150 Q 215 142 250 156 T 300 152';
const CREST_FRONT = 'M 0 176 Q 55 158 110 172 T 220 170 Q 260 164 300 174';
const closeHill = (crest: string) => `${crest} L 300 190 L 0 190 Z`;

const TREES: Array<[number, number, number]> = [
  // x, ground y, scale
  [52, 172, 1],
  [64, 174, 0.75],
  [226, 168, 1.1],
  [243, 171, 0.8],
];

/**
 * Animated weather scene — the visual centrepiece of the card. Everything is
 * derived from live state: the sky gradient follows the real sun elevation,
 * a warm horizon glow blooms at sunrise/sunset (the low sun looms large and
 * sinks visibly behind the hills), hill ridges fade into the sky with
 * atmospheric haze and catch rim light at golden hour, shaded clouds bob
 * along three parallax lanes at wind speed, trees sway in the wind, rain
 * slants with gusts, snow tumbles, lightning flashes the whole scene, stars
 * sparkle at varied rhythms with shooting stars, and birds cross clear skies.
 */
export function skyScene(o: SkyOpts): TemplateResult {
  const sc = derive(o);
  const drift = 1 + o.wind * 1.6;
  const rainSlant = 3 + o.wind * 9;
  const swayDur = (2.6 / (0.35 + o.wind)).toFixed(2);
  const glowX = 208; // sun lane — the horizon glow lingers where the sun sets

  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    const r0 = sc.sunR + 6;
    const r1 = sc.sunR + 15;
    return svg`<line x1=${Math.cos(a) * r0} y1=${Math.sin(a) * r0}
      x2=${Math.cos(a) * r1} y2=${Math.sin(a) * r1} stroke="#ffe08a"
      stroke-width="3" stroke-linecap="round"/>`;
  });

  const stars = sc.stars
    ? Array.from({ length: 30 }, (_, i) => {
        const x = 10 + ((i * 61) % 280);
        const y = 8 + ((i * 37) % 96);
        const dur = `${(2.2 + (i % 5) * 0.8).toFixed(1)}s`;
        const delay = `${((i % 9) * 0.45).toFixed(2)}s`;
        if (i % 6 === 0) {
          // a few bright cross-sparkle stars between the plain ones
          const s = 2.4 + (i % 3);
          return svg`<path class="star" d="M ${-s} 0 H ${s} M 0 ${-s} V ${s}"
            transform="translate(${x} ${y})" stroke="#fff" stroke-width="1"
            stroke-linecap="round" style="animation-duration:${dur};animation-delay:${delay}"/>`;
        }
        return svg`<circle class="star" cx=${x} cy=${y} r=${0.6 + ((i * 13) % 10) / 9}
          fill="#fff" style="animation-duration:${dur};animation-delay:${delay}"/>`;
      })
    : [];

  const rainLayer = (n: number, cls: string, w: number, op: number) =>
    Array.from({ length: n }, (_, i) => {
      const x = 14 + ((i * 53) % 272);
      const y = 62 + ((i * 29) % 96);
      const len = 9 + (i % 3) * 3;
      return svg`<line class=${cls} x1=${x} y1=${y} x2=${x - rainSlant} y2=${y + len}
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
      cloud(sc, sc.cloudOpacity * l.op, l.y, l.s, l.dur / drift, -i * 5.5, 3.4 + i * 0.9, l.blur)
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
        <stop offset="50%" stop-color=${sc.sky[1]} />
        <stop offset="82%" stop-color=${sc.sky[2]} />
      </linearGradient>
      <radialGradient id="wc-sun-glow">
        <stop offset="0%" stop-color="#fff3c4" stop-opacity="0.95" />
        <stop offset="55%" stop-color=${sc.sunColor} stop-opacity="0.4" />
        <stop offset="100%" stop-color=${sc.sunColor} stop-opacity="0" />
      </radialGradient>
      <radialGradient id="wc-sun-disc">
        <stop offset="0%" stop-color="#fffbe6" />
        <stop offset="55%" stop-color=${mix(sc.sunColor, '#ffffff', 0.35)} />
        <stop offset="100%" stop-color=${sc.sunColor} />
      </radialGradient>
      <radialGradient id="wc-horizon">
        <stop offset="0%" stop-color=${sc.horizonColor} stop-opacity="0.9" />
        <stop offset="55%" stop-color=${sc.horizonColor} stop-opacity="0.35" />
        <stop offset="100%" stop-color=${sc.horizonColor} stop-opacity="0" />
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
      <filter id="wc-blur-soft" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <filter id="wc-bolt-glow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="3.5" />
      </filter>
    </defs>
    <style>
      .skyscene .cloud { animation-name: wc-drift; animation-timing-function: linear; animation-iteration-count: infinite; }
      @keyframes wc-drift { from { transform: translateX(-85px); } to { transform: translateX(385px); } }
      .skyscene .cloudbob { animation: wc-bob ease-in-out infinite alternate; }
      @keyframes wc-bob { from { transform: translateY(-2.4px); } to { transform: translateY(2.4px); } }
      .skyscene .sunrays { animation: wc-spin 70s linear infinite; }
      @keyframes wc-spin { to { transform: rotate(360deg); } }
      .skyscene .raypulse { animation: wc-raypulse 4.2s ease-in-out infinite; }
      @keyframes wc-raypulse { 0%,100% { transform: scale(1); opacity: 0.85; } 50% { transform: scale(1.08); opacity: 1; } }
      .skyscene .sunglow { animation: wc-breathe 5s ease-in-out infinite; }
      @keyframes wc-breathe { 0%,100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.15); opacity: 1; } }
      .skyscene .moonhalo { animation: wc-breathe 6.5s ease-in-out infinite; }
      .skyscene .horizonpulse { animation: wc-horizonpulse 7s ease-in-out infinite; }
      @keyframes wc-horizonpulse { 0%,100% { opacity: 0.85; } 50% { opacity: 1; } }
      .skyscene .star { animation-name: wc-twinkle; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
      @keyframes wc-twinkle { 0%,100% { opacity: 0.15; } 50% { opacity: 1; } }
      .skyscene .shooting { animation: wc-shoot linear infinite; opacity: 0; }
      @keyframes wc-shoot { 0%,92% { opacity: 0; transform: translate(0,0); } 93% { opacity: 1; } 97% { opacity: 0; transform: translate(-95px,46px); } 100% { opacity: 0; } }
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
      .skyscene .sway { animation: wc-sway ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 50% 100%; }
      @keyframes wc-sway { from { transform: rotate(-1.8deg); } to { transform: rotate(1.8deg); } }
      .skyscene .warnglow { animation: wc-warnpulse 2.4s ease-in-out infinite; }
      @keyframes wc-warnpulse { 0%,100% { opacity: 0.55; } 50% { opacity: 1; } }
      .skyscene .sunglow, .skyscene .raypulse, .skyscene .moonhalo { transform-origin: center; transform-box: fill-box; }
    </style>

    <rect x="0" y="0" width="300" height="190" fill="url(#wc-sky-grad)" />

    ${stars}
    ${sc.stars
      ? svg`
        <line class="shooting" x1="238" y1="26" x2="252" y2="19"
          stroke="#fff" stroke-width="1.6" stroke-linecap="round"
          style="animation-duration:13s"/>
        <line class="shooting" x1="96" y1="18" x2="109" y2="12"
          stroke="#fff" stroke-width="1.3" stroke-linecap="round"
          style="animation-duration:19s;animation-delay:-8s"/>`
      : nothing}

    ${sc.horizon > 0.03
      ? svg`<ellipse class="horizonpulse" cx=${glowX} cy="152" rx="205" ry="64"
          fill="url(#wc-horizon)" opacity=${sc.horizon}/>`
      : nothing}

    ${sc.showSun
      ? svg`<g transform="translate(${glowX} ${sc.sunY})">
          <g class="sunglow"><circle r=${sc.sunR * 2.9} fill="url(#wc-sun-glow)"/></g>
          ${sc.showRays ? svg`<g class="raypulse"><g class="sunrays">${rays}</g></g>` : nothing}
          <circle r=${sc.sunR + 6} fill=${sc.sunColor} opacity="0.3" filter="url(#wc-blur-soft)"/>
          <circle r=${sc.sunR} fill="url(#wc-sun-disc)"/>
        </g>`
      : nothing}
    ${sc.showMoon
      ? svg`<g transform="translate(230 42)">
          <g class="moonhalo"><circle r="32" fill="url(#wc-moon-halo)"/></g>
          <circle r="15" fill="#eef1f7"/>
          <circle cx="-6.5" cy="-4" r="13.5" fill=${sc.sky[0]}/>
          <circle cx="4" cy="3" r="2.2" fill="#c9d2e4" opacity="0.8"/>
          <circle cx="8.5" cy="-3" r="1.4" fill="#c9d2e4" opacity="0.7"/>
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

    <!-- layered landscape with atmospheric haze; the crests catch golden light -->
    <path d=${closeHill(CREST_FAR)} fill=${sc.ridgeFar}/>
    <path d=${closeHill(CREST_BACK)} fill=${sc.hillBack}/>
    ${sc.rim > 0.05
      ? svg`<path d=${CREST_BACK} fill="none" stroke=${sc.horizonColor}
          stroke-width="1.6" opacity=${sc.rim} stroke-linecap="round"/>`
      : nothing}
    <path d=${closeHill(CREST_FRONT)} fill=${sc.hillFront}/>
    ${sc.rim > 0.05
      ? svg`<path d=${CREST_FRONT} fill="none" stroke=${sc.horizonColor}
          stroke-width="1.2" opacity=${sc.rim * 0.6} stroke-linecap="round"/>`
      : nothing}
    ${TREES.map(
      ([x, y, s], ti) => svg`<g transform="translate(${x} ${y})">
        <g class="sway" style="animation-duration:${swayDur}s;animation-delay:${-ti * 0.7}s">
          <g transform="scale(${s})" fill=${sc.tree}>
            <polygon points="0,-16 6,-4 -6,-4"/>
            <polygon points="0,-10 7.5,3 -7.5,3"/>
            <rect x="-1.2" y="3" width="2.4" height="4" rx="1"/>
          </g>
        </g>
      </g>`
    )}
    ${sc.horizon > 0.03
      ? svg`<ellipse cx=${glowX} cy="156" rx="150" ry="26"
          fill="url(#wc-horizon)" opacity=${sc.horizon * 0.45}/>`
      : nothing}

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
