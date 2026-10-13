import type { AuthUser, UserRole } from "@/types/auth";

export interface AuthSession {
  token: string;
  usuario: AuthUser;
}

const recognizedRoles: UserRole[] = ["ALUNO", "PROFESSOR", "DEPPI", "ADMIN"];

export function readAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  const token = sessionStorage.getItem("deppi.token");
  const serializedUser = sessionStorage.getItem("deppi.user");

  if (!token || !serializedUser) return null;

  try {
    const usuario: unknown = JSON.parse(serializedUser);

    if (
      !usuario ||
      typeof usuario !== "object" ||
      !("id" in usuario) ||
      typeof usuario.id !== "string" ||
      !("nome" in usuario) ||
      typeof usuario.nome !== "string" ||
      !("email" in usuario) ||
      typeof usuario.email !== "string" ||
      !("cargos" in usuario) ||
      !Array.isArray(usuario.cargos) ||
      !usuario.cargos.every(
        (cargo): cargo is UserRole =>
          typeof cargo === "string" &&
          recognizedRoles.includes(cargo as UserRole),
      )
    ) {
      throw new Error("Dados de sessão inválidos.");
    }

    return { token, usuario: usuario as AuthUser };
  } catch (error) {
    console.error("Não foi possível recuperar a sessão:", error);
    sessionStorage.removeItem("deppi.token");
    sessionStorage.removeItem("deppi.user");
    return null;
  }
}

function notifySessionChange() {
  window.dispatchEvent(new Event("deppi:session-change"));
}

export function saveAuthSession(token: string, usuario: AuthUser) {
  sessionStorage.setItem("deppi.token", token);
  sessionStorage.setItem("deppi.user", JSON.stringify(usuario));
  notifySessionChange();
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("deppi.token");
  sessionStorage.removeItem("deppi.user");
  notifySessionChange();
}

export function getHomePath(usuario: AuthUser) {
  return usuario.cargos.includes("ADMIN") ? "/inicio" : "/cursos";
}

export function canAccessPath(path: string, usuario: AuthUser) {
  const pathname = path.split("?")[0].split("#")[0];

  if (pathname === "/cursos") return usuario.cargos.length > 0;
  if (pathname === "/inicio") return usuario.cargos.includes("ADMIN");
  return false;
}
