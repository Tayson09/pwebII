import { apiRequest } from "@/lib/api-client";

export interface DashboardSummary {
  usuarios: {
    total: number;
    filtroCargos?: number;
  };
  instituicoes: {
    total: number;
  };
  cursos: {
    total: number;
    porStatus: Record<string, number>;
    vagas: {
      totalOfertadas: number;
      totalInscritosDeferidos: number;
      vagasRestantes: number;
    };
  };
  inscricoes: {
    total: number;
    porStatus: Record<string, number>;
  };
}

export async function getDashboardSummary(cargo?: string) {
  const query = cargo ? `?cargos=${encodeURIComponent(cargo)}` : "";
  return apiRequest<DashboardSummary>(`admin/dashboard/summary${query}`);
}
