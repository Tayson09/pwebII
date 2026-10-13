# DEPPI — Front-end

Front-end inicial em Next.js, React e TypeScript para o portal de extensão do
IFCE Campus Cedro.

## Executar localmente

1. Copie `.env.example` para `.env.local`. Para usar a API local, altere o valor
   para `http://localhost:3000`.
2. Instale as dependências com `npm install`.
3. Inicie a aplicação com `npm run dev`.
4. Abra `http://localhost:3000`.

O front encaminha as chamadas de `/api/*` para a API configurada em
`DEPPI_API_URL`. Assim, o navegador fala com a mesma origem do front e não
precisa fazer chamadas cross-origin diretamente à API.

## Acesso e permissões

- O login mantém o token e o usuário na sessão do navegador; “Sair” encerra
  essa sessão.
- As rotas de cursos e do painel exigem login. A API continua sendo responsável
  por validar o token e a autorização; uma resposta `401` retorna ao login e
  uma resposta `403` mostra a página de acesso negado.
- Todos os cargos autenticados veem Cursos. O cargo ADMIN também vê Início,
  que exibe o resumo da API em `/admin/dashboard/summary`.
- A inscrição em cursos é apresentada somente para ALUNO. As demais telas
  administrativas e de perfil ainda não fazem parte desta entrega.

## Estrutura inicial

```text
app/
  api/[...path]/route.ts  # Proxy entre o navegador e a API
  (protected)/cursos/     # Lista de cursos (requer login)
  (protected)/inicio/     # Resumo administrativo (requer ADMIN)
  403/page.tsx            # Acesso negado
  login/page.tsx          # Tela de autenticação
  page.tsx                # Página inicial
components/                # Componentes de interface
features/
  auth/api.ts              # Operações de autenticação
  courses/api.ts           # Operações de cursos e inscrições
lib/api-client.ts          # Cliente HTTP tipado e tratamento de erros
types/                     # Modelos compartilhados da API
```

## Padrão para adicionar um recurso

1. Defina as interfaces da resposta e dos dados em `types/`.
2. Adicione as chamadas do endpoint em `features/<recurso>/api.ts`.
3. Monte a tela em `app/` e extraia partes reutilizáveis para `components/`.
4. Use `apiRequest` para chamadas protegidas. Ele inclui o JWT salvo na sessão.

As telas iniciais conectam `POST /auth/login`, `GET /cursos` e
`POST /inscricoes`. As demais operações podem seguir o mesmo padrão.
