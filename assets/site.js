/* ============================================================
   ProfHistória — comportamento do site
   ------------------------------------------------------------
   • monta o catálogo a partir de window.ACERVO (projetos.js)
   • busca sem acento por título, resumo, tema, série e categoria
   • abas de categoria e filtro "funciona sem internet"
   • tema papel / quadro salvo no navegador
   JS puro, sem dependência externa: o portal abre offline.
   ============================================================ */
(function () {
  "use strict";

  var dados = window.ACERVO || { categorias: [], itens: [] };
  var CHAVE_TEMA = "profhistoria_tema";

  var estado = {
    categoria: "todos",
    busca: "",
    soOffline: false
  };

  var el = {
    abas: document.getElementById("abas"),
    grade: document.getElementById("grade"),
    campo: document.getElementById("campo-busca"),
    offline: document.getElementById("chave-offline"),
    contagem: document.getElementById("contagem"),
    vazio: document.getElementById("vazio"),
    vazioBusca: document.getElementById("vazio-busca"),
    numeros: document.getElementById("numeros"),
    atalhos: document.getElementById("atalhos")
  };

  /* ── Texto ──────────────────────────────────────────────── */
  function escapar(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function semAcento(s) {
    return String(s)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function escaparRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function nomeCategoria(id) {
    var achou = dados.categorias.filter(function (c) { return c.id === id; })[0];
    return achou ? achou.nome : id;
  }

  function tipoLegivel(tipo) {
    if (tipo === "imprimir") return "para imprimir";
    if (tipo === "misto") return "digital + impressão";
    return "digital";
  }

  /* ── Busca ──────────────────────────────────────────────── */
  function indexar(it) {
    if (!it._busca) {
      it._busca = semAcento(
        [it.titulo, it.resumo, it.series, nomeCategoria(it.categoria), (it.tags || []).join(" ")]
          .join(" ")
      );
    }
    return it._busca;
  }

  function realcar(texto) {
    var termos = estado.busca.trim().split(/\s+/).filter(function (t) { return t.length > 1; });
    var saida = escapar(texto);
    termos.forEach(function (t) {
      var re = new RegExp("(" + escaparRegex(escapar(t)) + ")", "gi");
      saida = saida.replace(re, "<mark>$1</mark>");
    });
    return saida;
  }

  function filtrar() {
    var termos = semAcento(estado.busca).split(/\s+/).filter(Boolean);

    var lista = dados.itens.filter(function (it) {
      if (estado.categoria !== "todos" && it.categoria !== estado.categoria) return false;
      if (estado.soOffline && !it.offline) return false;
      var alvo = indexar(it);
      return termos.every(function (t) { return alvo.indexOf(t) !== -1; });
    });

    var ordem = {};
    dados.categorias.forEach(function (c, i) { ordem[c.id] = i; });

    return lista.sort(function (a, b) {
      if (!!b.destaque !== !!a.destaque) return b.destaque ? 1 : -1;
      if (ordem[a.categoria] !== ordem[b.categoria]) return ordem[a.categoria] - ordem[b.categoria];
      return a.titulo.localeCompare(b.titulo, "pt-BR");
    });
  }

  /* ── Fichas ─────────────────────────────────────────────── */
  var jaMontou = false;

  function fichaHTML(it, indice) {
    /* A entrada carimbada só acontece na primeira montagem: enquanto
       o professor digita na busca, o resultado troca na hora. */
    var atributos = jaMontou
      ? 'class="ficha"'
      : 'class="ficha entra" style="--atraso:' + Math.min(indice, 11) * 38 + 'ms"';

    var meta = [it.series, tipoLegivel(it.tipo)]
      .map(function (m) { return "<span>" + escapar(m) + "</span>"; })
      .join("");

    var situacao = it.offline
      ? '<span class="off">funciona offline</span>'
      : '<span class="on">precisa de internet</span>';

    var chips = (it.tags || [])
      .slice(0, 3)
      .map(function (t) { return '<span class="etiqueta">' + escapar(t) + "</span>"; })
      .join("");

    return (
      '<li><a ' + atributos + ' href="./' + encodeURI(it.arquivo) + '">' +
        '<span class="ficha__topo">' +
          '<span class="carimbo">' + escapar(nomeCategoria(it.categoria)) + "</span>" +
          '<span class="ficha__tipo">' + escapar(tipoLegivel(it.tipo)) + "</span>" +
        "</span>" +
        '<h3><span aria-hidden="true">' + it.emoji + "</span>" + realcar(it.titulo) + "</h3>" +
        '<span class="ficha__resumo">' + realcar(it.resumo) + "</span>" +
        (chips ? '<span class="ficha__tags">' + chips + "</span>" : "") +
        '<span class="ficha__meta">' + meta + situacao + "</span>" +
      "</a></li>"
    );
  }

  /* ── Render ─────────────────────────────────────────────── */
  function render() {
    var lista = filtrar();

    el.grade.innerHTML = lista.map(fichaHTML).join("");
    jaMontou = true;

    var total = lista.length;
    el.contagem.textContent = total + (total === 1 ? " ferramenta" : " ferramentas");

    el.vazio.hidden = total !== 0;
    if (total === 0 && el.vazioBusca) {
      el.vazioBusca.textContent = estado.busca ? "“" + estado.busca + "”" : "estes filtros";
    }

    Array.prototype.forEach.call(el.abas.querySelectorAll(".aba"), function (b) {
      var cat = b.dataset.categoria;
      var n = dados.itens.filter(function (it) {
        return cat === "todos" || it.categoria === cat;
      }).length;
      var alvo = b.querySelector(".aba__n");
      if (alvo) alvo.textContent = n;
    });
  }

  /* ── Montagem inicial ───────────────────────────────────── */
  function montarAbas() {
    var html =
      '<button class="aba" type="button" data-categoria="todos" aria-pressed="true">' +
      'Todos <span class="aba__n">' + dados.itens.length + "</span></button>";

    html += dados.categorias
      .map(function (c) {
        return (
          '<button class="aba" type="button" data-categoria="' + c.id + '" aria-pressed="false">' +
          escapar(c.nome) + ' <span class="aba__n"></span></button>'
        );
      })
      .join("");

    el.abas.innerHTML = html;

    el.abas.addEventListener("click", function (ev) {
      var b = ev.target.closest(".aba");
      if (!b) return;
      estado.categoria = b.dataset.categoria;
      Array.prototype.forEach.call(el.abas.querySelectorAll(".aba"), function (outro) {
        outro.setAttribute("aria-pressed", String(outro === b));
      });
      render();
    });
  }

  function montarNumeros() {
    var total = dados.itens.length;
    var offline = dados.itens.filter(function (it) { return it.offline; }).length;
    var jogos = dados.itens.filter(function (it) { return it.categoria === "jogos"; }).length;

    el.numeros.innerHTML =
      "<div><b>" + total + "</b><span>ferramentas</span></div>" +
      "<div><b>" + offline + "</b><span>funcionam sem internet</span></div>" +
      "<div><b>" + jogos + "</b><span>jogos prontos</span></div>" +
      "<div><b>6º–EM</b><span>séries atendidas</span></div>";
  }

  function montarAtalhos() {
    var temas = ["Reforma", "Egito", "República Velha", "memória", "inclusão", "offline"];

    el.atalhos.innerHTML = temas
      .map(function (t) {
        return (
          '<li><button type="button" data-busca="' + escapar(t) + '">' + escapar(t) + "</button></li>"
        );
      })
      .join("");

    el.atalhos.addEventListener("click", function (ev) {
      var b = ev.target.closest("button[data-busca]");
      if (!b) return;

      if (b.dataset.busca === "offline") {
        estado.soOffline = true;
        estado.busca = "";
      } else {
        estado.busca = b.dataset.busca;
        estado.soOffline = false;
      }

      el.offline.setAttribute("aria-pressed", String(estado.soOffline));
      el.campo.value = estado.busca;
      render();

      document.getElementById("acervo").scrollIntoView({ block: "start" });
      el.campo.focus({ preventScroll: true });
    });
  }

  function ligarControles() {
    el.campo.addEventListener("input", function () {
      estado.busca = el.campo.value;
      render();
    });

    el.campo.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") {
        el.campo.value = "";
        estado.busca = "";
        render();
      }
    });

    el.offline.addEventListener("click", function () {
      estado.soOffline = !estado.soOffline;
      el.offline.setAttribute("aria-pressed", String(estado.soOffline));
      render();
    });
  }

  /* ── Tema papel / quadro ────────────────────────────────── */
  function ligarTema() {
    var botao = document.getElementById("botao-tema");
    var rotulo = document.getElementById("tema-rotulo");

    function pintar(tema) {
      var escuro = tema === "quadro";
      if (escuro) {
        document.documentElement.setAttribute("data-tema", "quadro");
      } else {
        document.documentElement.removeAttribute("data-tema");
      }
      if (rotulo) rotulo.textContent = escuro ? "papel" : "quadro";
      botao.setAttribute(
        "aria-label",
        escuro ? "Mudar para o tema papel" : "Mudar para o tema quadro"
      );
    }

    pintar(document.documentElement.getAttribute("data-tema") === "quadro" ? "quadro" : "papel");

    botao.addEventListener("click", function () {
      var novo =
        document.documentElement.getAttribute("data-tema") === "quadro" ? "papel" : "quadro";
      try { localStorage.setItem(CHAVE_TEMA, novo); } catch (e) {}
      pintar(novo);
    });
  }

  /* ── Início ─────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", function () {
    montarAbas();
    montarNumeros();
    montarAtalhos();
    ligarControles();
    ligarTema();
    render();
  });
})();
