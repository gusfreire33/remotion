import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  LuHeadset,
  LuQrCode,
  LuReceipt,
  LuShoppingCart,
  LuCalendar,
  LuSearch,
  LuLayoutTemplate,
  LuMail,
  LuMessageCircle,
  LuUsers,
  LuChartBar,
  LuServer,
  LuBrain,
  LuCheck,
  LuFileSpreadsheet,
  LuPlus,
} from "react-icons/lu";
import type { SceneProps } from "../lib/types";
import { JAKARTA, SORA, WM, SHADOW_FLOAT } from "../lib/theme";
import { Appear, Stamp, Big, Kicker, DrawX, Typed } from "../components/fx";
import { Avatar, Badge, CLAMP, EASE_IO, EASE_OUT, prog, brl, Cursor, Wordmark } from "../components/ui";

/* ═════════════════════════ AGITAÇÃO ═════════════════════════ */

/** "Agora pensa no custo disso. Toda vez que uma integração quebra, você para de
 *   vender pra virar suporte técnico. De graça."
 *  verbo: INVERTER — a barra "vendendo" encolhe enquanto "consertando" cresce. */
export const S14Support: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const t = prog(frame, m.quebra, m.suporte + 10, EASE_IO);
  const sell = 78 - 60 * t;
  const fix = 22 + 60 * t;
  const bar = (label: string, pct: number, color: string, fg: string) => (
    <div style={{ marginBottom: 34 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: JAKARTA, fontWeight: 700, fontSize: 30, color: "#ECECE7", marginBottom: 12 }}>
        <span>{label}</span>
        <span style={{ fontFamily: SORA, color: fg }}>{Math.round(pct)}%</span>
      </div>
      <div style={{ height: 54, borderRadius: 999, background: "rgba(236,236,231,0.08)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 999, background: color }} />
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Appear f={0} dir="up" dist={30} style={{ position: "absolute", top: 140, left: 260 }}>
        <Kicker color={WM.lime} style={{ fontSize: 26 }}>
          o seu dia
        </Kicker>
      </Appear>
      <Appear f={4} dir="up" dist={40} style={{ position: "absolute", top: 220, left: 260, width: 1000 }}>
        {bar("Vendendo", sell, WM.lime, WM.lime)}
        {bar("Consertando integração", fix, "#FF4D57", "#FF4D57")}
      </Appear>
      <Appear f={m.suporte} dir="left" dist={60} style={{ position: "absolute", top: 230, left: 1380 }}>
        <div style={{ width: 300, height: 300, borderRadius: 40, background: WM.card, boxShadow: SHADOW_FLOAT, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <LuHeadset size={110} color={WM.ink} strokeWidth={1.6} />
          <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 28, color: WM.ink, textAlign: "center", lineHeight: 1.1 }}>
            suporte
            <br />
            técnico
          </div>
        </div>
      </Appear>
      <Stamp f={m.graca} text="R$ 0 / hora" color="#FF4D57" rot={-8} size={56} fill style={{ top: 600, left: 1300 }} />
    </AbsoluteFill>
  );
};

/** "Toda vez que um Pix expira sem ninguém chamar o cliente, é dinheiro deixado na mesa."
 *  verbo: ACUMULAR (contador) — as vendas não recuperadas somam na mesa. */
export const S15Table: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const items = [
    { I: LuQrCode, t: "Pix expirado", v: 997 },
    { I: LuReceipt, t: "Boleto vencido", v: 1497 },
    { I: LuShoppingCart, t: "Carrinho abandonado", v: 497 },
    { I: LuQrCode, t: "Pix expirado", v: 997 },
  ];
  const total = items.reduce((a, b) => a + b.v, 0);
  const v = interpolate(frame, [m.dinheiro - 4, m.mesa + 6], [0, total], { ...CLAMP, easing: EASE_OUT });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 150, left: 230, width: 680, display: "flex", flexDirection: "column", gap: 16 }}>
        {items.map((it, i) => (
          <Appear key={i} f={i * 5} dir="left" dist={50}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, background: WM.card, borderRadius: 18, padding: "18px 24px", boxShadow: SHADOW_FLOAT, fontFamily: JAKARTA }}>
              <it.I size={30} color={WM.danger} />
              <span style={{ fontWeight: 700, fontSize: 26, color: WM.ink, flex: 1 }}>{it.t}</span>
              <span style={{ fontWeight: 700, fontSize: 20, color: WM.muted2 }}>{frame >= m.ninguem ? "nenhuma mensagem" : "aguardando"}</span>
              <span style={{ fontFamily: SORA, fontWeight: 800, fontSize: 26, color: WM.ink }}>{brl(it.v)}</span>
            </div>
          </Appear>
        ))}
      </div>
      <Appear f={m.dinheiro} dir="scale" style={{ position: "absolute", top: 200, left: 1040 }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 30, color: WM.muted }}>dinheiro deixado na mesa</div>
        <Big size={150} color={WM.lime} style={{ fontVariantNumeric: "tabular-nums", marginTop: 6 }}>
          {brl(Math.round(v))}
        </Big>
        <div style={{ height: 10, width: 640, borderRadius: 10, background: "rgba(236,236,231,0.12)", marginTop: 26 }} />
      </Appear>
    </AbsoluteFill>
  );
};

/** "E no fim do mês, chega a conta. Uma cobrança de cada ferramenta."
 *  verbo: CHEGAR EM PILHA (ticker) — as faturas deslizam uma atrás da outra. */
export const S16Bills: React.FC<SceneProps> = ({ m }) => {
  const bills = [
    ["Construtor de páginas", 297],
    ["E-mail marketing", 340],
    ["API de WhatsApp", 380],
    ["CRM", 420],
    ["Analytics", 290],
    ["Hospedagem", 180],
  ] as const;
  return (
    <AbsoluteFill>
      <Appear f={0} dir="down" dist={40} style={{ position: "absolute", top: 210, left: 200 }}>
        <div style={{ width: 300, background: WM.card, borderRadius: 30, overflow: "hidden", boxShadow: SHADOW_FLOAT, textAlign: "center" }}>
          <div style={{ background: "#FF4D57", color: "#fff", fontFamily: JAKARTA, fontWeight: 800, fontSize: 28, padding: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <LuCalendar size={28} /> fim do mês
          </div>
          <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 170, color: WM.ink, lineHeight: 1.2 }}>30</div>
        </div>
      </Appear>
      {bills.map(([n, v], i) => (
        <Appear key={n} f={m.cobranca + i * 5} dir="left" dist={140} style={{ position: "absolute", top: 120 + i * 22, left: 640 + i * 150 }}>
          <div style={{ width: 360, background: WM.card, borderRadius: 18, padding: 22, boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6)", fontFamily: JAKARTA, transform: `rotate(${(i % 2 ? 1 : -1) * 3}deg)` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: WM.muted2, letterSpacing: "0.1em" }}>FATURA</span>
              <Badge text="vence hoje" bg="#FDE2E4" fg={WM.danger} fs={13} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 22, color: WM.ink, marginTop: 12 }}>{n}</div>
            <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 40, color: WM.ink }}>{brl(v)}</div>
          </div>
        </Appear>
      ))}
    </AbsoluteFill>
  );
};

/** "E o que acontece se nada mudar?"  verbo: PERGUNTAR (campo de entrada digitando) */
export const S17Question: React.FC<SceneProps> = ({ m }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <Appear f={0} dir="scale" style={{ marginTop: -80 }}>
      <div style={{ width: 1180, height: 130, borderRadius: 999, background: WM.card, boxShadow: `${SHADOW_FLOAT}, 0 0 0 10px rgba(212,245,0,0.18)`, display: "flex", alignItems: "center", gap: 26, padding: "0 50px" }}>
        <LuSearch size={46} color={WM.muted2} />
        <Typed f={m.que} text="E o que acontece se nada mudar?" cpf={1.25} style={{ fontFamily: SORA, fontWeight: 700, fontSize: 52, color: WM.ink, letterSpacing: "-0.02em" }} />
      </div>
    </Appear>
  </AbsoluteFill>
);

/** "O próximo mês vai ser igual a esse. Mais abas. Mais horas. Mais vendas escapando sem você ver."
 *  PALAVRA ATRÁS "IGUAL" cortada pelo calendário; depois verbo: AUMENTAR (3 linhas subindo). */
export const S18Same: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const flip = prog(frame, m.proximo, m.proximo + 14, EASE_IO);
  const rows = [
    { k: "abas", t: "abas abertas", to: 23 },
    { k: "horas", t: "horas por dia", to: 17 },
    { k: "vendas", t: "vendas escapando", to: 31 },
  ];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 400, left: 660, perspective: 1200, transform: "scale(1.5)", transformOrigin: "50% 0" }}>
        <Appear f={0} dir="up" dist={60}>
          <div style={{ width: 400, background: WM.card, borderRadius: 30, overflow: "hidden", boxShadow: SHADOW_FLOAT, textAlign: "center", transform: `rotateX(${flip > 0.5 ? (1 - flip) * 180 : flip * -180}deg)` }}>
            <div style={{ background: WM.ink, color: WM.lime, fontFamily: JAKARTA, fontWeight: 800, fontSize: 30, padding: 16 }}>{flip > 0.5 ? "PRÓXIMO MÊS" : "ESTE MÊS"}</div>
            <div style={{ padding: "18px 0 26px", fontFamily: JAKARTA, fontWeight: 700, fontSize: 26, color: WM.muted2 }}>
              15 abas · 15 horas
              <div style={{ fontFamily: SORA, fontSize: 58, fontWeight: 800, color: WM.ink, marginTop: 8 }}>mesmo caos</div>
            </div>
          </div>
        </Appear>
      </div>
      {rows.map((r, i) => {
        const f = m[r.k];
        const n = Math.round(interpolate(frame, [f, f + 16], [15, r.to], { ...CLAMP, easing: EASE_OUT }));
        return (
          <Appear key={r.k} f={f} dir="left" dist={50} out={undefined} style={{ position: "absolute", top: 150 + i * 120, left: 1240, opacity: 1 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 20, fontFamily: SORA, color: "#ECECE7" }}>
              <span style={{ fontWeight: 800, fontSize: 84, color: i === 2 ? "#FF4D57" : WM.white }}>+{n}</span>
              <span style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 32 }}>{r.t}</span>
            </div>
          </Appear>
        );
      })}
    </AbsoluteFill>
  );
};

/* ═════════════════════════ VIRADA (o efeito mais forte) ═════════════════════════ */

/** "Só que aqui vai a virada."  verbo: VIRAR — a tela inteira gira 180° do escuro pro lima. */
export const S19Flip: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - m.virada, fps, config: { damping: 13, stiffness: 120, mass: 0.9 } });
  const rot = 180 * s;
  const lime = rot > 90;
  return (
    <AbsoluteFill style={{ perspective: 1800, alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: 1500,
          height: 760,
          marginTop: -60,
          borderRadius: 48,
          background: lime ? WM.lime : "#22231B",
          transform: `rotateY(${rot}deg) scale(${1 + 0.06 * Math.sin(s * Math.PI)})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: lime ? "0 0 160px rgba(212,245,0,0.45)" : SHADOW_FLOAT,
        }}
      >
        <div style={{ transform: lime ? "scaleX(-1)" : undefined, textAlign: "center" }}>
          <Big size={lime ? 200 : 120} color={lime ? WM.ink : "#ECECE7"} style={{ textTransform: "uppercase" }}>
            {lime ? "a virada" : "15 abas"}
          </Big>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** "O problema não é você. Não é falta de esforço. E não é o seu produto."
 *  verbo: DESCARTAR — três suspeitos, cada um riscado na sua frase (lista com estado). */
export const S20NotYou: React.FC<SceneProps> = ({ m }) => {
  const items = [
    { k: "voce", t: "Você" },
    { k: "esforco", t: "Falta de esforço" },
    { k: "produto", t: "O seu produto" },
  ];
  return (
    <AbsoluteFill>
      <Appear f={0} dir="up" dist={30} style={{ position: "absolute", top: 130, left: 330 }}>
        <Kicker color={WM.lime} style={{ fontSize: 28 }}>
          o problema não é
        </Kicker>
      </Appear>
      <div style={{ position: "absolute", top: 220, left: 330, display: "flex", flexDirection: "column", gap: 22 }}>
        {items.map((it) => (
          <Appear key={it.k} f={m[it.k] - 4} dir="left" dist={60}>
            <div style={{ display: "flex", alignItems: "center", gap: 40, width: 1200, background: "rgba(236,236,231,0.06)", border: "1px solid rgba(236,236,231,0.12)", borderRadius: 26, padding: "28px 40px" }}>
              <DrawX f={m[it.k] + 6} size={64} color="#FF4D57" stroke={12} />
              <span style={{ fontFamily: SORA, fontWeight: 800, fontSize: 80, color: "#ECECE7", letterSpacing: "-0.03em" }}>{it.t}</span>
            </div>
          </Appear>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const TOOLS = [
  { t: "Páginas", I: LuLayoutTemplate, c: "#3B82F6" },
  { t: "E-mail", I: LuMail, c: "#F59E0B" },
  { t: "WhatsApp", I: LuMessageCircle, c: "#22C55E" },
  { t: "CRM", I: LuUsers, c: "#8B5CF6" },
  { t: "Métricas", I: LuChartBar, c: "#EC4899" },
  { t: "Hospedagem", I: LuServer, c: "#14B8A6" },
];

const ToolChip: React.FC<{ i: number; w?: number }> = ({ i, w = 460 }) => {
  const tl = TOOLS[i];
  return (
    <div style={{ width: w, height: 86, borderRadius: 20, background: WM.card, boxShadow: "0 20px 40px -18px rgba(0,0,0,0.6)", display: "flex", alignItems: "center", gap: 18, padding: "0 26px", borderLeft: `12px solid ${tl.c}` }}>
      <tl.I size={34} color={tl.c} />
      <span style={{ fontFamily: SORA, fontWeight: 700, fontSize: 32, color: WM.ink }}>{tl.t}</span>
    </div>
  );
};

/** "O problema é a pilha de ferramentas que não conversa entre si."
 *  PALAVRA ATRÁS "PILHA" cortada pela torre de ferramentas balançando (verbo: empilhar/desabar). */
export const S21Pile: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 330, display: "flex", flexDirection: "column-reverse", alignItems: "center", gap: 6 }}>
        {TOOLS.map((_, i) => {
          const sway = Math.sin((frame + i * 6) / 7) * (2 + i * 1.6) * prog(frame, m.conversa, m.conversa + 12);
          return (
            <Appear key={i} f={i * 3} dir="drop" dist={120} style={{ transform: `translateX(${sway * 4}px) rotate(${sway * 0.5}deg)` }}>
              <ToolChip i={i} />
            </Appear>
          );
        })}
      </div>
      {/* "não conversa": balões cortados entre os blocos */}
      {[0, 1].map((k) => (
        <Appear key={k} f={m.conversa + k * 6} dir="scale" style={{ position: "absolute", top: 420 + k * 200, left: k ? 1310 : 420 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ background: "rgba(236,236,231,0.1)", borderRadius: 999, padding: "14px 26px", color: "#ECECE7", fontFamily: SORA, fontWeight: 800, fontSize: 40 }}>…</div>
            <DrawX f={m.conversa + k * 6 + 6} size={44} color="#FF4D57" stroke={9} />
          </div>
        </Appear>
      ))}
    </AbsoluteFill>
  );
};

/** "Cada uma enxerga só um pedaço do seu cliente. A página não sabe quem comprou.
 *   O e-mail não sabe quem pagou. O WhatsApp não sabe quem abandonou o carrinho."
 *  verbo: FRAGMENTAR — o cliente se parte em 3 fatias, cada ferramenta segura uma. */
export const S22Pieces: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const split = prog(frame, m.pedaco, m.pedaco + 16, EASE_IO);
  const slices = [
    { k: "pagina", tool: 0, q: "quem comprou?", clip: "inset(0 66.6% 0 0)" },
    { k: "email", tool: 1, q: "quem pagou?", clip: "inset(0 33.3% 0 33.3%)" },
    { k: "whats", tool: 2, q: "quem abandonou o carrinho?", clip: "inset(0 0 0 66.6%)" },
  ];
  const card = (
    <div style={{ width: 460, height: 520, borderRadius: 32, background: WM.card, padding: 34, fontFamily: JAKARTA, boxShadow: SHADOW_FLOAT }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <Avatar txt="ML" size={150} />
        <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 40, color: WM.ink }}>Marina Lopes</div>
        <Badge text="Quente" bg="#FDEBD8" fg="#C2620E" fs={20} />
      </div>
      <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 12 }}>
        {["Visitou a página de vendas", "Abriu o e-mail", "Abandonou o carrinho"].map((l) => (
          <div key={l} style={{ fontSize: 21, fontWeight: 600, color: WM.muted3, background: WM.card2, borderRadius: 12, padding: "10px 14px" }}>{l}</div>
        ))}
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      {slices.map((s, i) => {
        const x = 730 + split * [-267, 0, 267][i];
        const y = 150;
        return (
          <div key={s.k} style={{ position: "absolute", left: x, top: y, clipPath: s.clip, opacity: frame < 2 ? 0 : 1 }}>
            {card}
          </div>
        );
      })}
      {slices.map((s, i) => (
        <Appear key={`q${s.k}`} f={m[s.k]} dir="up" dist={30} style={{ position: "absolute", top: 700, left: 310 + i * 420, width: 460, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <ToolChip i={s.tool} w={360} />
          <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 28, color: WM.lime, textAlign: "center" }}>não sabe {s.q}</div>
        </Appear>
      ))}
    </AbsoluteFill>
  );
};

/** "E você vira a ponte entre todas elas. Na mão."
 *  verbo: LIGAR NA MÃO — o cursor arrasta os cabos entre as ferramentas, um por um. */
export const S23Bridge: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const P = [
    { x: 480, y: 260 },
    { x: 1440, y: 260 },
    { x: 960, y: 660 },
  ];
  const a = m.ponte;
  const legs = [
    { from: 0, to: 1, f0: a, f1: a + 14 },
    { from: 1, to: 2, f0: a + 16, f1: a + 30 },
    { from: 2, to: 0, f0: a + 32, f1: a + 46 },
  ];
  const path = [
    { f: 0, x: P[0].x, y: P[0].y + 40 },
    { f: a, x: P[0].x, y: P[0].y },
    { f: a + 14, x: P[1].x, y: P[1].y, click: true },
    { f: a + 30, x: P[2].x, y: P[2].y, click: true },
    { f: a + 46, x: P[0].x, y: P[0].y, click: true },
  ];
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {legs.map((l, i) => {
          const t = prog(frame, l.f0, l.f1, EASE_IO);
          const A = P[l.from];
          const B = P[l.to];
          return t > 0 ? <line key={i} x1={A.x} y1={A.y} x2={A.x + (B.x - A.x) * t} y2={A.y + (B.y - A.y) * t} stroke="#ECECE7" strokeWidth={6} strokeDasharray="16 12" strokeLinecap="round" /> : null;
        })}
      </svg>
      {[0, 1, 2].map((i) => (
        <Appear key={i} f={i * 3} dir="scale" style={{ position: "absolute", left: P[i].x - 180, top: P[i].y - 43 }}>
          <ToolChip i={[0, 2, 3][i]} w={360} />
        </Appear>
      ))}
      <Appear f={m.mao} dir="scale" style={{ position: "absolute", left: 1500, top: 600 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: WM.card, borderRadius: 18, padding: "16px 22px", boxShadow: SHADOW_FLOAT }}>
          <LuFileSpreadsheet size={36} color="#22C55E" />
          <span style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 24, color: WM.ink }}>exportar_contatos_final_v3.csv</span>
        </div>
      </Appear>
      <Stamp f={m.mao} text="na mão" color="#FF4D57" rot={-8} size={64} style={{ top: 470, left: 240 }} />
      <Cursor path={path} />
    </AbsoluteFill>
  );
};

/** "O que resolve não é mais uma ferramenta."  verbo: BARRAR — o "+1" tenta entrar e é rebatido. */
export const S24NotMore: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const hit = m.mais;
  const inX = interpolate(frame, [0, hit], [700, 0], { ...CLAMP, easing: EASE_OUT });
  const back = prog(frame, hit + 8, hit + 26);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ marginTop: -80, transform: `translateX(${inX + back * 260}px) rotate(${back * 8}deg)`, opacity: 1 - back * 0.5 }}>
        <div style={{ width: 620, height: 380, borderRadius: 30, background: WM.card, boxShadow: SHADOW_FLOAT, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <div style={{ width: 120, height: 120, borderRadius: 30, background: WM.card2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LuPlus size={70} color={WM.ink} />
          </div>
          <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 50, color: WM.ink }}>mais uma ferramenta</div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 300, left: 1000 }}>
        <DrawX f={hit + 4} size={200} color="#FF4D57" stroke={26} />
      </div>
    </AbsoluteFill>
  );
};

/** "É uma só tela, onde tudo conversa."  PALAVRA ATRÁS "UMA SÓ / TELA" (lima)
 *  verbo: CONVERGIR — as seis ferramentas voam pro centro e viram uma janela só. */
export const S25OneScreen: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const t = prog(frame, 0, m.tela, EASE_IO);
  const start = [
    { x: 120, y: 160 },
    { x: 1360, y: 140 },
    { x: 60, y: 520 },
    { x: 1420, y: 560 },
    { x: 700, y: 80 },
    { x: 760, y: 820 },
  ];
  const merged = frame >= m.tela;
  const glow = prog(frame, m.tela, m.tela + 16);
  return (
    <AbsoluteFill>
      {!merged
        ? start.map((s, i) => (
            <div key={i} style={{ position: "absolute", left: s.x + (730 - s.x) * t, top: s.y + (520 - s.y) * t, transform: `scale(${1 - 0.5 * t})`, opacity: 1 - t * 0.3 }}>
              <ToolChip i={i} w={460} />
            </div>
          ))
        : null}
      <div style={{ position: "absolute", left: 510, top: 520, width: 900, transform: `scale(${0.7 + 0.3 * glow})`, opacity: glow }}>
        <div style={{ height: 330, borderRadius: 30, background: WM.bg, boxShadow: `${SHADOW_FLOAT}, 0 0 ${120 * glow}px rgba(212,245,0,${0.4 * glow})`, padding: 30, display: "flex", flexDirection: "column", gap: 18 }}>
          <Wordmark size={34} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {TOOLS.map((tl) => (
              <div key={tl.t} style={{ background: WM.card, borderRadius: 16, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, fontFamily: JAKARTA, fontWeight: 700, fontSize: 22, color: WM.ink }}>
                <tl.I size={24} color={WM.limeDark} /> {tl.t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** "Um cérebro acima do seu checkout, que lê cada venda e decide o próximo passo sozinho."
 *  verbo: LER E DECIDIR — pulsos de venda sobem das plataformas pro cérebro, que dispara o próximo passo. */
export const S26Brain: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const plats = ["Hotmart", "Kiwify", "Eduzz", "Stripe"];
  const BX = 960;
  const BY = 300;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {plats.map((_, i) => {
          const x = 420 + i * 360;
          const on = frame >= m.checkout + i * 4;
          return on ? <line key={i} x1={x} y1={760} x2={BX} y2={BY + 90} stroke="rgba(212,245,0,0.35)" strokeWidth={4} /> : null;
        })}
        {frame >= m.passo ? <line x1={BX + 120} y1={BY} x2={1430} y2={BY} stroke={WM.lime} strokeWidth={5} strokeDasharray={`${prog(frame, m.passo, m.passo + 12) * 320} 999`} /> : null}
      </svg>
      {/* pulsos de venda subindo */}
      {frame >= m.le
        ? plats.map((_, i) =>
            [0, 1].map((k) => {
              const l = (frame - m.le - i * 5 - k * 18) % 36;
              if (frame - m.le - i * 5 - k * 18 < 0) return null;
              const t = l / 36;
              const x0 = 420 + i * 360;
              return <div key={`${i}${k}`} style={{ position: "absolute", left: x0 + (BX - x0) * t - 12, top: 760 + (BY + 90 - 760) * t - 12, width: 24, height: 24, borderRadius: 99, background: WM.lime, boxShadow: "0 0 20px rgba(212,245,0,0.9)", opacity: 1 - t * 0.3 }} />;
            }),
          )
        : null}
      {plats.map((p, i) => (
        <Appear key={p} f={m.checkout + i * 4} dir="up" dist={40} style={{ position: "absolute", left: 420 + i * 360 - 130, top: 730 }}>
          <div style={{ width: 260, height: 70, borderRadius: 999, background: "rgba(236,236,231,0.08)", border: "1px solid rgba(236,236,231,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ECECE7", fontFamily: SORA, fontWeight: 700, fontSize: 28 }}>{p}</div>
        </Appear>
      ))}
      <Appear f={0} dir="scale" style={{ position: "absolute", left: BX - 120, top: BY - 120 }}>
        <div style={{ width: 240, height: 240, borderRadius: 999, background: WM.lime, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 ${60 + 30 * Math.sin(frame / 6)}px rgba(212,245,0,0.55)` }}>
          <LuBrain size={130} color={WM.ink} strokeWidth={1.6} />
        </div>
      </Appear>
      <Appear f={m.checkout} dir="up" dist={20} style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center" }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 22, letterSpacing: "0.18em", color: WM.muted }}>SEU CHECKOUT</div>
      </Appear>
      <Appear f={m.passo + 10} dir="left" dist={40} style={{ position: "absolute", left: 1440, top: BY - 60 }}>
        <div style={{ width: 380, background: WM.card, borderRadius: 22, padding: 22, boxShadow: SHADOW_FLOAT, fontFamily: JAKARTA }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: WM.muted2, letterSpacing: "0.08em" }}>PRÓXIMO PASSO</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, fontWeight: 700, fontSize: 24, color: WM.ink }}>
            <LuMessageCircle size={26} color="#22C55E" /> WhatsApp enviado
          </div>
          {frame >= m.sozinho ? (
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 99, background: WM.lime, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LuCheck size={20} color={WM.ink} strokeWidth={3} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 20, color: WM.limeDark }}>automático</span>
            </div>
          ) : null}
        </div>
      </Appear>
    </AbsoluteFill>
  );
};
