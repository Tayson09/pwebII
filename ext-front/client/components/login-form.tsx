"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/features/auth/api";
import {
  canAccessPath,
  getHomePath,
  readAuthSession,
  saveAuthSession,
} from "@/lib/auth-session";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const session = readAuthSession();
    if (session) router.replace(getHomePath(session.usuario));
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await login({ email, senha });
      saveAuthSession(response.token, response.usuario);
      const requestedPath = new URLSearchParams(window.location.search).get("next");
      const destination =
        requestedPath &&
        requestedPath.startsWith("/") &&
        !requestedPath.startsWith("//") &&
        canAccessPath(requestedPath, response.usuario)
          ? requestedPath
          : getHomePath(response.usuario);
      router.replace(destination);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível entrar. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-art-panel" aria-label="Apresentação do portal">
        <div className="login-brand">
          <span className="login-brand-mark">D</span>
          <span>
            <strong>DEPPI</strong>
            <small>IFCE · Extensão</small>
          </span>
        </div>
        <div className="login-photo">
          <Image
            src="/imagem-aula.jpg"
            alt="Professor dando aula para estudantes em uma sala de aula"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 50vw"
          />
        </div>
        <div className="login-art-copy">
          <h1>
            Cursos de extensão
            <br />
            do IFCE, num só lugar.
          </h1>
          <p>
            Inscreva-se, envie seus documentos e acompanhe a análise da sua
            inscrição.
          </p>
        </div>
      </section>

      <section className="login-form-panel">
        <form className="login-form" onSubmit={handleSubmit}>
          <header className="login-form-heading">
            <h2>Entrar</h2>
            <p>Use seu e-mail institucional.</p>
          </header>
          {error && (
            <p className="login-error" role="alert">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="10" cy="10" r="7" />
                <path d="M10 6v4m0 3h.01" />
              </svg>
              {error}
            </p>
          )}
          <label className="login-field">
            <span>E-mail institucional</span>
            <input
              type="email"
              name="email"
              autoComplete="username"
              placeholder="voce@ifce.edu.br"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="login-field">
            <span>Senha</span>
            <span className="login-password-control">
              <input
                type={showPassword ? "text" : "password"}
                name="senha"
                autoComplete="current-password"
                placeholder="Sua senha"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                required
              />
              <button
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="password-visibility"
                onClick={() => setShowPassword((visible) => !visible)}
                type="button"
              >
                {showPassword ? (
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="m3 3 14 14M8.6 8.6a2 2 0 0 0 2.8 2.8" />
                    <path d="M7.1 5.4A8 8 0 0 1 10 5c4.5 0 7 5 7 5a12 12 0 0 1-2.1 2.8M5.2 6.8C3.7 8 3 10 3 10s2.5 5 7 5c.8 0 1.5-.1 2.2-.4" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M3 10s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5Z" />
                    <circle cx="10" cy="10" r="2" />
                  </svg>
                )}
              </button>
            </span>
          </label>
          <button
            className="button button-solid login-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
          <div className="login-divider" aria-hidden="true">
            <span />
            <small>ou</small>
            <span />
          </div>
          <p className="login-signup-note">
            É professor?{" "}
            <Link href="/cadastro-professor">Solicite seu acesso</Link>.
          </p>
        </form>
      </section>
    </main>
  );
}
