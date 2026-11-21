import { mkdir, cp, copyFile, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'favicon.svg']) await copyFile(file, `dist/${file}`);
for (const folder of ['src', 'assets']) await cp(folder, `dist/${folder}`, { recursive: true });
console.log('Production site built in dist/');
