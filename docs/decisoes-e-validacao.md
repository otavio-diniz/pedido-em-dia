# Decisões de produto e evolução técnica — Pedido em Dia

Este documento descreve **somente o que pode ser confrontado com o código e as verificações de 19 e 20/11/2026**. Não substitui o histórico integral das mensagens enviadas ao Lovable nem certifica conclusão acadêmica.

## Decisões implementadas

- **Dados fictícios:** interface com aviso explícito de que não há prestação de serviço nem coleta intencional de contatos pessoais.
- **Armazenamento no navegador:** `localStorage`, sem sincronização ou painel administrativo protegido.
- **Confirmação obrigatória:** um formulário preenchido não vira pedido até a ação **Confirmar** no diálogo de revisão.
- **Registro idempotente:** um mesmo identificador de pedido não deve gerar duplicatas em confirmação repetida.
- **Acompanhamento:** quatro estados e operações de filtragem, edição, alteração de status e exclusão confirmada.
- **Falha de gravação:** a interface não deve apresentar como salvo o que o armazenamento rejeitou.

As rotas e regras estão em `src/routes/` e `src/lib/pedidos/`. O protótipo não mede aumento de produtividade, adesão de mercado, receita ou satisfação.

## Evolução técnica comprovada

| Etapa | Alteração efetiva | Evidência verificável |
|---|---|---|
| Protótipo inicial | Formulário, revisão, painel e testes automatizados | Código nas pastas `src/routes`, `src/components/pedidos` e `src/test` |
| Compatibilidade e segurança | Atualização de **Vite 8.1.5 para 8.3.8** e **Zod 3.25.76 para 4.6.7**, com ajuste da API de mensagens de enum | `package.json`, `src/lib/pedidos/model.ts` e histórico da versão Lovable |
| Dependências de desenvolvimento | Correções transitivas no `bun.lock` e atualização de Vitest dentro da mesma versão principal | `bun.lock` e `package.json` do repositório público |
| Qualidade e reprodução | Formatação consistente, typecheck, testes e compilação | Comandos e resultados descritos em [guia de reprodução](guia-reproducao.md) |

Essas mudanças são **ajustes técnicos observados**. Não se afirma que todas tenham sido solicitadas por uma única mensagem de correção do estudante.

## Verificações executadas

- Testes automatizados: **17/17**, em dois arquivos, executados fora do Lovable.
- `npm ci --ignore-scripts`, lint, `tsc --noEmit` e build: concluídos no ambiente Windows/Node/npm documentado.
- `npm audit`: nenhum alerta na árvore npm da revisão verificada.
- `bun audit`: depois das correções transitivas, permanece **um aviso moderado em `minimatch`**, dependência ligada à cadeia de ferramentas de desenvolvimento (ESLint/typescript-eslint). Não equivale a zero risco.
- Disponibilidade pública: páginas inicial, formulário e painel responderam HTTP 200; evidências visuais foram capturadas após renderização.

**Conciliação atualizada em 20/11/2026:** a plataforma Lovable e o GitHub tiveram as versões de dependências Bun/Vitest conciliadas no código-fonte; o lint que falhava com 47 erros de formatação no Lovable passou após autofix, e os 17 testes, o TypeScript e o build foram aprovados. Novo deploy foi solicitado e o domínio segue público e acessível. Ainda não existe readback inequívoco do SHA exato do artefato servido em produção, portanto a equivalência de *build hospedado* permanece uma limitação distinta da equivalência do código.

## Sobre o mega prompt e os pedidos de correção

A [especificação autoral ratificada](mega-prompt-autoral.md) documenta o escopo pedagógico pretendido. A mensagem inicial no Lovable continha um anexo; **a íntegra exata desse anexo não foi recuperada de forma independente a partir do histórico acessível**. Por isso a especificação ratificada **não é apresentada como transcrição literal da entrada real**.

Também não se reproduzem aqui supostas mensagens de correção não autenticadas. Se o curso exigir a lista literal de pedidos de ajuste feitos pelo estudante, ela deverá ser confrontada com o histórico efetivo da plataforma antes da entrega formal.

## Limitações de validação

- Não há testes de usuários reais, resultados comerciais ou dimensionamento numérico específico de TAM/SAM/SOM validado.
- Não há homologação abrangente de acessibilidade com leitor de tela.
- Não há prova de compatibilidade completa entre sistemas operacionais ou de segurança integral em todos os ambientes.
- A decisão de usar armazenamento local, em vez de backend cloud de pedidos, é uma opção deliberada deste protótipo e deve ser avaliada à luz dos critérios específicos do desafio acadêmico.

Para o registro técnico posterior, consulte [verificação de 20/11/2026](validacao-tecnica-2026-11-20.md).
