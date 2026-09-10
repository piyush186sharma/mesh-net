import React, { useState, useEffect } from 'react';
import {
  Activity,
  Eye,
  Layers,
  Network,
  Radio,
  Thermometer,
  Wifi,
  Crosshair
} from 'lucide-react';

// Placeholders for images (Replace these URLs with your local image paths or imports, e.g., import lidarImg from './lidar.jpg')
const STATIC_PHOTOS = {
  lidarMap: 'https://res.cloudinary.com/dqeenwawp/image/upload/v1789061146/rover-lidar_hprvh5.jpg',
  nightVision: 'https://res.cloudinary.com/dqeenwawp/image/upload/v1789061145/rover-night-vision_krzs18.jpg',
  thermal: 'https://res.cloudinary.com/dqeenwawp/image/upload/v1789061147/rover-infrared_bisclt.jpg'
};

// ==========================================
// CENTRAL TELEMETRY HOOK
// ==========================================
const useRoverTelemetry = () => {
  const [telemetry, setTelemetry] = useState({
    rover: {
      id: 'ROVER-01',
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
    // The requested 8 sensors only
    sensors: [
      { id: 'air_quality', name: 'AQI', value: 92, unit: 'AQI', status: 'SAFE', safeRange: '0-100 AQI' },
      { id: 'o2', name: 'O₂', value: 20.7, unit: '%', status: 'SAFE', safeRange: '19.5-23.5%' },
      { id: 'co2', name: 'CO₂', value: 0.08, unit: '%', status: 'SAFE', safeRange: '0.00-0.10%' },
      { id: 'temp', name: 'TEMP', value: 31.4, unit: '°C', status: 'WARNING', safeRange: '15-30 °C' },
      { id: 'dust', name: 'DUST', value: 0.05, unit: 'mg/m³', status: 'SAFE', safeRange: '0-0.1 mg/m³' },
      { id: 'humidity', name: 'HUMID', value: 68.2, unit: '%', status: 'SAFE', safeRange: '30-80%' },
      { id: 'ch4', name: 'CH₄', value: 0.12, unit: '%', status: 'SAFE', safeRange: '0.00-0.50%' },
      { id: 'h2s', name: 'H₂S', value: 0.02, unit: 'ppm', status: 'SAFE', safeRange: '0-1 ppm' },
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
    },
    timestamp: new Date().toLocaleTimeString()
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const timeStr = new Date().toLocaleTimeString();
        const deltaX = (Math.random() - 0.48) * 0.1;
        const deltaY = (Math.random() - 0.45) * 0.1;
        const newX = parseFloat((prev.rover.x + deltaX).toFixed(2));
        const newY = parseFloat((prev.rover.y + deltaY).toFixed(2));

        const updatedSensors = prev.sensors.map(s => {
          let jitter = (Math.random() - 0.5) * (s.value * 0.02);
          let newVal = parseFloat((s.value + jitter).toFixed(2));
          let status = s.status;
          if (s.id === 'temp') status = newVal > 31.0 ? 'WARNING' : 'SAFE';
          return { ...s, value: newVal, status };
        });

        return {
          ...prev,
          timestamp: timeStr,
          rover: {
            ...prev.rover,
            x: newX,
            y: newY,
          },
          sensors: updatedSensors,
          mesh: {
            ...prev.mesh,
            rssi: Math.max(-90, Math.min(-50, prev.mesh.rssi + Math.floor((Math.random() - 0.5) * 3))),
          }
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return telemetry;
};

// ==========================================
// SUB-COMPONENTS
// ==========================================

const Header = ({ telemetry }) => (
  <header className="h-12 border-b border-cyan-900/40 bg-slate-950/90 px-4 flex items-center justify-between font-mono text-xs shrink-0 select-none">
    <div className="flex items-center gap-3">
      <div className="flex h-7 w-7 items-center justify-center rounded border border-cyan-500/40 bg-cyan-950/30 text-cyan-400">
        <Radio className="h-3.5 w-3.5 animate-pulse" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs tracking-wider text-slate-100">MESHNET</span>
          <span className="rounded bg-cyan-950 px-1.5 py-0.5 text-[9px] text-cyan-400 border border-cyan-800/50">
            {telemetry.rover.id}
          </span>
        </div>
      </div>
    </div>

    <div className="hidden md:flex items-center gap-5 text-[10px]">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-slate-300">ROVER ONLINE</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Wifi className="h-3 w-3 text-cyan-400" />
        <span className="text-slate-300">MESH CONNECTED</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Crosshair className="h-3 w-3 text-emerald-400" />
        <span className="text-slate-300">LiDAR ACTIVE</span>
      </div>
      <div className="border-l border-slate-800 pl-3 text-cyan-400 font-semibold">
        {telemetry.timestamp}
      </div>
    </div>
  </header>
);

// LiDAR Box displaying static photo
const LidarMapBox = ({ rover }) => {
  return (
    <div className="relative flex flex-col h-full bg-slate-950 border border-slate-800 overflow-hidden select-none">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-2.5 py-1 font-mono text-[11px] shrink-0">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <Layers className="h-3.5 w-3.5" />
          <span>3D LiDAR MAPPING PHOTO</span>
        </div>
        <span className="text-[9px] text-emerald-400 border border-emerald-900/60 bg-emerald-950/40 px-1.5 py-0.2">
          {rover.mappingStatus}
        </span>
      </div>

      <div className="relative flex-1 min-h-0 bg-[#030712] overflow-hidden">
        <img
          src={STATIC_PHOTOS.lidarMap}
          alt="3D LiDAR Map"
          className="w-full h-full object-cover opacity-80"
        />

        <div className="absolute top-2 left-2 bg-slate-950/90 border border-cyan-900/40 p-2 font-mono text-[10px] text-slate-300 space-y-0.5 backdrop-blur-sm pointer-events-none">
          <div className="text-cyan-400 font-bold border-b border-slate-800 pb-0.5 mb-1">POSITION MATRIX</div>
          <div className="flex justify-between gap-3"><span>X:</span> <span className="text-white">{rover.x} m</span></div>
          <div className="flex justify-between gap-3"><span>Y:</span> <span className="text-white">{rover.y} m</span></div>
          <div className="flex justify-between gap-3"><span>DEPTH:</span> <span className="text-emerald-400">{rover.depth} m</span></div>
          <div className="flex justify-between gap-3"><span>HEADING:</span> <span className="text-cyan-400">{rover.heading}°</span></div>
        </div>
      </div>
    </div>
  );
};

// Sensor Panel (Only AQI, O2, CO2, TEMP, DUST, HUMID, CH4, H2S)
const SensorPanel = ({ sensors, timestamp }) => (
  <div className="flex flex-col h-full bg-slate-950 border border-slate-800 overflow-hidden">
    <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-2.5 py-1 font-mono text-[11px] shrink-0">
      <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
        <Activity className="h-3.5 w-3.5" />
        <span>LIVE SENSOR TELEMETRY</span>
      </div>
      <span className="text-[9px] text-slate-500">{timestamp}</span>
    </div>

    <div className="grid grid-cols-4 gap-2 p-2 font-mono flex-1 overflow-hidden">
      {sensors.map((s) => (
        <div key={s.id} className="flex flex-col justify-between p-2 bg-slate-900/50 border border-slate-800/80 min-h-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold truncate">{s.name}</span>
            <span className={`text-[8px] font-bold px-1 ${s.status === 'SAFE' ? 'text-emerald-400 bg-emerald-950/60' : 'text-amber-400 bg-amber-950/60 animate-pulse'}`}>
              {s.status}
            </span>
          </div>
          <div className="my-1 text-base font-bold text-slate-100 truncate">
            {s.value} <span className="text-[10px] font-normal text-slate-400">{s.unit}</span>
          </div>
          <div className="text-[8px] text-slate-500 border-t border-slate-800/60 pt-0.5 truncate">
            {s.safeRange}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MeshNetwork = ({ mesh }) => (
  <div className="flex flex-col h-full bg-slate-950 border border-slate-800 font-mono text-[11px] overflow-hidden">
    <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-2.5 py-1 shrink-0">
      <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
        <Network className="h-3.5 w-3.5" />
        <span>MESH NETWORK</span>
      </div>
      <span className="text-[9px] text-emerald-400 bg-emerald-950/30 px-1.5">{mesh.status}</span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 flex-1 items-center">
      <div className="flex justify-between items-center p-1.5 bg-slate-900/40 border border-slate-800">
        <span className="text-slate-400 text-[10px]">LAST NODE:</span>
        <span className="text-cyan-400 font-bold text-[10px]">{mesh.lastNode}</span>
      </div>

      <div className="flex justify-between items-center p-1.5 bg-slate-900/40 border border-slate-800">
        <span className="text-slate-400 text-[10px]">RSSI / HOPS:</span>
        <span className="text-emerald-400 font-bold text-[10px]">{mesh.rssi} dBm ({mesh.hops} Hops)</span>
      </div>

      <div className="flex items-center justify-center gap-1 bg-slate-900/30 p-1 border border-slate-800/60 text-[9px]">
        <span className="px-1 bg-slate-800 text-slate-300">BASE</span>
        <span className="h-0.5 w-2 bg-emerald-500"></span>
        <span className="px-1 bg-cyan-950 text-cyan-400 font-bold">NODE-07</span>
        <span className="h-0.5 w-2 bg-cyan-400"></span>
        <span className="px-1 bg-emerald-950 text-emerald-400 font-bold">ROVER</span>
      </div>
    </div>
  </div>
);

// Night Vision Box displaying static photo
const NightVisionCameraBox = ({ camera, timestamp }) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 select-none font-mono overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] shrink-0">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <Eye className="h-3.5 w-3.5" />
          <span>NIGHT VISION [{camera.id}]</span>
        </div>
        <span className="text-[9px] text-emerald-400">● {camera.status}</span>
      </div>

      <div className="relative flex-1 min-h-0 bg-emerald-950/20 overflow-hidden">
        <img
          src={STATIC_PHOTOS.nightVision}
          alt="Night Vision Photo"
          className="w-full h-full object-cover opacity-90 hue-rotate-90 saturate-200"
        />

        <div className="absolute top-1.5 left-1.5 text-[9px] text-emerald-400 bg-slate-950/80 p-1 border border-emerald-900/40">
          {camera.res} | {camera.fps} FPS
        </div>
        <div className="absolute bottom-1.5 right-1.5 text-[9px] text-emerald-400 bg-slate-950/80 px-1">{timestamp}</div>
      </div>
    </div>
  );
};

// Thermal Camera Box displaying static photo
const ThermalCameraBox = ({ camera }) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 select-none font-mono overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] shrink-0">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <Thermometer className="h-3.5 w-3.5" />
          <span>THERMAL CAMERA [{camera.id}]</span>
        </div>
        <span className="text-[9px] text-rose-400">● {camera.status}</span>
      </div>

      <div className="relative flex-1 min-h-0 bg-indigo-950/30 overflow-hidden">
        <img
          src={STATIC_PHOTOS.thermal}
          alt="Thermal Camera Photo"
          className="w-full h-full object-cover opacity-85 saturate-200"
        />

        <div className="absolute top-1.5 left-1.5 text-[9px] text-cyan-300 bg-slate-950/80 p-1 border border-cyan-900/40">
          <div>MAX: <span className="text-amber-400">{camera.maxTemp}°C</span></div>
          <div>AVG: <span className="text-white">{camera.avgTemp}°C</span></div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN DASHBOARD EXPORT
// ==========================================
export default function Dashboard() {
  const telemetry = useRoverTelemetry();

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      <Header telemetry={telemetry} />

      {/* Grid Layout: Left (60%) : Right (40%) */}
      <main className="flex-1 p-2 grid grid-cols-1 lg:grid-cols-10 gap-2 min-h-0">
        
        {/* LEFT PANEL (60% Width = 6 / 10 cols) */}
        <section className="lg:col-span-6 grid grid-rows-12 gap-2 h-full min-h-0">
          <div className="row-span-6 min-h-0">
            <LidarMapBox rover={telemetry.rover} />
          </div>

          <div className="row-span-4 min-h-0">
            <SensorPanel sensors={telemetry.sensors} timestamp={telemetry.timestamp} />
          </div>

          <div className="row-span-2 min-h-0">
            <MeshNetwork mesh={telemetry.mesh} />
          </div>
        </section>

        {/* RIGHT PANEL (40% Width = 4 / 10 cols) */}
        <section className="lg:col-span-4 grid grid-rows-2 gap-2 h-full min-h-0">
          <div className="row-span-1 min-h-0">
            <NightVisionCameraBox camera={telemetry.cameras.nv} timestamp={telemetry.timestamp} />
          </div>
          <div className="row-span-1 min-h-0">
            <ThermalCameraBox camera={telemetry.cameras.thermal} />
          </div>
        </section>

      </main>
    </div>
  );
}