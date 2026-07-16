// Dev-only harness: stubs ha-card / ha-icon and a minimal `hass` object
// (weather entity + forecast service + sensors) so the card can be developed
// outside Home Assistant.
import '../src/weatherglass-card.ts';

// ---- ha-card stub -----------------------------------------------------------
customElements.define(
  'ha-card',
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' }).innerHTML = `
        <style>
          :host {
            display: block;
            background: var(--ha-card-background, var(--card-background-color, #fff));
            border-radius: var(--ha-card-border-radius, 12px);
            box-shadow: var(--ha-card-box-shadow, 0 2px 10px rgba(0,0,0,0.06));
            color: var(--primary-text-color);
          }
        </style>
        <slot></slot>`;
    }
  }
);

// ---- ha-icon stub (loads real MDI icons from CDN, dev only) ------------------
const iconCache = new Map();
customElements.define(
  'ha-icon',
  class extends HTMLElement {
    static get observedAttributes() {
      return ['icon'];
    }
    constructor() {
      super();
      this.attachShadow({ mode: 'open' }).innerHTML = `
        <style>
          :host { display: inline-flex; width: var(--mdc-icon-size, 24px); height: var(--mdc-icon-size, 24px); }
          svg { width: 100%; height: 100%; fill: currentColor; display: block; }
        </style>
        <span id="s"></span>`;
    }
    set icon(v) {
      this._icon = v;
      this._render();
    }
    get icon() {
      return this._icon;
    }
    attributeChangedCallback(_n, _o, v) {
      this.icon = v;
    }
    async _render() {
      const name = (this._icon || '').replace('mdi:', '');
      if (!name) return;
      if (!iconCache.has(name)) {
        iconCache.set(
          name,
          fetch(`https://cdn.jsdelivr.net/npm/@mdi/svg@7.4.47/svg/${name}.svg`)
            .then((r) => (r.ok ? r.text() : ''))
            .catch(() => '')
        );
      }
      const svg = await iconCache.get(name);
      if (this._icon && this._icon.replace('mdi:', '') === name) {
        this.shadowRoot.getElementById('s').innerHTML = svg;
        this.shadowRoot.getElementById('s').style.display = 'contents';
      }
    }
  }
);

// ---- mock states ------------------------------------------------------------
const now = new Date();
const iso = (d) => d.toISOString();
const at = (h, m) => {
  const d = new Date(now);
  d.setHours(h, m, 0, 0);
  return iso(d);
};

function entity(id, state, attrs) {
  return {
    entity_id: id,
    state: String(state),
    attributes: attrs,
    last_changed: at(now.getHours(), 0),
    last_updated: at(now.getHours(), Math.min(now.getMinutes(), 59)),
  };
}

let currentCondition = 'partlycloudy';
let sunUp = true;

const sunrise = new Date(now);
sunrise.setHours(6, 12, 0, 0);
const sunset = new Date(now);
sunset.setHours(20, 34, 0, 0);
const nextRising = new Date(sunrise.getTime() + 86400000);

// self-contained fake radar frame (data URI) for the dev preview
const radarImg =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 190">
    <rect width="300" height="190" fill="#12233a"/>
    <g stroke="#ffffff18" stroke-width="1">
      <line x1="0" y1="63" x2="300" y2="63"/><line x1="0" y1="126" x2="300" y2="126"/>
      <line x1="100" y1="0" x2="100" y2="190"/><line x1="200" y1="0" x2="200" y2="190"/>
    </g>
    <circle cx="150" cy="95" r="70" fill="none" stroke="#ffffff22"/>
    <circle cx="150" cy="95" r="40" fill="none" stroke="#ffffff22"/>
    <g opacity="0.85">
      <ellipse cx="120" cy="80" rx="40" ry="26" fill="#39d353"/>
      <ellipse cx="132" cy="86" rx="24" ry="16" fill="#f4d03f"/>
      <ellipse cx="140" cy="90" rx="12" ry="9" fill="#e74c3c"/>
      <ellipse cx="210" cy="130" rx="30" ry="18" fill="#39d353" opacity="0.7"/>
    </g>
  </svg>`);

const states = {
  'weather.home': entity('weather.home', currentCondition, {
    friendly_name: 'Zuhause',
    temperature: 18.4,
    temperature_unit: '°C',
    humidity: 63,
    pressure: 1014,
    wind_speed: 14,
    wind_bearing: 235,
    wind_speed_unit: 'km/h',
    uv_index: 5,
    apparent_temperature: 17.2,
    cloud_coverage: 40,
    visibility: 24,
  }),
  'sun.sun': entity('sun.sun', 'above_horizon', {
    friendly_name: 'Sonne',
    next_rising: iso(nextRising),
    next_setting: iso(sunset),
    elevation: 38,
    rising: false,
  }),
  'sensor.aussentemperatur': entity('sensor.aussentemperatur', 18.4, { unit_of_measurement: '°C', device_class: 'temperature', friendly_name: 'Außentemperatur' }),
  'sensor.gefuehlt': entity('sensor.gefuehlt', 17.2, { unit_of_measurement: '°C', device_class: 'temperature', friendly_name: 'Gefühlt' }),
  'sensor.wind': entity('sensor.wind', 14, { unit_of_measurement: 'km/h', wind_bearing: 235, device_class: 'wind_speed', friendly_name: 'Wind' }),
  'sensor.windboe': entity('sensor.windboe', 27, { unit_of_measurement: 'km/h', device_class: 'wind_speed', friendly_name: 'Böen' }),
  'sensor.niederschlag': entity('sensor.niederschlag', 2.4, { unit_of_measurement: 'mm', device_class: 'precipitation', friendly_name: 'Niederschlag' }),
  'sensor.regen_morgen': entity('sensor.regen_morgen', 0.4, { unit_of_measurement: 'mm', friendly_name: 'Regen Morgen' }),
  'sensor.regen_mittag': entity('sensor.regen_mittag', 1.2, { unit_of_measurement: 'mm', friendly_name: 'Regen Mittag' }),
  'sensor.regen_abend': entity('sensor.regen_abend', 0.8, { unit_of_measurement: 'mm', friendly_name: 'Regen Abend' }),
  'sensor.regen_nacht': entity('sensor.regen_nacht', 0.0, { unit_of_measurement: 'mm', friendly_name: 'Regen Nacht' }),
  'sensor.luftfeuchte': entity('sensor.luftfeuchte', 63, { unit_of_measurement: '%', device_class: 'humidity', friendly_name: 'Luftfeuchte' }),
  'sensor.luftdruck': entity('sensor.luftdruck', 1014, { unit_of_measurement: 'hPa', device_class: 'atmospheric_pressure', friendly_name: 'Luftdruck' }),
  'sensor.uv': entity('sensor.uv', 5, { unit_of_measurement: '', friendly_name: 'UV-Index' }),
  'sensor.bewoelkung': entity('sensor.bewoelkung', 40, { unit_of_measurement: '%', friendly_name: 'Bewölkung' }),
  'sensor.sichtweite': entity('sensor.sichtweite', 24, { unit_of_measurement: 'km', device_class: 'distance', friendly_name: 'Sichtweite' }),
  'sensor.aqi': entity('sensor.aqi', 34, { friendly_name: 'Luftqualität (AQI)' }),
  'sensor.pm25': entity('sensor.pm25', 12, { unit_of_measurement: 'µg/m³', friendly_name: 'PM2.5' }),
  'sensor.pm10': entity('sensor.pm10', 18, { unit_of_measurement: 'µg/m³', friendly_name: 'PM10' }),
  'sensor.ozon': entity('sensor.ozon', 46, { unit_of_measurement: 'µg/m³', friendly_name: 'Ozon' }),
  'sensor.warnstufe': entity('sensor.warnstufe', 20, { friendly_name: 'Warnstufe' }),
  'sensor.mond': entity('sensor.mond', 'waxing_gibbous', { friendly_name: 'Mondphase' }),
  'sensor.mondbeleuchtung': entity('sensor.mondbeleuchtung', 72, { unit_of_measurement: '%', friendly_name: 'Mondbeleuchtung' }),
  'sensor.pegel': entity('sensor.pegel', 1.8, {
    unit_of_measurement: 'm',
    friendly_name: 'Pegel',
    next_high_tide: at(14, 20),
    next_low_tide: at(20, 35),
  }),
  'sensor.pollen_graeser': entity('sensor.pollen_graeser', 3, { friendly_name: 'Gräser' }),
  'sensor.pollen_birke': entity('sensor.pollen_birke', 2, { friendly_name: 'Birke' }),
  'sensor.pollen_beifuss': entity('sensor.pollen_beifuss', 1, { friendly_name: 'Beifuß' }),
  'sensor.pollen_ambrosia': entity('sensor.pollen_ambrosia', 4, { friendly_name: 'Ambrosia' }),
  'camera.regenradar': entity('camera.regenradar', 'idle', { friendly_name: 'Regenradar', entity_picture: radarImg }),
};

let sunElevation = 38;

function syncWeather() {
  states['weather.home'].state = currentCondition;
  sunUp = sunElevation > 0;
  states['sun.sun'].state = sunUp ? 'above_horizon' : 'below_horizon';
  states['sun.sun'].attributes.elevation = sunElevation;
}

// ---- fake history + statistics ----------------------------------------------
const profiles = {
  'sensor.aussentemperatur': [16, 0.1, 4],
  'sensor.gefuehlt': [15, 0.1, 4],
  'sensor.wind': [12, 0.2, 8],
  'sensor.windboe': [22, 0.3, 12],
  'sensor.niederschlag': [1, 0, 4],
  'sensor.luftfeuchte': [65, -0.4, 12],
  'sensor.luftdruck': [1012, 0.3, 4],
  'sensor.uv': [4, 0.1, 3],
  'sensor.bewoelkung': [50, -1, 40],
  'sensor.sichtweite': [22, 0.2, 8],
  'sensor.aqi': [40, -0.8, 10],
  'sensor.pm25': [14, -0.2, 6],
  'sensor.pm10': [20, -0.3, 8],
  'sensor.ozon': [44, 0.2, 12],
};

let seed = 7;
const rand = () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};

function fakeDaily(id, startMs, endMs) {
  const [base, trend, jitter] = profiles[id] ?? [50, 0, 5];
  const points = [];
  const dayMs = 86400000;
  const days = Math.ceil((endMs - startMs) / dayMs);
  for (let d = 0; d < days; d++) {
    const t = startMs + d * dayMs + 8 * 3600000;
    if (t > endMs) break;
    const v = base + trend * d + (rand() - 0.5) * jitter;
    points.push({ s: String(Math.max(0, v)), lu: t / 1000 });
  }
  return points;
}

function fakeHistory(id, startMs, endMs) {
  if (id === 'sensor.aussentemperatur' || id === 'sensor.gefuehlt' || id === 'sensor.wind') {
    // hourly with a day/night curve
    const [base, , jitter] = profiles[id] ?? [16, 0, 4];
    const points = [];
    for (let t = startMs; t <= endMs; t += 3600000) {
      const hour = new Date(t).getHours();
      const wave = id === 'sensor.wind' ? 6 : 6;
      const v = base + wave * Math.sin(((hour - 9) / 24) * 2 * Math.PI) + (rand() - 0.5) * jitter;
      points.push({ s: String(Math.max(0, v).toFixed(1)), lu: t / 1000 });
    }
    return points;
  }
  if (id === 'sensor.niederschlag') {
    // bursty rain events
    const points = [];
    const dayMs = 86400000;
    for (let d = 0; ; d++) {
      const dayStart = startMs + d * dayMs;
      if (dayStart > endMs) break;
      const showers = Math.floor(rand() * 3);
      for (let k = 0; k < showers; k++) {
        const t = dayStart + rand() * dayMs;
        if (t >= startMs && t <= endMs) points.push({ s: String((rand() * 4).toFixed(1)), lu: t / 1000 });
      }
    }
    return points;
  }
  if (id === 'sensor.pegel') {
    // semidiurnal tide: ~2 highs per day
    const points = [];
    for (let t = startMs; t <= endMs; t += 3600000) {
      const hours = t / 3600000;
      const v = 1.9 + 1.4 * Math.sin((hours / 12.42) * 2 * Math.PI);
      points.push({ s: v.toFixed(2), lu: t / 1000 });
    }
    return points;
  }
  return fakeDaily(id, startMs, endMs);
}

// ---- fake forecast ----------------------------------------------------------
function forecastFor(type) {
  const out = [];
  if (type === 'hourly') {
    const conds = ['partlycloudy', 'sunny', 'cloudy', 'rainy', 'partlycloudy', 'clear-night'];
    const start = new Date(now);
    start.setMinutes(0, 0, 0);
    for (let i = 0; i < 24; i++) {
      const d = new Date(start.getTime() + i * 3600000);
      const hour = d.getHours();
      const temp = 16 + 6 * Math.sin(((hour - 9) / 24) * 2 * Math.PI);
      const day = hour > 6 && hour < 21;
      out.push({
        datetime: iso(d),
        condition: day ? conds[i % 4] : 'clear-night',
        temperature: +temp.toFixed(1),
        precipitation: i % 5 === 0 ? +(rand() * 2).toFixed(1) : 0,
        precipitation_probability: (i * 13) % 100,
        wind_speed: 10 + (i % 5) * 3 + Math.round(4 * Math.sin(i / 3)),
        wind_bearing: (200 + i * 6) % 360,
        humidity: Math.round(60 + 14 * Math.sin((i - 4) / 5)),
        pressure: Math.round(1012 + 4 * Math.sin(i / 7) + i * 0.15),
        cloud_coverage: Math.round(40 + 30 * Math.sin(i / 4)),
        uv_index: day ? Math.max(0, Math.round(6 * Math.sin(((hour - 6) / 14) * Math.PI))) : 0,
        is_daytime: day,
      });
    }
    return out;
  }
  const conds = ['partlycloudy', 'sunny', 'rainy', 'cloudy', 'sunny', 'partlycloudy', 'lightning-rainy'];
  const start = new Date(now);
  start.setHours(12, 0, 0, 0);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    out.push({
      datetime: iso(d),
      condition: conds[i % conds.length],
      temperature: +(20 - i * 0.6 + (rand() - 0.5) * 3).toFixed(0),
      templow: +(11 - i * 0.4 + (rand() - 0.5) * 2).toFixed(0),
      precipitation: +(rand() * 6).toFixed(1),
      precipitation_probability: Math.round((i * 17 + 20) % 100),
      wind_speed: 12 + (i % 4) * 4,
      wind_bearing: (220 + i * 15) % 360,
    });
  }
  return out;
}

const hass = {
  states,
  language: 'de',
  locale: { language: 'de' },
  callWS: async (msg) => {
    if (msg.type === 'history/history_during_period') {
      const start = new Date(msg.start_time).getTime();
      const end = new Date(msg.end_time).getTime();
      const out = {};
      for (const id of msg.entity_ids) out[id] = fakeHistory(id, start, end);
      return out;
    }
    if (msg.type === 'recorder/statistics_during_period') {
      const start = new Date(msg.start_time).getTime();
      const end = new Date(msg.end_time).getTime();
      const out = {};
      for (const id of msg.statistic_ids) {
        out[id] = fakeDaily(id, start, end).map((p) => ({
          start: p.lu * 1000,
          mean: +p.s,
          min: +p.s * 0.94,
          max: +p.s * 1.06,
          state: +p.s,
          sum: +p.s,
        }));
      }
      return out;
    }
    if (msg.type === 'execute_script') {
      const step = (msg.sequence ?? []).find((s) => s.service === 'weather.get_forecasts');
      if (step) {
        const id = step.target?.entity_id ?? 'weather.home';
        return { response: { [id]: { forecast: forecastFor(step.data?.type ?? 'daily') } } };
      }
      return { response: {} };
    }
    return {};
  },
};

// ---- mount ------------------------------------------------------------------
const config = {
  type: 'custom:weatherglass-card',
  title: 'Wetter',
  subtitle: 'Zuhause',
  weather: 'weather.home',
  metrics: [
    {
      type: 'sky',
      entity: 'weather.home',
      score_entity: 'sensor.warnstufe',
      // labeled chips under the forecast; omit to auto-fill from the weather entity
      details: ['sensor.wind', 'sensor.luftfeuchte', 'sensor.luftdruck', 'sensor.uv'],
    },
    { type: 'summary' },
    { type: 'temperature', entity: 'sensor.aussentemperatur', expanded: true },
    { type: 'feels_like', entity: 'sensor.gefuehlt' },
    { type: 'wind', entity: 'sensor.wind', entity2: 'sensor.windboe' },
    {
      type: 'precipitation',
      entity: 'sensor.niederschlag',
      parts: {
        morning: 'sensor.regen_morgen',
        noon: 'sensor.regen_mittag',
        evening: 'sensor.regen_abend',
        night: 'sensor.regen_nacht',
      },
    },
    { type: 'humidity', entity: 'sensor.luftfeuchte' },
    { type: 'uv', entity: 'sensor.uv', max: 11 },
    { type: 'pressure', entity: 'sensor.luftdruck' },
    { type: 'cloud', entity: 'sensor.bewoelkung' },
    { type: 'visibility', entity: 'sensor.sichtweite' },
    {
      type: 'air_quality',
      entity: 'sensor.aqi',
      max: 100,
      breakdown: [
        { entity: 'sensor.pm25', name: 'PM2.5', color: 'teal' },
        { entity: 'sensor.pm10', name: 'PM10', color: 'amber' },
        { entity: 'sensor.ozon', name: 'Ozon', color: 'deep-orange' },
      ],
    },
    { type: 'sun', sun_entity: 'sun.sun' },
    { type: 'moon', entity: 'sensor.mond', illumination_entity: 'sensor.mondbeleuchtung' },
    {
      type: 'tides',
      entity: 'sensor.pegel',
      high_tide_entity: null,
      low_tide_entity: null,
    },
    {
      type: 'pollen',
      max: 5,
      entities: [
        { entity: 'sensor.pollen_graeser', name: 'Gräser' },
        { entity: 'sensor.pollen_birke', name: 'Birke' },
        { entity: 'sensor.pollen_beifuss', name: 'Beifuß' },
        { entity: 'sensor.pollen_ambrosia', name: 'Ambrosia' },
      ],
    },
    { type: 'radar', entity: 'camera.regenradar' },
  ],
};

const card = document.createElement('weatherglass-card');
let current = { ...config };
card.setConfig(current);
card.hass = hass;
document.getElementById('mount').appendChild(card);

const push = () => {
  card.hass = { ...hass };
};
const apply = (patch) => {
  current = { ...current, ...patch };
  card.setConfig(current);
  push();
};

document.getElementById('theme').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});
document.getElementById('width').addEventListener('click', () => {
  const w = document.getElementById('wrap');
  const wide = w.style.maxWidth !== '900px';
  w.style.maxWidth = wide ? '900px' : '420px';
  apply({ columns: wide ? 2 : 1 });
});
document.getElementById('layout').addEventListener('click', () => {
  apply({ layout: current.layout === 'carousel' ? 'grid' : 'carousel', columns: 1 });
});
document.getElementById('bg').addEventListener('click', () => {
  const off = current.background !== false;
  apply({ background: off ? false : true, flush: off });
});

const STYLES = ['default', 'glass', 'material', 'bubble', 'mirror'];
document.getElementById('style').addEventListener('click', () => {
  const next = STYLES[(STYLES.indexOf(current.card_style ?? 'default') + 1) % STYLES.length];
  apply({ card_style: next });
  document.getElementById('style').textContent = `Stil: ${next}`;
  document.body.style.background =
    next === 'glass'
      ? 'linear-gradient(135deg, #4568dc 0%, #b06ab3 50%, #ee9ca7 100%) fixed'
      : next === 'mirror'
        ? '#000'
        : '';
});

// cycle the sun through the day: noon → golden hour → horizon → dusk → night
const ELEVATIONS = [38, 12, 1, -5, -18];
document.getElementById('night').addEventListener('click', () => {
  const next = ELEVATIONS[(ELEVATIONS.indexOf(sunElevation) + 1) % ELEVATIONS.length];
  sunElevation = next;
  if (next <= -8 && (currentCondition === 'sunny' || currentCondition === 'partlycloudy')) {
    currentCondition = 'clear-night';
  }
  if (next > 0 && currentCondition === 'clear-night') currentCondition = 'sunny';
  syncWeather();
  push();
  document.getElementById('night').textContent = `Sonne: ${next}°`;
  document.getElementById('cond').textContent = `Lage: ${currentCondition}`;
});

const CONDS = ['sunny', 'partlycloudy', 'cloudy', 'rainy', 'pouring', 'lightning-rainy', 'snowy', 'fog', 'clear-night'];
document.getElementById('cond').addEventListener('click', () => {
  currentCondition = CONDS[(CONDS.indexOf(currentCondition) + 1) % CONDS.length];
  sunUp = currentCondition !== 'clear-night';
  syncWeather();
  push();
  document.getElementById('cond').textContent = `Lage: ${currentCondition}`;
});
