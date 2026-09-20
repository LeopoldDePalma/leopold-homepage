/**
 * Copies the Basis transcoder that ships inside three into `public/basis`.
 *
 * KTX2Loader needs the transcoder served from our own origin, and its version has to match the
 * three build using it. Copying on install keeps the two in step instead of relying on someone
 * remembering to do it by hand, so `public/basis` stays out of git.
 */
import {cp, mkdir} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {dirname, join} from 'node:path';

const TRANSCODER_ENTRY = 'basis_transcoder.js';
const TRANSCODER_FILES = [TRANSCODER_ENTRY, 'basis_transcoder.wasm'];
const TARGET_DIRECTORY = 'public/basis';

// three does not expose its package.json, so the directory comes from the transcoder itself.
const require = createRequire(import.meta.url);
const sourceDirectory = dirname(require.resolve(`three/addons/libs/basis/${TRANSCODER_ENTRY}`));

await mkdir(TARGET_DIRECTORY, {recursive: true});

for (const file of TRANSCODER_FILES) {
  await cp(join(sourceDirectory, file), join(TARGET_DIRECTORY, file));
}

console.log(`Copied the Basis transcoder into ${TARGET_DIRECTORY}`);
