# Parallele Stub-Aufgaben

Drei Module sind noch `createStub`. Jede Aufgabe darf **nur ihre Spiel-Datei**
ändern. Gemeinsame Dateien (Tests, README) gehören zur Glue-Aufgabe, die
**nach** den dreien läuft.

```
src/games/sim-dreiecke.js   →  01
src/games/sim-tangram.js    →  02
src/games/sim-rover.js      →  03
test/ + README              →  04-glue  (erst wenn 01–03 fertig sind)
```

## Start (drei Agenten parallel)

Vom Repo-Wurzel:

```bash
# Prompts nur anzeigen
./tools/agent-tasks/run.sh --print

# Mit pi (wenn im PATH), drei Sessions nebeneinander
./tools/agent-tasks/run.sh --pi

# Prompts als einzelne Dateien liegen schon hier:
#   01-sim-dreiecke.md
#   02-sim-tangram.md
#   03-sim-rover.md
#   04-glue.md
```

Nach Merge von 01–03: `04-glue.md` einmal ausführen, dann `npm test`.
