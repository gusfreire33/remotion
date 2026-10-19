import { at } from "./sync";
import type { SceneDef } from "./types";
import * as A from "../scenes/A";

/* ═══════════ MAPA — HOOK + LEAD (0 → 61s) ═══════════
   ETAPA 5.1 · TESE: quem vende no digital perde venda e tempo porque opera
   uma pilha de ferramentas que não conversa; o Wonne Max é uma só tela — o
   cérebro acima do checkout — sem taxa, a partir de R$297 (vs R$1.907).
   CTA: "Começar agora, é grátis".
   Toda marca é uma FRASE da narração (lib/sync.ts). */

const L = 0.06; // a cena nasce 2 frames antes da boca

const t2 = at("E mesmo assim");
const t3 = at("Deixa eu te apresentar");
const t4 = at("E a rotina dela");
const t5 = at("Uma ferramenta pra página");
const t6 = at("Quinze abas abertas", t5);
const t7 = at("Toda manhã");
const t8 = at("De madrugada");
const t9 = at("E aí vem o pior");
const t10 = at("Um cliente compra");
const t11 = at("Outro cliente tem");
const t12 = at("Um Pix expira");
const t13 = at("Talvez você se reconheça");

export const MAP_A: SceneDef[] = [
  {
    id: "S01-abas",
    fala: "Quinze abas abertas. Quinze mensalidades no cartão.",
    verbo: "multiplicar (abas brotando) + descer extrato",
    trat: "PALAVRA ATRÁS",
    from: 0,
    cut: null,
    marks: { mens: at("mensalidades") },
    behind: { lines: ["QUINZE"], dur: 1.5, top: 150, size: 300 },
    sfx: [["mens", "pop", 0.5], ["mens", "tick", 0.4, 0.13], ["mens", "tick", 0.4, 0.27], ["mens", "tick", 0.4, 0.4], ["mens", "tick", 0.4, 0.53], ["mens", "tick", 0.4, 0.67]],
    Comp: A.S01Tabs,
  },
  {
    id: "S02-noite",
    fala: "uma venda escapou ontem à noite, enquanto você dormia. E você nem ficou sabendo.",
    verbo: "escapar (notificação escorrega pra fora)",
    trat: "OVERLAY",
    from: t2 - L,
    cut: "punch",
    marks: { venda: at("uma venda", t2), escapou: at("escapou", t2), dormia: at("dormia", t2), sabendo: at("nem ficou sabendo", t2) },
    sfx: [["venda", "ding", 0.5], ["escapou", "swoosh", 0.45], ["sabendo", "impact", 0.6]],
    Comp: A.S02Night,
  },
  {
    id: "S03-maria",
    fala: "Deixa eu te apresentar a Maria. A Maria vive de marketing. Cria conteúdo... Vende cursos e mentorias. Atende cliente no WhatsApp até tarde.",
    verbo: "apresentar + listar a rotina",
    trat: "OVERLAY",
    from: t3 - L,
    cut: "whip",
    marks: {
      maria: at("Maria", t3),
      vive: at("vive de marketing", t3),
      cria: at("Cria conteúdo", t3),
      cursos: at("cursos", t3),
      mentorias: at("mentorias", t3),
      whats: at("Atende cliente", t3),
    },
    sfx: [["maria", "pop", 0.55], ["cria", "click", 0.5], ["cursos", "click", 0.5], ["mentorias", "click", 0.5], ["whats", "click", 0.5]],
    Comp: A.S03Maria,
  },
  {
    id: "S04-caos",
    fala: "E a rotina dela é um caos.",
    verbo: "tremer (janelas sobrepostas)",
    trat: "PALAVRA ATRÁS",
    from: t4 - L,
    cut: "glitch",
    marks: { caos: at("caos", t4) },
    behind: { lines: ["CAOS"], mark: "caos", dur: 1.5, tone: "danger", top: 250, size: 360 },
    sfx: [["caos", "impact", 0.7]],
    Comp: A.S04Caos,
  },
  {
    id: "S05-pilha",
    fala: "Uma ferramenta pra página. Outra pro e-mail. Outra pro WhatsApp. Outra pro CRM. Outra pra medir resultado. E mais uma pra hospedagem.",
    verbo: "acumular (uma janela cai por ferramenta)",
    trat: "OVERLAY",
    from: t5 - L,
    cut: "whip",
    marks: {
      pagina: at("página", t5),
      email: at("e-mail", t5),
      whats: at("WhatsApp", t5),
      crm: at("CRM", t5),
      medir: at("medir", t5),
      hosp: at("hospedagem", t5),
    },
    sfx: [["pagina", "pop", 0.55], ["email", "pop", 0.55], ["whats", "pop", 0.55], ["crm", "pop", 0.55], ["medir", "pop", 0.55], ["hosp", "impact", 0.55]],
    Comp: A.S05Stack,
  },
  {
    id: "S06-horas",
    fala: "Quinze abas abertas. Quinze horas, todo santo dia.",
    verbo: "contar (relógio girando até 15h, semana acendendo)",
    trat: "OVERLAY",
    from: t6 - L,
    cut: "punch",
    marks: { horas: at("horas", t6), santo: at("todo santo dia", t6) },
    sfx: [["horas", "riser", 0.35, -0.5], ["horas", "impact", 0.55, 0.7], ["santo", "tick", 0.4], ["santo", "tick", 0.4, 0.1], ["santo", "tick", 0.4, 0.2], ["santo", "tick", 0.4, 0.3], ["santo", "tick", 0.4, 0.4], ["santo", "tick", 0.4, 0.5], ["santo", "tick", 0.4, 0.6]],
    Comp: A.S06Hours,
  },
  {
    id: "S07-relatorios",
    fala: "Toda manhã, cada relatório diz uma coisa. Nenhum número bate.",
    verbo: "divergir (3 números diferentes lado a lado)",
    trat: "OVERLAY",
    from: t7 - L,
    cut: "whip",
    marks: { rel: at("cada relatório", t7), nenhum: at("Nenhum número bate", t7) },
    sfx: [["rel", "pop", 0.45], ["rel", "pop", 0.45, 0.2], ["rel", "pop", 0.45, 0.4], ["nenhum", "impact", 0.6]],
    Comp: A.S07Reports,
  },
  {
    id: "S08-caiu",
    fala: "De madrugada, a integração com o e-mail caiu. E ela só descobriu de manhã, com cliente reclamando que não recebeu o acesso.",
    verbo: "romper (o cabo estala e quebra)",
    trat: "OVERLAY",
    from: t8 - L,
    cut: "punch",
    marks: { madrugada: at("De madrugada", t8), caiu: at("caiu", t8), manha: at("de manhã", t8), cliente: at("cliente reclamando", t8) },
    sfx: [["caiu", "glitch", 0.6, -0.03], ["caiu", "boom", 0.7], ["manha", "tick", 0.4], ["cliente", "pop", 0.55]],
    Comp: A.S08Broken,
  },
  {
    id: "S09-pior",
    fala: "E aí vem o pior.",
    verbo: "alertar",
    trat: "PALAVRA ATRÁS",
    from: t9 - L,
    cut: "glitch",
    marks: { pior: at("pior", t9) },
    behind: { lines: ["O PIOR"], mark: "pior", dur: 1.1, outline: true, top: 300, size: 300 },
    sfx: [["pior", "riser", 0.3, -0.6], ["pior", "impact", 0.6]],
    Comp: A.S09Pior,
  },
  {
    id: "S10-crm",
    fala: "Um cliente compra o curso dela. Mas o CRM não fica sabendo. Ninguém manda o próximo passo.",
    verbo: "não chegar (a venda trava no meio do caminho)",
    trat: "OVERLAY",
    from: t10 - L,
    cut: "whip",
    marks: { compra: at("compra", t10), crm: at("não fica sabendo", t10), ninguem: at("Ninguém manda", t10) },
    sfx: [["compra", "ding", 0.45], ["compra", "whoosh", 0.3, 0.25], ["crm", "impact", 0.55, 0.13], ["ninguem", "pop", 0.4]],
    Comp: A.S10NoSync,
  },
  {
    id: "S11-recusado",
    fala: "Outro cliente tem o cartão recusado. E vai embora, em silêncio.",
    verbo: "recusar (carimbo) + ir embora",
    trat: "OVERLAY",
    from: t11 - L,
    cut: "punch",
    marks: { recusado: at("recusado", t11), embora: at("vai embora", t11), silencio: at("em silêncio", t11) },
    sfx: [["recusado", "impact", 0.75], ["embora", "swoosh", 0.4]],
    Comp: A.S11Declined,
  },
  {
    id: "S12-expira",
    fala: "Um Pix expira. Um boleto vence. Um carrinho fica abandonado.",
    verbo: "expirar (lista com estado virando vermelha)",
    trat: "OVERLAY",
    from: t12 - L,
    cut: "whip",
    marks: { pix: at("Pix", t12), boleto: at("boleto", t12), carrinho: at("carrinho", t12) },
    sfx: [["pix", "tick", 0.5, 0.33], ["boleto", "tick", 0.5, 0.33], ["carrinho", "tick", 0.5, 0.33], ["carrinho", "impact", 0.5, 0.5]],
    Comp: A.S12Expire,
  },
  {
    id: "S13-espelho",
    fala: "Talvez você se reconheça na Maria.",
    verbo: "— (respiro)",
    trat: "LIMPO",
    from: t13 - L,
    cut: "punch",
    marks: { voce: at("você se reconheça", t13) },
    sfx: [["voce", "ding", 0.35]],
    Comp: A.S13Mirror,
  },
];
