import { WORDS } from "../data/words";
import type { Word } from "../data/words";

export type Page = {
  words: Word[];
  startMs: number;
  endMs: number;
};

const SENTENCE_END = /[.!?]$/;
const MAX_WORDS = 3;
const MAX_CHARS = 24;

// Agrupa as palavras em "paginas" curtas (estilo TikTok): no maximo 3 palavras
// ou ~24 caracteres, quebrando tambem no fim de frase.
export const buildPages = (): Page[] => {
  const pages: Page[] = [];
  let cur: Word[] = [];

  const flush = (): void => {
    if (cur.length > 0) {
      pages.push({
        words: cur,
        startMs: cur[0].startMs,
        endMs: cur[cur.length - 1].endMs,
      });
      cur = [];
    }
  };

  for (const w of WORDS) {
    const chars =
      cur.reduce((n, x) => n + x.text.length + 1, 0) + w.text.length;
    if (cur.length >= MAX_WORDS || chars > MAX_CHARS) {
      flush();
    }
    cur.push(w);
    if (SENTENCE_END.test(w.text)) {
      flush();
    }
  }
  flush();
  return pages;
};

export const PAGES: Page[] = buildPages();
