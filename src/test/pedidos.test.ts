import { describe, expect, it } from "vitest";

import {
  STORAGE_KEY,
  contarPorStatus,
  filtrarPedidos,
  interpretarArmazenado,
  validarFormulario,
  type PedidoInput,
} from "@/lib/pedidos/model";
import { MSG_FALHA_GRAVAR, criarRepositorio } from "@/lib/pedidos/store";

const dados: PedidoInput = {
  categoria: "Hidráulica",
  titulo: "Trocar sifão da pia",
  descricao: "O sifão da pia da cozinha está vazando um pouco.",
  bairro: "Vila Imaginária",
  prioridade: "Normal",
};

function memoria() {
  const m = new Map<string, string>();
  return {
    m,
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
  };
}

describe("Formulário", () => {
  it("aceita um pedido válido", () => {
    expect(validarFormulario({ ...dados }).ok).toBe(true);
  });

  it("exige categoria, título e descrição", () => {
    const r = validarFormulario({
      categoria: "",
      titulo: "",
      descricao: "",
      bairro: "",
      prioridade: "Normal",
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.erros).sort()).toEqual(["categoria", "descricao", "titulo"]);
  });

  it("bairro é opcional", () => {
    expect(validarFormulario({ ...dados, bairro: "" }).ok).toBe(true);
  });

  it("recusa e-mail, telefone e CPF na descrição", () => {
    for (const d of [
      "fale comigo em ana@exemplo.com",
      "ligue (11) 98765-4321",
      "cpf 123.456.789-09",
    ]) {
      expect(validarFormulario({ ...dados, descricao: d }).ok).toBe(false);
    }
  });

  it("recusa número ou endereço no bairro", () => {
    expect(validarFormulario({ ...dados, bairro: "Rua Real, 123" }).ok).toBe(false);
  });

  it("aceita só as cinco categorias e as duas prioridades", () => {
    expect(validarFormulario({ ...dados, categoria: "Pintura" }).ok).toBe(false);
    expect(validarFormulario({ ...dados, prioridade: "Emergência" }).ok).toBe(false);
  });
});

describe("Pedidos no navegador", () => {
  it("só grava ao confirmar e cria com status Novo", () => {
    const s = memoria();
    const repo = criarRepositorio(() => s);
    expect(repo.getSnapshot().pedidos).toHaveLength(0);
    expect(s.m.has(STORAGE_KEY)).toBe(false);
    const r = repo.confirmarNovo(dados, "PED-AAAAAA");
    expect(r.ok).toBe(true);
    const p = repo.getSnapshot().pedidos[0]!;
    expect(p.status).toBe("Novo");
    expect(p.id).toBe("PED-AAAAAA");
    expect(p.criadoEm).toBe(p.atualizadoEm);
  });

  it("confirmar duas vezes com o mesmo ID cria apenas um pedido", () => {
    const s = memoria();
    const repo = criarRepositorio(() => s);
    repo.confirmarNovo(dados, "PED-AAAAAA");
    const r = repo.confirmarNovo(dados, "PED-AAAAAA");
    expect(r.ok && r.valor.duplicado).toBe(true);
    expect(repo.getSnapshot().pedidos).toHaveLength(1);
  });

  it("mantém o mesmo ID ao editar e ao mudar status", () => {
    const s = memoria();
    const repo = criarRepositorio(() => s);
    repo.confirmarNovo(dados, "PED-BBBBBB");
    repo.editar("PED-BBBBBB", { ...dados, titulo: "Trocar sifão e vedação" });
    repo.mudarStatus("PED-BBBBBB", "Agendado");
    const p = repo.getSnapshot().pedidos[0]!;
    expect(p.id).toBe("PED-BBBBBB");
    expect(p.titulo).toBe("Trocar sifão e vedação");
    expect(p.status).toBe("Agendado");
    expect(p.ultimaAlteracao).toBe("Status alterado de Novo para Agendado.");
  });

  it("os pedidos continuam após recarregar a página", () => {
    const s = memoria();
    criarRepositorio(() => s).confirmarNovo(dados, "PED-CCCCCC");
    const recarregado = criarRepositorio(() => s);
    expect(recarregado.getSnapshot().pedidos.map((p) => p.id)).toEqual(["PED-CCCCCC"]);
  });

  it("falha ao gravar não altera a lista e avisa", () => {
    const s = memoria();
    s.setItem = () => {
      throw new Error("QuotaExceededError");
    };
    const repo = criarRepositorio(() => s);
    const r = repo.confirmarNovo(dados, "PED-DDDDDD");
    expect(r).toEqual({ ok: false, mensagem: MSG_FALHA_GRAVAR });
    expect(repo.getSnapshot().pedidos).toHaveLength(0);
  });

  it("exemplos fictícios entram uma única vez", () => {
    const s = memoria();
    const repo = criarRepositorio(() => s);
    repo.carregarExemplos();
    repo.carregarExemplos();
    const lista = repo.getSnapshot().pedidos;
    expect(lista).toHaveLength(3);
    expect(lista.every((p) => p.exemplo)).toBe(true);
  });

  it("excluir e limpar removem os pedidos", () => {
    const s = memoria();
    const repo = criarRepositorio(() => s);
    repo.confirmarNovo(dados, "PED-EEEEEE");
    repo.confirmarNovo(dados, "PED-FFFFFF");
    repo.excluir("PED-EEEEEE");
    expect(repo.getSnapshot().pedidos.map((p) => p.id)).toEqual(["PED-FFFFFF"]);
    repo.limpar();
    expect(repo.getSnapshot().pedidos).toHaveLength(0);
    expect(s.m.has(STORAGE_KEY)).toBe(false);
  });
});

describe("Contagens e filtros", () => {
  it("contagens vêm dos pedidos, não de números fixos", () => {
    const s = memoria();
    const repo = criarRepositorio(() => s);
    repo.confirmarNovo(dados, "PED-111111");
    repo.confirmarNovo(dados, "PED-222222");
    repo.mudarStatus("PED-222222", "Concluído");
    expect(contarPorStatus(repo.getSnapshot().pedidos)).toEqual({
      Novo: 1,
      "Em análise": 0,
      Agendado: 0,
      Concluído: 1,
    });
  });

  it("filtra por status e busca sem acento", () => {
    const s = memoria();
    const repo = criarRepositorio(() => s);
    repo.carregarExemplos();
    const lista = repo.getSnapshot().pedidos;
    expect(filtrarPedidos(lista, { busca: "", status: "Agendado" })).toHaveLength(1);
    expect(filtrarPedidos(lista, { busca: "hidraulica", status: "Todos" })).toHaveLength(1);
  });

  it("dados corrompidos são ignorados sem quebrar", () => {
    expect(interpretarArmazenado("{nao é json").ok).toBe(false);
    const r = interpretarArmazenado(JSON.stringify([{ id: "x" }]));
    expect(r.ok && r.descartados).toBe(1);
  });
});
