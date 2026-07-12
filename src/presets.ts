import type { Aggregate, GoalType, GraphType, MetricType, TrendMode } from './types';

export interface MetricPreset {
  icon: string;
  color: string;
  graph: GraphType;
  unit?: string;
  aggregate: Aggregate;
  trend: TrendMode;
  duration?: boolean;
  precision?: number;
  goalType?: GoalType;
}

/**
 * Theme-aware named colors: uses the HA theme color variables
 * (--red-color etc., themeable since HA 2022.12) with material fallbacks.
 */
const NAMED_COLORS: Record<string, string> = {
  red: '#F44336',
  pink: '#E91E63',
  purple: '#9C27B0',
  'deep-purple': '#673AB7',
  indigo: '#3F51B5',
  blue: '#2196F3',
  'light-blue': '#03A9F4',
  cyan: '#00BCD4',
  teal: '#009688',
  green: '#4CAF50',
  'light-green': '#8BC34A',
  lime: '#CDDC39',
  yellow: '#FFEB3B',
  amber: '#FFC107',
  orange: '#FF9800',
  'deep-orange': '#FF5722',
  brown: '#795548',
  grey: '#9E9E9E',
  'blue-grey': '#607D8B',
};

export const COLOR_NAMES = Object.keys(NAMED_COLORS);

export function resolveColor(color?: string): string | undefined {
  if (!color) return undefined;
  if (color === 'primary') return 'var(--primary-color)';
  if (color === 'accent') return 'var(--accent-color)';
  if (NAMED_COLORS[color]) return `var(--${color}-color, ${NAMED_COLORS[color]})`;
  return color;
}

export const PRESETS: Record<MetricType, MetricPreset> = {
  temperature: {
    icon: 'mdi:thermometer',
    color: 'orange',
    graph: 'line',
    unit: '°C',
    aggregate: 'mean',
    trend: 'neutral',
    precision: 1,
  },
  feels_like: {
    icon: 'mdi:thermometer-lines',
    color: 'deep-orange',
    graph: 'line',
    unit: '°C',
    aggregate: 'mean',
    trend: 'neutral',
    precision: 1,
  },
  wind: {
    icon: 'mdi:weather-windy',
    color: 'teal',
    graph: 'line',
    unit: 'km/h',
    aggregate: 'mean',
    trend: 'neutral',
    precision: 0,
  },
  precipitation: {
    icon: 'mdi:weather-pouring',
    color: 'blue',
    graph: 'bar',
    unit: 'mm',
    aggregate: 'sum',
    trend: 'neutral',
    precision: 1,
  },
  humidity: {
    icon: 'mdi:water-percent',
    color: 'light-blue',
    graph: 'progress',
    unit: '%',
    aggregate: 'mean',
    trend: 'neutral',
    precision: 0,
  },
  pressure: {
    icon: 'mdi:gauge',
    color: 'blue-grey',
    graph: 'line',
    unit: 'hPa',
    aggregate: 'mean',
    trend: 'neutral',
    precision: 0,
  },
  uv: {
    icon: 'mdi:weather-sunny-alert',
    color: 'amber',
    graph: 'progress',
    aggregate: 'max',
    trend: 'neutral',
    precision: 0,
    goalType: 'atmost',
  },
  cloud: {
    icon: 'mdi:weather-cloudy',
    color: 'blue-grey',
    graph: 'progress',
    unit: '%',
    aggregate: 'mean',
    trend: 'neutral',
    precision: 0,
    goalType: 'atmost',
  },
  visibility: {
    icon: 'mdi:eye',
    color: 'cyan',
    graph: 'line',
    unit: 'km',
    aggregate: 'mean',
    trend: 'up_good',
    precision: 1,
  },
  air_quality: {
    icon: 'mdi:air-filter',
    color: 'green',
    graph: 'none',
    aggregate: 'mean',
    trend: 'down_good',
    precision: 0,
    goalType: 'atmost',
  },
  sun: {
    icon: 'mdi:weather-sunset',
    color: 'amber',
    graph: 'none',
    aggregate: 'last',
    trend: 'none',
    precision: 0,
  },
  moon: {
    icon: 'mdi:moon-waning-crescent',
    color: 'blue-grey',
    graph: 'none',
    aggregate: 'last',
    trend: 'none',
    precision: 0,
  },
  tides: {
    icon: 'mdi:waves',
    color: 'light-blue',
    graph: 'none',
    unit: 'm',
    aggregate: 'mean',
    trend: 'neutral',
    precision: 1,
  },
  pollen: {
    icon: 'mdi:flower-pollen',
    color: 'green',
    graph: 'progress',
    aggregate: 'max',
    trend: 'down_good',
    precision: 0,
    goalType: 'atmost',
  },
  radar: {
    icon: 'mdi:radar',
    color: 'blue',
    graph: 'none',
    aggregate: 'last',
    trend: 'none',
    precision: 0,
  },
  sky: {
    icon: 'mdi:weather-partly-cloudy',
    color: 'blue',
    graph: 'none',
    aggregate: 'mean',
    trend: 'neutral',
    precision: 1,
  },
  summary: {
    icon: 'mdi:creation',
    color: 'deep-purple',
    graph: 'none',
    aggregate: 'mean',
    trend: 'none',
    precision: 0,
  },
  custom: {
    icon: 'mdi:chart-line',
    color: 'primary',
    graph: 'line',
    aggregate: 'mean',
    trend: 'neutral',
  },
};

/** Category colors for air-quality sub-indices (PM2.5 / PM10 / O3 …) */
export const BREAKDOWN_PALETTE = ['teal', 'amber', 'deep-orange', 'purple', 'pink'];

/** Default colors for additional series in multi-series metrics */
export const SERIES_PALETTE = ['teal', 'orange', 'pink', 'cyan', 'lime'];

/**
 * Maps Home Assistant weather condition strings to MDI icons. `-night`
 * variants are picked automatically for clear / partly cloudy at night.
 */
export const CONDITION_ICONS: Record<string, string> = {
  'clear-night': 'mdi:weather-night',
  cloudy: 'mdi:weather-cloudy',
  fog: 'mdi:weather-fog',
  hail: 'mdi:weather-hail',
  lightning: 'mdi:weather-lightning',
  'lightning-rainy': 'mdi:weather-lightning-rainy',
  partlycloudy: 'mdi:weather-partly-cloudy',
  pouring: 'mdi:weather-pouring',
  rainy: 'mdi:weather-rainy',
  snowy: 'mdi:weather-snowy',
  'snowy-rainy': 'mdi:weather-snowy-rainy',
  sunny: 'mdi:weather-sunny',
  windy: 'mdi:weather-windy',
  'windy-variant': 'mdi:weather-windy-variant',
  exceptional: 'mdi:weather-cloudy-alert',
};

export function conditionIcon(condition?: string, isDay = true): string {
  if (!condition) return isDay ? 'mdi:weather-partly-cloudy' : 'mdi:weather-night';
  if (!isDay) {
    if (condition === 'sunny') return 'mdi:weather-night';
    if (condition === 'partlycloudy') return 'mdi:weather-night-partly-cloudy';
  }
  return CONDITION_ICONS[condition] ?? 'mdi:weather-partly-cloudy';
}
