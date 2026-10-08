/* =============================================================================
   tools/build.js — pré-compila as páginas React do portal
   =============================================================================
   Uso (uma vez: cd tools && npm install):
     cd tools && npm run build

   Para cada src/jsx/<pagina>.jsx:
     - compila o JSX com @babel/preset-react e grava o resultado entre
       <!-- JSX:BEGIN <pagina> --> e <!-- JSX:END --> em <pagina>.html;
     - se a página tiver <!-- TAILWIND:BEGIN --> … <!-- TAILWIND:END -->,
       gera o CSS do Tailwind só com as classes usadas na página.
   Edite sempre o .jsx; o trecho gerado no .html é sobrescrito.
   ============================================================================= */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const babel = require('@babel/core');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src', 'jsx');
const TW_BIN = path.join(__dirname, 'node_modules', '.bin', 'tailwindcss');

function tailwindCss(files) {
  const tmpIn = path.join(__dirname, '.tw_in.css');
  const tmpOut = path.join(__dirname, '.tw_out.css');
  fs.writeFileSync(tmpIn, '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n');
  const args = ['-i', tmpIn, '-o', tmpOut, '--minify'];
  files.forEach((f) => args.push('--content', f));
  execFileSync(TW_BIN, args, { stdio: 'pipe' });
  const css = fs.readFileSync(tmpOut, 'utf8');
  fs.rmSync(tmpIn); fs.rmSync(tmpOut);
  return css;
}

let total = 0;
for (const file of fs.readdirSync(SRC).filter((f) => f.endsWith('.jsx')).sort()) {
  const name = file.replace(/\.jsx$/, '');
  const jsxPath = path.join(SRC, file);
  const htmlPath = path.join(ROOT, name + '.html');
  let html = fs.readFileSync(htmlPath, 'utf8');

  const js = babel.transformSync(fs.readFileSync(jsxPath, 'utf8'), {
    presets: [['@babel/preset-react', { runtime: 'classic' }]],
    babelrc: false, configFile: false, filename: file,
  }).code;

  const jsxRe = new RegExp('(<!-- JSX:BEGIN ' + name + '\\b[^>]*-->\\n)[\\s\\S]*?(\\n[ \\t]*<!-- JSX:END -->)');
  if (!jsxRe.test(html)) throw new Error(name + '.html: marcadores JSX:BEGIN/END não encontrados');
  html = html.replace(jsxRe, (m, a, b) => a + '<script>\n' + js.replace(/<\/script/gi, '<\\/script') + '\n</script>' + b);

  const twRe = /(<!-- TAILWIND:BEGIN[^>]*-->\n)[\s\S]*?(\n[ \t]*<!-- TAILWIND:END -->)/;
  if (twRe.test(html)) {
    const css = tailwindCss([htmlPath, jsxPath]);
    html = html.replace(twRe, (m, a, b) => a + '<style>\n' + css + '\n</style>' + b);
  }

  fs.writeFileSync(htmlPath, html);
  console.log('✔ ' + name + '.html');
  total++;
}
console.log(total + ' página(s) geradas.');
