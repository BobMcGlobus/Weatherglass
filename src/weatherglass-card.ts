import { LitElement, html, css, nothing } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  Aggregate,
  ForecastPoint,
  ForecastType,
  GoalType,
  GraphType,
  HomeAssistant,
  HassEntity,
  MetricConfig,
  MetricType,
  SeriesConfig,
  SkyAnchor,
  TrendMode,
  WeatherCardConfig,
} from './types';
import {
  BREAKDOWN_PALETTE,
  PRESETS,
  SERIES_PALETTE,
  conditionIcon,
  resolveColor,
} from './presets';
import type { MetricPreset } from './presets';
import { skyScene } from './sky';
import { generateSummary } from './summary';
import type { WeatherSnapshot } from './summary';
import { conditionName, t, windDir } from './i18n';
import {
  fmtDuration,
  fmtLastUpdated,
  fmtNumber,
  fmtTime,
  fmtUntil,
  joinUnit,
  locale,
} from './format';
import {
  bucketDaily,
  bucketHourly,
  bucketsFromStats,
  fetchHistory,
  fetchStats,
  fillGaps,
  trendDelta,
} from './history';
import type { HistoryMap, StatsMap, StatsPeriod } from './history';
import { fetchForecast, isWeatherEntity } from './forecast';
import {
  barChart,
  lineChart,
  moonDisc,
  scoreGraphic,
  sunArc,
  tideChart,
  windCompass,
} from './charts';
import type { AxisMark, ChartOpts } from './charts';
import './editor';

const CARD_VERSION = '0.3.1';

const REFETCH_MIN_MS = 5 * 60 * 1000;
const REFETCH_MAX_AGE_MS = 15 * 60 * 1000;
const FORECAST_MAX_AGE_MS = 15 * 60 * 1000;

interface SeriesData extends SeriesConfig {
  colorResolved: string;
  buckets: number[];
  filled: number[];
}

interface MetricCtx {
  m: MetricConfig;
  type: MetricType;
  preset: MetricPreset;
  accent: string;
  name: string;
  icon: string;
  series: SeriesConfig[];
  primaryState?: HassEntity;
  days: number;
  kind: RangeKind;
  graph: GraphType;
  aggregate: Aggregate;
  trendMode: TrendMode;
  precision?: number;
  unit: string;
  data: SeriesData[];
  valueOverride?: number;
  goalType: GoalType;
  multi: boolean;
}

const CARD_STYLES = ['default', 'glass', 'material', 'bubble', 'mirror'];

/** Types drawn as a score/index ring */
const RING_TYPES: MetricType[] = ['air_quality'];
/** Types that can carry a forecast strip */
const FORECAST_TYPES: MetricType[] = [
  'temperature',
  'feels_like',
  'wind',
  'precipitation',
  'humidity',
  'uv',
  'pressure',
  'cloud',
  'sky',
];

/** Which forecast field feeds a metric's tile chart */
const FC_KEYS: Partial<Record<MetricType, keyof ForecastPoint>> = {
  temperature: 'temperature',
  feels_like: 'temperature',
  wind: 'wind_speed',
  precipitation: 'precipitation',
  humidity: 'humidity',
  pressure: 'pressure',
  cloud: 'cloud_coverage',
  uv: 'uv_index',
};

type RangeKind = 'hour' | 'day' | 'month';

interface PopupRange {
  key: string;
  kind: RangeKind;
  count: number;
}

const POPUP_RANGES: PopupRange[] = [
  { key: 'day', kind: 'hour', count: 24 },
  { key: 'week', kind: 'day', count: 7 },
  { key: 'month', kind: 'day', count: 30 },
  { key: 'quarter', kind: 'day', count: 90 },
  { key: 'year', kind: 'day', count: 365 },
  { key: 'max', kind: 'month', count: 60 },
];

@customElement('weatherglass-card')
export class WeatherCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: WeatherCardConfig;
  @state() private _history: HistoryMap = {};
  @state() private _popup: number | null = null;
  @state() private _popupRange: string | null = null;
  @state() private _tileRanges: Record<number, string> = {};
  @state() private _statsCache: Record<string, StatsMap> = {};
  @state() private _forecasts: Record<string, ForecastPoint[]> = {};
  private _statsCacheTime: Record<string, number> = {};
  private _statsFetching = new Set<string>();
  private _forecastTime: Record<string, number> = {};
  private _forecastFetching = new Set<string>();

  private _onKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && this._popup !== null) this._popup = null;
  };

  public connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('keydown', this._onKeydown);
  }

  public disconnectedCallback(): void {
    window.removeEventListener('keydown', this._onKeydown);
    super.disconnectedCallback();
  }

  private _fetching = false;
  private _cfgSig = '';
  private _stateSig = '';
  private _lastFetch = 0;

  public static getConfigElement(): HTMLElement {
    return document.createElement('weatherglass-card-editor');
  }

  public static getStubConfig(hass: HomeAssistant): Partial<WeatherCardConfig> {
    const weather = Object.keys(hass.states).find((id) => id.startsWith('weather.'));
    const metrics: MetricConfig[] = [];
    if (weather) {
      metrics.push({ type: 'sky', entity: weather });
      metrics.push({ type: 'summary' });
    } else {
      metrics.push({ type: 'temperature', entity: '' });
    }
    return { title: 'Wetter', weather, metrics };
  }

  public setConfig(config: WeatherCardConfig): void {
    if (!config || !Array.isArray(config.metrics) || !config.metrics.length) {
      throw new Error('Please define at least one metric (metrics: [...])');
    }
    this._config = config;
  }

  public getCardSize(): number {
    const rows = Math.ceil(
      (this._config?.metrics.length ?? 1) / (this._config?.columns ?? 1)
    );
    return 1 + rows * 2;
  }

  public getGridOptions(): Record<string, number> {
    return { columns: 12, min_columns: 6 };
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('hass') || changed.has('_config')) {
      void this._maybeFetch();
      this._syncForecasts();
    }
    this._syncStats();
    if (
      changed.has('_popup') ||
      changed.has('_popupRange') ||
      changed.has('_tileRanges') ||
      changed.has('_statsCache')
    ) {
      this.renderRoot
        ?.querySelectorAll('.chart-scroll')
        .forEach((sc) => ((sc as HTMLElement).scrollLeft = sc.scrollWidth));
    }
  }

  private _activeRange(): PopupRange | null {
    return POPUP_RANGES.find((r) => r.key === this._popupRange) ?? null;
  }

  /* ---- forecast ------------------------------------------------------- */

  private _defaultForecastType(type?: MetricType): ForecastType {
    // hourly everywhere ("stündlich" first); the sky hero + summary stay daily
    return type === 'sky' || type === 'summary' ? 'daily' : 'hourly';
  }

  /** The weather entity a metric draws its forecast from, if any. */
  private _forecastId(m: MetricConfig): string | undefined {
    if (m.forecast) return m.forecast;
    if (isWeatherEntity(m.entity)) return m.entity;
    return this._config?.weather;
  }

  private _forecastFor(id?: string, type: ForecastType = 'daily'): ForecastPoint[] {
    if (!id) return [];
    return this._forecasts[`${id}|${type}`] ?? [];
  }

  private _syncForecasts(): void {
    if (!this.hass || !this._config) return;
    const need = new Set<string>();
    const weather = this._config.weather;
    if (weather && this.hass.states[weather]) {
      need.add(`${weather}|daily`);
      need.add(`${weather}|hourly`);
    }
    this._config.metrics.forEach((m) => {
      const type = m.type ?? 'custom';
      const id = this._forecastId(m);
      if (!id || !this.hass.states[id]) return;
      if (FORECAST_TYPES.includes(type) || type === 'summary' || m.forecast) {
        need.add(`${id}|${m.forecast_type ?? this._defaultForecastType(type)}`);
      }
    });
    for (const key of need) {
      const [id, type] = key.split('|');
      this._ensureForecast(id, type as ForecastType);
    }
  }

  private _ensureForecast(id: string, type: ForecastType): void {
    const key = `${id}|${type}`;
    const fresh =
      this._forecasts[key] && Date.now() - (this._forecastTime[key] ?? 0) < FORECAST_MAX_AGE_MS;
    if (fresh || this._forecastFetching.has(key)) return;
    this._forecastFetching.add(key);
    fetchForecast(this.hass, id, type)
      .then((points) => {
        this._forecastTime[key] = Date.now();
        this._forecasts = { ...this._forecasts, [key]: points };
      })
      .catch((e) => console.warn('weatherglass-card: forecast fetch failed', e))
      .finally(() => this._forecastFetching.delete(key));
  }

  /* ---- statistics + history ------------------------------------------ */

  private _syncStats(): void {
    if (!this.hass || !this._config) return;
    const active: PopupRange[] = [];
    if (this._popup !== null) {
      const r = this._activeRange();
      if (r) active.push(r);
    }
    this._config.metrics.forEach((m, i) => {
      if (!m.expanded) return;
      const r = POPUP_RANGES.find((x) => x.key === this._tileRanges[i]);
      if (r) active.push(r);
    });
    for (const r of active) {
      const period: StatsPeriod | null =
        r.kind === 'month' ? 'month' : r.kind === 'day' && r.count > 10 ? 'day' : null;
      if (period) this._ensureStats(period, r.count);
    }
  }

  private _ensureStats(period: StatsPeriod, count: number): void {
    const key = `${period}|${count}`;
    const fresh =
      this._statsCache[key] && Date.now() - (this._statsCacheTime[key] ?? 0) < 1800000;
    if (fresh || this._statsFetching.has(key)) return;
    const ids = this._watchedEntities();
    if (!ids.length) return;
    this._statsFetching.add(key);
    fetchStats(this.hass, ids, count, period)
      .then((data) => {
        this._statsCacheTime[key] = Date.now();
        this._statsCache = { ...this._statsCache, [key]: data };
      })
      .catch((e) => console.warn('weatherglass-card: statistics fetch failed', e))
      .finally(() => this._statsFetching.delete(key));
  }

  private _bucketsFor(
    id: string,
    kind: RangeKind,
    count: number,
    aggregate: Aggregate
  ): number[] {
    if (kind === 'hour') {
      return bucketHourly(this._history[id] ?? [], count, aggregate);
    }
    if (kind === 'month') {
      const rows = this._statsCache[`month|${count}`]?.[id];
      return rows?.length
        ? bucketsFromStats(rows, count, aggregate, 'month')
        : new Array(count).fill(NaN);
    }
    if (count > 10) {
      const rows = this._statsCache[`day|${count}`]?.[id];
      if (rows?.length) return bucketsFromStats(rows, count, aggregate, 'day');
    }
    return bucketDaily(this._history[id] ?? [], count, aggregate);
  }

  private _watchedEntities(): string[] {
    const ids = new Set<string>();
    for (const m of this._config?.metrics ?? []) {
      for (const s of this._series(m)) if (s.entity) ids.add(s.entity);
      for (const id of m.secondary ?? []) ids.add(id);
      for (const id of Object.values(m.parts ?? {})) if (id) ids.add(id);
      if (m.score_entity) ids.add(m.score_entity);
      if (m.wind_entity) ids.add(m.wind_entity);
      for (const a of m.anchors ?? []) {
        ids.add(a.entity);
        if (a.entity2) ids.add(a.entity2);
      }
      for (const b of m.breakdown ?? []) ids.add(typeof b === 'string' ? b : b.entity);
    }
    // weather.* entities have non-numeric states; exclude from history
    return [...ids].filter(
      (id) => this.hass?.states[id] && !id.startsWith('weather.')
    );
  }

  private _resolveGoal(goal?: number | string): number {
    if (typeof goal === 'number') return goal;
    if (typeof goal !== 'string' || !goal) return NaN;
    const st = this.hass.states[goal];
    return st ? parseFloat(st.state) : parseFloat(goal);
  }

  private _handleTap(m: MetricConfig, index: number, entityId?: string): void {
    const action = m.tap_action ?? 'popup';
    if (action === 'none') return;
    if (action === 'link') {
      if (!m.link) return;
      if (/^https?:\/\//.test(m.link)) {
        window.open(m.link, '_blank', 'noopener');
        return;
      }
      history.pushState(null, '', m.link);
      this.dispatchEvent(new Event('location-changed', { bubbles: true, composed: true }));
      return;
    }
    if (action === 'more-info') {
      this._moreInfo(entityId);
      return;
    }
    // hourly ("T") is the default view; daily-sum metrics open on the week
    this._popupRange = m.type === 'precipitation' ? 'week' : 'day';
    this._popup = index;
  }

  private _maybeFetch(): void {
    if (!this.hass || !this._config || this._fetching) return;
    const ids = this._watchedEntities();
    if (!ids.length) return;
    const days = Math.max(
      ...this._config.metrics.map((m) => m.days ?? this._config!.days ?? 7)
    );
    const cfgSig = `${days}|${ids.join(',')}`;
    const stateSig = ids.map((id) => this.hass.states[id]?.last_updated ?? '').join('|');
    const now = Date.now();
    const stale =
      cfgSig !== this._cfgSig ||
      now - this._lastFetch > REFETCH_MAX_AGE_MS ||
      (stateSig !== this._stateSig && now - this._lastFetch > REFETCH_MIN_MS);
    if (!stale) return;

    this._fetching = true;
    this._cfgSig = cfgSig;
    this._stateSig = stateSig;
    fetchHistory(this.hass, ids, days)
      .then((h) => {
        this._history = h;
        this._lastFetch = Date.now();
      })
      .catch((e) => console.warn('weatherglass-card: history fetch failed', e))
      .finally(() => (this._fetching = false));
  }

  private _series(m: MetricConfig): SeriesConfig[] {
    if (m.entities?.length) {
      return m.entities.map((e) => (typeof e === 'string' ? { entity: e } : e));
    }
    const list: SeriesConfig[] = [];
    if (m.entity) list.push({ entity: m.entity });
    if (m.entity2) list.push({ entity: m.entity2 });
    // sky without an explicit entity falls back to the card weather entity
    if (!list.length && m.type === 'sky' && this._config?.weather) {
      list.push({ entity: this._config.weather });
    }
    return list;
  }

  private _numeric(stateObj?: HassEntity, attribute?: string): number {
    if (!stateObj) return NaN;
    const raw = attribute ? stateObj.attributes[attribute] : stateObj.state;
    return typeof raw === 'number' ? raw : parseFloat(raw);
  }

  private _moreInfo(entityId?: string): void {
    if (!entityId) return;
    this.dispatchEvent(
      new CustomEvent('hass-more-info', {
        detail: { entityId },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _cardStyle(): string {
    const s = this._config?.card_style ?? 'default';
    return CARD_STYLES.includes(s) ? s : 'default';
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    const c = this._config;
    const style = this._cardStyle();
    const cardClass = [
      'cardroot',
      `s-${style}`,
      c.tiles === false ? 'flat' : 'tiles',
      c.flush ? 'flush' : '',
    ].join(' ');
    const inner = html`
      ${c.title
        ? html`<div class="header">
            <div class="title">${c.title}</div>
            ${c.subtitle ? html`<div class="subtitle">${c.subtitle}</div>` : nothing}
          </div>`
        : nothing}
      <div
        class="metrics ${c.layout === 'carousel' ? 'carousel' : ''}"
        style="--wc-columns:${c.columns ?? 1}"
      >
        ${c.metrics.map((m, i) => this._renderMetric(m, i))}
      </div>
    `;
    return html`
      ${c.background === false
        ? html`<div class="${cardClass} nobg">${inner}</div>`
        : html`<ha-card class=${cardClass}>${inner}</ha-card>`}
      ${this._renderPopup()}
    `;
  }

  private _ctx(m: MetricConfig, range?: PopupRange | null): MetricCtx {
    const type = (m.type && PRESETS[m.type] ? m.type : 'custom') as MetricType;
    const preset = PRESETS[type];
    const accent = resolveColor(m.color) ?? resolveColor(preset.color)!;
    const name = m.name ?? t(this.hass, type);
    const icon = m.icon ?? preset.icon;
    let series = this._series(m);
    const partIds = Object.values(m.parts ?? {}).filter(Boolean) as string[];
    if (!series.length && type === 'precipitation' && partIds.length) {
      series = [{ entity: partIds[0] }];
    }
    const primaryState = series[0]?.entity ? this.hass.states[series[0].entity] : undefined;
    const kind: RangeKind = range?.kind ?? 'day';
    const days = Math.max(1, range?.count ?? m.days ?? this._config?.days ?? 7);
    const graph = m.graph ?? preset.graph;
    const aggregate = m.aggregate ?? preset.aggregate;
    const trendMode = m.trend ?? preset.trend;
    const precision = m.precision ?? preset.precision;
    const unit =
      m.unit ??
      series[0]?.unit ??
      primaryState?.attributes.unit_of_measurement ??
      preset.unit ??
      '';

    const data: SeriesData[] = series.map((s, i) => {
      const buckets = this._bucketsFor(s.entity, kind, days, aggregate);
      return {
        ...s,
        colorResolved:
          resolveColor(s.color) ??
          (i === 0
            ? accent
            : resolveColor(SERIES_PALETTE[(i - 1) % SERIES_PALETTE.length])!),
        buckets,
        filled: fillGaps(buckets),
      };
    });

    // precipitation with parts but no total entity: value + chart = sum of parts
    let valueOverride: number | undefined;
    if (type === 'precipitation' && !m.entity && m.parts && data.length) {
      const ids = partIds;
      const perPart = ids.map((id) => this._bucketsFor(id, kind, days, aggregate));
      const combined = Array.from({ length: days }, (_, i) => {
        const vals = perPart.map((b) => b[i]).filter(Number.isFinite);
        return vals.length ? vals.reduce((a, b) => a + b, 0) : NaN;
      });
      data[0] = { ...data[0], buckets: combined, filled: fillGaps(combined) };
      const current = ids
        .map((id) => this._numeric(this.hass.states[id]))
        .filter(Number.isFinite);
      if (current.length) valueOverride = current.reduce((a, b) => a + b, 0);
    }

    return {
      m,
      type,
      preset,
      accent,
      name,
      icon,
      series,
      primaryState,
      days,
      kind,
      graph,
      aggregate,
      trendMode,
      precision,
      unit,
      data,
      valueOverride,
      goalType: m.goal_type ?? preset.goalType ?? 'atleast',
      multi: !!m.entities && series.length > 1,
    };
  }

  private _renderMetric(m: MetricConfig, index: number): TemplateResult {
    const c = this._ctx(m);
    // metrics that don't need a numeric primary entity
    if (c.type === 'summary') return this._renderSummary(c, index);
    if (c.type === 'sun') return this._renderSun(c, index);
    if (c.type === 'moon') return this._renderMoon(c, index);
    if (c.type === 'tides') return this._renderTides(c, index);
    if (c.type === 'radar') return this._renderRadar(c, index);

    if (!c.series.length || !c.primaryState) {
      return html`
        <div class="metric" style="--wc-accent:${c.accent}">
          <div class="head">
            <div class="iconchip"><ha-icon .icon=${c.icon}></ha-icon></div>
            <div class="name">${c.name}</div>
          </div>
          <div class="missing">
            ${c.series[0]?.entity
              ? html`${t(this.hass, 'entity_missing')}: ${c.series[0].entity}`
              : t(this.hass, 'no_data')}
          </div>
        </div>
      `;
    }

    if (c.type === 'sky') return this._renderSky(c, index);
    if (c.type === 'pollen') return this._renderPollen(c, index);
    if (RING_TYPES.includes(c.type)) return this._renderScore(c, index);

    if (m.expanded) {
      const r = POPUP_RANGES.find((x) => x.key === this._tileRanges[index]) ?? null;
      const ce = r ? this._ctx(m, r) : c;
      const activeKey =
        this._tileRanges[index] ?? (ce.days === 7 && ce.kind === 'day' ? 'week' : '');
      return html`
        <div
          class="metric expanded ${(m.tap_action ?? 'popup') === 'none' ? 'noclick' : ''}"
          style="--wc-accent:${c.accent}"
          @click=${() => this._handleTap(m, index, c.series[0].entity)}
        >
          <div class="head">
            <div class="iconchip"><ha-icon .icon=${c.icon}></ha-icon></div>
            <div class="name">${c.name}</div>
            ${this._renderScoreBadge(m)}
            <div class="time">${fmtLastUpdated(this.hass, c.primaryState.last_updated)}</div>
          </div>
          <div class="exp-value">
            ${this._renderValue(m, ce)}
            ${this._renderStatus(m, ce)}
          </div>
          ${this._renderDetails(m, ce, activeKey, (k) => {
            this._tileRanges = { ...this._tileRanges, [index]: k };
          })}
        </div>
      `;
    }

    const showValue = !c.multi || !!m.label;
    const showChips = c.multi && c.graph !== 'progress';
    const showStatus = !c.multi;
    const stack = c.multi && c.graph === 'progress';
    const fc = this._metricForecast(m);

    return html`
      <div
        class="metric ${(m.tap_action ?? 'popup') === 'none' ? 'noclick' : ''}"
        style="--wc-accent:${c.accent}"
        @click=${() => this._handleTap(m, index, c.series[0].entity)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${c.icon}></ha-icon></div>
          <div class="name">${c.name}</div>
          ${this._renderScoreBadge(m)}
          <div class="time">${fmtLastUpdated(this.hass, c.primaryState.last_updated)}</div>
        </div>
        <div class="body ${stack ? 'stack' : ''}">
          ${showValue || showChips || showStatus || m.secondary?.length
            ? html`<div class="info">
                ${showValue ? this._renderValue(m, c) : nothing}
                ${showChips
                  ? this._renderSeriesChips(c.data, c.precision, c.trendMode)
                  : nothing}
                ${this._renderSecondary(m)}
                ${showStatus ? this._renderStatus(m, c) : nothing}
              </div>`
            : nothing}
          <div class="chartcell">
            ${this._renderChart(m, c.graph, c.data, c.unit, c.precision)}
          </div>
        </div>
        ${c.type === 'precipitation' && m.parts ? this._renderParts(m) : nothing}
        ${fc ? this._renderForecast(fc.points, fc.type, m.forecast_count ?? 8) : nothing}
      </div>
    `;
  }

  /* ---- forecast strip ------------------------------------------------- */

  private _metricForecast(
    m: MetricConfig
  ): { points: ForecastPoint[]; type: ForecastType } | undefined {
    const type = m.type ?? 'custom';
    if (!FORECAST_TYPES.includes(type) && !m.forecast) return undefined;
    const id = this._forecastId(m);
    const ftype = m.forecast_type ?? this._defaultForecastType(type);
    const points = this._forecastFor(id, ftype);
    return points.length ? { points, type: ftype } : undefined;
  }

  /**
   * Numeric forecast series for a metric's tile chart (forecast-first view).
   * Returns undefined when the metric opted into history (`chart_source`),
   * has no matching forecast field or the forecast is too thin to plot.
   */
  private _forecastChartData(
    m: MetricConfig,
    type: MetricType
  ): { values: number[]; xMarks: AxisMark[] } | undefined {
    if ((m.chart_source ?? 'forecast') === 'history') return undefined;
    const key = FC_KEYS[type];
    if (!key) return undefined;
    const fc = this._metricForecast(m);
    if (!fc) return undefined;
    const hourly = fc.type === 'hourly';
    const count = m.forecast_count ?? (hourly ? 18 : 7);
    const points = fc.points.slice(0, count);
    const values = points.map((p) => {
      const v = p[key];
      return typeof v === 'number' && Number.isFinite(v) ? v : NaN;
    });
    if (values.filter(Number.isFinite).length < 2) return undefined;
    const loc = locale(this.hass);
    const xMarks: AxisMark[] = [];
    points.forEach((p, i) => {
      const d = new Date(p.datetime);
      if (isNaN(d.getTime())) return;
      if (hourly) {
        const hh = d.getHours();
        if (hh % 6 === 0) xMarks.push({ i, label: String(hh), line: hh === 0 });
      } else {
        xMarks.push({ i, label: d.toLocaleDateString(loc, { weekday: 'narrow' }) });
      }
    });
    return { values, xMarks };
  }

  private _fcLabel(p: ForecastPoint, ftype: ForecastType, first: boolean): string {
    const d = new Date(p.datetime);
    if (isNaN(d.getTime())) return '';
    if (ftype === 'hourly') {
      if (first) return t(this.hass, 'now');
      return d.toLocaleTimeString(locale(this.hass), { hour: '2-digit' });
    }
    if (first) return t(this.hass, 'today');
    return d.toLocaleDateString(locale(this.hass), { weekday: 'short' });
  }

  private _renderForecast(
    points: ForecastPoint[],
    ftype: ForecastType,
    count: number
  ): TemplateResult {
    const steps = points.slice(0, count);
    return html`<div class="forecast">
      ${steps.map((p, i) => {
        const isDay = p.is_daytime ?? true;
        const prob = p.precipitation_probability;
        const chip =
          typeof prob === 'number' && prob >= 5
            ? html`<span class="fc-pop">${fmtNumber(this.hass, prob, 0)}%</span>`
            : typeof p.precipitation === 'number' && p.precipitation >= 0.2
              ? html`<span class="fc-pop">${fmtNumber(this.hass, p.precipitation, 1)}</span>`
              : html`<span class="fc-pop empty"></span>`;
        return html`<div class="fc-step">
          <span class="fc-when">${this._fcLabel(p, ftype, i === 0)}</span>
          <ha-icon class="fc-ico" .icon=${conditionIcon(p.condition, isDay)}></ha-icon>
          ${chip}
          <span class="fc-temp">
            ${typeof p.temperature === 'number'
              ? html`${fmtNumber(this.hass, p.temperature, 0)}°`
              : '–'}
            ${ftype !== 'hourly' && typeof p.templow === 'number'
              ? html`<span class="fc-lo">${fmtNumber(this.hass, p.templow, 0)}°</span>`
              : nothing}
          </span>
        </div>`;
      })}
    </div>`;
  }

  /* ---- air quality / index ring -------------------------------------- */

  private _breakdown(m: MetricConfig) {
    return (m.breakdown ?? [])
      .map((b, i) => {
        const cfg = typeof b === 'string' ? { entity: b } : b;
        const st = this.hass.states[cfg.entity];
        return {
          ...cfg,
          state: st,
          value: this._numeric(st),
          name: cfg.name ?? st?.attributes.friendly_name ?? cfg.entity,
          colorResolved:
            resolveColor(cfg.color) ??
            resolveColor(BREAKDOWN_PALETTE[i % BREAKDOWN_PALETTE.length])!,
        };
      })
      .filter((b) => b.state);
  }

  private _renderScore(c: MetricCtx, index: number): TemplateResult {
    const m = c.m;
    const primaryState = c.primaryState!;
    const v = this._numeric(primaryState, m.attribute);
    const max = m.max ?? 100;
    const goodHigh = (m.goal_type ?? c.preset.goalType) !== 'atmost';

    const breakdown = this._breakdown(m);
    const withValue = breakdown.filter((b) => Number.isFinite(b.value) && b.value > 0);
    const sum = withValue.reduce((a, b) => a + b.value, 0);
    const segments =
      sum > 0
        ? withValue.map((b) => ({ color: b.colorResolved, share: b.value / sum }))
        : undefined;
    return html`
      <div
        class="metric score-metric ${(m.tap_action ?? 'popup') === 'none' ? 'noclick' : ''}"
        style="--wc-accent:${c.accent}"
        @click=${() => this._handleTap(m, index, primaryState.entity_id)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${c.icon}></ha-icon></div>
          <div class="name">${c.name}</div>
          <div class="time">${fmtLastUpdated(this.hass, primaryState.last_updated)}</div>
        </div>
        <div class="scorewrap">
          ${scoreGraphic(
            this._cardStyle(),
            c.accent,
            this._scoreColor(v, max, goodHigh),
            Math.max(0, Math.min(Number.isFinite(v) ? v / max : 0, 1)),
            segments
          )}
          <div class="scoreinner">
            <div class="scorenum">${fmtNumber(this.hass, v, m.precision ?? 0)}</div>
            <div class="scoremax">${t(this.hass, 'of')} ${max}</div>
          </div>
        </div>
        ${breakdown.length
          ? html`<div class="score-bars">
              ${breakdown.map((b) => {
                const pct = Number.isFinite(b.value)
                  ? Math.max(0, Math.min((b.value / max) * 100, 100))
                  : 0;
                return html`<div class="sbar">
                  <span class="sbar-name">${b.name}</span>
                  <div class="sbar-track">
                    <div
                      class="sbar-fill"
                      style="width:${pct}%;background:${b.colorResolved}"
                    ></div>
                  </div>
                  <span class="sbar-val">
                    ${Number.isFinite(b.value) ? fmtNumber(this.hass, b.value, 0) : '–'}
                  </span>
                </div>`;
              })}
            </div>`
          : nothing}
        <div class="score-status">${this._renderStatus(m, c)}</div>
      </div>
    `;
  }

  /* ---- sun / daylight arc -------------------------------------------- */

  private _sunTimes(m: MetricConfig): { sunrise?: Date; sunset?: Date; up: boolean } {
    const parse = (raw?: string): Date | undefined => {
      if (!raw) return undefined;
      const d = new Date(raw);
      if (!isNaN(d.getTime())) return d;
      // "HH:MM[:SS]" → today at that time
      const m2 = /^(\d{1,2}):(\d{2})/.exec(raw);
      if (m2) {
        const t2 = new Date();
        t2.setHours(+m2[1], +m2[2], 0, 0);
        return t2;
      }
      return undefined;
    };
    let sunrise = parse(this.hass.states[m.sunrise_entity ?? '']?.state);
    let sunset = parse(this.hass.states[m.sunset_entity ?? '']?.state);
    const sun = this.hass.states[m.sun_entity ?? 'sun.sun'];
    const up = sun ? sun.state === 'above_horizon' : true;
    if (sun && (!sunrise || !sunset)) {
      const nr = parse(sun.attributes.next_rising);
      const ns = parse(sun.attributes.next_setting);
      if (up) {
        sunset = sunset ?? ns;
        sunrise = sunrise ?? (nr ? new Date(nr.getTime() - 86400000) : undefined);
      } else {
        sunrise = sunrise ?? nr;
        sunset = sunset ?? ns;
      }
    }
    return { sunrise, sunset, up };
  }

  private _renderSun(c: MetricCtx, index: number): TemplateResult {
    const m = c.m;
    const { sunrise, sunset, up } = this._sunTimes(m);
    let progress = 0.5;
    if (sunrise && sunset && sunset > sunrise) {
      progress = (Date.now() - sunrise.getTime()) / (sunset.getTime() - sunrise.getTime());
    }
    const dayLenMs =
      sunrise && sunset && sunset > sunrise ? sunset.getTime() - sunrise.getTime() : NaN;
    const note = up
      ? sunset && sunset > new Date()
        ? t(this.hass, 'sunset_in').replace('{n}', fmtUntil(sunset))
        : ''
      : sunrise && sunrise > new Date()
        ? t(this.hass, 'sunrise_in').replace('{n}', fmtUntil(sunrise))
        : '';
    const tapId = m.entity ?? m.sun_entity ?? 'sun.sun';
    return html`
      <div
        class="metric sun-metric ${(m.tap_action ?? 'more-info') === 'none' ? 'noclick' : ''}"
        style="--wc-accent:${c.accent}"
        @click=${() => this._handleTap({ tap_action: 'more-info', ...m }, index, tapId)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${c.icon}></ha-icon></div>
          <div class="name">${c.name}</div>
        </div>
        <div class="sunwrap">${sunArc(progress, !up, c.accent)}</div>
        <div class="sun-times">
          <div class="sun-end">
            <ha-icon icon="mdi:weather-sunset-up"></ha-icon>
            <span>${sunrise ? fmtTime(this.hass, sunrise.toISOString()) : '–'}</span>
          </div>
          ${Number.isFinite(dayLenMs)
            ? html`<div class="sun-daylen">
                ${fmtDuration(dayLenMs / 60000, 'min')}
              </div>`
            : nothing}
          <div class="sun-end">
            <span>${sunset ? fmtTime(this.hass, sunset.toISOString()) : '–'}</span>
            <ha-icon icon="mdi:weather-sunset-down"></ha-icon>
          </div>
        </div>
        ${note ? html`<div class="sun-note">${note}</div>` : nothing}
      </div>
    `;
  }

  /* ---- moon phase ----------------------------------------------------- */

  private static readonly MOON_MAP: Record<string, [number, boolean]> = {
    new_moon: [0, true],
    waxing_crescent: [0.25, true],
    first_quarter: [0.5, true],
    waxing_gibbous: [0.75, true],
    full_moon: [1, true],
    waning_gibbous: [0.75, false],
    last_quarter: [0.5, false],
    waning_crescent: [0.25, false],
  };

  private _renderMoon(c: MetricCtx, index: number): TemplateResult {
    const m = c.m;
    const st = c.primaryState;
    const phaseState = st?.state;
    const map = phaseState ? WeatherCard.MOON_MAP[phaseState] : undefined;
    let illum = map ? map[0] : NaN;
    const waxing = map ? map[1] : true;
    // illumination override (or a purely numeric primary entity)
    const illRaw = m.illumination_entity
      ? this._numeric(this.hass.states[m.illumination_entity])
      : map
        ? NaN
        : this._numeric(st);
    if (Number.isFinite(illRaw)) illum = illRaw > 1 ? illRaw / 100 : illRaw;
    if (!Number.isFinite(illum)) illum = 0;
    const name = map ? t(this.hass, `moon_${phaseState}`) : (phaseState ?? '');
    const tapId = m.entity ?? m.moon_entity ?? m.illumination_entity;
    return html`
      <div
        class="metric moon-metric ${(m.tap_action ?? 'more-info') === 'none' ? 'noclick' : ''}"
        style="--wc-accent:${c.accent}"
        @click=${() => this._handleTap({ tap_action: 'more-info', ...m }, index, tapId)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${c.icon}></ha-icon></div>
          <div class="name">${c.name}</div>
          ${st ? html`<div class="time">${fmtLastUpdated(this.hass, st.last_updated)}</div>` : nothing}
        </div>
        <div class="moonwrap">${moonDisc(illum, waxing)}</div>
        <div class="moon-phase" style="color:${c.accent}">${name}</div>
        <div class="moon-note">${t(this.hass, 'illumination')}: ${fmtNumber(this.hass, illum * 100, 0)}%</div>
      </div>
    `;
  }

  /* ---- tides ---------------------------------------------------------- */

  private _parseTime(raw?: string): Date | undefined {
    if (!raw) return undefined;
    const d = new Date(raw);
    if (!isNaN(d.getTime())) return d;
    const hm = /^(\d{1,2}):(\d{2})/.exec(raw);
    if (hm) {
      const t2 = new Date();
      t2.setHours(+hm[1], +hm[2], 0, 0);
      return t2;
    }
    return undefined;
  }

  private _renderTides(c: MetricCtx, index: number): TemplateResult {
    const m = c.m;
    const st = c.primaryState;
    const height = this._numeric(st, m.attribute);
    const values = st
      ? fillGaps(this._bucketsFor(st.entity_id, 'hour', 24, c.aggregate))
      : [];
    const high =
      this._parseTime(this.hass.states[m.high_tide_entity ?? '']?.state) ??
      this._parseTime(st?.attributes?.next_high_tide);
    const low =
      this._parseTime(this.hass.states[m.low_tide_entity ?? '']?.state) ??
      this._parseTime(st?.attributes?.next_low_tide);
    const tapId = m.entity ?? m.high_tide_entity;
    return html`
      <div
        class="metric tides-metric ${(m.tap_action ?? 'popup') === 'none' ? 'noclick' : ''}"
        style="--wc-accent:${c.accent}"
        @click=${() => this._handleTap(m, index, tapId)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${c.icon}></ha-icon></div>
          <div class="name">${c.name}</div>
          ${st ? html`<div class="time">${fmtLastUpdated(this.hass, st.last_updated)}</div>` : nothing}
        </div>
        ${Number.isFinite(height)
          ? html`<div class="value">
              ${fmtNumber(this.hass, height, c.precision)}<span class="unit">${c.unit}</span>
            </div>`
          : nothing}
        <div class="tidewrap">${tideChart(values, c.accent)}</div>
        ${high || low
          ? html`<div class="tide-times">
              ${high
                ? html`<div class="tide-end">
                    <ha-icon icon="mdi:arrow-up-bold"></ha-icon>
                    <span>${t(this.hass, 'high_tide')} ${fmtTime(this.hass, high.toISOString())}</span>
                  </div>`
                : nothing}
              ${low
                ? html`<div class="tide-end">
                    <ha-icon icon="mdi:arrow-down-bold"></ha-icon>
                    <span>${t(this.hass, 'low_tide')} ${fmtTime(this.hass, low.toISOString())}</span>
                  </div>`
                : nothing}
            </div>`
          : nothing}
      </div>
    `;
  }

  /* ---- pollen --------------------------------------------------------- */

  private _pollenValue(st?: HassEntity, max = 5): number {
    if (!st) return NaN;
    const num = this._numeric(st);
    if (Number.isFinite(num)) return num;
    const text = st.state.toLowerCase().replace(/[\s_-]/g, '');
    const words: Record<string, number> = {
      none: 0, keine: 0, no: 0,
      verylow: 1, sehrgering: 1, verygering: 1,
      low: 2, gering: 2, niedrig: 2,
      moderate: 3, mäßig: 3, maessig: 3, medium: 3, mittel: 3,
      high: 4, hoch: 4,
      veryhigh: 5, sehrhoch: 5, extreme: 5,
    };
    return text in words ? (words[text] / 5) * max : NaN;
  }

  private _pollenColor(value: number, max: number): string {
    const r = Number.isFinite(value) ? value / max : 0;
    if (r <= 0.05) return 'var(--grey-color, #9E9E9E)';
    if (r < 0.4) return 'var(--green-color, #4CAF50)';
    if (r < 0.7) return 'var(--amber-color, #FFC107)';
    return 'var(--red-color, #F44336)';
  }

  private _renderPollen(c: MetricCtx, index: number): TemplateResult {
    const m = c.m;
    const max = m.max ?? 5;
    const items = c.series.map((s) => {
      const st = this.hass.states[s.entity];
      const value = this._pollenValue(st, max);
      const idx = Number.isFinite(value) ? Math.max(0, Math.min(Math.round((value / max) * 5), 5)) : 0;
      return {
        name: s.name ?? st?.attributes.friendly_name ?? s.entity,
        value,
        color: resolveColor(s.color) ?? this._pollenColor(value, max),
        level: t(this.hass, `pollen_lvl_${idx}`),
      };
    });
    return html`
      <div
        class="metric pollen-metric ${(m.tap_action ?? 'popup') === 'none' ? 'noclick' : ''}"
        style="--wc-accent:${c.accent}"
        @click=${() => this._handleTap(m, index, c.series[0].entity)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${c.icon}></ha-icon></div>
          <div class="name">${c.name}</div>
          ${this._renderScoreBadge(m)}
        </div>
        <div class="pbars">
          ${items.map(
            (it) => html`<div class="pbar">
              <div class="pbar-label">
                <span>${it.name}</span>
                <span style="color:${it.color};font-weight:700">${it.level}</span>
              </div>
              <div class="ptrack" style="--wc-p:${it.color}">
                <div
                  class="pfill"
                  style="width:${Number.isFinite(it.value)
                    ? Math.max(0, Math.min((it.value / max) * 100, 100))
                    : 0}%"
                ></div>
              </div>
            </div>`
          )}
        </div>
      </div>
    `;
  }

  /* ---- radar ---------------------------------------------------------- */

  private _renderRadar(c: MetricCtx, index: number): TemplateResult {
    const m = c.m;
    const st = c.primaryState;
    let src = m.image_url;
    if (!src && st) src = st.attributes.entity_picture;
    const tapId = m.entity;
    return html`
      <div
        class="metric radar-metric ${(m.tap_action ?? (m.entity ? 'more-info' : 'none')) === 'none' ? 'noclick' : ''}"
        style="--wc-accent:${c.accent}"
        @click=${() => tapId && this._handleTap({ tap_action: 'more-info', ...m }, index, tapId)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${c.icon}></ha-icon></div>
          <div class="name">${c.name}</div>
          ${st ? html`<div class="time">${fmtLastUpdated(this.hass, st.last_updated)}</div>` : nothing}
        </div>
        ${src
          ? html`<div class="radarframe">
              <img class="radar-img" src=${src} alt="" />
            </div>`
          : html`<div class="missing">${t(this.hass, 'no_data')}</div>`}
      </div>
    `;
  }

  /* ---- sky hero scene ------------------------------------------------- */

  private _weatherAttr(id: string | undefined, key: string): number {
    if (!id) return NaN;
    const st = this.hass.states[id];
    const v = st?.attributes?.[key];
    return typeof v === 'number' ? v : parseFloat(v);
  }

  private static readonly SKY_ANCHOR_POS: Record<
    string,
    { x: number; y: number; dir: string }
  > = {
    top: { x: 50, y: 12, dir: 'bottom' },
    'top-left': { x: 22, y: 16, dir: 'right' },
    'top-right': { x: 78, y: 16, dir: 'left' },
    center: { x: 50, y: 48, dir: 'top' },
    'bottom-left': { x: 24, y: 78, dir: 'right' },
    'bottom-right': { x: 76, y: 78, dir: 'left' },
    bottom: { x: 50, y: 84, dir: 'top' },
  };

  private _renderSky(c: MetricCtx, index: number): TemplateResult {
    const m = c.m;
    const weatherState = c.primaryState!;
    const isWeather = weatherState.entity_id.startsWith('weather.');
    const condition =
      (m.condition_entity ? this.hass.states[m.condition_entity]?.state : undefined) ??
      (isWeather ? weatherState.state : undefined);
    const sun = this.hass.states[m.sun_entity ?? 'sun.sun'];
    const isDay = m.night === true ? false : sun ? sun.state === 'above_horizon' : true;
    const elevRaw = sun?.attributes?.elevation;
    const elevation =
      m.night === true
        ? -20
        : typeof elevRaw === 'number' && Number.isFinite(elevRaw)
          ? elevRaw
          : undefined;
    const windId = m.wind_entity ?? (isWeather ? weatherState.entity_id : undefined);
    const windRaw = m.wind_entity
      ? this._numeric(this.hass.states[m.wind_entity])
      : this._weatherAttr(windId, 'wind_speed');
    const wind = Number.isFinite(windRaw) ? Math.min(windRaw / 60, 1) : 0.15;

    const scoreV = m.score_entity ? this._numeric(this.hass.states[m.score_entity]) : NaN;
    const glow = Number.isFinite(scoreV) ? Math.min(0.2 + (scoreV / 100) * 0.7, 1) : 0;
    const glowColor = Number.isFinite(scoreV)
      ? this._scoreColor(scoreV, 100, false)
      : 'transparent';

    const temp = isWeather ? this._weatherAttr(weatherState.entity_id, 'temperature') : this._numeric(weatherState);
    const tempUnit = isWeather
      ? this.hass.states[weatherState.entity_id]?.attributes?.temperature_unit ?? '°'
      : weatherState.attributes.unit_of_measurement ?? '°';
    const daily = this._forecastFor(this._forecastId(m), 'daily');
    const today = daily[0];
    const hi = today?.temperature;
    const lo = today?.templow;

    const anchors = (m.anchors ?? []).filter((a) => this.hass.states[a.entity]);

    return html`
      <div
        class="metric sky-metric ${(m.tap_action ?? 'popup') === 'none' ? 'noclick' : ''}"
        style="--wc-accent:${c.accent}"
        @click=${() => this._handleTap(m, index, weatherState.entity_id)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${conditionIcon(condition, isDay)}></ha-icon></div>
          <div class="name">${c.name}</div>
          ${this._renderScoreBadge(m)}
          <div class="time">${fmtLastUpdated(this.hass, weatherState.last_updated)}</div>
        </div>
        <div class="skywrap" style="--wc-oy:${m.scene_offset_y ?? 0}%">
          ${skyScene({ condition, isDay, elevation, wind, glow, glowColor })}
          <div class="sky-overlay">
            <div class="sky-temp">
              ${Number.isFinite(temp)
                ? html`${fmtNumber(this.hass, temp, c.precision)}<span class="sky-unit">${tempUnit}</span>`
                : nothing}
            </div>
            <div class="sky-cond">${conditionName(this.hass, condition) || (condition ?? '')}</div>
            ${Number.isFinite(hi as number) || Number.isFinite(lo as number)
              ? html`<div class="sky-hilo">
                  ${Number.isFinite(hi as number)
                    ? html`<span><ha-icon icon="mdi:arrow-up-thin"></ha-icon>${fmtNumber(this.hass, hi!, 0)}°</span>`
                    : nothing}
                  ${Number.isFinite(lo as number)
                    ? html`<span><ha-icon icon="mdi:arrow-down-thin"></ha-icon>${fmtNumber(this.hass, lo!, 0)}°</span>`
                    : nothing}
                </div>`
              : nothing}
          </div>
          ${anchors.map((a, i) => this._renderAnchor(a, i, m))}
        </div>
        ${this._renderForecast(
          this._forecastFor(this._forecastId(m), m.forecast_type ?? 'daily'),
          m.forecast_type ?? 'daily',
          m.forecast_count ?? 7
        )}
      </div>
    `;
  }

  private _renderAnchor(a: SkyAnchor, i: number, m: MetricConfig): TemplateResult | typeof nothing {
    const base = WeatherCard.SKY_ANCHOR_POS[a.position ?? 'top-right'];
    const st = this.hass.states[a.entity];
    if (!base || !st) return nothing;
    let dir: string;
    if (a.dot) dir = a.dot;
    else {
      let side = base.dir;
      if (a.flip) side = side === 'right' ? 'left' : side === 'left' ? 'right' : side;
      dir = side;
    }
    const x = a.x ?? base.x;
    const y = a.y ?? base.y;
    const color =
      resolveColor(a.color) ?? resolveColor(SERIES_PALETTE[i % SERIES_PALETTE.length])!;
    const v = this._numeric(st);
    let value: string;
    if (a.entity2) {
      const v2 = this._numeric(this.hass.states[a.entity2]);
      value = `${fmtNumber(this.hass, v, 0)}/${fmtNumber(this.hass, v2, 0)}`;
    } else {
      value = Number.isFinite(v)
        ? joinUnit(fmtNumber(this.hass, v), st.attributes.unit_of_measurement ?? '')
        : st.state;
    }
    const op = m.label_opacity ?? 1;
    return html`<div
      class="anchor dot-${dir}"
      style="left:${x}%;top:${y}%;--ac:${color};--wc-label-op:${op}"
    >
      <span class="anchor-dot"></span>
      <div class="anchor-chip">
        <span class="anchor-name">${a.name ?? st.attributes.friendly_name ?? ''}</span>
        <span class="anchor-val">${value}</span>
      </div>
    </div>`;
  }

  /* ---- AI summary ----------------------------------------------------- */

  private _summarySnapshot(m: MetricConfig): WeatherSnapshot {
    const weatherId = this._forecastId(m);
    const wSt = weatherId ? this.hass.states[weatherId] : undefined;
    const daily = this._forecastFor(weatherId, 'daily');
    const hourly = this._forecastFor(weatherId, 'hourly');
    const attr = (k: string) => this._weatherAttr(weatherId, k);
    const num = (id?: string) => (id ? this._numeric(this.hass.states[id]) : NaN);
    const src = m.summary_sources ?? [];
    const find = (dc: string) =>
      src.map((id) => this.hass.states[id]).find((s) => s?.attributes.device_class === dc);
    const bySource = (dc: string) => this._numeric(find(dc));

    const cond = wSt?.entity_id.startsWith('weather.') ? wSt.state : undefined;
    const bearing = attr('wind_bearing');
    const nextProb = hourly.slice(0, 12).map((p) => p.precipitation_probability ?? 0);
    return {
      condition: conditionName(this.hass, cond),
      temp: firstFinite(attr('temperature'), bySource('temperature')),
      tempUnit: wSt?.attributes?.temperature_unit ?? '°C',
      hi: daily[0]?.temperature,
      lo: daily[0]?.templow,
      feels: firstFinite(attr('apparent_temperature'), num(m.summary_sources?.[0])),
      windSpeed: firstFinite(attr('wind_speed'), bySource('wind_speed')),
      windUnit: wSt?.attributes?.wind_speed_unit ?? 'km/h',
      windDir: windDir(this.hass, bearing),
      precipProb: nextProb.length ? Math.max(...nextProb) : daily[0]?.precipitation_probability,
      precipMm: daily[0]?.precipitation,
      uv: firstFinite(attr('uv_index'), bySource('uv_index')),
      humidity: firstFinite(attr('humidity'), bySource('humidity')),
      tomorrowCondition: conditionName(this.hass, daily[1]?.condition),
      tomorrowHi: daily[1]?.temperature,
      tomorrowLo: daily[1]?.templow,
    };
  }

  private _renderSummary(c: MetricCtx, index: number): TemplateResult {
    const m = c.m;
    const fromEntity = m.summary_entity
      ? this.hass.states[m.summary_entity]?.state
      : undefined;
    const text =
      fromEntity && fromEntity !== 'unknown' && fromEntity !== 'unavailable'
        ? fromEntity
        : generateSummary(this.hass, this._summarySnapshot(m));
    return html`
      <div
        class="metric summary-metric ${(m.tap_action ?? 'none') === 'none' ? 'noclick' : ''}"
        style="--wc-accent:${c.accent}"
        @click=${() => m.summary_entity && this._handleTap(m, index, m.summary_entity)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${c.icon}></ha-icon></div>
          <div class="name">${c.name}</div>
        </div>
        <div class="summary-text">${text || t(this.hass, 'no_data')}</div>
        ${!fromEntity
          ? html`<div class="summary-note">
              <ha-icon icon="mdi:creation"></ha-icon>
              <span>${t(this.hass, 'ai_note')}</span>
            </div>`
          : nothing}
      </div>
    `;
  }

  /* ---- shared value / status / chart rendering ----------------------- */

  private _scoreColor(v: number, max: number, goodHigh = true): string {
    let ratio = Number.isFinite(v) ? v / max : 0;
    if (!goodHigh) ratio = 1 - ratio;
    if (ratio >= 0.66) return 'var(--success-color, #43a047)';
    if (ratio >= 0.4) return 'var(--warning-color, #fb8c00)';
    return 'var(--error-color, #e53935)';
  }

  private _renderScoreBadge(m: MetricConfig): TemplateResult | typeof nothing {
    if (!m.score_entity) return nothing;
    const v = this._numeric(this.hass.states[m.score_entity]);
    if (!Number.isFinite(v)) return nothing;
    return html`<span class="scorebadge" style="background:${this._scoreColor(v, 100, false)}">
      ${fmtNumber(this.hass, v, 0)}
    </span>`;
  }

  private _fmtMetricValue(c: MetricCtx, x: number): string {
    if (c.m.duration ?? c.preset.duration) {
      return fmtDuration(x, c.m.unit ?? c.primaryState?.attributes.unit_of_measurement);
    }
    return joinUnit(fmtNumber(this.hass, x, c.precision), c.unit);
  }

  private _xMarks(kind: RangeKind, count: number): AxisMark[] {
    const loc = locale(this.hass);
    const marks: AxisMark[] = [];
    if (kind === 'hour') {
      const hourStart = new Date();
      hourStart.setMinutes(0, 0, 0);
      const start = hourStart.getTime() - (count - 1) * 3600000;
      for (let i = 0; i < count; i++) {
        const h = new Date(start + i * 3600000).getHours();
        if (h % 6 === 0) marks.push({ i, label: String(h), line: h === 0 });
      }
      return marks;
    }
    if (kind === 'month') {
      const now = new Date();
      for (let i = 0; i < count; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - (count - 1 - i), 1);
        if (d.getMonth() === 0) marks.push({ i, label: String(d.getFullYear()), line: true });
      }
      return marks;
    }
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (count - 1));
    if (count <= 14) {
      for (let i = 0; i < count; i++) {
        const d = new Date(start.getTime() + i * 86400000);
        marks.push({ i, label: d.toLocaleDateString(loc, { weekday: 'narrow' }) });
      }
      return marks;
    }
    let mondays = 0;
    let months = 0;
    for (let i = 0; i < count; i++) {
      const d = new Date(start.getTime() + i * 86400000);
      if (count <= 45) {
        if (d.getDay() === 1) {
          marks.push({
            i,
            label:
              mondays++ % 2 === 0
                ? d.toLocaleDateString(loc, { day: 'numeric', month: 'numeric' })
                : undefined,
            line: true,
          });
        }
      } else if (d.getDate() === 1) {
        marks.push({
          i,
          label:
            count <= 120 || months % 2 === 0
              ? d.toLocaleDateString(loc, { month: 'short' })
              : undefined,
          line: true,
        });
        months++;
      }
    }
    return marks;
  }

  private _renderEventTimes(entityId: string): TemplateResult | typeof nothing {
    const pts = (this._history[entityId] ?? []).filter((p) => p.v > 0);
    if (!pts.length) return nothing;
    const loc = locale(this.hass);
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const startMs = start.getTime() - 6 * 86400000;
    const rows = Array.from({ length: 7 }, (_, d) => {
      const dayStart = startMs + d * 86400000;
      return {
        date: new Date(dayStart),
        events: pts.filter((p) => p.t >= dayStart && p.t < dayStart + 86400000),
      };
    });
    return html`<div class="times">
      <div class="times-title">${t(this.hass, 'event_times')}</div>
      ${rows.map(
        (r) => html`<div class="times-row">
          <span class="times-day">${r.date.toLocaleDateString(loc, { weekday: 'short' })}</span>
          <div class="times-track">
            ${r.events.map(
              (e) => html`<span
                class="times-dot"
                style="left:${((e.t - r.date.getTime()) / 86400000) * 100}%"
                title=${new Date(e.t).toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' })}
              ></span>`
            )}
          </div>
          <span class="times-count">${r.events.length}×</span>
        </div>`
      )}
      <div class="times-hours"><span>0</span><span>6</span><span>12</span><span>18</span><span>24</span></div>
    </div>`;
  }

  private _renderDetails(
    m: MetricConfig,
    c: MetricCtx,
    activeKey: string,
    setRange: (key: string) => void
  ): TemplateResult {
    const finite = c.data[0].buckets.filter(Number.isFinite);
    const delta = trendDelta(c.data[0].filled);
    const goal = this._resolveGoal(m.goal);
    const v = c.valueOverride ?? this._numeric(c.primaryState, m.attribute);
    const stats: Array<{ label: string; value: string }> = [];
    if (finite.length) {
      stats.push(
        { label: t(this.hass, 'stat_min'), value: this._fmtMetricValue(c, Math.min(...finite)) },
        {
          label: t(this.hass, 'stat_avg'),
          value: this._fmtMetricValue(c, finite.reduce((a, b) => a + b, 0) / finite.length),
        },
        { label: t(this.hass, 'stat_max'), value: this._fmtMetricValue(c, Math.max(...finite)) }
      );
      if (Number.isFinite(delta) && delta !== 0) {
        stats.push({
          label: t(this.hass, 'stat_trend'),
          value: `${delta > 0 ? '+' : ''}${this._fmtMetricValue(c, delta)}`,
        });
      }
    }
    if (Number.isFinite(goal) && Number.isFinite(v)) {
      const left = c.goalType === 'atmost' ? v - goal : goal - v;
      stats.push({
        label: t(this.hass, 'goal_left'),
        value: left > 0 ? this._fmtMetricValue(c, left) : '✓',
      });
    }

    const n = c.days;
    const wide = c.kind === 'month' || (c.kind === 'day' && n > 16);
    const historyGraph = c.graph === 'bar' || c.graph === 'progress' ? 'bar' : 'line';
    const isDur = m.duration ?? c.preset.duration;
    const yFmt = (val: number): string =>
      isDur ? this._fmtMetricValue(c, val) : fmtNumber(this.hass, val, c.precision);
    const opts: ChartOpts = {
      w: wide ? n * (c.kind === 'month' ? 14 : 10) : 340,
      h: wide ? 110 : 130,
      dots: c.kind === 'day' && n <= 14,
      yFmt,
      xMarks: this._xMarks(c.kind, n),
    };
    const historyTpl =
      historyGraph === 'bar'
        ? barChart(
            c.data[0].buckets,
            c.data[0].colorResolved,
            Number.isFinite(goal) ? goal : undefined,
            opts
          )
        : lineChart(
            c.data.map((s) => ({ values: s.filled, color: s.colorResolved })),
            opts
          );

    return html`
      <div class="periods">
        ${POPUP_RANGES.map(
          (p) => html`<button
            class="period ${activeKey === p.key ? 'active' : ''}"
            @click=${(e: Event) => {
              e.stopPropagation();
              setRange(p.key);
            }}
          >
            ${t(this.hass, `period_${p.key}`)}
          </button>`
        )}
      </div>
      ${c.graph === 'progress'
        ? this._renderChart(m, 'progress', c.data, c.unit, c.precision)
        : nothing}
      <div class="popup-chart">
        ${wide
          ? html`<div class="chart-scroll"><div style="width:${opts.w}px">${historyTpl}</div></div>`
          : historyTpl}
      </div>
      ${stats.length
        ? html`<div class="stats">
            ${stats.map(
              (s) => html`<div class="stat">
                <div class="stat-label">${s.label}</div>
                <div class="stat-value">${s.value}</div>
              </div>`
            )}
          </div>`
        : nothing}
      ${c.type === 'wind' ? this._renderWindDetail(m, c) : nothing}
      ${c.type === 'precipitation' && c.series[0]?.entity
        ? this._renderEventTimes(c.series[0].entity)
        : nothing}
      ${c.multi ? this._renderSeriesChips(c.data, c.precision, c.trendMode) : nothing}
      ${c.type === 'precipitation' && m.parts ? this._renderParts(m) : nothing}
      ${this._renderSecondary(m)}
    `;
  }

  private _renderWindDetail(m: MetricConfig, c: MetricCtx): TemplateResult | typeof nothing {
    const bearing = m.entity
      ? this._weatherAttr(m.entity, 'wind_bearing')
      : NaN;
    const dirAttr = Number.isFinite(bearing)
      ? bearing
      : this._numeric(this.hass.states[m.secondary?.[0] ?? '']);
    if (!Number.isFinite(dirAttr)) return nothing;
    const speed = this._numeric(c.primaryState);
    return html`<div class="windrose-wrap">
      ${windCompass(dirAttr, speed, c.accent)}
      <div class="windrose-label">${windDir(this.hass, dirAttr)} · ${joinUnit(fmtNumber(this.hass, speed, 0), c.unit)}</div>
    </div>`;
  }

  private _renderPopup(): TemplateResult | typeof nothing {
    if (this._popup === null || !this._config) return nothing;
    const m = this._config.metrics[this._popup];
    if (!m) return nothing;
    const c = this._ctx(m, this._activeRange());
    if (!c.primaryState) return nothing;
    const primaryState = c.primaryState;
    const activeKey = this._popupRange ?? (c.days === 7 && c.kind === 'day' ? 'week' : '');
    const fc = this._metricForecast(m);

    return html`
      <div class="backdrop s-${this._cardStyle()}" @click=${() => (this._popup = null)}>
        <div
          class="dialog"
          role="dialog"
          aria-modal="true"
          style="--wc-accent:${c.accent}"
          @click=${(e: Event) => e.stopPropagation()}
        >
          <div class="dialog-head">
            <div class="iconchip"><ha-icon .icon=${c.icon}></ha-icon></div>
            <div class="dialog-title">${c.name}</div>
            ${this._renderScoreBadge(m)}
            <button
              class="close"
              aria-label=${t(this.hass, 'close')}
              @click=${() => (this._popup = null)}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="dialog-value">
            ${this._renderValue(m, c)}
            <div class="time">${fmtLastUpdated(this.hass, primaryState.last_updated)}</div>
          </div>
          ${this._renderStatus(m, c)}
          ${fc
            ? html`<div class="forecast-title">${t(this.hass, 'forecast')}</div>
                ${this._renderForecast(fc.points, fc.type, m.forecast_count ?? 12)}`
            : nothing}
          ${this._renderDetails(m, c, activeKey, (k) => {
            this._popupRange = k;
          })}
          <button
            class="openha"
            @click=${() => {
              this._popup = null;
              this._moreInfo(c.series[0]?.entity);
            }}
          >
            <ha-icon icon="mdi:chart-box-outline"></ha-icon>
            ${t(this.hass, 'open_ha')}
          </button>
        </div>
      </div>
    `;
  }

  private _renderParts(m: MetricConfig): TemplateResult | typeof nothing {
    const COLORS: Record<string, string> = {
      morning: 'var(--amber-color, #FFC107)',
      noon: 'var(--light-blue-color, #03A9F4)',
      evening: 'var(--deep-purple-color, #673AB7)',
      night: 'var(--indigo-color, #3F51B5)',
    };
    const items = (['morning', 'noon', 'evening', 'night'] as const)
      .map((key) => {
        const id = m.parts?.[key];
        const st = id ? this.hass.states[id] : undefined;
        const v = this._numeric(st);
        if (!Number.isFinite(v)) return undefined;
        return { key, v, unit: st?.attributes.unit_of_measurement, color: COLORS[key] };
      })
      .filter((p): p is NonNullable<typeof p> => !!p);
    if (!items.length) return nothing;
    const total = items.reduce((a, b) => a + b.v, 0) || 1;
    return html`
      <div class="segbar">
        ${items.map(
          (p) => html`<div class="seg" style="flex-grow:${Math.max(p.v, total * 0.02)};background:${p.color}"></div>`
        )}
      </div>
      <div class="phases">
        ${items.map(
          (p) => html`<div class="phase">
            <span class="phasedot" style="background:${p.color}"></span>
            <span>${t(this.hass, `part_${p.key}`)}</span>
            <span class="phaseval">${joinUnit(fmtNumber(this.hass, p.v, 1), p.unit ?? 'mm')}</span>
          </div>`
        )}
      </div>
    `;
  }

  private _renderValue(m: MetricConfig, c: MetricCtx): TemplateResult {
    const { type, data, primaryState, unit, precision } = c;
    if (m.label) return html`<div class="value">${m.label}</div>`;

    if (type === 'wind' && data.length >= 2) {
      const spd = this._numeric(primaryState!, m.attribute);
      const gust = this._numeric(this.hass.states[data[1].entity]);
      return html`<div class="value">
          ${fmtNumber(this.hass, spd, precision)}<span class="unit">${unit}</span>
        </div>
        <div class="bplabels">
          <span class="bpitem">
            <span class="bpdot" style="background:${data[0].colorResolved}"></span>WIND
            ${fmtNumber(this.hass, spd, 0)}
          </span>
          <span class="bpitem">
            <span class="bpdot" style="background:${data[1].colorResolved}"></span>BÖ
            ${fmtNumber(this.hass, gust, 0)}
          </span>
        </div>`;
    }

    const v = c.valueOverride ?? this._numeric(primaryState!, m.attribute);
    if (!Number.isFinite(v)) return html`<div class="value">${primaryState!.state}</div>`;
    if (m.duration ?? c.preset.duration) {
      return html`<div class="value">
        ${fmtDuration(v, m.unit ?? primaryState!.attributes.unit_of_measurement)}
      </div>`;
    }
    return html`<div class="value">
      ${fmtNumber(this.hass, v, precision)}<span class="unit">${unit}</span>
    </div>`;
  }

  private _renderSeriesChips(
    data: SeriesData[],
    precision: number | undefined,
    trendMode: string
  ): TemplateResult {
    return html`<div class="serieslist">
      ${data.map((s) => {
        const st = this.hass.states[s.entity];
        const v = this._numeric(st);
        const sUnit = s.unit ?? st?.attributes.unit_of_measurement ?? '';
        const sName = s.name ?? st?.attributes.friendly_name ?? s.entity;
        const delta = trendDelta(s.filled);
        const arrow = !Number.isFinite(delta)
          ? 'mdi:minus'
          : delta > 0
            ? 'mdi:arrow-top-right'
            : delta < 0
              ? 'mdi:arrow-bottom-right'
              : 'mdi:arrow-right';
        return html`<div class="serieschip">
          ${trendMode !== 'none'
            ? html`<span class="dotarrow" style="background:${s.colorResolved}">
                <ha-icon .icon=${arrow}></ha-icon>
              </span>`
            : nothing}
          <span class="serieslabel">
            ${sName}: ${Number.isFinite(v)
              ? joinUnit(fmtNumber(this.hass, v, precision), sUnit)
              : (st?.state ?? '–')}
          </span>
        </div>`;
      })}
    </div>`;
  }

  private _renderSecondary(m: MetricConfig): TemplateResult | typeof nothing {
    if (!m.secondary?.length) return nothing;
    const parts = m.secondary
      .map((id) => {
        const st = this.hass.states[id];
        if (!st) return undefined;
        const v = this._numeric(st);
        const u = st.attributes.unit_of_measurement ?? '';
        return Number.isFinite(v) ? joinUnit(fmtNumber(this.hass, v), u) : st.state;
      })
      .filter(Boolean);
    if (!parts.length) return nothing;
    return html`<div class="secondary">${parts.join(' • ')}</div>`;
  }

  private _renderStatus(m: MetricConfig, c: MetricCtx): TemplateResult | typeof nothing {
    const { primaryState, unit, precision, trendMode, goalType, data, valueOverride } = c;
    const primary = data[0];
    const v = valueOverride ?? this._numeric(primaryState!, m.attribute);
    const goal = this._resolveGoal(m.goal);

    if (Number.isFinite(goal) && Number.isFinite(v)) {
      const start = this._resolveGoal(m.start);
      let raw = NaN;
      if (Number.isFinite(start) && start !== goal) {
        raw = ((start - v) / (start - goal)) * 100;
      } else if (goal > 0) {
        raw = goalType === 'atmost' ? (goal / v) * 100 : (v / goal) * 100;
      }
      if (!Number.isNaN(raw)) {
        const pct = Math.round(Math.min(Math.max(raw, 0), 999));
        const reached = pct >= 100;
        return html`<div class="status ${reached ? 'good' : ''}">
          <ha-icon .icon=${reached ? 'mdi:check-circle' : 'mdi:flag-outline'}></ha-icon>
          <span>${t(this.hass, 'goal')}: ${pct} %</span>
        </div>`;
      }
    }

    if (trendMode === 'none') return nothing;
    // forecast-sourced tiles show the upcoming change, not the past one
    const seriesVals = this._forecastChartData(m, c.type)?.values ?? primary.filled;
    const delta = trendDelta(seriesVals);
    if (!Number.isFinite(delta)) return nothing;

    const first = seriesVals.find(Number.isFinite) ?? 0;
    const stable = Math.abs(delta) < Math.max(Math.abs(first) * 0.005, 1e-9);
    const dirClass = stable
      ? 'neutral'
      : trendMode === 'neutral'
        ? 'neutral'
        : (delta > 0) === (trendMode === 'up_good')
          ? 'good'
          : 'bad';
    const arrow = stable
      ? 'mdi:arrow-right'
      : delta > 0
        ? 'mdi:arrow-top-right'
        : 'mdi:arrow-bottom-right';
    const isDuration = m.duration ?? c.preset.duration;
    const text = stable
      ? t(this.hass, 'stable')
      : isDuration
        ? fmtDuration(Math.abs(delta), unit || undefined)
        : `${fmtNumber(this.hass, Math.abs(delta), precision)}${unit ? ` ${unit}` : ''}`;
    return html`<div class="status ${dirClass}">
      <span class="dotarrow"><ha-icon .icon=${arrow}></ha-icon></span>
      <span>${text}</span>
    </div>`;
  }

  private _renderChart(
    m: MetricConfig,
    graph: string,
    data: SeriesData[],
    unit: string,
    precision: number | undefined
  ): TemplateResult | typeof nothing {
    const type = (m.type && PRESETS[m.type] ? m.type : 'custom') as MetricType;
    // forecast first: the tile plots what is coming, history lives in the popup
    const fcd = graph === 'line' || graph === 'bar' ? this._forecastChartData(m, type) : undefined;
    if (graph === 'line') {
      if (fcd) {
        return html`${lineChart([{ values: fcd.values, color: data[0].colorResolved }], {
          h: 66,
          dots: false,
          area: true,
          nowDot: true,
          xMarks: fcd.xMarks,
        })}`;
      }
      return html`${lineChart(data.map((s) => ({ values: s.filled, color: s.colorResolved })))}`;
    }
    if (graph === 'bar') {
      const goal = this._resolveGoal(m.goal);
      if (fcd) {
        return html`${barChart(fcd.values, data[0].colorResolved, undefined, {
          h: 66,
          xMarks: fcd.xMarks,
        })}`;
      }
      return html`${barChart(
        data[0].buckets,
        data[0].colorResolved,
        Number.isFinite(goal) ? goal : undefined
      )}`;
    }
    if (graph === 'progress') {
      const bars = data.map((s) => {
        const st = this.hass.states[s.entity];
        const v = this._numeric(st);
        // progress scale: goal, else the metric's max, else 100 for percentages
        const scale =
          this._resolveGoal(s.goal ?? m.goal) || m.max || (unit === '%' ? 100 : NaN);
        if (!Number.isFinite(v) || !Number.isFinite(scale) || scale <= 0) return nothing;
        const pct = Math.max(0, Math.min((v / scale) * 100, 100));
        const sUnit = s.unit ?? st?.attributes.unit_of_measurement ?? unit;
        return html`<div class="pbar">
          ${data.length > 1
            ? html`<div class="pbar-label">
                <span>${s.name ?? st?.attributes.friendly_name ?? s.entity}</span>
                <span>${joinUnit(fmtNumber(this.hass, v, precision), sUnit)}</span>
              </div>`
            : nothing}
          <div class="ptrack" style="--wc-p:${s.colorResolved}">
            <div class="pfill" style="width:${pct}%"></div>
          </div>
        </div>`;
      });
      return html`<div class="pbars">${bars}</div>`;
    }
    return nothing;
  }

  static styles = css`
    :host {
      --wc-card-bg: var(--ha-card-background, var(--card-background-color, #fff));
      --wc-tile-bg: color-mix(in srgb, var(--primary-text-color) 4%, var(--wc-card-bg));
      --wc-dot-fill: var(--wc-tile-bg);
    }
    .cardroot {
      display: block;
      padding: 16px;
    }
    .cardroot.flat {
      --wc-tile-bg: transparent;
      --wc-dot-fill: var(--wc-card-bg);
    }
    .cardroot.nobg {
      background: none;
      box-shadow: none;
      border: none;
    }
    .cardroot.flush {
      padding: 0;
    }
    .cardroot.flush .header {
      padding: 0 0 14px 0;
    }

    /* ---- card styles (default = soft tinted tiles from the base tokens) - */
    .s-glass {
      --wc-tile-bg: color-mix(in srgb, var(--wc-card-bg) 42%, transparent);
      --wc-dot-fill: var(--wc-card-bg);
      --wc-tile-radius: 22px;
    }
    ha-card.cardroot.s-glass {
      background: color-mix(in srgb, var(--wc-card-bg) 55%, transparent);
      -webkit-backdrop-filter: blur(18px) saturate(1.5);
      backdrop-filter: blur(18px) saturate(1.5);
    }
    .s-glass .metric {
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 12%, transparent);
      box-shadow:
        inset 0 1px 0 color-mix(in srgb, #fff 25%, transparent),
        0 8px 24px color-mix(in srgb, #000 10%, transparent);
      -webkit-backdrop-filter: blur(18px) saturate(1.5);
      backdrop-filter: blur(18px) saturate(1.5);
    }
    .s-glass .iconchip {
      background: color-mix(in srgb, var(--wc-accent) 24%, transparent);
      border: 1px solid color-mix(in srgb, #fff 30%, transparent);
      box-shadow: inset 0 1px 0 color-mix(in srgb, #fff 40%, transparent);
      -webkit-backdrop-filter: blur(10px) saturate(1.4);
      backdrop-filter: blur(10px) saturate(1.4);
    }
    .s-glass .scorewrap::before {
      content: '';
      grid-area: 1 / 1;
      place-self: center;
      width: 58%;
      aspect-ratio: 1;
      border-radius: 50%;
      background:
        radial-gradient(
          120% 120% at 30% 18%,
          color-mix(in srgb, #fff 38%, transparent),
          transparent 62%
        ),
        color-mix(in srgb, var(--wc-card-bg) 38%, transparent);
      border: 1px solid color-mix(in srgb, #fff 45%, transparent);
      box-shadow:
        inset 0 1.5px 1px color-mix(in srgb, #fff 55%, transparent),
        inset 0 -10px 18px color-mix(in srgb, var(--wc-accent) 12%, transparent),
        0 12px 28px color-mix(in srgb, #000 20%, transparent);
      -webkit-backdrop-filter: blur(14px) saturate(1.6);
      backdrop-filter: blur(14px) saturate(1.6);
    }
    .s-glass .scorewrap::after {
      content: '';
      grid-area: 1 / 1;
      place-self: center;
      width: 58%;
      aspect-ratio: 1;
      border-radius: 50%;
      background: radial-gradient(48% 32% at 32% 16%, rgba(255, 255, 255, 0.5), transparent 72%);
      pointer-events: none;
      position: relative;
      z-index: 2;
    }
    .s-glass .scorering,
    .s-glass .scoreinner {
      position: relative;
      z-index: 1;
    }
    .s-glass .scorenum {
      text-shadow: 0 1px 3px color-mix(in srgb, #000 18%, transparent);
    }
    @keyframes wc-pulse {
      0%, 100% { opacity: 0.45; }
      50% { opacity: 0.9; }
    }
    .scorering .glowpulse {
      animation: wc-pulse 2.6s ease-in-out infinite;
    }
    .s-glass .dialog {
      background: color-mix(in srgb, var(--wc-card-bg) 55%, transparent);
      -webkit-backdrop-filter: blur(26px) saturate(1.5);
      backdrop-filter: blur(26px) saturate(1.5);
      border: 1px solid color-mix(in srgb, #fff 25%, transparent);
      box-shadow:
        inset 0 1px 0 color-mix(in srgb, #fff 30%, transparent),
        0 12px 48px rgba(0, 0, 0, 0.35);
    }
    .s-material {
      --wc-tile-radius: 24px;
    }
    ha-card.cardroot.s-material {
      border-radius: 28px;
    }
    .s-material .metric {
      position: relative;
      overflow: hidden;
      background: color-mix(in srgb, var(--wc-accent) 12%, var(--wc-card-bg));
      --wc-dot-fill: color-mix(in srgb, var(--wc-accent) 12%, var(--wc-card-bg));
    }
    .s-material .metric::before {
      content: '';
      position: absolute;
      top: -70px;
      left: -70px;
      width: 190px;
      height: 190px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--wc-accent) 22%, transparent);
      pointer-events: none;
    }
    .s-material .metric > * {
      position: relative;
    }
    .s-material .iconchip {
      border-radius: 14px;
      background: var(--wc-accent);
      color: var(--wc-card-bg);
    }
    .s-material .dialog {
      border-radius: 28px;
      background:
        radial-gradient(
          circle at -30px -30px,
          color-mix(in srgb, var(--wc-accent) 24%, transparent) 0 130px,
          transparent 131px
        ),
        color-mix(in srgb, var(--wc-accent) 9%, var(--wc-card-bg));
      --wc-tile-bg: color-mix(in srgb, var(--wc-accent) 14%, var(--wc-card-bg));
      --wc-dot-fill: color-mix(in srgb, var(--wc-accent) 14%, var(--wc-card-bg));
    }
    .s-material .dialog .iconchip {
      background: var(--wc-accent);
      color: var(--wc-card-bg);
    }
    .s-bubble {
      --wc-tile-bg: var(--wc-card-bg);
      --wc-dot-fill: var(--wc-card-bg);
      --wc-tile-radius: 32px;
    }
    ha-card.cardroot.s-bubble {
      background: none;
      box-shadow: none;
      border: none;
    }
    .s-bubble .metric {
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.08));
      padding: 12px 16px;
    }
    .s-bubble .iconchip {
      width: 42px;
      height: 42px;
      background: color-mix(in srgb, var(--wc-accent) 20%, transparent);
    }
    .s-bubble .iconchip ha-icon {
      --mdc-icon-size: 22px;
    }
    .s-bubble .name {
      font-weight: 700;
    }
    .s-bubble .dialog {
      border-radius: 32px;
    }
    .s-mirror {
      --wc-tile-bg: #000;
      --wc-dot-fill: #000;
      --wc-tile-radius: 14px;
      color: #fff;
    }
    ha-card.cardroot.s-mirror {
      background: #000;
      box-shadow: none;
      border: none;
    }
    .s-mirror .metric {
      border: 1px solid rgba(255, 255, 255, 0.28);
    }
    .s-mirror .metric:hover {
      background: #0d0d0d;
    }
    .s-mirror .title,
    .s-mirror .name,
    .s-mirror .value,
    .s-mirror .scorenum,
    .s-mirror .dialog-title,
    .s-mirror .phaseval,
    .s-mirror .serieschip,
    .s-mirror .summary-text,
    .s-mirror .sky-temp,
    .s-mirror .stat-value {
      color: #fff;
    }
    .s-mirror .subtitle,
    .s-mirror .time,
    .s-mirror .unit,
    .s-mirror .secondary,
    .s-mirror .scoremax,
    .s-mirror .stat-label,
    .s-mirror .phase,
    .s-mirror .pbar-label,
    .s-mirror .fc-when,
    .s-mirror .fc-lo,
    .s-mirror .sun-daylen {
      color: rgba(255, 255, 255, 0.72);
    }
    .s-mirror .status {
      color: rgba(255, 255, 255, 0.85);
    }
    .s-mirror .iconchip {
      background: rgba(255, 255, 255, 0.14);
      color: #fff;
    }
    .s-mirror .chart,
    .s-mirror .segbar,
    .s-mirror .phasedot,
    .s-mirror .bpdot,
    .s-mirror .skyscene,
    .s-mirror .sunarc,
    .s-mirror .windrose,
    .s-mirror .moondisc,
    .s-mirror .tidechart,
    .s-mirror .radar-img,
    .s-mirror .fc-ico {
      filter: grayscale(1) brightness(1.6);
    }
    .s-mirror .serieschip .dotarrow {
      background: rgba(255, 255, 255, 0.2) !important;
    }
    .s-mirror .pfill { background: #fff; }
    .s-mirror .ptrack { background: rgba(255, 255, 255, 0.18); }
    .s-mirror .missing { color: rgba(255, 255, 255, 0.8); }
    .s-mirror .dialog {
      background: #000;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    .s-mirror .popup-chart,
    .s-mirror .stat {
      background: #000;
      border: 1px solid rgba(255, 255, 255, 0.18);
    }
    .s-mirror .close {
      background: rgba(255, 255, 255, 0.16);
      color: #fff;
    }
    .s-mirror .openha { color: #fff; }

    /* ---- header + grid ------------------------------------------------- */
    .header {
      padding: 4px 4px 16px 4px;
    }
    .title {
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.3px;
      color: var(--primary-text-color);
    }
    .subtitle {
      font-size: 14px;
      color: var(--secondary-text-color);
      margin-top: 2px;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(var(--wc-columns, 1), minmax(0, 1fr));
      gap: 12px;
    }
    .cardroot.flat .metrics { gap: 4px; }
    .cardroot.flat .metric {
      border: none;
      box-shadow: none;
    }
    .metrics.carousel {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
    }
    .metrics.carousel::-webkit-scrollbar { display: none; }
    .metrics.carousel > .metric {
      flex: 0 0 min(85%, 320px);
      scroll-snap-align: center;
    }
    .metric {
      background: var(--wc-tile-bg);
      border-radius: var(--wc-tile-radius, 16px);
      box-sizing: border-box;
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .metric:hover {
      background: color-mix(in srgb, var(--primary-text-color) 7%, var(--wc-card-bg));
    }
    .metric.noclick { cursor: default; }
    .metric.noclick:hover { background: var(--wc-tile-bg); }
    .head {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .iconchip {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--wc-accent);
      background: color-mix(in srgb, var(--wc-accent) 14%, transparent);
    }
    .iconchip ha-icon { --mdc-icon-size: 18px; }
    .name {
      flex: 1;
      font-size: 15px;
      font-weight: 600;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .time {
      font-size: 12px;
      color: var(--secondary-text-color);
      flex: none;
    }
    .body {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
      gap: 14px;
      align-items: center;
    }
    .body.stack {
      grid-template-columns: minmax(0, 1fr);
      gap: 8px;
    }
    .info {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }
    .value {
      font-size: 30px;
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: -0.5px;
      color: var(--primary-text-color);
    }
    .unit {
      font-size: 14px;
      font-weight: 600;
      color: var(--secondary-text-color);
      margin-left: 2px;
      letter-spacing: 0;
    }
    .secondary {
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .status ha-icon { --mdc-icon-size: 16px; }
    .status.good { color: var(--success-color, #43a047); }
    .status.bad { color: var(--error-color, #db4437); }
    .status .dotarrow {
      background: color-mix(in srgb, currentColor 15%, transparent);
      color: inherit;
    }
    .dotarrow {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
    .dotarrow ha-icon { --mdc-icon-size: 12px; }
    .serieslist {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .serieschip {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 13px;
      color: var(--primary-text-color);
      min-width: 0;
    }
    .serieslabel {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .chartcell { min-width: 0; }
    .chart {
      width: 100%;
      height: auto;
      display: block;
    }
    .chart .axis {
      fill: var(--secondary-text-color);
      font-size: 9px;
      font-weight: 500;
    }
    .pbars {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
    }
    .pbar-label {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-bottom: 3px;
    }
    .ptrack {
      height: 8px;
      border-radius: 4px;
      background: color-mix(in srgb, var(--wc-p, var(--wc-accent)) 18%, transparent);
      overflow: hidden;
    }
    .pfill {
      height: 100%;
      border-radius: 4px;
      background: var(--wc-p, var(--wc-accent));
      transition: width 0.3s ease;
    }
    .missing {
      font-size: 13px;
      color: var(--error-color, #db4437);
      word-break: break-all;
    }
    .bplabels {
      display: flex;
      gap: 12px;
      margin-top: 2px;
    }
    .bpitem {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.6px;
      color: var(--secondary-text-color);
    }
    .bpdot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex: none;
    }

    /* ---- precipitation parts (segment bar) ----------------------------- */
    .segbar {
      display: flex;
      gap: 2px;
      height: 10px;
      border-radius: 5px;
      overflow: hidden;
      margin-top: 2px;
    }
    .seg {
      min-width: 4px;
      border-radius: 2px;
    }
    .phases {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 14px;
      margin-top: 6px;
    }
    .phase {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .phasedot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex: none;
    }
    .phaseval {
      color: var(--primary-text-color);
      font-weight: 600;
    }

    /* ---- forecast strip ------------------------------------------------ */
    .forecast {
      display: flex;
      gap: 4px;
      overflow-x: auto;
      scrollbar-width: none;
      margin-top: 2px;
      padding-bottom: 2px;
    }
    .forecast::-webkit-scrollbar { display: none; }
    .fc-step {
      flex: 1 0 auto;
      min-width: 44px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      padding: 6px 4px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    }
    .fc-when {
      font-size: 11px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .fc-ico {
      --mdc-icon-size: 22px;
      color: var(--wc-accent);
    }
    .fc-pop {
      font-size: 10px;
      font-weight: 600;
      min-height: 13px;
      color: var(--light-blue-color, #03A9F4);
    }
    .fc-pop.empty { opacity: 0; }
    .fc-temp {
      font-size: 13px;
      font-weight: 700;
      color: var(--primary-text-color);
      display: flex;
      gap: 3px;
      align-items: baseline;
    }
    .fc-lo {
      font-size: 11px;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .forecast-title,
    .windrose-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }

    /* ---- score / air-quality ring -------------------------------------- */
    .scorewrap {
      display: grid;
      place-items: center;
      width: min(210px, 100%);
      margin: 0 auto;
    }
    .scorewrap > * { grid-area: 1 / 1; }
    .scorering {
      width: 100%;
      height: auto;
      display: block;
    }
    .scoreinner { text-align: center; }
    .scorenum {
      font-size: 46px;
      font-weight: 800;
      letter-spacing: -1px;
      line-height: 1;
      color: var(--primary-text-color);
    }
    .scoremax {
      font-size: 13px;
      font-weight: 600;
      color: var(--secondary-text-color);
      margin-top: 2px;
    }
    .score-status {
      display: flex;
      justify-content: center;
    }
    .score-bars {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
      max-width: 260px;
      margin: 0 auto;
    }
    .sbar {
      display: grid;
      grid-template-columns: minmax(56px, auto) 1fr auto;
      align-items: center;
      gap: 8px;
      font-size: 12px;
    }
    .sbar-name {
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sbar-track {
      height: 6px;
      border-radius: 3px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      overflow: hidden;
    }
    .sbar-fill {
      height: 100%;
      border-radius: 3px;
    }
    .sbar-val {
      font-weight: 700;
      color: var(--primary-text-color);
    }
    .s-mirror .sbar-fill { filter: grayscale(1) brightness(1.75); }
    .exp-value {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 6px 10px;
    }

    /* ---- sky hero scene ------------------------------------------------ */
    .skywrap {
      position: relative;
      width: 100%;
      aspect-ratio: 1.9;
      border-radius: 16px;
      overflow: hidden;
      background: #7fb0e6;
    }
    .skyscene {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      transform: translateY(var(--wc-oy, 0%));
      display: block;
    }
    .sky-overlay {
      position: absolute;
      left: 14px;
      top: 12px;
      right: 12px;
      pointer-events: none;
      text-shadow: 0 1px 6px rgba(0, 0, 0, 0.35);
    }
    .sky-temp {
      font-size: 40px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: -1.5px;
      color: #fff;
    }
    .sky-unit {
      font-size: 18px;
      font-weight: 700;
      margin-left: 1px;
    }
    .sky-cond {
      font-size: 14px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.95);
      margin-top: 2px;
    }
    .sky-hilo {
      display: flex;
      gap: 10px;
      margin-top: 4px;
      font-size: 13px;
      font-weight: 700;
      color: #fff;
    }
    .sky-hilo span {
      display: inline-flex;
      align-items: center;
    }
    .sky-hilo ha-icon { --mdc-icon-size: 15px; }

    /* ---- sun / daylight arc -------------------------------------------- */
    .sunwrap {
      width: min(280px, 100%);
      margin: 0 auto;
    }
    .sunarc,
    .windrose {
      width: 100%;
      height: auto;
      display: block;
    }
    .sunarc .axis,
    .windrose .rose-card {
      font-size: 11px;
      font-weight: 600;
      fill: var(--secondary-text-color);
    }
    .sun-times {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: -6px;
    }
    .sun-end {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 15px;
      font-weight: 700;
      color: var(--primary-text-color);
    }
    .sun-end ha-icon {
      --mdc-icon-size: 18px;
      color: var(--wc-accent);
    }
    .sun-daylen {
      font-size: 13px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .sun-note {
      text-align: center;
      font-size: 13px;
      color: var(--secondary-text-color);
    }

    /* ---- moon ---------------------------------------------------------- */
    .moonwrap {
      width: min(190px, 72%);
      margin: 0 auto;
    }
    .moondisc {
      width: 100%;
      height: auto;
      display: block;
    }
    .moon-phase {
      text-align: center;
      font-size: 16px;
      font-weight: 700;
    }
    .moon-note {
      text-align: center;
      font-size: 13px;
      color: var(--secondary-text-color);
      margin-top: -2px;
    }

    /* ---- tides --------------------------------------------------------- */
    .tidewrap {
      width: 100%;
    }
    .tidechart {
      width: 100%;
      height: auto;
      display: block;
    }
    .tide-times {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }
    .tide-end {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .tide-end ha-icon {
      --mdc-icon-size: 16px;
      color: var(--wc-accent);
    }

    /* ---- radar --------------------------------------------------------- */
    .radarframe {
      width: 100%;
      border-radius: 16px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      aspect-ratio: 16 / 10;
    }
    .radar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .windrose-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .windrose-wrap .windrose {
      width: min(180px, 70%);
    }

    /* ---- AI summary ---------------------------------------------------- */
    .summary-metric {
      background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--wc-accent) 14%, var(--wc-tile-bg)),
        var(--wc-tile-bg) 70%
      );
    }
    .summary-text {
      font-size: 15px;
      line-height: 1.5;
      color: var(--primary-text-color);
    }
    .summary-note {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .summary-note ha-icon {
      --mdc-icon-size: 14px;
      color: var(--wc-accent);
    }

    /* ---- anchors (pinned values on the sky) ---------------------------- */
    .anchor {
      position: absolute;
      pointer-events: none;
      --gap: 9px;
      --dg: 2px;
    }
    .anchor-dot {
      position: absolute;
      top: 0;
      left: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      background: var(--ac);
      border: 2px solid var(--wc-card-bg);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
    }
    .anchor-chip {
      position: absolute;
      top: 0;
      left: 0;
      background: color-mix(
        in srgb,
        var(--wc-card-bg) calc(var(--wc-label-op, 1) * 100%),
        transparent
      );
      border-radius: 10px;
      padding: 4px 9px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, calc(var(--wc-label-op, 1) * 0.16));
      display: flex;
      flex-direction: column;
      line-height: 1.25;
      white-space: nowrap;
    }
    .anchor.dot-right .anchor-chip { transform: translate(calc(-100% - var(--gap)), -50%); }
    .anchor.dot-left .anchor-chip { transform: translate(var(--gap), -50%); }
    .anchor.dot-bottom .anchor-chip { transform: translate(-50%, calc(-100% - var(--gap))); }
    .anchor.dot-top .anchor-chip { transform: translate(-50%, var(--gap)); }
    .anchor.dot-bottom-right .anchor-chip { transform: translate(calc(-100% - var(--dg)), calc(-100% - var(--dg))); }
    .anchor.dot-bottom-left .anchor-chip { transform: translate(var(--dg), calc(-100% - var(--dg))); }
    .anchor.dot-top-right .anchor-chip { transform: translate(calc(-100% - var(--dg)), var(--dg)); }
    .anchor.dot-top-left .anchor-chip { transform: translate(var(--dg), var(--dg)); }
    .s-glass .anchor-chip {
      border: 1px solid color-mix(in srgb, #fff 30%, transparent);
      -webkit-backdrop-filter: blur(8px) saturate(1.4);
      backdrop-filter: blur(8px) saturate(1.4);
      box-shadow:
        inset 0 1px 0 color-mix(in srgb, #fff 30%, transparent),
        0 4px 14px rgba(0, 0, 0, 0.16);
    }
    .s-material .anchor-chip { border-radius: 14px; }
    .s-bubble .anchor-chip { border-radius: 14px; }
    .anchor-name {
      font-size: 10px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .anchor-val {
      font-size: 12px;
      font-weight: 700;
      color: var(--primary-text-color);
    }
    .s-mirror .anchor-chip {
      background: #000;
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: none;
    }
    .s-mirror .anchor-dot { border-color: #000; }

    /* ---- detail popup -------------------------------------------------- */
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      animation: wc-fadein 0.15s ease;
    }
    @keyframes wc-fadein {
      from { opacity: 0; }
    }
    .dialog {
      width: min(440px, 100%);
      max-height: 86vh;
      overflow-y: auto;
      box-sizing: border-box;
      background: var(--wc-card-bg);
      color: var(--primary-text-color);
      border-radius: 24px;
      padding: 20px;
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      gap: 12px;
      --wc-tile-bg: color-mix(in srgb, var(--primary-text-color) 4%, var(--wc-card-bg));
      --wc-dot-fill: var(--wc-card-bg);
    }
    .dialog-head {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .dialog-title {
      flex: 1;
      font-size: 17px;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .close {
      width: 32px;
      height: 32px;
      flex: none;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      background: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
    }
    .close ha-icon { --mdc-icon-size: 18px; }
    .dialog-value {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
    }
    .dialog-value .value { font-size: 36px; }
    .popup-chart {
      background: var(--wc-tile-bg);
      border-radius: 16px;
      padding: 12px 10px 8px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(88px, 1fr));
      gap: 8px;
    }
    .stat {
      background: var(--wc-tile-bg);
      border-radius: 12px;
      padding: 8px 10px;
      text-align: center;
    }
    .stat-label {
      font-size: 11px;
      color: var(--secondary-text-color);
    }
    .stat-value {
      font-size: 14px;
      font-weight: 700;
    }
    .openha {
      align-self: center;
      display: flex;
      align-items: center;
      gap: 6px;
      border: none;
      background: none;
      color: var(--primary-color);
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      padding: 8px 14px;
      border-radius: 10px;
    }
    .openha:hover {
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    }
    .openha ha-icon { --mdc-icon-size: 16px; }
    .scorebadge {
      min-width: 26px;
      height: 20px;
      padding: 0 7px;
      border-radius: 10px;
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: none;
      box-sizing: border-box;
    }
    .periods {
      display: flex;
      gap: 6px;
    }
    .period {
      border: none;
      cursor: pointer;
      padding: 5px 14px;
      border-radius: 999px;
      font-weight: 600;
      font-size: 12px;
      color: var(--secondary-text-color);
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
    .period.active {
      background: var(--wc-accent);
      color: var(--wc-card-bg);
    }
    .s-mirror .period {
      background: rgba(255, 255, 255, 0.12);
      color: rgba(255, 255, 255, 0.75);
    }
    .s-mirror .period.active {
      background: #fff;
      color: #000;
    }
    .chart-scroll {
      overflow-x: auto;
      scrollbar-width: thin;
    }
    .chart-scroll > div { min-width: 100%; }
    .times {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .times-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      margin-bottom: 2px;
    }
    .times-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .times-day {
      width: 30px;
      flex: none;
      font-size: 11px;
      color: var(--secondary-text-color);
    }
    .times-track {
      position: relative;
      flex: 1;
      height: 14px;
      border-radius: 7px;
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
    .times-dot {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: var(--wc-accent);
    }
    .times-count {
      width: 26px;
      flex: none;
      text-align: right;
      font-size: 11px;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .times-hours {
      display: flex;
      justify-content: space-between;
      margin: 0 34px 0 38px;
      font-size: 9px;
      color: var(--secondary-text-color);
    }
    .s-mirror .times-track { background: rgba(255, 255, 255, 0.12); }
    .s-mirror .times-dot { background: #fff; }
  `;
}

function firstFinite(...vals: number[]): number | undefined {
  for (const v of vals) if (typeof v === 'number' && Number.isFinite(v)) return v;
  return undefined;
}

console.info(
  `%c WEATHERGLASS %c v${CARD_VERSION} `,
  'color: white; background: #0d6efd; font-weight: 700; border-radius: 4px 0 0 4px; padding: 2px 6px;',
  'color: #0d6efd; background: #e7f0ff; font-weight: 700; border-radius: 0 4px 4px 0; padding: 2px 6px;'
);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'weatherglass-card',
  name: 'Weatherglass',
  description:
    'Forecast-first weather dashboard with an animated sky scene: hourly forecast tiles, wind, precipitation, air quality, sun, moon, tides, pollen, radar and an AI summary.',
  preview: true,
  documentationURL: 'https://github.com/BobMcGlobus/Weatherglass',
});

declare global {
  interface HTMLElementTagNameMap {
    'weatherglass-card': WeatherCard;
  }
}
