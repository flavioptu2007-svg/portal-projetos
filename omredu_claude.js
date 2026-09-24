/* =============================================================================
   omredu_claude.js — Leitura de cartões-resposta com a API da Anthropic
   =============================================================================
   Fora do claude.ai o navegador precisa de uma chave de API para chamar
   api.anthropic.com. A chave é pedida ao professor e fica SOMENTE em
   sessionStorage (some ao fechar a aba; nunca vai para disco, log ou backup).

   Exposição global:
     window.OMREduIA = {
       temChave(),              // -> boolean
       pedirChave(),            // -> Promise<boolean> (abre o diálogo)
       esquecerChave(),         // remove a chave da aba
       lerCartao(imgB64, prompt) // -> Promise<string> (texto da resposta)
     }
   ============================================================================= */
(function () {
  'use strict';

  var KEY = 'omredu-anthropic-key';
  var MODEL = 'claude-opus-5';
  var TIMEOUT = 120000;

  function getKey() {
    try { return sessionStorage.getItem(KEY) || ''; } catch (e) { return ''; }
  }

  function pedirChave() {
    return new Promise(function (resolve) {
      var fundo = document.createElement('div');
      fundo.setAttribute('role', 'dialog');
      fundo.setAttribute('aria-modal', 'true');
      fundo.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:2147483600;' +
        'display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,sans-serif';

      var caixa = document.createElement('div');
      caixa.style.cssText = 'background:#fff;color:#111;border-radius:14px;max-width:440px;width:100%;' +
        'padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.4);font-size:14px;line-height:1.5';

      var h = document.createElement('h2');
      h.textContent = '🔑 Chave da API Anthropic';
      h.style.cssText = 'font-size:17px;margin:0 0 8px';

      var p = document.createElement('p');
      p.textContent = 'A leitura por IA envia a foto do cartão-resposta à Anthropic usando a sua chave. ' +
        'A chave fica apenas nesta aba e some ao fechá-la. Evite fotografar o nome completo do aluno ' +
        'se não for necessário. Sem chave, use o modo Local (OpenCV).';
      p.style.cssText = 'margin:0 0 12px;color:#444';

      var inp = document.createElement('input');
      inp.type = 'password';
      inp.autocomplete = 'off';
      inp.placeholder = 'sk-ant-...';
      inp.setAttribute('aria-label', 'Chave da API Anthropic');
      inp.style.cssText = 'width:100%;padding:10px 12px;border:1px solid #ccc;border-radius:10px;font-size:14px;box-sizing:border-box';

      var linha = document.createElement('div');
      linha.style.cssText = 'display:flex;gap:8px;justify-content:flex-end;margin-top:14px';
      var cancelar = document.createElement('button');
      cancelar.type = 'button';
      cancelar.textContent = 'Cancelar';
      cancelar.style.cssText = 'padding:9px 14px;border-radius:10px;border:1px solid #ccc;background:#fff;cursor:pointer';
      var salvar = document.createElement('button');
      salvar.type = 'button';
      salvar.textContent = 'Usar nesta aba';
      salvar.style.cssText = 'padding:9px 14px;border-radius:10px;border:none;background:#4f46e5;color:#fff;font-weight:700;cursor:pointer';

      function fechar(ok) {
        document.removeEventListener('keydown', onKey);
        fundo.remove();
        resolve(ok);
      }
      function onKey(e) {
        if (e.key === 'Escape') fechar(false);
        if (e.key === 'Enter') salvar.click();
      }
      cancelar.addEventListener('click', function () { fechar(false); });
      salvar.addEventListener('click', function () {
        var v = inp.value.trim();
        if (!v) { inp.focus(); return; }
        try { sessionStorage.setItem(KEY, v); } catch (e) { /* aba privada: segue só em memória */ memKey = v; }
        fechar(true);
      });
      document.addEventListener('keydown', onKey);

      linha.appendChild(cancelar);
      linha.appendChild(salvar);
      caixa.appendChild(h);
      caixa.appendChild(p);
      caixa.appendChild(inp);
      caixa.appendChild(linha);
      fundo.appendChild(caixa);
      document.body.appendChild(fundo);
      inp.focus();
    });
  }

  var memKey = '';

  function lerCartao(imgB64, prompt) {
    var chave = getKey() || memKey;
    var passo = chave ? Promise.resolve(true) : pedirChave();
    return passo.then(function (ok) {
      chave = getKey() || memKey;
      if (!ok || !chave) throw new Error('Chave da API não informada — use o modo Local ou informe a chave.');

      var controller = new AbortController();
      var timer = setTimeout(function () { controller.abort(); }, TIMEOUT);
      return fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': chave,
          'anthropic-version': '2023-06-01',
          'anthropic-beta': 'server-side-fallback-2026-07-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 16000,
          fallbacks: 'default',
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imgB64 } },
              { type: 'text', text: prompt }
            ]
          }]
        }),
        signal: controller.signal
      }).finally(function () { clearTimeout(timer); });
    }).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (data) {
        if (!response.ok) {
          if (response.status === 401) {
            try { sessionStorage.removeItem(KEY); } catch (e) {}
            memKey = '';
            throw new Error('Chave da API inválida (401). Informe a chave novamente.');
          }
          throw new Error('API Anthropic: ' + response.status + ' — ' +
            ((data.error && data.error.message) || 'Erro desconhecido'));
        }
        if (data.stop_reason === 'refusal') {
          throw new Error('A IA recusou analisar esta imagem. Use o modo Local.');
        }
        return (data.content || [])
          .filter(function (b) { return b.type === 'text'; })
          .map(function (b) { return b.text; })
          .join('');
      });
    }).catch(function (err) {
      if (err && err.name === 'AbortError') throw new Error('A API demorou demais para responder. Tente novamente.');
      throw err;
    });
  }

  window.OMREduIA = {
    temChave: function () { return !!(getKey() || memKey); },
    pedirChave: pedirChave,
    esquecerChave: function () { try { sessionStorage.removeItem(KEY); } catch (e) {} memKey = ''; },
    lerCartao: lerCartao
  };
})();
