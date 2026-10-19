import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  LuLayoutTemplate,
  LuMail,
  LuMessageCircle,
  LuUsers,
  LuChartBar,
  LuServer,
  LuMoon,
  LuTriangleAlert,
  LuVolumeX,
  LuCreditCard,
  LuQrCode,
  LuReceipt,
  LuShoppingCart,
  LuVideo,
  LuGraduationCap,
  LuPenLine,
  LuClock,
} from "react-icons/lu";
import type { SceneProps } from "../lib/types";
import { JAKARTA, SORA, WM, SHADOW_FLOAT } from "../lib/theme";
import { Appear, Stamp, Big, Kicker } from "../components/fx";
import { Avatar, Badge, CLAMP, EASE_OUT, prog, brl } from "../components/ui";

/* ═════════════════════════ HOOK ═════════════════════════ */

const TOOL_NAMES = ["Páginas", "E-mail", "WhatsApp", "CRM", "Métricas", "Hospedagem", "Planilha", "Agenda", "Checkout", "Drive", "Formulário", "Pixel", "Links", "Suporte", "Relatórios"];

/** "Quinze abas abertas. Quinze mensalidades no cartão."
 *  verbo: MULTIPLICAR — as abas brotam uma a uma até 15; depois as
 *  mensalidades descem como extrato. */
export const S01Tabs: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const shown = Math.min(15, Math.max(0, Math.floor((frame - 2) / 2) + 1));
  const W = 1240;
  const charges = [
    ["Construtor de páginas", 297],
    ["E-mail marketing", 340],
    ["API de WhatsApp", 380],
    ["CRM de vendas", 420],
    ["Analytics", 290],
    ["Hospedagem", 180],
  ] as const;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top: 330,
          width: W,
          height: 560,
          borderRadius: 22,
          background: WM.bg,
          boxShadow: SHADOW_FLOAT,
          overflow: "hidden",
        }}
      >
        {/* barra de abas */}
        <div style={{ height: 58, background: "#DCDCD4", display: "flex", alignItems: "flex-end", padding: "0 12px", gap: 3 }}>
          {Array.from({ length: shown }).map((_, i) => {
            const w = (W - 40) / Math.max(shown, 4);
            const isLast = i === shown - 1;
            return (
              <div
                key={i}
                style={{
                  width: w - 3,
                  height: 44,
                  borderRadius: "12px 12px 0 0",
                  background: isLast ? WM.card : "#ECECE6",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "0 10px",
                  overflow: "hidden",
                  fontFamily: JAKARTA,
                  fontSize: 13,
                  fontWeight: 600,
                  color: WM.muted3,
                  whiteSpace: "nowrap",
                  transform: isLast ? `translateY(${interpolate(frame % 2, [0, 1], [6, 0])}px)` : undefined,
                }}
              >
                <span style={{ width: 12, height: 12, borderRadius: 4, background: i % 3 === 0 ? WM.ink : i % 3 === 1 ? WM.muted : WM.line2, flexShrink: 0 }} />
                {TOOL_NAMES[i]}
              </div>
            );
          })}
        </div>
        {/* contador de abas */}
        <div style={{ position: "absolute", top: 90, left: 40, fontFamily: SORA, fontWeight: 700, fontSize: 26, color: WM.muted2 }}>
          {shown} {shown === 1 ? "aba aberta" : "abas abertas"}
        </div>
        {/* extrato das mensalidades */}
        <div style={{ position: "absolute", top: 150, left: 40, right: 40 }}>
          {charges.map(([name, v], i) => (
            <Appear key={name} f={m.mens + i * 4} dir="down" dist={24}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "13px 18px",
                  marginBottom: 8,
                  background: WM.card,
                  borderRadius: 12,
                  fontFamily: JAKARTA,
                  fontSize: 20,
                  fontWeight: 600,
                  color: WM.ink,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <LuCreditCard size={20} color={WM.muted2} /> Mensalidade · {name}
                </span>
                <span style={{ color: WM.danger, fontFamily: SORA, fontWeight: 700 }}>− {brl(v)}</span>
              </div>
            </Appear>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** "uma venda escapou ontem à noite, enquanto você dormia. E você nem ficou sabendo."
 *  verbo: ESCAPAR — a notificação chega na tela bloqueada e escorrega pra fora. */
export const S02Night: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const slide = prog(frame, m.escapou, m.escapou + 14);
  const dim = prog(frame, m.dormia, m.dormia + 20);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Appear f={0} dir="up" dist={60} style={{ position: "absolute", top: 70 }}>
        <div
          style={{
            width: 420,
            height: 820,
            borderRadius: 64,
            background: "linear-gradient(170deg,#1f2118,#0b0c08)",
            border: "10px solid #2a2b22",
            boxShadow: "0 60px 120px -40px rgba(0,0,0,0.8)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: 18, left: "50%", marginLeft: -60, width: 120, height: 32, borderRadius: 20, background: "#000" }} />
          <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center", color: `rgba(236,236,231,${1 - dim * 0.6})` }}>
            <div style={{ fontFamily: JAKARTA, fontSize: 20, fontWeight: 600 }}>terça-feira, 23 de setembro</div>
            <div style={{ fontFamily: SORA, fontSize: 112, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.05 }}>23:47</div>
          </div>
          {/* notificação */}
          <div
            style={{
              position: "absolute",
              top: 330,
              left: 18,
              right: 18,
              transform: `translateX(${slide * 460}px) rotate(${slide * 6}deg)`,
              opacity: interpolate(frame, [m.venda - 1, m.venda + 4], [0, 1], CLAMP) * (1 - slide * 0.9),
            }}
          >
            <Appear f={m.venda} dir="down" dist={40}>
              <div style={{ background: "rgba(246,246,242,0.94)", borderRadius: 26, padding: "16px 18px", display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: WM.ink, display: "flex", alignItems: "center", justifyContent: "center", color: WM.lime, fontFamily: SORA, fontWeight: 800 }}>R$</div>
                <div style={{ fontFamily: JAKARTA, color: WM.ink }}>
                  <div style={{ fontWeight: 800, fontSize: 17 }}>Venda aprovada · R$ 1.997</div>
                  <div style={{ fontSize: 15, color: WM.muted3 }}>Novo comprador aguardando acesso</div>
                </div>
              </div>
            </Appear>
          </div>
          <div style={{ position: "absolute", bottom: 60, width: "100%", display: "flex", justifyContent: "center", opacity: dim, color: "#ECECE7" }}>
            <LuMoon size={58} strokeWidth={1.5} />
          </div>
        </div>
      </Appear>
      <Stamp f={m.sabendo} text="ninguém viu" color={WM.danger} rot={-7} size={58} style={{ top: 470, left: 1180 }} />
    </AbsoluteFill>
  );
};

/* ═════════════════════════ LEAD — MARIA ═════════════════════════ */

const MariaCard: React.FC<{ subF: number; glow?: number }> = ({ subF, glow = 0 }) => (
  <div
    style={{
      width: 520,
      background: WM.card,
      borderRadius: 28,
      padding: 34,
      boxShadow: `${SHADOW_FLOAT}${glow ? `, 0 0 ${80 * glow}px rgba(212,245,0,${0.35 * glow})` : ""}`,
      display: "flex",
      gap: 24,
      alignItems: "center",
    }}
  >
    <div style={{ width: 120, height: 120, borderRadius: 999, background: `linear-gradient(150deg, ${WM.lime}, ${WM.limeHot})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SORA, fontWeight: 800, fontSize: 54, color: WM.ink }}>
      M
    </div>
    <div>
      <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 52, color: WM.ink, letterSpacing: "-0.03em" }}>Maria</div>
      <Appear f={subF} dir="up" dist={14}>
        <div style={{ fontFamily: JAKARTA, fontSize: 24, fontWeight: 600, color: WM.muted2 }}>vive de marketing</div>
      </Appear>
    </div>
  </div>
);

/** "Deixa eu te apresentar a Maria. ... Cria conteúdo ... cursos e mentorias ... WhatsApp até tarde"
 *  verbo: APRESENTAR + LISTAR — o card dela entra, a rotina vira uma lista de chips. */
export const S03Maria: React.FC<SceneProps> = ({ m }) => {
  const chips: { f: number; t: string; I: React.FC<{ size?: number }> }[] = [
    { f: m.cria, t: "Cria conteúdo todo dia", I: LuPenLine },
    { f: m.cursos, t: "Vende cursos", I: LuGraduationCap },
    { f: m.mentorias, t: "Vende mentorias", I: LuVideo },
    { f: m.whats, t: "WhatsApp até 23:40", I: LuMessageCircle },
  ];
  return (
    <AbsoluteFill>
      <Appear f={m.maria} dir="scale" style={{ position: "absolute", left: 260, top: 330 }}>
        <MariaCard subF={m.vive} />
      </Appear>
      <div style={{ position: "absolute", left: 1000, top: 250, display: "flex", flexDirection: "column", gap: 18 }}>
        {chips.map((c) => (
          <Appear key={c.t} f={c.f} dir="left" dist={60}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 16, background: "rgba(236,236,231,0.08)", border: "1px solid rgba(236,236,231,0.14)", borderRadius: 999, padding: "16px 28px", color: "#ECECE7", fontFamily: JAKARTA, fontWeight: 700, fontSize: 30 }}>
              <span style={{ color: WM.lime, display: "flex" }}>
                <c.I size={28} />
              </span>
              {c.t}
            </div>
          </Appear>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** "E a rotina dela é um caos."  → PALAVRA ATRÁS "CAOS" (danger), cortada
 *  pela mesa de trabalho dela tremendo de janelas sobrepostas. */
export const S04Caos: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const pops = [
    { x: 40, y: 40, w: 300, t: "Erro de integração" },
    { x: 260, y: 120, w: 280, t: "12 mensagens não lidas" },
    { x: 520, y: 30, w: 320, t: "Pagamento pendente" },
    { x: 120, y: 230, w: 340, t: "Relatório desatualizado" },
    { x: 560, y: 210, w: 260, t: "Boleto vencido" },
  ];
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 470, width: 900, height: 420, borderRadius: 26, background: WM.bg, boxShadow: SHADOW_FLOAT, overflow: "hidden" }}>
        {pops.map((p, i) => {
          const jx = Math.sin((frame + i * 7) * 1.9) * 4;
          const jy = Math.cos((frame + i * 5) * 2.3) * 3;
          return (
            <Appear key={i} f={i * 3} dir="scale" style={{ position: "absolute", left: p.x + jx, top: p.y + jy }}>
              <div style={{ width: p.w, background: WM.card, borderRadius: 14, padding: "14px 16px", boxShadow: "0 12px 30px -10px rgba(0,0,0,0.25)", fontFamily: JAKARTA, fontWeight: 700, fontSize: 18, color: WM.ink, display: "flex", gap: 10, alignItems: "center" }}>
                <LuTriangleAlert color={WM.danger} size={20} /> {p.t}
              </div>
            </Appear>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** "Uma ferramenta pra página. Outra pro e-mail. Outra pro WhatsApp. Outra pro CRM.
 *   Outra pra medir resultado. E mais uma pra hospedagem."
 *  verbo: ACUMULAR — uma janela nova cai a cada ferramenta citada, espalhadas. */
export const S05Stack: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const tools: { k: string; t: string; I: React.FC<{ size?: number; color?: string }>; x: number; y: number; r: number; c: string }[] = [
    { k: "pagina", t: "Construtor de páginas", I: LuLayoutTemplate, x: 170, y: 120, r: -4, c: "#3B82F6" },
    { k: "email", t: "E-mail marketing", I: LuMail, x: 760, y: 90, r: 3, c: "#F59E0B" },
    { k: "whats", t: "WhatsApp", I: LuMessageCircle, x: 1330, y: 150, r: -3, c: "#22C55E" },
    { k: "crm", t: "CRM", I: LuUsers, x: 300, y: 470, r: 4, c: "#8B5CF6" },
    { k: "medir", t: "Métricas", I: LuChartBar, x: 860, y: 460, r: -2, c: "#EC4899" },
    { k: "hosp", t: "Hospedagem", I: LuServer, x: 1380, y: 500, r: 3, c: "#14B8A6" },
  ];
  return (
    <AbsoluteFill>
      {tools.map((tl, i) => {
        const f = m[tl.k];
        const wob = Math.sin((frame - f) / 9 + i) * 1.2;
        return (
          <Appear key={tl.k} f={f} dir="drop" dist={90} style={{ position: "absolute", left: tl.x, top: tl.y, transform: `rotate(${tl.r + wob}deg)` }}>
            <div style={{ width: 400, height: 280, borderRadius: 20, background: WM.card, boxShadow: SHADOW_FLOAT, overflow: "hidden" }}>
              <div style={{ height: 40, background: tl.c, display: "flex", alignItems: "center", gap: 7, padding: "0 14px" }}>
                {[0, 1, 2].map((d) => (
                  <span key={d} style={{ width: 10, height: 10, borderRadius: 9, background: "rgba(255,255,255,0.6)" }} />
                ))}
                <span style={{ marginLeft: 10, color: "#fff", fontFamily: JAKARTA, fontWeight: 700, fontSize: 15 }}>login · senha · mensalidade</span>
              </div>
              <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <tl.I size={34} color={tl.c} />
                  <span style={{ fontFamily: SORA, fontWeight: 700, fontSize: 28, color: WM.ink }}>{tl.t}</span>
                </div>
                {[0.9, 0.7, 0.8].map((w, j) => (
                  <div key={j} style={{ height: 14, width: `${w * 100}%`, borderRadius: 8, background: WM.card2 }} />
                ))}
              </div>
            </div>
          </Appear>
        );
      })}
    </AbsoluteFill>
  );
};

/** "Quinze abas abertas. Quinze horas, todo santo dia."
 *  verbo: CONTAR — o relógio gira e o contador sobe até 15h; a semana inteira acende. */
export const S06Hours: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const h = Math.round(interpolate(frame, [m.horas - 6, m.horas + 22], [0, 15], { ...CLAMP, easing: EASE_OUT }));
  const ang = interpolate(frame, [0, m.horas + 22], [0, 360 * 5], { ...CLAMP, easing: EASE_OUT });
  const days = ["S", "T", "Q", "Q", "S", "S", "D"];
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 150, display: "flex", alignItems: "center", gap: 90 }}>
        <Appear f={0} dir="scale">
          <div style={{ width: 380, height: 380, borderRadius: 999, border: "14px solid rgba(236,236,231,0.14)", position: "relative" }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ position: "absolute", left: 183, top: 8, width: 6, height: 24, borderRadius: 4, background: "rgba(236,236,231,0.35)", transformOrigin: "3px 175px", transform: `rotate(${i * 30}deg)` }} />
            ))}
            <div style={{ position: "absolute", left: 182, top: 60, width: 8, height: 130, borderRadius: 6, background: WM.lime, transformOrigin: "4px 130px", transform: `rotate(${ang}deg)` }} />
            <div style={{ position: "absolute", left: 183, top: 100, width: 6, height: 90, borderRadius: 6, background: "#ECECE7", transformOrigin: "3px 90px", transform: `rotate(${ang / 12}deg)` }} />
            <div style={{ position: "absolute", left: 172, top: 172, width: 28, height: 28, borderRadius: 99, background: WM.lime }} />
          </div>
        </Appear>
        <div>
          <Big size={260} color={WM.white} style={{ fontVariantNumeric: "tabular-nums" }}>
            {h}h
          </Big>
          <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
            {days.map((d, i) => {
              const on = frame >= m.santo + i * 3;
              return (
                <div key={i} style={{ width: 62, height: 62, borderRadius: 16, background: on ? WM.danger : "rgba(236,236,231,0.08)", color: on ? "#fff" : WM.muted, fontFamily: SORA, fontWeight: 700, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${on ? 1 : 0.9})` }}>
                  {d}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** "Toda manhã, cada relatório diz uma coisa. Nenhum número bate."
 *  verbo: DIVERGIR — três relatórios lado a lado com três números diferentes. */
export const S07Reports: React.FC<SceneProps> = ({ m }) => {
  const reps = [
    { t: "Plataforma de pagamento", v: 47 },
    { t: "CRM", v: 39 },
    { t: "Planilha", v: 52 },
  ];
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 130 }}>
        {reps.map((r, i) => {
          const v = Math.round(interpolate(frame, [m.rel + i * 6, m.rel + i * 6 + 18], [0, r.v], { ...CLAMP, easing: EASE_OUT }));
          return (
            <Appear key={r.t} f={m.rel + i * 6} dir="up" dist={60}>
              <div style={{ width: 430, background: WM.card, borderRadius: 24, padding: 34, boxShadow: SHADOW_FLOAT, fontFamily: JAKARTA }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: WM.muted2 }}>{r.t}</div>
                <div style={{ fontSize: 22, fontWeight: 600, color: WM.ink, marginTop: 6 }}>Vendas de ontem</div>
                <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 130, color: frame >= m.nenhum ? WM.danger : WM.ink, letterSpacing: "-0.04em", lineHeight: 1.1 }}>{v}</div>
              </div>
            </Appear>
          );
        })}
      </div>
      {[0, 1].map((i) => (
        <Appear key={i} f={m.nenhum + i * 4} dir="scale" style={{ position: "absolute", top: 340, left: 680 + i * 560 }}>
          <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 92, color: WM.danger }}>≠</div>
        </Appear>
      ))}
    </AbsoluteFill>
  );
};

/** "De madrugada, a integração com o e-mail caiu. E ela só descobriu de manhã,
 *   com cliente reclamando que não recebeu o acesso."
 *  verbo: CAIR / ROMPER — a linha entre pagamento e e-mail estala e quebra. */
export const S08Broken: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const broke = frame >= m.caiu;
  const gap = broke ? interpolate(frame, [m.caiu, m.caiu + 10], [0, 1], { ...CLAMP, easing: EASE_OUT }) : 0;
  const node = (label: string, I: React.FC<{ size?: number; color?: string }>, err: boolean) => (
    <div style={{ width: 300, background: WM.card, borderRadius: 24, padding: "26px 28px", boxShadow: SHADOW_FLOAT, fontFamily: JAKARTA, position: "relative" }}>
      <I size={40} color={WM.ink} />
      <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 30, color: WM.ink, marginTop: 10 }}>{label}</div>
      <div style={{ marginTop: 10 }}>{err ? <Badge text="Erro · desconectado" bg="#FDE2E4" fg={WM.danger} fs={16} /> : <Badge text="Conectado" fs={16} />}</div>
    </div>
  );
  const dots = Array.from({ length: 6 });
  return (
    <AbsoluteFill>
      <Appear f={m.madrugada} dir="down" dist={20} style={{ position: "absolute", top: 110, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, color: "#ECECE7", fontFamily: SORA, fontWeight: 700, fontSize: 54 }}>
          <LuMoon size={46} color={WM.lime} /> 03:12
        </div>
      </Appear>
      <div style={{ position: "absolute", top: 300, left: 230 }}>{node("Pagamento", LuCreditCard, false)}</div>
      <div style={{ position: "absolute", top: 300, left: 1390 }}>{node("E-mail", LuMail, broke)}</div>
      {/* cabo: duas metades que se afastam quando cai */}
      <div style={{ position: "absolute", top: 410, left: 530, width: 860, height: 8 }}>
        <div style={{ position: "absolute", left: 0, width: `${50 - gap * 14}%`, height: 8, borderRadius: 6, background: broke ? WM.danger : WM.lime, transform: `rotate(${gap * 7}deg)`, transformOrigin: "0 50%" }} />
        <div style={{ position: "absolute", right: 0, width: `${50 - gap * 14}%`, height: 8, borderRadius: 6, background: broke ? WM.danger : WM.lime, transform: `rotate(${-gap * 7}deg)`, transformOrigin: "100% 50%" }} />
        {!broke
          ? dots.map((_, i) => {
              const x = ((frame * 14 + i * 150) % 860);
              return <div key={i} style={{ position: "absolute", top: -6, left: x, width: 20, height: 20, borderRadius: 99, background: WM.lime, boxShadow: "0 0 18px rgba(212,245,0,0.8)" }} />;
            })
          : null}
        {broke ? (
          <div style={{ position: "absolute", left: 400, top: -40, opacity: 1 - gap * 0.4 }}>
            <LuTriangleAlert size={80} color={WM.danger} />
          </div>
        ) : null}
      </div>
      {/* de manhã: a reclamação chega */}
      <Appear f={m.manha} dir="up" dist={20} style={{ position: "absolute", top: 600, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ color: WM.muted, fontFamily: SORA, fontWeight: 700, fontSize: 30 }}>08:04</div>
      </Appear>
      <Appear f={m.cliente} dir="up" dist={40} style={{ position: "absolute", top: 660, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ background: "#DCF8C6", color: "#111", borderRadius: "22px 22px 22px 6px", padding: "20px 28px", fontFamily: JAKARTA, fontWeight: 600, fontSize: 30, boxShadow: SHADOW_FLOAT, maxWidth: 820 }}>
          Paguei ontem e até agora não recebi o acesso.
        </div>
      </Appear>
    </AbsoluteFill>
  );
};

/** "E aí vem o pior."  → PALAVRA ATRÁS "O PIOR" (contorno), cortada pelo card de alerta. */
export const S09Pior: React.FC<SceneProps> = () => (
  <AbsoluteFill style={{ alignItems: "center" }}>
    <Appear f={0} dir="up" dist={80} style={{ position: "absolute", top: 520 }}>
      <div style={{ width: 760, height: 320, borderRadius: 30, background: WM.card, boxShadow: SHADOW_FLOAT, display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
        <div style={{ width: 130, height: 130, borderRadius: 999, background: "#FDE2E4", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <LuTriangleAlert size={70} color={WM.danger} />
        </div>
        <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 46, color: WM.ink, lineHeight: 1.1 }}>
          Vendas sendo
          <br />
          perdidas agora
        </div>
      </div>
    </Appear>
  </AbsoluteFill>
);

/** "Um cliente compra o curso dela. Mas o CRM não fica sabendo. Ninguém manda o próximo passo."
 *  verbo: NÃO CHEGAR — a venda sai em direção ao CRM e para no meio do caminho. */
export const S10NoSync: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const travel = interpolate(frame, [m.compra + 8, m.crm], [0, 0.5], { ...CLAMP, easing: EASE_OUT });
  const stuck = frame >= m.crm;
  return (
    <AbsoluteFill>
      <Appear f={m.compra} dir="left" dist={80} style={{ position: "absolute", top: 290, left: 150 }}>
        <div style={{ width: 380, background: WM.card, borderRadius: 24, padding: 28, boxShadow: SHADOW_FLOAT, fontFamily: JAKARTA }}>
          <Badge text="Venda aprovada" fs={16} />
          <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 52, color: WM.ink, marginTop: 14 }}>R$ 497</div>
          <div style={{ fontSize: 20, color: WM.muted2, fontWeight: 600 }}>Curso · Ana Souza</div>
        </div>
      </Appear>
      {/* trilho até o CRM */}
      <div style={{ position: "absolute", top: 400, left: 540, width: 330, height: 6, borderRadius: 4, background: "rgba(236,236,231,0.12)" }}>
        <div style={{ position: "absolute", left: `${travel * 200}%`, top: -12, width: 30, height: 30, borderRadius: 99, background: stuck ? WM.muted : WM.lime, boxShadow: stuck ? "none" : "0 0 20px rgba(212,245,0,0.8)", opacity: frame >= m.compra + 8 ? 1 : 0 }} />
      </div>
      <Appear f={m.compra + 6} dir="up" dist={40} style={{ position: "absolute", top: 270, left: 880 }}>
        <div style={{ width: 400, background: WM.card, borderRadius: 24, padding: 28, boxShadow: SHADOW_FLOAT, fontFamily: JAKARTA }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <LuUsers size={28} />
            <span style={{ fontFamily: SORA, fontWeight: 700, fontSize: 28 }}>CRM</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18 }}>
            <Avatar txt="AS" size={52} bg={WM.card2} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 22 }}>Ana Souza</div>
              <div style={{ fontSize: 18, color: WM.muted2 }}>Novo lead</div>
            </div>
          </div>
          <div style={{ marginTop: 18 }}>{stuck ? <Badge text="Sem atualização" bg={WM.card2} fg={WM.muted3} fs={17} /> : <Badge text="Aguardando…" bg={WM.card2} fg={WM.muted3} fs={17} />}</div>
        </div>
      </Appear>
      <Appear f={m.ninguem} dir="left" dist={50} style={{ position: "absolute", top: 300, left: 1380 }}>
        <div style={{ width: 360, height: 200, borderRadius: 24, border: "4px dashed rgba(236,236,231,0.3)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#ECECE7", fontFamily: JAKARTA }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: WM.muted }}>Próximo passo</div>
          <div style={{ fontFamily: SORA, fontSize: 64, fontWeight: 800, color: WM.muted3 }}>—</div>
        </div>
      </Appear>
      <Stamp f={m.crm + 4} text="não ficou sabendo" color={WM.danger} rot={-5} size={40} style={{ top: 580, left: 850 }} />
    </AbsoluteFill>
  );
};

/** "Outro cliente tem o cartão recusado. E vai embora, em silêncio."
 *  verbo: RECUSAR + IR EMBORA — carimbo no checkout; o cliente sai de cena. */
export const S11Declined: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const leave = prog(frame, m.embora, m.embora + 24);
  return (
    <AbsoluteFill>
      <Appear f={0} dir="up" dist={60} style={{ position: "absolute", top: 200, left: 500 }}>
        <div style={{ width: 560, background: WM.card, borderRadius: 28, padding: 36, boxShadow: SHADOW_FLOAT, fontFamily: JAKARTA, position: "relative" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: WM.muted2 }}>Pagamento</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18, padding: "18px 20px", background: WM.card2, borderRadius: 14 }}>
            <LuCreditCard size={30} />
            <span style={{ fontWeight: 700, fontSize: 24 }}>•••• •••• •••• 4421</span>
          </div>
          <div style={{ marginTop: 22, height: 70, borderRadius: 999, background: WM.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SORA, fontWeight: 700, fontSize: 26 }}>Pagar R$ 497</div>
          <Stamp f={m.recusado} text="Recusado" color={WM.danger} rot={-9} size={70} fill style={{ top: 120, left: 90 }} />
        </div>
      </Appear>
      <div style={{ position: "absolute", top: 300, left: 1180 + leave * 520, opacity: 1 - leave }}>
        <Appear f={4} dir="left" dist={40}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <Avatar txt="RC" size={150} bg={WM.card} />
            <div style={{ color: "#ECECE7", fontFamily: JAKARTA, fontWeight: 700, fontSize: 26 }}>Rafael Costa</div>
          </div>
        </Appear>
      </div>
      <Appear f={m.silencio} dir="scale" style={{ position: "absolute", top: 330, left: 1500 }}>
        <LuVolumeX size={110} color={WM.muted} />
      </Appear>
    </AbsoluteFill>
  );
};

/** "Um Pix expira. Um boleto vence. Um carrinho fica abandonado."
 *  verbo: EXPIRAR — três linhas com estado; cada uma vira vermelha na sua palavra. */
export const S12Expire: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const rows = [
    { k: "pix", I: LuQrCode, t: "Pix · R$ 997", live: "expira em", dead: "Expirado" },
    { k: "boleto", I: LuReceipt, t: "Boleto · R$ 1.497", live: "vence hoje", dead: "Vencido" },
    { k: "carrinho", I: LuShoppingCart, t: "Carrinho · R$ 497", live: "no checkout", dead: "Abandonado" },
  ];
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 190, width: 1100, display: "flex", flexDirection: "column", gap: 26 }}>
        {rows.map((r, i) => {
          const f = m[r.k];
          const dead = frame >= f + 10;
          const timer = Math.max(0, 59 - Math.floor(Math.max(0, frame - f) * 6));
          return (
            <Appear key={r.k} f={i === 0 ? 0 : f - 8} dir="left" dist={60}>
              <div style={{ display: "flex", alignItems: "center", gap: 26, background: WM.card, borderRadius: 24, padding: "26px 34px", boxShadow: SHADOW_FLOAT, fontFamily: JAKARTA, border: dead ? `3px solid ${WM.danger}` : "3px solid transparent" }}>
                <r.I size={44} color={dead ? WM.danger : WM.ink} />
                <span style={{ fontFamily: SORA, fontWeight: 700, fontSize: 38, color: WM.ink, flex: 1 }}>{r.t}</span>
                {dead ? (
                  <Badge text={r.dead} bg="#FDE2E4" fg={WM.danger} fs={26} />
                ) : (
                  <span style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 26, color: WM.warn }}>
                    <LuClock size={26} /> {r.k === "pix" ? `${r.live} 00:${String(timer).padStart(2, "0")}` : r.live}
                  </span>
                )}
              </div>
            </Appear>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** "Talvez você se reconheça na Maria."  — LIMPO (respiro): o card dela,
 *  com o reflexo "você" surgindo embaixo. */
export const S13Mirror: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const r = prog(frame, m.voce, m.voce + 20);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Appear f={0} dir="scale" style={{ position: "absolute", top: 250 }}>
        <MariaCard subF={-10} glow={r} />
      </Appear>
      <div style={{ position: "absolute", top: 560, opacity: r, transform: `translateY(${(1 - r) * 20}px)` }}>
        <Kicker color={WM.lime} style={{ fontSize: 28 }}>
          e você?
        </Kicker>
      </div>
    </AbsoluteFill>
  );
};
