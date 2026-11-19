import type { PedidoInput } from "@/lib/pedidos/model";

import { PrioridadeBadge } from "./status-visual";

export function ResumoPedido({ dados }: { dados: PedidoInput }) {
  const linhas: [string, React.ReactNode][] = [
    ["Categoria", dados.categoria],
    ["Título", dados.titulo],
    ["Descrição", <span className="whitespace-pre-wrap">{dados.descricao}</span>],
    [
      "Bairro fictício",
      dados.bairro || <span className="text-muted-foreground">Não informado</span>,
    ],
    ["Prioridade", <PrioridadeBadge prioridade={dados.prioridade} />],
  ];
  return (
    <dl className="divide-y divide-border rounded-lg border border-border bg-surface">
      {linhas.map(([rotulo, valor]) => (
        <div key={rotulo} className="grid gap-1 px-4 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
          <dt className="text-sm font-bold text-muted-foreground">{rotulo}</dt>
          <dd className="break-words">{valor}</dd>
        </div>
      ))}
    </dl>
  );
}
