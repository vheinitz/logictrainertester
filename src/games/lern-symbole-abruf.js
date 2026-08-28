/**
 * Symbole Abruf – was nach zwanzig Minuten von den Paaren übrig ist.
 * (KABC-II: „Symbole Abruf")
 *
 * Gegenstück zu „Symbole merken". Warum der zeitliche Abstand den Test
 * ausmacht, steht in core/abruf.js.
 */
import { createAbrufTest } from '../core/abruf-test.js';
import { WOERTER_VORRAT } from './lern-symbole.js';

const test = createAbrufTest({
  id: 'lern-symbole-abruf',
  lernModulId: 'lern-symbole',
  frage: {
    de: '❓ Welches Wort gehörte zu diesem Symbol?',
    ru: '❓ Какое слово относилось к этому символу?',
    en: '❓ Which word belonged to this symbol?'
  },
  fuellwoerter: () => WOERTER_VORRAT()
});

export const { init, render, dispose, actions, scoring } = test;

export const instruction = {
  de: 'Vorhin hast du dir gemerkt, welches Wort zu welchem Symbol gehört. Weißt du es noch?',
  ru: 'Недавно ты запоминал, какое слово к какому символу относится. Помнишь?',
  en: 'Earlier you remembered which word belongs to which symbol. Do you still know?'
};
