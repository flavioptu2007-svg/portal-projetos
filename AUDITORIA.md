# Auditoria — portal-projetos

Data: 2026-09-24 (achados) · Correções aplicadas no mesmo dia · Escopo: todo o repositório (7 commits, 30 páginas HTML, `ia_api.js`, i18n, service workers, `firebase.json`).
Deploy: Firebase Hosting (`jogos-5f131`), `public: "."`. Arquivos `*.md` não são publicados.

Legenda de severidade: **ALTA** (quebra função ou expõe dados) · **MÉDIA** (risco real, mas limitado) · **BAIXA** (qualidade/manutenção).

---

## 1. Resumo

| # | Área | Achado | Sev. | Status |
|---|---|---|---|---|
| 1 | Conteúdo | Códigos BNCC trocados ou inválidos em 6 páginas | ALTA | **Corrigido** — ver 3.1 |
| 2 | IA | Corretores OMREdu chamam `api.anthropic.com` sem chave → sempre 401 fora do claude.ai | ALTA | **Corrigido** |
| 3 | Privacidade | Widget de IA envia conversas de alunos a API pública sem aviso/consentimento | ALTA | **Corrigido** (aviso + TTL 24 h) |
| 4 | Segurança | API `ia-lab-api.onrender.com` sem autenticação, exposta no front | MÉDIA | **Aberto** — backend fora deste repositório |
| 5 | Segurança | Nome/turma do aluno e saída da IA inseridos via `innerHTML` sem escape (OMREdu) | MÉDIA | **Corrigido** |
| 6 | Segurança | `gestao_escolar.html` importa backup JSON e interpola valores em `innerHTML` sem escape | MÉDIA | **Corrigido** |
| 7 | IA | DiárioPro envia `HTTP-Referer` de outro projeto (OpenManus) ao OpenRouter | BAIXA | **Corrigido** |
| 8 | Repositório | `.servidor.pid` e `.firebase/hosting..cache` versionados | BAIXA | **Corrigido** |
| 9 | Deploy | `test_adapt.html` (página de teste) publicada e listada no índice | BAIXA | **Corrigido** (removida) |
| 10 | Desempenho | 5 páginas usam React **development** + Babel no navegador + Tailwind CDN | BAIXA | **Corrigido** |
| 11 | PWA | `sw_omredu.js` faz sync para `/api/v1/upload`, rota inexistente; cacheia CDN sem checar `response.ok` | BAIXA | **Corrigido** |
| 12 | Índice | `index.html` fixa IP `192.168.15.17` e cita script inexistente | BAIXA | **Corrigido** |
| 13 | Modelo | OMREdu usava `claude-sonnet-4-20250514` (modelo antigo) | BAIXA | **Corrigido** (`claude-opus-5`) |
| 14 | Widget | Botão do assistente de IA aparecia no fluxo da página (o `all:initial` anulava o posicionamento) | BAIXA | **Corrigido** |

Sem achados: nenhum segredo/chave de API versionado; nenhum link local quebrado; todas as páginas têm `lang` e `viewport`; `ia_api.js` usa `textContent` e Shadow DOM corretamente.

---

## 2. Detalhes

### 2.1 Códigos BNCC (ALTA)
Conferência feita contra transcrições da BNCC (o site oficial `basenacionalcomum.mec.gov.br` estava bloqueado no ambiente). **Antes de corrigir, confirme no documento oficial.** Nenhum código substituto foi aplicado.

| Arquivo | Uso no arquivo | Texto real da habilidade (BNCC) | Situação |
|---|---|---|---|
| `jogo_bingo_reforma.html:275` | EF07HI12 = Reforma Religiosa | EF07HI12: distribuição territorial da população brasileira | **Errado** (o catálogo do `historiagames` usa EF07HI05 para o mesmo jogo) |
| `diariopro.html:303` | EF07HI12 com a descrição da Reforma | idem | **Errado** — a descrição é a de EF07HI05 |
| `diariopro.html:302` | EF07HI03 = "mecanismos de organização do poder político… Estado" | EF07HI03: sociedades africanas e americanas antes da chegada dos europeus | **Errado** |
| `diariopro.html` (EF09HI07) | Regimes totalitários nazista e fascista | EF09HI07: pautas dos povos indígenas e afrodescendentes na República; totalitarismos = EF09HI13 | **Errado** |
| `diariopro.html` (EF06HI10, EF06HI12) | Descrições parafraseadas ("formas de governo"; "princípios da Roma Antiga") | Textos oficiais diferem | Conferir redação |
| `historiagames.html:699` | UNO Egito Antigo → EF06HI06 | EF06HI06: rotas de povoamento no território americano | **Incompatível** |
| `historiagames.html:714` | Labirinto Aldeia Indígena → EF06HI09 | EF06HI09: conceito de Antiguidade Clássica | **Incompatível** |
| `historiagames.html:635/651/667` | Invasões Holandesas / Brasil Colônia → EF07HI04 | EF07HI04: Humanismos e Renascimentos | **Incompatível** |
| `historiagames.html:603/730` | EM13CHS01 | Códigos do EM têm 3 dígitos (ex.: EM13CHS101) | **Formato inválido** |
| `historiagames.html:762/778` | Provas 9º ano → EF09HI08 | EF09HI08: diversidade no Brasil no séc. XX | Conferir com o conteúdo real das provas |

`quiz_historico.html` cita ~40 códigos (um por pergunta); não foram todos conferidos — recomenda-se revisão em lote.

### 2.2 Corretores OMREdu sem chave (ALTA)
`omredu_corretor_gabaritos.html:1333` e `omredu_corretor_hibrido.html:1430` fazem `fetch('https://api.anthropic.com/v1/messages')` com `anthropic-dangerous-direct-browser-access`, mas **sem `x-api-key`**. Isso só funciona dentro de um artefato do claude.ai; no Firebase a leitura por IA falha sempre com 401. O modo "Local" (OpenCV) do híbrido continua funcionando.
Correção recomendada: rotear pela `ia-lab-api` (backend guarda a chave). Não colocar chave no front.

### 2.3 Widget de IA e dados de alunos (ALTA — LGPD)
`ia_api.js` é injetado em 10 páginas usadas por alunos (menores). O texto digitado é enviado a `ia-lab-api.onrender.com` e repassado a provedores de IA, e o histórico fica 7 dias no `localStorage` do aparelho (problema em computadores compartilhados da escola). Não há aviso nem consentimento.
Recomendações: aviso visível no painel ("não digite nome completo, endereço ou telefone"), TTL menor em dispositivos compartilhados e política de privacidade do portal.

### 2.4 API pública sem autenticação (MÉDIA)
Qualquer pessoa que leia `ia_api.js` pode usar `/api/chat` e `/api/audio/tts` sem limite → custo de tokens e abuso. Recomendado no backend: CORS restrito a `jogos-5f131.web.app` e à LAN, rate limit por IP e limite de tamanho do prompt.

### 2.5 XSS no OMREdu (MÉDIA) — corrigido
`${r.nomeAluno}`, `${r.turmaAluno}`, `${q.respostaAluno}`, `${q.respostaCorreta}` e `${r.qualidadeImagem}` (este último vindo da resposta da IA) iam direto para `innerHTML`. Adicionada `escHTML()` nos dois arquivos, aplicada em 17 pontos. Sintaxe validada com `node --check` e carga no Chromium headless.

### 2.6 `gestao_escolar.html` (MÉDIA)
`importBackup()` aceita qualquer JSON e os nomes de turma/professor são interpolados em `innerHTML` (linhas 606, 657, 661 e na grade). Um backup adulterado executa script. Não há função de escape no arquivo. Correção: criar `esc()` como no `diariopro.html:237` e aplicá-la em todas as interpolações.

### 2.7 DiárioPro → OpenRouter (BAIXA)
- `diariopro.html:777`: `HTTP-Referer: https://github.com/FoundationAgents/OpenManus` identifica o app como outro projeto. Usar a URL do próprio portal.
- Com `anonimizar: true`, os nomes dos alunos viram `ALUNOn` (bom), mas os nomes das turmas vão em claro no contexto. Baixo risco, mas vale registrar.
- Pontos positivos: chave só em `sessionStorage`, consentimento explícito, fallback offline.

### 2.8 Demais itens (BAIXA)
- **test_adapt.html**: página com `<h1>test</h1>` e título com `á` literal; publicada e no índice. Remover ou tirar do índice.
- **React dev + Babel standalone** (`atividades_interativas`, `escola_organizada`, `pipeline_multi_ia`, `quiz_historico`, `quiz_historico_en`): páginas mais lentas em celular e Chromebook. Trocar por `react.production.min.js` já ajuda; o ideal é pré-compilar o JSX. `cdn.tailwindcss.com` não é recomendado para produção.
- **quiz_historico.html / quiz_historico_en.html**: ~143 KB cada, com a lógica duplicada. Manter isso é caro; separar os dados por idioma.
- **sw_omredu.js**: `syncPendingGrades()` envia para `/api/v1/upload` (inexistente); o cache do CDN grava respostas sem checar `ok`.
- **index.html**: IP da LAN fixo e script inexistente no repositório; no Firebase o texto "Servidos pelo seu computador" não se aplica.

---

## 3. Correções aplicadas

### 3.1 BNCC (item 1)
Base de conferência: planilha oficial do MEC (`downloadbncc.mec.gov.br`, exportada em 23/06/2023), no pacote `@bncc/dados` 0.4.0 (`dados-2026.07.1`). Antes de usar, a base foi conferida contra 10 textos obtidos por busca independente (EF06HI01, EF06HI06, EF06HI07, EF06HI09, EF07HI03, EF07HI04, EF07HI05, EF09HI07, EF09HI08, EF09HI13): os 10 bateram. O site oficial `basenacionalcomum.mec.gov.br` estava bloqueado no ambiente.

Regra usada: só entra código cujo texto oficial trata do conteúdo. Quando nenhuma habilidade corresponde de forma direta, o campo fica **vazio** (não se atribui por aproximação). Agora todos os códigos do portal existem na BNCC, e a tabela curricular do DiárioPro usa o texto oficial literal.

| Página | Tema | Antes → Depois |
|---|---|---|
| quiz_historico (pt/en) | Origem da Humanidade | EF06HI02 → EF06HI03 |
| | Povos da África Antiga | EF06HI05 → EF06HI07 |
| | Oriente Médio Antigo | EF06HI06 → EF06HI07 |
| | Povos Originários do Brasil | EF06HI09 → EF06HI08 |
| | Grécia Antiga | EF06HI12 → EF06HI10 |
| | Roma Antiga | EF06HI13 → EF06HI11 |
| | Grandes Navegações | EF07HI03 → EF07HI02 |
| | Saberes Africanos e Pré-Colombianos | EF07HI05 → EF07HI03 |
| | Absolutismo | EF07HI06 → EF07HI07 |
| | Escravidão Moderna | EF07HI09 → EF07HI15 |
| | Comércio Atlântico | EF07HI10 → EF07HI13 |
| | Colonização Portuguesa | EF07HI07 → EF07HI11 |
| | Independências (EUA/Haiti) | EF08HI06 → EF08HI07 |
| | Independência do Brasil | EF08HI07 → EF08HI12 |
| | Primeiro Reinado / Segundo Reinado | EF08HI10 / EF08HI12 → EF08HI15 |
| | Período Regencial | EF08HI11 → EF08HI16 |
| | Imperialismo | EF08HI17 → EF08HI23 |
| | Antecedentes da 1ª Guerra | EF08HI18 → EF09HI10 (a BNCC trata o tema no 9º ano) |
| | Crise de 1930 / Era Vargas | EF09HI04 / EF09HI09 → EF09HI02 |
| | Revolução Russa | EF09HI05 → EF09HI11 |
| | 1ª Guerra (consequências) | EF09HI06 → EF09HI10 |
| | Entre Guerras / 1929 | EF09HI07 → EF09HI12 |
| | Fascismo e Nazismo / Holocausto | EF09HI08 / EF09HI11 → EF09HI13 |
| | Fim do Estado Novo | EF09HI09 → EF09HI17 |
| | Guerra Fria | EF09HI12 → EF09HI28 |
| | Descolonização | EF09HI13 → EF09HI31 |
| | Regime Militar | EF09HI15 → EF09HI19 |
| | Nova República | EF09HI16 → EF09HI24 |
| | **Abolicionismo** | EF08HI14 → *(vazio)* |
| | **Revoltas (Canudos, Contestado, Vacina, Chibata…)** | EF09HI03 → *(vazio)* |
| quiz_roma_cidade_eterna | Michelangelo / "Todos os caminhos" / latim / arqueologia no metrô | → EF07HI04 / EF06HI13 / EF06HI09 / EF06HI02 |
| | 10 perguntas de curiosidade (Coliseu, gatos, carbonara, Fontana di Trevi, nasoni…) | → *(vazio)*; a etiqueta BNCC só aparece quando há código |
| historiagames (catálogo) | UNO Egito | EF06HI06 → EF06HI07 |
| | Memória Invasões Holandesas (2 versões) | EF07HI04/EF08HI02 → EF07HI13 |
| | Memória Brasil Colônia | EF07HI04/EF08HI02 → EF07HI11, EF07HI13, EF08HI05 |
| | Jogos Históricos (Bingo/Dominó/Uno) | + EF06HI03, EF06HI07, EF06HI10, EF06HI18, EF07HI05 (temas presentes no jogo) |
| | Quiz Histórico / Debate | remove EM13CHS01 (código inexistente) |
| | Labirinto Aldeia Indígena / Debate Argumentativo | → *(vazio)*: atividades sem conteúdo histórico específico |
| | Provas Adaptadas 9º (1 e 2) | EF09HI08 → EF09HI01, EF09HI02 (República Velha) |
| jogo_bingo_reforma | Reforma Religiosa | EF07HI12 → EF07HI05 |
| diariopro | Tabela curricular + aulas/avaliações de demonstração | EF07HI12 → EF07HI05; EF07HI03 → EF07HI04; EF09HI07 → EF09HI13; textos oficiais em todas as 14 entradas |

**Para você decidir:** Abolicionismo e Revoltas da Primeira República ficaram sem código. Candidatos parciais: EF08HI19/EF08HI20 (legado da escravidão) e EF09HI01/EF09HI03. **Correspondência parcial mantida:** "Crise do Feudalismo" com EF07HI01 e "Sociedade da República Velha" com EF09HI02. **DiárioPro:** quem já usa o app tem os dados antigos no navegador; os códigos novos aparecem após "Restaurar demonstração" ou em cadastros novos.

### 3.2 IA, privacidade e segurança
- **OMREdu (itens 2 e 13):** novo `omredu_claude.js`, usado pelos dois corretores. Pede a chave da API ao professor num diálogo (com aviso de privacidade) e guarda **só em `sessionStorage`**. Uma chave inválida (401) é descartada. Modelo `claude-opus-5`, com fallback do servidor ativado (`fallbacks: "default"`, beta `server-side-fallback-2026-07-01`) e tratamento de recusa (`stop_reason: "refusal"`). Testado com API simulada: cabeçalhos, corpo, leitura da resposta e armazenamento conferidos.
- **Widget (itens 3 e 14):** aviso fixo "não escreva nome completo, endereço, telefone nem dados de colegas", reexibido ao limpar a conversa. Histórico reduzido de 7 dias para 24 h. Corrigidos posição e fonte do botão.
- **XSS (itens 5 e 6):** `escHTML()` no OMREdu. No `gestao_escolar.html`, `esc()` e `jsa()`, este para valores dentro de `onclick`. Teste com backup malicioso: a versão antiga executou script (7 injeções); a nova, nenhuma.
- **DiárioPro (item 7):** `HTTP-Referer` passa a ser a origem do próprio portal.

### 3.3 Desempenho e deploy
- **Item 10:** JSX pré-compilado. O fonte fica em `src/jsx/*.jsx` e o build em `tools/` (`cd tools && npm install && npm run build`). React 18.3.1 em modo produção; Tailwind 3.4 gerado localmente, só com as classes usadas; Babel e `cdn.tailwindcss.com` removidos. A renderização foi comparada antes/depois nas 5 páginas: mesma árvore de elementos. O build é idempotente.
- **Item 11:** `sw_omredu.js` só intercepta GET, não grava respostas de erro e perdeu a sincronização morta. Cache renomeado para `omredu-v2`.
- **Itens 9 e 12:** `test_adapt.html` removida. No índice, a dica de rede local só aparece quando o portal é aberto por IP da LAN e mostra o endereço real. Manifesto sem "servido na rede local".
- **Item 8:** `.servidor.pid` e `.firebase/` fora do Git. `firebase.json` não publica `src/`, `tools/` nem este relatório.

### 3.4 Ainda aberto
- **Item 4 (API `ia-lab-api`):** o código do backend não está neste repositório. O acesso ao repositório do backend (provável `IA-Lab-Monolito`) foi negado nesta sessão. Falta: CORS restrito a `jogos-5f131.web.app` e à LAN, rate limit por IP e limite de tamanho do prompt.
- **Duplicação** `quiz_historico` × `quiz_historico_en`: continuam dois arquivos completos. Unificar exige refatorar o componente; fica como melhoria.

Validação final: as 29 páginas carregadas no Chromium sem erro de JavaScript.
