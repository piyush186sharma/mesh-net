import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  useGLTF,
  Stage,
  Grid,
  Html,
  PerspectiveCamera,
  Center
} from '@react-three/drei';
import {
  ArrowLeft,
  RotateCw,
  Layers,
  Box,
  Maximize2,
  AlertTriangle
} from 'lucide-react';

// Error Boundary Component to prevent Canvas crash on missing model
class ModelErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ef4444" wireframe />
          <Html center>
            <div className="bg-red-500 text-white font-bold text-xs p-3 rounded-xl shadow-lg whitespace-nowrap flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>GLB Model Not Found at /models/rover.glb</span>
            </div>
          </Html>
        </mesh>
      );
    }
    return this.props.children;
  }
}

function RoverModel({ url, autoRotate, rotationAxis, isWireframe }) {
  const { scene } = useGLTF(url);
  const modelGroupRef = useRef();

  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.wireframe = isWireframe;
    }
  });

  useFrame((_, delta) => {
    if (autoRotate && modelGroupRef.current) {
      if (rotationAxis === 'x') {
        modelGroupRef.current.rotation.x += delta * 0.4;
      } else if (rotationAxis === 'z') {
        modelGroupRef.current.rotation.z += delta * 0.4;
      } else {
        modelGroupRef.current.rotation.y += delta * 0.4;
      }
    }
  });

  return (
    <group ref={modelGroupRef}>
      <Center>
        {/* Rotate -90 degrees on the X-axis to stand the model upright */}
        <primitive 
          object={scene} 
          rotation={[-Math.PI / 2, 0, 0]} 
          scale={1} 
        />
      </Center>
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-6 bg-[#eef2f9] rounded-3xl shadow-[12px_12px_24px_#c2cbd9,-12px_-12px_24px_#ffffff] border border-white">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="font-black text-slate-700 text-xs tracking-wider uppercase">Loading 3D Model...</span>
      </div>
    </Html>
  );
}

export default function Rover3DView({ onBack }) {
  const [autoRotate, setAutoRotate] = useState(false);
  const [rotationAxis, setRotationAxis] = useState('y'); // 'x', 'y', or 'z'
  const [isWireframe, setIsWireframe] = useState(false);
  const [preset, setPreset] = useState('night');
  const controlsRef = useRef();

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="h-screen w-screen bg-[#e2e8f0] text-slate-800 flex flex-col font-sans overflow-hidden select-none">
      
      <header className="h-16 px-6 mx-3 mt-3 flex items-center justify-between shrink-0 bg-[#eef2f9] rounded-3xl shadow-[12px_12px_24px_#c2cbd9,-12px_-12px_24px_#ffffff]">
        <div className="flex items-center gap-4">
          <a
            href="/"
            onClick={(e) => {
              if (onBack) {
                e.preventDefault();
                onBack();
              }
            }}
            className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-2xl shadow-[6px_6px_14px_rgba(79,70,229,0.4)] hover:opacity-90 active:scale-95 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </a>
          <div>
            <h1 className="font-black text-base bg-gradient-to-r from-indigo-700 to-cyan-600 bg-clip-text text-transparent leading-none">
              ROVER 3D INSPECTION
            </h1>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider">
              INTERACTIVE GLB VIEWPORT
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-black">
          {/* WIREFRAME TOGGLE */}
          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all active:scale-95 ${
              isWireframe
                ? 'bg-cyan-500 text-white shadow-[6px_6px_14px_rgba(6,182,212,0.4)]'
                : 'bg-slate-200 text-slate-700 shadow-[inset_2px_2px_4px_#cbd5e1]'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>WIREFRAME</span>
          </button>

          {/* AUTO ROTATE TOGGLE */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all active:scale-95 ${
              autoRotate
                ? 'bg-indigo-600 text-white shadow-[6px_6px_14px_rgba(79,70,229,0.4)]'
                : 'bg-slate-200 text-slate-700 shadow-[inset_2px_2px_4px_#cbd5e1]'
            }`}
          >
            <RotateCw className={`h-4 w-4 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>AUTO ROTATE</span>
          </button>

          {/* AXIS SELECTION BUTTONS */}
          <div className="flex items-center bg-slate-200 rounded-full p-1 shadow-[inset_2px_2px_4px_#cbd5e1]">
            <button
              onClick={() => setRotationAxis('x')}
              className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all ${
                rotationAxis === 'x' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600'
              }`}
            >
              X-AXIS
            </button>
            <button
              onClick={() => setRotationAxis('y')}
              className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all ${
                rotationAxis === 'y' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600'
              }`}
            >
              Y-AXIS
            </button>
            <button
              onClick={() => setRotationAxis('z')}
              className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all ${
                rotationAxis === 'z' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600'
              }`}
            >
              Z-AXIS
            </button>
          </div>

          {/* LIGHTING PRESET */}
          <div className="flex items-center bg-slate-200 rounded-full p-1 shadow-[inset_2px_2px_4px_#cbd5e1]">
            <button
              onClick={() => setPreset('night')}
              className={`px-3 py-1 rounded-full text-[11px] transition-all ${
                preset === 'night' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600'
              }`}
            >
              NIGHT
            </button>
            <button
              onClick={() => setPreset('studio')}
              className={`px-3 py-1 rounded-full text-[11px] transition-all ${
                preset === 'studio' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600'
              }`}
            >
              STUDIO
            </button>
          </div>

          {/* RESET CAMERA */}
          <button
            onClick={resetCamera}
            className="p-2 bg-slate-800 text-white rounded-full shadow-[4px_4px_10px_#c2cbd9] hover:bg-slate-700 active:scale-95"
            title="Reset View"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 m-3 rounded-3xl bg-[#eef2f9] shadow-[12px_12px_24px_#c2cbd9,-12px_-12px_24px_#ffffff] overflow-hidden relative border border-white/60">
        <Canvas shadows className="w-full h-full">
          <PerspectiveCamera makeDefault position={[3, 2, 4]} fov={50} />

          <Suspense fallback={<Loader />}>
            <ModelErrorBoundary>
              <Stage environment={preset} intensity={0.6} adjustCamera={1.2}>
                <RoverModel
                  url="./models/rover.glb"
                  autoRotate={autoRotate}
                  rotationAxis={rotationAxis}
                  isWireframe={isWireframe}
                />
              </Stage>
            </ModelErrorBoundary>

            <Grid
              renderOrder={-1}
              position={[0, -0.01, 0]}
              infiniteGrid
              cellSize={0.6}
              cellThickness={1}
              cellColor="#6366f1"
              sectionSize={3}
              sectionThickness={1.5}
              sectionColor="#06b6d4"
              fadeDistance={30}
            />
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            makeDefault
            minDistance={1}
            maxDistance={20}
            enableDamping
            dampingFactor={0.05}
          />
        </Canvas>
      </main>
    </div>
  );
}