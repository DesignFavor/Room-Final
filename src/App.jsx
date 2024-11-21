import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, ContactShadows, Html, Effects, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

import tunnel from 'tunnel-rat';
import Hotspot from './assets/hotspot';
import { EffectComposer, N8AO, SSR } from '@react-three/postprocessing';

const status = tunnel();

export default function App() {
  const [showProduct, setShowProduct] = useState(false);

  // Toggle the visibility of the Product component when hotspot is clicked
  const handleHotspotClick = () => {
    setShowProduct((prev) => !prev);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas
        shadows
        gl={{
          outputEncoding: THREE.sRGBEncoding,
          toneMapping: THREE.FilmicToneMapping,
          toneMappingExposure: 2,
        }}
      >
        <PerspectiveCamera makeDefault fov={55} position={[0, 0.5, 3]} />
        <ambientLight intensity={1} color="white" />

        <group position={[0, -3, -3]}>
          <Suspense fallback={<status.In>Loading...</status.In>}>
            <Model url='./model/club.glb' onHotspotClick={handleHotspotClick} />
          </Suspense>
          <ContactShadows position={[0, -2, -0.16]} />
        </group>
        <Environment files="./envy.hdr" background={false} />
        <Effects disableGamma>
          <EffectComposer>
            <N8AO intensity={1} radius={1} color="black" />
            <SSR
              intensity={0.5}
              distance={10}
              fade={0.5}
              roughnessFade={0.1}
              maxRoughness={1}
              thickness={10}
              ior={1.45}
            />
          </EffectComposer>
        </Effects>

        <OrbitControls
          enableZoom={true}
          minDistance={2}
          maxDistance={5}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 3}
          enableDamping={true}
          enablePan={true}
        />
      </Canvas>
    </div>
  );
}

function Model({ url, onHotspotClick, ...props }) {
  const { scene } = useGLTF(url);

  const shirtObject = scene.getObjectByName('Shirt');

  return (
    <>
      <primitive object={scene} {...props} />

      {shirtObject && (
        <mesh
          position={new THREE.Vector3().setFromMatrixPosition(shirtObject.matrixWorld)}
          rotation={shirtObject.rotation}
          scale={shirtObject.scale}
        >
          <Html>
            <Hotspot onClick={onHotspotClick} />
          </Html>
        </mesh>


      )}
    </>
  ); 
  
}
