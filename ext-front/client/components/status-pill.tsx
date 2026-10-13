import type { CourseStatus } from "@/types/course";

export type StatusKey =
  | CourseStatus
  | "PENDENTE"
  | "DEFERIDO"
  | "INDEFERIDO"
  | "CANCELADO";

const statusLabels: Record<StatusKey, string> = {
  ANALISE: "Em análise",
  ANDAMENTO: "Em andamento",
  CONCLUIDO: "Concluído",
  FECHADO: "Fechado",
  PENDENTE: "Pendente",
  DEFERIDO: "Deferida",
  INDEFERIDO: "Indeferida",
  CANCELADO: "Cancelada",
};

function StatusIcon({ status }: { status: StatusKey }) {
  if (status === "PENDENTE" || status === "ANALISE") {
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7" />
        <path d="M10 6v4l2.5 1.5" />
      </svg>
    );
  }

  if (status === "DEFERIDO" || status === "CONCLUIDO") {
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7" />
        <path d="m6.8 10 2.1 2.1 4.4-4.5" />
      </svg>
    );
  }

  if (status === "INDEFERIDO") {
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7" />
        <path d="m7.5 7.5 5 5m0-5-5 5" />
      </svg>
    );
  }

  if (status === "CANCELADO") {
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7" />
        <path d="M6 10h8" />
      </svg>
    );
  }

  if (status === "ANDAMENTO") {
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7" />
        <path d="m8.5 7 4 3-4 3z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="5" y="9" width="10" height="8" rx="1.5" />
      <path d="M7.5 9V6.8a2.5 2.5 0 0 1 5 0V9" />
    </svg>
  );
}

export function StatusPill({
  status,
  compact = false,
}: {
  status: StatusKey;
  compact?: boolean;
}) {
  return (
    <span
      className={`status-pill status-pill--${status.toLowerCase()}${compact ? " status-pill--compact" : ""}`}
    >
      <StatusIcon status={status} />
      {statusLabels[status]}
    </span>
  );
}
