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
  Maximize2,
  AlertTriangle,
  Activity,
  ChevronRight,
  ChevronLeft,
  Clock,
  CheckCircle2,
  Cpu,
  Video,
  Signal,
  ShieldAlert
} from 'lucide-react';

// --- ON-BOARD HARDWARE DIAGNOSTICS DATA ---
const ROVER_CAMERAS = [
  { id: 'CAM-FRONT', name: 'Night Vision Camera', status: 'ONLINE', health: '100%', ping: '12ms', state: 'ok' },
  { id: 'CAM-DEPTH', name: 'Thermal Camera', status: 'ONLINE', health: '98%', ping: '15ms', state: 'ok' },
]

const ROVER_SENSORS = [
  { name: '360° LiDAR', state: 'SPINNING', status: 'OK', details: '10Hz rate' },
  { name: 'IMU', state: 'CALIBRATED', status: 'OK', details: 'Acc/Gyr stable' },
  { name: 'Sensor Array', state: 'ACTIVE', status: 'OK', details: '6/6 Responding' },
  { name: 'Motor Encoders', state: 'SYNCED', status: 'OK', details: 'All 4 Wheels' },
  { name: 'BMS (Battery)', state: 'NOMINAL', status: 'OK', details: '24.2V Output' }
];

const DIAGNOSTIC_LOGS = [
  { time: '11:14:28', type: 'SYS', msg: 'System Stable' },
  
];

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
        {/* Rotate -90 degrees on X-axis to stand upright */}
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
  const [rotationAxis, setRotationAxis] = useState('y');
  const [isWireframe, setIsWireframe] = useState(false);
  const [preset, setPreset] = useState('night');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const controlsRef = useRef();

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="h-screen w-screen bg-[#e2e8f0] text-slate-800 flex flex-col font-sans overflow-hidden select-none">
      
      {/* HEADER BAR */}
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
              HARDWARE DIAGNOSTICS VIEW
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-black">
          {/* WIREFRAME TOGGLE */}
          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all active:scale-95 cursor-pointer ${
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
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all active:scale-95 cursor-pointer ${
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
            {['x', 'y', 'z'].map((axis) => (
              <button
                key={axis}
                onClick={() => setRotationAxis(axis)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                  rotationAxis === axis ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600'
                }`}
              >
                {axis.toUpperCase()}-AXIS
              </button>
            ))}
          </div>

          {/* LIGHTING PRESET */}
          <div className="flex items-center bg-slate-200 rounded-full p-1 shadow-[inset_2px_2px_4px_#cbd5e1]">
            <button
              onClick={() => setPreset('night')}
              className={`px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
                preset === 'night' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600'
              }`}
            >
              NIGHT
            </button>
            <button
              onClick={() => setPreset('studio')}
              className={`px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
                preset === 'studio' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600'
              }`}
            >
              STUDIO
            </button>
          </div>

          {/* RESET CAMERA */}
          <button
            onClick={resetCamera}
            className="p-2 bg-slate-800 text-white rounded-full shadow-[4px_4px_10px_#c2cbd9] hover:bg-slate-700 active:scale-95 cursor-pointer"
            title="Reset View"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT WITH RIGHT DIAGNOSTICS SIDEBAR */}
      <main className="flex-1 m-3 flex gap-3 min-h-0 overflow-hidden relative">
        {/* 3D CANVAS */}
        <div className="flex-1 rounded-3xl bg-[#eef2f9] shadow-[12px_12px_24px_#c2cbd9,-12px_-12px_24px_#ffffff] overflow-hidden relative border border-white/60">
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

          {/* TOGGLE SIDEBAR BUTTON */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute top-4 right-4 z-10 p-2.5 bg-[#eef2f9] text-indigo-600 rounded-2xl shadow-[4px_4px_10px_#c2cbd9,-4px_-4px_10px_#ffffff] border border-white hover:bg-white active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-black"
          >
            {isSidebarOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            <span>{isSidebarOpen ? 'HIDE SYS' : 'SHOW SYS'}</span>
          </button>
        </div>

        {/* RIGHT DIAGNOSTICS PANEL */}
        {isSidebarOpen && (
          <aside className="w-80 shrink-0 bg-[#eef2f9] rounded-3xl shadow-[12px_12px_24px_#c2cbd9,-12px_-12px_24px_#ffffff] p-4 flex flex-col gap-3 overflow-hidden border border-white/60 animate-in slide-in-from-right duration-300">
            {/* PANEL HEADER */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-600 text-white rounded-xl shadow-md">
                  <Activity className="h-4 w-4" />
                </div>
                <span className="font-black text-xs text-slate-800 tracking-wider uppercase">
                  Hardware Diagnostics
                </span>
              </div>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {/* SECTION 1: ON-BOARD CAMERAS */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Video className="h-3 w-3 text-indigo-500" /> Camera Modules
                </span>
                
                {ROVER_CAMERAS.map((cam) => (
                  <div key={cam.id} className="p-2.5 bg-[#f8fafc] rounded-2xl border border-white shadow-[4px_4px_8px_#c2cbd9,-4px_-4px_8px_#ffffff] space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        {cam.state === 'ok' ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <Clock className="h-3 w-3 text-amber-500" />}
                        {cam.name}
                      </span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${cam.state === 'ok' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                        {cam.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500">
                      <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> HW: {cam.health}</span>
                      <span className="flex items-center gap-1"><Signal className="h-3 w-3" /> {cam.ping}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* SECTION 2: ROVER SENSORS GRID */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Cpu className="h-3 w-3 text-cyan-500" /> Sensor Subsystems
                </span>

                <div className="grid grid-cols-2 gap-2">
                  {ROVER_SENSORS.map((s, idx) => (
                    <div key={idx} className="p-2 bg-[#f8fafc] rounded-xl border border-white shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-700 truncate">{s.name}</span>
                        {s.status === 'OK' ? (
                          <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                        ) : (
                          <ShieldAlert className="h-3 w-3 text-rose-500 shrink-0" />
                        )}
                      </div>
                      <div className="text-[11px] font-black text-indigo-700 my-0.5">{s.state}</div>
                      <span className="text-[8px] font-mono text-slate-500 font-bold">{s.details}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: SYSTEM DIAGNOSTIC LOGS */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Activity className="h-3 w-3 text-emerald-500" /> Hardware Event Log
                </span>

                <div className="p-2.5 bg-slate-900 rounded-2xl shadow-[inset_2px_2px_4px_#0f172a] font-mono text-[10px] space-y-2 max-h-44 overflow-y-auto">
                  {DIAGNOSTIC_LOGS.map((log, idx) => (
                    <div key={idx} className="flex gap-2 items-start text-slate-300">
                      <span className="text-slate-500 shrink-0">[{log.time}]</span>
                      <span className={log.type === 'WARN' ? 'text-amber-400' : log.type === 'SYS' ? 'text-cyan-400' : 'text-emerald-400'}>
                        {log.msg}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}
      </main>
    </div>
  );
}