"use client";

import { useEffect, useState } from "react";
import {
  getDashboardSummary,
  type DashboardSummary,
} from "@/features/admin/api";
import { useAuthSession } from "@/components/site-shell";
import { StatusPill, type StatusKey } from "@/components/status-pill";

const courseStatuses: { key: StatusKey; label: string }[] = [
  { key: "ANALISE", label: "Em análise" },
  { key: "ANDAMENTO", label: "Em andamento" },
  { key: "CONCLUIDO", label: "Concluído" },
  { key: "FECHADO", label: "Fechado" },
];

const enrollmentStatuses: { key: StatusKey; label: string }[] = [
  { key: "PENDENTE", label: "Pendente" },
  { key: "DEFERIDO", label: "Deferida" },
  { key: "INDEFERIDO", label: "Indeferida" },
  { key: "CANCELADO", label: "Cancelada" },
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function StatusPanel({
  title,
  statuses,
  values,
  total,
}: {
  title: string;
  statuses: { key: StatusKey; label: string }[];
  values: Record<string, number>;
  total: number;
}) {
  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-heading">
        <h2>{title}</h2>
        <span>{formatNumber(total)} no total</span>
      </div>
      <div className="status-list">
        {statuses.map((status) => {
          const value = values[status.key] ?? 0;
          const percentage = total > 0 ? (value / total) * 100 : 0;

          return (
            <div className="status-item" key={status.key}>
              <div className="status-item-label">
                <StatusPill status={status.key} />
                <strong>{formatNumber(value)}</strong>
              </div>
              <div
                aria-label={`${status.label}: ${formatNumber(value)} (${Math.round(percentage)}%)`}
                className={`status-track status-track--${status.key.toLowerCase()}`}
                role="img"
              >
                <span
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function AdminDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [students, setStudents] = useState(0);
  const [professors, setProfessors] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const usuario = useAuthSession()?.usuario;
  const today = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const todayLabel = `${today.charAt(0).toLocaleUpperCase("pt-BR")}${today.slice(1)}`;

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getDashboardSummary(),
      getDashboardSummary("ALUNO"),
      getDashboardSummary("PROFESSOR"),
    ])
      .then(([dashboard, studentSummary, professorSummary]) => {
        if (!isMounted) return;
        setSummary(dashboard);
        setStudents(studentSummary.usuarios.filtroCargos ?? 0);
        setProfessors(professorSummary.usuarios.filtroCargos ?? 0);
      })
      .catch((reason: unknown) => {
        if (!isMounted) return;
        setError(
          reason instanceof Error
            ? reason.message
            : "Não foi possível carregar o resumo administrativo.",
        );
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const cards = summary
    ? [
        { label: "Usuários", value: summary.usuarios.total, detail: "contas cadastradas" },
        { label: "Alunos", value: students, detail: "com cargo de aluno" },
        { label: "Professores", value: professors, detail: "com cargo de professor" },
        { label: "Cursos", value: summary.cursos.total, detail: "em todos os status" },
        { label: "Inscrições", value: summary.inscricoes.total, detail: "solicitações registradas" },
        { label: "Instituições", value: summary.instituicoes.total, detail: "cadastradas no portal" },
        { label: "Vagas restantes", value: summary.cursos.vagas.vagasRestantes, detail: "não preenchidas" },
      ]
    : [];

  return (
    <main className="dashboard-content">
      <div className="dashboard-intro">
        <div>
          <p className="eyebrow">Visão geral</p>
          <h1>Olá, {usuario?.nome.split(/\s+/)[0] ?? "administrador"}</h1>
          <p>
            Acompanhe os principais números das atividades de extensão.
          </p>
        </div>
        <time>{todayLabel}</time>
      </div>

      {error && (
        <p className="inline-notice error" role="alert">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="dashboard-loading" role="status">
          Carregando indicadores...
        </div>
      ) : summary ? (
        <>
          <section className="metric-grid" aria-label="Indicadores gerais">
            {cards.map((card) => (
              <article className="metric-card" key={card.label}>
                <span className="metric-label">{card.label}</span>
                <strong>{formatNumber(card.value)}</strong>
                <span className="metric-detail">{card.detail}</span>
              </article>
            ))}
          </section>

          <section className="dashboard-chart-grid" aria-label="Distribuição">
            <StatusPanel
              title="Inscrições por situação"
              statuses={enrollmentStatuses}
              values={summary.inscricoes.porStatus}
              total={summary.inscricoes.total}
            />
            <StatusPanel
              title="Cursos por situação"
              statuses={courseStatuses}
              values={summary.cursos.porStatus}
              total={summary.cursos.total}
            />
          </section>
          <p className="dashboard-footnote">
            Os indicadores são carregados diretamente da API. Vagas restantes
            correspondem às vagas ofertadas menos as inscrições deferidas.
          </p>
        </>
      ) : (
        !error && (
          <div className="dashboard-loading">
            O resumo administrativo não está disponível.
          </div>
        )
      )}
    </main>
  );
}
