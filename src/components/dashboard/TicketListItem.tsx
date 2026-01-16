import { Calendar, User } from "lucide-react";
import type { Chamado } from "@/types/tickets";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

interface TicketListItemProps {
  chamado: Chamado;
  onClick: () => void;
}

export function TicketListItem({ chamado, onClick }: TicketListItemProps) {
  const formattedDate = new Date(chamado.dataAbertura).toLocaleDateString("pt-BR");

  return (
    <div
      onClick={onClick}
      className="p-6 hover:bg-muted/50 transition-colors cursor-pointer group flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
    >
      <div className="flex items-start gap-4">
        {/* ID Badge */}
        <div className="hidden sm:flex h-12 w-12 bg-muted rounded-lg items-center justify-center font-bold text-muted-foreground text-sm shrink-0">
          #{chamado.id}
        </div>

        {/* Content */}
        <div>
          <h4 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
            {chamado.titulo}
          </h4>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-1 max-w-2xl">
            {chamado.descricao}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {chamado.tecnico ? chamado.tecnico.nome : "Aguardando Técnico"}
            </span>
          </div>
        </div>
      </div>

      {/* Status and Priority */}
      <div className="flex flex-row md:flex-col items-end gap-2 self-start md:self-center shrink-0">
        {chamado.prioridade === "ALTA" && (
          <span className="px-2 py-1 text-[10px] font-bold text-destructive bg-destructive/10 border border-destructive/20 rounded uppercase tracking-wider">
            Urgente
          </span>
        )}
        <StatusBadge status={chamado.status} />
      </div>
    </div>
  );
}
