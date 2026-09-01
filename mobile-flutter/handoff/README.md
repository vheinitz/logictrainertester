# mobile-flutter

Handoff package for the Android build of LOGIK-Trainer. Nothing here affects the desktop app.

| File | What it is |
|---|---|
| `prototype.html` | Working prototype — open in any browser. Visual source of truth. Self-contained, no build step. |
| `SPEC.md` | Full specification: domain model, engines, adaptive loop, scoring, screens, visual system, known gaps. |
| `PROMPT.md` | The prompt to hand to Claude Code to build the Flutter app. |

## Getting started

```
cd mobile-flutter
claude
```

Then paste the contents of `PROMPT.md` below the `---`.

The agent writes `PLAN.md` first and stops for review before writing any code.

## Before shipping anything real

Four items in `SPEC.md` §8 are blockers for actual use with children:
norm values are invented, audio tasks do not exist, only two of the intended task engines are
implemented, and there is no per-child profile.
