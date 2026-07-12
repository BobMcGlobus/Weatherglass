export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language: string;
  locale?: { language: string };
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  /** Optional: modern forecast subscriptions when the connection exposes it */
  connection?: {
    subscribeMessage<T>(
      cb: (msg: T) => void,
      msg: Record<string, unknown>
    ): Promise<() => void>;
  };
}

export type MetricType =
  | 'temperature'
  | 'feels_like'
  | 'wind'
  | 'precipitation'
  | 'humidity'
  | 'pressure'
  | 'uv'
  | 'cloud'
  | 'visibility'
  | 'air_quality'
  | 'sun'
  | 'sky'
  | 'summary'
  | 'custom';

export type GraphType = 'line' | 'bar' | 'progress' | 'none';
export type Aggregate = 'mean' | 'min' | 'max' | 'last' | 'sum';
export type TrendMode = 'up_good' | 'down_good' | 'neutral' | 'none';
/** atleast: goal reached at/above the value; atmost: at/below (e.g. keep wind low) */
export type GoalType = 'atleast' | 'atmost';
/** popup = built-in detail popup, more-info = native HA dialog */
export type TapAction = 'popup' | 'more-info' | 'link' | 'none';
export type CardStyle =
  | 'default'
  | 'withings'
  | 'glass'
  | 'material'
  | 'bubble'
  | 'mirror';

/** Forecast resolution requested from a weather entity */
export type ForecastType = 'hourly' | 'daily' | 'twice_daily';

/** A single forecast step (matches the Home Assistant weather forecast schema) */
export interface ForecastPoint {
  datetime: string;
  condition?: string;
  temperature?: number;
  templow?: number;
  precipitation?: number;
  precipitation_probability?: number;
  wind_speed?: number;
  wind_gust_speed?: number;
  wind_bearing?: number;
  humidity?: number;
  uv_index?: number;
  cloud_coverage?: number;
  pressure?: number;
  is_daytime?: boolean;
}

/** Precipitation broken into parts of the day (morning/noon/evening/night) */
export interface DayParts {
  morning?: string;
  noon?: string;
  evening?: string;
  night?: string;
}

/** The pinnable spot on the sky scene */
export type SkyAnchorPosition =
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'center'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom';

/** Value label pinned to a spot on the sky scene */
export interface SkyAnchor {
  entity: string;
  /** second entity, e.g. gust — arm-style anchors render both values */
  entity2?: string;
  name?: string;
  color?: string;
  position?: SkyAnchorPosition;
  /** free placement (percent of the scene area), overrides position */
  x?: number;
  y?: number;
  flip?: boolean;
  /** where the dot sits relative to the label (8-way) */
  dot?:
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';
}

export interface SeriesConfig {
  entity: string;
  name?: string;
  color?: string;
  unit?: string;
  /** Target: a number or an entity id */
  goal?: number | string;
}

export interface MetricConfig {
  type?: MetricType;
  /** Primary entity (shorthand for a single series) */
  entity?: string;
  /** Second entity, e.g. wind gust */
  entity2?: string;
  /** Multiple series (air quality pollutants, ...) */
  entities?: (string | SeriesConfig)[];
  /** Extra entities shown as "12 km/h • NW" below the value */
  secondary?: string[];
  name?: string;
  /** Big text shown instead of the value (e.g. "Sturmwarnung") */
  label?: string;
  icon?: string;
  color?: string;
  unit?: string;
  days?: number;
  graph?: GraphType;
  /** Target: a number or an entity id */
  goal?: number | string;
  /** Starting value: goal % = progress from start to goal */
  start?: number | string;
  /** Goal direction: atleast (default) or atmost */
  goal_type?: GoalType;
  precision?: number;
  aggregate?: Aggregate;
  trend?: TrendMode;
  /** Format the value as a duration ("7 h 12 min", e.g. sunshine) */
  duration?: boolean;
  /** Read this attribute instead of the state */
  attribute?: string;
  tap_action?: TapAction;
  /** Show the popup details (periods, big chart, stats) inline on the tile */
  expanded?: boolean;
  link?: string;
  /** Score/index metrics (air quality): maximum value (default 100) */
  max?: number;
  /** Precipitation: entities for the day-part breakdown */
  parts?: DayParts;
  /**
   * Optional score/warning entity (0-100 or level): traffic-light badge on the
   * tile. On sky metrics it drives the background weather glow.
   */
  score_entity?: string;
  /** Score metrics: sub-index categories (e.g. PM2.5 / PM10 / O3) */
  breakdown?: (string | SeriesConfig)[];

  /** ---- forecast ------------------------------------------------------- */
  /** Weather entity id to pull the forecast from (default: card-level weather) */
  forecast?: string;
  /** hourly (default) or daily forecast on this metric */
  forecast_type?: ForecastType;
  /** how many forecast steps to show in the strip (default 8) */
  forecast_count?: number;

  /** ---- sky (hero scene) ---------------------------------------------- */
  /** Weather entity or text sensor giving the condition (sunny/rainy/…) */
  condition_entity?: string;
  /** sun.sun entity (day/night, sun height) */
  sun_entity?: string;
  /** Force night mode regardless of the sun entity */
  night?: boolean;
  /** Wind entity — stronger wind drifts the clouds faster */
  wind_entity?: string;
  /** Value labels pinned onto the scene */
  anchors?: SkyAnchor[];
  /** Label chip background opacity (0-1, default 1) */
  label_opacity?: number;
  /** Vertical nudge of the scene in percent */
  scene_offset_y?: number;

  /** ---- sun (daylight arc) -------------------------------------------- */
  /** Sunrise time entity / attribute (overrides sun.sun) */
  sunrise_entity?: string;
  /** Sunset time entity / attribute (overrides sun.sun) */
  sunset_entity?: string;
  /** Moon phase entity (optional, shown as a small badge) */
  moon_entity?: string;

  /** ---- summary (AI) --------------------------------------------------- */
  /** Text entity providing a ready-made summary (e.g. an LLM/AI Task sensor) */
  summary_entity?: string;
  /** Entities the client-side summary generator should describe */
  summary_sources?: string[];
}

export interface WeatherCardConfig {
  type: string;
  title?: string;
  subtitle?: string;
  /** Default weather entity for forecast + condition across all metrics */
  weather?: string;
  /** Default history window in days for all metrics */
  days?: number;
  /** Grid columns for the metric tiles (1-3) */
  columns?: number;
  /** Render metrics as tinted tiles (default) or flat rows */
  tiles?: boolean;
  /** grid (default) or carousel: horizontally scrollable tiles */
  layout?: 'grid' | 'carousel';
  /** Visual style: default, withings (default), glass, material, bubble, mirror */
  card_style?: CardStyle;
  /** false: remove the ha-card background/shadow (for use inside containers) */
  background?: boolean;
  /** true: no outer padding, tiles run edge to edge */
  flush?: boolean;
  metrics: MetricConfig[];
}

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}
