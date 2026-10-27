"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  clearAuthSession,
  getHomePath,
  readAuthSession,
  type AuthSession,
} from "@/lib/auth-session";

const protectedPaths = ["/inicio", "/cursos", "/professores"];
const AuthSessionContext = createContext<AuthSession | null>(null);

export function useAuthSession() {
  return useContext(AuthSessionContext);
}

function NavigationIcon({ name }: { name: "home" | "school" | "people" }) {
  return name === "home" ? (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="m3 9 7-6 7 6v7a1 1 0 0 1-1 1h-4v-5H8v5H4a1 1 0 0 1-1-1z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  ) : name === "school" ? (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="m2 7 8-4 8 4-8 4z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M5 9v4c2.7 2.2 7.3 2.2 10 0V9m3-2v5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M2 16c.5-2.7 2.2-4 5-4s4.5 1.3 5 4M14 5a3 3 0 0 1 0 5m1 2c1.7.5 2.7 1.5 3 3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isProtectedPath = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (
    isProtectedPath ||
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/cadastro-professor"
  ) {
    return children;
  }

  return (
    <>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="DEPPI, página inicial">
          <span className="brand-mark">D</span>
          <span>
            <strong>DEPPI</strong>
            <small>Extensão · IFCE Cedro</small>
          </span>
        </Link>
        <nav className="site-nav" aria-label="Navegação principal">
          <Link href="/">Início</Link>
          <Link href="/login">Entrar</Link>
        </nav>
      </header>
      {children}
      <footer className="site-footer">
        <span>DEPPI · IFCE Campus Cedro</span>
        <span>Portal de cursos de extensão</span>
      </footer>
    </>
  );
}

export function AdminShell({
  children,
  session,
}: {
  children: ReactNode;
  session: AuthSession;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentSession, setCurrentSession] = useState(session);

  useEffect(() => {
    const syncSession = () => {
      const updatedSession = readAuthSession();
      if (updatedSession) setCurrentSession(updatedSession);
    };
    window.addEventListener("deppi:session-change", syncSession);
    return () =>
      window.removeEventListener("deppi:session-change", syncSession);
  }, [session]);

  function handleLogout() {
    clearAuthSession();
    router.replace("/login");
  }

  const isAdmin = currentSession.usuario.cargos.includes("ADMIN");
  const canManageProfessors =
    isAdmin || currentSession.usuario.cargos.includes("DEPPI");
  const canOpenHome =
    isAdmin || currentSession.usuario.cargos.includes("PROFESSOR");
  const items = [
    ...(canOpenHome
      ? [{ href: "/inicio", label: "Início", icon: "home" as const }]
      : []),
    { href: "/cursos", label: "Cursos", icon: "school" as const },
    ...(canManageProfessors
      ? [{ href: "/professores", label: "Professores", icon: "people" as const }]
      : []),
  ];
  const initials = currentSession.usuario.nome
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const activeTitle =
    items.find((item) => item.href === pathname)?.label ?? "Portal";

  return (
    <AuthSessionContext.Provider value={currentSession}>
      <div className="workspace-shell">
        <aside className="workspace-sidebar">
          <Link className="workspace-brand" href={getHomePath(currentSession.usuario)}>
            <span className="workspace-brand-mark">D</span>
            <span>
              <strong>DEPPI</strong>
              <small>IFCE · Extensão</small>
            </span>
          </Link>
          <nav className="workspace-nav" aria-label="Navegação do portal">
            {items.map((item) => (
              <Link
                aria-current={pathname === item.href ? "page" : undefined}
                className={pathname === item.href ? "active" : ""}
                href={item.href}
                key={item.href}
              >
                <span>
                  <NavigationIcon name={item.icon} />
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="sidebar-account">
            <span className="account-avatar">{initials}</span>
            <span className="account-copy">
              <strong>{currentSession.usuario.nome}</strong>
              <small>{currentSession.usuario.cargos.join(" · ")}</small>
            </span>
            <button
              aria-label="Sair da conta"
              className="logout-button"
              onClick={handleLogout}
              title="Sair"
              type="button"
            >
              Sair
            </button>
          </div>
        </aside>
        <div className="workspace-main">
          <header className="workspace-topbar">
            <span className="workspace-page-title">{activeTitle}</span>
            <div className="workspace-user">
              <span>{isAdmin ? "Administrador" : "Portal de extensão"}</span>
              <span className="account-avatar">{initials}</span>
            </div>
          </header>
          {children}
        </div>
      </div>
    </AuthSessionContext.Provider>
  );
}
