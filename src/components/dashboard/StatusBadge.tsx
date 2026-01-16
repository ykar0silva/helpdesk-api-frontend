import { cn } from "@/lib/utils";
import type { ChamadoStatus } from "@/types/tickets";

interface StatusBadgeProps {
  status: ChamadoStatus;
}

const statusConfig: Record<ChamadoStatus, { label: string; className: string }> = {
  ABERTO: {
    label: "Aguardando",
    className: "bg-accent/10 text-accent border-accent/30",
  },
  EM_ATENDIMENTO: {
    label: "Em Andamento",
    className: "bg-primary/10 text-primary border-primary/30",
  },
  AGUARDANDO_CLIENTE: {
    label: "Aguardando Cliente",
    className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  },
  AGUARDANDO_TERCEIROS: {
    label: "Aguardando Terceiros",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  },
  RESOLVIDO: {
    label: "Resolvido",
    className: "bg-green-500/10 text-green-600 border-green-500/30",
  },
  FECHADO: {
    label: "Finalizado",
    className: "bg-secondary/10 text-secondary border-secondary/30",
  },
  CANCELADO: {
    label: "Cancelado",
    className: "bg-red-500/10 text-red-600 border-red-500/30",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "px-3 py-1 text-xs font-bold rounded-full border",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
