import {cp, mkdir} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {dirname, join} from 'node:path';

const TRANSCODER_ENTRY = 'basis_transcoder.js';
const transcoderFiles = [TRANSCODER_ENTRY, 'basis_transcoder.wasm'];
const TARGET_DIRECTORY = 'public/basis';

// three does not export its package.json, so the directory is found through the transcoder.
const require = createRequire(import.meta.url);
const sourceDirectory = dirname(require.resolve(`three/addons/libs/basis/${TRANSCODER_ENTRY}`));

await mkdir(TARGET_DIRECTORY, {recursive: true});

for (const file of transcoderFiles) {
  await cp(join(sourceDirectory, file), join(TARGET_DIRECTORY, file));
}

console.log(`Copied the Basis transcoder into ${TARGET_DIRECTORY}`);
