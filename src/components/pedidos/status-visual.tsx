import { cva } from "class-variance-authority";
import {
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  CircleDot,
  Clock,
  Search,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { STATUS, etapaDoStatus, type Prioridade, type Status } from "@/lib/pedidos/model";

export const ICONE_STATUS: Record<Status, LucideIcon> = {
  Novo: CircleDot,
  "Em análise": Search,
  Agendado: CalendarCheck,
  Concluído: CheckCircle2,
};

export const statusVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold [&_svg]:size-3.5",
  {
    variants: {
      status: {
        Novo: "border-status-novo/30 bg-status-novo-soft text-status-novo",
        "Em análise": "border-status-analise/30 bg-status-analise-soft text-status-analise",
        Agendado: "border-status-agendado/30 bg-status-agendado-soft text-status-agendado",
        Concluído: "border-status-concluido/30 bg-status-concluido-soft text-status-concluido",
      },
    },
  },
);

const barraVariants = cva("h-1.5 rounded-full", {
  variants: {
    status: {
      Novo: "bg-status-novo",
      "Em análise": "bg-status-analise",
      Agendado: "bg-status-agendado",
      Concluído: "bg-status-concluido",
    },
  },
});

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const Icone = ICONE_STATUS[status];
  return (
    <span className={cn(statusVariants({ status }), className)}>
      <Icone aria-hidden="true" />
      {status}
    </span>
  );
}

export function EtapasStatus({ status }: { status: Status }) {
  const atual = etapaDoStatus(status);
  return (
    <div>
      <p className="text-xs font-bold text-muted-foreground">
        Etapa {atual} de {STATUS.length}: <span className="text-foreground">{status}</span>
      </p>
      <ol
        className="mt-1.5 grid grid-cols-4 gap-1"
        aria-label={`Progresso: etapa ${atual} de ${STATUS.length}`}
      >
        {STATUS.map((s, i) => {
          const n = i + 1;
          const situacao = n < atual ? "concluída" : n === atual ? "atual" : "pendente";
          return (
            <li key={s} className="min-w-0">
              <div
                className={cn(
                  n <= atual ? barraVariants({ status }) : "h-1.5 rounded-full bg-border",
                )}
              />
              <span className="sr-only">
                {s}: {situacao}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function PrioridadeBadge({ prioridade }: { prioridade: Prioridade }) {
  if (prioridade === "Urgente") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-urgente/30 bg-urgente-soft px-2.5 py-0.5 text-xs font-bold text-urgente [&_svg]:size-3.5">
        <AlertTriangle aria-hidden="true" />
        Prioridade: Urgente
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground [&_svg]:size-3.5">
      <Clock aria-hidden="true" />
      Prioridade: Normal
    </span>
  );
}
