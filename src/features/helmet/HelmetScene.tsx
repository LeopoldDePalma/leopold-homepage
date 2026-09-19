'use client';

import {Center, Environment, Lightformer, OrbitControls} from '@react-three/drei';
import {Canvas, useLoader, useThree} from '@react-three/fiber';
import {Suspense, useEffect} from 'react';
import type {WebGLRenderer} from 'three';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {KTX2Loader} from 'three/addons/loaders/KTX2Loader.js';

import {usePrefersReducedMotion} from '@/lib/hooks/usePrefersReducedMotion';

const MODEL_URL = {detailed: '/models/helmet-8k.glb', fallback: '/models/helmet-4k.glb'};
const DETAILED_TEXTURE_SIZE = 8192;
// Basis transcoder shipped with three (node_modules/three/examples/jsm/libs/basis).
const BASIS_TRANSCODER_PATH = '/basis/';

// The scan faces +X; turn it towards the camera.
const FACE_CAMERA: [number, number, number] = [0, -Math.PI / 2, 0];
// Framing for the ~2.2-unit-tall helmet.
const CAMERA_POSITION: [number, number, number] = [0, 0, 4.6];
// Keeps the camera outside the helmet and the helmet from shrinking to a dot.
const ZOOM = {min: 2.4, max: 7};

let ktx2Loader: KTX2Loader | undefined;

// One loader for the page: it owns the transcoding workers, which live as long as the page.
const getKtx2Loader = (renderer: WebGLRenderer) => {
  ktx2Loader ??= new KTX2Loader().setTranscoderPath(BASIS_TRANSCODER_PATH).detectSupport(renderer);

  return ktx2Loader;
};

// A dark studio with a few soft boxes: polished steel reads dark, with bright highlights.
const StudioLighting = () => {
  return (
    <Environment>
      <color attach="background" args={['#7a7a7a']} />
      <Lightformer intensity={4} position={[0, 3, 3]} scale={[5, 2, 1]} />
      <Lightformer intensity={3} position={[-4, 1, 1]} scale={[2, 4, 1]} />
      <Lightformer intensity={2} position={[4, 0, -2]} scale={[2, 4, 1]} />
      <Lightformer intensity={1.5} position={[0, -0.5, 5]} scale={[6, 3, 1]} />
    </Environment>
  );
};

const Helmet = ({onModelReady}: {onModelReady: () => void}) => {
  const renderer = useThree((state) => state.gl);
  // Devices that can't hold an 8K texture get the 4K build.
  const url =
    renderer.capabilities.maxTextureSize >= DETAILED_TEXTURE_SIZE
      ? MODEL_URL.detailed
      : MODEL_URL.fallback;
  const {scene} = useLoader(GLTFLoader, url, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder).setKTX2Loader(getKtx2Loader(renderer));
  });

  // The scan's pivot is slightly off its bounding box, which would wobble while rotating.
  // The showcase keeps its spinner until the model is on screen.
  useEffect(() => {
    onModelReady();
  }, [onModelReady]);

  return (
    <Center>
      <primitive object={scene} rotation={FACE_CAMERA} />
    </Center>
  );
};

type HelmetSceneProps = {
  isActive: boolean;
  onModelReady: () => void;
  className: string;
};

const HelmetScene = ({isActive, onModelReady, className}: HelmetSceneProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Canvas
      className={className}
      frameloop={isActive ? 'always' : 'never'}
      dpr={[1, 2]}
      camera={{fov: 30, position: CAMERA_POSITION}}
    >
      <StudioLighting />
      <Suspense fallback={null}>
        <Helmet onModelReady={onModelReady} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={ZOOM.min}
        maxDistance={ZOOM.max}
        autoRotate={!prefersReducedMotion}
        autoRotateSpeed={1}
      />
    </Canvas>
  );
};

export default HelmetScene;
