# Weatherglass

Eine voll konfigurierbare, **Vorhersage-zentrierte** Wetter-Dashboard-Karte für
Home Assistant: Temperatur, gefühlte Temperatur, Wind, Niederschlag,
Luftfeuchte, Luftdruck, UV-Index, Bewölkung, Sichtweite, Luftqualität, Sonne,
Mond, Gezeiten, Pollen, Radar — mit einer großen **animierten Himmel-Szene**,
die live auf das echte Wetter reagiert, und einer **AI-Zusammenfassung**.
Vollständig Theme-kompatibel (Light & Dark).

> Schwesterkarte zur [Health Card](https://github.com/BobMcGlobus/HealthCard) —
> gleiche Bedienung, gleiche Editor-Logik, nur fürs Wetter.

## Features

- 📅 **Vorhersage zuerst**: Kachel-Diagramme zeigen, was **kommt** — stündliche Prognose-Kurven/-Balken mit Stunden-Achse und „Jetzt"-Punkt; auch der Trend-Pfeil beschreibt die kommende Entwicklung. Der Verlauf (historische Daten) wohnt im Detail-Popup (Zeiträume: Tag stündlich / Woche / Monat / 3M / Jahr / Max). Umschaltbar je Kachel per `chart_source: history`.
- 🎨 **Cleaner Look**: Kacheln mit großen Werten, Icon-Chips und weichen Kurven
- 🌗 **100 % Theme-Support**: nutzt ausschließlich HA-Theme-Variablen (`--primary-text-color`, `--ha-card-background`, `--red-color`, …)
- 🌤️ **Himmel-Szene** (`type: sky`): das animierte Herzstück. Der Himmelsverlauf folgt der **echten Sonnen-Elevation** (Nacht → Dämmerungsrosa → goldene Stunde → Tag), die Sonne steht auf ihrer wahren Höhe (pulsierender Glow, drehende Strahlen), nachts funkeln Sterne (mit gelegentlicher Sternschnuppe) um den Mond. Wolken driften auf **drei Parallax-Ebenen** (die hinterste unscharf) in Windgeschwindigkeit, Regen fällt **windschräg** in zwei Tiefen (bei Starkregen mit Boden-Splashes), Schnee taumelt, Blitze erhellen die ganze Szene, Nebelbänke ziehen, bei klarem Tag kreuzen Vögel. **Grüne Hügel mit Tannen** erden die Szene — saftig bei schönem Wetter, schneebedeckt bei Schnee, entsättigt bei Sturm, Silhouetten bei Nacht. Temperatur, Wetterlage und Tages-Hoch/-Tief liegen darüber, ein `score_entity` legt eine pulsierende Warn-Vignette darüber. Unter der Szene: ein **Stündlich/Täglich-Umschalter** für den Vorhersagestreifen und eine **Datenzeile mit beschrifteten Chips** (`details`; ohne Konfiguration automatisch Wind/Luftfeuchte/Luftdruck/UV aus der Wetter-Entität).
- 🌅 **Sonnen-Bogen** (`type: sun`): Sonnenauf- und -untergang als Tageslicht-Bogen mit Sonnen-Marker am aktuellen Stand, Tageslänge und „Untergang in X" — das Wetter-Pendant zum Zyklus-Ring.
- 🌙 **Mondphase** (`type: moon`): Mondscheibe mit exakt berechnetem Terminator (Sichel/Halb/Voll, zu-/abnehmend), Phasenname und Beleuchtung in %.
- 🌊 **Gezeiten** (`type: tides`): Tiden-Kurve über den Tag mit Jetzt-Marker (aus der Recorder-History oder synthetisch halbtägig), aktuellem Pegel und nächster Flut/Ebbe-Zeit.
- 🤧 **Pollen** (`type: pollen`): Belastung je Allergen als Balken, nach Stufe eingefärbt (grün → gelb → rot); versteht Zahlen **und** Textstufen (`none`/`low`/`hoch` …).
- 📡 **Wetterradar** (`type: radar`): Radarbild aus einer `camera.*`-Entität (`entity_picture`) oder einer festen `image_url`.
- 💯 **Luftqualitäts-/Index-Ring** (`type: air_quality`): Fortschrittsring mit „34 von 100", Ampelfarbe nach Wert (niedrig = gut), **Sub-Indizes** (PM2.5 / PM10 / Ozon …) als Mini-Balken.
- 🤖 **AI-Zusammenfassung** (`type: summary`): natürlich­sprachiger Wetter­text. Entweder aus einem Text-Sensor (`summary_entity`, z. B. ein LLM-/AI-Task-Sensor) — oder, wenn keiner gesetzt ist, **selbst erzeugt** aus Wetter­lage, Temperatur, Tages-Hoch/-Tief, Wind, Regen­wahrscheinlichkeit, UV und der Aussicht auf morgen (Deutsch & Englisch).
- 📅 **Vorhersage** (`Vorhersage`-Streifen): stündlich oder täglich, aus der HA-Wetter-Entität (`weather.get_forecasts` → Live-Abo → Legacy-Attribut). Pro Schritt Zeit/Tag, Wetter-Icon, Regen­wahrscheinlichkeit und Temperatur (bzw. Hoch/Tief). Die Temperatur-Kurve wird um eine gestrichelte Vorhersage-Verlängerung ergänzt.
- 📈 **Diagramme pro Metrik**: Linie, Balken, Fortschrittsbalken oder keins
- 🌧️ **Niederschlag nach Tageszeit** (`parts`): Segmentbalken + Aufschlüsselung (Morgen/Mittag/Abend/Nacht), plus eine Regen-Ereignis-Timeline im Popup
- 💨 **Wind** mit Böen (`entity2`) und einer **Kompass-Rose** im Popup (Windrichtung + Geschwindigkeit)
- ↗️ **Trends**: automatische Trend-Pfeile aus der Recorder-History
- 🚦 **Warn-Badge**: `score_entity` zeigt eine Ampel-Plakette auf der Kachel
- 🎠 **Carousel-Layout**: alle Kacheln horizontal scrollbar auf minimalem Platz
- 🫥 **Einbettbar**: Kartenhintergrund abschaltbar (`background: false`) + randlose Darstellung (`flush`)
- 🔍 **Detail-Popup**: Klick auf eine Kachel öffnet eine Detailansicht mit Vorhersage, großem Verlauf, Wochentagen und Min/Ø/Max/Trend
- 📅 **Zeiträume im Popup**: Tag (stündlich) / Woche / Monat / 3 Monate / Jahr / **Max** — lange Zeiträume kommen aus den Langzeit-Statistiken und der Graph wird horizontal scrollbar
- 🖱️ **Klick-Aktion pro Kachel**: Popup, More-Info, Link oder nichts
- 🎨 **5 Kartenstile** über `card_style`: Standard (Default), Liquid Glass, Material You, Bubble, Magic Mirror
- 🖱️ **Visueller Editor mit Tabs**: Allgemein / Darstellung / Vorhersage / Ziel / Verhalten plus typspezifische Tabs (Himmel, Sonne, Mond, Gezeiten, Radar, Zusammenfassung, Tageszeiten)
- 🖱️ **Visueller Editor**: Metriken per UI hinzufügen, sortieren, konfigurieren
- 🌍 Deutsch & Englisch (automatisch nach HA-Sprache)

## Installation

### HACS

1. HACS → *Custom repositories* → dieses Repository als Typ **Dashboard** hinzufügen
2. „Weatherglass" installieren
3. Die Ressource wird automatisch registriert

### Manuell

1. [`dist/weatherglass-card.js`](dist/weatherglass-card.js) nach `config/www/weatherglass-card.js` kopieren
2. *Einstellungen → Dashboards → ⋮ → Ressourcen* → `/local/weatherglass-card.js` als **JavaScript-Modul** hinzufügen

## Konfiguration

```yaml
type: custom:weatherglass-card
title: Wetter
subtitle: Zuhause
weather: weather.home        # Wetter-Entität für Vorhersage + Wetterlage
metrics:
  - type: sky                # große animierte Himmel-Szene
    entity: weather.home
    score_entity: sensor.warnstufe
    # Daten-Chips unter der Vorhersage (weglassen = automatisch aus weather.home)
    details:
      - sensor.wind
      - sensor.luftfeuchte
      - sensor.luftdruck
      - sensor.uv
  - type: summary            # AI-/Text-Zusammenfassung
    # summary_entity: sensor.wetter_text_ki   # optional: fertiger LLM-Text
  - type: temperature
    entity: sensor.aussentemperatur
    expanded: true
  - type: feels_like
    entity: sensor.gefuehlt
  - type: wind
    entity: sensor.wind
    entity2: sensor.windboe   # Böen
  - type: precipitation
    entity: sensor.niederschlag
    parts:
      morning: sensor.regen_morgen
      noon: sensor.regen_mittag
      evening: sensor.regen_abend
      night: sensor.regen_nacht
  - type: humidity
    entity: sensor.luftfeuchte
  - type: uv
    entity: sensor.uv
    max: 11                   # Skala des Fortschrittsbalkens
  - type: pressure
    entity: sensor.luftdruck
  - type: cloud
    entity: sensor.bewoelkung
  - type: visibility
    entity: sensor.sichtweite
  - type: air_quality        # Index-Ring
    entity: sensor.aqi
    max: 100
    breakdown:
      - { entity: sensor.pm25, name: PM2.5, color: teal }
      - { entity: sensor.pm10, name: PM10, color: amber }
      - { entity: sensor.ozon, name: Ozon, color: deep-orange }
  - type: sun
    sun_entity: sun.sun
```

Kompakt in einem Container, scrollbar und ohne eigenen Hintergrund:

```yaml
type: custom:weatherglass-card
layout: carousel
background: false
flush: true
weather: weather.home
metrics: [...]
```

### Karten-Optionen

| Option       | Typ     | Default    | Beschreibung                                               |
| ------------ | ------- | ---------- | ---------------------------------------------------------- |
| `title`      | string  | –          | Überschrift                                                |
| `subtitle`   | string  | –          | Untertitel                                                 |
| `weather`    | string  | –          | Standard-Wetter-Entität für Vorhersage + Wetterlage        |
| `days`       | number  | `7`        | History-Zeitraum in Tagen (für alle Metriken)              |
| `columns`    | number  | `1`        | Kachel-Spalten (1–3)                                       |
| `layout`     | string  | `grid`     | `grid` oder `carousel`                                     |
| `card_style` | string  | `default`  | `default`, `glass`, `material`, `bubble`, `mirror`              |
| `tiles`      | boolean | `true`     | Metriken als Kacheln (`false` = flache Zeilen)             |
| `background` | boolean | `true`     | `false`: Kartenhintergrund/-schatten entfernen             |
| `flush`      | boolean | `false`    | `true`: kein Außenabstand                                  |
| `metrics`    | list    | –          | **Pflicht.** Liste der Metriken                            |

### Metrik-Typen

| Typ            | Icon                        | Farbe       | Diagramm | Beschreibung                                       |
| -------------- | --------------------------- | ----------- | -------- | -------------------------------------------------- |
| `temperature`  | `mdi:thermometer`           | orange      | line     | Temperatur (mit Vorhersage-Verlängerung)           |
| `feels_like`   | `mdi:thermometer-lines`     | deep-orange | line     | Gefühlte Temperatur                                |
| `wind`         | `mdi:weather-windy`         | teal        | line     | Windgeschwindigkeit; `entity2` = Böen; Kompass im Popup |
| `precipitation`| `mdi:weather-pouring`       | blue        | bar      | Niederschlag; `parts` = Tageszeiten; Regen-Timeline |
| `humidity`     | `mdi:water-percent`         | light-blue  | progress | Luftfeuchte (0–100 %)                              |
| `pressure`     | `mdi:gauge`                 | blue-grey   | line     | Luftdruck                                          |
| `uv`           | `mdi:weather-sunny-alert`   | amber       | progress | UV-Index (`max` = Skala, z. B. 11)                 |
| `cloud`        | `mdi:weather-cloudy`        | blue-grey   | progress | Bewölkung (0–100 %)                                |
| `visibility`   | `mdi:eye`                   | cyan        | line     | Sichtweite                                         |
| `air_quality`  | `mdi:air-filter`            | green       | Ring     | Luftqualitäts-/Index-Ring mit `breakdown`          |
| `sun`          | `mdi:weather-sunset`        | amber       | Bogen    | Sonnenauf-/untergang, Tageslänge                   |
| `moon`         | `mdi:moon-waning-crescent`  | blue-grey   | Scheibe  | Mondphase mit korrektem Terminator + Beleuchtung   |
| `tides`        | `mdi:waves`                 | light-blue  | Welle    | Gezeiten-Kurve mit Jetzt-Marker, Flut/Ebbe-Zeiten  |
| `pollen`       | `mdi:flower-pollen`         | green       | Balken   | Pollenbelastung je Allergen, nach Stufe eingefärbt |
| `radar`        | `mdi:radar`                 | blue        | Bild     | Wetterradar aus einer `camera.*`-Entität oder URL  |
| `sky`          | `mdi:weather-partly-cloudy` | blue        | Szene    | Große animierte Himmel-Szene mit Vorhersage + Daten-Chips |
| `summary`      | `mdi:creation`              | deep-purple | Text     | AI-/Text-Zusammenfassung                           |
| `custom`       | `mdi:chart-line`            | primary     | line     | Beliebiger Sensor                                  |

### Metrik-Optionen

| Option           | Typ           | Beschreibung                                                            |
| ---------------- | ------------- | ---------------------------------------------------------------------- |
| `entity`         | string        | Primäre Entität (Sensor oder — bei `sky` — eine `weather.*`-Entität)   |
| `entity2`        | string        | Zweite Entität (Wind: Böen)                                            |
| `entities`       | list          | Mehrere Serien (Luftqualität): Entity-IDs oder Objekte                 |
| `secondary`      | list          | Zusatz-Entitäten als Infozeile                                        |
| `name` / `icon` / `color` / `unit` | – | Anzeige                                                     |
| `graph`          | string        | `line`, `bar`, `progress`, `none`                                     |
| `goal` / `start` / `goal_type` | – | Ziel & Fortschritt (Zahl oder Sensor)                           |
| `max`            | number        | `air_quality`: Ring-Maximum · `progress`: Balken-Skala                 |
| `precision` / `aggregate` / `trend` / `duration` | – | Datenverhalten                            |
| `days`           | number        | History-Zeitraum nur für diese Metrik                                 |
| `tap_action` / `link` | –        | `popup` (Default), `more-info`, `link`, `none`                        |
| `expanded`       | bool          | Popup-Details direkt auf der Kachel                                   |
| `score_entity`   | string        | Warn-/Index-Sensor → Ampel-Badge; bei `sky` der Warn-Glow            |
| **Vorhersage**   |               |                                                                        |
| `forecast`       | string        | Wetter-Entität für die Vorhersage (Default: `weather` der Karte)     |
| `forecast_type`  | string        | `hourly` (Default bei Temp/Wind/Regen), `daily`, `twice_daily`       |
| `forecast_count` | number        | Anzahl der angezeigten Vorhersage-Schritte                           |
| `chart_source`   | string        | Kachel-Diagramm: `forecast` (Default — kommende Werte) oder `history` |
| **Niederschlag** |               |                                                                        |
| `parts`          | object        | `morning`/`noon`/`evening`/`night`-Entitäten                          |
| **Himmel (`sky`)** |             |                                                                        |
| `condition_entity` | string      | Wetterlage-Sensor (überschreibt die Wetter-Entität)                  |
| `sun_entity`     | string        | `sun.sun` für Tag/Nacht                                               |
| `wind_entity`    | string        | stärkerer Wind → schnellere Wolken                                    |
| `night`          | bool          | Nachtmodus erzwingen                                                   |
| `details`        | list          | Beschriftete Wert-Chips unter der Vorhersage (Entity-IDs oder `{entity, name, attribute, unit}`); Default: Wind/Feuchte/Druck/UV aus der Wetter-Entität |
| `scene_offset_y` | number        | Feinjustierung (vertikaler Versatz %)                                  |
| **Sonne (`sun`)** |              |                                                                        |
| `sun_entity` / `sunrise_entity` / `sunset_entity` / `moon_entity` | – | Sonnen-/Zeit-Quellen                    |
| **Mond (`moon`)** |              |                                                                        |
| `illumination_entity` | string  | Beleuchtungs-Entität (0–1 oder %), falls getrennt von der Phase        |
| **Gezeiten (`tides`)** |         |                                                                        |
| `high_tide_entity` / `low_tide_entity` | – | Zeit-Entitäten für nächste Flut/Ebbe (sonst aus den Attributen) |
| **Radar (`radar`)** |            |                                                                        |
| `image_url` / `refresh`  | –      | Feste Bild-URL (statt Kamera) · Auto-Aktualisierung in Sekunden        |
| **Zusammenfassung (`summary`)** |               |                                                          |
| `summary_entity` | string        | Text-Sensor mit fertiger Zusammenfassung (z. B. LLM/AI Task)         |
| `summary_sources`| list          | Quell-Sensoren für die selbst erzeugte Zusammenfassung               |

## Vorhersage-Quelle

Die Vorhersage wird — in dieser Reihenfolge, je nach dem was die Integration
bietet — geladen über:

1. `weather.get_forecasts` (Service-Aufruf mit Antwort) — funktioniert auf jeder
   modernen HA-Wetter-Integration,
2. das Live-Abo `weather/subscribe_forecast`,
3. das (ältere) `forecast`-Attribut der Wetter-Entität.

Es reicht also, unter `weather:` (bzw. `forecast:` je Metrik) eine
`weather.*`-Entität anzugeben.

## Theming

Die Karte verwendet ausschließlich Theme-Variablen. Benannte Farben (`red`,
`teal`, …) werden auf die HA-Farbvariablen abgebildet. Zusätzlich anpassbar:

```yaml
# im Theme
weatherglass-beispiel:
  wc-tile-radius: 20px   # Eckenradius der Kacheln (--wc-tile-radius)
```

## Entwicklung

> **Node 18+** erforderlich (Vite 5).

```bash
npm install
npm run build       # dist/weatherglass-card.js
npx vite            # Dev-Vorschau mit Mock-Daten (index.html + dev/demo.js)
```

## Lizenz

MIT
