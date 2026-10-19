import { at } from "./sync";
import type { SceneDef } from "./types";
import * as D from "../scenes/D";

/* ═══════════ MAPA — OFERTA + RISCO + CTA + FECHAMENTO (222 → fim) ═══════════
   Oferta HORMOZI: stack lido item a item, total dito ANTES do preço; Kinchu:
   3 componentes + 5 motivos + CTA simples. */

const L = 0.06;
const o0 = at("Agora faz a conta");
const o1 = at("O Wonne Max começa");
const o2 = at("São mil seiscentos");
const o3 = at("Você recebe três");
const o4 = at("E cinco motivos");
const o5 = at("Tem o Starter");
const k0 = at("E você não precisa arriscar");
const k1 = at("Você não precisa desligar");
const k2 = at("Gostou?");
const k3 = at("Clica no botão aqui");
const f0 = at("Lembra da Maria");
const f1 = at("Ela não precisava");
const f2 = at("Você também");
const f3 = at("Pare de vender");
const f4 = at("Clica no botão", f3);

export const MAP_D: SceneDef[] = [
  {
    id: "S41-recibo",
    fala: "Agora faz a conta comigo. Construtor de páginas, 297 ... Hospedagem e domínio, 180. Total: mil novecentos e sete reais por mês.",
    verbo: "somar (recibo linha a linha)",
    trat: "OVERLAY",
    from: o0 - L,
    cut: "whip",
    marks: {
      construtor: at("Construtor", o0),
      email: at("E-mail marketing", o0),
      whats: at("API de WhatsApp", o0),
      crm: at("CRM", o0),
      rastreio: at("Rastreamento", o0),
      hosp: at("Hospedagem", o0),
      total: at("Total", o0),
    },
    sfx: [["construtor", "tick", 0.55], ["email", "tick", 0.55], ["whats", "tick", 0.55], ["crm", "tick", 0.55], ["rastreio", "tick", 0.55], ["hosp", "tick", 0.55], ["total", "riser", 0.4, -0.6], ["total", "impact", 0.8]],
    Comp: D.S41Receipt,
  },
  {
    id: "S42-versus",
    fala: "O Wonne Max começa em duzentos e noventa e sete reais por mês.",
    verbo: "vencer (split: o lima cresce, o caro encolhe)",
    trat: "OVERLAY",
    from: o1 - L,
    cut: "whip",
    marks: { preco: at("duzentos e noventa e sete", o1) },
    sfx: [["preco", "boom", 0.8], ["preco", "ding", 0.55, 0.15]],
    Comp: D.S42Versus,
  },
  {
    id: "S43-ano",
    fala: "São mil seiscentos e dez reais de diferença, todo mês. Em um ano, dezenove mil trezentos e vinte reais pagos a ferramentas que não conversam entre si.",
    verbo: "acumular no tempo (12 meses)",
    trat: "OVERLAY",
    from: o2 - L,
    cut: "punch",
    marks: { ano: at("Em um ano", o2), dezenove: at("dezenove mil", o2), conversam: at("ferramentas que não conversam", o2) },
    sfx: [["ano", "riser", 0.4, -0.3], ["ano", "tick", 0.4, 0.15], ["ano", "tick", 0.4, 0.3], ["ano", "tick", 0.4, 0.45], ["ano", "tick", 0.4, 0.6], ["ano", "tick", 0.4, 0.75], ["dezenove", "impact", 0.7]],
    Comp: D.S43Year,
  },
  {
    id: "S44-tres",
    fala: "Você recebe três coisas. A plataforma completa... A automação que recupera o dinheiro deixado na mesa. E a inteligência artificial que atende por você.",
    verbo: "entregar (3 caixas)",
    trat: "OVERLAY",
    from: o3 - L,
    cut: "whip",
    marks: {
      plataforma: at("A plataforma completa", o3),
      funis: at("funis", o3),
      paginas: at("páginas", o3),
      mensagens: at("mensagens", o3),
      crm: at("CRM", o3),
      membros: at("área de membros", o3),
      automacao: at("A automação", o3),
      mesa: at("deixado na mesa", o3),
      ia: at("E a inteligência artificial", o3),
    },
    sfx: [["plataforma", "pop", 0.55], ["funis", "click", 0.4], ["paginas", "click", 0.4], ["mensagens", "click", 0.4], ["crm", "click", 0.4], ["membros", "click", 0.4], ["automacao", "pop", 0.55], ["mesa", "ding", 0.4], ["ia", "pop", 0.55]],
    Comp: D.S44Three,
  },
  {
    id: "S45-cinco",
    fala: "E cinco motivos pra trocar. Uma só tela. Um único login. Uma única assinatura. Nenhuma taxa por venda. E uma verdade só...",
    verbo: "cumprir (checklist marcando)",
    trat: "OVERLAY",
    from: o4 - L,
    cut: "punch",
    marks: { tela: at("Uma só tela", o4), login: at("Um único login", o4), assinatura: at("Uma única assinatura", o4), taxa: at("Nenhuma taxa", o4), verdade: at("E uma verdade só", o4) },
    sfx: [["tela", "tick", 0.55, 0.07], ["login", "tick", 0.55, 0.07], ["assinatura", "tick", 0.55, 0.07], ["taxa", "tick", 0.55, 0.07], ["verdade", "ding", 0.55, 0.07]],
    Comp: D.S45Five,
  },
  {
    id: "S46-planos",
    fala: "Tem o Starter, o Pro, que é o mais escolhido, e o Teams. No anual, você economiza quatrocentos reais por ano.",
    verbo: "escolher (planos + toggle anual)",
    trat: "OVERLAY",
    from: o5 - L,
    cut: "whip",
    marks: { starter: at("Starter", o5), pro: at("Pro", o5), teams: at("Teams", o5), anual: at("No anual", o5), economiza: at("economiza", o5) },
    sfx: [["starter", "pop", 0.5], ["pro", "pop", 0.55], ["teams", "pop", 0.5], ["anual", "click", 0.6], ["economiza", "ding", 0.5]],
    Comp: D.S46Plans,
  },
  {
    id: "S47-gratis",
    fala: "E você não precisa arriscar nada. Existe um plano grátis. Sem cartão de crédito.",
    verbo: "liberar (palavra GRÁTIS + cartão riscado)",
    trat: "PALAVRA ATRÁS",
    from: k0 - L,
    cut: "punch",
    marks: { plano: at("plano grátis", k0), gratis: at("grátis", k0), cartao: at("Sem cartão", k0) },
    behind: { lines: ["GRÁTIS"], mark: "gratis", dur: 1.6, tone: "lime", top: 230, size: 330 },
    sfx: [["cartao", "impact", 0.55, 0.2]],
    Comp: D.S47Free,
  },
  {
    id: "S48-conecta",
    fala: "Você não precisa desligar nada no primeiro dia: conecta a plataforma onde já vende, e vê suas vendas chegando na tela.",
    verbo: "ligar + chegar",
    trat: "OVERLAY",
    from: k1 - L,
    cut: "whip",
    marks: { conecta: at("conecta", k1), chegando: at("vendas chegando", k1) },
    sfx: [["conecta", "click", 0.6], ["chegando", "ding", 0.4], ["chegando", "ding", 0.35, 0.23], ["chegando", "ding", 0.35, 0.47], ["chegando", "ding", 0.35, 0.7], ["chegando", "ding", 0.35, 0.93]],
    Comp: D.S48Connect,
  },
  {
    id: "S49-cancela",
    fala: "Gostou? Muda de plano. Não gostou? Cancela pelo painel. Sem fidelidade.",
    verbo: "decidir (dois cliques) + carimbo",
    trat: "OVERLAY",
    from: k2 - L,
    cut: "punch",
    marks: { muda: at("Muda de plano", k2), cancela: at("Cancela pelo painel", k2), fidelidade: at("Sem fidelidade", k2) },
    sfx: [["muda", "click", 0.6], ["cancela", "click", 0.6], ["fidelidade", "impact", 0.7]],
    Comp: D.S49Cancel,
  },
  {
    id: "S50-cta",
    fala: "Clica no botão aqui embaixo. Começar agora, é grátis.",
    verbo: "apontar + clicar",
    trat: "OVERLAY",
    from: k3 - L,
    cut: "whip",
    marks: { embaixo: at("aqui embaixo", k3), comecar: at("Começar agora", k3) },
    sfx: [["embaixo", "whoosh", 0.4], ["comecar", "click", 0.6], ["comecar", "ding", 0.5, 0.1]],
    Comp: D.S50Cta,
  },
  {
    id: "S51-lembra",
    fala: "Lembra da Maria? Das quinze abas, das vendas escapando em silêncio?",
    verbo: "lembrar (flashback desbotado)",
    trat: "OVERLAY",
    from: f0 - L,
    cut: "punch",
    marks: { abas: at("quinze abas", f0), escapando: at("vendas escapando", f0), silencio: at("em silêncio", f0) },
    sfx: [["abas", "tick", 0.35], ["abas", "tick", 0.35, 0.13], ["abas", "tick", 0.35, 0.27], ["silencio", "swoosh", 0.35]],
    Comp: D.S51Recall,
  },
  {
    id: "S52-recolhe",
    fala: "Ela não precisava trabalhar mais. Precisava de tudo conversando numa tela só.",
    verbo: "recolher (15 abas viram 1)",
    trat: "TELA",
    from: f1 - L,
    cut: "whip",
    marks: { tudo: at("tudo conversando", f1), tela: at("numa tela só", f1) },
    sfx: [["tudo", "whoosh", 0.45], ["tela", "ding", 0.5]],
    Comp: D.S52Collapse,
  },
  {
    id: "S53-voce",
    fala: "Você também.",
    verbo: "incluir",
    trat: "PALAVRA ATRÁS",
    from: f2 - L,
    cut: "glitch",
    marks: { voce: at("Você também", f2) },
    behind: { lines: ["VOCÊ"], mark: "voce", dur: 1.0, top: 260, size: 340 },
    sfx: [["voce", "impact", 0.5]],
    Comp: D.S53You,
  },
  {
    id: "S54-troca",
    fala: "Pare de vender no caos. Troque as quinze ferramentas por uma só.",
    verbo: "trocar (15 → 1)",
    trat: "OVERLAY",
    from: f3 - L,
    cut: "punch",
    marks: { pare: at("Pare de vender", f3), quinze: at("quinze ferramentas", f3), uma: at("uma só", f3) },
    sfx: [["quinze", "impact", 0.5], ["uma", "boom", 0.8]],
    Comp: D.S54Swap,
  },
  {
    id: "S55-final",
    fala: "Clica no botão. Começar agora, é grátis.",
    verbo: "chamar",
    trat: "OVERLAY",
    from: f4 - L,
    cut: "whip",
    marks: { comecar: at("Começar agora", f4) },
    sfx: [["comecar", "click", 0.6], ["comecar", "ding", 0.55, 0.1]],
    Comp: D.S55End,
  },
];
