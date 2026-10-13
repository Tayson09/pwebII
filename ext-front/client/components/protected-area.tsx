"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  canAccessPath,
  clearAuthSession,
  readAuthSession,
  type AuthSession,
} from "@/lib/auth-session";
import { AdminShell } from "@/components/site-shell";

export function ProtectedArea({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null | undefined>();

  useEffect(() => {
    const syncSession = () => setSession(readAuthSession());
    const handleApiError = (event: Event) => {
      const status = (event as CustomEvent<{ status: number }>).detail?.status;
      if (status === 401) {
        clearAuthSession();
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      } else if (status === 403) {
        router.replace("/403");
      }
    };

    syncSession();
    window.addEventListener("deppi:session-change", syncSession);
    window.addEventListener("deppi:api-error", handleApiError);

    return () => {
      window.removeEventListener("deppi:session-change", syncSession);
      window.removeEventListener("deppi:api-error", handleApiError);
    };
  }, [pathname, router]);

  useEffect(() => {
    if (session === undefined) return;
    if (!session) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!canAccessPath(pathname, session.usuario)) router.replace("/403");
  }, [pathname, router, session]);

  if (
    session === undefined ||
    !session ||
    !canAccessPath(pathname, session.usuario)
  ) {
    return (
      <main className="auth-loading" role="status">
        Verificando acesso...
      </main>
    );
  }

  return (
    <AdminShell session={session}>
      {children}
    </AdminShell>
  );
}

export function AccessDeniedPage() {
  return (
    <main className="access-denied page-shell">
      <span className="access-denied-code">403</span>
      <p className="eyebrow">Acesso restrito</p>
      <h1>Você não tem permissão para acessar esta página.</h1>
      <p>
        Se acredita que deveria ter acesso, procure a equipe responsável pelo
        portal.
      </p>
      <Link className="button button-solid" href="/">
        Voltar ao início
      </Link>
    </main>
  );
}
