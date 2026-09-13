import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Eye,
  Layers,
  Network,
  Radio,
  Thermometer,
  Wifi,
  Crosshair,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Box,
  ExternalLink
} from 'lucide-react';

const STATIC_PHOTOS = {
  lidarMap: 'https://res.cloudinary.com/dqeenwawp/image/upload/v1789061146/rover-lidar_hprvh5.jpg',
  nightVision: 'https://res.cloudinary.com/dqeenwawp/image/upload/v1789061145/rover-night-vision_krzs18.jpg',
  thermal: 'https://res.cloudinary.com/dqeenwawp/image/upload/v1789061147/rover-infrared_bisclt.jpg'
};

// ==========================================
// STATIC TELEMETRY DATA
// ==========================================
const STATIC_TELEMETRY = {
  rover: {
    id: 'rover',
    status: 'ACTIVE',
    x: 124.52,
    y: 87.31,
    z: -42.18,
    depth: 42.18,
    heading: 127,
    distanceTraveled: 1428.6,
    mappingStatus: 'STATIC MAP',
    battery: 88,
  },
  sensors: [
    { id: 'air_quality', name: 'AQI', value: 92, unit: 'AQI', status: 'SAFE', safeRange: '0-100 AQI', theme: 'cyan' },
    { id: 'o2', name: 'O₂', value: 20.7, unit: '%', status: 'SAFE', safeRange: '19.5-23.5%', theme: 'emerald' },
    { id: 'co2', name: 'CO₂', value: 0.08, unit: '%', status: 'SAFE', safeRange: '0.00-0.10%', theme: 'purple' },
    { id: 'temp', name: 'TEMP', value: 31.4, unit: '°C', status: 'WARNING', safeRange: '15-30 °C', theme: 'amber' },
    { id: 'dust', name: 'DUST', value: 0.05, unit: 'mg/m³', status: 'SAFE', safeRange: '0-0.1 mg/m³', theme: 'blue' },
    { id: 'humidity', name: 'HUMID', value: 68.2, unit: '%', status: 'SAFE', safeRange: '30-80%', theme: 'teal' },
    { id: 'ch4', name: 'CH₄', value: 0.12, unit: '%', status: 'SAFE', safeRange: '0.00-0.50%', theme: 'pink' },
    { id: 'h2s', name: 'H₂S', value: 0.02, unit: 'ppm', status: 'SAFE', safeRange: '0-1 ppm', theme: 'indigo' },
  ],
  mesh: {
    lastNode: 'NODE-07',
    status: 'CONNECTED',
    rssi: -67,
    linkQuality: 92,
    hops: 3,
    distance: 184,
  },
  cameras: {
    nv: { fps: 30, res: '1920×1080', status: 'STATIC CAPTURE', id: 'CAM-01' },
    thermal: { fps: 30, res: '640×480', status: 'STATIC CAPTURE', id: 'CAM-02', maxTemp: 43.7, avgTemp: 29.4, minTemp: 21.2 }
  }
};

// ==========================================
// MESHNET LOGO COMPONENT
// ==========================================
const MeshnetLogo = () => (
  <div className="flex items-center gap-2.5">
    <div className="relative flex items-center justify-center w-9 h-9 bg-slate-900 rounded-xl shadow-[4px_4px_10px_#c2cbd9,-4px_-4px_10px_#ffffff] p-1.5 border border-indigo-500/30">
      <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-400">
        <path
          d="M 15 80 L 15 25 L 50 60 L 85 25 L 85 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 15 80 L 50 60 L 85 80"
          fill="none"
          stroke="#6366f1"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="15" cy="25" r="9" className="fill-indigo-500 stroke-white stroke-2" />
        <circle cx="85" cy="25" r="9" className="fill-indigo-500 stroke-white stroke-2" />
        <circle cx="50" cy="60" r="9" className="fill-cyan-400 stroke-white stroke-2" />
        <circle cx="15" cy="80" r="7" className="fill-cyan-300" />
        <circle cx="85" cy="80" r="7" className="fill-cyan-300" />
      </svg>
    </div>
    <div className="flex flex-col leading-none">
      <span className="font-black text-lg tracking-wider bg-gradient-to-r from-indigo-700 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
        MESHNET
      </span>
      <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">
        System Node
      </span>
    </div>
  </div>
);

// ==========================================
// CLAYMORPHISM STYLES & DICTIONARY
// ==========================================
const clayBase = {
  container: 'bg-[#eef2f9] rounded-3xl shadow-[12px_12px_24px_#c2cbd9,-12px_-12px_24px_#ffffff]',
  insetFrame: 'rounded-2xl shadow-[inset_6px_6px_12px_#b8c4d6,inset_-6px_-6px_12px_#ffffff]',
  pillBase: 'rounded-full transition-all duration-300 font-bold',
};

const themeStyles = {
  indigo: {
    bg: 'bg-indigo-600 text-white',
    shadow: 'shadow-[6px_6px_14px_rgba(79,70,229,0.4),inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-3px_-3px_6px_rgba(0,0,0,0.2)]',
    badge: 'bg-indigo-100 text-indigo-700 shadow-[inset_2px_2px_4px_#c7d2fe,inset_-2px_-2px_4px_#ffffff]',
  },
  cyan: {
    bg: 'bg-cyan-500 text-white',
    shadow: 'shadow-[6px_6px_14px_rgba(6,182,212,0.4),inset_2px_2px_4px_rgba(255,255,255,0.5),inset_-3px_-3px_6px_rgba(0,0,0,0.2)]',
    badge: 'bg-cyan-100 text-cyan-800 shadow-[inset_2px_2px_4px_#a5f3fc,inset_-2px_-2px_4px_#ffffff]',
  },
  emerald: {
    bg: 'bg-emerald-500 text-white',
    shadow: 'shadow-[6px_6px_14px_rgba(16,185,129,0.4),inset_2px_2px_4px_rgba(255,255,255,0.5),inset_-3px_-3px_6px_rgba(0,0,0,0.2)]',
    badge: 'bg-emerald-100 text-emerald-800 shadow-[inset_2px_2px_4px_#a7f3d0,inset_-2px_-2px_4px_#ffffff]',
  },
  amber: {
    bg: 'bg-amber-500 text-white',
    shadow: 'shadow-[6px_6px_14px_rgba(245,158,11,0.4),inset_2px_2px_4px_rgba(255,255,255,0.5),inset_-3px_-3px_6px_rgba(0,0,0,0.2)]',
    badge: 'bg-amber-100 text-amber-800 shadow-[inset_2px_2px_4px_#fde68a,inset_-2px_-2px_4px_#ffffff]',
  },
  rose: {
    bg: 'bg-rose-500 text-white',
    shadow: 'shadow-[6px_6px_14px_rgba(244,63,94,0.4),inset_2px_2px_4px_rgba(255,255,255,0.5),inset_-3px_-3px_6px_rgba(0,0,0,0.2)]',
    badge: 'bg-rose-100 text-rose-800 shadow-[inset_2px_2px_4px_#fecdd3,inset_-2px_-2px_4px_#ffffff]',
  },
  purple: {
    bg: 'bg-purple-600 text-white',
    shadow: 'shadow-[6px_6px_14px_rgba(147,51,234,0.4),inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-3px_-3px_6px_rgba(0,0,0,0.2)]',
    badge: 'bg-purple-100 text-purple-800 shadow-[inset_2px_2px_4px_#e9d5ff,inset_-2px_-2px_4px_#ffffff]',
  },
  pink: {
    bg: 'bg-pink-500 text-white',
    shadow: 'shadow-[6px_6px_14px_rgba(236,72,153,0.4),inset_2px_2px_4px_rgba(255,255,255,0.5),inset_-3px_-3px_6px_rgba(0,0,0,0.2)]',
    badge: 'bg-pink-100 text-pink-800 shadow-[inset_2px_2px_4px_#fbcfe8,inset_-2px_-2px_4px_#ffffff]',
  },
  blue: {
    bg: 'bg-blue-600 text-white',
    shadow: 'shadow-[6px_6px_14px_rgba(37,99,235,0.4),inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-3px_-3px_6px_rgba(0,0,0,0.2)]',
    badge: 'bg-blue-100 text-blue-800 shadow-[inset_2px_2px_4px_#bfdbfe,inset_-2px_-2px_4px_#ffffff]',
  },
  teal: {
    bg: 'bg-teal-500 text-white',
    shadow: 'shadow-[6px_6px_14px_rgba(20,184,166,0.4),inset_2px_2px_4px_rgba(255,255,255,0.5),inset_-3px_-3px_6px_rgba(0,0,0,0.2)]',
    badge: 'bg-teal-100 text-teal-800 shadow-[inset_2px_2px_4px_#99f6e4,inset_-2px_-2px_4px_#ffffff]',
  }
};

// ==========================================
// SUB-COMPONENTS
// ==========================================

const Header = ({ telemetry, onNavigate3D }) => (
  <header className={`h-16 px-6 mx-3 mt-3 flex items-center justify-between shrink-0 select-none ${clayBase.container}`}>
    <div className="flex items-center gap-4">
      <MeshnetLogo />
      <span className={`px-3 py-1 text-xs font-black ${themeStyles.indigo.badge} rounded-full`}>
        {telemetry.rover.id}
      </span>
    </div>

    <div className="hidden md:flex items-center gap-4 text-xs font-black">
      <div className={`flex items-center gap-2 px-4 py-2 ${themeStyles.emerald.bg} ${themeStyles.emerald.shadow} ${clayBase.pillBase}`}>
        <span className="relative flex h-2.5 w-2.5">
          <span className="inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <span>ROVER ONLINE</span>
      </div>

      <div className={`flex items-center gap-2 px-4 py-2 ${themeStyles.cyan.bg} ${themeStyles.cyan.shadow} ${clayBase.pillBase}`}>
        <Wifi className="h-4 w-4" />
        <span>MESH CONNECTED</span>
      </div>

      <div className={`flex items-center gap-2 px-4 py-2 ${themeStyles.purple.bg} ${themeStyles.purple.shadow} ${clayBase.pillBase}`}>
        <Crosshair className="h-4 w-4" />
        <span>LiDAR ACTIVE</span>
      </div>

      {/* 3D VIEW PAGE NAVIGATION LINK BUTTON */}
      <Link
  to="/rover"
  onClick={(e) => {
    if (onNavigate3D) {
      onNavigate3D();
    }
  }}
  className={`flex items-center gap-2 px-4 py-2 ${themeStyles.indigo.bg} ${themeStyles.indigo.shadow} ${clayBase.pillBase} hover:opacity-90 active:scale-95 cursor-pointer text-white`}
>
  <Box className="h-4 w-4" />
  <span>ROVER 3D VIEW</span>
  <ExternalLink className="h-3 w-3 opacity-70" />
</Link>
    </div>
  </header>
);

const LidarMapBox = ({ rover }) => {
  return (
    <div className={`relative flex flex-col h-full overflow-hidden select-none p-3.5 ${clayBase.container}`}>
      <div className="flex items-center justify-between px-2 py-1 shrink-0 mb-1">
        <div className="flex items-center gap-2 text-slate-800 font-black text-xs">
          <div className={`p-2 ${themeStyles.blue.bg} ${themeStyles.blue.shadow} ${clayBase.pillBase}`}>
            <Layers className="h-4 w-4" />
          </div>
          <span>3D LiDAR MAPPING PHOTO</span>
        </div>
        <span className={`text-xs font-black px-4 py-1.5 ${themeStyles.emerald.bg} ${themeStyles.emerald.shadow} ${clayBase.pillBase}`}>
          {rover.mappingStatus}
        </span>
      </div>

      <div className={`relative flex-1 min-h-0 overflow-hidden ${clayBase.insetFrame}`}>
        <img
          src={STATIC_PHOTOS.lidarMap}
          alt="3D LiDAR Map"
          className="w-full h-full object-cover"
        />

        <div className={`absolute top-4 left-4 bg-[#eef2f9]/90 backdrop-blur-md p-3.5 font-mono text-xs text-slate-800 space-y-1 rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.25),-4px_-4px_8px_#ffffff] border border-white/60`}>
          <div className="text-indigo-600 font-black text-xs border-b border-slate-300 pb-1 mb-1.5 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 fill-indigo-600" /> POSITION MATRIX
          </div>
          <div className="flex justify-between gap-4 font-bold"><span>X:</span> <span className="text-blue-600 font-black">{rover.x} m</span></div>
          <div className="flex justify-between gap-4 font-bold"><span>Y:</span> <span className="text-blue-600 font-black">{rover.y} m</span></div>
          <div className="flex justify-between gap-4 font-bold"><span>DEPTH:</span> <span className="text-emerald-600 font-black">{rover.depth} m</span></div>
          <div className="flex justify-between gap-4 font-bold"><span>HEADING:</span> <span className="text-purple-600 font-black">{rover.heading}°</span></div>
        </div>
      </div>
    </div>
  );
};

const SensorPanel = ({ sensors }) => (
  <div className={`flex flex-col h-full overflow-hidden p-3.5 ${clayBase.container}`}>
    <div className="flex items-center justify-between px-2 py-1 shrink-0 mb-2">
      <div className="flex items-center gap-2 text-slate-800 font-black text-xs">
        <div className={`p-2 ${themeStyles.cyan.bg} ${themeStyles.cyan.shadow} ${clayBase.pillBase}`}>
          <Activity className="h-4 w-4" />
        </div>
        <span>LIVE SENSOR TELEMETRY</span>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto pr-1 space-y-2 select-none">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-0.5">
        {sensors.map((s) => (
          <div
            key={s.id}
            className={`flex flex-col justify-between p-2.5 bg-[#f8fafc] rounded-2xl shadow-[4px_4px_10px_#c2cbd9,-4px_-4px_10px_#ffffff] border border-white`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs text-slate-700 font-black truncate">{s.name}</span>
              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shrink-0 ${
                s.status === 'SAFE'
                  ? `${themeStyles.emerald.bg} ${themeStyles.emerald.shadow}`
                  : `${themeStyles.amber.bg} ${themeStyles.amber.shadow}`
              }`}>
                {s.status === 'SAFE' ? <ShieldCheck className="h-2.5 w-2.5" /> : <AlertTriangle className="h-2.5 w-2.5" />}
                {s.status}
              </span>
            </div>
            
            <div className="my-1 text-base font-black text-slate-800 truncate tracking-tight">
              {s.value} <span className="text-[10px] font-bold text-slate-400">{s.unit}</span>
            </div>

            <div className={`text-[8px] text-slate-500 font-mono font-bold px-1.5 py-0.5 rounded-lg bg-slate-100 shadow-[inset_1.5px_1.5px_3px_#cbd5e1] truncate`}>
              {s.safeRange}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MeshNetwork = ({ mesh }) => (
  <div className={`flex flex-col h-full font-sans overflow-hidden p-3.5 ${clayBase.container}`}>
    <div className="flex items-center justify-between px-2 py-1 shrink-0 mb-1">
      <div className="flex items-center gap-2 text-slate-800 font-black text-xs">
        <div className={`p-2 ${themeStyles.teal.bg} ${themeStyles.teal.shadow} ${clayBase.pillBase}`}>
          <Network className="h-4 w-4" />
        </div>
        <span>MESH NETWORK TELEMETRY</span>
      </div>
      <span className={`text-xs font-black px-3 py-1 ${themeStyles.teal.bg} ${themeStyles.teal.shadow} ${clayBase.pillBase}`}>
        {mesh.status}
      </span>
    </div>

    <div className="flex flex-wrap items-center justify-between gap-2 p-1 flex-1 overflow-y-auto">
      <div className={`flex flex-1 min-w-[140px] justify-between items-center px-3 py-2 bg-indigo-50/80 rounded-2xl shadow-[4px_4px_8px_#c2cbd9,-4px_-4px_8px_#ffffff] border border-white`}>
        <span className="text-slate-500 text-xs font-bold">LAST NODE:</span>
        <span className="text-indigo-600 font-black text-xs bg-indigo-100 px-2.5 py-0.5 rounded-full">{mesh.lastNode}</span>
      </div>

      <div className={`flex flex-1 min-w-[170px] justify-between items-center px-3 py-2 bg-emerald-50/80 rounded-2xl shadow-[4px_4px_8px_#c2cbd9,-4px_-4px_8px_#ffffff] border border-white`}>
        <span className="text-slate-500 text-xs font-bold">RSSI / HOPS:</span>
        <span className="text-emerald-600 font-black text-xs bg-emerald-100 px-2.5 py-0.5 rounded-full">{mesh.rssi} dBm ({mesh.hops} Hops)</span>
      </div>

      <div className={`flex items-center justify-center gap-1.5 bg-[#f8fafc] py-2 px-3 rounded-2xl shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff] text-xs font-mono font-black min-w-[200px]`}>
        <span className={`px-2 py-0.5 ${themeStyles.blue.bg} ${themeStyles.blue.shadow} rounded-lg text-[10px]`}>BASE</span>
        <span className="h-1 w-3 bg-cyan-400 rounded-full"></span>
        <span className={`px-2 py-0.5 ${themeStyles.cyan.bg} ${themeStyles.cyan.shadow} rounded-lg text-[10px]`}>NODE-07</span>
        <span className="h-1 w-3 bg-emerald-400 rounded-full"></span>
        <span className={`px-2 py-0.5 ${themeStyles.emerald.bg} ${themeStyles.emerald.shadow} rounded-lg text-[10px]`}>ROVER</span>
      </div>
    </div>
  </div>
);

const NightVisionCameraBox = ({ camera }) => (
  <div className={`flex flex-col h-full select-none font-sans overflow-hidden p-3.5 ${clayBase.container}`}>
    <div className="flex items-center justify-between px-2 py-1 text-xs shrink-0 mb-1">
      <div className="flex items-center gap-2 text-slate-800 font-black">
        <div className={`p-2 ${themeStyles.emerald.bg} ${themeStyles.emerald.shadow} ${clayBase.pillBase}`}>
          <Eye className="h-4 w-4" />
        </div>
        <span>NIGHT VISION [{camera.id}]</span>
      </div>
      <span className={`text-xs font-black px-3 py-1 ${themeStyles.emerald.bg} ${themeStyles.emerald.shadow} ${clayBase.pillBase}`}>
        ● {camera.status}
      </span>
    </div>

    <div className={`relative flex-1 min-h-0 overflow-hidden ${clayBase.insetFrame}`}>
      <img
        src={STATIC_PHOTOS.nightVision}
        alt="Night Vision Photo"
        className="w-full h-full object-cover"
      />

      <div className={`absolute top-3 left-3 text-[11px] font-mono font-black ${themeStyles.emerald.bg} ${themeStyles.emerald.shadow} px-3 py-1 rounded-full`}>
        {camera.res} | {camera.fps} FPS
      </div>
    </div>
  </div>
);

const ThermalCameraBox = ({ camera }) => (
  <div className={`flex flex-col h-full select-none font-sans overflow-hidden p-3.5 ${clayBase.container}`}>
    <div className="flex items-center justify-between px-2 py-1 text-xs shrink-0 mb-1">
      <div className="flex items-center gap-2 text-slate-800 font-black">
        <div className={`p-2 ${themeStyles.rose.bg} ${themeStyles.rose.shadow} ${clayBase.pillBase}`}>
          <Thermometer className="h-4 w-4" />
        </div>
        <span>THERMAL CAMERA [{camera.id}]</span>
      </div>
      <span className={`text-xs font-black px-3 py-1 ${themeStyles.rose.bg} ${themeStyles.rose.shadow} ${clayBase.pillBase}`}>
        ● {camera.status}
      </span>
    </div>

    <div className={`relative flex-1 min-h-0 overflow-hidden ${clayBase.insetFrame}`}>
      <img
        src={STATIC_PHOTOS.thermal}
        alt="Thermal Camera Photo"
        className="w-full h-full object-cover"
      />

      <div className={`absolute top-3 left-3 text-xs font-mono bg-[#eef2f9]/90 backdrop-blur-md p-2.5 rounded-2xl shadow-[6px_6px_12px_rgba(0,0,0,0.3)] border border-white/60 space-y-0.5`}>
        <div className="text-slate-700 font-bold">MAX: <span className="text-rose-600 font-black">{camera.maxTemp}°C</span></div>
        <div className="text-slate-700 font-bold">AVG: <span className="text-indigo-600 font-black">{camera.avgTemp}°C</span></div>
      </div>
    </div>
  </div>
);

// ==========================================
// MAIN DASHBOARD EXPORT
// ==========================================
export default function Dashboard({ onNavigate3D }) {
  const telemetry = STATIC_TELEMETRY;

  return (
    <div className="h-screen w-screen bg-[#e2e8f0] text-slate-800 flex flex-col font-sans overflow-hidden">
      <Header telemetry={telemetry} onNavigate3D={onNavigate3D} />

      <main className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-10 gap-3 min-h-0 overflow-hidden">
        
        {/* LEFT PANEL */}
        <section className="lg:col-span-6 grid grid-rows-12 gap-3 h-full min-h-0">
          <div className="row-span-5 min-h-0">
            <LidarMapBox rover={telemetry.rover} />
          </div>

          <div className="row-span-4 min-h-0">
            <SensorPanel sensors={telemetry.sensors} />
          </div>

          <div className="row-span-3 min-h-0">
            <MeshNetwork mesh={telemetry.mesh} />
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="lg:col-span-4 grid grid-rows-2 gap-3 h-full min-h-0">
          <div className="row-span-1 min-h-0">
            <NightVisionCameraBox camera={telemetry.cameras.nv} />
          </div>
          <div className="row-span-1 min-h-0">
            <ThermalCameraBox camera={telemetry.cameras.thermal} />
          </div>
        </section>

      </main>
    </div>
  );
}