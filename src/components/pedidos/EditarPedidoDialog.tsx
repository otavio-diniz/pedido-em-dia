import { AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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
  camposAlterados,
  paraValoresForm,
  validarFormulario,
  type CampoForm,
  type ErrosForm,
  type Pedido,
  type PedidoInput,
  type ValoresForm,
} from "@/lib/pedidos/model";
import { repositorio } from "@/lib/pedidos/store";

import { CamposPedido, idCampo } from "./CamposPedido";
import { ResumoPedido } from "./ResumoPedido";

const NOMES: Record<CampoForm, string> = {
  categoria: "Categoria",
  titulo: "Título",
  descricao: "Descrição",
  bairro: "Bairro fictício",
  prioridade: "Prioridade",
};

export function EditarPedidoDialog({
  pedido,
  onClose,
}: {
  pedido: Pedido | null;
  onClose: () => void;
}) {
  const [valores, setValores] = useState<ValoresForm | null>(null);
  const [erros, setErros] = useState<ErrosForm>({});
  const [revisao, setRevisao] = useState<PedidoInput | null>(null);
  const [erroGravar, setErroGravar] = useState("");
  const trava = useRef(false);

  useEffect(() => {
    setValores(pedido ? paraValoresForm(pedido) : null);
    setErros({});
    setRevisao(null);
    setErroGravar("");
  }, [pedido]);

  if (!pedido || !valores) return null;
  const prefixo = `editar-${pedido.id}`;
  const alterados = revisao ? camposAlterados(pedido, revisao) : [];

  function revisar(e: React.FormEvent) {
    e.preventDefault();
    if (!valores) return;
    const r = validarFormulario(valores);
    if (!r.ok) {
      setErros(r.erros);
      const primeiro = ORDEM_CAMPOS.find((c) => r.erros[c]);
      if (primeiro) document.getElementById(idCampo(prefixo, primeiro))?.focus();
      return;
    }
    setErros({});
    setRevisao(r.dados);
  }

  function confirmar() {
    if (!pedido || !revisao || trava.current) return;
    trava.current = true;
    const r = repositorio.editar(pedido.id, revisao);
    trava.current = false;
    if (!r.ok) {
      setErroGravar(r.mensagem);
      toast.error(r.mensagem);
      return;
    }
    toast.success(
      r.valor.alterados.length === 0
        ? `Nenhuma alteração em ${pedido.id}.`
        : `Pedido ${pedido.id} atualizado: ${r.valor.alterados.map((c) => NOMES[c].toLowerCase()).join(", ")}.`,
    );
    onClose();
  }

  return (
    <Dialog open onOpenChange={(aberto) => !aberto && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {revisao ? "Revisar alterações" : `Editar pedido ${pedido.id}`}
          </DialogTitle>
          <DialogDescription>
            {revisao
              ? "Nada foi alterado ainda. Confirme para gravar neste navegador."
              : "O código e a data de criação não mudam. O status é alterado no próprio cartão."}
          </DialogDescription>
        </DialogHeader>

        {revisao ? (
          <>
            {alterados.length > 0 ? (
              <p className="rounded-md bg-accent px-3 py-2 text-sm">
                <strong>Campos alterados:</strong> {alterados.map((c) => NOMES[c]).join(", ")}.
              </p>
            ) : (
              <p className="rounded-md bg-muted px-3 py-2 text-sm">Nenhum campo foi alterado.</p>
            )}
            <ResumoPedido dados={revisao} />
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
              <Button variant="quiet" onClick={() => setRevisao(null)}>
                Voltar
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={confirmar}>Confirmar alterações</Button>
            </DialogFooter>
          </>
        ) : (
          <form noValidate onSubmit={revisar}>
            <CamposPedido
              prefixo={prefixo}
              valores={valores}
              erros={erros}
              onChange={(c, v) => {
                setValores((s) => (s ? { ...s, [c]: v } : s));
                if (erros[c]) setErros((e) => ({ ...e, [c]: undefined }));
              }}
            />
            <DialogFooter className="mt-6 gap-2 sm:gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Revisar alterações</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
