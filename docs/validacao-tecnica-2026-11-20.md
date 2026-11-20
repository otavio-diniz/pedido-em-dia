# Verificação técnica e evidências — 20/11/2026

Este registro documenta uma **verificação técnica de um MVP educacional já existente**. Os resultados não substituem avaliação da DIO, validação comercial ou homologação de segurança integral. Foram usados somente dados fictícios.

## Identificação das versões

- **GitHub público:** [pedido-em-dia](https://github.com/otavio-diniz/pedido-em-dia), branch `main`, revisão de sincronização de dependências `3c555b3d192b7cfc79da20e92384d4c2d9411cc9`.
- **Projeto Lovable:** revisão `e6881273fdd2bc1f0334598295d57426469b9671`, obtida após correção de formatação. A plataforma confirmou `ready` e `is_published=true`.
- **Aplicação:** [pedido-em-dia-otavio-diniz.lovable.app](https://pedido-em-dia-otavio-diniz.lovable.app/). As rotas `/`, `/solicitar` e `/painel` responderam HTTP 200 sem autenticação.
- **Escopo do código:** 12 arquivos corrigidos pelo Lovable foram confrontados com os arquivos GitHub: mesmo conteúdo desconsiderando caracteres de espaço em branco; uma diferença de final de arquivo permaneceu. Os valores de dependência para Vitest foram alinhados em `package.json`, `bun.lock` e `package-lock.json`.
- **Atualização da publicação:** novo deploy solicitado ao Lovable após a correção. A confirmação de disponibilidade pública e o estado de publicação do projeto não equivalem, isoladamente, a uma prova criptográfica de que o servidor entrega exatamente esse SHA.

## Reprodução independente

Na máquina Windows de validação, com Node.js 26.13.1 e npm 11.20.0:

| Controle | Resultado |
|---|---|
| Instalação limpa com `npm ci --ignore-scripts` | Aprovado |
| Vitest `npm run test` | 17 de 17 testes aprovados (2 arquivos) |
| ESLint `npm run lint` | Aprovado sem erros |
| TypeScript `tsc --noEmit` | Aprovado sem erros |
| Build `npm run build` | Aprovado |
| `npm audit` | 0 vulnerabilidades reportadas na árvore npm verificada |

O teste ocorreu antes do commit de sincronização das dependências, sobre o mesmo conjunto de versões instaladas. Não comprova compatibilidade de todos os sistemas operacionais.

## Teste funcional público em navegador real

Automação executada por Chromium em perfil isolado, usando exclusivamente valores inventados:

- Rejeição de formulário vazio e revisão dos dados antes de salvar.
- Cancelamento da solicitação sem gravação; confirmação posterior de um pedido fictício.
- Persistência do pedido após recarregar o painel.
- Busca com zero resultados e retorno da listagem.
- Alteração de status com caixa de confirmação.
- Exclusão cancelada preservando o pedido; exclusão confirmada removendo-o.
- Nenhum erro JavaScript de página detectado durante esses fluxos.

Esses testes comprovam os fluxos avaliados, mas não substituem auditoria de leitor de tela, teste em aparelhos físicos ou avaliação de segurança da infraestrutura.

## Risco e segurança

- A auditoria Bun no Lovable corrigiu as dependências transitivas vulneráveis sem atualizações de versão principal de framework e terminou com **um alerta moderado em `minimatch`**, transitivo na ferramenta de desenvolvimento ESLint/typescript-eslint. Não se forçou migração incompatível.
- O `npm audit` da árvore do repositório testado retornou **zero alertas**, o que não garante risco absoluto zero.
- O código usa dados demonstrativos e `localStorage`, sem autenticação ou banco de pedidos em cloud. Não deve receber dados reais.
- Persistem avaliações adicionais possíveis sobre componentes de terceiros e acessibilidade abrangente.

## Limites acadêmicos

O enunciado do desafio DIO requer estimativa de mercado TAM/SAM/SOM, Business Model Canvas, mega prompt e correções e orienta uso do Lovable Cloud. O Canvas e as hipóteses constam no README, mas **não existe dimensionamento numérico específico validado** nem transcrição completa autenticada da mensagem inicial anexada ao Lovable. A opção pelo armazenamento local foi deliberadamente ratificada no escopo de produto anterior; não foi alterada silenciosamente.

**Submissão formal à DIO, nota, aprovação e certificado não estão comprovados por esta documentação.** Qualquer conclusão institucional exige evidência da própria plataforma.
