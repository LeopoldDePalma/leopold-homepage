// Source: https://sketchfab.com/3d-models/d1438344826a4ff9b97dd35ccd56f535 (GLB, 8K textures).
// Needs KTX-Software's `toktx` on PATH.
import {Mode, toktx} from '@gltf-transform/cli';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup, flatten, join, meshopt, prune, simplify, weld} from '@gltf-transform/functions';
import {MeshoptEncoder, MeshoptSimplifier} from 'meshoptimizer';
import sharp from 'sharp';

const SIMPLIFY = {ratio: 0.2, error: 0.01};
const TEXTURE = {mode: Mode.ETC1S, quality: 255, compression: 4};
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
