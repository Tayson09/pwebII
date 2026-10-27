"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  signupProfessor,
  type ProfessorSignupData,
} from "@/features/auth/api";

function text(data: FormData, key: string) {
  return String(data.get(key) ?? "").trim();
}

export function ProfessorSignupForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data: ProfessorSignupData = {
      nome: text(formData, "nome"),
      nomeSocial: text(formData, "nomeSocial"),
      nomeMae: text(formData, "nomeMae"),
      nomePai: text(formData, "nomePai"),
      dataNasc: text(formData, "dataNasc"),
      naturalidade: text(formData, "naturalidade"),
      email: text(formData, "email"),
      senha: String(formData.get("senha") ?? ""),
      sexo: text(formData, "sexo") as ProfessorSignupData["sexo"],
      raca: text(formData, "raca") as ProfessorSignupData["raca"],
      rg: text(formData, "rg"),
      cpf: text(formData, "cpf"),
      orgaoEmissor: text(formData, "orgaoEmissor"),
      estado: text(formData, "estado").toUpperCase(),
      dataEmissao: text(formData, "dataEmissao"),
      tituloNumero: text(formData, "tituloNumero"),
      zonaEleitoral: text(formData, "zonaEleitoral"),
      secaoEleitoral: text(formData, "secaoEleitoral"),
      ufTitulo: text(formData, "ufTitulo").toUpperCase(),
      siape: text(formData, "siape"),
      endereco: {
        rua: text(formData, "rua"),
        bairro: text(formData, "bairro"),
        numero: Number(formData.get("numero")),
        cep: Number(text(formData, "cep").replace(/\D/g, "")),
      },
    };

    try {
      const response = await signupProfessor(data);
      setSuccess(
        `${response.mensagem} Você poderá entrar após a aprovação da equipe.`,
      );
      form.reset();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível enviar o cadastro. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="signup-page">
      <div className="signup-heading">
        <p className="eyebrow">Área docente</p>
        <h1>Cadastro de professor</h1>
        <p>
          Envie seus dados e aguarde a aprovação da equipe DEPPI. O acesso de
          professor só será liberado depois da análise.
        </p>
      </div>

      <form className="signup-form" onSubmit={handleSubmit}>
        {error && (
          <p className="inline-notice error" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="inline-notice" role="status">
            {success} <Link href="/login">Ir para o login</Link>
          </p>
        )}

        <fieldset className="signup-section">
          <legend>Credenciais e identificação funcional</legend>
          <div className="signup-fields">
            <label className="form-field">
              Nome completo
              <input name="nome" autoComplete="name" minLength={3} required />
            </label>
            <label className="form-field">
              Nome social
              <input name="nomeSocial" autoComplete="nickname" />
            </label>
            <label className="form-field">
              E-mail institucional
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="voce@ifce.edu.br"
                required
              />
            </label>
            <label className="form-field">
              Senha
              <input
                name="senha"
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </label>
            <label className="form-field">
              SIAPE
              <input name="siape" required />
            </label>
          </div>
        </fieldset>

        <fieldset className="signup-section">
          <legend>Dados pessoais</legend>
          <div className="signup-fields">
            <label className="form-field">
              Data de nascimento
              <input name="dataNasc" type="date" required />
            </label>
            <label className="form-field">
              Naturalidade
              <input name="naturalidade" minLength={2} required />
            </label>
            <label className="form-field">
              Nome da mãe
              <input name="nomeMae" minLength={3} required />
            </label>
            <label className="form-field">
              Nome do pai
              <input name="nomePai" minLength={3} required />
            </label>
            <label className="form-field">
              Sexo
              <select name="sexo" required defaultValue="">
                <option value="" disabled>Selecione</option>
                <option value="FEMININO">Feminino</option>
                <option value="MASCULINO">Masculino</option>
              </select>
            </label>
            <label className="form-field">
              Raça/cor
              <select name="raca" required defaultValue="">
                <option value="" disabled>Selecione</option>
                <option value="AMARELA">Amarela</option>
                <option value="BRANCA">Branca</option>
                <option value="PARDA">Parda</option>
                <option value="PRETA">Preta</option>
                <option value="INDIGENA">Indígena</option>
                <option value="NAO_DECLARADO">Prefiro não declarar</option>
              </select>
            </label>
          </div>
        </fieldset>

        <fieldset className="signup-section">
          <legend>Documento de identidade</legend>
          <div className="signup-fields">
            <label className="form-field">
              RG
              <input name="rg" minLength={5} required />
            </label>
            <label className="form-field">
              CPF
              <input name="cpf" placeholder="000.000.000-00" required />
            </label>
            <label className="form-field">
              Órgão emissor
              <input name="orgaoEmissor" minLength={2} required />
            </label>
            <label className="form-field">
              UF de emissão
              <input name="estado" maxLength={2} minLength={2} required />
            </label>
            <label className="form-field">
              Data de emissão
              <input name="dataEmissao" type="date" required />
            </label>
          </div>
        </fieldset>

        <fieldset className="signup-section">
          <legend>Título de eleitor</legend>
          <div className="signup-fields">
            <label className="form-field">
              Número
              <input name="tituloNumero" required />
            </label>
            <label className="form-field">
              Zona eleitoral
              <input name="zonaEleitoral" required />
            </label>
            <label className="form-field">
              Seção eleitoral
              <input name="secaoEleitoral" required />
            </label>
            <label className="form-field">
              UF
              <input name="ufTitulo" maxLength={2} minLength={2} required />
            </label>
          </div>
        </fieldset>

        <fieldset className="signup-section">
          <legend>Endereço</legend>
          <div className="signup-fields">
            <label className="form-field">
              Rua
              <input name="rua" required />
            </label>
            <label className="form-field">
              Bairro
              <input name="bairro" required />
            </label>
            <label className="form-field">
              Número
              <input name="numero" type="number" min={1} required />
            </label>
            <label className="form-field">
              CEP
              <input name="cep" inputMode="numeric" required />
            </label>
          </div>
        </fieldset>

        <p className="form-note">
          A senha será armazenada como hash. Os dados cadastrais serão usados
          para validar sua solicitação de acesso.
        </p>
        <button className="button button-solid" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Enviando cadastro..." : "Enviar para aprovação"}
        </button>
        <p className="signup-login-link">
          Já tem conta? <Link href="/login">Entrar</Link>
        </p>
      </form>
    </main>
  );
}
