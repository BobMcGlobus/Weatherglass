import { LitElement, html, css, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  HomeAssistant,
  MetricConfig,
  MetricType,
  WeatherCardConfig,
} from './types';
import { COLOR_NAMES, PRESETS, resolveColor } from './presets';
import { lang, t } from './i18n';

const METRIC_TYPES = Object.keys(PRESETS) as MetricType[];
const MULTI_TYPES: MetricType[] = ['air_quality', 'pollen'];
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
  'summary',
];
/** Types whose tile chart can plot the forecast (chart_source select) */
const FC_CHART_TYPES: MetricType[] = [
  'temperature',
  'feels_like',
  'wind',
  'precipitation',
  'humidity',
  'uv',
  'pressure',
  'cloud',
];

const LABELS: Record<string, Record<string, string>> = {
  en: {
    title: 'Title',
    subtitle: 'Subtitle',
    weather: 'Weather entity (forecast + condition)',
    days: 'History (days)',
    columns: 'Columns',
    tiles: 'Show metrics as tiles',
    layout: 'Layout',
    layout_grid: 'Grid',
    layout_carousel: 'Carousel (scrollable)',
    background: 'Card background',
    flush: 'Edge to edge (no outer padding)',
    card_style: 'Style',
    style_default: 'Default',
    style_glass: 'Liquid Glass',
    style_material: 'Material You',
    style_bubble: 'Bubble',
    style_mirror: 'Magic Mirror',
    tab_general: 'General',
    sec_display: 'Appearance',
    sec_goal: 'Goal & progress',
    sec_behavior: 'Behavior & data',
    sec_forecast: 'Forecast',
    sec_parts: 'Day parts',
    sec_sky: 'Sky scene',
    sec_sun: 'Sun',
    sec_moon: 'Moon',
    sec_tides: 'Tides',
    sec_radar: 'Radar',
    sec_summary: 'AI summary',
    chart_source: 'Tile chart shows',
    cs_forecast: 'Forecast (upcoming)',
    cs_history: 'History (past)',
    goal_type: 'Goal direction',
    gt_atleast: 'Reach at least',
    gt_atmost: 'Stay at/below',
    goal_entity: 'Goal sensor (overrides number)',
    start: 'Start value (number)',
    start_entity: 'Start sensor (overrides number)',
    tap_action: 'Tap action',
    ta_popup: 'Popup (detail view)',
    'ta_more-info': 'More-info (HA dialog)',
    ta_link: 'Link',
    ta_none: 'Nothing',
    link: 'Link (path or URL)',
    max: 'Maximum (index)',
    forecast: 'Forecast weather entity (overrides card)',
    forecast_type: 'Resolution',
    ft_hourly: 'Hourly',
    ft_daily: 'Daily',
    ft_twice_daily: 'Twice daily',
    forecast_count: 'Steps to show',
    part_morning: 'Morning entity',
    part_noon: 'Midday entity',
    part_evening: 'Evening entity',
    part_night: 'Night entity',
    condition_entity: 'Condition sensor (overrides weather)',
    sun_entity: 'Sun entity (day/night)',
    wind_entity: 'Wind entity (cloud drift)',
    night: 'Force night mode',
    scene_offset_y: 'Scene vertical offset %',
    details: 'Values below the forecast (labeled chips)',
    sunrise_entity: 'Sunrise entity (optional)',
    sunset_entity: 'Sunset entity (optional)',
    moon_entity: 'Moon phase entity (optional)',
    illumination_entity: 'Illumination entity (0-1 or %)',
    high_tide_entity: 'Next high tide entity',
    low_tide_entity: 'Next low tide entity',
    image_url: 'Radar image URL',
    refresh: 'Refresh (seconds)',
    summary_entity: 'Summary text sensor (LLM/AI)',
    summary_sources: 'Source sensors (generated summary)',
    score_entity: 'Warning/index sensor (badge)',
    breakdown: 'Sub-indices (category colors)',
    expanded: 'Expanded tile (details inline)',
    type: 'Type',
    entity: 'Entity',
    entity2: 'Second entity (e.g. gust)',
    entities: 'Entities (multiple series)',
    secondary: 'Extra entities (info line)',
    name: 'Name',
    icon: 'Icon',
    color: 'Color',
    unit: 'Unit',
    graph: 'Chart',
    goal: 'Goal (number)',
    precision: 'Decimals',
    aggregate: 'Aggregation',
    trend: 'Trend',
    label: 'Text instead of value',
    add_metric: 'Add metric',
    graph_line: 'Line',
    graph_bar: 'Bars',
    graph_progress: 'Progress',
    graph_none: 'None',
    agg_mean: 'Average',
    agg_min: 'Minimum',
    agg_max: 'Maximum',
    agg_sum: 'Sum',
    agg_last: 'Last value',
    trend_up_good: 'Rising is good',
    trend_down_good: 'Falling is good',
    trend_neutral: 'Neutral',
    trend_none: 'Hide',
  },
  de: {
    title: 'Titel',
    subtitle: 'Untertitel',
    weather: 'Wetter-Entität (Vorhersage + Lage)',
    days: 'Verlauf (Tage)',
    columns: 'Spalten',
    tiles: 'Metriken als Kacheln anzeigen',
    layout: 'Layout',
    layout_grid: 'Raster',
    layout_carousel: 'Slideshow (scrollbar)',
    background: 'Kartenhintergrund',
    flush: 'Randlos (kein Außenabstand)',
    card_style: 'Stil',
    style_default: 'Standard',
    style_glass: 'Liquid Glass',
    style_material: 'Material You',
    style_bubble: 'Bubble',
    style_mirror: 'Magic Mirror',
    tab_general: 'Allgemein',
    sec_display: 'Darstellung',
    sec_goal: 'Ziel & Fortschritt',
    sec_behavior: 'Verhalten & Daten',
    sec_forecast: 'Vorhersage',
    sec_parts: 'Tageszeiten',
    sec_sky: 'Himmel-Szene',
    sec_sun: 'Sonne',
    sec_moon: 'Mond',
    sec_tides: 'Gezeiten',
    sec_radar: 'Radar',
    sec_summary: 'AI-Zusammenfassung',
    chart_source: 'Kachel-Diagramm zeigt',
    cs_forecast: 'Vorhersage (kommend)',
    cs_history: 'Verlauf (vergangen)',
    goal_type: 'Zielrichtung',
    gt_atleast: 'Mindestens erreichen',
    gt_atmost: 'Höchstens',
    goal_entity: 'Ziel-Sensor (hat Vorrang)',
    start: 'Startwert (Zahl)',
    start_entity: 'Start-Sensor (hat Vorrang)',
    tap_action: 'Klick-Aktion',
    ta_popup: 'Popup (Detailansicht)',
    'ta_more-info': 'More-Info (HA-Dialog)',
    ta_link: 'Link',
    ta_none: 'Nichts',
    link: 'Link (Pfad oder URL)',
    max: 'Maximum (Index)',
    forecast: 'Vorhersage-Wetter-Entität (überschreibt Karte)',
    forecast_type: 'Auflösung',
    ft_hourly: 'Stündlich',
    ft_daily: 'Täglich',
    ft_twice_daily: 'Zweimal täglich',
    forecast_count: 'Anzahl Schritte',
    part_morning: 'Morgen-Entität',
    part_noon: 'Mittag-Entität',
    part_evening: 'Abend-Entität',
    part_night: 'Nacht-Entität',
    condition_entity: 'Wetterlage-Sensor (überschreibt Wetter)',
    sun_entity: 'Sonnen-Entität (Tag/Nacht)',
    wind_entity: 'Wind-Entität (Wolken-Drift)',
    night: 'Nachtmodus erzwingen',
    scene_offset_y: 'Vertikaler Versatz %',
    details: 'Werte unter der Vorhersage (Chips)',
    sunrise_entity: 'Sonnenaufgang-Entität (optional)',
    sunset_entity: 'Sonnenuntergang-Entität (optional)',
    moon_entity: 'Mondphasen-Entität (optional)',
    illumination_entity: 'Beleuchtungs-Entität (0-1 oder %)',
    high_tide_entity: 'Nächste-Flut-Entität',
    low_tide_entity: 'Nächste-Ebbe-Entität',
    image_url: 'Radar-Bild-URL',
    refresh: 'Aktualisierung (Sekunden)',
    summary_entity: 'Zusammenfassungs-Sensor (LLM/AI)',
    summary_sources: 'Quell-Sensoren (erzeugte Zusammenfassung)',
    score_entity: 'Warn-/Index-Sensor (Badge)',
    breakdown: 'Sub-Indizes (Kategoriefarben)',
    expanded: 'Erweiterte Kachel (Details eingeblendet)',
    type: 'Typ',
    entity: 'Entität',
    entity2: 'Zweite Entität (z. B. Böen)',
    entities: 'Entitäten (mehrere Serien)',
    secondary: 'Zusatz-Entitäten (Infozeile)',
    name: 'Name',
    icon: 'Icon',
    color: 'Farbe',
    unit: 'Einheit',
    graph: 'Diagramm',
    goal: 'Ziel (Zahl)',
    precision: 'Nachkommastellen',
    aggregate: 'Aggregation',
    trend: 'Trend',
    label: 'Text statt Wert',
    add_metric: 'Metrik hinzufügen',
    graph_line: 'Linie',
    graph_bar: 'Balken',
    graph_progress: 'Fortschritt',
    graph_none: 'Kein',
    agg_mean: 'Mittelwert',
    agg_min: 'Minimum',
    agg_max: 'Maximum',
    agg_sum: 'Summe',
    agg_last: 'Letzter Wert',
    trend_up_good: 'Steigen ist gut',
    trend_down_good: 'Fallen ist gut',
    trend_neutral: 'Neutral',
    trend_none: 'Ausblenden',
  },
};

@customElement('weatherglass-card-editor')
export class WeatherCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: WeatherCardConfig;
  @state() private _expanded = -1;
  @state() private _tab = 'general';

  public setConfig(config: WeatherCardConfig): void {
    this._config = config;
  }

  private _label(key: string): string {
    const l = LABELS[lang(this.hass)] ?? LABELS.en;
    return l[key] ?? LABELS.en[key] ?? key;
  }

  private _topSchema(): unknown[] {
    return [
      { name: 'title', selector: { text: {} } },
      { name: 'subtitle', selector: { text: {} } },
      { name: 'weather', selector: { entity: { domain: 'weather' } } },
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'days', selector: { number: { min: 1, max: 60, mode: 'box' } } },
          { name: 'columns', selector: { number: { min: 1, max: 3, mode: 'box' } } },
          {
            name: 'layout',
            selector: {
              select: {
                mode: 'dropdown',
                options: [
                  { value: 'grid', label: this._label('layout_grid') },
                  { value: 'carousel', label: this._label('layout_carousel') },
                ],
              },
            },
          },
          {
            name: 'card_style',
            selector: {
              select: {
                mode: 'dropdown',
                options: ['default', 'glass', 'material', 'bubble', 'mirror'].map((v) => ({
                  value: v,
                  label: this._label(`style_${v}`),
                })),
              },
            },
          },
        ],
      },
      { name: 'tiles', selector: { boolean: {} } },
      { name: 'background', selector: { boolean: {} } },
      { name: 'flush', selector: { boolean: {} } },
    ];
  }

  /** Tabs shown for a metric — pill navigation like the Health Card editor. */
  private _metricTabs(type: MetricType): Array<{ id: string; icon: string; label: string }> {
    const tabs = [
      { id: 'general', icon: 'mdi:tune-variant', label: this._label('tab_general') },
      { id: 'display', icon: 'mdi:palette-outline', label: this._label('sec_display') },
    ];
    if (FORECAST_TYPES.includes(type)) {
      tabs.push({
        id: 'forecast',
        icon: 'mdi:clock-fast',
        label: this._label('sec_forecast'),
      });
    }
    tabs.push(
      { id: 'goal', icon: 'mdi:flag-checkered', label: this._label('sec_goal') },
      { id: 'behavior', icon: 'mdi:gesture-tap', label: this._label('sec_behavior') }
    );
    const extra: Partial<Record<MetricType, { id: string; icon: string; label: string }>> = {
      sky: { id: 'sky', icon: 'mdi:weather-partly-cloudy', label: this._label('sec_sky') },
      sun: { id: 'sun', icon: 'mdi:weather-sunset', label: this._label('sec_sun') },
      moon: { id: 'moon', icon: 'mdi:moon-waning-crescent', label: this._label('sec_moon') },
      tides: { id: 'tides', icon: 'mdi:waves', label: this._label('sec_tides') },
      radar: { id: 'radar', icon: 'mdi:radar', label: this._label('sec_radar') },
      summary: { id: 'summary', icon: 'mdi:creation', label: this._label('sec_summary') },
      precipitation: {
        id: 'parts',
        icon: 'mdi:weather-pouring',
        label: this._label('sec_parts'),
      },
    };
    if (extra[type]) tabs.push(extra[type]!);
    return tabs;
  }

  private _metricSchema(m: MetricConfig, tab: string): unknown[] {
    const type = (m.type ?? 'custom') as MetricType;
    const opts = (keys: string[], prefix: string) =>
      keys.map((k) => ({ value: k, label: this._label(`${prefix}_${k}`) }));
    const entitiesEditable = !m.entities || m.entities.every((e) => typeof e === 'string');

    switch (tab) {
      case 'display':
        return [
          {
            type: 'grid',
            name: '',
            schema: [
              { name: 'icon', selector: { icon: {} } },
              {
                name: 'color',
                selector: {
                  select: {
                    mode: 'dropdown',
                    custom_value: true,
                    options: COLOR_NAMES.map((c) => ({ value: c, label: c })),
                  },
                },
              },
              { name: 'unit', selector: { text: {} } },
              {
                name: 'graph',
                selector: {
                  select: {
                    mode: 'dropdown',
                    options: opts(['line', 'bar', 'progress', 'none'], 'graph'),
                  },
                },
              },
              ...(FC_CHART_TYPES.includes(type)
                ? [
                    {
                      name: 'chart_source',
                      selector: {
                        select: {
                          mode: 'dropdown',
                          options: opts(['forecast', 'history'], 'cs'),
                        },
                      },
                    },
                  ]
                : []),
              { name: 'precision', selector: { number: { min: 0, max: 3, mode: 'box' } } },
            ],
          },
          { name: 'label', selector: { text: {} } },
          { name: 'expanded', selector: { boolean: {} } },
        ];

      case 'forecast':
        return [
          { name: 'forecast', selector: { entity: { domain: 'weather' } } },
          {
            type: 'grid',
            name: '',
            schema: [
              {
                name: 'forecast_type',
                selector: {
                  select: {
                    mode: 'dropdown',
                    options: opts(['hourly', 'daily', 'twice_daily'], 'ft'),
                  },
                },
              },
              {
                name: 'forecast_count',
                selector: { number: { min: 2, max: 24, mode: 'box' } },
              },
            ],
          },
        ];

      case 'goal':
        return [
          {
            type: 'grid',
            name: '',
            schema: [
              { name: 'goal', selector: { number: { mode: 'box', step: 'any' } } },
              { name: 'start', selector: { number: { mode: 'box', step: 'any' } } },
            ],
          },
          {
            type: 'grid',
            name: '',
            schema: [
              { name: 'goal_entity', selector: { entity: {} } },
              { name: 'start_entity', selector: { entity: {} } },
            ],
          },
          {
            type: 'grid',
            name: '',
            schema: [
              {
                name: 'goal_type',
                selector: {
                  select: { mode: 'dropdown', options: opts(['atleast', 'atmost'], 'gt') },
                },
              },
              ...(type === 'air_quality' || type === 'pollen'
                ? [{ name: 'max', selector: { number: { min: 1, mode: 'box' } } }]
                : []),
            ],
          },
        ];

      case 'behavior':
        return [
          {
            type: 'grid',
            name: '',
            schema: [
              {
                name: 'tap_action',
                selector: {
                  select: {
                    mode: 'dropdown',
                    options: opts(['popup', 'more-info', 'link', 'none'], 'ta'),
                  },
                },
              },
              ...(m.tap_action === 'link' ? [{ name: 'link', selector: { text: {} } }] : []),
              {
                name: 'aggregate',
                selector: {
                  select: {
                    mode: 'dropdown',
                    options: opts(['mean', 'min', 'max', 'sum', 'last'], 'agg'),
                  },
                },
              },
              {
                name: 'trend',
                selector: {
                  select: {
                    mode: 'dropdown',
                    options: opts(['up_good', 'down_good', 'neutral', 'none'], 'trend'),
                  },
                },
              },
              { name: 'days', selector: { number: { min: 1, max: 60, mode: 'box' } } },
            ],
          },
          { name: 'secondary', selector: { entity: { multiple: true } } },
          { name: 'score_entity', selector: { entity: {} } },
        ];

      case 'sky':
        return [
          {
            type: 'grid',
            name: '',
            schema: [
              { name: 'condition_entity', selector: { entity: {} } },
              { name: 'sun_entity', selector: { entity: { domain: 'sun' } } },
              { name: 'wind_entity', selector: { entity: {} } },
              {
                name: 'scene_offset_y',
                selector: { number: { min: -40, max: 40, mode: 'slider' } },
              },
            ],
          },
          { name: 'details', selector: { entity: { multiple: true } } },
          { name: 'night', selector: { boolean: {} } },
        ];

      case 'sun':
        return [
          { name: 'sun_entity', selector: { entity: { domain: 'sun' } } },
          {
            type: 'grid',
            name: '',
            schema: [
              { name: 'sunrise_entity', selector: { entity: {} } },
              { name: 'sunset_entity', selector: { entity: {} } },
            ],
          },
          { name: 'moon_entity', selector: { entity: {} } },
        ];

      case 'moon':
        return [{ name: 'illumination_entity', selector: { entity: {} } }];

      case 'tides':
        return [
          {
            type: 'grid',
            name: '',
            schema: [
              { name: 'high_tide_entity', selector: { entity: {} } },
              { name: 'low_tide_entity', selector: { entity: {} } },
            ],
          },
        ];

      case 'radar':
        return [
          { name: 'image_url', selector: { text: {} } },
          { name: 'refresh', selector: { number: { min: 5, mode: 'box' } } },
        ];

      case 'summary':
        return [
          { name: 'summary_entity', selector: { entity: {} } },
          { name: 'summary_sources', selector: { entity: { multiple: true } } },
        ];

      case 'parts':
        return [
          {
            type: 'grid',
            name: '',
            schema: [
              { name: 'parts_morning', selector: { entity: {} } },
              { name: 'parts_noon', selector: { entity: {} } },
              { name: 'parts_evening', selector: { entity: {} } },
              { name: 'parts_night', selector: { entity: {} } },
            ],
          },
        ];

      default:
        // general
        return [
          {
            type: 'grid',
            name: '',
            schema: [
              {
                name: 'type',
                selector: {
                  select: {
                    mode: 'dropdown',
                    options: METRIC_TYPES.map((k) => ({ value: k, label: t(this.hass, k) })),
                  },
                },
              },
              { name: 'name', selector: { text: {} } },
            ],
          },
          { name: 'entity', selector: { entity: {} } },
          ...(type === 'wind' ? [{ name: 'entity2', selector: { entity: {} } }] : []),
          ...(MULTI_TYPES.includes(type) && entitiesEditable
            ? [{ name: 'entities', selector: { entity: { multiple: true } } }]
            : []),
          ...(type === 'air_quality' &&
          (!m.breakdown || m.breakdown.every((b) => typeof b === 'string'))
            ? [{ name: 'breakdown', selector: { entity: { multiple: true } } }]
            : []),
        ];
    }
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${{
          tiles: true,
          background: true,
          layout: 'grid',
          card_style: 'default',
          ...this._config,
        }}
        .schema=${this._topSchema()}
        .computeLabel=${(s: { name: string }) => this._label(s.name)}
        @value-changed=${this._topChanged}
      ></ha-form>

      <div class="metrics">
        ${this._config.metrics.map((m, i) => this._renderMetricEditor(m, i))}
      </div>

      <button class="add" @click=${this._addMetric}>
        <ha-icon icon="mdi:plus"></ha-icon>
        ${this._label('add_metric')}
      </button>
    `;
  }

  private _renderMetricEditor(m: MetricConfig, i: number): TemplateResult {
    const type = (m.type ?? 'custom') as MetricType;
    const preset = PRESETS[type] ?? PRESETS.custom;
    const open = this._expanded === i;
    const count = this._config!.metrics.length;
    return html`
      <div class="metric ${open ? 'open' : ''}">
        <div
          class="metric-head"
          @click=${() => {
            this._expanded = open ? -1 : i;
            this._tab = 'general';
          }}
        >
          <span class="chip" style="--c:${resolveColor(m.color) ?? resolveColor(preset.color)}">
            <ha-icon .icon=${m.icon ?? preset.icon}></ha-icon>
          </span>
          <span class="metric-title">
            ${m.name ?? t(this.hass, type)}
            <span class="metric-entity">${m.entity ?? ''}</span>
          </span>
          <button class="icon-btn" .disabled=${i === 0} title="↑" @click=${(e: Event) => this._move(e, i, -1)}>
            <ha-icon icon="mdi:chevron-up"></ha-icon>
          </button>
          <button class="icon-btn" .disabled=${i === count - 1} title="↓" @click=${(e: Event) => this._move(e, i, 1)}>
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </button>
          <button class="icon-btn danger" @click=${(e: Event) => this._remove(e, i)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
          <ha-icon class="expand" icon=${open ? 'mdi:chevron-up' : 'mdi:chevron-down'}></ha-icon>
        </div>
        ${open ? this._renderMetricBody(m, i, type) : nothing}
      </div>
    `;
  }

  private _renderMetricBody(m: MetricConfig, i: number, type: MetricType): TemplateResult {
    const tabs = this._metricTabs(type);
    const active = tabs.some((x) => x.id === this._tab) ? this._tab : 'general';
    return html`<div class="metric-body">
      <div class="tabs">
        ${tabs.map(
          (x) => html`<button
            class="tab ${active === x.id ? 'active' : ''}"
            @click=${() => (this._tab = x.id)}
          >
            <ha-icon .icon=${x.icon}></ha-icon>
            <span>${x.label}</span>
          </button>`
        )}
      </div>
      <ha-form
        .hass=${this.hass}
        .data=${{
          ...m,
          goal: typeof m.goal === 'number' ? m.goal : undefined,
          goal_entity: typeof m.goal === 'string' ? m.goal : undefined,
          start: typeof m.start === 'number' ? m.start : undefined,
          start_entity: typeof m.start === 'string' ? m.start : undefined,
          parts_morning: m.parts?.morning,
          parts_noon: m.parts?.noon,
          parts_evening: m.parts?.evening,
          parts_night: m.parts?.night,
        }}
        .schema=${this._metricSchema(m, active)}
        .computeLabel=${(s: { name: string }) => this._label(s.name)}
        @value-changed=${(ev: CustomEvent) => this._metricChanged(ev, i)}
      ></ha-form>
    </div>`;
  }

  private _emit(config: WeatherCardConfig): void {
    this._config = config;
    this.dispatchEvent(
      new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true })
    );
  }

  private _clean<T extends object>(obj: T): T {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v === '' || v === null || v === undefined) continue;
      if (Array.isArray(v) && !v.length) continue;
      out[k] = v;
    }
    return out as T;
  }

  private _topChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;
    const value = ev.detail.value as Partial<WeatherCardConfig>;
    this._emit(this._clean({ ...this._config, ...value, metrics: this._config.metrics }));
  }

  private _metricChanged(ev: CustomEvent, index: number): void {
    ev.stopPropagation();
    if (!this._config) return;
    const value = { ...(ev.detail.value as Record<string, unknown>) };

    const parts: Record<string, string> = {};
    for (const key of ['morning', 'noon', 'evening', 'night']) {
      const v = value[`parts_${key}`];
      delete value[`parts_${key}`];
      if (typeof v === 'string' && v) parts[key] = v;
    }
    if (Object.keys(parts).length) value.parts = parts;
    else delete value.parts;

    for (const key of ['goal', 'start']) {
      const entityValue = value[`${key}_entity`];
      delete value[`${key}_entity`];
      if (typeof entityValue === 'string' && entityValue) value[key] = entityValue;
    }

    const metrics = [...this._config.metrics];
    metrics[index] = this._clean(value as MetricConfig);
    this._emit({ ...this._config, metrics });
  }

  private _addMetric(): void {
    if (!this._config) return;
    const metrics = [...this._config.metrics, { type: 'temperature' as MetricType }];
    this._expanded = metrics.length - 1;
    this._emit({ ...this._config, metrics });
  }

  private _remove(ev: Event, index: number): void {
    ev.stopPropagation();
    if (!this._config) return;
    const metrics = this._config.metrics.filter((_, i) => i !== index);
    if (this._expanded === index) this._expanded = -1;
    this._emit({ ...this._config, metrics });
  }

  private _move(ev: Event, index: number, dir: number): void {
    ev.stopPropagation();
    if (!this._config) return;
    const metrics = [...this._config.metrics];
    const target = index + dir;
    if (target < 0 || target >= metrics.length) return;
    [metrics[index], metrics[target]] = [metrics[target], metrics[index]];
    if (this._expanded === index) this._expanded = target;
    this._emit({ ...this._config, metrics });
  }

  static styles = css`
    .metrics {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 16px;
    }
    .metric {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      overflow: hidden;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .metric:hover {
      border-color: color-mix(in srgb, var(--primary-color) 50%, var(--divider-color));
    }
    .metric.open {
      border-color: var(--primary-color);
      box-shadow: 0 2px 12px color-mix(in srgb, var(--primary-color) 12%, transparent);
    }
    .metric-head {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      cursor: pointer;
      color: var(--primary-text-color);
    }
    .chip {
      width: 30px;
      height: 30px;
      flex: none;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--c, var(--primary-color));
      background: color-mix(in srgb, var(--c, var(--primary-color)) 15%, transparent);
    }
    .chip ha-icon {
      --mdc-icon-size: 17px;
    }
    .metric-title {
      flex: 1;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .metric-entity {
      color: var(--secondary-text-color);
      font-size: 12px;
      margin-left: 6px;
    }
    .metric-body {
      padding: 12px;
      border-top: 1px solid var(--divider-color);
    }
    .tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-bottom: 14px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--divider-color);
    }
    .tab {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 6px 11px;
      border: none;
      border-radius: 999px;
      background: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 500;
      font-family: inherit;
    }
    .tab ha-icon {
      --mdc-icon-size: 15px;
    }
    .tab:hover {
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
    .tab.active {
      background: color-mix(in srgb, var(--primary-color) 14%, transparent);
      color: var(--primary-color);
    }
    .icon-btn {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: var(--secondary-text-color);
      display: flex;
      border-radius: 6px;
    }
    .icon-btn:hover {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .icon-btn[disabled] {
      opacity: 0.3;
      cursor: default;
    }
    .icon-btn.danger:hover {
      color: var(--error-color, #db4437);
    }
    .icon-btn ha-icon {
      --mdc-icon-size: 18px;
    }
    .expand {
      color: var(--secondary-text-color);
    }
    .add {
      margin-top: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
    }
    .add ha-icon {
      --mdc-icon-size: 18px;
    }
    .add.small {
      margin-top: 8px;
      padding: 6px 12px;
      font-size: 13px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'weatherglass-card-editor': WeatherCardEditor;
  }
}
