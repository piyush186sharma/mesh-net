import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Eye,
  Layers,
  Network,
  Thermometer,
  Wifi,
  Crosshair,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Box,
  ExternalLink,
  TrendingUp,
  MapPin,
  Cpu,
  Filter,
  UserCheck,
  Scan,
  ChevronDown
} from 'lucide-react';

const STATIC_PHOTOS = {
  lidarMap: 'https://res.cloudinary.com/dqeenwawp/image/upload/v1789061146/rover-lidar_hprvh5.jpg',
  nightVision: 'https://res.cloudinary.com/dqeenwawp/image/upload/v1789061145/rover-night-vision_krzs18.jpg',
  thermal: 'https://res.cloudinary.com/dqeenwawp/image/upload/v1789061147/rover-infrared_bisclt.jpg'
};

// ==========================================
// STATIC TELEMETRY & ANALYTICS DATA
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
    { id: 'air_quality', name: 'AQI', category: 'air', node: 'NODE-07', value: 92, unit: 'AQI', status: 'SAFE', safeRange: '0-100 AQI' },
    { id: 'o2', name: 'O₂', category: 'gas', node: 'NODE-07', value: 20.7, unit: '%', status: 'SAFE', safeRange: '19.5-23.5%' },
    { id: 'co2', name: 'CO₂', category: 'gas', node: 'NODE-03', value: 0.08, unit: '%', status: 'SAFE', safeRange: '0.00-0.10%' },
    { id: 'temp', name: 'TEMP', category: 'thermal', node: 'NODE-07', value: 31.4, unit: '°C', status: 'WARNING', safeRange: '15-30 °C' },
    { id: 'dust', name: 'DUST', category: 'air', node: 'BASE', value: 0.05, unit: 'mg/m³', status: 'SAFE', safeRange: '0-0.1 mg/m³' },
    { id: 'humidity', name: 'HUMID', category: 'air', node: 'BASE', value: 68.2, unit: '%', status: 'SAFE', safeRange: '30-80%' },
    { id: 'ch4', name: 'CH₄', category: 'gas', node: 'NODE-07', value: 0.52, unit: '%', status: 'WARNING', safeRange: '0.00-0.50%' },
    { id: 'h2s', name: 'H₂S', category: 'gas', node: 'NODE-03', value: 0.02, unit: 'ppm', status: 'SAFE', safeRange: '0-1 ppm' },
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
    nv: { fps: 30, res: '1920×1080', status: 'ACTIVE SCAN', id: 'CAM-01', cracksDetected: 3 },
    thermal: { fps: 30, res: '640×480', status: 'ACTIVE SCAN', id: 'CAM-02', maxTemp: 43.7, avgTemp: 29.4, minTemp: 21.2, personsDetected: 2 }
  }
};

const ALL_NODES = [
  { id: 'ALL', name: 'All Mesh Nodes' },
  { id: 'BASE', name: 'Base Station' },
  { id: 'NODE-01', name: 'NODE-01' },
  { id: 'NODE-02', name: 'NODE-02' },
  { id: 'NODE-03', name: 'NODE-03' },
  { id: 'NODE-04', name: 'NODE-04' },
  { id: 'NODE-05', name: 'NODE-05' },
  { id: 'NODE-06', name: 'NODE-06' },
  { id: 'NODE-07', name: 'NODE-07' },
  { id: 'ROVER', name: 'Rover Status' }
];

const NODE_HISTORICAL_DATA = {
  ALL: {
    tempAQIPath: "M 10,80 L 80,70 L 150,50 L 220,30 L 290,20",
    tempPath: "M 10,75 L 80,68 L 150,48 L 220,30 L 290,24",
    cracksPath: "M 10,85 L 80,70 L 150,60 L 220,40 L 290,30",
    personsPath: "M 10,90 L 80,85 L 150,70 L 220,60 L 290,45",
    cracks: 3,
    persons: 2
  },
  BASE: {
    tempAQIPath: "M 10,90 L 80,88 L 150,85 L 220,80 L 290,78",
    tempPath: "M 10,85 L 80,83 L 150,80 L 220,78 L 290,75",
    cracksPath: "M 10,95 L 80,95 L 150,95 L 220,95 L 290,95",
    personsPath: "M 10,95 L 80,95 L 150,90 L 220,90 L 290,90",
    cracks: 0,
    persons: 0
  },
  'NODE-03': {
    tempAQIPath: "M 10,85 L 80,75 L 150,65 L 220,55 L 290,50",
    tempPath: "M 10,80 L 80,72 L 150,60 L 220,50 L 290,45",
    cracksPath: "M 10,90 L 80,80 L 150,75 L 220,70 L 290,65",
    personsPath: "M 10,95 L 80,90 L 150,80 L 220,75 L 290,70",
    cracks: 1,
    persons: 1
  },
  'NODE-07': {
    tempAQIPath: "M 10,70 L 80,55 L 150,40 L 220,25 L 290,15",
    tempPath: "M 10,65 L 80,50 L 150,35 L 220,20 L 290,12",
    cracksPath: "M 10,80 L 80,60 L 150,45 L 220,30 L 290,20",
    personsPath: "M 10,85 L 80,75 L 150,55 L 220,40 L 290,30",
    cracks: 2,
    persons: 1
  },
  ROVER: {
    tempAQIPath: "M 10,75 L 80,65 L 150,55 L 220,45 L 290,35",
    tempPath: "M 10,70 L 80,60 L 150,50 L 220,40 L 290,30",
    cracksPath: "M 10,85 L 80,70 L 150,55 L 220,35 L 290,25",
    personsPath: "M 10,90 L 80,80 L 150,65 L 220,50 L 290,35",
    cracks: 3,
    persons: 2
  }
};

const clayBase = {
  container: 'bg-[#eef2f9] rounded-3xl shadow-[12px_12px_24px_#c2cbd9,-12px_-12px_24px_#ffffff]',
  insetFrame: 'rounded-2xl shadow-[inset_6px_6px_12px_#b8c4d6,inset_-6px_-6px_12px_#ffffff]',
  pillBase: 'rounded-full transition-all duration-300 font-bold',
};

const themeStyles = {
  indigo: {
    bg: 'bg-indigo-600 text-white',
    shadow: 'shadow-[6px_6px_14px_rgba(79,70,229,0.4),inset_2px_2px_4px_rgba(255,255,255,0.4)]',
    badge: 'bg-indigo-100 text-indigo-700 shadow-[inset_2px_2px_4px_#c7d2fe,inset_-2px_-2px_4px_#ffffff]',
  },
  cyan: {
    bg: 'bg-cyan-500 text-white',
    shadow: 'shadow-[6px_6px_14px_rgba(6,182,212,0.4),inset_2px_2px_4px_rgba(255,255,255,0.5)]',
    badge: 'bg-cyan-100 text-cyan-800 shadow-[inset_2px_2px_4px_#a5f3fc,inset_-2px_-2px_4px_#ffffff]',
  },
  emerald: {
    bg: 'bg-emerald-500 text-white',
    shadow: 'shadow-[6px_6px_14px_rgba(16,185,129,0.4),inset_2px_2px_4px_rgba(255,255,255,0.5)]',
    badge: 'bg-emerald-100 text-emerald-800 shadow-[inset_2px_2px_4px_#a7f3d0,inset_-2px_-2px_4px_#ffffff]',
  },
  amber: {
    bg: 'bg-amber-500 text-white',
    shadow: 'shadow-[6px_6px_14px_rgba(245,158,11,0.4),inset_2px_2px_4px_rgba(255,255,255,0.5)]',
    badge: 'bg-amber-100 text-amber-800 shadow-[inset_2px_2px_4px_#fde68a,inset_-2px_-2px_4px_#ffffff]',
  },
  rose: {
    bg: 'bg-rose-500 text-white',
    shadow: 'shadow-[6px_6px_14px_rgba(244,63,94,0.4),inset_2px_2px_4px_rgba(255,255,255,0.5)]',
    badge: 'bg-rose-100 text-rose-800 shadow-[inset_2px_2px_4px_#fecdd3,inset_-2px_-2px_4px_#ffffff]',
  },
  purple: {
    bg: 'bg-purple-600 text-white',
    shadow: 'shadow-[6px_6px_14px_rgba(147,51,234,0.4),inset_2px_2px_4px_rgba(255,255,255,0.4)]',
    badge: 'bg-purple-100 text-purple-800 shadow-[inset_2px_2px_4px_#e9d5ff,inset_-2px_-2px_4px_#ffffff]',
  },
  teal: {
    bg: 'bg-teal-500 text-white',
    shadow: 'shadow-[6px_6px_14px_rgba(20,184,166,0.4),inset_2px_2px_4px_rgba(255,255,255,0.5)]',
  },
  blue: {
    bg: 'bg-blue-600 text-white',
    shadow: 'shadow-[6px_6px_14px_rgba(37,99,235,0.4),inset_2px_2px_4px_rgba(255,255,255,0.4)]',
  }
};

const MeshnetLogo = () => (
  <div className="flex items-center gap-2.5">
    <div className="relative flex items-center justify-center w-9 h-9 bg-slate-900 rounded-xl shadow-[4px_4px_10px_#c2cbd9,-4px_-4px_10px_#ffffff] p-1.5 border border-indigo-500/30">
      <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-400">
        <path d="M 15 80 L 15 25 L 50 60 L 85 25 L 85 80" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 15 80 L 50 60 L 85 80" fill="none" stroke="#6366f1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="15" cy="25" r="9" className="fill-indigo-500 stroke-white stroke-2" />
        <circle cx="85" cy="25" r="9" className="fill-indigo-500 stroke-white stroke-2" />
        <circle cx="50" cy="60" r="9" className="fill-cyan-400 stroke-white stroke-2" />
      </svg>
    </div>
    <div className="flex flex-col leading-none">
      <span className="font-black text-lg tracking-wider bg-gradient-to-r from-indigo-700 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
        MESHNET
      </span>
      <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">System Node</span>
    </div>
  </div>
);


const Header = ({ telemetry, onNavigate3D, showLidar, onToggleLidar }) => (
  <header className={`h-16 px-6 mx-3 mt-3 flex items-center justify-between shrink-0 select-none ${clayBase.container}`}>
    <div className="flex items-center gap-4">
      <MeshnetLogo />
      <span className={`px-3 py-1 text-xs font-black ${themeStyles.indigo.badge} rounded-full`}>
        {telemetry.rover.id}
      </span>
    </div>

    <div className="hidden md:flex items-center gap-3 text-xs font-black">
      <div className={`flex items-center gap-2 px-4 py-2 ${themeStyles.emerald.bg} ${themeStyles.emerald.shadow} ${clayBase.pillBase}`}>
        <span className="relative flex h-2.5 w-2.5">
          <span className="inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <span>ROVER ONLINE</span>
      </div>

      <button
        onClick={onToggleLidar}
        className={`flex items-center gap-2 px-4 py-2 ${
          showLidar
            ? `${themeStyles.purple.bg} ${themeStyles.purple.shadow}`
            : 'bg-slate-700 text-white shadow-[4px_4px_10px_#c2cbd9,-4px_-4px_10px_#ffffff]'
        } ${clayBase.pillBase} hover:opacity-90 active:scale-95 cursor-pointer`}
      >
        <Crosshair className="h-4 w-4" />
        <span>{showLidar ? 'SHOW ANALYTICS' : 'SHOW LIDAR MAP'}</span>
      </button>

      <Link
        to="/rover"
        onClick={() => onNavigate3D?.()}
        className={`flex items-center gap-2 px-4 py-2 ${themeStyles.indigo.bg} ${themeStyles.indigo.shadow} ${clayBase.pillBase} hover:opacity-90 active:scale-95 text-white`}
      >
        <Box className="h-4 w-4" />
        <span>ROVER 3D VIEW</span>
        <ExternalLink className="h-3 w-3 opacity-70" />
      </Link>
    </div>
  </header>
);

const LidarMapBox = ({ rover }) => (
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
      <img src={STATIC_PHOTOS.lidarMap} alt="3D LiDAR Map" className="w-full h-full object-cover" />
      <div className={`absolute top-4 left-4 bg-[#eef2f9]/90 backdrop-blur-md p-3 font-mono text-xs text-slate-800 space-y-1 rounded-2xl border border-white/60 shadow-lg`}>
        <div className="text-indigo-600 font-black text-xs border-b border-slate-300 pb-1 flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 fill-indigo-600" /> POSITION MATRIX
        </div>
        <div className="flex justify-between gap-4 font-bold"><span>X:</span> <span className="text-blue-600 font-black">{rover.x} m</span></div>
        <div className="flex justify-between gap-4 font-bold"><span>Y:</span> <span className="text-blue-600 font-black">{rover.y} m</span></div>
        <div className="flex justify-between gap-4 font-bold"><span>DEPTH:</span> <span className="text-emerald-600 font-black">{rover.depth} m</span></div>
      </div>
    </div>
  </div>
);


const SensorAnalyticsBox = ({ selectedNode, setSelectedNode }) => {
  const currentGraphData = NODE_HISTORICAL_DATA[selectedNode] || NODE_HISTORICAL_DATA.ALL;

  return (
    <div className={`relative flex flex-col h-full overflow-hidden select-none p-3.5 ${clayBase.container}`}>
      <div className="flex items-center justify-between px-2 py-1 shrink-0 mb-2 gap-2">
        <div className="flex items-center gap-2 text-slate-800 font-black text-xs">
          <div className={`p-2 ${themeStyles.purple.bg} ${themeStyles.purple.shadow} ${clayBase.pillBase}`}>
            <TrendingUp className="h-4 w-4" />
          </div>
          <span>REAL-TIME SENSOR & AI GRAPH ANALYTICS</span>
        </div>

        {/* NODE SELECTOR DROPDOWN */}
        <div className="relative flex items-center">
          <MapPin className="h-3.5 w-3.5 text-indigo-600 absolute left-3 z-10 pointer-events-none" />
          <select
            value={selectedNode}
            onChange={(e) => setSelectedNode(e.target.value)}
            className="pl-8 pr-8 py-1.5 bg-[#f8fafc] text-slate-800 text-xs font-black rounded-xl border border-indigo-200 shadow-[inset_2px_2px_4px_#cbd5e1] focus:outline-none appearance-none cursor-pointer"
          >
            {ALL_NODES.map((node) => (
              <option key={node.id} value={node.id}>
                {node.name}
              </option>
            ))}
          </select>
          <ChevronDown className="h-3.5 w-3.5 text-slate-500 absolute right-2.5 pointer-events-none" />
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto pr-1">

        <div className="flex flex-col p-3 bg-white/70 rounded-2xl shadow-[inset_3px_3px_6px_#cbd5e1]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
              <Thermometer className="h-3.5 w-3.5 text-amber-500" /> Temp & AQI Trend
            </span>
            <div className="flex items-center gap-3 text-[9px] font-mono font-bold">
              <span className="text-cyan-600">● AQI</span>
              <span className="text-amber-500">● TEMP (°C)</span>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[90px] relative flex items-end">
            <svg viewBox="0 0 300 100" className="w-full h-full">
              <path d={currentGraphData.tempAQIPath} fill="none" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
              <path d={currentGraphData.tempPath} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col p-3 bg-white/70 rounded-2xl shadow-[inset_3px_3px_6px_#cbd5e1]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
              <Scan className="h-3.5 w-3.5 text-rose-500" /> AI Detection Graph
            </span>
            <div className="flex items-center gap-3 text-[9px] font-mono font-bold">
              <span className="text-rose-500">● Cracks ({currentGraphData.cracks})</span>
              <span className="text-indigo-600">● Persons ({currentGraphData.persons})</span>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[90px] relative flex items-end">
            <svg viewBox="0 0 300 100" className="w-full h-full">
              <path d={currentGraphData.cracksPath} fill="none" stroke="#f43f5e" strokeWidth="3" strokeDasharray="4" strokeLinecap="round" />
              <path d={currentGraphData.personsPath} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const SensorPanel = ({ sensors, categoryFilter, setCategoryFilter, nodeFilter, setNodeFilter }) => {
  const filteredSensors = useMemo(() => {
    return sensors.filter((sensor) => {
      const matchCategory =
        categoryFilter === 'ALL' ? true :
        categoryFilter === 'WARNING' ? sensor.status === 'WARNING' :
        sensor.category === categoryFilter;

      const matchNode = nodeFilter === 'ALL' || sensor.node === nodeFilter;
      return matchCategory && matchNode;
    });
  }, [sensors, categoryFilter, nodeFilter]);

  return (
    <div className={`flex flex-col h-full overflow-hidden p-3.5 ${clayBase.container}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 shrink-0 mb-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 text-slate-800 font-black text-xs">
          <div className={`p-1.5 ${themeStyles.cyan.bg} ${themeStyles.cyan.shadow} ${clayBase.pillBase}`}>
            <Activity className="h-3.5 w-3.5" />
          </div>
          <span>LIVE TELEMETRY</span>
        </div>

        {/* CATEGORY & WARNING SLICER */}
        <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-2xl shadow-[inset_2px_2px_4px_#cbd5e1]">
          <Filter className="h-3 w-3 text-slate-500 ml-1" />
          {[
            { id: 'ALL', label: 'All' },
            { id: 'WARNING', label: '⚠️ Warnings' },
            { id: 'air', label: 'Air Quality' },
            { id: 'gas', label: 'Gases' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1 text-[10px] font-black rounded-xl transition-all cursor-pointer ${
                categoryFilter === cat.id
                  ? cat.id === 'WARNING'
                    ? `${themeStyles.rose.bg} ${themeStyles.rose.shadow}`
                    : `${themeStyles.indigo.bg} ${themeStyles.indigo.shadow}`
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* NODE DROPDOWN SLICER */}
        <div className="relative flex items-center">
          <select
            value={nodeFilter}
            onChange={(e) => setNodeFilter(e.target.value)}
            className="pl-3 pr-7 py-1 bg-slate-200/80 text-slate-800 text-[10px] font-black rounded-xl shadow-[inset_2px_2px_4px_#cbd5e1] focus:outline-none appearance-none cursor-pointer border border-slate-300"
          >
            {ALL_NODES.map((n) => (
              <option key={n.id} value={n.id}>
                NODE: {n.id}
              </option>
            ))}
          </select>
          <ChevronDown className="h-3 w-3 text-slate-500 absolute right-2 pointer-events-none" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 select-none">
        {filteredSensors.length === 0 ? (
          <div className="flex items-center justify-center h-full text-xs font-bold text-slate-400">
            No sensor data matching selected slicer filters.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-0.5">
            {filteredSensors.map((s) => (
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

                <div className="flex items-center justify-between text-[8px] text-slate-500 font-mono font-bold px-1.5 py-0.5 rounded-lg bg-slate-100">
                  <span>{s.safeRange}</span>
                  <span className="text-indigo-600 font-black">{s.node}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

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
      <div className={`flex flex-1 min-w-[140px] justify-between items-center px-3 py-2 bg-indigo-50/80 rounded-2xl border border-white shadow-sm`}>
        <span className="text-slate-500 text-xs font-bold">LAST NODE:</span>
        <span className="text-indigo-600 font-black text-xs bg-indigo-100 px-2.5 py-0.5 rounded-full">{mesh.lastNode}</span>
      </div>

      <div className={`flex flex-1 min-w-[170px] justify-between items-center px-3 py-2 bg-emerald-50/80 rounded-2xl border border-white shadow-sm`}>
        <span className="text-slate-500 text-xs font-bold">RSSI / HOPS:</span>
        <span className="text-emerald-600 font-black text-xs bg-emerald-100 px-2.5 py-0.5 rounded-full">{mesh.rssi} dBm ({mesh.hops} Hops)</span>
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

      <span className={`text-xs font-black px-3 py-1 flex items-center gap-1.5 ${themeStyles.rose.bg} ${themeStyles.rose.shadow} ${clayBase.pillBase}`}>
        <Scan className="h-3.5 w-3.5" />
        {camera.cracksDetected} CRACKS DETECTED
      </span>
    </div>

    <div className={`relative flex-1 min-h-0 overflow-hidden ${clayBase.insetFrame}`}>
      <img src={STATIC_PHOTOS.nightVision} alt="Night Vision Photo" className="w-full h-full object-cover" />
      <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-rose-500/50 flex items-center gap-2 text-rose-400 font-mono text-xs font-black">
        <AlertTriangle className="h-4 w-4 text-rose-500 animate-pulse" />
        STRUCTURAL CRACKS: {camera.cracksDetected} LOCATIONS
      </div>
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

      <span className={`text-xs font-black px-3 py-1 flex items-center gap-1.5 ${themeStyles.cyan.bg} ${themeStyles.cyan.shadow} ${clayBase.pillBase}`}>
        <UserCheck className="h-3.5 w-3.5" />
        {camera.personsDetected} PERSONS DETECTED
      </span>
    </div>

    <div className={`relative flex-1 min-h-0 overflow-hidden ${clayBase.insetFrame}`}>
      <img src={STATIC_PHOTOS.thermal} alt="Thermal Camera Photo" className="w-full h-full object-cover" />
      <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/50 flex items-center gap-2 text-cyan-400 font-mono text-xs font-black">
        <UserCheck className="h-4 w-4 text-cyan-400" />
        HUMAN HEAT SIGNATURES: {camera.personsDetected}
      </div>
      <div className={`absolute top-3 left-3 text-xs font-mono bg-[#eef2f9]/90 backdrop-blur-md p-2 rounded-2xl shadow-md border border-white/60 space-y-0.5`}>
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
  const [showLidar, setShowLidar] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [nodeFilter, setNodeFilter] = useState('ALL');

  return (
    <div className="h-screen w-screen bg-[#e2e8f0] text-slate-800 flex flex-col font-sans overflow-hidden">
      <Header
        telemetry={telemetry}
        onNavigate3D={onNavigate3D}
        showLidar={showLidar}
        onToggleLidar={() => setShowLidar((prev) => !prev)}
      />

      <main className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-10 gap-3 min-h-0 overflow-hidden">
        {/* LEFT PANEL */}
        <section className="lg:col-span-6 grid grid-rows-12 gap-3 h-full min-h-0">
          <div className="row-span-5 min-h-0">
            {showLidar ? (
              <LidarMapBox rover={telemetry.rover} />
            ) : (
              <SensorAnalyticsBox
                selectedNode={nodeFilter}
                setSelectedNode={setNodeFilter}
              />
            )}
          </div>

          <div className="row-span-4 min-h-0">
            <SensorPanel
              sensors={telemetry.sensors}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              nodeFilter={nodeFilter}
              setNodeFilter={setNodeFilter}
            />
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