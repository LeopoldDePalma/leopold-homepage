'use client';

import {Center, Environment, Lightformer, OrbitControls} from '@react-three/drei';
import {Canvas, useFrame, useLoader, useThree} from '@react-three/fiber';
import {type ComponentRef, Suspense, useEffect, useRef} from 'react';
import {MathUtils, type WebGLRenderer} from 'three';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {KTX2Loader} from 'three/addons/loaders/KTX2Loader.js';

import {usePrefersReducedMotion} from '@/lib/hooks/usePrefersReducedMotion';

const MODEL_URL = '/models/helmet-4k.glb';
const BASIS_TRANSCODER_PATH = '/basis/';

// The scan faces +X; turn it towards the camera.
const FACE_CAMERA: [number, number, number] = [0, -Math.PI / 2, 0];
const CAMERA_POSITION: [number, number, number] = [0, 0, 4.6];
const ZOOM = {min: 2.4, max: 7};
// In OrbitControls units, where 1 is about a turn a minute.
const SPIN = {intro: 400, idle: 1, introSeconds: 1.6};

let ktx2Loader: KTX2Loader | undefined;

// One loader for the page: it owns the transcoding workers.
const getKtx2Loader = (renderer: WebGLRenderer) => {
  ktx2Loader ??= new KTX2Loader().setTranscoderPath(BASIS_TRANSCODER_PATH).detectSupport(renderer);

  return ktx2Loader;
};

const StudioLighting = () => (
  <Environment>
    <color attach="background" args={['#7a7a7a']} />
    <Lightformer intensity={4} position={[0, 3, 3]} scale={[5, 2, 1]} />
    <Lightformer intensity={3} position={[-4, 1, 1]} scale={[2, 4, 1]} />
    <Lightformer intensity={2} position={[4, 0, -2]} scale={[2, 4, 1]} />
    <Lightformer intensity={1.5} position={[0, -0.5, 5]} scale={[6, 3, 1]} />
  </Environment>
);

const easeOutCirc = (progress: number) => Math.sqrt(1 - (progress - 1) ** 2);

const OrbitingCamera = ({autoRotate}: {autoRotate: boolean}) => {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const elapsedSeconds = useRef(0);

  useFrame((_, delta) => {
    const orbit = controlsRef.current;

    if (!orbit || !autoRotate) {
      return;
    }

    elapsedSeconds.current += delta;
    const progress = Math.min(elapsedSeconds.current / SPIN.introSeconds, 1);

    orbit.autoRotateSpeed = MathUtils.lerp(SPIN.intro, SPIN.idle, easeOutCirc(progress));
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={ZOOM.min}
      maxDistance={ZOOM.max}
      autoRotate={autoRotate}
    />
  );
};

const Helmet = ({onModelReady}: {onModelReady: () => void}) => {
  const renderer = useThree((state) => state.gl);
  const {scene} = useLoader(GLTFLoader, MODEL_URL, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder).setKTX2Loader(getKtx2Loader(renderer));
  });

  useEffect(() => {
    onModelReady();
  }, [onModelReady]);

  return (
    <Center>
      <primitive object={scene} rotation={FACE_CAMERA} />
    </Center>
  );
};

const HelmetScene = ({active, onModelReady}: {active: boolean; onModelReady: () => void}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const turning = active && !prefersReducedMotion;

  return (
    <Canvas
      frameloop={turning ? 'always' : 'demand'}
      dpr={[1, 2]}
      camera={{fov: 30, position: CAMERA_POSITION}}
    >
      <StudioLighting />
      <Suspense fallback={null}>
        <Helmet onModelReady={onModelReady} />
        <OrbitingCamera autoRotate={turning} />
      </Suspense>
    </Canvas>
  );
};

export default HelmetScene;
