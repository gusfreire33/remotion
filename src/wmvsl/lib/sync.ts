import { WORDS, type Word } from "../data/words";
import { AUDIO_DURATION_S } from "../data/blocks";

/* ------------------------------------------------------------------------
   MOTOR DE SINCRONIA — a regra de ouro do Framework 2: "a animação é guiada
   pela minutagem da fala". Aqui nenhum tempo é digitado à mão: toda cena e
   todo elemento são ancorados numa FRASE da narração, procurada no
   alinhamento por caractere do ElevenLabs (data/words.ts).
   Se a narração for regerada, tudo se move junto.
   --------------------------------------------------------------------- */

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION_IN_FRAMES = Math.ceil(AUDIO_DURATION_S * FPS);

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9-]/g, "");

const NW = WORDS.map((w) => norm(w.text));

const findIdx = (phrase: string, after = 0): number => {
  const parts = phrase.split(/\s+/).map(norm).filter(Boolean);
  for (let i = 0; i < WORDS.length; i++) {
    if (WORDS[i].startMs / 1000 < after - 0.001) continue;
    let ok = true;
    for (let k = 0; k < parts.length; k++) {
      if (NW[i + k] !== parts[k]) {
        ok = false;
        break;
      }
    }
    if (ok) return i;
  }
  throw new Error(`[sync] frase não encontrada: "${phrase}" (após ${after}s)`);
};

/** segundo em que a frase COMEÇA a sair da boca (1ª ocorrência após `after`) */
export const at = (phrase: string, after = 0): number => WORDS[findIdx(phrase, after)].startMs / 1000;

/** segundo em que a frase TERMINA */
export const end = (phrase: string, after = 0): number => {
  const i = findIdx(phrase, after);
  const n = phrase.split(/\s+/).filter((p) => norm(p)).length;
  return WORDS[i + n - 1].endMs / 1000;
};

export const sec = (s: number) => Math.round(s * FPS);

export type { Word };
export { WORDS };
