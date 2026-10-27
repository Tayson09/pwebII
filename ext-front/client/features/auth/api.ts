import { apiRequest } from "@/lib/api-client";
import type { LoginResponse } from "@/types/auth";

export interface LoginCredentials {
  email: string;
  senha: string;
}

export function login(credentials: LoginCredentials) {
  return apiRequest<LoginResponse>("auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
    authenticated: false,
  });
}

export interface ProfessorSignupData {
  nome: string;
  nomeSocial: string;
  nomeMae: string;
  nomePai: string;
  dataNasc: string;
  naturalidade: string;
  email: string;
  senha: string;
  sexo: "MASCULINO" | "FEMININO";
  raca: "AMARELA" | "BRANCA" | "PARDA" | "PRETA" | "INDIGENA" | "NAO_DECLARADO";
  rg: string;
  cpf: string;
  orgaoEmissor: string;
  estado: string;
  dataEmissao: string;
  tituloNumero: string;
  zonaEleitoral: string;
  secaoEleitoral: string;
  ufTitulo: string;
  siape: string;
  endereco: {
    rua: string;
    bairro: string;
    numero: number;
    cep: number;
  };
}

export interface ProfessorSignupResponse {
  mensagem: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
    siape: string;
    status: "PENDENTE";
  };
}

export function signupProfessor(data: ProfessorSignupData) {
  return apiRequest<ProfessorSignupResponse>("auth/cadastro-professor", {
    method: "POST",
    body: JSON.stringify(data),
    authenticated: false,
  });
}
