import { useSyncExternalStore } from "react";

import {
  STORAGE_KEY,
  adicionarExemplos,
  alterarStatus,
  atualizarPedido,
  criarPedido,
  interpretarArmazenado,
  removerPedido,
  type CampoForm,
  type Pedido,
  type PedidoInput,
  type Status,
} from "./model";

export type Fase = "carregando" | "pronto" | "indisponivel";
export type EstadoPedidos = { fase: Fase; pedidos: Pedido[]; aviso?: string | undefined };
export type Resultado<T = undefined> = { ok: true; valor: T } | { ok: false; mensagem: string };

export const MSG_FALHA_GRAVAR =
  "Não foi possível gravar no armazenamento local deste navegador. Nenhuma alteração foi salva.";

type ArmazenamentoMinimo = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/** Repositório local. Recebe o armazenamento por parâmetro para poder ser testado. */
export function criarRepositorio(obterArmazenamento: () => ArmazenamentoMinimo | null) {
  let estado: EstadoPedidos = { fase: "carregando", pedidos: [] };
  let iniciado = false;
  const ouvintes = new Set<() => void>();

  const emitir = () => ouvintes.forEach((o) => o());

  function ler(): EstadoPedidos {
    let armazenamento: ArmazenamentoMinimo | null;
    let bruto: string | null;
    try {
      armazenamento = obterArmazenamento();
      if (!armazenamento) throw new Error("indisponível");
      bruto = armazenamento.getItem(STORAGE_KEY);
    } catch {
      return {
        fase: "indisponivel",
        pedidos: [],
        aviso:
          "O armazenamento local deste navegador está bloqueado ou indisponível. Nada poderá ser salvo.",
      };
    }
    const r = interpretarArmazenado(bruto);
    if (!r.ok) {
      return {
        fase: "pronto",
        pedidos: [],
        aviso:
          "Os dados salvos desta demonstração estavam ilegíveis e foram ignorados. Use “Limpar demonstração” para recomeçar.",
      };
    }
    return {
      fase: "pronto",
      pedidos: r.pedidos,
      aviso:
        r.descartados > 0
          ? `${r.descartados} registro(s) inválido(s) foram ignorados ao carregar.`
          : undefined,
    };
  }

  function iniciar() {
    if (iniciado) return;
    iniciado = true;
    estado = ler();
  }

  function gravar(lista: Pedido[]): Resultado {
    try {
      const a = obterArmazenamento();
      if (!a) throw new Error("indisponível");
      a.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch {
      return { ok: false, mensagem: MSG_FALHA_GRAVAR };
    }
    estado = { fase: "pronto", pedidos: lista, aviso: estado.aviso };
    emitir();
    return { ok: true, valor: undefined };
  }

  const agora = () => new Date().toISOString();

  return {
    getSnapshot(): EstadoPedidos {
      iniciar();
      return estado;
    },
    subscribe(ouvinte: () => void) {
      ouvintes.add(ouvinte);
      return () => ouvintes.delete(ouvinte);
    },
    /** Recarrega do armazenamento (usado quando outra aba altera os dados). */
    recarregar() {
      estado = ler();
      iniciado = true;
      emitir();
    },
    confirmarNovo(
      dados: PedidoInput,
      id: string,
    ): Resultado<{ pedido: Pedido; duplicado: boolean }> {
      iniciar();
      const r = criarPedido(estado.pedidos, dados, id, agora());
      if (r.duplicado) return { ok: true, valor: { pedido: r.pedido, duplicado: true } };
      const g = gravar(r.lista);
      return g.ok ? { ok: true, valor: { pedido: r.pedido, duplicado: false } } : g;
    },
    editar(id: string, dados: PedidoInput): Resultado<{ alterados: CampoForm[] }> {
      iniciar();
      const r = atualizarPedido(estado.pedidos, id, dados, agora());
      if (!r) return { ok: false, mensagem: "Pedido não encontrado. Ele pode ter sido excluído." };
      if (r.alterados.length === 0) return { ok: true, valor: { alterados: [] } };
      const g = gravar(r.lista);
      return g.ok ? { ok: true, valor: { alterados: r.alterados } } : g;
    },
    mudarStatus(id: string, status: Status): Resultado {
      iniciar();
      const lista = alterarStatus(estado.pedidos, id, status, agora());
      if (!lista)
        return { ok: false, mensagem: "Pedido não encontrado. Ele pode ter sido excluído." };
      if (lista === estado.pedidos) return { ok: true, valor: undefined };
      return gravar(lista);
    },
    excluir(id: string): Resultado {
      iniciar();
      if (!estado.pedidos.some((p) => p.id === id)) {
        return { ok: false, mensagem: "Pedido não encontrado. Ele pode já ter sido excluído." };
      }
      return gravar(removerPedido(estado.pedidos, id));
    },
    carregarExemplos(): Resultado<{ adicionados: number }> {
      iniciar();
      const r = adicionarExemplos(estado.pedidos, agora());
      if (r.adicionados === 0) return { ok: true, valor: { adicionados: 0 } };
      const g = gravar(r.lista);
      return g.ok ? { ok: true, valor: { adicionados: r.adicionados } } : g;
    },
    limpar(): Resultado {
      try {
        const a = obterArmazenamento();
        if (!a) throw new Error("indisponível");
        a.removeItem(STORAGE_KEY);
      } catch {
        return {
          ok: false,
          mensagem:
            "Não foi possível limpar o armazenamento local deste navegador. Os dados podem continuar salvos.",
        };
      }
      estado = { fase: "pronto", pedidos: [] };
      emitir();
      return { ok: true, valor: undefined };
    },
  };
}

const SNAPSHOT_SERVIDOR: EstadoPedidos = { fase: "carregando", pedidos: [] };

export const repositorio = criarRepositorio(() =>
  typeof window === "undefined" ? null : window.localStorage,
);

let ouvindoOutrasAbas = false;
function assinar(ouvinte: () => void) {
  if (!ouvindoOutrasAbas && typeof window !== "undefined") {
    ouvindoOutrasAbas = true;
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY || e.key === null) repositorio.recarregar();
    });
  }
  return repositorio.subscribe(ouvinte);
}

export function usePedidos(): EstadoPedidos {
  return useSyncExternalStore(assinar, repositorio.getSnapshot, () => SNAPSHOT_SERVIDOR);
}
