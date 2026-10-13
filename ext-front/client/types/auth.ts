export type UserRole = "ALUNO" | "PROFESSOR" | "ADMIN" | "DEPPI";

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  cargos: UserRole[];
}

export interface LoginResponse {
  mensagem: string;
  token: string;
  usuario: AuthUser;
}
