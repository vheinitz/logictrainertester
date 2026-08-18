# Aufgabe 04 — Glue nach den drei Stub-Implementierungen

Erst starten, wenn `sim-dreiecke.js`, `sim-tangram.js`, `sim-rover.js` **kein** `createStub` mehr importieren.

## Dateien

- `test/smoke.mjs` — falls Module in den `else { stub }`-Zweig fallen: echte Durchläufe ergänzen (eine Aufgabe lösen bzw. `verschiebe`/`zug` so aufrufen, dass `feedback` erreicht wird). Generator/Unlösbarkeit prüfen wo sinnvoll.
- `test/integration.mjs` — Ausnahmen entfernen:

```
check(clicks > 0 || m.id === 'sim-rover' || m.id === 'sim-dreiecke'
      || m.id === 'sim-tangram' || m.id === 'plan-geschichten',
```

`plan-geschichten` hat Drag ohne `onclick="G("` — Klicks können 0 bleiben. Für die drei neuen Module müssen entweder sichtbare `G(`-Buttons existieren (Drehen, Zug) **oder** der Test darf sie weiter ausnehmen, dann aber mit Kommentar warum. Ziel: so wenige Ausnahmen wie möglich.

- `README.md` Abschnitt „Noch offen“: die drei sind keine Platzhalter mehr. `plan-geschichten` ebenfalls streichen (ist schon implementiert).
- `src/core/drag.js` Kopfkommentar: Rover/Dreiecke/Tangram nicht mehr als „warten darauf“ bezeichnen, wenn sie Drag nutzen.
- Keine Spiel-Logik hier umschreiben, außer winzige Hooks damit Tests klicken können.

## Fertig

```
npm test
```

muss grün sein. `npm run build` ausführen (index.html Cache-Query).

Optional: `node tools/check-lang.mjs sim-dreiecke` (und tangram, rover) wenn das Tool Modulnamen akzeptiert.
