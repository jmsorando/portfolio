import {execFileSync} from 'node:child_process';
// Run after page generation: includes generated pages and dynamic JS templates.
execFileSync(process.execPath, ['node_modules/tailwindcss/lib/cli.js', '-c', 'tailwind.config.cjs', '-i', 'source/tailwind.css', '-o', 'dist/tailwind.css', '--minify'], {stdio:'inherit'});
