"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  approveProfessor,
  deleteProfessor,
  getProfessors,
  rejectProfessor,
  updateProfessor,
  type ProfessorRecord,
} from "@/features/professors/api";

function ProfessorCard({
  professor,
  onChanged,
  onError,
}: {
  professor: ProfessorRecord;
  onChanged: () => void;
  onError: (message: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsSaving(true);

    try {
      await updateProfessor(professor.id, {
        siape: String(formData.get("siape") ?? ""),
        titulacao: String(formData.get("titulacao") ?? "") || null,
        escolaridade: String(formData.get("escolaridade") ?? "") || null,
        telefonesInstitucionais: String(
          formData.get("telefonesInstitucionais") ?? "",
        )
          .split("\n")
          .map((phone) => phone.trim())
          .filter(Boolean),
        telefonesPessoais: String(formData.get("telefonesPessoais") ?? "")
          .split("\n")
          .map((phone) => phone.trim())
          .filter(Boolean),
        emPGD: formData.get("emPGD") === "sim",
      });
      setIsEditing(false);
      onChanged();
    } catch (reason) {
      onError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível atualizar o professor.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <article className="professor-card">
      <div className="professor-card-heading">
        <div>
          <span className={`professor-status professor-status--${professor.status.toLowerCase()}`}>
            {professor.status === "PENDENTE"
              ? "Aguardando aprovação"
              : professor.status === "APROVADO"
                ? "Aprovado"
                : "Rejeitado"}
          </span>
          <h2>{professor.usuario.nome}</h2>
          <p>{professor.usuario.emailInstitucional} · SIAPE {professor.siape}</p>
        </div>
        <div className="professor-actions">
          {professor.status === "PENDENTE" && (
            <>
              <button
                className="button button-solid"
                onClick={async () => {
                  try {
                    await approveProfessor(professor.id);
                    onChanged();
                  } catch (reason) {
                    onError(reason instanceof Error ? reason.message : "Falha ao aprovar.");
                  }
                }}
                type="button"
              >
                Aprovar
              </button>
              <button
                className="button button-outline"
                onClick={async () => {
                  try {
                    await rejectProfessor(professor.id);
                    onChanged();
                  } catch (reason) {
                    onError(reason instanceof Error ? reason.message : "Falha ao rejeitar.");
                  }
                }}
                type="button"
              >
                Rejeitar
              </button>
            </>
          )}
          <button
            className="button button-outline"
            onClick={() => setIsEditing((editing) => !editing)}
            type="button"
          >
            {isEditing ? "Fechar edição" : "Editar"}
          </button>
          <button
            className="button button-danger"
            onClick={async () => {
              if (!window.confirm(`Remover o perfil de ${professor.usuario.nome}?`)) {
                return;
              }
              try {
                await deleteProfessor(professor.id);
                onChanged();
              } catch (reason) {
                onError(reason instanceof Error ? reason.message : "Falha ao remover.");
              }
            }}
            type="button"
          >
            Remover
          </button>
        </div>
      </div>

      {isEditing && (
        <form className="professor-edit-form" onSubmit={handleUpdate}>
          <label className="form-field">
            SIAPE
            <input name="siape" defaultValue={professor.siape} required />
          </label>
          <label className="form-field">
            Titulação
            <input name="titulacao" defaultValue={professor.titulacao ?? ""} />
          </label>
          <label className="form-field">
            Escolaridade
            <input name="escolaridade" defaultValue={professor.escolaridade ?? ""} />
          </label>
          <label className="form-field">
            Telefones institucionais (um por linha)
            <textarea
              name="telefonesInstitucionais"
              defaultValue={professor.telefonesInstitucionais.join("\n")}
            />
          </label>
          <label className="form-field">
            Telefones pessoais (um por linha)
            <textarea
              name="telefonesPessoais"
              defaultValue={professor.telefonesPessoais.join("\n")}
            />
          </label>
          <label className="form-field">
            Em PGD?
            <select name="emPGD" defaultValue={professor.emPGD ? "sim" : "nao"}>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </label>
          <button className="button button-solid" disabled={isSaving} type="submit">
            {isSaving ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>
      )}
    </article>
  );
}

export function ProfessorManagement() {
  const [professors, setProfessors] = useState<ProfessorRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfessors = useCallback(() => {
    setIsLoading(true);
    setError("");
    getProfessors()
      .then(setProfessors)
      .catch((reason: unknown) => {
        setError(
          reason instanceof Error
            ? reason.message
            : "Não foi possível carregar os professores.",
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    let active = true;

    getProfessors()
      .then((records) => {
        if (active) setProfessors(records);
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(
            reason instanceof Error
              ? reason.message
              : "Não foi possível carregar os professores.",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="page-shell content-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Gestão acadêmica</p>
          <h1>Professores</h1>
          <p>Revise solicitações de acesso e mantenha os perfis docentes.</p>
        </div>
        <span className="professor-count">{professors.length} perfis</span>
      </div>

      {error && (
        <p className="inline-notice error" role="alert">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="empty-state" role="status">Carregando professores...</div>
      ) : professors.length === 0 ? (
        <div className="empty-state">Nenhum perfil de professor cadastrado.</div>
      ) : (
        <section className="professor-list" aria-label="Professores cadastrados">
          {professors.map((professor) => (
            <ProfessorCard
              key={professor.id}
              professor={professor}
              onChanged={loadProfessors}
              onError={setError}
            />
          ))}
        </section>
      )}
    </main>
  );
}
