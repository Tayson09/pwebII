"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProfessorProfile, type ProfessorProfile } from "@/features/professors/api";
import { useAuthSession } from "@/components/site-shell";

export function ProfessorDashboard() {
  const [profile, setProfile] = useState<ProfessorProfile | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const usuario = useAuthSession()?.usuario;

  useEffect(() => {
    getProfessorProfile()
      .then(setProfile)
      .catch((reason: unknown) => {
        setError(
          reason instanceof Error
            ? reason.message
            : "Não foi possível carregar o perfil do professor.",
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="dashboard-content">
      <div className="dashboard-intro">
        <div>
          <p className="eyebrow">Área docente</p>
          <h1>Olá, {usuario?.nome.split(/\s+/)[0] ?? "professor(a)"}</h1>
          <p>Acompanhe seus cursos e acesse os recursos do portal.</p>
        </div>
      </div>

      {error && (
        <p className="inline-notice error" role="alert">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="dashboard-loading" role="status">
          Carregando seus dados...
        </div>
      ) : profile ? (
        <>
          <section className="metric-grid" aria-label="Resumo docente">
            <article className="metric-card">
              <span className="metric-label">SIAPE</span>
              <strong>{profile.siape}</strong>
              <span className="metric-detail">identificação funcional</span>
            </article>
            <article className="metric-card">
              <span className="metric-label">Cursos vinculados</span>
              <strong>{profile.alocacoes.length}</strong>
              <span className="metric-detail">alocações registradas</span>
            </article>
            <article className="metric-card">
              <span className="metric-label">Carga horária</span>
              <strong>
                {profile.alocacoes.reduce(
                  (total, allocation) => total + allocation.cargaHoraria,
                  0,
                )}
              </strong>
              <span className="metric-detail">horas em cursos vinculados</span>
            </article>
          </section>

          <section className="dashboard-panel professor-courses">
            <div className="dashboard-panel-heading">
              <h2>Meus cursos</h2>
              <Link className="text-link" href="/cursos">
                Explorar cursos
              </Link>
            </div>
            {profile.alocacoes.length ? (
              <ul>
                {profile.alocacoes.map(({ id, curso, cargaHoraria }) => (
                  <li key={id}>
                    <span>
                      <strong>{curso.nome}</strong>
                      <small>{cargaHoraria} horas · {curso.status}</small>
                    </span>
                    <Link className="text-link" href="/cursos">
                      Ver cursos
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="professor-empty">
                Você ainda não tem cursos vinculados. Consulte a equipe DEPPI
                para atualizar suas alocações.
              </p>
            )}
          </section>
        </>
      ) : (
        !error && (
          <div className="dashboard-loading">
            Não foi possível carregar os dados do perfil.
          </div>
        )
      )}
    </main>
  );
}
