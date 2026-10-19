import { at, end } from "./sync";
import type { SceneDef } from "./types";
import * as C from "../scenes/C";

/* ═══════════ MAPA — REVELAÇÃO + DEMO (120 → 222s) ═══════════
   As telas do produto fazem o papel do B-ROLL (5.3: "a frase descreve uma
   coisa concreta do mundo" — aqui, a tela que ela cita). Entram com whip. */

const L = 0.06;
const r0 = at("Esse cérebro se chama");
const r1 = at("O ecossistema");
const r2 = at("Funis, páginas, mensagens");
const r3 = at("E repara");
const r4 = at("Você continua vendendo");
const d0 = at("Olha a visão geral");
const d1 = at("Agora, o canvas");
const d2 = at("Precisa de uma página");
const d3 = at("Aqui estão as mensagens");
const d4 = at("E os fluxos automáticos");
const d5 = at("O agente de IA");
const d6 = at("No CRM");
const d7 = at("Visitou o vídeo");
const d8 = at("E se quiser saber");

export const MAP_C: SceneDef[] = [
  {
    id: "S27-logo",
    fala: "Esse cérebro se chama Wonne Max.",
    verbo: "nomear (o ponto vira a marca)",
    trat: "OVERLAY",
    from: r0 - L,
    cut: "whip",
    marks: { nome: at("Wonne Max", r0) },
    sfx: [["nome", "riser", 0.45, -0.9], ["nome", "boom", 0.9], ["nome", "impact", 0.5]],
    Comp: C.S27Logo,
  },
  {
    id: "S28-kicker",
    fala: "O ecossistema tudo-em-um pra quem vende de verdade.",
    verbo: "afirmar (palavras entrando com a voz)",
    trat: "OVERLAY",
    from: r1 - L,
    cut: "punch",
    marks: { eco: at("O ecossistema", r1), tudo: at("tudo-em-um", r1), quem: at("pra quem vende", r1), verdade: at("de verdade", r1) },
    sfx: [["eco", "pop", 0.4], ["tudo", "pop", 0.45], ["quem", "pop", 0.4], ["verdade", "impact", 0.5]],
    Comp: C.S28Kicker,
  },
  {
    id: "S29-modulos",
    fala: "Funis, páginas, mensagens e CRM, trabalhando na mesma tela.",
    verbo: "juntar (os 4 módulos acendem)",
    trat: "TELA",
    from: r2 - L,
    cut: "whip",
    marks: { funis: at("Funis", r2), paginas: at("páginas", r2), mensagens: at("mensagens", r2), crm: at("CRM", r2), mesma: at("mesma tela", r2) },
    sfx: [["funis", "pop", 0.5], ["paginas", "pop", 0.5], ["mensagens", "pop", 0.5], ["crm", "pop", 0.5], ["mesma", "ding", 0.5]],
    Comp: C.S29Modules,
  },
  {
    id: "S30-sem-taxa",
    fala: "E repara: o Wonne Max não tem checkout próprio. Não cobra taxa por venda.",
    verbo: "negar + zerar",
    trat: "OVERLAY",
    from: r3 - L,
    cut: "punch",
    marks: { checkout: at("checkout próprio", r3), taxa: at("Não cobra taxa", r3) },
    sfx: [["checkout", "impact", 0.55, 0.13], ["taxa", "tick", 0.4, 0.2], ["taxa", "tick", 0.4, 0.4], ["taxa", "tick", 0.4, 0.6], ["taxa", "ding", 0.55, 0.75]],
    Comp: C.S30NoFee,
  },
  {
    id: "S31-hub",
    fala: "Você continua vendendo na Hotmart, na Kiwify, na Eduzz. Ele só conecta e lê cada venda, em tempo real.",
    verbo: "conectar + ler ao vivo",
    trat: "OVERLAY",
    from: r4 - L,
    cut: "whip",
    marks: { hotmart: at("Hotmart", r4), kiwify: at("Kiwify", r4), eduzz: at("Eduzz", r4), le: at("lê cada venda", r4), real: at("tempo real", r4) },
    sfx: [["hotmart", "click", 0.55], ["kiwify", "click", 0.55], ["eduzz", "click", 0.55], ["le", "tick", 0.4], ["le", "tick", 0.4, 0.23], ["le", "tick", 0.4, 0.47], ["le", "tick", 0.4, 0.7], ["le", "tick", 0.4, 0.93], ["real", "ding", 0.45]],
    Comp: C.S31Hub,
  },
  {
    id: "S32-visao-geral",
    fala: "Olha a visão geral. Visão de águia dos seus funis. Acessos, contatos capturados, produtos vendidos, ticket médio e faturamento. Uma verdade só.",
    verbo: "revelar números (KPI conta na palavra)",
    trat: "TELA",
    from: d0 - L,
    cut: "whip",
    marks: {
      aguia: at("Visão de águia", d0),
      acessos: at("Acessos", d0),
      contatos: at("contatos capturados", d0),
      produtos: at("produtos vendidos", d0),
      ticket: at("ticket médio", d0),
      fat: at("faturamento", d0),
      verdade: at("Uma verdade só", d0),
    },
    sfx: [["aguia", "pop", 0.45], ["acessos", "tick", 0.5], ["contatos", "tick", 0.5], ["produtos", "tick", 0.5], ["ticket", "tick", 0.5], ["fat", "tick", 0.5], ["verdade", "ding", 0.55]],
    Comp: C.S32Dashboard,
  },
  {
    id: "S33-funis",
    fala: "Agora, o canvas de funis. Você liga a captura à página de vendas, ao upsell, à página de obrigado. E vê quanto perde em cada etapa.",
    verbo: "ligar (cabo desenhando até cada página)",
    trat: "TELA",
    from: d1 - L,
    cut: "whip",
    marks: { captura: at("captura", d1), vendas: at("página de vendas", d1), upsell: at("upsell", d1), obrigado: at("página de obrigado", d1), perde: at("perde", d1) },
    sfx: [["captura", "pop", 0.5], ["vendas", "pop", 0.5], ["upsell", "pop", 0.5], ["obrigado", "pop", 0.5], ["perde", "tick", 0.5], ["perde", "tick", 0.5, 0.2], ["perde", "tick", 0.5, 0.4]],
    Comp: C.S33Funnel,
  },
  {
    id: "S34-builder",
    fala: "Precisa de uma página? Arrasta, solta, vende. Mais de sessenta seções prontas, com player de vídeo e botão de WhatsApp.",
    verbo: "arrastar e soltar",
    trat: "TELA",
    from: d2 - L,
    cut: "whip",
    marks: { arrasta: at("Arrasta", d2), solta: at("solta", d2), vende: at("vende", d2), sessenta: at("sessenta", d2), player: at("player de vídeo", d2), botao: at("botão de WhatsApp", d2) },
    sfx: [["solta", "click", 0.55, -0.07], ["vende", "click", 0.55, -0.07], ["vende", "click", 0.55, 0.47], ["sessenta", "ding", 0.4], ["player", "pop", 0.5], ["botao", "pop", 0.5]],
    Comp: C.S34Builder,
  },
  {
    id: "S35-inbox",
    fala: "Aqui estão as mensagens. WhatsApp, Instagram, e-mail, SMS, e até ligação com voz. Tudo numa caixa de entrada única.",
    verbo: "convergir canais numa lista",
    trat: "TELA",
    from: d3 - L,
    cut: "whip",
    marks: { whats: at("WhatsApp", d3), insta: at("Instagram", d3), email: at("e-mail", d3), sms: at("SMS", d3), voz: at("voz", d3), unica: at("caixa de entrada única", d3) },
    sfx: [["whats", "click", 0.5], ["insta", "click", 0.5], ["email", "click", 0.5], ["sms", "click", 0.5], ["voz", "click", 0.5], ["unica", "ding", 0.5]],
    Comp: C.S35Inbox,
  },
  {
    id: "S36-fluxos",
    fala: "E os fluxos automáticos. Carrinho abandonado. Cartão recusado. Pix expirado. Boleto vencido. Cada gatilho dispara a mensagem certa, na hora certa.",
    verbo: "disparar (pulsos nos cabos)",
    trat: "TELA",
    from: d4 - L,
    cut: "whip",
    marks: { carrinho: at("Carrinho abandonado", d4), cartao: at("Cartão recusado", d4), pix: at("Pix expirado", d4), boleto: at("Boleto vencido", d4), dispara: at("dispara", d4), certa: at("mensagem certa", d4), hora: at("hora certa", d4) },
    sfx: [["carrinho", "pop", 0.5], ["cartao", "pop", 0.5], ["pix", "pop", 0.5], ["boleto", "pop", 0.5], ["dispara", "whoosh", 0.45], ["certa", "type", 0.4], ["hora", "ding", 0.55]],
    Comp: C.S36Flows,
  },
  {
    id: "S37-agente",
    fala: "O agente de IA conversa com o seu cliente no WhatsApp e no Instagram. Conhece seus produtos, responde objeções, e passa pra você quando precisa.",
    verbo: "conversar (chat ao vivo + handoff)",
    trat: "OVERLAY",
    from: d5 - L,
    cut: "whip",
    marks: { conversa: at("conversa", d5), conhece: at("Conhece seus produtos", d5), objecoes: at("responde objeções", d5), passa: at("passa pra você", d5) },
    sfx: [["conversa", "pop", 0.5], ["conhece", "pop", 0.5], ["objecoes", "impact", 0.5, 0.07], ["passa", "ding", 0.5]],
    Comp: C.S37Agent,
  },
  {
    id: "S38-crm",
    fala: "No CRM, cada contato tem temperatura. Frio, morno, quente, cliente. E uma linha do tempo completa.",
    verbo: "aquecer (etiquetas acendendo)",
    trat: "TELA",
    from: d6 - L,
    cut: "whip",
    marks: { frio: at("Frio", d6), morno: at("morno", d6), quente: at("quente", d6), cliente: at("cliente", d6), linha: at("linha do tempo", d6) },
    sfx: [["frio", "click", 0.5], ["morno", "click", 0.5], ["quente", "click", 0.5], ["cliente", "ding", 0.45], ["linha", "pop", 0.4]],
    Comp: C.S38Crm,
  },
  {
    id: "S39-timeline",
    fala: "Visitou o vídeo. Abriu o e-mail. Comprou. Comprou de novo. Cliente comprou? O CRM atualiza sozinho e dispara o próximo passo.",
    verbo: "avançar (timeline + card anda sozinho)",
    trat: "TELA",
    from: d7 - L,
    cut: "punch",
    marks: { visitou: at("Visitou", d7), abriu: at("Abriu", d7), comprou: at("Comprou", d7), denovo: at("Comprou de novo", d7 + 0.4), cliente: at("Cliente comprou", d7), atualiza: at("atualiza sozinho", d7), dispara: at("dispara o próximo", d7) },
    sfx: [["visitou", "tick", 0.5], ["abriu", "tick", 0.5], ["comprou", "ding", 0.45], ["denovo", "ding", 0.5], ["atualiza", "whoosh", 0.4], ["atualiza", "click", 0.5, 0.53], ["dispara", "pop", 0.5]],
    Comp: C.S39Timeline,
  },
  {
    id: "S40-chatmax",
    fala: "E se quiser saber alguma coisa, pergunta pro Chat Max. Quais produtos mais venderam este mês? Ele responde com os números reais do seu negócio.",
    verbo: "perguntar e responder",
    trat: "TELA",
    from: d8 - L,
    cut: "whip",
    marks: { q: at("Quais produtos", d8), qend: end("este mês", d8), responde: at("Ele responde", d8) },
    sfx: [["q", "type", 0.4], ["q", "type", 0.4, 0.4], ["q", "type", 0.4, 0.8], ["q", "type", 0.4, 1.2], ["q", "type", 0.4, 1.6], ["responde", "pop", 0.5], ["responde", "tick", 0.45, 0.25], ["responde", "tick", 0.45, 0.45], ["responde", "tick", 0.45, 0.65]],
    Comp: C.S40ChatMax,
  },
];
