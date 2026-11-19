import { AlertCircle } from "lucide-react";

import {
  CATEGORIAS,
  LIMITES,
  PRIORIDADES,
  type CampoForm,
  type ErrosForm,
  type ValoresForm,
} from "@/lib/pedidos/model";
import { cn } from "@/lib/utils";

type Props = {
  prefixo: string;
  valores: ValoresForm;
  erros: ErrosForm;
  onChange: (campo: CampoForm, valor: string) => void;
};

export function idCampo(prefixo: string, campo: CampoForm) {
  return `${prefixo}-${campo}`;
}

function Erro({ id, mensagem }: { id: string; mensagem?: string | undefined }) {
  if (!mensagem) return null;
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm font-bold text-destructive">
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>
        <span className="sr-only">Erro: </span>
        {mensagem}
      </span>
    </p>
  );
}

function Rotulo({
  htmlFor,
  children,
  opcional,
}: {
  htmlFor: string;
  children: React.ReactNode;
  opcional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block font-bold">
      {children}{" "}
      <span className="text-sm font-normal text-muted-foreground">
        {opcional ? "(opcional)" : "(obrigatório)"}
      </span>
    </label>
  );
}

export function CamposPedido({ prefixo, valores, erros, onChange }: Props) {
  const id = (c: CampoForm) => idCampo(prefixo, c);
  const desc = (c: CampoForm, ...extras: string[]) =>
    [...extras, erros[c] ? `${id(c)}-erro` : ""].filter(Boolean).join(" ") || undefined;

  return (
    <div className="space-y-6">
      <div>
        <Rotulo htmlFor={id("categoria")}>Categoria</Rotulo>
        <select
          id={id("categoria")}
          name="categoria"
          className="field-control"
          value={valores.categoria}
          aria-invalid={erros.categoria ? true : undefined}
          aria-describedby={desc("categoria")}
          onChange={(e) => onChange("categoria", e.target.value)}
        >
          <option value="">Selecione uma categoria</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <Erro id={`${id("categoria")}-erro`} mensagem={erros.categoria} />
      </div>

      <div>
        <Rotulo htmlFor={id("titulo")}>Título curto</Rotulo>
        <input
          id={id("titulo")}
          name="titulo"
          className="field-control"
          value={valores.titulo}
          maxLength={LIMITES.tituloMax}
          autoComplete="off"
          placeholder="Ex.: Torneira pingando no banheiro"
          aria-invalid={erros.titulo ? true : undefined}
          aria-describedby={desc("titulo", `${id("titulo")}-dica`)}
          onChange={(e) => onChange("titulo", e.target.value)}
        />
        <p id={`${id("titulo")}-dica`} className="mt-1.5 text-sm text-muted-foreground">
          De {LIMITES.tituloMin} a {LIMITES.tituloMax} caracteres · {valores.titulo.trim().length}/
          {LIMITES.tituloMax}
        </p>
        <Erro id={`${id("titulo")}-erro`} mensagem={erros.titulo} />
      </div>

      <div>
        <Rotulo htmlFor={id("descricao")}>Descrição</Rotulo>
        <textarea
          id={id("descricao")}
          name="descricao"
          rows={5}
          className="field-control min-h-32 resize-y"
          value={valores.descricao}
          maxLength={LIMITES.descricaoMax}
          placeholder="Conte o que precisa ser feito. Não inclua nomes, telefones, e-mails ou endereço."
          aria-invalid={erros.descricao ? true : undefined}
          aria-describedby={desc("descricao", `${id("descricao")}-dica`)}
          onChange={(e) => onChange("descricao", e.target.value)}
        />
        <p id={`${id("descricao")}-dica`} className="mt-1.5 text-sm text-muted-foreground">
          De {LIMITES.descricaoMin} a {LIMITES.descricaoMax} caracteres ·{" "}
          {valores.descricao.trim().length}/{LIMITES.descricaoMax}
        </p>
        <Erro id={`${id("descricao")}-erro`} mensagem={erros.descricao} />
      </div>

      <div>
        <Rotulo htmlFor={id("bairro")} opcional>
          Bairro fictício
        </Rotulo>
        <input
          id={id("bairro")}
          name="bairro"
          className="field-control"
          value={valores.bairro}
          maxLength={LIMITES.bairroMax}
          autoComplete="off"
          placeholder="Ex.: Vila Imaginária"
          aria-invalid={erros.bairro ? true : undefined}
          aria-describedby={desc("bairro", `${id("bairro")}-dica`)}
          onChange={(e) => onChange("bairro", e.target.value)}
        />
        <p id={`${id("bairro")}-dica`} className="mt-1.5 text-sm text-muted-foreground">
          Invente um nome. Não informe rua, número, CEP ou localização real.
        </p>
        <Erro id={`${id("bairro")}-erro`} mensagem={erros.bairro} />
      </div>

      <fieldset aria-describedby={desc("prioridade", `${id("prioridade")}-dica`)}>
        <legend className="mb-1.5 font-bold">
          Prioridade{" "}
          <span className="text-sm font-normal text-muted-foreground">(obrigatório)</span>
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {PRIORIDADES.map((p) => {
            const marcado = valores.prioridade === p;
            return (
              <label
                key={p}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border bg-surface p-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                  marcado ? "border-primary bg-accent" : "border-input hover:bg-muted",
                )}
              >
                <input
                  type="radio"
                  name={`${prefixo}-prioridade`}
                  value={p}
                  checked={marcado}
                  onChange={() => onChange("prioridade", p)}
                  className="mt-1 size-4 accent-primary"
                />
                <span>
                  <span className="block font-bold">{p}</span>
                  <span className="block text-sm text-muted-foreground">
                    {p === "Normal"
                      ? "Pode aguardar a ordem da fila."
                      : "Pede atenção antes dos demais."}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        <p
          id={`${id("prioridade")}-dica`}
          className="mt-2 rounded-md bg-urgente-soft px-3 py-2 text-sm text-urgente"
        >
          <strong>Atenção:</strong> “Urgente” não significa atendimento emergencial. Este protótipo
          não atende ninguém. Em emergência real, procure os serviços oficiais.
        </p>
        <Erro id={`${id("prioridade")}-erro`} mensagem={erros.prioridade} />
      </fieldset>
    </div>
  );
}
