/**
 * Tangram-Puzzle
 * Noch nicht umgesetzt – siehe Hinweis im Modul.
 */
import { createStub } from '../core/stub.js';

const stub = createStub('sim-tangram', {
  de: 'Braucht Drag-and-drop mit Rotation und Kollisionsprüfung – gleiche Technik wie Dreiecke legen.',
  ru: 'Нужен перенос с поворотом и проверкой столкновений – та же техника, что и в задании «Треугольники».',
  en: 'Needs drag-and-drop with rotation and collision detection – the same technique as laying triangles.'
});
export const { init, render, dispose, actions, scoring } = stub;
