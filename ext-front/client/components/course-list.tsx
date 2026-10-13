"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createEnrollment, getCourses } from "@/features/courses/api";
import { useAuthSession } from "@/components/site-shell";
import { StatusPill } from "@/components/status-pill";
import type { Course } from "@/types/course";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
    new Date(date),
  );
}

export function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submittingCourseId, setSubmittingCourseId] = useState("");
  const canEnroll =
    useAuthSession()?.usuario.cargos.includes("ALUNO") ?? false;

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch((reason: unknown) => {
        setError(
          reason instanceof Error
            ? reason.message
            : "Não foi possível carregar os cursos.",
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function handleEnrollment(course: Course) {
    setNotice("");
    setError("");
    setSubmittingCourseId(course.id);

    try {
      await createEnrollment(course.id);
      setNotice(`Sua solicitação para "${course.nome}" foi enviada.`);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível realizar a inscrição.",
      );
    } finally {
      setSubmittingCourseId("");
    }
  }

  return (
    <main className="page-shell content-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Oportunidades no campus</p>
          <h1>Cursos disponíveis</h1>
          <p>Explore as atividades de extensão abertas para inscrição.</p>
        </div>
      </div>

      {notice && (
        <p className="inline-notice" role="status">
          {notice}
        </p>
      )}
      {error && (
        <p className="inline-notice error" role="alert">
          {error}
        </p>
      )}

      <section className="course-grid" aria-label="Lista de cursos">
        {isLoading ? (
          <div className="empty-state" role="status">
            Carregando cursos...
          </div>
        ) : courses.length === 0 && !error ? (
          <div className="empty-state">
            Nenhum curso disponível no momento.{" "}
            <Link className="text-link" href="/">
              Voltar ao início
            </Link>
          </div>
        ) : (
          courses.map((course) => (
            <article className="course-card" key={course.id}>
              <div className="course-cover" aria-hidden="true">
                <span>
                  {course.nome
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()}
                </span>
              </div>
              <StatusPill status={course.status} />
              <h2>{course.nome}</h2>
              <p className="course-institution">
                {course.Instituicao.nome} · {course.Instituicao.campus}
              </p>
              <p className="course-description">
                {course.carga_horaria} horas de formação no campus{" "}
                {course.Instituicao.cidade}.
              </p>
              <div className="course-meta">
                <span>Início: {formatDate(course.dataInicio)}</span>
                <span>{course.vagasDisponiveis} vagas disponíveis</span>
              </div>
              {canEnroll && (
                <button
                  className="button button-solid"
                  type="button"
                  onClick={() => handleEnrollment(course)}
                  disabled={
                    course.status !== "ANDAMENTO" ||
                    course.vagasDisponiveis <= 0 ||
                    submittingCourseId === course.id
                  }
                >
                  {submittingCourseId === course.id
                    ? "Enviando..."
                    : course.status === "ANDAMENTO" && course.vagasDisponiveis > 0
                      ? "Solicitar inscrição"
                      : "Indisponível"}
                </button>
              )}
            </article>
          ))
        )}
      </section>
    </main>
  );
}
