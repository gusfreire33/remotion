import { at } from "./sync";
import type { SceneDef } from "./types";
import * as B from "../scenes/B";

/* ═══════════ MAPA — AGITAÇÃO + VIRADA (61 → 120s) ═══════════
   5.4: "o bloco da ressalva/virada merece o efeito mais forte do vídeo" →
   a tela inteira gira (S19) e 3 palavras-atrás em sequência espaçada. */

const L = 0.06;
const a0 = at("Agora pensa no custo");
const a1 = at("Toda vez que um Pix");
const a2 = at("E no fim do mês");
const a3 = at("E o que acontece");
const a4 = at("O próximo mês");
const v0 = at("Só que aqui vai");
const v1 = at("O problema não é você");
const v2 = at("O problema é a pilha");
const v3 = at("Cada uma enxerga");
const v4 = at("E você vira a ponte");
const v5 = at("O que resolve");
const v6 = at("É uma só tela");
const v7 = at("Um cérebro acima");

export const MAP_B: SceneDef[] = [
  {
    id: "S14-suporte",
    fala: "Agora pensa no custo disso. Toda vez que uma integração quebra, você para de vender pra virar suporte técnico. De graça.",
    verbo: "inverter (vender encolhe, consertar cresce)",
    trat: "OVERLAY",
    from: a0 - L,
    cut: "whip",
    marks: { quebra: at("quebra", a0), suporte: at("suporte técnico", a0), graca: at("De graça", a0) },
    sfx: [["quebra", "glitch", 0.35], ["suporte", "pop", 0.5], ["graca", "impact", 0.7]],
    Comp: B.S14Support,
  },
  {
    id: "S15-mesa",
    fala: "Toda vez que um Pix expira sem ninguém chamar o cliente, é dinheiro deixado na mesa.",
    verbo: "acumular (contador de dinheiro perdido)",
    trat: "OVERLAY",
    from: a1 - L,
    cut: "punch",
    marks: { ninguem: at("sem ninguém", a1), dinheiro: at("dinheiro", a1), mesa: at("na mesa", a1) },
    sfx: [["ninguem", "tick", 0.45], ["dinheiro", "riser", 0.35, -0.45], ["mesa", "ding", 0.5]],
    Comp: B.S15Table,
  },
  {
    id: "S16-faturas",
    fala: "E no fim do mês, chega a conta. Uma cobrança de cada ferramenta.",
    verbo: "chegar em pilha (faturas deslizando)",
    trat: "OVERLAY",
    from: a2 - L,
    cut: "whip",
    marks: { cobranca: at("Uma cobrança", a2) },
    sfx: [["cobranca", "pop", 0.45], ["cobranca", "pop", 0.45, 0.17], ["cobranca", "pop", 0.45, 0.33], ["cobranca", "pop", 0.45, 0.5], ["cobranca", "pop", 0.45, 0.67], ["cobranca", "impact", 0.5, 0.83]],
    Comp: B.S16Bills,
  },
  {
    id: "S17-pergunta",
    fala: "E o que acontece se nada mudar?",
    verbo: "perguntar (campo digitando)",
    trat: "OVERLAY",
    from: a3 - L,
    cut: "punch",
    marks: { que: at("E o que acontece", a3) },
    sfx: [["que", "type", 0.45], ["que", "type", 0.45, 0.33], ["que", "type", 0.45, 0.66], ["que", "type", 0.45, 1.0], ["que", "type", 0.45, 1.25]],
    Comp: B.S17Question,
  },
  {
    id: "S18-igual",
    fala: "O próximo mês vai ser igual a esse. Mais abas. Mais horas. Mais vendas escapando sem você ver.",
    verbo: "repetir (calendário vira) + aumentar",
    trat: "PALAVRA ATRÁS",
    from: a4 - L,
    cut: "punch",
    marks: { proximo: at("próximo mês", a4), igual: at("igual", a4), abas: at("Mais abas", a4), horas: at("Mais horas", a4), vendas: at("Mais vendas", a4) },
    behind: { lines: ["IGUAL"], mark: "igual", dur: 1.4, top: 240, size: 330 },
    sfx: [["proximo", "whoosh", 0.35], ["abas", "tick", 0.5], ["horas", "tick", 0.5], ["vendas", "impact", 0.55]],
    Comp: B.S18Same,
  },
  {
    id: "S19-virada",
    fala: "Só que aqui vai a virada.",
    verbo: "virar (a tela gira 180°)",
    trat: "OVERLAY",
    from: v0 - L,
    cut: "whip",
    marks: { virada: at("virada", v0) },
    sfx: [["virada", "riser", 0.45, -0.7], ["virada", "swoosh", 0.6], ["virada", "boom", 0.85, 0.2]],
    Comp: B.S19Flip,
  },
  {
    id: "S20-nao-e-voce",
    fala: "O problema não é você. Não é falta de esforço. E não é o seu produto.",
    verbo: "descartar (3 suspeitos riscados)",
    trat: "OVERLAY",
    from: v1 - L,
    cut: "punch",
    marks: { voce: at("você", v1), esforco: at("esforço", v1), produto: at("produto", v1) },
    sfx: [["voce", "impact", 0.45, 0.2], ["esforco", "impact", 0.45, 0.2], ["produto", "impact", 0.45, 0.2]],
    Comp: B.S20NotYou,
  },
  {
    id: "S21-pilha",
    fala: "O problema é a pilha de ferramentas que não conversa entre si.",
    verbo: "empilhar e balançar",
    trat: "PALAVRA ATRÁS",
    from: v2 - L,
    cut: "whip",
    marks: { pilha: at("pilha", v2), conversa: at("não conversa", v2) },
    behind: { lines: ["PILHA"], mark: "pilha", dur: 1.6, top: 150, size: 340 },
    sfx: [["pilha", "impact", 0.6], ["conversa", "pop", 0.4], ["conversa", "pop", 0.4, 0.2]],
    Comp: B.S21Pile,
  },
  {
    id: "S22-pedacos",
    fala: "Cada uma enxerga só um pedaço do seu cliente. A página não sabe quem comprou. O e-mail não sabe quem pagou. O WhatsApp não sabe quem abandonou o carrinho.",
    verbo: "fragmentar (o cliente em 3 fatias)",
    trat: "OVERLAY",
    from: v3 - L,
    cut: "punch",
    marks: { pedaco: at("pedaço", v3), pagina: at("A página", v3), email: at("O e-mail", v3), whats: at("O WhatsApp", v3) },
    sfx: [["pedaco", "glitch", 0.45], ["pedaco", "swoosh", 0.4, 0.1], ["pagina", "pop", 0.5], ["email", "pop", 0.5], ["whats", "pop", 0.5]],
    Comp: B.S22Pieces,
  },
  {
    id: "S23-ponte",
    fala: "E você vira a ponte entre todas elas. Na mão.",
    verbo: "ligar na mão (cursor puxando cabos)",
    trat: "OVERLAY",
    from: v4 - L,
    cut: "whip",
    marks: { ponte: at("ponte", v4), mao: at("Na mão", v4) },
    sfx: [["ponte", "click", 0.5, 0.47], ["ponte", "click", 0.5, 1.0], ["ponte", "click", 0.5, 1.53], ["mao", "impact", 0.6]],
    Comp: B.S23Bridge,
  },
  {
    id: "S24-nao-mais-uma",
    fala: "O que resolve não é mais uma ferramenta.",
    verbo: "barrar (o +1 é rebatido)",
    trat: "OVERLAY",
    from: v5 - L,
    cut: "punch",
    marks: { mais: at("mais uma", v5) },
    sfx: [["mais", "impact", 0.7, 0.13]],
    Comp: B.S24NotMore,
  },
  {
    id: "S25-uma-tela",
    fala: "É uma só tela, onde tudo conversa.",
    verbo: "convergir (6 ferramentas viram 1 janela)",
    trat: "PALAVRA ATRÁS",
    from: v6 - L,
    cut: "whip",
    marks: { tela: at("tela", v6), conversa: at("tudo conversa", v6) },
    behind: { lines: ["UMA SÓ", "TELA"], mark: "tela", dur: 1.8, tone: "lime", top: 130, size: 230 },
    sfx: [["tela", "boom", 0.75], ["conversa", "ding", 0.45]],
    Comp: B.S25OneScreen,
  },
  {
    id: "S26-cerebro",
    fala: "Um cérebro acima do seu checkout, que lê cada venda e decide o próximo passo sozinho.",
    verbo: "ler e decidir (pulsos sobem, passo dispara)",
    trat: "OVERLAY",
    from: v7 - L,
    cut: "punch",
    marks: { checkout: at("checkout", v7), le: at("lê cada venda", v7), passo: at("decide o próximo passo", v7), sozinho: at("sozinho", v7) },
    sfx: [["checkout", "tick", 0.45], ["checkout", "tick", 0.45, 0.13], ["checkout", "tick", 0.45, 0.27], ["checkout", "tick", 0.45, 0.4], ["passo", "whoosh", 0.4], ["sozinho", "ding", 0.55]],
    Comp: B.S26Brain,
  },
];
