import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  LuLayoutDashboard,
  LuRotateCcw,
  LuBot,
  LuCreditCard,
  LuPlug,
  LuBadgeDollarSign,
  LuArrowDown,
} from "react-icons/lu";
import type { SceneProps } from "../lib/types";
import { JAKARTA, SORA, WM, SHADOW_FLOAT } from "../lib/theme";
import { Appear, Big, Kicker, DrawX, DrawCheck, Stamp } from "../components/fx";
import { AppWindow, Badge, Card, CLAMP, Cursor, EASE_IO, EASE_OUT, LimePill, prog, brl, Wordmark } from "../components/ui";

/* ═════════════════════════ OFERTA ═════════════════════════ */

const ITEMS = [
  { k: "construtor", t: "Construtor de páginas", v: 297 },
  { k: "email", t: "E-mail marketing", v: 340 },
  { k: "whats", t: "API de WhatsApp", v: 380 },
  { k: "crm", t: "CRM", v: 420 },
  { k: "rastreio", t: "Rastreamento", v: 290 },
  { k: "hosp", t: "Hospedagem e domínio", v: 180 },
];

/** "Agora faz a conta comigo. Construtor de páginas, 297. ... Total: 1.907 reais por mês."
 *  verbo: SOMAR — o recibo cresce linha a linha e o total corre junto. */
export const S41Receipt: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  let sum = 0;
  for (const it of ITEMS) {
    sum += it.v * prog(frame, m[it.k] + 6, m[it.k] + 18);
  }
  const total = frame >= m.total;
  return (
    <AbsoluteFill>
      <Appear f={0} dir="up" dist={60} style={{ position: "absolute", left: 260, top: 70 }}>
        <div style={{ width: 760, background: "#FBFBF7", borderRadius: "26px 26px 0 0", padding: "34px 44px 30px", boxShadow: SHADOW_FLOAT, fontFamily: JAKARTA, position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <span style={{ fontFamily: SORA, fontWeight: 800, fontSize: 30 }}>Suas ferramentas hoje</span>
            <span style={{ fontWeight: 800, fontSize: 16, color: WM.muted2, letterSpacing: "0.1em" }}>POR MÊS</span>
          </div>
          {ITEMS.map((it) => (
            <Appear key={it.k} f={m[it.k]} dir="left" dist={40}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "15px 0", borderBottom: `2px dashed ${WM.line}`, fontSize: 27, fontWeight: 700 }}>
                <span>{it.t}</span>
                <span style={{ fontFamily: SORA }}>{brl(it.v)}</span>
              </div>
            </Appear>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 18 }}>
            <span style={{ fontFamily: SORA, fontWeight: 800, fontSize: 32 }}>Total</span>
            <span style={{ fontFamily: SORA, fontWeight: 800, fontSize: total ? 64 : 44, color: total ? WM.danger : WM.ink, fontVariantNumeric: "tabular-nums" }}>{brl(Math.round(sum))}</span>
          </div>
          {/* serrilha do recibo */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: -18, height: 18, background: "linear-gradient(-45deg, transparent 12px, #FBFBF7 0), linear-gradient(45deg, transparent 12px, #FBFBF7 0)", backgroundSize: "24px 24px", backgroundPosition: "left bottom" }} />
        </div>
      </Appear>
      <Appear f={m.total} dir="scale" style={{ position: "absolute", left: 1140, top: 300 }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 30, color: WM.muted }}>você paga</div>
        <Big size={150} color="#FF4D57">R$ 1.907</Big>
        <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 40, color: "#ECECE7" }}>por mês · 6 boletos</div>
      </Appear>
    </AbsoluteFill>
  );
};

/** "O Wonne Max começa em duzentos e noventa e sete reais por mês."
 *  verbo: VENCER (split/versus) — R$ 1.907 encolhe e é riscado; o lima cresce. */
export const S42Versus: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const win = spring({ frame: frame - m.preco, fps, config: { damping: 14, stiffness: 140 } });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 200, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 60 }}>
        <div style={{ width: 560, height: 480, borderRadius: 36, background: "rgba(236,236,231,0.06)", border: "1px solid rgba(236,236,231,0.14)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.14 * win})`, opacity: 1 - 0.45 * win, position: "relative" }}>
          <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 30, color: WM.muted }}>6 ferramentas</div>
          <Big size={120} color="#ECECE7">R$ 1.907</Big>
          <div style={{ position: "absolute", left: 60, right: 60, top: 236, height: 12, borderRadius: 8, background: "#FF4D57", transform: `scaleX(${prog(frame, m.preco + 4, m.preco + 12)})`, transformOrigin: "0 50%" }} />
        </div>
        <div style={{ width: 640, height: 540, borderRadius: 40, background: WM.lime, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${0.8 + 0.2 * win})`, opacity: Math.min(1, frame / 6), boxShadow: `0 0 ${120 * win}px rgba(212,245,0,0.45)` }}>
          <Wordmark size={46} color={WM.ink} dot={WM.ink} />
          <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 30, color: WM.ink, marginTop: 20 }}>a partir de</div>
          <Big size={170} color={WM.ink}>R$ 297</Big>
          <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 36, color: WM.ink }}>por mês · tudo junto</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** "São mil seiscentos e dez reais de diferença, todo mês. Em um ano, dezenove mil trezentos
 *   e vinte reais pagos a ferramentas que não conversam entre si."
 *  verbo: ACUMULAR NO TEMPO — 12 meses acendem e o contador sobe até R$ 19.320. */
export const S43Year: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const lit = Math.floor(interpolate(frame, [m.ano, m.dezenove + 4], [0, 12], CLAMP));
  const v = frame < m.ano ? 1610 : interpolate(frame, [m.ano, m.dezenove + 4], [1610, 19320], { ...CLAMP, easing: EASE_OUT });
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Appear f={0} dir="up" dist={30} style={{ position: "absolute", top: 130 }}>
        <Kicker style={{ fontSize: 26 }}>{frame >= m.ano ? "jogados fora em um ano" : "de diferença, todo mês"}</Kicker>
      </Appear>
      <div style={{ position: "absolute", top: 200 }}>
        <Big size={230} color={frame >= m.ano ? "#FF4D57" : WM.white} style={{ fontVariantNumeric: "tabular-nums", textAlign: "center" }}>
          {brl(Math.round(v))}
        </Big>
      </div>
      <div style={{ position: "absolute", top: 520, display: "flex", gap: 16 }}>
        {months.map((mo, i) => (
          <div key={mo} style={{ width: 96, height: 120, borderRadius: 18, background: i < lit ? "#FF4D57" : "rgba(236,236,231,0.07)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, color: i < lit ? "#fff" : WM.muted, fontFamily: JAKARTA, fontWeight: 800, fontSize: 20, transform: `scale(${i === lit - 1 ? 1.08 : 1})` }}>
            {mo}
            <span style={{ fontSize: 14, fontWeight: 700 }}>−1.610</span>
          </div>
        ))}
      </div>
      <Appear f={m.conversam} dir="up" dist={20} style={{ position: "absolute", top: 690 }}>
        <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 38, color: "#ECECE7" }}>pagos a ferramentas que não conversam</div>
      </Appear>
    </AbsoluteFill>
  );
};

/** "Você recebe três coisas. A plataforma completa, com funis, páginas, mensagens, CRM e
 *   área de membros. A automação que recupera o dinheiro deixado na mesa. E a inteligência
 *   artificial que atende por você."  verbo: ENTREGAR — 3 caixas entram uma a uma. */
export const S44Three: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const chips = [
    { k: "funis", t: "Funis" },
    { k: "paginas", t: "Páginas" },
    { k: "mensagens", t: "Mensagens" },
    { k: "crm", t: "CRM" },
    { k: "membros", t: "Área de membros" },
  ];
  const cards = [
    { k: "plataforma", n: "1", t: "A plataforma completa", I: LuLayoutDashboard },
    { k: "automacao", n: "2", t: "A automação que recupera", I: LuRotateCcw },
    { k: "ia", n: "3", t: "A IA que atende por você", I: LuBot },
  ];
  return (
    <AbsoluteFill>
      <Appear f={0} dir="up" dist={20} style={{ position: "absolute", top: 90, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Kicker style={{ fontSize: 26 }}>você recebe</Kicker>
      </Appear>
      <div style={{ position: "absolute", top: 160, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 36 }}>
        {cards.map((c, i) => (
          <Appear key={c.k} f={m[c.k] - 3} dir="up" dist={70}>
            <div style={{ width: 500, height: 600, borderRadius: 34, background: i === 0 ? WM.lime : WM.card, padding: 40, boxShadow: SHADOW_FLOAT, display: "flex", flexDirection: "column", fontFamily: JAKARTA }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ width: 96, height: 96, borderRadius: 999, background: WM.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <c.I size={46} color={WM.lime} />
                </div>
                <span style={{ fontFamily: SORA, fontWeight: 800, fontSize: 90, color: i === 0 ? "rgba(21,22,15,0.25)" : WM.line2 }}>{c.n}</span>
              </div>
              <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 46, color: WM.ink, marginTop: 34, lineHeight: 1.08, letterSpacing: "-0.02em" }}>{c.t}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 26 }}>
                {i === 0
                  ? chips.map((ch) => (
                      <Appear key={ch.k} f={m[ch.k]} dir="scale">
                        <div style={{ background: WM.ink, color: WM.white, borderRadius: 999, padding: "10px 18px", fontWeight: 700, fontSize: 20 }}>{ch.t}</div>
                      </Appear>
                    ))
                  : null}
                {i === 1 ? (
                  <div style={{ fontSize: 24, fontWeight: 600, color: WM.muted3 }}>
                    Carrinho, cartão recusado, Pix e boleto viram mensagem automática.
                    {frame >= m.mesa ? (
                      <div style={{ marginTop: 18 }}>
                        <Badge text="dinheiro de volta pra mesa" fs={19} />
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {i === 2 ? <div style={{ fontSize: 24, fontWeight: 600, color: WM.muted3 }}>Agente de IA no WhatsApp e no Instagram, e o Chat Max respondendo com os seus números.</div> : null}
              </div>
            </div>
          </Appear>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** "E cinco motivos pra trocar. Uma só tela. Um único login. Uma única assinatura.
 *   Nenhuma taxa por venda. E uma verdade só sobre as suas vendas, em tempo real."
 *  verbo: CUMPRIR (lista com estado) — cada motivo é marcado na sua frase. */
export const S45Five: React.FC<SceneProps> = ({ m }) => {
  const items = [
    { k: "tela", t: "Uma só tela" },
    { k: "login", t: "Um único login" },
    { k: "assinatura", t: "Uma única assinatura" },
    { k: "taxa", t: "Nenhuma taxa por venda" },
    { k: "verdade", t: "Uma verdade só, em tempo real" },
  ];
  return (
    <AbsoluteFill>
      <Appear f={0} dir="up" dist={20} style={{ position: "absolute", top: 90, left: 360 }}>
        <Kicker style={{ fontSize: 26 }}>5 motivos pra trocar</Kicker>
      </Appear>
      <div style={{ position: "absolute", top: 160, left: 360, display: "flex", flexDirection: "column", gap: 16 }}>
        {items.map((it, i) => (
          <Appear key={it.k} f={m[it.k] - 3} dir="left" dist={60}>
            <div style={{ width: 1200, display: "flex", alignItems: "center", gap: 30, background: WM.card, borderRadius: 24, padding: "20px 30px", boxShadow: SHADOW_FLOAT }}>
              <div style={{ width: 70, height: 70, borderRadius: 999, background: WM.lime, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <DrawCheck f={m[it.k] + 2} size={42} color={WM.ink} stroke={6} />
              </div>
              <span style={{ fontFamily: SORA, fontWeight: 800, fontSize: 52, color: WM.ink, letterSpacing: "-0.02em" }}>{it.t}</span>
              <span style={{ marginLeft: "auto", fontFamily: SORA, fontWeight: 800, fontSize: 40, color: WM.line2 }}>0{i + 1}</span>
            </div>
          </Appear>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** "Tem o Starter, o Pro, que é o mais escolhido, e o Teams. No anual, você economiza
 *   quatrocentos reais por ano."  verbo: ESCOLHER — 3 planos entram; o toggle vira pro anual. */
export const S46Plans: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const anual = frame >= m.anual;
  const knob = prog(frame, m.anual, m.anual + 8, EASE_IO);
  const plans = [
    { k: "starter", t: "Starter", v: 297, d: "1 projeto · 5.000 contatos" },
    { k: "pro", t: "Pro", v: 597, d: "5 projetos · automações avançadas", hot: true },
    { k: "teams", t: "Teams", v: 997, d: "ilimitado · multi-projeto" },
  ];
  return (
    <AbsoluteFill>
      <Appear f={0} dir="down" dist={20} style={{ position: "absolute", top: 70, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
        <span style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 26, color: anual ? WM.muted : "#ECECE7" }}>Mensal</span>
        <div style={{ width: 92, height: 50, borderRadius: 999, background: anual ? WM.lime : "rgba(236,236,231,0.18)", position: "relative" }}>
          <div style={{ position: "absolute", top: 5, left: 5 + knob * 42, width: 40, height: 40, borderRadius: 99, background: anual ? WM.ink : "#ECECE7" }} />
        </div>
        <span style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 26, color: anual ? "#ECECE7" : WM.muted }}>Anual</span>
        {frame >= m.economiza ? (
          <Appear f={m.economiza} dir="scale">
            <Badge text="economize R$ 400/ano" fs={22} />
          </Appear>
        ) : null}
      </Appear>
      <div style={{ position: "absolute", top: 190, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 36, alignItems: "flex-end" }}>
        {plans.map((p) => (
          <Appear key={p.k} f={m[p.k] - 2} dir="up" dist={70}>
            <div style={{ width: 460, height: p.hot ? 600 : 540, borderRadius: 34, background: p.hot ? WM.lime : WM.card, padding: 40, boxShadow: p.hot ? "0 0 90px rgba(212,245,0,0.35)" : SHADOW_FLOAT, fontFamily: JAKARTA, position: "relative" }}>
              {p.hot ? (
                <div style={{ position: "absolute", top: -22, left: 40 }}>
                  <Badge text="Mais escolhido" bg={WM.ink} fg={WM.lime} fs={20} />
                </div>
              ) : null}
              <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 48, color: WM.ink }}>{p.t}</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: p.hot ? WM.ink2 : WM.muted2, marginTop: 8 }}>{p.d}</div>
              <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 96, color: WM.ink, marginTop: 40, letterSpacing: "-0.04em" }}>R$ {p.v}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: p.hot ? WM.ink2 : WM.muted2 }}>por mês</div>
              <div style={{ position: "absolute", left: 40, right: 40, bottom: 40, height: 66, borderRadius: 999, background: WM.ink, color: WM.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SORA, fontWeight: 700, fontSize: 24 }}>Começar</div>
            </div>
          </Appear>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ═════════════════════════ RISCO + CTA ═════════════════════════ */

/** "E você não precisa arriscar nada. Existe um plano grátis. Sem cartão de crédito."
 *  PALAVRA ATRÁS "GRÁTIS" (lima) cortada pelo card do plano Free; o cartão é riscado. */
export const S47Free: React.FC<SceneProps> = ({ m }) => (
  <AbsoluteFill style={{ alignItems: "center" }}>
    <Appear f={m.plano - 4} dir="up" dist={70} style={{ position: "absolute", top: 470 }}>
      <div style={{ width: 900, height: 380, borderRadius: 36, background: WM.card, boxShadow: SHADOW_FLOAT, padding: 44, display: "flex", alignItems: "center", gap: 50, fontFamily: JAKARTA }}>
        <div>
          <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 46, color: WM.ink }}>Plano Free</div>
          <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 130, color: WM.ink, letterSpacing: "-0.05em", lineHeight: 1 }}>R$ 0</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: WM.muted2, marginTop: 8 }}>1 projeto · 500 contatos</div>
        </div>
        <div style={{ marginLeft: "auto", position: "relative", width: 230, height: 160 }}>
          <Appear f={m.cartao - 2} dir="scale">
            <div style={{ width: 230, height: 150, borderRadius: 20, background: WM.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LuCreditCard size={80} color={WM.muted} />
            </div>
          </Appear>
          <div style={{ position: "absolute", top: 5, left: 45 }}>
            <DrawX f={m.cartao + 6} size={140} color={WM.danger} stroke={20} />
          </div>
        </div>
      </div>
    </Appear>
  </AbsoluteFill>
);

/** "Você não precisa desligar nada no primeiro dia: conecta a plataforma onde já vende,
 *   e vê suas vendas chegando na tela."  verbo: LIGAR (toggle) + CHEGAR (vendas caindo). */
export const S48Connect: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const on = prog(frame, m.conecta, m.conecta + 8, EASE_IO);
  const sales = [497, 1997, 297, 697, 97];
  const count = sales.filter((_, i) => frame >= m.chegando + i * 7).length;
  const total = sales.slice(0, count).reduce((a, b) => a + b, 0);
  return (
    <AbsoluteFill>
      <Appear f={0} dir="right" dist={60} style={{ position: "absolute", left: 200, top: 200 }}>
        <Card pad={36} style={{ width: 640 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: WM.muted2, letterSpacing: "0.08em" }}>PRIMEIROS PASSOS</div>
          <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 36, marginTop: 10 }}>Conecte a plataforma de pagamento</div>
          {["Hotmart", "Kiwify"].map((p, i) => (
            <div key={p} style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 22, padding: "18px 22px", borderRadius: 16, background: WM.card2 }}>
              <LuPlug size={28} />
              <span style={{ fontWeight: 800, fontSize: 26, flex: 1 }}>{p}</span>
              <div style={{ width: 84, height: 46, borderRadius: 999, background: i === 0 && on > 0.5 ? WM.lime : WM.line2, position: "relative" }}>
                <div style={{ position: "absolute", top: 5, left: 5 + (i === 0 ? on : 0) * 38, width: 36, height: 36, borderRadius: 99, background: WM.ink }} />
              </div>
            </div>
          ))}
          {on >= 1 ? (
            <div style={{ marginTop: 18 }}>
              <Badge text="Conectado · nada foi desligado" fs={18} />
            </div>
          ) : null}
        </Card>
      </Appear>
      <Appear f={m.chegando - 6} dir="left" dist={60} style={{ position: "absolute", left: 1000, top: 140 }}>
        <Card pad={30} style={{ width: 700 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: SORA, fontWeight: 700, fontSize: 28 }}>Vendas hoje</span>
            <Badge text="● ao vivo" fs={16} />
          </div>
          <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 90, marginTop: 8, letterSpacing: "-0.04em" }}>{brl(total)}</div>
          {sales.slice(0, count).map((v, i) => (
            <Appear key={i} f={m.chegando + i * 7} dir="down" dist={30}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderTop: `1px solid ${WM.line}`, fontSize: 21, fontWeight: 700 }}>
                <LuBadgeDollarSign size={24} color={WM.limeDark} /> Venda aprovada
                <span style={{ marginLeft: "auto", fontFamily: SORA }}>{brl(v)}</span>
              </div>
            </Appear>
          ))}
        </Card>
      </Appear>
    </AbsoluteFill>
  );
};

/** "Gostou? Muda de plano. Não gostou? Cancela pelo painel. Sem fidelidade."
 *  verbo: DECIDIR (cursor clica) — os dois caminhos estão a um clique; carimbo "sem fidelidade". */
export const S49Cancel: React.FC<SceneProps> = ({ m }) => {
  const path = [
    { f: 0, x: 1100, y: 760 },
    { f: m.muda, x: 640, y: 560, click: true },
    { f: m.cancela, x: 1260, y: 560, click: true },
    { f: m.cancela + 30, x: 1300, y: 640 },
  ];
  return (
    <AbsoluteFill>
      <Appear f={0} dir="up" dist={60} style={{ position: "absolute", left: 360, top: 180 }}>
        <div style={{ width: 1200, background: WM.card, borderRadius: 34, padding: 46, boxShadow: SHADOW_FLOAT, fontFamily: JAKARTA }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: WM.muted2, letterSpacing: "0.08em" }}>CONFIGURAÇÕES · PLANO E COBRANÇA</div>
          <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 52, marginTop: 10 }}>Seu plano: Free</div>
          <div style={{ display: "flex", gap: 30, marginTop: 50 }}>
            <div style={{ flex: 1, height: 110, borderRadius: 999, background: WM.lime, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SORA, fontWeight: 800, fontSize: 34, color: WM.ink }}>Gostou? Mudar de plano</div>
            <div style={{ flex: 1, height: 110, borderRadius: 999, background: WM.card2, border: `2px solid ${WM.line2}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SORA, fontWeight: 700, fontSize: 34, color: WM.ink2 }}>Cancelar pelo painel</div>
          </div>
        </div>
      </Appear>
      <Stamp f={m.fidelidade} text="sem fidelidade" color={WM.lime} rot={-6} size={76} fill ink={WM.ink} style={{ top: 640, left: 640 }} />
      <Cursor path={path} />
    </AbsoluteFill>
  );
};

/** "Clica no botão aqui embaixo. Começar agora, é grátis."
 *  verbo: APONTAR + CLICAR — o botão lima pulsa; a seta desce pro botão da página. */
export const S50Cta: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const pulse = ((frame - m.comecar) % 30) / 30;
  const bob = Math.sin(frame / 5) * 14;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Appear f={0} dir="scale" style={{ position: "absolute", top: 260 }}>
        <div style={{ transform: `scale(1.9)`, transformOrigin: "50% 0" }}>
          <LimePill label="Começar agora — é grátis" h={70} fs={26} pulse={frame >= m.comecar ? pulse : 0} />
        </div>
      </Appear>
      <Appear f={m.embaixo - 4} dir="down" dist={30} style={{ position: "absolute", top: 560 + bob }}>
        <LuArrowDown size={150} color={WM.lime} strokeWidth={2.4} />
      </Appear>
      <Appear f={m.embaixo} dir="up" dist={20} style={{ position: "absolute", top: 760 }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 30, color: "#ECECE7", letterSpacing: "0.04em" }}>plano grátis · sem cartão · sem fidelidade</div>
      </Appear>
    </AbsoluteFill>
  );
};

/* ═════════════════════════ FECHAMENTO ═════════════════════════ */

/** "Lembra da Maria? Das quinze abas, das vendas escapando em silêncio?"
 *  verbo: LEMBRAR — o caos volta, desbotado (flashback). */
export const S51Recall: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const tabs = Math.min(15, Math.max(0, Math.floor((frame - m.abas) / 2) + 1));
  return (
    <AbsoluteFill style={{ filter: "grayscale(0.85) brightness(0.8)" }}>
      <Appear f={0} dir="scale" style={{ position: "absolute", left: 300, top: 230 }}>
        <div style={{ width: 460, background: WM.card, borderRadius: 28, padding: 30, display: "flex", gap: 22, alignItems: "center", boxShadow: SHADOW_FLOAT }}>
          <div style={{ width: 100, height: 100, borderRadius: 999, background: WM.lime, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SORA, fontWeight: 800, fontSize: 46 }}>M</div>
          <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 48 }}>Maria</div>
        </div>
      </Appear>
      <div style={{ position: "absolute", left: 860, top: 230, width: 760, height: 46, display: "flex", gap: 3 }}>
        {Array.from({ length: frame >= m.abas ? tabs : 0 }).map((_, i) => (
          <div key={i} style={{ flex: 1, background: "#DCDCD4", borderRadius: "10px 10px 0 0" }} />
        ))}
      </div>
      <Appear f={m.escapando} dir="up" dist={30} style={{ position: "absolute", left: 860, top: 330 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 600, marginBottom: 14, background: "rgba(246,246,242,0.9)", borderRadius: 20, padding: "16px 20px", fontFamily: JAKARTA, fontWeight: 700, fontSize: 22, opacity: 1 - prog(frame, m.silencio + i * 4, m.silencio + i * 4 + 16) * 0.9, transform: `translateX(${prog(frame, m.silencio + i * 4, m.silencio + i * 4 + 16) * 200}px)` }}>
            Venda aprovada · {["R$ 1.997", "R$ 497", "R$ 997"][i]}
          </div>
        ))}
      </Appear>
    </AbsoluteFill>
  );
};

/** "Ela não precisava trabalhar mais. Precisava de tudo conversando numa tela só."
 *  verbo: RECOLHER — as 15 abas se fecham numa só: a do Wonne Max (a cor volta). */
export const S52Collapse: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const t = prog(frame, m.tudo, m.tudo + 18, EASE_IO);
  const n = Math.max(1, Math.round(15 - 14 * t));
  const sat = prog(frame, m.tela, m.tela + 12);
  return (
    <AbsoluteFill style={{ alignItems: "center", filter: `grayscale(${0.85 * (1 - sat)})` }}>
      <div style={{ position: "absolute", top: 120 }}>
        <Appear f={0} dir="up" dist={40}>
          <AppWindow w={1300} h={700} active="visao">
            <div style={{ position: "absolute", left: 28, right: 28, top: 22, height: 40, display: "flex", gap: 3 }}>
              {Array.from({ length: n }).map((_, i) => (
                <div key={i} style={{ flex: n === 1 ? "0 0 260px" : 1, background: n === 1 ? WM.ink : "#DCDCD4", borderRadius: "10px 10px 0 0", color: WM.lime, fontFamily: SORA, fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", padding: "0 14px" }}>{n === 1 ? "wonne max" : ""}</div>
              ))}
            </div>
            <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 32, marginTop: 56, letterSpacing: "-0.02em" }}>{sat > 0.5 ? "Tudo numa tela só" : "Visão geral"}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 18 }}>
              {["Funis", "Páginas", "Mensagens", "CRM", "Recuperação", "Agente de IA"].map((x, i) => (
                <Appear key={x} f={m.tela + i * 3} dir="up" dist={20}>
                  <Card pad={20} style={{ height: 150 }}>
                    <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 28 }}>{x}</div>
                    <div style={{ marginTop: 14 }}>
                      <Badge text="conversando" fs={15} />
                    </div>
                  </Card>
                </Appear>
              ))}
            </div>
          </AppWindow>
        </Appear>
      </div>
    </AbsoluteFill>
  );
};

/** "Você também."  PALAVRA ATRÁS "VOCÊ" cortada pelo card "seu negócio". */
export const S53You: React.FC<SceneProps> = () => (
  <AbsoluteFill style={{ alignItems: "center" }}>
    <Appear f={0} dir="up" dist={60} style={{ position: "absolute", top: 520 }}>
      <div style={{ width: 820, height: 300, borderRadius: 34, background: WM.card, boxShadow: SHADOW_FLOAT, display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
        <Wordmark size={64} />
        <span style={{ fontFamily: SORA, fontWeight: 700, fontSize: 40, color: WM.muted2 }}>+ o seu negócio</span>
      </div>
    </Appear>
  </AbsoluteFill>
);

/** "Pare de vender no caos. Troque as quinze ferramentas por uma só."
 *  verbo: TROCAR — 15 é riscado e vira 1. */
export const S54Swap: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const one = spring({ frame: frame - m.uma, fps, config: { damping: 12, stiffness: 170 } });
  return (
    <AbsoluteFill>
      <Appear f={m.pare - 2} dir="up" dist={30} style={{ position: "absolute", top: 110, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Big size={92} color="#ECECE7">Pare de vender no caos.</Big>
      </Appear>
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 90 }}>
        <Appear f={m.quinze - 2} dir="scale">
          <div style={{ position: "relative", textAlign: "center", opacity: 1 - 0.5 * one }}>
            <Big size={300} color="#ECECE7">15</Big>
            <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 32, color: WM.muted }}>ferramentas</div>
            <div style={{ position: "absolute", top: 60, left: 30 }}>
              <DrawX f={m.uma - 4} size={260} color="#FF4D57" stroke={22} />
            </div>
          </div>
        </Appear>
        <div style={{ textAlign: "center", transform: `scale(${one})`, opacity: Math.min(1, one * 2) }}>
          <Big size={300} color={WM.lime}>1</Big>
          <Wordmark size={40} color={WM.white} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** "Clica no botão. Começar agora, é grátis."  — cartela final, segura até o fim. */
export const S55End: React.FC<SceneProps> = ({ m }) => {
  const frame = useCurrentFrame();
  const pulse = frame >= m.comecar ? ((frame - m.comecar) % 30) / 30 : 0;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ marginTop: -110, display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
        <Appear f={0} dir="down" dist={30}>
          <Wordmark size={130} color={WM.white} />
        </Appear>
        <Appear f={m.comecar - 4} dir="scale">
          <div style={{ transform: "scale(1.5)" }}>
            <LimePill label="Começar agora — é grátis" h={74} fs={28} pulse={pulse} />
          </div>
        </Appear>
        <Appear f={m.comecar + 8} dir="up" dist={20}>
          <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 28, color: WM.muted, letterSpacing: "0.04em" }}>app.wonnedigital.com.br</div>
        </Appear>
      </div>
    </AbsoluteFill>
  );
};

