import type { BgKind } from "../components/AnimatedBg";
import type { IconName } from "../components/Icon";

/* ------------------------------------------------------------------------
   TIPOS DO MAPA — "Vídeo 2 YT". A gramática do estilo Bilhon-OS (over /
   behind / card / chips / steps) + as três famílias pedidas pelo dono em
   11/09/2026: B-roll horizontal, ícones (React Icons) e texto DIGITADO com
   teclado sobre fundo animado.
   --------------------------------------------------------------------- */

export type Voice = "sans" | "mono";

export type Line = {
  text: string;
  voice: Voice;
  /** segundo absoluto em que a linha começa a ser escrita (default: `from`) */
  at?: number;
  /** índices (0-based) das palavras em laranja */
  accent?: number[];
  orange?: boolean;
  size?: number;
  /** typewriter com cursor + som de teclado (em vez do TypeIn caótico) */
  typed?: boolean;
};

export type Slot = "tl" | "tr" | "top" | "chest" | "bl" | "br";

export type ChipItem = {
  text: string;
  at: number;
  orange?: boolean;
  muted?: boolean;
  icon?: IconName;
};

export type Callout =
  | {
      kind: "over";
      from: number;
      to: number;
      slot: Slot;
      lines: Line[];
      /** ícone grande ao lado do bloco de texto */
      icon?: IconName;
    }
  | {
      kind: "behind";
      from: number;
      to: number;
      lines: Line[];
      /** topo do bloco (px, tela 1080) — MEDIDO no matte (Etapa 6.4) */
      top?: number;
    }
  | {
      kind: "card";
      from: number;
      to: number;
      lines: Line[];
      bg?: BgKind;
      frame?: boolean;
      chips?: ChipItem[];
      /** fileira de ícones com rótulo dentro do cartão */
      icons?: { icon: IconName; label: string; at: number; orange?: boolean }[];
      moneyAt?: number;
      width?: number;
    }
  | {
      kind: "chips";
      from: number;
      to: number;
      slot: "bottom" | "top";
      items: ChipItem[];
      tail?: Line;
    }
  | {
      kind: "steps";
      from: number;
      to: number;
      items: { mark: string; text: string; at: number; icon?: IconName }[];
    }
  | {
      kind: "broll";
      from: number;
      to: number;
      /** arquivo em public/broll/<slug>.mp4 */
      slug: string;
      /** full = toma a tela; pip = janela ao lado da pessoa */
      layout: "full" | "pip";
      pipSide?: "left" | "right";
      startAt?: number;
      zoom?: [number, number];
      /** rótulo (typewriter) no canto do B-roll */
      label?: Line;
      /** por que este clipe (o trecho da fala) */
      why: string;
    }
  | {
      kind: "icons";
      from: number;
      to: number;
      slot: "bottom" | "center" | "top";
      items: { icon: IconName; label: string; at: number; orange?: boolean }[];
      /** seta entre os ícones (fluxo) */
      arrows?: boolean;
    }
  | {
      kind: "stat";
      from: number;
      to: number;
      slot: Slot;
      /** número final; conta de 0 até ele */
      value: number;
      prefix?: string;
      suffix?: string;
      label: string;
      at?: number;
      icon?: IconName;
      decimals?: number;
    };
