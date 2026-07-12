import type { HomeAssistant } from './types';
import { lang, t } from './i18n';

export function locale(hass: HomeAssistant | undefined): string {
  return lang(hass) === 'de' ? 'de-DE' : 'en-US';
}

export function fmtNumber(
  hass: HomeAssistant | undefined,
  value: number,
  precision?: number
): string {
  if (!Number.isFinite(value)) return '–';
  if (precision === undefined) {
    return new Intl.NumberFormat(locale(hass), { maximumFractionDigits: 2 }).format(value);
  }
  return new Intl.NumberFormat(locale(hass), {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value);
}

/** "12 km/h" but "85%" / "18°C" — no space before %, °, ' and " */
export function joinUnit(value: string, unit?: string): string {
  if (!unit) return value;
  return /^[%°'"]/.test(unit) ? `${value}${unit}` : `${value} ${unit}`;
}

/**
 * Formats a duration value as "7 h 12 min" (e.g. sunshine, daylight).
 * The source unit is taken from the entity ("min", "h", "s"); defaults to minutes.
 */
export function fmtDuration(value: number, unit?: string): string {
  if (!Number.isFinite(value)) return '–';
  let minutes: number;
  const u = (unit ?? 'min').toLowerCase();
  if (u.startsWith('h')) minutes = value * 60;
  else if (u === 's' || u.startsWith('sec')) minutes = value / 60;
  else minutes = value;
  const totalSec = Math.round(minutes * 60);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return m ? `${h} h ${m} min` : `${h} h`;
  if (m > 0) return s && m < 10 ? `${m} min ${s} s` : `${m} min`;
  return `${s} s`;
}

/** "7:42" if today, "Gestern" if yesterday, otherwise a short date. */
export function fmtLastUpdated(hass: HomeAssistant | undefined, iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const today = new Date();
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  if (sameDay(d, today)) {
    return d.toLocaleTimeString(locale(hass), { hour: 'numeric', minute: '2-digit' });
  }
  const yesterday = new Date(today.getTime() - 86400000);
  if (sameDay(d, yesterday)) return t(hass, 'yesterday');
  return d.toLocaleDateString(locale(hass), { day: 'numeric', month: 'short' });
}

/** Clock time "07:42" from an ISO string or a time-like state. */
export function fmtTime(hass: HomeAssistant | undefined, iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString(locale(hass), { hour: '2-digit', minute: '2-digit' });
}

/** "3 h 12 min" until a future time, using the duration formatter. */
export function fmtUntil(target: Date): string {
  const mins = (target.getTime() - Date.now()) / 60000;
  return mins > 0 ? fmtDuration(mins, 'min') : '';
}
