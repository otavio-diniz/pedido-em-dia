import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

export const TEXTO_AVISO =
  "Protótipo educacional — use somente dados fictícios. Nenhum atendimento é contratado.";

export function FaixaAviso() {
  return (
    <div className="border-b border-notice-border bg-notice text-notice-foreground">
      <p className="page-container flex items-center justify-center gap-2 py-2 text-center text-sm font-bold">
        <Info className="size-4 shrink-0" aria-hidden="true" />
        {TEXTO_AVISO}
      </p>
    </div>
  );
}

export function CaixaAviso({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border border-notice-border bg-notice p-4 text-sm text-notice-foreground",
        className,
      )}
    >
      <Info className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div className="space-y-1">{children}</div>
    </div>
  );
}
