import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  LuCheck,
  LuLayoutTemplate,
  LuMessagesSquare,
  LuUsers,
  LuPercent,
  LuShoppingCart,
  LuCreditCard,
  LuQrCode,
  LuReceipt,
  LuClock,
  LuMessageCircle,
  LuInstagram,
  LuMail,
  LuSmartphone,
  LuPhone,
  LuBot,
  LuPlay,
  LuSparkles,
  LuEye,
  LuMousePointerClick,
  LuBadgeDollarSign,
  LuRepeat,
  LuFilter,
  LuGripVertical,
} from "react-icons/lu";
import type { SceneProps } from "../lib/types";
import { JAKARTA, SORA, WM, SHADOW_FLOAT } from "../lib/theme";
import { Appear, Big, DrawX, Typed, Stamp } from "../components/fx";
import { AppWindow, Avatar, Badge, Card, CLAMP, Cursor, DarkPill, EASE_IO, EASE_OUT, prog, brl, Wordmark, type NavKey } from "../components/ui";

/* ─── janela do app entrando como "tela cheia" (o B-roll deste vídeo) ─── */
const Screen: React.FC<{
  active: NavKey;
  crumb?: string;
  title?: string;
  children?: React.ReactNode;
  w?: number;
  h?: number;
}> = ({ active, crumb, title, children, w = 1640, h = 830 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 18, stiffness: 120, mass: 0.8 } });
  return (
    <AbsoluteFill style={{ perspective: 2200, alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top: 40,
          transform: `translateY(${(1 - s) * 140}px) rotateX(${(1 - s) * 18}deg) scale(${0.94 + 0.06 * s})`,
          opacity: Math.min(1, s * 1.6),
        }}
      >
        <AppWindow w={w} h={h} active={active} crumb={crumb} title={title}>
          {children}
        </AppWindow>
      </div>
    </AbsoluteFill>
  );
};

/* ═════════════════════════ REVELAÇÃO ═════════════════════════ */

/** "Esse cérebro se chama Wonne Max."  verbo: NOMEAR — o ponto lima cresce e vira a marca. */
export const S27Logo: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - m.nome, fps, config: { damping: 14, stiffness: 150, mass: 0.8 } });
  const dot = spring({ frame, fps, config: { damping: 12, stiffness: 160 } });
  const ring = prog(frame, m.nome, m.nome + 26);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", width: 900 * ring, height: 900 * ring, borderRadius: 999, border: `3px solid rgba(212,245,0,${0.6 * (1 - ring)})`, marginTop: -100 }} />
      <div style={{ marginTop: -100, display: "flex", alignItems: "baseline", fontFamily: SORA, fontWeight: 800, fontSize: 210, letterSpacing: "-0.04em", color: WM.white, lineHeight: 1 }}>
        <span style={{ opacity: s, transform: `translateY(${(1 - s) * 60}px)`, display: "inline-block", clipPath: `inset(0 ${(1 - s) * 100}% 0 0)` }}>wonne max</span>
        <span style={{ width: 62, height: 62, borderRadius: 99, background: WM.lime, marginLeft: 24, display: "inline-block", transform: `scale(${dot})`, boxShadow: "0 0 60px rgba(212,245,0,0.7)" }} />
      </div>
    </AbsoluteFill>
  );
};

/** "O ecossistema tudo-em-um pra quem vende de verdade."  — kinetic: as palavras entram com a voz. */
export const S28Kicker: React.FC<SceneProps> = ({ m }) => {
  const words: { t: string; k: string; lime?: boolean }[] = [
    { t: "O ecossistema", k: "eco" },
    { t: "tudo-em-um", k: "tudo", lime: true },
    { t: "pra quem vende", k: "quem" },
    { t: "de verdade.", k: "verdade", lime: true },
  ];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ marginTop: -120, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <Appear f={0} dir="down" dist={20} style={{ marginBottom: 30 }}>
          <Wordmark size={46} color={WM.white} />
        </Appear>
        <div style={{ display: "flex", gap: 30 }}>
          {words.slice(0, 2).map((w) => (
            <Appear key={w.k} f={m[w.k]} dir="up" dist={50}>
              <Big size={108} color={w.lime ? WM.lime : WM.white}>{w.t}</Big>
            </Appear>
          ))}
        </div>
        <div style={{ display: "flex", gap: 30 }}>
          {words.slice(2).map((w) => (
            <Appear key={w.k} f={m[w.k]} dir="up" dist={50}>
              <Big size={108} color={w.lime ? WM.lime : WM.white}>{w.t}</Big>
            </Appear>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** "Funis, páginas, mensagens e CRM, trabalhando na mesma tela."
 *  verbo: JUNTAR — o dashboard sobe e os 4 módulos acendem um a um. */
export const S29Modules: React.FC<SceneProps> = ({ m }) => {
  const mods: { k: string; t: string; I: React.FC<{ size?: number; color?: string }> }[] = [
    { k: "funis", t: "Funis", I: LuFilter },
    { k: "paginas", t: "Páginas", I: LuLayoutTemplate },
    { k: "mensagens", t: "Mensagens", I: LuMessagesSquare },
    { k: "crm", t: "CRM", I: LuUsers },
  ];
  return (
    <Screen active="visao" crumb="Wonne digital / Visão geral" title="Wonne digital">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22, marginTop: 10 }}>
        {mods.map((md) => (
          <Appear key={md.k} f={m[md.k]} dir="up" dist={40}>
            <Card pad={28} style={{ height: 300, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ width: 74, height: 74, borderRadius: 999, background: WM.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <md.I size={34} color={WM.lime} />
              </div>
              <div>
                <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 36 }}>{md.t}</div>
                <div style={{ marginTop: 12 }}>
                  <Badge text="ativo" fs={15} />
                </div>
              </div>
            </Card>
          </Appear>
        ))}
      </div>
      <Appear f={m.mesma} dir="up" dist={30} style={{ marginTop: 26 }}>
        <div style={{ height: 120, borderRadius: 18, background: "linear-gradient(90deg,#D4F500,#C2E000)", display: "flex", alignItems: "center", justifyContent: "center", gap: 18, fontFamily: SORA, fontWeight: 800, fontSize: 40, color: WM.ink }}>
          <LuCheck size={40} strokeWidth={3} /> tudo conectado na mesma tela
        </div>
      </Appear>
    </Screen>
  );
};

/** "o Wonne Max não tem checkout próprio. Não cobra taxa por venda."
 *  verbo: NEGAR / ZERAR — checkout riscado; a taxa desce até 0%. */
export const S30NoFee: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const fee = interpolate(frame, [m.taxa, m.taxa + 22], [9.9, 0], { ...CLAMP, easing: EASE_OUT });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 200, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 60 }}>
        <Appear f={0} dir="up" dist={50}>
          <div style={{ width: 640, height: 460, borderRadius: 36, background: WM.card, boxShadow: SHADOW_FLOAT, padding: 46, position: "relative" }}>
            <LuShoppingCart size={80} color={WM.ink} />
            <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 64, color: WM.ink, marginTop: 30, lineHeight: 1.05 }}>Checkout próprio</div>
            <div style={{ fontFamily: JAKARTA, fontWeight: 600, fontSize: 26, color: WM.muted2, marginTop: 12 }}>você continua no seu</div>
            <div style={{ position: "absolute", top: 40, right: 46 }}>
              <DrawX f={m.checkout + 4} size={110} color={WM.danger} stroke={18} />
            </div>
          </div>
        </Appear>
        <Appear f={m.taxa - 6} dir="up" dist={50}>
          <div style={{ width: 640, height: 460, borderRadius: 36, background: WM.lime, boxShadow: "0 0 90px rgba(212,245,0,0.35)", padding: 46 }}>
            <LuPercent size={80} color={WM.ink} />
            <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 30, color: WM.ink, marginTop: 24 }}>Taxa por venda</div>
            <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 180, color: WM.ink, letterSpacing: "-0.05em", lineHeight: 1 }}>{fee.toFixed(1).replace(".", ",").replace(",0", "")}%</div>
          </div>
        </Appear>
      </div>
    </AbsoluteFill>
  );
};

/** "Você continua vendendo na Hotmart, na Kiwify, na Eduzz. Ele só conecta e lê cada venda, em tempo real."
 *  verbo: CONECTAR + LER — plataformas plugam no Wonne Max e o feed de vendas corre ao vivo. */
export const S31Hub: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const plats = [
    { k: "hotmart", t: "Hotmart", y: 220 },
    { k: "kiwify", t: "Kiwify", y: 420 },
    { k: "eduzz", t: "Eduzz", y: 620 },
  ];
  const feed = [
    ["Venda aprovada", "Hotmart", 497],
    ["Venda aprovada", "Kiwify", 1997],
    ["Pix gerado", "Eduzz", 297],
    ["Venda aprovada", "Hotmart", 97],
    ["Recompra", "Kiwify", 4997],
    ["Venda aprovada", "Eduzz", 697],
  ] as const;
  const live = frame >= m.real;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {plats.map((p) => {
          const t = prog(frame, m[p.k] + 4, m[p.k] + 16, EASE_IO);
          return <path key={p.k} d={`M 560 ${p.y + 45} C 700 ${p.y + 45}, 700 465, 820 465`} fill="none" stroke={WM.lime} strokeWidth={5} strokeDasharray="420" strokeDashoffset={420 * (1 - t)} opacity={0.8} />;
        })}
      </svg>
      {plats.map((p) => (
        <Appear key={p.k} f={m[p.k]} dir="right" dist={60} style={{ position: "absolute", left: 200, top: p.y }}>
          <div style={{ width: 360, height: 90, borderRadius: 999, background: WM.card, boxShadow: SHADOW_FLOAT, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px 0 34px" }}>
            <span style={{ fontFamily: SORA, fontWeight: 700, fontSize: 32, color: WM.ink }}>{p.t}</span>
            <Badge text={frame >= m[p.k] + 16 ? "Conectado" : "…"} fs={15} />
          </div>
        </Appear>
      ))}
      <Appear f={0} dir="scale" style={{ position: "absolute", left: 820, top: 375 }}>
        <div style={{ width: 300, height: 180, borderRadius: 32, background: WM.ink, border: `3px solid ${WM.lime}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 70px rgba(212,245,0,0.35)" }}>
          <Wordmark size={40} color={WM.white} />
        </div>
      </Appear>
      <Appear f={m.le - 4} dir="left" dist={60} style={{ position: "absolute", left: 1220, top: 150 }}>
        <div style={{ width: 520, background: WM.card, borderRadius: 26, padding: 26, boxShadow: SHADOW_FLOAT, fontFamily: JAKARTA, height: 640, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontFamily: SORA, fontWeight: 700, fontSize: 28 }}>Registro de vendas</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 16, color: live ? WM.limeDark : WM.muted }}>
              <span style={{ width: 12, height: 12, borderRadius: 99, background: live ? WM.lime : WM.muted, boxShadow: live ? `0 0 0 ${4 + 3 * Math.sin(frame / 4)}px rgba(212,245,0,0.3)` : undefined }} /> AO VIVO
            </span>
          </div>
          {feed.map(([t, p, v], i) => (
            <Appear key={i} f={m.le + i * 7} dir="down" dist={30}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 4px", borderBottom: `1px solid ${WM.line}` }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: t === "Pix gerado" ? WM.warnSoft : WM.limeSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LuBadgeDollarSign size={22} color={t === "Pix gerado" ? WM.warn : WM.limeDark} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 20 }}>{t}</div>
                  <div style={{ fontSize: 16, color: WM.muted2 }}>{p} · agora</div>
                </div>
                <span style={{ fontFamily: SORA, fontWeight: 700, fontSize: 22 }}>{brl(v)}</span>
              </div>
            </Appear>
          ))}
        </div>
      </Appear>
    </AbsoluteFill>
  );
};

/* ═════════════════════════ DEMO ═════════════════════════ */

/** "Olha a visão geral. Visão de águia dos seus funis. Acessos, contatos capturados,
 *   produtos vendidos, ticket médio e faturamento. Uma verdade só."
 *  verbo: REVELAR NÚMEROS — cada KPI conta na palavra que o nomeia. */
export const S32Dashboard: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const kpis: { k: string; t: string; v: number; fmt: (n: number) => string; I: React.FC<{ size?: number; color?: string }> }[] = [
    { k: "acessos", t: "Acessos", v: 48920, fmt: (n) => Math.round(n).toLocaleString("pt-BR"), I: LuEye },
    { k: "contatos", t: "Contatos capturados", v: 12310, fmt: (n) => Math.round(n).toLocaleString("pt-BR"), I: LuUsers },
    { k: "produtos", t: "Produtos vendidos", v: 2406, fmt: (n) => Math.round(n).toLocaleString("pt-BR"), I: LuShoppingCart },
    { k: "ticket", t: "Ticket médio", v: 118, fmt: (n) => brl(Math.round(n)), I: LuMousePointerClick },
    { k: "fat", t: "Faturamento", v: 284000, fmt: (n) => brl(Math.round(n)), I: LuBadgeDollarSign },
  ];
  const stages = [
    ["01", "Atrair audiência", "48.920", "visitantes únicos"],
    ["02", "Preparar pra venda", "12.310", "leads qualificados"],
    ["03", "Vender", "R$ 284k", "faturamento no mês"],
  ];
  const truth = prog(frame, m.verdade, m.verdade + 12);
  return (
    <Screen active="visao" crumb="Wonne digital / Visão geral" title="Visão geral">
      <div style={{ display: "flex", gap: 28, borderBottom: `1px solid ${WM.line}`, marginBottom: 18, fontFamily: JAKARTA, fontSize: 18, fontWeight: 600 }}>
        {["Geral", "Atrair", "Preparar para venda", "Vender"].map((t, i) => (
          <div key={t} style={{ paddingBottom: 10, color: i === 0 ? WM.ink : WM.muted, borderBottom: i === 0 ? `3px solid ${WM.ink}` : "3px solid transparent" }}>{t}</div>
        ))}
      </div>
      <Appear f={m.aguia} dir="up" dist={20}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: SORA, fontWeight: 600, fontSize: 24, marginBottom: 14 }}>
          <span style={{ width: 9, height: 9, borderRadius: 99, background: WM.lime }} /> Visão de águia dos seus funis
        </div>
      </Appear>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        {stages.map(([n, t, v, l], i) => (
          <Appear key={n} f={m.aguia + 4 + i * 5} dir="up" dist={30}>
            <Card pad={22} style={i === 2 ? { background: "linear-gradient(160deg,#FCFEF2,#F1F9D7)" } : undefined}>
              <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 30, color: WM.line2 }}>{n}</div>
              <div style={{ fontWeight: 700, fontSize: 20, marginTop: 4 }}>{t}</div>
              <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 40, marginTop: 6 }}>{v}</div>
              <div style={{ fontSize: 15, color: WM.muted2 }}>{l}</div>
            </Card>
          </Appear>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginTop: 18, borderRadius: 20, padding: 10, boxShadow: truth ? `0 0 0 ${4 * truth}px ${WM.lime}, 0 0 ${50 * truth}px rgba(212,245,0,0.5)` : undefined }}>
        {kpis.map((kp) => {
          const f = m[kp.k];
          const v = interpolate(frame, [f, f + 20], [0, kp.v], { ...CLAMP, easing: EASE_OUT });
          return (
            <Appear key={kp.k} f={f - 2} dir="up" dist={30}>
              <div style={{ background: WM.card2, borderRadius: 12, padding: "16px 18px", fontFamily: JAKARTA, border: frame >= f && frame < f + 20 ? `2px solid ${WM.lime}` : "2px solid transparent" }}>
                <kp.I size={22} color={WM.muted2} />
                <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 32, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>{kp.fmt(v)}</div>
                <div style={{ fontSize: 15, color: WM.muted2, fontWeight: 600 }}>{kp.t}</div>
              </div>
            </Appear>
          );
        })}
      </div>
      {truth > 0 ? (
        <div style={{ position: "absolute", right: 40, top: 30, opacity: truth }}>
          <Badge text="● tempo real · uma verdade só" fs={18} />
        </div>
      ) : null}
    </Screen>
  );
};

type FNode = { k: string; t: string; c: string; x: number; y: number; v: string };

/** "Agora, o canvas de funis. Você liga a captura à página de vendas, ao upsell,
 *   à página de obrigado. E vê quanto perde em cada etapa."
 *  verbo: LIGAR — cada página nasce na palavra e o cabo se desenha até ela. */
export const S33Funnel: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const nodes: FNode[] = [
    { k: "captura", t: "Página de Captura", c: "#EC4899", x: 40, y: 150, v: "48.920 visitas" },
    { k: "vendas", t: "Página de Vendas", c: "#EF4444", x: 410, y: 300, v: "30.330 visitas" },
    { k: "upsell", t: "Upsell", c: "#8B5CF6", x: 780, y: 150, v: "11.520 visitas" },
    { k: "obrigado", t: "Página de Obrigado", c: "#22C55E", x: 1150, y: 300, v: "9.240 compras" },
  ];
  const loss = ["−38%", "−62%", "−20%"];
  const NW = 300;
  return (
    <Screen active="marketing" crumb="Marketing / Funis" title="Funil · Lançamento">
      <div style={{ position: "absolute", left: 28, right: 28, top: 110, bottom: 20, borderRadius: 18, background: WM.card, border: `1px solid ${WM.line}`, backgroundImage: "radial-gradient(rgba(20,22,15,0.12) 1.2px, transparent 1.4px)", backgroundSize: "26px 26px", overflow: "hidden" }}>
        <svg width={1560} height={600} style={{ position: "absolute", inset: 0 }}>
          {nodes.slice(1).map((n, i) => {
            const a = nodes[i];
            const t = prog(frame, m[n.k] - 2, m[n.k] + 10, EASE_IO);
            const x1 = a.x + NW;
            const y1 = a.y + 60;
            const x2 = n.x;
            const y2 = n.y + 60;
            const L = Math.hypot(x2 - x1, y2 - y1) * 1.3;
            return <path key={n.k} d={`M ${x1} ${y1} C ${x1 + 60} ${y1}, ${x2 - 60} ${y2}, ${x2} ${y2}`} fill="none" stroke={WM.ink} strokeWidth={4} strokeDasharray={L} strokeDashoffset={L * (1 - t)} />;
          })}
        </svg>
        {nodes.map((n) => (
          <Appear key={n.k} f={m[n.k]} dir="scale" style={{ position: "absolute", left: n.x, top: n.y }}>
            <div style={{ width: NW, background: WM.card, borderRadius: 16, boxShadow: "0 12px 30px -12px rgba(20,22,15,0.3)", border: `1px solid ${WM.line}`, overflow: "hidden", fontFamily: JAKARTA }}>
              <div style={{ height: 8, background: n.c }} />
              <div style={{ padding: "14px 16px" }}>
                <div style={{ fontWeight: 800, fontSize: 20 }}>{n.t}</div>
                <div style={{ height: 54, borderRadius: 10, background: WM.card2, marginTop: 10 }} />
                <div style={{ fontSize: 15, color: WM.muted2, fontWeight: 700, marginTop: 10 }}>{n.v}</div>
              </div>
            </div>
          </Appear>
        ))}
        {loss.map((l, i) => {
          const a = nodes[i];
          const b = nodes[i + 1];
          return (
            <Appear key={l} f={m.perde + i * 6} dir="scale" style={{ position: "absolute", left: (a.x + NW + b.x) / 2 - 44, top: (a.y + b.y) / 2 + 40 }}>
              <Badge text={l} bg="#FDE2E4" fg={WM.danger} fs={22} />
            </Appear>
          );
        })}
      </div>
    </Screen>
  );
};

/** "Precisa de uma página? Arrasta, solta, vende. Mais de sessenta seções prontas,
 *   com player de vídeo e botão de WhatsApp."
 *  verbo: ARRASTAR E SOLTAR — o cursor puxa seções da lateral pra página. */
export const S34Builder: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const secs = ["Hero", "Player de VSL", "Depoimentos", "Preços", "FAQ", "Botão WhatsApp"];
  // três arrastos, um por verbo
  const drags = [
    { f0: m.arrasta - 4, f1: m.solta - 2, from: 0 },
    { f0: m.solta - 2, f1: m.vende - 2, from: 3 },
    { f0: m.vende - 2, f1: m.vende + 14, from: 4 },
  ];
  const S0 = { x: 210, y: 290 };
  const P = { x: 820, y: 230 };
  const path = [
    { f: 0, x: 600, y: 600 },
    ...drags.flatMap((d, i) => [
      { f: d.f0, x: S0.x, y: S0.y + d.from * 64 },
      { f: d.f1, x: P.x, y: P.y + i * 120, click: true },
    ]),
  ];
  const placed = (i: number) => frame >= drags[i].f1;
  const block = (label: string, h: number, extra?: React.ReactNode) => (
    <div style={{ height: h, borderRadius: 14, background: WM.card2, border: `1px solid ${WM.line}`, padding: 16, fontFamily: JAKARTA, fontWeight: 700, fontSize: 18, color: WM.muted3, marginBottom: 12, display: "flex", alignItems: "center", gap: 14 }}>
      {extra}
      {label}
    </div>
  );
  return (
    <Screen active="marketing" crumb="Marketing / Páginas" title="Editor de página">
      <div style={{ position: "absolute", left: 28, top: 110, width: 330, bottom: 20, borderRadius: 18, background: WM.card, border: `1px solid ${WM.line}`, padding: 18 }}>
        <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 20, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Seções
          {frame >= m.sessenta ? <Badge text="60+ prontas" fs={14} /> : null}
        </div>
        {secs.map((s, i) => (
          <div key={s} style={{ height: 52, borderRadius: 12, background: WM.card2, marginBottom: 12, display: "flex", alignItems: "center", gap: 10, padding: "0 12px", fontFamily: JAKARTA, fontWeight: 700, fontSize: 18, color: WM.ink, outline: (i === 1 && frame >= m.player) || (i === 5 && frame >= m.botao) ? `3px solid ${WM.lime}` : undefined }}>
            <LuGripVertical size={18} color={WM.muted} /> {s}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 390, right: 28, top: 110, bottom: 20, borderRadius: 18, background: WM.white, border: `1px solid ${WM.line}`, padding: 30, overflow: "hidden" }}>
        {!placed(0) ? (
          <div style={{ height: 160, borderRadius: 16, border: `3px dashed ${WM.line2}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: JAKARTA, fontWeight: 700, fontSize: 22, color: WM.muted }}>Arraste uma seção aqui</div>
        ) : (
          <Appear f={drags[0].f1} dir="scale">
            <div style={{ height: 150, borderRadius: 16, background: WM.ink, padding: 26, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 34, color: WM.white }}>Método Órbita</div>
                <div style={{ fontFamily: JAKARTA, fontSize: 18, color: WM.muted }}>A página que vende de verdade</div>
              </div>
              <DarkPill label="Quero agora" h={52} fs={17} />
            </div>
          </Appear>
        )}
        {frame >= m.player ? (
          <Appear f={m.player} dir="scale">
            {block("Player de VSL", 110, <div style={{ width: 70, height: 70, borderRadius: 99, background: WM.ink, display: "flex", alignItems: "center", justifyContent: "center" }}><LuPlay size={30} color={WM.lime} /></div>)}
          </Appear>
        ) : null}
        {placed(1) ? <Appear f={drags[1].f1} dir="scale">{block("Tabela de preços", 80)}</Appear> : null}
        {placed(2) ? <Appear f={drags[2].f1} dir="scale">{block("Perguntas frequentes", 64)}</Appear> : null}
        {frame >= m.botao ? (
          <Appear f={m.botao} dir="scale">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#22C55E", color: "#fff", borderRadius: 999, padding: "16px 30px", fontFamily: JAKARTA, fontWeight: 800, fontSize: 22 }}>
              <LuMessageCircle size={26} /> Falar no WhatsApp
            </div>
          </Appear>
        ) : null}
      </div>
      <Cursor path={path} />
    </Screen>
  );
};

/** "Aqui estão as mensagens. WhatsApp, Instagram, e-mail, SMS, e até ligação com voz.
 *   Tudo numa caixa de entrada única."
 *  verbo: CONVERGIR — cada canal acende na palavra; as conversas caem numa lista só. */
export const S35Inbox: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const ch: { k: string; t: string; I: React.FC<{ size?: number; color?: string }>; c: string }[] = [
    { k: "whats", t: "WhatsApp", I: LuMessageCircle, c: "#22C55E" },
    { k: "insta", t: "Instagram", I: LuInstagram, c: "#E1306C" },
    { k: "email", t: "E-mail", I: LuMail, c: "#F59E0B" },
    { k: "sms", t: "SMS", I: LuSmartphone, c: "#3B82F6" },
    { k: "voz", t: "Voz", I: LuPhone, c: "#8B5CF6" },
  ];
  const convs = [
    { n: "Marina Lopes", t: "Fechado! Acabei de comprar", c: 0 },
    { n: "Tiago Fonseca", t: "Vi o story, como funciona?", c: 1 },
    { n: "Ana Souza", t: "Abriu: Última chamada", c: 2 },
    { n: "Rafael Costa", t: "SMS: seu Pix está pronto", c: 3 },
    { n: "Pedro Braga", t: "Ligação · campanha recompra", c: 4 },
  ];
  const uni = frame >= m.unica;
  return (
    <Screen active="mensagens" crumb="Mensagens / Conversas" title="Conversas">
      <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
        {ch.map((c) => {
          const on = frame >= m[c.k];
          return (
            <div key={c.k} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 999, background: on ? WM.ink : WM.card, color: on ? WM.white : WM.muted, fontFamily: JAKARTA, fontWeight: 700, fontSize: 20, transform: `scale(${on && frame < m[c.k] + 6 ? 1.08 : 1})` }}>
              <c.I size={22} color={on ? c.c : WM.muted} /> {c.t}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 18, height: 560 }}>
        <Card pad={16} style={{ width: 560, boxShadow: uni ? `0 0 0 4px ${WM.lime}` : undefined }}>
          <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 20, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
            Caixa de entrada {uni ? <Badge text="única" fs={14} /> : null}
          </div>
          {convs.map((cv, i) => {
            const c = ch[cv.c];
            return (
              <Appear key={cv.n} f={m[c.k] + 2} dir="down" dist={30}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 8px", borderBottom: `1px solid ${WM.line}`, background: i === 0 ? WM.limeSoft : undefined, borderRadius: 10 }}>
                  <Avatar txt={cv.n.split(" ").map((p) => p[0]).join("")} size={44} bg={WM.card2} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 19 }}>{cv.n}</div>
                    <div style={{ fontSize: 16, color: WM.muted2 }}>{cv.t}</div>
                  </div>
                  <c.I size={22} color={c.c} />
                </div>
              </Appear>
            );
          })}
        </Card>
        <Card pad={22} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, background: "#F6F6F2" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar txt="ML" size={48} />
            <div style={{ fontWeight: 800, fontSize: 22 }}>Marina Lopes</div>
            <Badge text="WhatsApp" bg="#DCFCE7" fg="#15803D" fs={14} />
          </div>
          <Appear f={m.whats + 6} dir="up" dist={20} style={{ alignSelf: "flex-end" }}>
            <div style={{ background: WM.ink, color: WM.white, borderRadius: "20px 20px 6px 20px", padding: "14px 20px", fontSize: 21, maxWidth: 520 }}>Separei um cupom de 30% só pra você, Marina.</div>
          </Appear>
          <Appear f={m.email} dir="up" dist={20} style={{ alignSelf: "flex-start" }}>
            <div style={{ background: WM.card, borderRadius: "20px 20px 20px 6px", padding: "14px 20px", fontSize: 21 }}>Fechado! Acabei de comprar.</div>
          </Appear>
        </Card>
      </div>
    </Screen>
  );
};

/** "E os fluxos automáticos. Carrinho abandonado. Cartão recusado. Pix expirado. Boleto vencido.
 *   Cada gatilho dispara a mensagem certa, na hora certa."
 *  verbo: DISPARAR — os gatilhos entram um a um; no "dispara" os pulsos correm pros cabos. */
export const S36Flows: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const trig: { k: string; t: string; I: React.FC<{ size?: number; color?: string }> }[] = [
    { k: "carrinho", t: "Carrinho abandonado", I: LuShoppingCart },
    { k: "cartao", t: "Cartão recusado", I: LuCreditCard },
    { k: "pix", t: "Pix expirado", I: LuQrCode },
    { k: "boleto", t: "Boleto vencido", I: LuReceipt },
  ];
  const fired = frame >= m.dispara;
  return (
    <Screen active="marketing" crumb="Marketing / Fluxos de mensagem" title="Fluxos de mensagem">
      <div style={{ position: "absolute", left: 28, right: 28, top: 110, bottom: 20, borderRadius: 18, background: WM.card, border: `1px solid ${WM.line}`, backgroundImage: "radial-gradient(rgba(20,22,15,0.12) 1.2px, transparent 1.4px)", backgroundSize: "26px 26px" }}>
        <svg width={1560} height={620} style={{ position: "absolute", inset: 0 }}>
          {trig.map((t, i) => {
            const y = 60 + i * 130 + 42;
            const tt = prog(frame, m[t.k] + 2, m[t.k] + 12, EASE_IO);
            return <path key={t.k} d={`M 400 ${y} C 520 ${y}, 520 300, 640 300`} fill="none" stroke={WM.ink} strokeWidth={3.5} strokeDasharray={400} strokeDashoffset={400 * (1 - tt)} />;
          })}
          <line x1={940} y1={300} x2={1060} y2={300} stroke={WM.ink} strokeWidth={3.5} />
        </svg>
        {fired
          ? trig.map((t, i) => {
              const l = ((frame - m.dispara - i * 4) % 30) / 30;
              if (frame - m.dispara - i * 4 < 0) return null;
              const y0 = 60 + i * 130 + 42;
              const x = 400 + 240 * l;
              const y = y0 + (300 - y0) * (l * l * (3 - 2 * l));
              return <div key={t.k} style={{ position: "absolute", left: x - 10, top: y - 10, width: 20, height: 20, borderRadius: 99, background: WM.lime, boxShadow: "0 0 16px rgba(212,245,0,0.9)", border: `2px solid ${WM.ink}` }} />;
            })
          : null}
        {trig.map((t, i) => (
          <Appear key={t.k} f={m[t.k]} dir="right" dist={40} style={{ position: "absolute", left: 40, top: 60 + i * 130 }}>
            <div style={{ width: 360, height: 84, borderRadius: 16, background: WM.white, border: `1px solid ${WM.line}`, boxShadow: "0 10px 24px -12px rgba(20,22,15,0.3)", display: "flex", alignItems: "center", gap: 14, padding: "0 18px", fontFamily: JAKARTA }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: "#FDE2E4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <t.I size={24} color={WM.danger} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: WM.muted2, letterSpacing: "0.08em" }}>GATILHO</div>
                <div style={{ fontWeight: 800, fontSize: 21 }}>{t.t}</div>
              </div>
            </div>
          </Appear>
        ))}
        <Appear f={m.carrinho + 6} dir="scale" style={{ position: "absolute", left: 640, top: 250 }}>
          <div style={{ width: 300, height: 100, borderRadius: 16, background: WM.ink, color: WM.white, display: "flex", alignItems: "center", gap: 14, padding: "0 20px", fontFamily: JAKARTA }}>
            <LuClock size={30} color={WM.lime} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: WM.muted, letterSpacing: "0.08em" }}>AGUARDAR</div>
              <div style={{ fontWeight: 800, fontSize: 22 }}>10 minutos</div>
            </div>
          </div>
        </Appear>
        <Appear f={m.carrinho + 10} dir="scale" style={{ position: "absolute", left: 1060, top: 210 }}>
          <div style={{ width: 440, borderRadius: 18, background: WM.white, border: `2px solid ${fired ? WM.lime : WM.line}`, boxShadow: fired ? "0 0 40px rgba(212,245,0,0.5)" : "0 10px 24px -12px rgba(20,22,15,0.3)", padding: 18, fontFamily: JAKARTA }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 20 }}>
              <LuMessageCircle size={24} color="#22C55E" /> Mensagem · WhatsApp
            </div>
            <div style={{ marginTop: 12, background: "#DCF8C6", borderRadius: 14, padding: "12px 16px", fontSize: 19, color: "#111" }}>
              {frame >= m.certa ? <Typed f={m.certa} text="Oi, Marina! Seu Pix expirou. Gerei um novo, vale por 30 min." cpf={0.9} caret={false} /> : <span style={{ color: WM.muted }}>…</span>}
            </div>
            {frame >= m.hora ? (
              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <Badge text="✓✓ entregue agora" fs={14} />
              </div>
            ) : null}
          </div>
        </Appear>
      </div>
    </Screen>
  );
};

/** "O agente de IA conversa com o seu cliente no WhatsApp e no Instagram. Conhece seus produtos,
 *   responde objeções, e passa pra você quando precisa."
 *  verbo: CONVERSAR — o chat acontece na frente; a objeção é tratada; o handoff acende. */
export const S37Agent: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const typing = frame >= m.conhece - 14 && frame < m.conhece;
  return (
    <AbsoluteFill>
      <Appear f={0} dir="right" dist={60} style={{ position: "absolute", left: 220, top: 140 }}>
        <div style={{ width: 560, background: WM.card, borderRadius: 30, padding: 34, boxShadow: SHADOW_FLOAT, fontFamily: JAKARTA }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 70, height: 70, borderRadius: 20, background: "#EDE4FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LuBot size={40} color={WM.violet} />
            </div>
            <div>
              <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 32 }}>Agente de IA</div>
              <div style={{ fontSize: 18, color: WM.muted2, fontWeight: 600 }}>WhatsApp · Instagram</div>
            </div>
          </div>
          {[
            ["Persona", "Consultora Wonne", "conversa"],
            ["Conhece", "Método Órbita · Mentoria Prime", "conhece"],
            ["Objeções", "preço, tempo, confiança", "objecoes"],
            ["Passar pra humano", "quando o cliente pedir", "passa"],
          ].map(([a, b, k]) => (
            <Appear key={a} f={m[k]} dir="left" dist={30}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18, padding: "14px 16px", borderRadius: 14, background: WM.card2 }}>
                <div style={{ width: 30, height: 30, borderRadius: 99, background: WM.lime, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LuCheck size={18} color={WM.ink} strokeWidth={3} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: WM.muted2 }}>{a}</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{b}</div>
                </div>
              </div>
            </Appear>
          ))}
        </div>
      </Appear>
      <Appear f={2} dir="up" dist={80} style={{ position: "absolute", left: 1040, top: 60 }}>
        <div style={{ width: 600, height: 840, borderRadius: 60, background: "#0B0C08", border: "10px solid #2a2b22", overflow: "hidden", boxShadow: "0 60px 120px -40px rgba(0,0,0,0.8)" }}>
          <div style={{ height: 110, background: "#1F2C24", display: "flex", alignItems: "flex-end", gap: 14, padding: "0 24px 16px", fontFamily: JAKARTA, color: "#fff" }}>
            <Avatar txt="ML" size={48} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 22 }}>Marina Lopes</div>
              <div style={{ fontSize: 15, color: "#9BC5A8" }}>{typing ? "digitando…" : "online"}</div>
            </div>
          </div>
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, fontFamily: JAKARTA, background: "#ECE5DD", height: "100%" }}>
            <Appear f={m.conversa} dir="up" dist={20} style={{ alignSelf: "flex-start" }}>
              <div style={{ background: "#fff", borderRadius: "18px 18px 18px 4px", padding: "14px 18px", fontSize: 22, maxWidth: 440 }}>Gostei do curso, mas achei caro pra agora…</div>
            </Appear>
            <Appear f={m.conhece} dir="up" dist={20} style={{ alignSelf: "flex-end" }}>
              <div style={{ background: "#DCF8C6", borderRadius: "18px 18px 4px 18px", padding: "14px 18px", fontSize: 22, maxWidth: 460 }}>
                Entendo, Marina! O Método Órbita sai em 12x e tem 7 dias de garantia. Quer que eu te mande o link?
                <div style={{ fontSize: 14, color: "#5B7B65", marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <LuSparkles size={14} /> Agente de IA
                </div>
              </div>
            </Appear>
            <Appear f={m.objecoes + 8} dir="up" dist={20} style={{ alignSelf: "flex-start" }}>
              <div style={{ background: "#fff", borderRadius: "18px 18px 18px 4px", padding: "14px 18px", fontSize: 22 }}>Manda! E dá pra falar com alguém?</div>
            </Appear>
            <Appear f={m.passa} dir="scale" style={{ alignSelf: "center" }}>
              <div style={{ background: WM.ink, color: WM.lime, borderRadius: 999, padding: "10px 20px", fontSize: 18, fontWeight: 800 }}>Conversa transferida para Gustavo</div>
            </Appear>
          </div>
        </div>
      </Appear>
      <Stamp f={m.objecoes + 2} text="objeção tratada" color={WM.lime} rot={-6} size={40} fill ink={WM.ink} style={{ top: 760, left: 640 }} />
    </AbsoluteFill>
  );
};

/** "No CRM, cada contato tem temperatura. Frio, morno, quente, cliente. E uma linha do tempo completa."
 *  verbo: AQUECER — cada etiqueta de temperatura acende na sua palavra. */
export const S38Crm: React.FC<SceneProps> = ({ m }) => {
  const rows = [
    { n: "Ana Souza", o: "Orgânico", k: "frio", tag: "Frio", bg: "#E4EEFB", fg: "#2563EB", v: "R$ 0" },
    { n: "Rafael Costa", o: "WhatsApp", k: "morno", tag: "Morno", bg: "#FFF7E0", fg: "#9A7B16", v: "R$ 497" },
    { n: "Marina Lopes", o: "Google Ads", k: "quente", tag: "Quente", bg: "#FDEBD8", fg: "#C2620E", v: "R$ 8.900" },
    { n: "Tiago Fonseca", o: "Instagram", k: "cliente", tag: "Cliente", bg: "#EAF8C6", fg: "#4D6B0A", v: "R$ 42.000" },
    { n: "Pedro Braga", o: "Indicação", k: "cliente", tag: "Cliente", bg: "#EAF8C6", fg: "#4D6B0A", v: "R$ 27.000" },
  ];
  return (
    <Screen active="contatos" crumb="Contatos & Comercial / Contatos" title="Contatos">
      <Card pad={0} style={{ overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1.4fr 1.2fr 1.2fr 1fr", padding: "16px 26px", background: WM.card2, fontSize: 15, fontWeight: 800, color: WM.muted2, letterSpacing: "0.06em" }}>
          <span>CONTATO</span>
          <span>ORIGEM</span>
          <span>TEMPERATURA</span>
          <span>LTV</span>
          <span>SCORE</span>
        </div>
        {rows.map((r, i) => (
          <Appear key={r.n} f={i * 3} dir="up" dist={20}>
            <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1.4fr 1.2fr 1.2fr 1fr", padding: "18px 26px", alignItems: "center", borderTop: `1px solid ${WM.line}`, fontSize: 21, fontWeight: 600 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 14, fontWeight: 800 }}>
                <Avatar txt={r.n.split(" ").map((p) => p[0]).join("")} size={44} /> {r.n}
              </span>
              <span style={{ color: WM.muted2 }}>{r.o}</span>
              <span>
                <Appear f={m[r.k] + (i === 4 ? 4 : 0)} dir="scale">
                  <Badge text={r.tag} bg={r.bg} fg={r.fg} fs={18} />
                </Appear>
              </span>
              <span style={{ fontFamily: SORA, fontWeight: 700 }}>{r.v}</span>
              <span style={{ fontFamily: SORA, fontWeight: 700 }}>{[12, 48, 86, 97, 93][i]}</span>
            </div>
          </Appear>
        ))}
      </Card>
      <Appear f={m.linha} dir="up" dist={30} style={{ marginTop: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: SORA, fontWeight: 700, fontSize: 24 }}>
          <LuRepeat size={26} color={WM.limeDark} /> Linha do tempo · contato 360
        </div>
      </Appear>
    </Screen>
  );
};

/** "Visitou o vídeo. Abriu o e-mail. Comprou. Comprou de novo. Cliente comprou?
 *   O CRM atualiza sozinho e dispara o próximo passo."
 *  verbo: AVANÇAR — a timeline se cumpre item a item; o card anda sozinho pra "Ganho". */
export const S39Timeline: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const tl = [
    { k: "visitou", t: "Visitou o vídeo", s: "Método Órbita · VSL", I: LuPlay },
    { k: "abriu", t: "Abriu o e-mail", s: "“Última chamada”", I: LuMail },
    { k: "comprou", t: "Comprou", s: "Método Órbita · R$ 1.997", I: LuBadgeDollarSign },
    { k: "denovo", t: "Comprou de novo", s: "Mentoria Prime · R$ 4.997", I: LuRepeat },
  ];
  const cols = ["Novo lead", "Contato feito", "Proposta enviada", "Ganho"];
  const colDot = ["#3B82F6", "#8B5CF6", "#F59E0B", "#B9E80D"];
  const mv = prog(frame, m.atualiza, m.atualiza + 16, EASE_IO);
  const CW = 230;
  return (
    <Screen active="contatos" crumb="Contatos & Comercial / Marina Lopes" title="Marina Lopes">
      <div style={{ display: "flex", gap: 24 }}>
        <Card pad={24} style={{ width: 520 }}>
          <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 22, marginBottom: 10 }}>Linha do tempo</div>
          {tl.map((it, i) => {
            const on = frame >= m[it.k];
            return (
              <div key={it.k} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "12px 0", opacity: on ? 1 : 0.25 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 99, background: on ? (i >= 2 ? WM.lime : WM.ink) : WM.card2, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${on && frame < m[it.k] + 6 ? 1.15 : 1})` }}>
                    <it.I size={22} color={on ? (i >= 2 ? WM.ink : WM.lime) : WM.muted} />
                  </div>
                  {i < 3 ? <div style={{ width: 3, height: 34, background: WM.line2, marginTop: 6 }} /> : null}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 22 }}>{it.t}</div>
                  <div style={{ fontSize: 17, color: WM.muted2 }}>{it.s}</div>
                </div>
              </div>
            );
          })}
        </Card>
        <div style={{ flex: 1, position: "relative" }}>
          <Appear f={m.cliente - 4} dir="left" dist={40}>
            <div style={{ display: "flex", gap: 14 }}>
              {cols.map((c, i) => (
                <div key={c} style={{ width: CW, height: 560, borderRadius: 16, background: WM.card2, padding: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 17, marginBottom: 12 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 99, background: colDot[i] }} /> {c}
                  </div>
                  {i === 0 ? <div style={{ height: 70, borderRadius: 12, background: WM.card, marginBottom: 10 }} /> : null}
                  {i === 1 ? <div style={{ height: 70, borderRadius: 12, background: WM.card }} /> : null}
                </div>
              ))}
            </div>
            <div style={{ position: "absolute", top: 46, left: 14 + (CW + 14) * (2 + mv), width: CW - 28, background: WM.card, borderRadius: 14, padding: 14, boxShadow: mv > 0 && mv < 1 ? "0 30px 40px -20px rgba(0,0,0,0.4)" : "0 4px 10px rgba(0,0,0,0.06)", transform: `rotate(${Math.sin(mv * Math.PI) * 4}deg)`, border: mv >= 1 ? `2px solid ${WM.lime}` : `1px solid ${WM.line}` }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>Marina Lopes</div>
              <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 22, marginTop: 4 }}>R$ 4.997</div>
              <div style={{ marginTop: 8 }}>{mv >= 1 ? <Badge text="Ganha" fs={13} /> : <Badge text="Quente" bg="#FDEBD8" fg="#C2620E" fs={13} />}</div>
            </div>
          </Appear>
          <Appear f={m.dispara} dir="up" dist={30} style={{ position: "absolute", left: 120, top: 470 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, background: WM.ink, color: WM.white, borderRadius: 18, padding: "18px 24px", fontFamily: JAKARTA, fontWeight: 700, fontSize: 21, boxShadow: SHADOW_FLOAT }}>
              <div style={{ width: 34, height: 34, borderRadius: 99, background: WM.lime, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LuCheck size={20} color={WM.ink} strokeWidth={3} />
              </div>
              Próximo passo disparado: boas-vindas da Mentoria
            </div>
          </Appear>
        </div>
      </div>
    </Screen>
  );
};

/** "E se quiser saber alguma coisa, pergunta pro Chat Max. Quais produtos mais venderam este mês?
 *   Ele responde com os números reais do seu negócio."
 *  verbo: PERGUNTAR E RESPONDER — a pergunta é digitada junto com a voz; as barras sobem. */
export const S40ChatMax: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const q = "Quais produtos mais venderam este mês?";
  const cpf = Math.max(0.8, (m.qend - m.q) / q.length);
  const bars = [
    { t: "Método Órbita", v: 412 },
    { t: "Mentoria Prime", v: 96 },
    { t: "Ebook · Order bump", v: 1204 },
  ].sort((a, b) => b.v - a.v);
  const max = bars[0].v;
  const thinking = frame >= m.qend && frame < m.responde;
  return (
    <Screen active="chat" crumb="Chat Max" title="Max IA">
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1180, margin: "0 auto" }}>
        <Appear f={m.q - 2} dir="up" dist={20} style={{ alignSelf: "flex-end" }}>
          <div style={{ background: WM.ink, color: WM.white, borderRadius: "22px 22px 6px 22px", padding: "18px 26px", fontSize: 26, fontWeight: 600, minWidth: 200 }}>
            <Typed f={m.q} text={q} cpf={cpf} />
          </div>
        </Appear>
        {thinking ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: WM.muted2, fontSize: 20, fontWeight: 600 }}>
            <span style={{ width: 12, height: 12, borderRadius: 99, background: WM.lime, boxShadow: `0 0 0 ${4 + 4 * Math.sin(frame / 3)}px rgba(212,245,0,0.3)` }} /> Max está consultando seus dados…
          </div>
        ) : null}
        {frame >= m.responde ? (
          <Appear f={m.responde} dir="up" dist={30}>
            <Card pad={28} style={{ maxWidth: 900 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, fontWeight: 700, marginBottom: 18 }}>
                <span style={{ width: 34, height: 34, borderRadius: 99, background: WM.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 99, background: WM.lime }} />
                </span>
                Em outubro, os mais vendidos foram:
              </div>
              {bars.map((b, i) => {
                const w = prog(frame, m.responde + 6 + i * 6, m.responde + 26 + i * 6);
                return (
                  <div key={b.t} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                      <span>{b.t}</span>
                      <span style={{ fontFamily: SORA }}>{Math.round(b.v * w).toLocaleString("pt-BR")} vendas</span>
                    </div>
                    <div style={{ height: 22, borderRadius: 99, background: WM.card2 }}>
                      <div style={{ width: `${(b.v / max) * 100 * w}%`, height: "100%", borderRadius: 99, background: i === 0 ? WM.lime : WM.ink }} />
                    </div>
                  </div>
                );
              })}
              <div style={{ marginTop: 10 }}>
                <Badge text="Fonte: Registro de vendas ↗" bg={WM.card2} fg={WM.muted3} fs={15} />
              </div>
            </Card>
          </Appear>
        ) : null}
      </div>
    </Screen>
  );
};
