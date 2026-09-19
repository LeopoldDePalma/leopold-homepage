/**
 * Builds the web-ready helmet models from the original museum scan.
 *
 * Source: "Helmet with Grotesque Visor" by The Royal Armoury (Livrustkammaren),
 * CC BY-SA 4.0 — https://sketchfab.com/3d-models/d1438344826a4ff9b97dd35ccd56f535
 * Download the GLB with 8k textures, make sure KTX-Software's `toktx` is on PATH, then run:
 *   npm run model:helmet -- <path/to/source.glb>
 *
 * Changes to the original: simplified from 1M to ~200k triangles, matte-metal material,
 * KTX2 (ETC1S) textures at 8K and a 4K fallback, Meshopt compression.
 */
import {Mode, toktx} from '@gltf-transform/cli';
import {type Document, NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup, flatten, join, meshopt, prune, simplify, weld} from '@gltf-transform/functions';
import {forEach} from 'lodash-es';
import {MeshoptEncoder, MeshoptSimplifier} from 'meshoptimizer';
import sharp from 'sharp';

// Relief of the visor survives this ratio unchanged; engraving lives in the texture.
const SIMPLIFY = {ratio: 0.2, error: 0.01};
// The scan ships as mirror-like metal, which hides the engraving under reflections.
const MATERIAL = {metallic: 0.7, roughness: 0.45};
// ETC1S at maximum quality: visually on par with UASTC here at a quarter of the size.
const TEXTURE = {mode: Mode.ETC1S, quality: 255, compression: 4};
const OUTPUTS = [
  {path: 'public/models/helmet-8k.glb', size: 8192},
  {path: 'public/models/helmet-4k.glb', size: 4096},
];

const sourcePath = process.argv[2];

if (!sourcePath) {
  throw new Error('Usage: npm run model:helmet -- <path/to/source.glb>');
}

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({'meshopt.encoder': MeshoptEncoder});

const prepareGeometry = async (document: Document) => {
  await document.transform(
    dedup(),
    flatten(),
    join(),
    weld(),
    simplify({simplifier: MeshoptSimplifier, ...SIMPLIFY}),
  );

  forEach(document.getRoot().listMaterials(), (material) => {
    material.setMetallicFactor(MATERIAL.metallic).setRoughnessFactor(MATERIAL.roughness);
  });
};

for (const {path, size} of OUTPUTS) {
  const document = await io.read(sourcePath);

  await prepareGeometry(document);
  await document.transform(
    toktx({encoder: sharp, resize: [size, size], ...TEXTURE}),
    prune(),
    meshopt({encoder: MeshoptEncoder, level: 'medium'}),
  );
  await io.write(path, document);
  console.warn(`Written ${path}`);
}
