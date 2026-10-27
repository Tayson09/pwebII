import { apiRequest } from "@/lib/api-client";

export type ProfessorStatus = "PENDENTE" | "APROVADO" | "REJEITADO";

export interface ProfessorRecord {
  id: string;
  siape: string;
  status: ProfessorStatus;
  emailSiape: string | null;
  telefonesInstitucionais: string[];
  telefonesPessoais: string[];
  emPGD: boolean | null;
  titulacao: string | null;
  escolaridade: string | null;
  usuario: {
    id: string;
    nome: string;
    nomeSocial?: string | null;
    emailInstitucional: string;
    emailSecundario?: string;
  };
}

export interface ProfessorProfile {
  id: string;
  siape: string;
  status: ProfessorStatus;
  alocacoes: {
    id: string;
    cargaHoraria: number;
    curso: {
      id: string;
      nome: string;
      status: string;
    };
  }[];
}

export interface ProfessorUpdate {
  siape?: string;
  telefonesInstitucionais?: string[];
  telefonesPessoais?: string[];
  emPGD?: boolean | null;
  titulacao?: string | null;
  escolaridade?: string | null;
}

export function getProfessors() {
  return apiRequest<ProfessorRecord[]>("professores");
}

export function getProfessorProfile() {
  return apiRequest<ProfessorProfile>("professores/me");
}

export function approveProfessor(id: string) {
  return apiRequest<{ mensagem: string }>(`professores/${id}/aprovar`, {
    method: "PATCH",
    body: JSON.stringify({}),
  });
}

export function rejectProfessor(id: string) {
  return apiRequest<{ mensagem: string }>(`professores/${id}/rejeitar`, {
    method: "PATCH",
    body: JSON.stringify({}),
  });
}

export function updateProfessor(id: string, data: ProfessorUpdate) {
  return apiRequest<ProfessorRecord>(`professores/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteProfessor(id: string) {
  return apiRequest<void>(`professores/${id}`, { method: "DELETE" });
}
