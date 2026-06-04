import fs from 'fs';
import path from 'path';

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (/\.(tsx?)$/.test(ent.name)) files.push(p);
  }
  return files;
}

function fixFile(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const lines = raw.split('\n');
  const headImports = [];
  let i = 0;
  while (i < lines.length && (lines[i].startsWith('import ') || lines[i] === '')) {
    if (lines[i].startsWith('import ')) headImports.push(lines[i]);
    i++;
  }

  const bodyImports = [];
  const out = [];
  for (let j = i; j < lines.length; j++) {
    const line = lines[j];
    if (line.startsWith('import ')) {
      bodyImports.push(line);
      continue;
    }
    out.push(line);
  }

  if (bodyImports.length === 0) return false;

  const seen = new Set(headImports);
  const merged = [...headImports];
  for (const imp of bodyImports) {
    if (!seen.has(imp)) {
      merged.push(imp);
      seen.add(imp);
    }
  }

  const rest = out.join('\n').replace(/^\n+/, '');
  const next = merged.join('\n') + '\n\n' + rest;
  const normalized = next.endsWith('\n') ? next : next + '\n';
  if (normalized === raw.replace(/\r\n/g, '\n')) return false;
  fs.writeFileSync(file, normalized);
  return true;
}

let fixed = 0;
for (const file of walk(path.join(process.cwd(), 'src'))) {
  if (fixFile(file)) fixed++;
}
const app = path.join(process.cwd(), 'App.tsx');
if (fs.existsSync(app) && fixFile(app)) fixed++;
console.log(`Fixed ${fixed} files`);
