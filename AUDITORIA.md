# Auditoria — portal-projetos

Data: 2026-09-24 · Escopo: todo o repositório (7 commits, 29 páginas HTML, `ia_api.js`, i18n, service workers, `firebase.json`).
Deploy: Firebase Hosting (`jogos-5f131`), `public: "."`. Arquivos `*.md` não são publicados.

Legenda de severidade: **ALTA** (quebra função ou expõe dados) · **MÉDIA** (risco real, mas limitado) · **BAIXA** (qualidade/manutenção).

---

## 1. Resumo

| # | Área | Achado | Sev. | Status |
|---|---|---|---|---|
| 1 | Conteúdo | Códigos BNCC trocados ou inválidos em 6 páginas | ALTA | **Aberto** — exige conferência no documento oficial |
| 2 | IA | Corretores OMREdu chamam `api.anthropic.com` sem chave → sempre 401 fora do claude.ai | ALTA | Aberto |
| 3 | Privacidade | Widget de IA envia conversas de alunos a API pública sem aviso/consentimento | ALTA | Aberto |
| 4 | Segurança | API `ia-lab-api.onrender.com` sem autenticação, exposta no front | MÉDIA | Aberto |
| 5 | Segurança | Nome/turma do aluno e saída da IA inseridos via `innerHTML` sem escape (OMREdu) | MÉDIA | **Corrigido** |
| 6 | Segurança | `gestao_escolar.html` importa backup JSON e interpola valores em `innerHTML` sem escape | MÉDIA | Aberto |
| 7 | IA | DiárioPro envia `HTTP-Referer` de outro projeto (OpenManus) ao OpenRouter; nomes de turmas vão sem anonimizar | BAIXA | Aberto |
| 8 | Repositório | `.servidor.pid` e `.firebase/hosting..cache` versionados | BAIXA | **Corrigido** |
| 9 | Deploy | `test_adapt.html` (página de teste) publicada e listada no índice | BAIXA | Aberto |
| 10 | Desempenho | 5 páginas usam React **development** + Babel no navegador + Tailwind CDN | BAIXA | Aberto |
| 11 | PWA | `sw_omredu.js` faz sync para `/api/v1/upload`, rota inexistente no Firebase; cacheia CDN sem checar `response.ok` | BAIXA | Aberto |
| 12 | Índice | `index.html` fixa IP `192.168.15.17` e cita `./scripts/servir_projetos.sh`, que não existe no repo | BAIXA | Aberto |
| 13 | Modelo | OMREdu usa `claude-sonnet-4-20250514` (modelo antigo) | BAIXA | Aberto |

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

## 3. Alterações aplicadas nesta auditoria
1. `omredu_corretor_gabaritos.html`, `omredu_corretor_hibrido.html`: função `escHTML()` + escape de dados do aluno e da saída da IA.
2. `.gitignore`: passa a ignorar `.servidor.pid` e `.firebase/`; os dois arquivos saíram do versionamento (continuam no disco).

## 4. Próximos passos sugeridos (por prioridade)
1. Conferir os códigos BNCC do item 2.1 no documento oficial e corrigir.
2. Decidir o caminho do OMREdu (proxy pela `ia-lab-api` ou desativar o modo IA no Firebase).
3. Aviso de privacidade no widget e CORS + rate limit na `ia-lab-api`.
4. Escape em `gestao_escolar.html`.
5. Limpezas de baixa severidade.
