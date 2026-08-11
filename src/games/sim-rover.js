/**
 * Rover im Labyrinth (KABC-II: Rover)
 * Noch nicht umgesetzt – siehe Hinweis im Modul.
 */
import { createStub } from '../core/stub.js';

const stub = createStub('sim-rover', 'Braucht ein Wegplanungs-Raster mit Hindernissen und Zugzählung – als eigenes Modul geplant, nicht über die Auswahl-Engine abbildbar.');
export const { init, render, dispose, actions, scoring } = stub;
