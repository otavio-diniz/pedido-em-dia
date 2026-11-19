# Mega prompt autoral ratificado — Pedido em Dia

**Proveniência:** especificação REV02 ratificada para o projeto educacional. **Não há comprovação independente de que o texto efetivamente enviado ao Lovable tenha sido literalmente idêntico a este.** Este arquivo não se apresenta como transcrição da plataforma.

---

Crie um NOVO aplicativo web independente chamado “Pedido em Dia”, em português brasileiro, para demonstração educacional de solicitações de pequenos serviços de manutenção residencial. NÃO modifique ou reutilize qualquer projeto existente no workspace. O objetivo é demonstrar um fluxo funcional e seguro com dados 100% fictícios; não é uma operação comercial, não presta serviço real e não coleta contatos ou informações pessoais.
CONTEXTO E PESSOAS
Existem dois papéis de demonstração no mesmo navegador: um solicitante que cria pedidos fictícios e um operador que acompanha e altera o status desses pedidos. Não implementar autenticação de verdade, contas, cadastro de prestadores reais ou painel multiusuário. O painel de demonstração é somente local, no navegador, com aviso explícito de que não se trata de área administrativa privada segura.
ESTRUTURA
1) Landing page com título “Pedido em Dia”, subtítulo “Solicitar com clareza. Acompanhar com simplicidade.”, três passos de funcionamento e botão principal “Solicitar serviço”. Mostrar em destaque: “Protótipo educacional — use somente dados fictícios. Nenhum atendimento é contratado.”
2) Formulário: categoria (Elétrica, Hidráulica, Montagem, Pequenos reparos, Outro), título curto, descrição, bairro FICTÍCIO opcional, prioridade Normal ou Urgente. Mostrar que Urgente não significa atendimento emergencial. NÃO pedir nome completo, CPF, e-mail, telefone, localização exata, endereço real ou anexos. Validar os campos e mostrar mensagens de erro claras.
3) Antes de salvar, exibir um modal “Revisar solicitação” com resumo completo e botões Voltar, Cancelar e Confirmar. Voltar devolve ao formulário com os dados mantidos; Cancelar não grava nada; Confirmar cria apenas um pedido.
4) Cada pedido confirmado deve ter ID estável gerado localmente, data de criação, data de atualização, categoria, título, descrição, bairro fictício opcional, prioridade e status inicial “Novo”.
5) Painel de demonstração: tabela ou cards responsivos com os pedidos do navegador, busca ou filtro por status, contagem por Novo, Em análise, Agendado e Concluído, indicador visual e textual da etapa, edição, alteração de status e exclusão com confirmação. Manter o mesmo ID durante alterações; recalcule as contagens a partir dos pedidos, sem números estáticos.
6) Estados vazios e erros tratados; botão opcional “Carregar exemplos fictícios” com 2–3 solicitações claramente marcadas como demonstração; botão “Limpar demonstração” com confirmação.
7) Persistir apenas no armazenamento LOCAL DO NAVEGADOR (localStorage ou alternativa equivalente local e segura), separando a chave dos dados de outros projetos. Após recarregar a página, os pedidos confirmados devem permanecer no mesmo navegador; explicar claramente que não há sincronização, backend nem proteção multiusuário.
8) Design mobile-first, organizado, profissional, com cores sóbrias, boa hierarquia, tipografia legível, labels visíveis, foco de teclado, feedback acessível e indicação textual das mudanças. Não depender somente de cor. Não usar imagens, marcas ou logotipos não licenciados.
REGRAS CRÍTICAS
- Nunca gravar um pedido antes de Confirmar. Evitar registros duplicados por duplo clique, refresh ou reenvio.
- Não anunciar envio por WhatsApp ou e-mail; não integrar APIs, pagamentos, agenda real, geolocalização, autenticação, banco de dados remoto, Lovable Cloud ou ferramentas externas.
- Não solicitar, usar nem guardar chaves/tokens/senhas; não incluir dados pessoais reais. Os pedidos são inteiramente fictícios.
- Não implementar IA conversacional dentro do aplicativo; IA é ferramenta de prototipação, não capacidade de atendimento prometida.
- O fluxo de edição e exclusão também deve exigir confirmação antes de mutação irreversível. Se houver falha de armazenamento, dar aviso sem afirmar salvamento.
- Exibir sempre uma indicação de caráter educacional do app e ausência de contratação ou atendimento real.
ENTREGA DA PRIMEIRA VERSÃO PARA INSPEÇÃO PRIVADA
Antes de qualquer publicação, entregue um resumo dos arquivos reais gerados, do stack efetivo, como testar localmente/na prévia, quais funcionalidades estão implementadas versus simuladas, limitações de persistência/segurança e pontos que precisam de validação. Não marque casos de teste como aprovados por suposição. Não publique o aplicativo, não crie repositório GitHub e não habilite serviços externos automaticamente.
O projeto deve ser uma DEMONSTRAÇÃO PRIVADA para verificar os casos CA01–CA12; CA13–CA15 dependem de publicação e auditoria posteriores.
Caso a ferramenta detecte que precisa ativar Cloud, autenticação, segredo ou serviço pago para executar a proposta, interrompa e apresente a dependência antes de realizar a alteração.
