import { z } from "zod";

export const CATEGORIAS = [
  "Elétrica",
  "Hidráulica",
  "Montagem",
  "Pequenos reparos",
  "Outro",
] as const;
export const PRIORIDADES = ["Normal", "Urgente"] as const;
export const STATUS = ["Novo", "Em análise", "Agendado", "Concluído"] as const;

export type Categoria = (typeof CATEGORIAS)[number];
export type Prioridade = (typeof PRIORIDADES)[number];
export type Status = (typeof STATUS)[number];

/** Chave exclusiva deste app no armazenamento local, separada de outros projetos. */
export const STORAGE_KEY = "pedido-em-dia:demo:pedidos:v1";

export const LIMITES = {
  tituloMin: 5,
  tituloMax: 80,
  descricaoMin: 10,
  descricaoMax: 600,
  bairroMax: 60,
};

const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/;
// 8 ou mais dígitos seguidos (com separadores comuns) parecem telefone, CPF ou CEP.
const SEQUENCIA_DIGITOS_RE = /(?:\d[\s.\-/()]*){8,}/;
const BAIRRO_RE = /^[A-Za-zÀ-ÖØ-öø-ÿ' .-]+$/;

export const MSG_DADOS_PESSOAIS =
  "Remova e-mails, telefones, CPF ou CEP. Use apenas dados fictícios.";

export function contemDadosPessoais(texto: string): boolean {
  return EMAIL_RE.test(texto) || SEQUENCIA_DIGITOS_RE.test(texto);
}

export const pedidoInputSchema = z.object({
  categoria: z.enum(CATEGORIAS, {
    error: "Escolha uma categoria.",
  }),
  titulo: z
    .string()
    .trim()
    .min(LIMITES.tituloMin, `O título precisa ter pelo menos ${LIMITES.tituloMin} caracteres.`)
    .max(LIMITES.tituloMax, `O título pode ter no máximo ${LIMITES.tituloMax} caracteres.`)
    .refine((t) => !contemDadosPessoais(t), MSG_DADOS_PESSOAIS),
  descricao: z
    .string()
    .trim()
    .min(
      LIMITES.descricaoMin,
      `Descreva o serviço com pelo menos ${LIMITES.descricaoMin} caracteres.`,
    )
    .max(LIMITES.descricaoMax, `A descrição pode ter no máximo ${LIMITES.descricaoMax} caracteres.`)
    .refine((t) => !contemDadosPessoais(t), MSG_DADOS_PESSOAIS),
  bairro: z
    .string()
    .trim()
    .max(LIMITES.bairroMax, `O bairro pode ter no máximo ${LIMITES.bairroMax} caracteres.`)
    .refine(
      (v) => v === "" || BAIRRO_RE.test(v),
      "Use apenas letras, espaços e hífens — sem números nem endereço.",
    ),
  prioridade: z.enum(PRIORIDADES, {
    error: "Escolha a prioridade.",
  }),
});

export type PedidoInput = z.infer<typeof pedidoInputSchema>;

export const pedidoSchema = pedidoInputSchema.extend({
  id: z.string().min(1),
  status: z.enum(STATUS),
  criadoEm: z.string().min(1),
  atualizadoEm: z.string().min(1),
  exemplo: z.boolean().optional(),
  ultimaAlteracao: z.string().optional(),
});

export type Pedido = z.infer<typeof pedidoSchema>;

export type CampoForm = keyof PedidoInput;
export type ValoresForm = { [K in CampoForm]: string };
export type ErrosForm = Partial<Record<CampoForm, string>>;

export const VALORES_INICIAIS: ValoresForm = {
  categoria: "",
  titulo: "",
  descricao: "",
  bairro: "",
  prioridade: "Normal",
};

export const ORDEM_CAMPOS: CampoForm[] = [
  "categoria",
  "titulo",
  "descricao",
  "bairro",
  "prioridade",
];

export function validarFormulario(
  valores: ValoresForm,
): { ok: true; dados: PedidoInput } | { ok: false; erros: ErrosForm } {
  const r = pedidoInputSchema.safeParse(valores);
  if (r.success) return { ok: true, dados: r.data };
  const erros: ErrosForm = {};
  for (const issue of r.error.issues) {
    const campo = issue.path[0] as CampoForm;
    if (!erros[campo]) erros[campo] = issue.message;
  }
  return { ok: false, erros };
}

export function paraValoresForm(p: PedidoInput): ValoresForm {
  return {
    categoria: p.categoria,
    titulo: p.titulo,
    descricao: p.descricao,
    bairro: p.bairro,
    prioridade: p.prioridade,
  };
}

const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function gerarId(existentes: Iterable<string> = []): string {
  const usados = new Set(existentes);
  for (;;) {
    const bytes = new Uint8Array(6);
    globalThis.crypto.getRandomValues(bytes);
    let s = "";
    for (const b of bytes) s += ALFABETO[b % ALFABETO.length];
    const id = `PED-${s}`;
    if (!usados.has(id)) return id;
  }
}

export function criarPedido(
  lista: Pedido[],
  dados: PedidoInput,
  id: string,
  agora: string,
): { lista: Pedido[]; pedido: Pedido; duplicado: boolean } {
  const existente = lista.find((p) => p.id === id);
  if (existente) return { lista, pedido: existente, duplicado: true };
  const pedido: Pedido = {
    ...dados,
    id,
    status: "Novo",
    criadoEm: agora,
    atualizadoEm: agora,
    ultimaAlteracao: "Pedido criado com status Novo.",
  };
  return { lista: [pedido, ...lista], pedido, duplicado: false };
}

const NOMES_CAMPOS: Record<CampoForm, string> = {
  categoria: "categoria",
  titulo: "título",
  descricao: "descrição",
  bairro: "bairro",
  prioridade: "prioridade",
};

export function camposAlterados(antes: PedidoInput, depois: PedidoInput): CampoForm[] {
  return ORDEM_CAMPOS.filter((c) => antes[c] !== depois[c]);
}

export function atualizarPedido(
  lista: Pedido[],
  id: string,
  dados: PedidoInput,
  agora: string,
): { lista: Pedido[]; alterados: CampoForm[] } | null {
  const atual = lista.find((p) => p.id === id);
  if (!atual) return null;
  const alterados = camposAlterados(atual, dados);
  if (alterados.length === 0) return { lista, alterados };
  const novo: Pedido = {
    ...atual,
    ...dados,
    id: atual.id,
    criadoEm: atual.criadoEm,
    atualizadoEm: agora,
    ultimaAlteracao: `Dados editados: ${alterados.map((c) => NOMES_CAMPOS[c]).join(", ")}.`,
  };
  return { lista: lista.map((p) => (p.id === id ? novo : p)), alterados };
}

export function alterarStatus(
  lista: Pedido[],
  id: string,
  status: Status,
  agora: string,
): Pedido[] | null {
  const atual = lista.find((p) => p.id === id);
  if (!atual) return null;
  if (atual.status === status) return lista;
  const novo: Pedido = {
    ...atual,
    status,
    atualizadoEm: agora,
    ultimaAlteracao: `Status alterado de ${atual.status} para ${status}.`,
  };
  return lista.map((p) => (p.id === id ? novo : p));
}

export function removerPedido(lista: Pedido[], id: string): Pedido[] {
  return lista.filter((p) => p.id !== id);
}

export function contarPorStatus(lista: Pedido[]): Record<Status, number> {
  const c = { Novo: 0, "Em análise": 0, Agendado: 0, Concluído: 0 } as Record<Status, number>;
  for (const p of lista) c[p.status] += 1;
  return c;
}

function normalizar(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function filtrarPedidos(
  lista: Pedido[],
  filtro: { busca: string; status: Status | "Todos" },
): Pedido[] {
  const termo = normalizar(filtro.busca.trim());
  return lista.filter((p) => {
    if (filtro.status !== "Todos" && p.status !== filtro.status) return false;
    if (!termo) return true;
    return [p.id, p.titulo, p.descricao, p.bairro, p.categoria].some((v) =>
      normalizar(v).includes(termo),
    );
  });
}

export function etapaDoStatus(status: Status): number {
  return STATUS.indexOf(status) + 1;
}

export function pedidosExemplo(agora: string): Pedido[] {
  const base = { criadoEm: agora, atualizadoEm: agora, exemplo: true as const };
  return [
    {
      ...base,
      id: "PED-EXEMPLO1",
      categoria: "Elétrica",
      titulo: "Exemplo fictício: tomada da cozinha sem energia",
      descricao: "Demonstração. Uma tomada parou de funcionar após uma queda de luz imaginária.",
      bairro: "Vila Imaginária",
      prioridade: "Normal",
      status: "Novo",
      ultimaAlteracao: "Exemplo fictício carregado com status Novo.",
    },
    {
      ...base,
      id: "PED-EXEMPLO2",
      categoria: "Hidráulica",
      titulo: "Exemplo fictício: torneira pingando no banheiro",
      descricao: "Demonstração. A torneira pinga sem parar, mesmo totalmente fechada.",
      bairro: "Jardim das Demonstrações",
      prioridade: "Urgente",
      status: "Em análise",
      ultimaAlteracao: "Exemplo fictício carregado com status Em análise.",
    },
    {
      ...base,
      id: "PED-EXEMPLO3",
      categoria: "Montagem",
      titulo: "Exemplo fictício: montar estante de livros",
      descricao: "Demonstração. Estante de cinco prateleiras ainda na caixa, com manual.",
      bairro: "",
      prioridade: "Normal",
      status: "Agendado",
      ultimaAlteracao: "Exemplo fictício carregado com status Agendado.",
    },
  ];
}

export function adicionarExemplos(
  lista: Pedido[],
  agora: string,
): { lista: Pedido[]; adicionados: number } {
  const ids = new Set(lista.map((p) => p.id));
  const novos = pedidosExemplo(agora).filter((p) => !ids.has(p.id));
  return { lista: [...novos, ...lista], adicionados: novos.length };
}

/** Lê o conteúdo bruto salvo. Registros inválidos são descartados e contados. */
export function interpretarArmazenado(
  bruto: string | null,
): { ok: true; pedidos: Pedido[]; descartados: number } | { ok: false } {
  if (bruto === null || bruto === "") return { ok: true, pedidos: [], descartados: 0 };
  let dados: unknown;
  try {
    dados = JSON.parse(bruto);
  } catch {
    return { ok: false };
  }
  if (!Array.isArray(dados)) return { ok: false };
  const pedidos: Pedido[] = [];
  const vistos = new Set<string>();
  let descartados = 0;
  for (const item of dados) {
    const r = pedidoSchema.safeParse(item);
    if (r.success && !vistos.has(r.data.id)) {
      vistos.add(r.data.id);
      pedidos.push(r.data);
    } else descartados += 1;
  }
  return { ok: true, pedidos, descartados };
}
