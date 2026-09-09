#!/usr/bin/env python3
"""Regenera o sitemap.xml a partir das páginas versionadas no git.

Uso:  python3 tools/gerar_sitemap.py

Mantém o sitemap em sincronia com o repositório: toda página .html versionada
entra na lista (exceto 404.html e este utilitário), com prioridade maior para a
capa e os hubs.
"""
from __future__ import annotations

import datetime
import html
import pathlib
import subprocess

RAIZ = pathlib.Path(__file__).resolve().parent.parent
SITE = "https://jogos-5f131.web.app/"
IGNORAR = {"404.html"}
PRIORIDADES = {
    "index.html": "1.0",
    "historiagames.html": "0.9",
    "jogos_historicos.html": "0.9",
    "quiz_historico.html": "0.9",
    "atividades_adaptaveis.html": "0.9",
    "diariopro.html": "0.8",
}


def paginas() -> list[str]:
    saida = subprocess.check_output(
        ["git", "-C", str(RAIZ), "ls-files", "*.html"], text=True
    )
    return sorted(p for p in saida.split() if p not in IGNORAR)


def main() -> None:
    hoje = datetime.date.today().isoformat()
    linhas = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for pagina in paginas():
        loc = SITE + ("" if pagina == "index.html" else pagina)
        linhas += [
            "  <url>",
            f"    <loc>{html.escape(loc)}</loc>",
            f"    <lastmod>{hoje}</lastmod>",
            f"    <priority>{PRIORIDADES.get(pagina, '0.7')}</priority>",
            "  </url>",
        ]
    linhas.append("</urlset>")
    destino = RAIZ / "sitemap.xml"
    destino.write_text("\n".join(linhas) + "\n", encoding="utf-8")
    print(f"sitemap.xml: {len(paginas())} URLs")


if __name__ == "__main__":
    main()
