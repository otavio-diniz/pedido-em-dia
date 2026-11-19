import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, Eye, ListChecks, ShieldCheck, X } from "lucide-react";

import { EtapasStatus, PrioridadeBadge, StatusBadge } from "@/components/pedidos/status-visual";
import { TEXTO_AVISO } from "@/components/site/AvisoEducacional";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pedido em Dia — Solicitar com clareza. Acompanhar com simplicidade." },
      {
        name: "description",
        content:
          "Protótipo educacional para simular pedidos de pequenos serviços de manutenção residencial com dados fictícios. Nenhum atendimento é contratado.",
      },
      { property: "og:title", content: "Pedido em Dia — protótipo educacional" },
      {
        property: "og:description",
        content: "Solicitar com clareza. Acompanhar com simplicidade. Use somente dados fictícios.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const PASSOS = [
  {
    icone: ClipboardList,
    titulo: "Descreva o serviço",
    texto: "Escolha a categoria, dê um título curto e explique o que precisa — tudo fictício.",
  },
  {
    icone: Eye,
    titulo: "Revise e confirme",
    texto: "Confira o resumo antes de gravar. Volte para ajustar ou cancele sem salvar nada.",
  },
  {
    icone: ListChecks,
    titulo: "Acompanhe o status",
    texto:
      "No painel de demonstração, o pedido avança de Novo para Em análise, Agendado e Concluído.",
  },
];

function Index() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="paper-grid absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]"
          aria-hidden="true"
        />
        <div className="page-container relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <h1 className="text-5xl font-semibold leading-[1.05] sm:text-6xl">Pedido em Dia</h1>
            <p className="mt-4 max-w-lg text-xl text-muted-foreground sm:text-2xl">
              Solicitar com clareza. Acompanhar com simplicidade.
            </p>
            <p className="mt-6 inline-flex max-w-lg items-start gap-2 rounded-lg border-2 border-notice-border bg-notice px-4 py-3 font-bold text-notice-foreground">
              <ShieldCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              {TEXTO_AVISO}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/solicitar" className={buttonVariants({ variant: "hero", size: "lg" })}>
                Solicitar serviço
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link to="/painel" className={buttonVariants({ variant: "quiet", size: "lg" })}>
                Abrir painel de demonstração
              </Link>
            </div>
          </div>

          <div aria-hidden="true" className="relative mx-auto w-full max-w-sm">
            <div className="absolute -right-3 -top-3 h-full w-full rotate-2 rounded-xl border border-border bg-muted" />
            <div className="relative rounded-xl border border-border bg-card p-5 shadow-lift">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-muted-foreground">
                  PED-EXEMPLO
                </span>
                <StatusBadge status="Agendado" />
              </div>
              <p className="mt-3 font-display text-lg font-semibold">Montar estante de livros</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
                  Montagem
                </span>
                <PrioridadeBadge prioridade="Normal" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Estante de cinco prateleiras ainda na caixa, com manual.
              </p>
              <div className="mt-4">
                <EtapasStatus status="Agendado" />
              </div>
              <p className="mt-4 rounded-md bg-muted px-3 py-2 text-xs">
                <strong>Última alteração:</strong> Status alterado de Em análise para Agendado.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="como-funciona" className="page-container py-14">
        <h2 id="como-funciona" className="text-3xl font-semibold">
          Como funciona
        </h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {PASSOS.map(({ icone: Icone, titulo, texto }, i) => (
            <li key={titulo} className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-primary font-display text-lg font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <Icone className="size-5 text-primary" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{titulo}</h3>
              <p className="mt-2 text-muted-foreground">{texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="limites" className="page-container">
        <div className="grid gap-6 rounded-xl border border-border bg-surface p-6 sm:p-8 md:grid-cols-2">
          <div>
            <h2 id="limites" className="text-2xl font-semibold">
              O que este protótipo faz
            </h2>
            <ul className="mt-4 space-y-2">
              {[
                "Simula a criação de pedidos fictícios com revisão antes de gravar.",
                "Mostra um painel local para mudar status, editar e excluir.",
                "Guarda os pedidos apenas neste navegador.",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <ShieldCheck className="mt-1 size-4 shrink-0 text-success" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">O que ele não faz</h2>
            <ul className="mt-4 space-y-2">
              {[
                "Não contrata, agenda ou presta nenhum serviço real.",
                "Não envia nada por WhatsApp, e-mail ou qualquer servidor.",
                "Não pede nem guarda dados pessoais, e não tem login.",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <X className="mt-1 size-4 shrink-0 text-destructive" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
