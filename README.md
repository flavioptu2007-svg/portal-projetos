# ProfHistória — acervo de História para sala de aula

Portal estático com **28 ferramentas de História** para o professor usar em sala:
jogos de tabuleiro e de tela, provas adaptadas, corretores de cartão-resposta,
diário de classe e gestão escolar.

- **No ar:** <https://jogos-5f131.web.app/>
- **Hospedagem:** Firebase Hosting (projeto `jogos-5f131`)
- **Sem build, sem framework, sem dependências:** cada página é um HTML autônomo.
  21 das 28 ferramentas funcionam **sem internet**.

## Como rodar localmente

Qualquer servidor de arquivos estáticos serve. Não precisa de Node, npm ou build:

```bash
python3 -m http.server 8765
# abra http://127.0.0.1:8765/index.html
```

Também é possível abrir `index.html` direto pelo `file://` — o catálogo é carregado
de `projetos.js` (e não de um `fetch` de JSON) justamente para isso.

> O service worker só registra em **contexto seguro** (HTTPS ou `localhost`).
> Servido pelo IP da rede local (`http://192.168.x.x:8765`) o portal funciona
> normalmente, apenas sem instalação como aplicativo.

## Estrutura

| Arquivo | Papel |
| --- | --- |
| `index.html` | Capa e acervo: busca, filtros por categoria e por “funciona offline”, tema papel/quadro |
| `projetos.js` | **Catálogo** — a fonte da verdade da lista de ferramentas |
| `assets/site.css` | Folha de estilo do portal (temas papel e quadro, impressão, movimento reduzido) |
| `assets/site.js` | Busca sem acento, filtros, montagem das fichas, tema persistido |
| `sw.js` | Service worker: network-first para HTML, stale-while-revalidate para CSS/JS, cache-first para ícones |
| `manifest.json` | PWA: nome, cores, atalhos, ícones |
| `ia_api.js` | Widget de assistente e leitura em voz (API externa; falha em silêncio quando offline) |
| `firebase.json` | Hosting: cabeçalhos de segurança e política de cache |
| `404.html`, `robots.txt`, `sitemap.xml` | SEO e páginas de erro |

As demais páginas `.html` são as ferramentas propriamente ditas e são independentes
entre si — cada uma carrega o que precisa.

## Adicionar uma ferramenta nova

1. Coloque o `.html` na raiz do repositório.
2. Acrescente um item em `projetos.js` (`window.ACERVO.itens`), preenchendo
   `id`, `arquivo`, `emoji`, `titulo`, `resumo`, `categoria`, `tipo`, `series`,
   `tags` e `offline`.
3. Se a página precisa abrir offline, inclua-a em `SHELL` no `sw.js` e **suba a
   versão de `CACHE`**.
4. Atualize `atualizado` em `projetos.js` e rode `python3 tools/gerar_sitemap.py`
   (ou ajuste `sitemap.xml` à mão).

O contador do topo, as abas, a busca e o rodapé se atualizam sozinhos a partir do catálogo.

## Publicar

```bash
firebase deploy --only hosting
```

## Segurança e privacidade

- **Nenhuma chave de API no repositório.** As chaves usadas nas ferramentas de IA
  ficam em `sessionStorage` (somem ao fechar a aba) e nunca são gravadas em disco
  nem enviadas a terceiros além do provedor escolhido.
- Os dados de turma e notas ficam **no próprio navegador** (`localStorage`), não em
  servidor.
- No DiárioPro a **anonimização de nomes de estudantes é ligada por padrão** e o
  envio a modelos externos exige consentimento explícito do professor (LGPD).
- `firebase.json` envia `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `Strict-Transport-Security` e uma CSP restrita a
  `object-src`, `base-uri`, `frame-ancestors` e `form-action`.

## Licença e uso

Material didático de autoria do Prof. Flávio Alexandre, feito para sala de aula.
