import { MapPin, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { STATUS, type Pedido, type Status } from "@/lib/pedidos/model";
import { formatarData } from "@/lib/pedidos/format";

import { EtapasStatus, PrioridadeBadge, StatusBadge } from "./status-visual";

type Props = {
  pedido: Pedido;
  onEditar: (p: Pedido) => void;
  onExcluir: (p: Pedido) => void;
  onStatus: (p: Pedido, s: Status) => void;
};

export function CartaoPedido({ pedido, onEditar, onExcluir, onStatus }: Props) {
  const idStatus = `status-${pedido.id}`;
  return (
    <article
      aria-labelledby={`titulo-${pedido.id}`}
      className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-xs font-bold tracking-wide text-muted-foreground">
          {pedido.id}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {pedido.exemplo && (
            <span className="rounded-full border border-notice-border bg-notice px-2.5 py-0.5 text-xs font-bold text-notice-foreground">
              Exemplo fictício
            </span>
          )}
          <StatusBadge status={pedido.status} />
        </div>
      </div>

      <h3 id={`titulo-${pedido.id}`} className="mt-3 text-lg font-semibold leading-snug">
        {pedido.titulo}
      </h3>
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-sm">
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
          {pedido.categoria}
        </span>
        <PrioridadeBadge prioridade={pedido.prioridade} />
        {pedido.bairro && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden="true" />
            {pedido.bairro} <span className="sr-only">(bairro fictício)</span>
          </span>
        )}
      </div>
      <p className="mt-3 line-clamp-4 whitespace-pre-wrap break-words text-sm text-muted-foreground">
        {pedido.descricao}
      </p>

      <div className="mt-4">
        <EtapasStatus status={pedido.status} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div>
          <dt className="font-bold">Criado em</dt>
          <dd>{formatarData(pedido.criadoEm)}</dd>
        </div>
        <div>
          <dt className="font-bold">Atualizado em</dt>
          <dd>{formatarData(pedido.atualizadoEm)}</dd>
        </div>
      </dl>
      {pedido.ultimaAlteracao && (
        <p className="mt-2 rounded-md bg-muted px-3 py-2 text-xs">
          <strong>Última alteração:</strong> {pedido.ultimaAlteracao}
        </p>
      )}

      <div className="flex-1" />
      <div className="mt-4 flex flex-wrap items-end gap-2 border-t border-border pt-4">
        <div className="min-w-40 flex-1">
          <label htmlFor={idStatus} className="mb-1 block text-xs font-bold">
            Alterar status
          </label>
          <select
            id={idStatus}
            className="field-control py-2 text-sm"
            value={pedido.status}
            onChange={(e) => onStatus(pedido, e.target.value as Status)}
          >
            {STATUS.map((s, i) => (
              <option key={s} value={s}>
                {i + 1}. {s}
              </option>
            ))}
          </select>
        </div>
        <Button variant="quiet" size="sm" className="h-10" onClick={() => onEditar(pedido)}>
          <Pencil aria-hidden="true" />
          Editar <span className="sr-only">pedido {pedido.id}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 text-destructive hover:bg-urgente-soft hover:text-destructive"
          onClick={() => onExcluir(pedido)}
        >
          <Trash2 aria-hidden="true" />
          Excluir <span className="sr-only">pedido {pedido.id}</span>
        </Button>
      </div>
    </article>
  );
}
