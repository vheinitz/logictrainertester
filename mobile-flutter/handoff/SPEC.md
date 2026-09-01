# LOGIK-Trainer Mobile — Specification

Derived from the HTML prototype (`prototype.html`, open it in any browser). The prototype is
the visual and behavioural source of truth. Where this document and the prototype disagree,
the prototype wins.

---

## 1. Product

An Android app for cognitive training and screening of children aged 3–18. It is the mobile
companion to the existing desktop LOGIK-Trainer (`vheinitz/logictrainertester`). It offers 32
task modules grouped into 5 KABC-derived ability scales, runs adaptive test sessions, and
builds a per-child cognitive profile.

All data stays on the device. No account, no network, no telemetry.

---

## 2. Domain model

### 2.1 Scales

Five scales. `code` is the two-letter badge shown in the UI.

| id | code | short | name | intro |
|---|---|---|---|---|
| `sequential` | SQ | Sequentiell | Kurzzeitgedächtnis (Gsm) | Reihenfolgen behalten und wiedergeben — Zahlen, Wörter, Bewegungen. Gemessen wird die Spanne, nicht das Tempo. |
| `simultan` | SI | Simultan | Visuelle Verarbeitung (Gv) | Ganzes aus Teilen erkennen: Muster, Formen, Gesichter, Wege. |
| `lernen` | LE | Lernen | Langzeitgedächtnis (Glr) | Neues koppeln und später wieder abrufen. Der Abstand zum Abruf ist Teil des Tests. |
| `planung` | PL | Planung | Fluide Intelligenz (Gf) | Regeln finden und Schritte vorausdenken. |
| `wissen` | WI | Wissen | Kristalline Fähigkeiten (Gc) | Wortschatz, Sachwissen, Sprachverständnis. |

### 2.2 Modules

32 modules. Fields: `id`, `scale`, `title`, `ages` (display string), `mode`, `engine`.

`mode` ∈ `self` (allein) | `tutor` (mit Begleitung) | `mixed` (gemischt) — display only, it does
not change task behaviour.

`engine` ∈ `span-num` | `span-word` | `choice`.

| id | scale | title | ages | mode | engine |
|---|---|---|---|---|---|
| `seq-zahlenfolgen` | sequential | Zahlenfolgen sehen | 4-18 | self | span-num |
| `seq-zahlenfolgen-audio` | sequential | Zahlenfolgen hören | 4-18 | self | span-num |
| `seq-zahlen-rueckwaerts` | sequential | Zahlenfolge rückwärts | 5-18 | self | span-num |
| `seq-wortreihe` | sequential | Wörter-Kette sehen | 3-18 | self | span-word |
| `seq-wortreihe-audio` | sequential | Wörter-Kette hören | 4-18 | self | span-word |
| `seq-handbewegungen` | sequential | Händchen-Folge | 4-18 | self | choice |
| `seq-koffer-packen` | sequential | Koffer packen sehen | 3-18 | self | span-word |
| `seq-koffer-packen-audio` | sequential | Koffer packen hören | 4-18 | self | span-word |
| `seq-rhythmus` | sequential | Rhythmus-Klopfer | 4-18 | self | choice |
| `sim-konzeptbildung` | simultan | Was passt nicht? | 3-6 | self | choice |
| `sim-gesichter` | simultan | Gesichter-Merkspiel | 4-18 | self | choice |
| `sim-rover` | simultan | Rover im Labyrinth | 6-18 | self | choice |
| `sim-dreiecke` | simultan | Dreiecke legen | 3-12 | mixed | choice |
| `sim-bausteine` | simultan | Bausteine zählen | 5-18 | self | choice |
| `sim-gestaltschliessen` | simultan | Was ist das? | 3-18 | self | choice |
| `sim-tangram` | simultan | Tangram-Puzzle | 6-18 | self | choice |
| `sim-suchbild` | simultan | Suchbild-Vergleich | 4-18 | self | choice |
| `lern-atlantis` | lernen | Atlantis: Fisch-Namen | 3-18 | self | choice |
| `lern-symbole` | lernen | Symbole merken | 4-18 | self | choice |
| `lern-atlantis-abruf` | lernen | Atlantis: Namen erinnern | 3-18 | self | choice |
| `lern-symbole-abruf` | lernen | Symbole erinnern | 4-18 | self | choice |
| `lern-memory` | lernen | Memory | 3-18 | self | choice |
| `lern-storycubes` | lernen | Geschichten-Würfel | 6-18 | tutor | choice |
| `plan-geschichten` | planung | Bildergeschichte ordnen | 7-18 | self | choice |
| `plan-muster` | planung | Muster fortsetzen | 7-18 | self | choice |
| `plan-sudoku` | planung | Bilder-Sudoku | 8-18 | self | choice |
| `plan-zaubertricks` | planung | Zaubertrick nachmachen | 7-18 | tutor | choice |
| `wiss-wortschatz` | wissen | Wortschatz-Quiz | 3-6 | self | choice |
| `wiss-sachwissen` | wissen | Was weißt du? | 7-18 | self | choice |
| `wiss-raetsel` | wissen | Rätsel-Raten | 3-18 | self | choice |
| `wiss-oberbegriffe` | wissen | Oberbegriffe finden | 6-18 | self | choice |
| `wiss-teekesselchen` | wissen | Teekesselchen | 6-18 | self | choice |

> **Scope note.** The prototype implements only two generic engines and maps every module onto
> one of them. Twenty-plus modules therefore currently render the same odd-one-out task. That is
> a prototype shortcut, not a product decision. Build the two real engines first and keep the
> module→engine mapping data-driven so bespoke engines can be added later without touching
> navigation, scoring or persistence.

### 2.3 Result record

One record per module, keyed by module id:

```
Result { moduleId, best: int, correct: int, total: int, date: DateTime }
```

`best` = highest level answered correctly in the run. `correct`/`total` = rounds. A new run for
the same module **overwrites** the previous record (see §7 for what to change).

---

## 3. Engines

### 3.1 Span engines (`span-num`, `span-word`)

A sequence is presented one item at a time, then reproduced by tapping.

**Generation.** Sequence length = current `level`.
- `span-num`: pool `['1'..'9','0']`, repeats allowed.
- `span-word`: pool `['Baum','Hund','Stern','Haus','Fisch','Blume','Ball','Mond']`, **no repeats
  within a sequence**.

**Presentation phase (`show`).** Items appear one at a time in a large numeral/word, each held
for `stepMs` (see §5 tempo). A progress bar fills `(showIdx+1)/length`. After the last item the
phase switches to `input`.

**Input phase (`input`).** A response bank is shown as a grid — 5 columns for `span-num` (pool in
natural order), 2 columns for `span-word` (pool **shuffled** per round). Each tap appends to the
entry row. "Zurücknehmen" removes the last entry. When entry length reaches sequence length the
answer is graded: correct iff every position matches.

On error, the feedback detail reads: `Richtig wäre: <seq joined with " · ">`.

**`seq-zahlen-rueckwaerts`** should grade against the reversed sequence. The prototype does not
yet do this — implement it properly.

**Audio modules** (`*-audio`, titles ending "hören"): the sequence must be played as speech/tones
instead of shown. See §8.

### 3.2 Choice engine (`choice`) — odd-one-out

Six tiles in a 3-column grid, each an outlined geometric figure (square, circle, triangle) drawn
at stroke width 1.5 in the accent. One tile is the odd one; tapping it is correct.

Difficulty ladder by `level`:
- level 1–2: odd tile has a **different shape** from the other five.
- level ≥ 3: all six share a shape; the odd tile is **filled** instead of outlined.
- level ≥ 5: additionally the odd tile is **rotated 180°**.

On error the detail reads: `Eine Figur weicht ab — Form, Füllung oder Drehung.`

---

## 4. Session and adaptive leveling

```
start(moduleId):
  level  = (engine == choice) ? 1 : 2
  rounds = 0, correct = 0, best = 0

each round:
  present → collect answer → grade
  rounds += 1
  if correct: correct += 1; best = max(best, level)
  nextLevel = correct ? level + 1 : max(floor, level - 1)     // floor = 1 for choice, 2 for span
  show feedback for 1500 ms
  if rounds >= settings.rounds: finish
  else: level = nextLevel; next round
```

Feedback screen: a 60×60 outlined square containing a check (correct, accent `#5980a6`) or an X
(incorrect, warn `#8a5a3c`), the word "Richtig" / "Nicht richtig", and the detail line.

A row of round dots at the top of the training screen shows `settings.rounds` cells; completed
rounds are filled with the accent.

**Exit.** "Beenden" discards the run entirely — no result is written. It returns to the scale
list if the run was started from one, otherwise to the tab root.

---

## 5. Settings

| Setting | Type | Range | Default |
|---|---|---|---|
| Übungen je Durchgang (rounds) | int slider | 4–16 | 8 |
| Alter des Kindes (age) | int slider | 3–18 | 9 |
| Ton (sound) | switch | — | on |
| Darbietungstempo (speed) | segmented | Langsam 1100 ms / Mittel 800 ms / Zügig 560 ms | Mittel |

Plus a data block: text "Alles bleibt auf dem Gerät. Kein Konto, keine Übertragung." and a
destructive "Ergebnisse löschen" button (must confirm before wiping — the prototype does not).

Language switch DE / RU / EN sits in the app bar. **In the prototype it is decorative.** In the
Flutter app it must be real (see §8).

---

## 6. Scoring against Richtwerte

Expected level for a scale at a given age:

```
base = { sequential: 2.2, simultan: 1.4, lernen: 1.6, planung: 1.2, wissen: 1.3 }[scaleId]
expected(scaleId, age) = round((base + age * 0.32) * 10) / 10
```

Verdict from `ratio = best / expected`:

| ratio | verdict | colour |
|---|---|---|
| ≥ 1.15 | über Richtwert | `#416180` (deep) |
| ≥ 0.85 | im Richtwert | `#5980a6` (accent) |
| ≥ 0.60 | unter Richtwert | `#8a5a3c` (warn) |
| < 0.60 | deutlich darunter | `#8a5a3c` (warn) |

Result bar: filled width = `min(100, best / (expected * 1.6) * 100)` %, with a 1 px vertical
marker at `1/1.6 = 62.5 %` denoting the expected value.

Disclaimer, always shown under the bar: "Orientierungswert aus Literaturangaben, keine geeichte
Norm."

> These coefficients are a placeholder curve invented for the prototype. Before any real use they
> must be replaced with the desktop app's norm tables. Keep them in one injectable
> `NormsRepository` so swapping them is a one-file change.

### Profile bars (Auswertung)

Per scale: `avg` = mean of `best` across tested modules in that scale; `e = expected(scale, age)`;
`max = maxOf(e * 1.6, avg * 1.1, 1)`; bar width `avg/max`, expected marker at `e/max`. Label is
`avg / e` rounded to one decimal, or "nicht getestet" when no module in the scale has a result.
Bar colour: accent if `avg >= e * 0.85`, otherwise warn.

---

## 7. Screens

Bottom tab bar, four tabs, 60 dp tall, icons at stroke width 1.5, labels in Barlow Condensed
12 sp with 0.08 em tracking: **PLAN · TESTEN · PROFIL · MEHR**. The active tab gets a
`rgba(89,128,166,.12)` background and `#416180` foreground.

The tab bar is **hidden** during Training and Result.

App bar: optional back chevron (34×34 outlined square button), title in Barlow Condensed 18 sp,
kicker in 10 sp uppercase 0.14 em at 50 % opacity, language segment on the right.

### 7.1 Plan (home)
- Blueprint card "Nächster Schritt": first module without a result (fallback: first module).
  Title 30 sp condensed, a reason line — "Noch nicht getestet — dieser Bereich fehlt im Profil."
  or "Wiederholung nach vier Wochen." if already tested — two tags (scale short, `<ages> Jahre`),
  and a full-width primary "AUFGABE STARTEN".
- "Testdurchlauf" list: five scale rows, each a code badge, name, thin progress bar
  (tested/total), and a `n/m` ratio. Header shows `<tested> von 32 Aufgaben`.
- Two small blueprint stat cards: Sitzungen, Letzter Test.

### 7.2 Testen
Segmented GRUPPEN / ALLE AUFGABEN.
- **Gruppen**: five blueprint cards, one per scale (code badge, short name, full name, ratio) →
  opens the scale screen.
- **Alle Aufgaben**: a search field ("Aufgabe suchen", filters on title, case-insensitive) over a
  flat list of all 32 modules — code badge, title, meta line, chevron.

Meta line: `<ages> Jahre · <mode label>` plus ` · Niveau <best>` when a result exists. In compact
density the meta is just `<ages>` plus the Niveau suffix.

### 7.3 Scale detail
Intro paragraph, then that scale's modules — title, meta, a "GETESTET" marker when a result
exists, chevron. Tapping starts the module.

### 7.4 Training
Round dots · phase body (show / input / choice / feedback) · spacer · footer with a secondary
"Beenden" button and `NIVEAU <level>`.

### 7.5 Ergebnis
- Blueprint card: kicker "Durchgang beendet", `<correct>/<total>` at 56 sp,
  "richtig · bestes Niveau <best>".
- Richtwert box: "Richtwert · Alter <age>", verdict at 30 sp in the verdict colour,
  "erreicht <best> · erwartet <expected>", the bar with marker, the disclaimer.
- Buttons: primary "NÄCHSTE AUFGABE" (starts the next untested module), secondary "Noch eine
  Runde" (restarts the same module), secondary "Zurück zum Plan".

### 7.6 Auswertung (Profil)
"Kognitives Profil" — five bars per §6, with the note "Senkrechte Marke: erwarteter Wert für
<age> Jahre." Then "Verlauf" — a table of Aufgabe / Niveau / Datum, most recent first.

---

## 8. Gaps to close in the Flutter build

These are known holes in the prototype. Do not reproduce them.

1. **Localisation is fake.** All strings are hard-coded German. Ship real DE / RU / EN
   localisation from day one (`flutter_localizations` + ARB), with the app-bar switch persisting
   the choice. Every string in this document is a DE value.
2. **Audio tasks are silent.** Eight modules end in "hören" and currently run the visual engine.
   They need real audio presentation. Prefer pre-recorded assets per locale over TTS for timing
   consistency; if TTS is used, pre-warm it and measure real utterance duration rather than
   assuming `stepMs`.
3. **Backwards span is not implemented** (`seq-zahlen-rueckwaerts` grades forwards).
4. **Results overwrite.** Keep a full run history instead — `Verlauf` should list every run, and
   the profile should use the most recent (or best) per module by explicit rule, not by
   last-write-wins.
5. **Norm values are invented** (§6).
6. **No confirmation on destructive delete.**
7. **Only two engines exist** for 32 modules (§2.2).
8. **No child profiles.** Age is a single global setting; a real product needs multiple children
   with separate result sets.
9. **Reaction time is not measured.** Decide whether it is a scored variable; if yes, timestamp
   presentation and input events with a monotonic clock.

---

## 9. Visual system — Industry

Wireframe / blueprint aesthetic. Steel-blue on a light technical ground.

**Colour**
| Token | Value | Use |
|---|---|---|
| ground | `#f2f2f3` | app background |
| text | `#1d1f20` | body text |
| accent | `#5980a6` | primary fill, bars, active states |
| accent deep | `#416180` | badges, active tab foreground, "über Richtwert" |
| warn | `#8a5a3c` | incorrect feedback, below-norm bars |
| hairline | `rgba(29,31,32,.16)` | borders |
| divider | `rgba(29,31,32,.08)` | list separators |
| muted text | `rgba(29,31,32,.5)` – `.62` | meta, captions |
| device chrome | `#dcdcde` | outside the app frame (prototype only) |

**Type.** Barlow Condensed (600) for headings, numerals, buttons and tab labels; Barlow (400) for
body. Uppercase labels carry 0.12–0.16 em tracking at 10–11 sp.

**Shape.** Nothing is rounded. Every card, framed figure and primary button is a square-cornered
hairline rectangle. Blueprint objects additionally carry four `+` registration marks at the
corners — in Flutter, implement this as a single reusable `BlueprintBox` widget
(`CustomPainter` border + four corner crosses), not as four positioned Icons.

**Do not**: round corners, fill cards with a surface colour, use elevation shadows on cards, add
colour beyond the steel accent and the single warn tone, use thick icon strokes, use Material 3
default components unstyled, or introduce emoji.

**Icons.** Lucide at stroke width 1.5 (`lucide_icons` package, or ship the four tab glyphs and the
chevrons as SVG assets — the paths are in the prototype source).

**Touch targets.** Nothing below 44 dp. Bank keys are 56 dp tall, list rows 52–56 dp, tab bar
60 dp.

**Motion.** Two transitions only: a 220 ms fade-and-rise (`translateY(6px) → 0`) for screen
bodies, and a 180 ms scale-up (`0.86 → 1`) for the presented item and the feedback mark.
