import type { HomeAssistant } from './types';

const STRINGS: Record<string, Record<string, string>> = {
  en: {
    goal: 'Goal',
    rising: 'rising',
    falling: 'falling',
    stable: 'steady',
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    now: 'Now',
    no_data: 'No data',
    entity_missing: 'Entity not found',
    // metric names
    temperature: 'Temperature',
    feels_like: 'Feels like',
    wind: 'Wind',
    precipitation: 'Precipitation',
    humidity: 'Humidity',
    pressure: 'Pressure',
    uv: 'UV index',
    cloud: 'Cloud cover',
    visibility: 'Visibility',
    air_quality: 'Air quality',
    sun: 'Sun',
    sky: 'Weather',
    summary: 'Summary',
    custom: 'Sensor',
    // day parts (precipitation breakdown)
    part_morning: 'Morning',
    part_noon: 'Midday',
    part_evening: 'Evening',
    part_night: 'Night',
    // sun / daylight
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    daylength: 'Daylight',
    sunset_in: 'Sunset in {n}',
    sunrise_in: 'Sunrise in {n}',
    high: 'High',
    low: 'Low',
    of: 'of',
    // forecast
    forecast: 'Forecast',
    forecast_hourly: 'Hourly',
    forecast_daily: 'Daily',
    // dialog + stats
    close: 'Close',
    open_ha: 'Open in Home Assistant',
    stat_min: 'Min',
    stat_avg: 'Avg',
    stat_max: 'Max',
    stat_trend: 'Trend',
    goal_left: 'To goal',
    period_day: 'D',
    period_week: 'W',
    period_month: 'M',
    period_quarter: '3M',
    period_year: 'Y',
    period_max: 'Max',
    event_times: 'Rain events (7 days)',
    ai_note: 'Auto-generated summary',
    // weather conditions
    'cond_clear-night': 'Clear',
    cond_cloudy: 'Cloudy',
    cond_fog: 'Fog',
    cond_hail: 'Hail',
    cond_lightning: 'Thunderstorm',
    'cond_lightning-rainy': 'Thunderstorms',
    cond_partlycloudy: 'Partly cloudy',
    cond_pouring: 'Heavy rain',
    cond_rainy: 'Rainy',
    cond_snowy: 'Snow',
    'cond_snowy-rainy': 'Sleet',
    cond_sunny: 'Sunny',
    cond_windy: 'Windy',
    'cond_windy-variant': 'Windy',
    cond_exceptional: 'Exceptional',
  },
  de: {
    goal: 'Ziel',
    rising: 'steigend',
    falling: 'fallend',
    stable: 'gleichbleibend',
    today: 'Heute',
    yesterday: 'Gestern',
    tomorrow: 'Morgen',
    now: 'Jetzt',
    no_data: 'Keine Daten',
    entity_missing: 'Entität nicht gefunden',
    temperature: 'Temperatur',
    feels_like: 'Gefühlt',
    wind: 'Wind',
    precipitation: 'Niederschlag',
    humidity: 'Luftfeuchte',
    pressure: 'Luftdruck',
    uv: 'UV-Index',
    cloud: 'Bewölkung',
    visibility: 'Sichtweite',
    air_quality: 'Luftqualität',
    sun: 'Sonne',
    sky: 'Wetter',
    summary: 'Zusammenfassung',
    custom: 'Sensor',
    part_morning: 'Morgen',
    part_noon: 'Mittag',
    part_evening: 'Abend',
    part_night: 'Nacht',
    sunrise: 'Sonnenaufgang',
    sunset: 'Sonnenuntergang',
    daylength: 'Tageslänge',
    sunset_in: 'Untergang in {n}',
    sunrise_in: 'Aufgang in {n}',
    high: 'Max',
    low: 'Min',
    of: 'von',
    forecast: 'Vorhersage',
    forecast_hourly: 'Stündlich',
    forecast_daily: 'Täglich',
    close: 'Schließen',
    open_ha: 'In Home Assistant öffnen',
    stat_min: 'Min',
    stat_avg: 'Ø',
    stat_max: 'Max',
    stat_trend: 'Trend',
    goal_left: 'Bis Ziel',
    period_day: 'T',
    period_week: 'W',
    period_month: 'M',
    period_quarter: '3M',
    period_year: 'J',
    period_max: 'Max',
    event_times: 'Regen-Ereignisse (7 Tage)',
    ai_note: 'Automatisch erzeugte Zusammenfassung',
    'cond_clear-night': 'Klar',
    cond_cloudy: 'Bewölkt',
    cond_fog: 'Nebel',
    cond_hail: 'Hagel',
    cond_lightning: 'Gewitter',
    'cond_lightning-rainy': 'Gewitter mit Regen',
    cond_partlycloudy: 'Teils bewölkt',
    cond_pouring: 'Starkregen',
    cond_rainy: 'Regnerisch',
    cond_snowy: 'Schnee',
    'cond_snowy-rainy': 'Schneeregen',
    cond_sunny: 'Sonnig',
    cond_windy: 'Windig',
    'cond_windy-variant': 'Windig',
    cond_exceptional: 'Außergewöhnlich',
  },
};

/** 16-point compass, localized. Index = round(bearing / 22.5) % 16 */
const COMPASS: Record<string, string[]> = {
  en: ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'],
  de: ['N', 'NNO', 'NO', 'ONO', 'O', 'OSO', 'SO', 'SSO', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'],
};

export function lang(hass?: HomeAssistant): string {
  const l = hass?.locale?.language ?? hass?.language ?? 'en';
  return l.startsWith('de') ? 'de' : 'en';
}

export function t(hass: HomeAssistant | undefined, key: string): string {
  return STRINGS[lang(hass)][key] ?? STRINGS.en[key] ?? key;
}

/** Localized weather condition name (e.g. "Teils bewölkt"). */
export function conditionName(hass: HomeAssistant | undefined, condition?: string): string {
  if (!condition) return '';
  return t(hass, `cond_${condition}`);
}

/** Compass point for a wind bearing in degrees. */
export function windDir(hass: HomeAssistant | undefined, bearing?: number): string {
  if (bearing === undefined || !Number.isFinite(bearing)) return '';
  const table = COMPASS[lang(hass)] ?? COMPASS.en;
  return table[Math.round((bearing % 360) / 22.5) % 16];
}
