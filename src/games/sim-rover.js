/**
 * Rover im Labyrinth (KABC-II: Rover)
 * Noch nicht umgesetzt – siehe Hinweis im Modul.
 */
import { createStub } from '../core/stub.js';

const stub = createStub('sim-rover', {
  de: 'Braucht ein Wegplanungs-Raster mit Hindernissen und Zugzählung – als eigenes Modul geplant, nicht über die Auswahl-Engine abbildbar.',
  ru: 'Нужна сетка планирования пути с препятствиями и подсчётом ходов – планируется как отдельный модуль, не через движок выбора.',
  en: 'Needs a path-planning grid with obstacles and move counting – planned as its own module, not expressible through the choice engine.'
});
export const { init, render, dispose, actions, scoring } = stub;
