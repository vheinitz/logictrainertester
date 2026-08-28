/**
 * Atlantis Abruf – was nach zwanzig Minuten von den Namen übrig ist.
 * (KABC-II: „Atlantis Abruf")
 *
 * In den Skalen der App stand dieser Subtest seit Anfang an als Name, ohne
 * dass es ein Modul dazu gab. Die Begründung, warum das ein eigener Test ist
 * und nicht eine zweite Runde Atlantis, steht in core/abruf.js.
 */
import { createAbrufTest } from '../core/abruf-test.js';
import { NAMEN_VORRAT } from './lern-atlantis.js';

const test = createAbrufTest({
  id: 'lern-atlantis-abruf',
  lernModulId: 'lern-atlantis',
  frage: {
    de: '❓ Wie hieß dieser Bewohner?',
    ru: '❓ Как звали этого жителя?',
    en: '❓ What was this inhabitant called?'
  },
  fuellwoerter: () => NAMEN_VORRAT
});

export const { init, render, dispose, actions, scoring } = test;

export const instruction = {
  de: 'Vorhin hast du die Bewohner von Atlantis kennengelernt. Weißt du noch, wie sie heißen?',
  ru: 'Недавно ты познакомился с жителями Атлантиды. Помнишь, как их зовут?',
  en: 'Earlier you met the inhabitants of Atlantis. Do you still know their names?'
};
