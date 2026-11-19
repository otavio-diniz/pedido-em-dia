import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { CamposPedido, idCampo } from "@/components/pedidos/CamposPedido";
import { ResumoPedido } from "@/components/pedidos/ResumoPedido";
import { CaixaAviso } from "@/components/site/AvisoEducacional";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ORDEM_CAMPOS,
  VALORES_INICIAIS,
  gerarId,
  validarFormulario,
  type CampoForm,
  type ErrosForm,
  type Pedido,
  type PedidoInput,
  type ValoresForm,
} from "@/lib/pedidos/model";
import { repositorio, usePedidos } from "@/lib/pedidos/store";

export const Route = createFileRoute("/solicitar")({
  head: () => ({
    meta: [
      { title: "Solicitar serviço — Pedido em Dia (protótipo)" },
      {
        name: "description",
        content:
          "Formulário de demonstração para criar um pedido fictício de pequeno reparo residencial. Nenhum atendimento é contratado.",
      },
      { property: "og:title", content: "Solicitar serviço — Pedido em Dia" },
      {
        property: "og:description",
        content: "Crie um pedido fictício de manutenção residencial e revise antes de confirmar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SolicitarPage,
});

const PREFIXO = "novo";

function SolicitarPage() {
  const { fase } = usePedidos();
  const [valores, setValores] = useState<ValoresForm>(VALORES_INICIAIS);
  const [erros, setErros] = useState<ErrosForm>({});
  const [resumoErros, setResumoErros] = useState("");
  const [revisao, setRevisao] = useState<{ dados: PedidoInput; id: string } | null>(null);
  const [erroGravar, setErroGravar] = useState("");
  const [criado, setCriado] = useState<Pedido | null>(null);
  const [confirmando, setConfirmando] = useState(false);
  const travaConfirmar = useRef(false);
  const tituloSucessoRef = useRef<HTMLHeadingElement>(null);

  function alterar(campo: CampoForm, valor: string) {
    setValores((v) => ({ ...v, [campo]: valor }));
    if (erros[campo]) setErros((e) => ({ ...e, [campo]: undefined }));
  }

  function revisar(e: React.FormEvent) {
    e.preventDefault();
    const r = validarFormulario(valores);
    if (!r.ok) {
      setErros(r.erros);
      const n = Object.keys(r.erros).length;
      setResumoErros(
        n === 1
          ? "Há 1 campo para corrigir antes de revisar."
          : `Há ${n} campos para corrigir antes de revisar.`,
      );
      const primeiro = ORDEM_CAMPOS.find((c) => r.erros[c]);
      if (primeiro) document.getElementById(idCampo(PREFIXO, primeiro))?.focus();
      return;
    }
    setErros({});
    setResumoErros("");
    setErroGravar("");
    const existentes = repositorio.getSnapshot().pedidos.map((p) => p.id);
    // O ID é reservado ao abrir a revisão: confirmar duas vezes nunca cria dois pedidos.
    setRevisao({ dados: r.dados, id: gerarId(existentes) });
  }

  function voltar() {
    setRevisao(null);
    setErroGravar("");
  }

  function cancelar() {
    setRevisao(null);
    setErroGravar("");
    setValores(VALORES_INICIAIS);
    toast.info("Solicitação cancelada. Nada foi gravado.");
  }

  function confirmar() {
    if (!revisao || travaConfirmar.current) return;
    travaConfirmar.current = true;
    setConfirmando(true);
    const r = repositorio.confirmarNovo(revisao.dados, revisao.id);
    travaConfirmar.current = false;
    setConfirmando(false);
    if (!r.ok) {
      setErroGravar(r.mensagem);
      toast.error(r.mensagem);
      return;
    }
    setRevisao(null);
    setValores(VALORES_INICIAIS);
    setCriado(r.valor.pedido);
    toast.success(
      r.valor.duplicado
        ? `O pedido ${r.valor.pedido.id} já estava gravado. Nenhuma cópia foi criada.`
        : `Pedido ${r.valor.pedido.id} criado com status Novo. Salvo apenas neste navegador.`,
    );
    requestAnimationFrame(() => tituloSucessoRef.current?.focus());
  }

  return (
    <main className="page-container py-10 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-wider text-primary">
          Solicitante (demonstração)
        </p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Solicitar serviço</h1>
        <p className="mt-3 text-muted-foreground">
          Descreva um pequeno serviço de manutenção <strong>fictício</strong>. Você revisa tudo
          antes de confirmar — nada é gravado até lá.
        </p>

        <CaixaAviso className="mt-6">
          <p className="font-bold">Não informe dados pessoais.</p>
          <p>
            Este formulário não pede nome, CPF, e-mail, telefone, endereço ou anexos. Campos com
            e-mail, telefone ou documentos serão recusados.
          </p>
        </CaixaAviso>

        {fase === "indisponivel" && (
          <div
            role="alert"
            className="mt-4 flex gap-2 rounded-lg border border-destructive/40 bg-urgente-soft p-4 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />O armazenamento
            local deste navegador está indisponível. Você pode preencher, mas o pedido não poderá
            ser salvo.
          </div>
        )}

        {criado ? (
          <section
            aria-labelledby="sucesso-titulo"
            className="mt-8 rounded-xl border border-success/30 bg-success-soft p-6 shadow-card"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 size-6 shrink-0 text-success" aria-hidden="true" />
              <div>
                <h2
                  id="sucesso-titulo"
                  ref={tituloSucessoRef}
                  tabIndex={-1}
                  className="text-2xl font-semibold"
                >
                  Pedido {criado.id} registrado
                </h2>
                <p className="mt-2">
                  Status inicial: <strong>Novo</strong>. Ele foi salvo somente neste navegador e
                  nenhum atendimento real foi solicitado.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button asChild>
                    <Link to="/painel">Ver no painel</Link>
                  </Button>
                  <Button variant="quiet" onClick={() => setCriado(null)}>
                    Nova solicitação
                  </Button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <form
            noValidate
            onSubmit={revisar}
            className="mt-8 rounded-xl border border-border bg-card p-5 shadow-card sm:p-8"
            aria-describedby="resumo-erros"
          >
            <div id="resumo-erros" role="alert" aria-live="assertive">
              {resumoErros && (
                <p className="mb-6 flex gap-2 rounded-md border border-destructive/40 bg-urgente-soft p-3 text-sm font-bold text-destructive">
                  <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
                  {resumoErros}
                </p>
              )}
            </div>
            <CamposPedido prefixo={PREFIXO} valores={valores} erros={erros} onChange={alterar} />
            <div className="mt-8 flex flex-col-reverse gap-2 border-t border-border pt-6 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setValores(VALORES_INICIAIS);
                  setErros({});
                  setResumoErros("");
                }}
              >
                Limpar campos
              </Button>
              <Button type="submit" variant="hero" size="lg">
                Revisar solicitação
              </Button>
            </div>
          </form>
        )}
      </div>

      <Dialog open={revisao !== null} onOpenChange={(aberto) => !aberto && voltar()}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Revisar solicitação</DialogTitle>
            <DialogDescription>
              Confira os dados fictícios. Nada foi gravado ainda. “Voltar” mantém o que você
              preencheu; “Cancelar” descarta sem gravar.
            </DialogDescription>
          </DialogHeader>
          {revisao && <ResumoPedido dados={revisao.dados} />}
          <p className="text-sm text-muted-foreground">
            Ao confirmar, o pedido recebe o código{" "}
            <strong className="text-foreground">{revisao?.id}</strong>, status{" "}
            <strong className="text-foreground">Novo</strong> e fica salvo apenas neste navegador.
          </p>
          {erroGravar && (
            <p
              role="alert"
              className="flex gap-2 rounded-md border border-destructive/40 bg-urgente-soft p-3 text-sm font-bold text-destructive"
            >
              <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
              {erroGravar}
            </p>
          )}
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="quiet" onClick={voltar}>
              Voltar
            </Button>
            <Button variant="ghost" onClick={cancelar}>
              Cancelar
            </Button>
            <Button onClick={confirmar} disabled={confirmando}>
              {confirmando ? "Confirmando…" : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
