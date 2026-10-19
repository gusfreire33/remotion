import type React from "react";

export type CutKind = "whip" | "punch" | "glitch";

export type SfxFile =
  | "boom"
  | "click"
  | "ding"
  | "glitch"
  | "impact"
  | "key1"
  | "key2"
  | "key3"
  | "pop"
  | "riser"
  | "swoosh"
  | "tick"
  | "type"
  | "whoosh";

/** som por elemento (Camada 2 do PLAYBOOK-2 13.2): [mark, arquivo, volume, deslocamento s] */
export type Sfx = [mark: string, file: SfxFile, vol?: number, offset?: number];

/** marcas em frames LOCAIS da cena (0 = início da cena) */
export type Marks = Record<string, number>;

export type SceneProps = { m: Marks; dur: number };

/** palavra-atrás — adaptação do efeito-assinatura do FW2: a tipografia
 *  gigante fica ATRÁS do objeto principal da cena (janela/card), que a corta. */
export type Behind = {
  lines: string[];
  /** mark (da cena) em que a palavra entra; default = início */
  mark?: string;
  /** duração em s (FW2 6.3: 1,0–1,8s) */
  dur?: number;
  tone?: "white" | "lime" | "danger";
  outline?: boolean;
  /** topo do bloco em px (tela 1080) — conferido em still */
  top: number;
  size?: number;
};

export type SceneDef = {
  id: string;
  /** trecho da fala que a cena ilustra (comentário vivo, PLAYBOOK-2 5.5) */
  fala: string;
  /** verbo / movimento (PLAYBOOK-2 9.1) */
  verbo: string;
  /** tratamento (PLAYBOOK-2 5.3) */
  trat: "LIMPO" | "PALAVRA ATRÁS" | "OVERLAY" | "TELA";
  from: number;
  cut: CutKind | null;
  marks: Record<string, number>;
  sfx?: Sfx[];
  behind?: Behind;
  Comp: React.FC<SceneProps>;
};
