/**
 * Builds the web-ready helmet model from the original museum scan.
 *
 * Source: "Helmet with Grotesque Visor" by The Royal Armoury (Livrustkammaren),
 * CC BY-SA 4.0 — https://sketchfab.com/3d-models/d1438344826a4ff9b97dd35ccd56f535
 * Download the GLB with 8k textures, make sure KTX-Software's `toktx` is on PATH, then run:
 *   npm run model:helmet -- <path/to/source.glb>
 *
 * Changes to the original: simplified from 1M to ~200k triangles, KTX2 (ETC1S) textures at 4K,
 * Meshopt compression. The museum's material is kept as is.
 */
import {Mode, toktx} from '@gltf-transform/cli';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup, flatten, join, meshopt, prune, simplify, weld} from '@gltf-transform/functions';
import {MeshoptEncoder, MeshoptSimplifier} from 'meshoptimizer';
import sharp from 'sharp';

// Relief of the visor survives this ratio unchanged; engraving lives in the texture.
const SIMPLIFY = {ratio: 0.2, error: 0.01};
// ETC1S at maximum quality: visually on par with UASTC here at a quarter of the size.
const TEXTURE = {mode: Mode.ETC1S, quality: 255, compression: 4};
// 4K: at the size the helmet is shown, 8K cost twice the bytes for detail only a zoom reveals.
const OUTPUT = {path: 'public/models/helmet-4k.glb', size: 4096};

const sourcePath = process.argv[2];

if (!sourcePath) {
  throw new Error('Usage: npm run model:helmet -- <path/to/source.glb>');
}

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({'meshopt.encoder': MeshoptEncoder});

const document = await io.read(sourcePath);

await document.transform(
  dedup(),
  flatten(),
  join(),
  weld(),
  simplify({simplifier: MeshoptSimplifier, ...SIMPLIFY}),
  toktx({encoder: sharp, resize: [OUTPUT.size, OUTPUT.size], ...TEXTURE}),
  prune(),
  meshopt({encoder: MeshoptEncoder, level: 'medium'}),
);
await io.write(OUTPUT.path, document);
console.log(`Written ${OUTPUT.path}`);
