/* ============================================================
   Acervo ProfHistória — catálogo das ferramentas
   ------------------------------------------------------------
   Arquivo de dados do site (index.html). Fica em JS, e não em
   JSON, de propósito: assim o catálogo abre também via file://
   e continua funcionando quando não há internet na escola.

   Campos de cada item:
     id        âncora estável
     arquivo   página da ferramenta (relativa à raiz do portal)
     emoji     ícone mostrado na ficha
     titulo    nome que aparece no card
     resumo    o que a ferramenta faz, em uma ou duas linhas
     categoria jogos | avaliacoes | inclusao | correcao | gestao | producao
     tipo      digital | imprimir | misto
     series    público/série sugerida
     tags      temas e modos de uso (entram na busca)
     offline   true quando funciona sem internet
     destaque  true para as ferramentas mais usadas
   ============================================================ */
window.ACERVO = {
  atualizado: "setembro de 2026",

  categorias: [
    { id: "jogos",     nome: "Jogos",      nota: "Gamificação e revisão" },
    { id: "avaliacoes",nome: "Avaliações", nota: "Quizzes, provas e debate" },
    { id: "inclusao",  nome: "Inclusão",   nota: "Atividades adaptadas" },
    { id: "correcao",  nome: "Correção",   nota: "Gabaritos e cartões-resposta" },
    { id: "gestao",    nome: "Gestão",     nota: "Diário, horários e escola" },
    { id: "producao",  nome: "Produção",   nota: "Criar e planejar material" }
  ],

  itens: [
    /* ── Jogos ───────────────────────────────────────────── */
    {
      id: "historiagames",
      arquivo: "historiagames.html",
      emoji: "🎮",
      titulo: "HistóriaGames — hub de jogos",
      resumo: "Catálogo com 16 jogos: filtre por período, tipo ou série, veja o modo de impressão e abra o jogo direto.",
      categoria: "jogos",
      tipo: "digital",
      series: "6º ano ao EM",
      tags: ["hub", "catálogo", "busca"],
      offline: true,
      destaque: true
    },
    {
      id: "jogos-historicos",
      arquivo: "jogos_historicos.html",
      emoji: "🎲",
      titulo: "Jogos Históricos — Bingo, Dominó e Uno",
      resumo: "Três jogos em cinco temas: Pré-História, Egito Antigo, Grécia Antiga, Idade Média e Idade Moderna.",
      categoria: "jogos",
      tipo: "digital",
      series: "6º ao 9º ano",
      tags: ["hub", "bingo", "dominó", "uno", "sala inteira"],
      offline: true
    },
    {
      id: "bingo-reforma",
      arquivo: "jogo_bingo_reforma.html",
      emoji: "🎱",
      titulo: "Bingo Histórico — Reforma Religiosa",
      resumo: "Sorteia as perguntas no projetor e gera uma cartela 5×5 única para cada aluno imprimir.",
      categoria: "jogos",
      tipo: "misto",
      series: "7º ano",
      tags: ["Reforma Protestante", "Contrarreforma", "projetor", "imprimir"],
      offline: true,
      destaque: true
    },
    {
      id: "domino-reforma",
      arquivo: "jogo_domino_reforma.html",
      emoji: "🀄",
      titulo: "Dominó da Reforma Protestante",
      resumo: "Ligue cada conceito à sua descrição. Bom para duplas ou trios, com placar na tela.",
      categoria: "jogos",
      tipo: "digital",
      series: "7º ano",
      tags: ["Reforma Protestante", "duplas", "vocabulário"],
      offline: true
    },
    {
      id: "memoria-reforma",
      arquivo: "jogo_memoria_reforma.html",
      emoji: "🕊️",
      titulo: "Jogo da Memória — Reforma e Contrarreforma",
      resumo: "Pares de personagens, eventos e conceitos para fixar o vocabulário da Reforma.",
      categoria: "jogos",
      tipo: "digital",
      series: "7º ano",
      tags: ["Reforma Protestante", "memória"],
      offline: true
    },
    {
      id: "memoria-brasil-colonia",
      arquivo: "jogo_memoria_brasil_colonia.html",
      emoji: "🧠",
      titulo: "Jogo da Memória — Brasil Colônia",
      resumo: "20 pares (40 cartas) com termos e descrições do período colonial brasileiro.",
      categoria: "jogos",
      tipo: "digital",
      series: "7º e 8º ano",
      tags: ["Brasil Colônia", "memória"],
      offline: true
    },
    {
      id: "memoria-holandesas-digital",
      arquivo: "jogo_memoria_holandesas_digital.html",
      emoji: "⚓",
      titulo: "Memória Digital — Invasões Holandesas",
      resumo: "8 pares e 16 cartas, com contagem de movimentos e tempo por partida.",
      categoria: "jogos",
      tipo: "digital",
      series: "7º ano",
      tags: ["Invasões Holandesas", "memória"],
      offline: true
    },
    {
      id: "memoria-holandesas-impressa",
      arquivo: "jogo_memoria_holandesas.html",
      emoji: "🃏",
      titulo: "Memória para Imprimir — Invasões Holandesas",
      resumo: "8 pares para imprimir, recortar e dobrar. Traz as instruções da rodada na própria folha.",
      categoria: "jogos",
      tipo: "imprimir",
      series: "7º ano",
      tags: ["Invasões Holandesas", "imprimir", "recortar"],
      offline: true
    },
    {
      id: "uno-egito",
      arquivo: "uno_egito_antigo.html",
      emoji: "🏺",
      titulo: "UNO Educativo — Egito Antigo",
      resumo: "110 cartas com perguntas por nível de dificuldade, cartas especiais e curingas. De 2 a 10 jogadores.",
      categoria: "jogos",
      tipo: "imprimir",
      series: "6º ano",
      tags: ["Egito Antigo", "imprimir", "cartas"],
      offline: true
    },
    {
      id: "jogo-das-eras",
      arquivo: "jogo_perguntas_historia.html",
      emoji: "🏛️",
      titulo: "Jogo das Eras — História",
      resumo: "Ligue cada pergunta à resposta certa por período, da Pré-História à Contemporânea, com habilidades BNCC.",
      categoria: "jogos",
      tipo: "digital",
      series: "6º ao 9º ano",
      tags: ["BNCC", "revisão", "linha do tempo"],
      offline: true,
      destaque: true
    },

    /* ── Avaliações ──────────────────────────────────────── */
    {
      id: "quiz-historico",
      arquivo: "quiz_historico.html",
      emoji: "❓",
      titulo: "Quiz Histórico — 250+ perguntas",
      resumo: "Múltipla escolha, verdadeiro/falso e completar lacunas em 40 temas, do 6º ano ao Ensino Médio.",
      categoria: "avaliacoes",
      tipo: "digital",
      series: "6º ano ao EM",
      tags: ["quiz", "40 temas", "revisão"],
      offline: false,
      destaque: true
    },
    {
      id: "quiz-historico-en",
      arquivo: "quiz_historico_en.html",
      emoji: "🌍",
      titulo: "History Quiz — versão em inglês",
      resumo: "O mesmo banco de 250+ perguntas em inglês, com 40 temas. Para turmas bilíngues ou CLIL.",
      categoria: "avaliacoes",
      tipo: "digital",
      series: "6º ano ao EM",
      tags: ["inglês", "bilíngue", "quiz"],
      offline: false
    },
    {
      id: "quiz-roma",
      arquivo: "quiz_roma_cidade_eterna.html",
      emoji: "🏛️",
      titulo: "Quiz — Roma, a Cidade Eterna",
      resumo: "16 perguntas ilustradas sobre a Roma Antiga, com correção na hora e explicação.",
      categoria: "avaliacoes",
      tipo: "digital",
      series: "6º ano",
      tags: ["Roma Antiga", "quiz"],
      offline: true
    },
    {
      id: "prova-adaptada-1",
      arquivo: "prova_adaptada_1_historia_9ano.html",
      emoji: "📝",
      titulo: "Prova Adaptada — República Velha (1)",
      resumo: "Prova do 9º ano com charges e questões adaptadas, pronta para imprimir.",
      categoria: "avaliacoes",
      tipo: "imprimir",
      series: "9º ano",
      tags: ["República Velha", "imprimir", "adaptada"],
      offline: true
    },
    {
      id: "prova-adaptada-2",
      arquivo: "prova_adaptada_2_historia_9ano.html",
      emoji: "📝",
      titulo: "Prova Adaptada — República Velha (2)",
      resumo: "Segunda prova do 9º ano: transformações sociais, econômicas e culturais do período.",
      categoria: "avaliacoes",
      tipo: "imprimir",
      series: "9º ano",
      tags: ["República Velha", "imprimir", "adaptada"],
      offline: true
    },
    {
      id: "debate",
      arquivo: "debate_argumentativo.html",
      emoji: "🗣️",
      titulo: "Organizador de Debate",
      resumo: "O aluno escreve o tema, três argumentos a favor, três contra, escolhe a posição e justifica. No fim, gera o resumo.",
      categoria: "avaliacoes",
      tipo: "digital",
      series: "6º ano ao EM",
      tags: ["argumentação", "oralidade", "pensamento crítico"],
      offline: true
    },

    /* ── Inclusão ────────────────────────────────────────── */
    {
      id: "atividades-adaptaveis",
      arquivo: "atividades_adaptaveis.html",
      emoji: "🧩",
      titulo: "Atividades Adaptáveis — Educação Inclusiva",
      resumo: "11 condições, 3 níveis de suporte e 7 atividades prontas para imprimir, com guia de uso.",
      categoria: "inclusao",
      tipo: "imprimir",
      series: "6º ao 9º ano",
      tags: ["TEA", "Síndrome de Down", "X-Frágil", "inclusão", "imprimir"],
      offline: true,
      destaque: true
    },
    {
      id: "minha-historia",
      arquivo: "minha_historia_pessoal.html",
      emoji: "📖",
      titulo: "Minha História Pessoal",
      resumo: "Linha da vida em quatro marcos: o aluno traça na tela, cola fotos e faz pausas ativas.",
      categoria: "inclusao",
      tipo: "digital",
      series: "Fundamental I e II",
      tags: ["linha do tempo", "autobiografia", "pausa ativa"],
      offline: true
    },
    {
      id: "labirinto-indigena",
      arquivo: "labirinto_aldeia_indigena.html",
      emoji: "🌳",
      titulo: "Labirinto da Aldeia Indígena",
      resumo: "Labirinto para traçar na tela, com cronômetro, pausa de respiração e adesivos de recompensa.",
      categoria: "inclusao",
      tipo: "digital",
      series: "Fundamental I",
      tags: ["povos indígenas", "coordenação motora", "recompensa"],
      offline: true
    },

    /* ── Correção ────────────────────────────────────────── */
    {
      id: "corretor-gemini",
      arquivo: "corretor_gabaritos_pro.html",
      emoji: "✅",
      titulo: "OMREdu Pro — corretor com Gemini",
      resumo: "Fotografe o cartão-resposta: a IA lê as marcações, compara com o gabarito e devolve nota e acerto por questão.",
      categoria: "correcao",
      tipo: "digital",
      series: "qualquer série",
      tags: ["IA", "câmera", "cartão-resposta"],
      offline: false,
      destaque: true
    },
    {
      id: "corretor-claude",
      arquivo: "omredu_corretor_gabaritos.html",
      emoji: "🤖",
      titulo: "OMREdu — corretor com Claude Vision",
      resumo: "Correção por visão computacional com relatório questão a questão e aproveitamento da turma.",
      categoria: "correcao",
      tipo: "digital",
      series: "qualquer série",
      tags: ["IA", "câmera", "relatório"],
      offline: false
    },
    {
      id: "corretor-hibrido",
      arquivo: "omredu_corretor_hibrido.html",
      emoji: "🔀",
      titulo: "OMREdu Híbrido — offline + IA",
      resumo: "Lê o cartão no próprio aparelho com OpenCV.js e só chama a IA quando precisa. No modo local, funciona sem internet.",
      categoria: "correcao",
      tipo: "digital",
      series: "qualquer série",
      tags: ["offline", "OpenCV", "IA", "cartão-resposta"],
      offline: true,
      destaque: true
    },

    /* ── Gestão ──────────────────────────────────────────── */
    {
      id: "diariopro",
      arquivo: "diariopro.html",
      emoji: "📘",
      titulo: "DiárioPro — diário de classe",
      resumo: "Chamada, notas, avaliações, pendências, relatórios, calendário e auditoria — tudo salvo no próprio navegador.",
      categoria: "gestao",
      tipo: "digital",
      series: "professor",
      tags: ["diário", "chamada", "notas", "offline"],
      offline: true,
      destaque: true
    },
    {
      id: "gestao-escolar",
      arquivo: "gestao_escolar.html",
      emoji: "📚",
      titulo: "Gestão Escolar",
      resumo: "Grade semanal por turma e professor, relatórios em CSV, ocupação dos espaços e backup em JSON.",
      categoria: "gestao",
      tipo: "digital",
      series: "coordenação",
      tags: ["horários", "relatórios", "backup"],
      offline: true
    },
    {
      id: "escola-organizada",
      arquivo: "escola_organizada.html",
      emoji: "🏫",
      titulo: "EscolaOrganizada — agendamento",
      resumo: "Agende aulas e espaços (multimídia, biblioteca, laboratórios, auditório) e consulte a ocupação do dia.",
      categoria: "gestao",
      tipo: "digital",
      series: "coordenação",
      tags: ["agenda", "espaços", "reservas"],
      offline: false
    },

    /* ── Produção ────────────────────────────────────────── */
    {
      id: "editor-atividades",
      arquivo: "atividades_interativas.html",
      emoji: "🧩",
      titulo: "Editor de Atividades Interativas",
      resumo: "Monte múltipla escolha, verdadeiro/falso e completar lacunas e exporte a atividade pronta para o aluno.",
      categoria: "producao",
      tipo: "digital",
      series: "professor",
      tags: ["editor", "quiz", "exportar"],
      offline: false
    },
    {
      id: "pipeline-multi-ia",
      arquivo: "pipeline_multi_ia.html",
      emoji: "📄",
      titulo: "Pipeline Multi-IA para professores",
      resumo: "Um fluxo que combina Perplexity, NotebookLM, Claude e um modelo local para pesquisar, organizar e produzir material.",
      categoria: "producao",
      tipo: "digital",
      series: "professor",
      tags: ["IA", "fluxo", "pesquisa", "LLM local"],
      offline: false
    },
    {
      id: "guia-notebooklm",
      arquivo: "guia_notebooklm_claude.html",
      emoji: "🧭",
      titulo: "Guia NotebookLM → Claude",
      resumo: "Seis fases, com prompts prontos e matriz de decisão, para virar documentos em análise e checklist.",
      categoria: "producao",
      tipo: "digital",
      series: "professor",
      tags: ["IA", "guia", "prompts", "documentos"],
      offline: true
    }
  ]
};
