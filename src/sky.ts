import { html, svg, nothing } from 'lit';
import type { TemplateResult } from 'lit';

export interface SkyOpts {
  /** Home Assistant condition string (sunny, rainy, snowy, …) */
  condition?: string;
  /** daytime vs night — picks sun/moon and the sky palette */
  isDay: boolean;
  /** 0..1 — stronger wind drifts the clouds faster */
  wind: number;
  /** 0..1 — background warning/alert glow intensity */
  glow: number;
  /** CSS color for the warning glow */
  glowColor: string;
}

interface Scene {
  top: string;
  bottom: string;
  luminary: 'sun' | 'moon' | 'none';
  clouds: number;
  rain: number;
  snow: boolean;
  lightning: boolean;
  fog: boolean;
  stars: boolean;
}

const CLEAR_DAY = { top: '#4a90e2', bottom: '#bfe0ff' };
const CLEAR_NIGHT = { top: '#0b1a3a', bottom: '#2b4a7d' };
const GREY_DAY = { top: '#8095a8', bottom: '#c7d3dd' };
const GREY_NIGHT = { top: '#2a3546', bottom: '#4a586b' };
const STORM_DAY = { top: '#5a6775', bottom: '#93a0ac' };
const STORM_NIGHT = { top: '#20293a', bottom: '#3c485c' };

/** Derives the scene composition from an HA weather condition. */
function derive(condition: string | undefined, isDay: boolean): Scene {
  const c = condition ?? (isDay ? 'partlycloudy' : 'clear-night');
  const stormy = ['rainy', 'pouring', 'lightning', 'lightning-rainy', 'snowy', 'snowy-rainy', 'hail'].includes(c);
  const overcast = ['cloudy', 'fog', 'exceptional'].includes(c) || stormy;
  const palette = stormy
    ? isDay
      ? STORM_DAY
      : STORM_NIGHT
    : overcast
      ? isDay
        ? GREY_DAY
        : GREY_NIGHT
      : isDay
        ? CLEAR_DAY
        : CLEAR_NIGHT;

  const rain = c === 'pouring' || c === 'lightning-rainy' ? 2 : c === 'rainy' || c === 'snowy-rainy' || c === 'hail' ? 1 : 0;
  const clouds =
    c === 'sunny' || c === 'clear-night'
      ? 0
      : c === 'partlycloudy' || c === 'windy' || c === 'windy-variant'
        ? 1
        : 3;

  return {
    top: palette.top,
    bottom: palette.bottom,
    luminary: overcast ? 'none' : isDay ? 'sun' : 'moon',
    clouds,
    rain,
    snow: c === 'snowy' || c === 'snowy-rainy' || c === 'hail',
    lightning: c === 'lightning' || c === 'lightning-rainy',
    fog: c === 'fog',
    stars: !isDay && !overcast,
  };
}

function cloud(x: number, y: number, s: number, dur: number, delay: number, fill: string) {
  return svg`<g transform="translate(0 ${y})">
    <g class="cloud" style="animation-duration:${dur}s;animation-delay:${delay}s">
      <g transform="translate(${x}) scale(${s})">
        <ellipse cx="0" cy="0" rx="26" ry="16" fill=${fill}/>
        <ellipse cx="20" cy="4" rx="22" ry="14" fill=${fill}/>
        <ellipse cx="-20" cy="5" rx="20" ry="13" fill=${fill}/>
        <ellipse cx="2" cy="9" rx="30" ry="12" fill=${fill}/>
      </g>
    </g>
  </g>`;
}

/**
 * Animated weather scene: sky gradient by condition + day/night, a sun (with
 * turning rays) or a moon with twinkling stars, drifting clouds and — when the
 * condition calls for it — falling rain or snow, a lightning flash or fog. All
 * self-contained (styles + keyframes live inside the SVG) so it drops into any
 * card style; a warning glow can wash over it from a score entity.
 */
export function skyScene(o: SkyOpts): TemplateResult {
  const sc = derive(o.condition, o.isDay);
  const cloudFill = o.isDay ? 'rgba(255,255,255,0.92)' : 'rgba(210,220,235,0.72)';
  const drift = 1 + o.wind * 1.4; // faster clouds in strong wind
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return svg`<line x1=${Math.cos(a) * 20} y1=${Math.sin(a) * 20}
      x2=${Math.cos(a) * 30} y2=${Math.sin(a) * 30} stroke="#ffe08a"
      stroke-width="3" stroke-linecap="round"/>`;
  });
  const stars = sc.stars
    ? Array.from({ length: 22 }, (_, i) => {
        const x = 12 + ((i * 61) % 276);
        const y = 12 + ((i * 37) % 70);
        const r = 0.7 + ((i * 13) % 10) / 10;
        return svg`<circle class="star" cx=${x} cy=${y} r=${r} fill="#fff"
          style="animation-delay:${(i % 7) * 0.4}s"/>`;
      })
    : [];
  const raindrops =
    sc.rain > 0
      ? Array.from({ length: sc.rain === 2 ? 46 : 26 }, (_, i) => {
          const x = 18 + ((i * 53) % 264);
          const y = 78 + ((i * 29) % 86);
          return svg`<line class="rain" x1=${x} y1=${y} x2=${x - 3} y2=${y + 9}
            stroke="#cfe6ff" stroke-width="1.6" stroke-linecap="round"
            style="animation-delay:${(i % 6) * 0.1}s"/>`;
        })
      : [];
  const snowflakes = sc.snow
    ? Array.from({ length: 30 }, (_, i) => {
        const x = 16 + ((i * 47) % 268);
        const y = 74 + ((i * 31) % 92);
        return svg`<circle class="snow" cx=${x} cy=${y} r="2" fill="#fff"
          style="animation-delay:${(i % 8) * 0.35}s;animation-duration:${3 + (i % 4) * 0.7}s"/>`;
      })
    : [];
  const clouds = Array.from({ length: sc.clouds }, (_, i) => {
    const lanes = [
      { x: 60, y: 46, s: 0.9 },
      { x: 150, y: 34, s: 1.15 },
      { x: 220, y: 58, s: 0.75 },
    ];
    const l = lanes[i % lanes.length];
    return cloud(l.x, l.y, l.s, (16 + i * 5) / drift, -i * 4, cloudFill);
  });

  return html`<svg
    class="skyscene"
    viewBox="0 0 300 190"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="wc-sky-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color=${sc.top} />
        <stop offset="100%" stop-color=${sc.bottom} />
      </linearGradient>
      <radialGradient id="wc-sun-glow">
        <stop offset="0%" stop-color="#fff6cf" stop-opacity="0.9" />
        <stop offset="60%" stop-color="#ffd257" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#ffd257" stop-opacity="0" />
      </radialGradient>
    </defs>
    <style>
      .skyscene .cloud { animation-name: wc-drift; animation-timing-function: linear; animation-iteration-count: infinite; }
      @keyframes wc-drift { from { transform: translateX(-70px); } to { transform: translateX(360px); } }
      .skyscene .sunrays { transform-origin: 62px 52px; animation: wc-spin 90s linear infinite; }
      @keyframes wc-spin { to { transform: rotate(360deg); } }
      .skyscene .star { animation: wc-twinkle 3.2s ease-in-out infinite; }
      @keyframes wc-twinkle { 0%,100% { opacity: 0.25; } 50% { opacity: 1; } }
      .skyscene .rain { animation: wc-rain 0.62s linear infinite; }
      @keyframes wc-rain { from { transform: translateY(-12px); opacity: 0; } 20% { opacity: 0.9; } to { transform: translateY(16px); opacity: 0; } }
      .skyscene .snow { animation-name: wc-snow; animation-timing-function: linear; animation-iteration-count: infinite; }
      @keyframes wc-snow { from { transform: translateY(-10px) translateX(0); opacity: 0; } 20% { opacity: 1; } to { transform: translateY(24px) translateX(6px); opacity: 0; } }
      .skyscene .bolt { animation: wc-flash 4s steps(1) infinite; }
      @keyframes wc-flash { 0%,7%,100% { opacity: 0; } 3% { opacity: 1; } 5% { opacity: 0.3; } 6% { opacity: 0.95; } }
      .skyscene .fog { animation: wc-fog 7s ease-in-out infinite; }
      @keyframes wc-fog { 0%,100% { transform: translateX(-6px); } 50% { transform: translateX(10px); } }
    </style>

    <rect x="0" y="0" width="300" height="190" fill="url(#wc-sky-grad)" />

    ${stars}

    ${sc.luminary === 'sun'
      ? svg`<g>
          <circle cx="62" cy="52" r="40" fill="url(#wc-sun-glow)"/>
          <g class="sunrays">${rays}</g>
          <circle cx="62" cy="52" r="17" fill="#ffdf5e"/>
        </g>`
      : nothing}
    ${sc.luminary === 'moon'
      ? svg`<g>
          <circle cx="228" cy="46" r="30" fill="url(#wc-sun-glow)" opacity="0.5"/>
          <circle cx="228" cy="46" r="16" fill="#eef1f7"/>
          <circle cx="221" cy="42" r="14.5" fill=${sc.top}/>
        </g>`
      : nothing}

    ${clouds}

    ${sc.fog
      ? svg`<g class="fog">
          <rect x="-20" y="120" width="340" height="10" rx="5" fill="rgba(255,255,255,0.5)"/>
          <rect x="-20" y="140" width="340" height="12" rx="6" fill="rgba(255,255,255,0.42)"/>
          <rect x="-20" y="160" width="340" height="14" rx="7" fill="rgba(255,255,255,0.34)"/>
        </g>`
      : nothing}

    ${raindrops}
    ${snowflakes}

    ${sc.lightning
      ? svg`<polygon class="bolt" points="150,70 138,116 152,116 140,158 176,104 158,104 168,70"
          fill="#fff1a8" stroke="#ffd83a" stroke-width="1"/>`
      : nothing}

    ${o.glow > 0
      ? svg`<rect x="0" y="0" width="300" height="190"
          fill=${o.glowColor} opacity=${Math.min(o.glow * 0.35, 0.4)}
          style="mix-blend-mode:overlay"/>`
      : nothing}
  </svg>`;
}
