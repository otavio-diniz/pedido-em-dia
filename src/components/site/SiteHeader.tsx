import { Link } from "@tanstack/react-router";
import { ClipboardCheck } from "lucide-react";

import { FaixaAviso } from "./AvisoEducacional";

const linkBase =
  "rounded-md px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <FaixaAviso />
      <div className="border-b border-border">
        <div className="page-container flex flex-wrap items-center justify-between gap-2 py-3">
          <Link to="/" className="flex items-center gap-2 rounded-md">
            <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
              <ClipboardCheck className="size-5" aria-hidden="true" />
            </span>
            <span className="font-display text-xl font-semibold">Pedido em Dia</span>
          </Link>
          <nav aria-label="Navegação principal" className="flex flex-wrap items-center gap-1">
            <Link
              to="/"
              className={linkBase}
              activeOptions={{ exact: true }}
              activeProps={{ className: "bg-muted text-foreground", "aria-current": "page" }}
            >
              Início
            </Link>
            <Link
              to="/solicitar"
              className={linkBase}
              activeProps={{ className: "bg-muted text-foreground", "aria-current": "page" }}
            >
              Solicitar serviço
            </Link>
            <Link
              to="/painel"
              className={linkBase}
              activeProps={{ className: "bg-muted text-foreground", "aria-current": "page" }}
            >
              Painel (demo)
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="page-container grid gap-3 py-8 text-sm text-muted-foreground sm:grid-cols-2">
        <p>
          <strong className="text-foreground">Pedido em Dia</strong> é um protótipo educacional. Não
          presta serviços, não contrata atendimento e não coleta dados pessoais.
        </p>
        <p>
          Os pedidos ficam salvos apenas neste navegador. Não há sincronização, servidor nem
          proteção entre usuários.
        </p>
      </div>
    </footer>
  );
}
