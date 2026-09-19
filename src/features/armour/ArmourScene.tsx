'use client';

import {Center, OrbitControls} from '@react-three/drei';
import {Canvas, useLoader, useThree} from '@react-three/fiber';
import {Suspense, useEffect, useState} from 'react';
import {PMREMGenerator, type WebGLRenderer} from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {KTX2Loader} from 'three/addons/loaders/KTX2Loader.js';

const MODEL = {
  detailed: {url: '/models/helmet-8k.glb', textureSize: 8192},
  fallback: {url: '/models/helmet-4k.glb'},
};
// Basis transcoder shipped with three (node_modules/three/examples/jsm/libs/basis).
const BASIS_TRANSCODER_PATH = '/basis/';

// The scan faces +X; turn it towards the camera.
const FACE_CAMERA: [number, number, number] = [0, -Math.PI / 2, 0];
// Framing for the ~2.2-unit-tall helmet.
const CAMERA_POSITION: [number, number, number] = [0, 0, 4.6];
// Keeps the camera outside the helmet and the helmet from shrinking to a dot.
const ZOOM = {min: 2.4, max: 7};

const createRoomEnvironment = (renderer: WebGLRenderer) => {
  const generator = new PMREMGenerator(renderer);
  const texture = generator.fromScene(new RoomEnvironment(), 0.04).texture;

  generator.dispose();

  return texture;
};

// Metal needs something to reflect; a procedural room avoids downloading an HDR map.
const RoomLighting = () => {
  const renderer = useThree((state) => state.gl);
  // Lazy state, not useMemo: the GPU texture must be created exactly once.
  const [environment] = useState(() => createRoomEnvironment(renderer));

  useEffect(() => {
    return () => {
      environment.dispose();
    };
  }, [environment]);

  return <primitive attach="environment" object={environment} />;
};

type HelmetProps = {
  onReady: () => void;
};

const Helmet = ({onReady}: HelmetProps) => {
  const renderer = useThree((state) => state.gl);
  // Created once: the loader owns a worker pool for texture transcoding.
  const [ktx2Loader] = useState(() =>
    new KTX2Loader().setTranscoderPath(BASIS_TRANSCODER_PATH).detectSupport(renderer),
  );
  // Devices that can't hold an 8K texture get the 4K build.
  const {url} =
    renderer.capabilities.maxTextureSize >= MODEL.detailed.textureSize
      ? MODEL.detailed
      : MODEL.fallback;
  const {scene} = useLoader(GLTFLoader, url, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder).setKTX2Loader(ktx2Loader);
  });

  useEffect(() => {
    return () => {
      ktx2Loader.dispose();
    };
  }, [ktx2Loader]);

  useEffect(() => {
    onReady();
  }, [onReady]);

  return (
    <Center>
      <primitive object={scene} rotation={FACE_CAMERA} />
    </Center>
  );
};

type ArmourSceneProps = HelmetProps & {
  isActive: boolean;
};

const ArmourScene = ({isActive, onReady}: ArmourSceneProps) => {
  // This component is rendered on the client only, so the media query is safe to read here.
  const [autoRotate] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  return (
    <Canvas
      frameloop={isActive ? 'always' : 'never'}
      dpr={[1, 2]}
      camera={{fov: 30, position: CAMERA_POSITION}}
      gl={{alpha: true}}
    >
      <RoomLighting />
      <Suspense fallback={null}>
        <Helmet onReady={onReady} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={ZOOM.min}
        maxDistance={ZOOM.max}
        autoRotate={autoRotate}
        autoRotateSpeed={1}
      />
    </Canvas>
  );
};

export default ArmourScene;
