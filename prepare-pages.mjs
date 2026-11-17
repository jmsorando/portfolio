import {cp, readFile, writeFile, readdir} from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Script} from 'node:vm';

// Only rewrite known site paths, never arbitrary slashes in JavaScript syntax.
const target = '.artifacts/pages';
const entries = await readdir('dist', {withFileTypes:true});
const roots = entries.map(e => e.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + (e.isDirectory() ? '/' : '(?=[?"\x27`)\\s]|$)'));
const localPath = new RegExp('(["\x27`(=])/(?=' + roots.join('|') + ')', 'g');
await cp('dist', target, {recursive:true});
async function prepare(dir) {
  for (const entry of await readdir(dir, {withFileTypes:true})) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { await prepare(file); continue; }
    if (!/\.(html|css|js|mjs|json|svg)$/.test(file)) continue;
    const content = (await readFile(file, 'utf8')).replace(localPath, '$1/portfolio/');
    await writeFile(file, content);
    if (/\.(js|mjs)$/.test(file)) execFileSync(process.execPath, ['--check', file]);
    if (file.endsWith('.html')) {
      for (const [, attrs, code] of content.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
        if (!/\bsrc=/.test(attrs) && code.trim()) new Script(code, {filename:file});
      }
    }
  }
}
await prepare(target);
await writeFile(path.join(target, '.nojekyll'), '');
console.log('GitHub Pages paths prepared; external and inline JavaScript syntax checked.');
