import { build } from 'esbuild';

// Uses the existing Vite/esbuild dependency, without writing build artifacts.
export async function loadModule(entry, env = {}) {
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'esm', define: { 'import.meta.env': JSON.stringify(env) } });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
}
