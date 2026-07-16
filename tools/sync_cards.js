#!/usr/bin/env node
/**
 * sync_cards.js — sincroniza os CSVs de dados com o index.html.
 *
 * Lê cards_database_v2.csv e commanders_database.csv (raiz do repo) e substitui
 * os blocos `const CARDS_CSV = \`...\`;` e `const COMMANDERS_CSV = \`...\`;`
 * dentro do index.html via string replace. Rode após editar qualquer CSV:
 *
 *   node tools/sync_cards.js
 *
 * O conteúdo do CSV é embutido verbatim (linhas # são comentário, o parser ignora).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'index.html');

function esc(s){ return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${'); }

function replaceBlock(html, constName, csvText){
  const re = new RegExp('const ' + constName + ' = `[\\s\\S]*?`;');
  if (!re.test(html)) { console.error('✗ bloco `' + constName + '` não encontrado no index.html'); process.exit(1); }
  return html.replace(re, 'const ' + constName + ' = `\n' + esc(csvText.trim()) + '\n`;');
}

let html = fs.readFileSync(indexPath, 'utf8');

const cards = fs.readFileSync(path.join(root, 'cards_database_v2.csv'), 'utf8');
html = replaceBlock(html, 'CARDS_CSV', cards);
console.log('✓ CARDS_CSV sincronizado (' + cards.split(/\r?\n/).length + ' linhas)');

const cmdPath = path.join(root, 'commanders_database.csv');
if (fs.existsSync(cmdPath)) {
  const cmds = fs.readFileSync(cmdPath, 'utf8');
  if (html.includes('const COMMANDERS_CSV')) {
    html = replaceBlock(html, 'COMMANDERS_CSV', cmds);
    console.log('✓ COMMANDERS_CSV sincronizado (' + cmds.split(/\r?\n/).length + ' linhas)');
  } else {
    console.warn('! COMMANDERS_CSV ainda não existe no index.html — pulei (crie o bloco primeiro)');
  }
}

fs.writeFileSync(indexPath, html);
console.log('✓ index.html atualizado');
