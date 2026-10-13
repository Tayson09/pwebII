import type { UserRole } from "@/types/auth";

export type CourseStatus = "ANDAMENTO" | "ANALISE" | "CONCLUIDO" | "FECHADO";

export interface CourseInstitution {
  id: string;
  nome: string;
  cidade: string;
  campus: string;
}

export interface Course {
  id: string;
  nome: string;
  carga_horaria: number;
  vagas: number;
  vagasOcupadas: number;
  vagasDisponiveis: number;
  status: CourseStatus;
  dataInicio: string;
  dataFim: string;
  horarioInicio: string;
  horarioFim: string;
  Instituicao: CourseInstitution;
}

export interface CourseListResponse {
  data: Course[];
}

export interface CreateEnrollmentRequest {
  cursoId: string;
}

export interface AuthenticatedUserSummary {
  nome: string;
  cargos: UserRole[];
}
