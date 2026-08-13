/**
 * Bildergeschichte ordnen (KABC-II: Geschichten ergänzen)
 * Noch nicht umgesetzt – siehe Hinweis im Modul.
 */
import { createStub } from '../core/stub.js';

const stub = createStub('plan-geschichten', {
  de: 'Braucht Bildfolgen, die eine Handlung erzählen. Mit Emoji allein lässt sich keine eindeutige Reihenfolge herstellen – dafür sind gezeichnete Szenen nötig.',
  ru: 'Нужны серии картинок, рассказывающих историю. Одними эмодзи нельзя задать однозначную последовательность – для этого нужны нарисованные сцены.',
  en: 'Needs picture sequences that tell a story. Emoji alone cannot establish an unambiguous order – drawn scenes are required for that.'
});
export const { init, render, dispose, actions, scoring } = stub;
