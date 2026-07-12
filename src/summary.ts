import type { HomeAssistant } from './types';
import { lang } from './i18n';
import { fmtNumber, joinUnit } from './format';

export interface WeatherSnapshot {
  /** already-localized condition name (e.g. "Teils bewölkt") */
  condition?: string;
  temp?: number;
  tempUnit?: string;
  hi?: number;
  lo?: number;
  feels?: number;
  windSpeed?: number;
  windUnit?: string;
  windDir?: string;
  precipProb?: number;
  precipMm?: number;
  uv?: number;
  humidity?: number;
  tomorrowCondition?: string;
  tomorrowHi?: number;
  tomorrowLo?: number;
}

const isNum = (x?: number): x is number => typeof x === 'number' && Number.isFinite(x);

/**
 * Builds a friendly, natural-language weather summary from a snapshot of the
 * currently available values — a self-contained stand-in for an LLM summary
 * (which you can plug in instead via `summary_entity`). Bilingual (de/en) and
 * degrades gracefully: every clause is optional, so it works with whatever
 * data the configured sensors provide.
 */
export function generateSummary(hass: HomeAssistant | undefined, s: WeatherSnapshot): string {
  const de = lang(hass) === 'de';
  const n = (v: number, p = 0) => fmtNumber(hass, v, p);
  const tUnit = s.tempUnit ?? '°C';
  const parts: string[] = [];

  // 1. now
  if (s.condition && isNum(s.temp)) {
    const feels =
      isNum(s.feels) && Math.abs(s.feels - s.temp) >= 2
        ? de
          ? ` (gefühlt ${joinUnit(n(s.feels), tUnit)})`
          : ` (feels like ${joinUnit(n(s.feels), tUnit)})`
        : '';
    parts.push(
      de
        ? `Aktuell ${s.condition.toLowerCase()} bei ${joinUnit(n(s.temp), tUnit)}${feels}.`
        : `Currently ${s.condition.toLowerCase()} at ${joinUnit(n(s.temp), tUnit)}${feels}.`
    );
  } else if (s.condition) {
    parts.push(de ? `Aktuell ${s.condition.toLowerCase()}.` : `Currently ${s.condition.toLowerCase()}.`);
  } else if (isNum(s.temp)) {
    parts.push(de ? `Aktuell ${joinUnit(n(s.temp), tUnit)}.` : `Currently ${joinUnit(n(s.temp), tUnit)}.`);
  }

  // 2. range today
  if (isNum(s.hi) && isNum(s.lo)) {
    parts.push(
      de
        ? `Im Tagesverlauf ${joinUnit(n(s.lo), tUnit)} bis ${joinUnit(n(s.hi), tUnit)}.`
        : `Ranging from ${joinUnit(n(s.lo), tUnit)} to ${joinUnit(n(s.hi), tUnit)} today.`
    );
  }

  // 3. wind
  if (isNum(s.windSpeed) && s.windSpeed >= 1) {
    const strong = s.windSpeed >= 40;
    const dir = s.windDir ? (de ? ` aus ${s.windDir}` : ` from the ${s.windDir}`) : '';
    const desc = strong
      ? de
        ? 'Kräftiger Wind'
        : 'Strong winds'
      : de
        ? 'Wind'
        : 'Wind';
    parts.push(`${desc}${dir} ${de ? 'mit' : 'at'} ${joinUnit(n(s.windSpeed), s.windUnit ?? 'km/h')}.`);
  }

  // 4. rain advice
  if (isNum(s.precipProb) && s.precipProb >= 40) {
    parts.push(
      de
        ? `${n(s.precipProb)}% Regenwahrscheinlichkeit — Schirm nicht vergessen.`
        : `${n(s.precipProb)}% chance of rain — take an umbrella.`
    );
  } else if (isNum(s.precipMm) && s.precipMm >= 1) {
    parts.push(
      de
        ? `Rund ${joinUnit(n(s.precipMm, 1), 'mm')} Niederschlag erwartet.`
        : `About ${joinUnit(n(s.precipMm, 1), 'mm')} of precipitation expected.`
    );
  }

  // 5. UV
  if (isNum(s.uv) && s.uv >= 6) {
    parts.push(
      de
        ? `Hoher UV-Index (${n(s.uv)}) — an Sonnenschutz denken.`
        : `High UV index (${n(s.uv)}) — remember sun protection.`
    );
  }

  // 6. comfort note from temperature
  if (isNum(s.temp)) {
    if (s.temp <= 0) parts.push(de ? 'Frostig — warm einpacken.' : 'Freezing — bundle up.');
    else if (s.temp >= 30) parts.push(de ? 'Sehr heiß — viel trinken.' : 'Very hot — stay hydrated.');
  }

  // 7. tomorrow
  if (s.tomorrowCondition && isNum(s.tomorrowHi)) {
    const lo = isNum(s.tomorrowLo) ? `${joinUnit(n(s.tomorrowLo), tUnit)}–` : '';
    parts.push(
      de
        ? `Morgen ${s.tomorrowCondition.toLowerCase()}, ${lo}${joinUnit(n(s.tomorrowHi), tUnit)}.`
        : `Tomorrow ${s.tomorrowCondition.toLowerCase()}, ${lo}${joinUnit(n(s.tomorrowHi), tUnit)}.`
    );
  }

  return parts.join(' ');
}
