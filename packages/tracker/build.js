import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isMinify = process.argv.includes('--minify');

esbuild.build({
  entryPoints: [path.join(__dirname, 'src/index.ts')],
  bundle: true,
  minify: isMinify,
  sourcemap: !isMinify,
  target: 'es2020',
  format: 'iife',
  globalName: 'tracker',
  outfile: path.join(__dirname, 'dist/tracker.js'),
  platform: 'browser',
}).then(() => {
  console.log(`Build complete${isMinify ? ' (minified)' : ''}`);
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});
