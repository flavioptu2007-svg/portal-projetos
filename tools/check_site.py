#!/usr/bin/env python3
"""Verificações de sanidade do portal estático (sem dependências externas).

Checa duas coisas que já quebraram na prática:

1. Referências locais em `href`/`src` dos HTMLs da raiz apontam para arquivos
   que existem (links quebrados só aparecem quando alguém clica na página).
2. Os JSONs de configuração do Firebase/PWA continuam válidos.

Uso:  python3 tools/check_site.py
Saída: 0 quando está tudo certo, 1 quando há problemas.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

ATTR = re.compile(r'(?:href|src)\s*=\s*["\']([^"\']+)["\']', re.IGNORECASE)
JSON_FILES = ("manifest.json", "firebase.json", ".firebaserc")


def is_local(ref: str) -> bool:
    """Ref que aponta para um arquivo do repositório (não URL, âncora ou JS)."""
    ref = ref.strip()
    if not ref or ref.startswith(("#", "//")):
        return False
    if "${" in ref:  # template literal montado em runtime
        return False
    # Qualquer esquema (http:, mailto:, data:, about:, javascript:) fica de fora.
    return not re.match(r"^[a-z][a-z0-9+.\-]*:", ref, re.IGNORECASE)


def check_html() -> list[str]:
    problems: list[str] = []
    for page in sorted(ROOT.glob("*.html")):
        html = page.read_text(encoding="utf-8", errors="ignore")
        for ref in ATTR.findall(html):
            if not is_local(ref):
                continue
            target = ref.split("#", 1)[0].split("?", 1)[0]
            if not target:
                continue
            path = (ROOT / target.lstrip("/")) if target.startswith("/") else (page.parent / target)
            if not path.resolve().exists():
                problems.append(f"{page.name}: referência quebrada -> {ref}")
    return problems


def check_json() -> list[str]:
    problems: list[str] = []
    for name in JSON_FILES:
        path = ROOT / name
        if not path.exists():
            continue
        try:
            json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            problems.append(f"{name}: JSON inválido ({exc})")
    return problems


def main() -> int:
    pages = len(list(ROOT.glob("*.html")))
    problems = check_html() + check_json()
    print(f"Páginas verificadas: {pages}")
    if not problems:
        print("✅ Sem referências quebradas e JSONs válidos.")
        return 0
    print(f"❌ {len(problems)} problema(s):")
    for item in problems:
        print(f"  - {item}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
