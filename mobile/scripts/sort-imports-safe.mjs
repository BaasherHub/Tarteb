import fs from 'fs';
import path from 'path';

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (/\.tsx?$/.test(ent.name) && ent.name !== 'strings.ts') files.push(p);
  }
  return files;
}

function groupKey(spec) {
  if (spec === 'react' || spec.startsWith('react/')) return 0;
  if (
    spec === 'react-native' ||
    spec.startsWith('react-native/') ||
    spec.startsWith('react-native-') ||
    spec.startsWith('expo') ||
    spec === 'react-dom'
  )
    return 1;
  if (spec.startsWith('@/core/')) return 3;
  if (spec.startsWith('@/shared/')) return 4;
  if (spec.startsWith('@/features/')) return 5;
  if (spec.startsWith('./') || spec.startsWith('../')) return 6;
  return 2;
}

function sortFile(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const lines = raw.split('\n');
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    if (!lines[i].startsWith('import ')) break;
    const block = [lines[i]];
    i++;
    while (i < lines.length && !/from\s+['"]/.test(lines[i])) {
      block.push(lines[i]);
      i++;
    }
    if (i < lines.length) {
      block.push(lines[i]);
      i++;
    }
    blocks.push(block.join('\n'));
    while (i < lines.length && lines[i] === '') i++;
  }
  if (!blocks.length) return false;
  const sorted = [...blocks].sort((a, b) => {
    const sa = a.match(/from\s+['"]([^'"]+)['"]/)?.[1] ?? '';
    const sb = b.match(/from\s+['"]([^'"]+)['"]/)?.[1] ?? '';
    const ga = groupKey(sa);
    const gb = groupKey(sb);
    if (ga !== gb) return ga - gb;
    return sa.localeCompare(sb);
  });
  let body = lines.slice(i).join('\n');
  body = body.replace(/^import React from 'react';\n?/, '');
  body = body.replace(/^import React, /m, 'import ');
  const next = sorted.join('\n') + '\n\n' + body.replace(/^\n+/, '');
  const norm = next.endsWith('\n') ? next : next + '\n';
  if (norm === raw.replace(/\r\n/g, '\n')) return false;
  fs.writeFileSync(file, norm);
  return true;
}

let n = 0;
for (const f of walk(path.join(process.cwd(), 'src'))) {
  if (sortFile(f)) n++;
}
if (sortFile(path.join(process.cwd(), 'App.tsx'))) n++;
console.log(`Sorted ${n} files`);
