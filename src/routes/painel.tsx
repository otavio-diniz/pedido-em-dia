import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, Inbox, Search, ShieldAlert, Sparkles, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { CartaoPedido } from "@/components/pedidos/CartaoPedido";
import { EditarPedidoDialog } from "@/components/pedidos/EditarPedidoDialog";
import { ICONE_STATUS, StatusBadge } from "@/components/pedidos/status-visual";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  STATUS,
  contarPorStatus,
  filtrarPedidos,
  type Pedido,
  type Status,
} from "@/lib/pedidos/model";
import { repositorio, usePedidos } from "@/lib/pedidos/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/painel")({
  head: () => ({
    meta: [
      { title: "Painel de demonstração — Pedido em Dia" },
      {
        name: "description",
        content:
          "Painel local para acompanhar e alterar o status de pedidos fictícios salvos neste navegador.",
      },
      { property: "og:title", content: "Painel de demonstração — Pedido em Dia" },
      {
        property: "og:description",
        content: "Acompanhe pedidos fictícios: Novo, Em análise, Agendado e Concluído.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PainelPage,
});

type Confirmacao =
  | { tipo: "status"; pedido: Pedido; novo: Status }
  | { tipo: "excluir"; pedido: Pedido }
  | { tipo: "limpar" }
  | null;

function PainelPage() {
  const { fase, pedidos, aviso } = usePedidos();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<Status | "Todos">("Todos");
  const [editando, setEditando] = useState<Pedido | null>(null);
  const [confirmacao, setConfirmacao] = useState<Confirmacao>(null);
  const [anuncio, setAnuncio] = useState("");

  const contagens = useMemo(() => contarPorStatus(pedidos), [pedidos]);
  const visiveis = useMemo(
    () => filtrarPedidos(pedidos, { busca, status: filtroStatus }),
    [pedidos, busca, filtroStatus],
  );

  function informar(ok: boolean, mensagem: string) {
    setAnuncio(mensagem);
    if (ok) toast.success(mensagem);
    else toast.error(mensagem);
  }

  function executarConfirmacao() {
    if (!confirmacao) return;
    if (confirmacao.tipo === "status") {
      const { pedido, novo } = confirmacao;
      const r = repositorio.mudarStatus(pedido.id, novo);
      informar(
        r.ok,
        r.ok ? `Status de ${pedido.id} alterado de ${pedido.status} para ${novo}.` : r.mensagem,
      );
    } else if (confirmacao.tipo === "excluir") {
      const r = repositorio.excluir(confirmacao.pedido.id);
      informar(r.ok, r.ok ? `Pedido ${confirmacao.pedido.id} excluído.` : r.mensagem);
    } else {
      const r = repositorio.limpar();
      if (r.ok) {
        setBusca("");
        setFiltroStatus("Todos");
      }
      informar(
        r.ok,
        r.ok ? "Demonstração limpa. Nenhum pedido salvo neste navegador." : r.mensagem,
      );
    }
    setConfirmacao(null);
  }

  function carregarExemplos() {
    const r = repositorio.carregarExemplos();
    if (!r.ok) return informar(false, r.mensagem);
    informar(
      true,
      r.valor.adicionados === 0
        ? "Os exemplos fictícios já estão no painel."
        : `${r.valor.adicionados} exemplos fictícios carregados.`,
    );
  }

  const textoConfirmacao = (() => {
    if (!confirmacao) return null;
    if (confirmacao.tipo === "status")
      return {
        titulo: "Alterar status?",
        corpo: `O pedido ${confirmacao.pedido.id} passará de “${confirmacao.pedido.status}” para “${confirmacao.novo}”.`,
        acao: "Alterar status",
        perigo: false,
      };
    if (confirmacao.tipo === "excluir")
      return {
        titulo: "Excluir pedido?",
        corpo: `O pedido ${confirmacao.pedido.id} (“${confirmacao.pedido.titulo}”) será removido deste navegador. Esta ação não pode ser desfeita.`,
        acao: "Excluir pedido",
        perigo: true,
      };
    return {
      titulo: "Limpar demonstração?",
      corpo: `Todos os ${pedidos.length} pedido(s) salvos neste navegador serão apagados. Esta ação não pode ser desfeita.`,
      acao: "Limpar tudo",
      perigo: true,
    };
  })();

  return (
    <main className="page-container py-10 sm:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-primary">
            Operador (demonstração)
          </p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Painel de pedidos</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Acompanhe e atualize os pedidos fictícios salvos neste navegador.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="quiet" onClick={carregarExemplos} disabled={fase !== "pronto"}>
            <Sparkles aria-hidden="true" />
            Carregar exemplos fictícios
          </Button>
          <Button
            variant="ghost"
            className="text-destructive hover:bg-urgente-soft hover:text-destructive"
            onClick={() => setConfirmacao({ tipo: "limpar" })}
            disabled={fase !== "pronto" || pedidos.length === 0}
          >
            <Trash2 aria-hidden="true" />
            Limpar demonstração
          </Button>
        </div>
      </div>

      <div className="mt-6 flex gap-3 rounded-lg border border-border bg-surface p-4 text-sm">
        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-urgente" aria-hidden="true" />
        <p>
          <strong>Este não é um painel administrativo seguro.</strong> Não há login, servidor nem
          sincronização: os dados ficam apenas neste navegador e qualquer pessoa com acesso a ele
          pode vê-los ou alterá-los. Limpar os dados do navegador apaga os pedidos.
        </p>
      </div>

      {aviso && (
        <div
          role="alert"
          className="mt-4 flex gap-2 rounded-lg border border-destructive/40 bg-urgente-soft p-4 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          {aviso}
        </div>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {anuncio}
      </p>

      <section aria-labelledby="resumo-titulo" className="mt-8">
        <h2 id="resumo-titulo" className="sr-only">
          Contagem por status
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {STATUS.map((s) => {
            const Icone = ICONE_STATUS[s];
            const ativo = filtroStatus === s;
            return (
              <button
                key={s}
                type="button"
                aria-pressed={ativo}
                onClick={() => setFiltroStatus(ativo ? "Todos" : s)}
                className={cn(
                  "rounded-xl border bg-card p-4 text-left shadow-card transition-colors hover:bg-muted",
                  ativo ? "border-primary ring-2 ring-primary/30" : "border-border",
                )}
              >
                <span className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                  <Icone className="size-4" aria-hidden="true" />
                  {s}
                </span>
                <span className="mt-1 block font-display text-3xl font-semibold">
                  {fase === "carregando" ? "–" : contagens[s]}
                </span>
                <span className="text-xs text-muted-foreground">
                  {ativo ? "Filtro ativo · clique para remover" : "Clique para filtrar"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="lista-titulo" className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="busca" className="mb-1.5 block text-sm font-bold">
              Buscar
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="busca"
                type="search"
                className="field-control pl-9"
                placeholder="Código, título, descrição, categoria ou bairro"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-56">
            <label htmlFor="filtro-status" className="mb-1.5 block text-sm font-bold">
              Status
            </label>
            <select
              id="filtro-status"
              className="field-control"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value as Status | "Todos")}
            >
              <option value="Todos">Todos ({pedidos.length})</option>
              {STATUS.map((s) => (
                <option key={s} value={s}>
                  {s} ({contagens[s]})
                </option>
              ))}
            </select>
          </div>
        </div>

        <h2 id="lista-titulo" className="mt-6 text-lg font-semibold">
          {fase === "carregando"
            ? "Carregando pedidos deste navegador…"
            : `Mostrando ${visiveis.length} de ${pedidos.length} pedido(s)`}
          {filtroStatus !== "Todos" && (
            <span className="ml-2 align-middle">
              <StatusBadge status={filtroStatus} />
            </span>
          )}
        </h2>

        {fase === "carregando" ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-xl border border-border bg-muted"
              />
            ))}
          </div>
        ) : pedidos.length === 0 ? (
          <EstadoVazio
            titulo="Nenhum pedido neste navegador"
            texto="Crie uma solicitação fictícia ou carregue exemplos para explorar o painel."
          >
            <Link to="/solicitar" className={buttonVariants()}>
              Solicitar serviço
            </Link>
            <Button variant="quiet" onClick={carregarExemplos} disabled={fase !== "pronto"}>
              Carregar exemplos fictícios
            </Button>
          </EstadoVazio>
        ) : visiveis.length === 0 ? (
          <EstadoVazio
            titulo="Nenhum pedido encontrado"
            texto="Nenhum pedido corresponde à busca ou ao filtro."
          >
            <Button
              variant="quiet"
              onClick={() => {
                setBusca("");
                setFiltroStatus("Todos");
              }}
            >
              Limpar busca e filtro
            </Button>
          </EstadoVazio>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visiveis.map((p) => (
              <CartaoPedido
                key={p.id}
                pedido={p}
                onEditar={setEditando}
                onExcluir={(pedido) => setConfirmacao({ tipo: "excluir", pedido })}
                onStatus={(pedido, novo) =>
                  novo !== pedido.status && setConfirmacao({ tipo: "status", pedido, novo })
                }
              />
            ))}
          </div>
        )}
      </section>

      <EditarPedidoDialog pedido={editando} onClose={() => setEditando(null)} />

      <AlertDialog open={confirmacao !== null} onOpenChange={(a) => !a && setConfirmacao(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl">
              {textoConfirmacao?.titulo}
            </AlertDialogTitle>
            <AlertDialogDescription>{textoConfirmacao?.corpo}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className={cn(textoConfirmacao?.perigo && buttonVariants({ variant: "destructive" }))}
              onClick={executarConfirmacao}
            >
              {textoConfirmacao?.acao}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

function EstadoVazio({
  titulo,
  texto,
  children,
}: {
  titulo: string;
  texto: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 rounded-xl border border-dashed border-input bg-surface px-6 py-12 text-center">
      <Inbox className="mx-auto size-10 text-muted-foreground" aria-hidden="true" />
      <p className="mt-3 font-display text-xl font-semibold">{titulo}</p>
      <p className="mt-1 text-muted-foreground">{texto}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div>
    </div>
  );
}
