import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatarData(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "data indisponível";
  return format(d, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}
