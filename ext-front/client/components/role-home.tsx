"use client";

import { useAuthSession } from "@/components/site-shell";
import { AdminDashboard } from "@/components/admin-dashboard";
import { ProfessorDashboard } from "@/components/professor-dashboard";

export function RoleHome() {
  const roles = useAuthSession()?.usuario.cargos ?? [];

  if (roles.includes("ADMIN")) return <AdminDashboard />;
  if (roles.includes("PROFESSOR")) return <ProfessorDashboard />;

  return (
    <main className="dashboard-content">
      <div className="dashboard-intro">
        <div>
          <p className="eyebrow">Portal DEPPI</p>
          <h1>Bem-vindo à área de extensão</h1>
          <p>Use a navegação para consultar os cursos e gerenciar o portal.</p>
        </div>
      </div>
    </main>
  );
}
