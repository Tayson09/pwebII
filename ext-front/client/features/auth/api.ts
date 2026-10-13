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
