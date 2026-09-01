# Claude Code prompt

Paste everything below the line into Claude Code, run from the repository root with
`mobile-flutter/` as the working directory. `SPEC.md` and `prototype.html` must be in that
directory.

---

Build a Flutter Android app called **LOGIK-Trainer Mobil** in this directory.

Read `SPEC.md` in full before writing any code. It is the complete specification: domain model,
both task engines, the adaptive session loop, the scoring formulas, every screen, and the visual
system. Also open `prototype.html` in a browser — it is a working HTML prototype of the app and
is the visual source of truth. Where the spec and the prototype disagree, the prototype wins for
layout and the spec wins for logic.

## Constraints

- Flutter stable, Android first. Do not add iOS-specific code, but do not block it either.
- Minimum SDK 24, target the current stable SDK.
- Offline only. No network calls, no analytics, no crash reporting, no account. This is a
  children's screening tool — data leaving the device is a hard failure.
- State management: Riverpod. Persistence: `drift` (SQLite) — not SharedPreferences, because §8.4
  of the spec requires a real run history.
- Keep dependencies minimal and justify each one in the PR description.
- Null-safe, `flutter analyze` clean with `flutter_lints`.

## Architecture

Layer the code so the parts I will replace later are isolated:

```
lib/
  main.dart
  app.dart                     router + theme wiring
  theme/
    industry_theme.dart        ThemeData built from the tokens in SPEC §9
    blueprint_box.dart         the square frame + 4 corner registration marks
  domain/
    scale.dart  module.dart  run.dart  settings.dart
    module_registry.dart       the 32 modules and 5 scales as const data
    norms_repository.dart      abstract; LiteratureNorms is the current impl
    engines/
      engine.dart              abstract Engine: buildRound(level), grade(answer)
      span_engine.dart         span-num, span-word, and the reversed variant
      choice_engine.dart       odd-one-out
      session_controller.dart  the adaptive loop from SPEC §4
  data/
    database.dart              drift tables: runs, settings
    repositories/
  ui/
    shell.dart                 bottom nav, 4 tabs
    plan/  testen/  scale/  training/  result/  profile/  settings/
  l10n/
    app_de.arb  app_ru.arb  app_en.arb
```

The engine layer must not import Flutter. `SessionController` must be unit-testable with a fake
clock and a seeded RNG.

## Requirements the prototype does not meet

The prototype has known gaps, listed in SPEC §8. Close these in this build:

1. **Real localisation.** Every user-facing string goes through ARB from the start — no hard-coded
   German anywhere outside `app_de.arb`. Wire the DE/RU/EN app-bar switch to actually change
   locale and persist it. Populate `app_de.arb` from the spec; for RU and EN, leave a machine
   translation with a `# TODO: review` comment on each entry rather than leaving them empty.
2. **Reversed span.** `seq-zahlen-rueckwaerts` grades against the reversed sequence.
3. **Run history.** Every completed run is stored as its own row. The Verlauf list shows all runs
   newest first. The profile uses the most recent run per module.
4. **Confirm before deleting results.**
5. **Norms behind an interface.** `NormsRepository` is injected; the literature-derived curve in
   SPEC §6 is one implementation, clearly marked as provisional.
6. **Audio scaffolding.** Do not implement audio playback yet, but structure the span engine so an
   `AudioPresenter` can replace the `VisualPresenter` without touching the session loop. The eight
   "hören" modules should show a clearly-marked "Audio noch nicht verfügbar" state rather than
   silently running the visual task.

## Testing

- Unit tests for `SessionController`: leveling up on success, down on failure, respecting the
  floor (1 for choice, 2 for span), terminating at `settings.rounds`, and discarding the run on
  exit.
- Unit tests for both engines: sequence generation constraints (`span-word` has no repeats),
  grading, and the level-3 / level-5 difficulty steps of the choice engine.
- Unit tests for `NormsRepository`: the four verdict bands at their boundaries.
- One golden test per screen at 412×892 against a screenshot of the prototype.

## Working method

Do this in order, and stop after each step so I can review:

1. Read `SPEC.md`, open the prototype, then write `PLAN.md` — your file-by-file plan and any
   questions or contradictions you found. **Do not write code in this step.**
2. Scaffold the project, theme, `BlueprintBox`, and the domain layer with the module registry.
   Prove it with unit tests; no UI yet.
3. Engines and `SessionController`, with the tests listed above passing.
4. Persistence layer and repositories.
5. UI, screen by screen, in this order: shell + tabs, Testen, Scale, Training, Result, Plan,
   Profil, Einstellungen.
6. Localisation pass, then goldens, then `flutter analyze` and a release build.

Match the prototype's spacing and type sizes closely. When something is ambiguous, ask rather
than guessing — this is a clinical-adjacent tool and invented behaviour is worse than a question.
