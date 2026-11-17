# Portal de projetos educacionais de História

Catálogo estático de jogos, atividades e ferramentas educacionais. A página
`index.html` reúne os links das atividades e carrega o assistente de IA.

## Executar localmente

Com Python 3 instalado, na raiz do repositório:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Abra http://localhost:8765. Para disponibilizar na rede da escola, configure
explicitamente o endereço de escuta e o acesso de rede conforme o ambiente.

## Integração com IA

O cliente `ia_api.js` usa `window.IA_API_BASE` quando configurado antes de seu
carregamento. Sem configuração, usa `https://ia-lab-api.onrender.com`.
Quando aberto em um endereço `192.168.*`, o código tenta usar a API local na
porta 8099. Outros endereços de rede podem exigir configuração explícita.

O cliente utiliza:

| Método | Rota | Finalidade |
| --- | --- | --- |
| GET | `/api/health` | Disponibilidade |
| POST | `/api/chat` | Conversa |
| POST | `/api/audio/tts` | Síntese de voz |

O servidor precisa permitir a origem do Portal via CORS. Credenciais de provedores
devem permanecer no backend. Testar geração exige configurar um provedor local ou
gratuito; não habilitar chamadas pagas automaticamente.

## Instalação e funcionamento offline

O service worker é registrado em contexto seguro, como HTTPS ou localhost.
O cache inicial inclui a página principal, o manifesto e os ícones. As navegações
HTML usam rede primeiro e cache como alternativa. O cache não garante que todos os
scripts, recursos de atividades ou serviços de IA estejam disponíveis offline.

Em um endereço IP da rede local via HTTP, o registro do service worker não ocorre.
Um atalho na tela inicial não comprova funcionamento offline.

## Verificação antes de publicar

- Abrir os links do catálogo e corrigir caminhos que retornem erro.
- Conferir manifesto, ícones e registro do service worker em contexto seguro.
- Abrir uma atividade online, desconectar a rede e verificar seus recursos.
- Confirmar mensagem de indisponibilidade quando o backend não responder.
- Usar dados fictícios na validação do assistente.

## Papel no ecossistema

Direção proposta para organizar o desenvolvimento; integrações futuras devem ser
validadas antes de serem anunciadas como disponíveis.

| Repositório | Responsabilidade |
| --- | --- |
| [historiaia-copilot](https://github.com/flavioptu2007-svg/historiaia-copilot) | Experiência do professor: solicitar, revisar e utilizar materiais de História. |
| [IA-Lab-Monolito](https://github.com/flavioptu2007-svg/IA-Lab-Monolito) | Serviços reutilizáveis de IA, provedores, áudio e RAG. |
| [portal-projetos](https://github.com/flavioptu2007-svg/portal-projetos) | Acesso às atividades e jogos educacionais; já possui cliente da API IA-Lab. |
| [historiaia-platform](https://github.com/flavioptu2007-svg/historiaia-platform) | Ambiente de infraestrutura e experimentação com inferência local. |
| [IA-Lab-Enterprise](https://github.com/flavioptu2007-svg/IA-Lab-Enterprise) | Base a inventariar antes de decidir migração ou arquivamento. |

Novas funcionalidades pedagógicas devem priorizar o Copilot; capacidades genéricas
de IA devem priorizar o Monolito. A comunicação entre aplicações deve usar contratos
de API documentados, evitando copiar implementações entre repositórios. Isso é uma
diretriz de evolução, não uma declaração de integração já concluída.
