/**
 * Welche Übungs-App gehört auf welche Methodenseite.
 *
 * Von Hand geschrieben, weil sie sich nicht ableiten lässt: dass „Türme von
 * Hanoi" zu den Knobelspielen gehört und „Buchstaben fangen" zum
 * Konzentrationstraining, steht in keiner der beiden Dateien.
 *
 * Wo die App im Verhältnis zur Methode steht
 * ──────────────────────────────────────────
 * Unter der Anleitung, nicht darüber. Eine Methodenseite beschreibt, wie man
 * die Sache mit echtem Material macht – mit Streichhölzern, mit Pappscheiben,
 * mit einem selbstgeschnittenen Tangram. Genau das ist der wertvolle Teil.
 * Die App daneben ist für die Abende, an denen das Material fehlt oder
 * niemand Zeit zum Aufbauen hat.
 *
 * Zwei Zuordnungen sitzen lockerer als die übrigen und sind hier benannt,
 * damit niemand sie für zwingend hält:
 *
 *   flaechen  → plaene-skizzen-zeichnen
 *     Das Zerlegen einer Fläche in Grundformen ist keine Skizze. Beides
 *     bringt aber Räumliches aufs Papier, und eine eigene Geometrieseite
 *     gibt es (noch) nicht.
 *
 *   bit-zahl  → kopfrechenspiele
 *     Das Umrechnen zwischen Zweier- und Zehnersystem ist kein Kopfrechnen.
 *     Es geht aber wie dieses um den Aufbau von Zahlen aus Stellenwerten.
 */
export const MINIAPP_ZU_METHODE = {
  'logik-knobelspiele':             ['hanoi', 'ziege-wolf-kohl'],
  'puzzles':                        ['schiebepuzzle'],
  'denksportaufgaben':              ['falschmuenzen', 'streichholz-spiele'],
  'muster-nachzeichnen-fortsetzen': ['zahlenfolgen', 'symmetrie'],
  'kopfrechenspiele':               ['abakus', 'kettenrechnen', 'bit-zahl'],
  'tangram':                        ['polyomino'],
  'bildergeschichten':              ['imagestories'],
  'suchbilder-wimmelbilder':        ['wimmelbilder'],
  'oberbegriffe':                   ['tiere-sortieren'],
  'wortschatzspiele':               ['begriffe-verbinden'],
  'sprachraetsel':                  ['bildhafte-sprache'],
  'marburger-konzentrationstraining': ['buchstaben-fallen'],
  'bewegungen-nachmachen':          ['tanz-challenge'],
  'handlungsfolgen-alltag':         ['pfeil-programm'],
  'plaene-skizzen-zeichnen':        ['flaechen']
};

/** Die Apps einer Methodenseite (Kennungen). */
export function appsZuMethode(methodId) {
  return MINIAPP_ZU_METHODE[methodId] || [];
}

/** Umgekehrt: auf welcher Methodenseite steht diese App? */
export function methodeZuApp(appId) {
  for (const [mid, apps] of Object.entries(MINIAPP_ZU_METHODE)) {
    if (apps.includes(appId)) return mid;
  }
  return null;
}
