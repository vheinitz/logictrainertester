/**
 * Dreiecke legen (KABC-II: Dreiecke)
 * Noch nicht umgesetzt – siehe Hinweis im Modul.
 */
import { createStub } from '../core/stub.js';

const stub = createStub('sim-dreiecke', {
  de: 'Braucht Drag-and-drop mit Rotation von Formen. Sinnvoll erst mit Zeigergesten-Unterstützung.',
  ru: 'Нужен перенос фигур с поворотом. Имеет смысл только с поддержкой жестов.',
  en: 'Needs drag-and-drop with rotation of shapes. Only worthwhile once pointer-gesture support exists.'
});
export const { init, render, dispose, actions, scoring } = stub;
