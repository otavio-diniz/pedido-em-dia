# Guia de reprodução — Pedido em Dia

Este guia permite examinar o **código aberto do protótipo educacional** em um diretório novo. O aplicativo guarda registros fictícios no navegador; não possui backend de pedidos nem banco de dados remoto.

## Ambiente em que houve validação

- **Windows**; Node.js **26.13.1**; npm **11.20.0**.
- Repositório público: `https://github.com/otavio-diniz/pedido-em-dia`.
- Instalação e comandos reproduzidos em 19/11/2026. Outros sistemas operacionais e versões de Node ainda não foram homologados.
- O projeto também inclui `bun.lock`, mas a reprodução independente descrita a seguir usa **npm** e `package-lock.json`. Não misture gerenciadores no mesmo diretório.

## Quickstart: clone limpo

```bash
git clone https://github.com/otavio-diniz/pedido-em-dia.git
cd pedido-em-dia
node --version
npm --version
npm ci --ignore-scripts
npm run dev
```

Acesse o endereço indicado pelo Vite no terminal, geralmente `http://localhost:5173/`. O endereço e a porta podem variar se houver outra aplicação usando a porta padrão.

**Primeiro uso com dados fictícios:**

1. Abra **Solicitar serviço** e preencha categoria, título, descrição e prioridade usando exclusivamente informações inventadas.
2. Confira o diálogo de revisão. Use **Cancelar** para verificar que nada é salvo ou **Confirmar** para registrar um único pedido.
3. Acesse **Painel (demo)**. Confira o identificador e o estado inicial **Novo**.
4. Teste filtros, mudança de status, edição e exclusão. Os registros permanecem somente no navegador/perfil atual.
5. Para demonstração sem digitação, no painel use **Carregar exemplos fictícios**. O botão carrega três exemplos; não são solicitações de pessoas reais.

**Não use dados reais, telefone, e-mail, CPF ou endereço.** A validação textual não consegue reconhecer todo tipo de dado pessoal.

## Testar e compilar

Em outro terminal, dentro de `pedido-em-dia`:

```bash
npm run test
npm run lint
npx tsc --noEmit
npm run build
npm audit
```

Na instalação de referência em Windows (19/11/2026): **17 testes aprovados em 2 arquivos**, lint sem erros, typecheck sem erros, build Vite/Nitro sem erros e nenhuma vulnerabilidade reportada pelo `npm audit`. São resultados daquele ambiente, não garantia automática para instalações futuras.

O build produz artefatos em diretórios ignorados pelo Git. O preset de publicação padrão é Nitro/Cloudflare por meio da configuração fornecida pelo Lovable; **`npm run build` não executa deploy**.

## Diagnóstico de falhas previsíveis

| Sintoma | O que verificar |
|---|---|
| `npm ci` falha | Executar a partir da raiz do clone; conferir Node/npm e conectividade com o registro npm; não remover o lockfile para mascarar o problema |
| Porta do Vite ocupada | Usar o endereço efetivamente exibido pelo servidor de desenvolvimento; não assumir 5173 |
| Painel vazio | Os dados são exclusivos daquele navegador; clique em **Carregar exemplos fictícios** ou crie um pedido e confirme |
| Pedido não persiste | Verificar bloqueio de armazenamento, modo privado, limpeza automática do navegador e políticas locais |
| Erro de formato ou encoding | Verificar o arquivo reportado e a configuração Git de finais de linha; não reinterpretar bytes como teste aprovado |
| Validação ou build falha após alteração | Comparar `package.json`, `package-lock.json` e `bun.lock`; não misturar instalações npm/Bun no mesmo diretório |

## Portabilidade e limitações

O repositório inclui `.gitattributes` para manter **LF** em arquivos de código, CSS, JSON e documentação, inclusive em clones Windows com `core.autocrlf=true`. Essa medida evita diferenças de finais de linha no lint/Prettier. Para verificar a política no clone, use `git check-attr eol -- src/lib/pedidos/model.ts`.

A configuração foi reproduzida na máquina Windows citada. Ainda **não há readback independente em Linux ou macOS**. Os navegadores têm diferenças de políticas de localStorage, acessibilidade e permissões. Os testes automatizados não equivalem a auditoria de acessibilidade com leitor de tela ou a teste fim a fim em dispositivos físicos.

Para examinar a aplicação já hospedada (sem instalar dependências), use a [demonstração pública](https://pedido-em-dia-otavio-diniz.lovable.app).
