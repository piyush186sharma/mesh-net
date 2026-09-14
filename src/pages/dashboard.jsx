import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  ChevronDown,
  Video
} from 'lucide-react';

const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Orbitron:wght@600;800;900&family=Share+Tech+Mono&display=swap');
    
    .font-tech-header { font-family: 'Orbitron', sans-serif; }
    .font-tech-body { font-family: 'Chakra Petch', sans-serif; }
    .font-tech-mono { font-family: 'Share Tech Mono', monospace; }

    @keyframes floatSlow {
      0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
      50% { transform: translateY(-30px) rotate(6deg) scale(1.05); }
    }
    @keyframes floatMedium {
      0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
      50% { transform: translateY(-45px) rotate(-8deg) scale(0.95); }
    }
    @keyframes floatFast {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(12deg); }
    }

    .animate-float-slow { animation: floatSlow 14s ease-in-out infinite; }
    .animate-float-medium { animation: floatMedium 10s ease-in-out infinite; }
    .animate-float-fast { animation: floatFast 7s ease-in-out infinite; }
  `}</style>
);

const FloatingGlassBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute -top-12 left-10 w-72 h-72 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] animate-float-slow" />
    <div className="absolute top-20 right-16 w-96 h-64 bg-slate-950/30 backdrop-blur-2xl border border-slate-700/30 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-float-medium" />
    <div className="absolute bottom-16 left-24 w-80 h-40 bg-black/35 backdrop-blur-lg border border-white/10 rounded-full shadow-2xl animate-float-fast" />
    <div className="absolute -bottom-10 right-1/4 w-80 h-80 bg-slate-900/40 backdrop-blur-2xl border border-indigo-500/20 rounded-3xl animate-float-slow" />
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl" />
  </div>
);

const STATIC_PHOTOS = {
  lidarMap: 'https://res.cloudinary.com/dqeenwawp/image/upload/v1789061146/rover-lidar_hprvh5.jpg',
  nightVision: 'https://res.cloudinary.com/dqeenwawp/image/upload/v1789061145/rover-night-vision_krzs18.jpg',
  thermal: 'https://res.cloudinary.com/dqeenwawp/image/upload/v1789061147/rover-infrared_bisclt.jpg'
};

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
    tempAQIFill: "M 10,80 L 80,70 L 150,50 L 220,30 L 290,20 L 290,100 L 10,100 Z",
    cracksPath: "M 10,85 L 80,70 L 150,60 L 220,40 L 290,30",
    personsPath: "M 10,90 L 80,85 L 150,70 L 220,60 L 290,45",
    personsFill: "M 10,90 L 80,85 L 150,70 L 220,60 L 290,45 L 290,100 L 10,100 Z",
    cracks: 3,
    persons: 2
  },
  BASE: {
    tempAQIPath: "M 10,90 L 80,88 L 150,85 L 220,80 L 290,78",
    tempPath: "M 10,85 L 80,83 L 150,80 L 220,78 L 290,75",
    tempAQIFill: "M 10,90 L 80,88 L 150,85 L 220,80 L 290,78 L 290,100 L 10,100 Z",
    cracksPath: "M 10,95 L 80,95 L 150,95 L 220,95 L 290,95",
    personsPath: "M 10,95 L 80,95 L 150,90 L 220,90 L 290,90",
    personsFill: "M 10,95 L 80,95 L 150,90 L 220,90 L 290,90 L 290,100 L 10,100 Z",
    cracks: 0,
    persons: 0
  },
  'NODE-03': {
    tempAQIPath: "M 10,85 L 80,75 L 150,65 L 220,55 L 290,50",
    tempPath: "M 10,80 L 80,72 L 150,60 L 220,50 L 290,45",
    tempAQIFill: "M 10,85 L 80,75 L 150,65 L 220,55 L 290,50 L 290,100 L 10,100 Z",
    cracksPath: "M 10,90 L 80,80 L 150,75 L 220,70 L 290,65",
    personsPath: "M 10,95 L 80,90 L 150,80 L 220,75 L 290,70",
    personsFill: "M 10,95 L 80,90 L 150,80 L 220,75 L 290,70 L 290,100 L 10,100 Z",
    cracks: 1,
    persons: 1
  },
  'NODE-07': {
    tempAQIPath: "M 10,70 L 80,55 L 150,40 L 220,25 L 290,15",
    tempPath: "M 10,65 L 80,50 L 150,35 L 220,20 L 290,12",
    tempAQIFill: "M 10,70 L 80,55 L 150,40 L 220,25 L 290,15 L 290,100 L 10,100 Z",
    cracksPath: "M 10,80 L 80,60 L 150,45 L 220,30 L 290,20",
    personsPath: "M 10,85 L 80,75 L 150,55 L 220,40 L 290,30",
    personsFill: "M 10,85 L 80,75 L 150,55 L 220,40 L 290,30 L 290,100 L 10,100 Z",
    cracks: 2,
    persons: 1
  },
  ROVER: {
    tempAQIPath: "M 10,75 L 80,65 L 150,55 L 220,45 L 290,35",
    tempPath: "M 10,70 L 80,60 L 150,50 L 220,40 L 290,30",
    tempAQIFill: "M 10,75 L 80,65 L 150,55 L 220,45 L 290,35 L 290,100 L 10,100 Z",
    cracksPath: "M 10,85 L 80,70 L 150,55 L 220,35 L 290,25",
    personsPath: "M 10,90 L 80,80 L 150,65 L 220,50 L 290,35",
    personsFill: "M 10,90 L 80,80 L 150,65 L 220,50 L 290,35 L 290,100 L 10,100 Z",
    cracks: 3,
    persons: 2
  }
};

const clayBase = {
  container: 'bg-[#eef2f9]/90 backdrop-blur-md rounded-3xl shadow-[12px_12px_24px_rgba(0,0,0,0.15),-12px_-12px_24px_rgba(255,255,255,0.7)] border border-white/40',
  insetFrame: 'rounded-2xl shadow-[inset_6px_6px_12px_#b8c4d6,inset_-6px_-6px_12px_#ffffff]',
  pillBase: 'rounded-full transition-all duration-300 font-bold tracking-wider',
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
      <span className="font-tech-header text-lg font-black tracking-widest bg-gradient-to-r from-indigo-700 via-indigo-600 to-cyan-600 bg-clip-text text-transparent uppercase">
        MESHNET
      </span>
      <span className="font-tech-mono text-[9px] font-bold text-slate-500 tracking-widest uppercase">System Node</span>
    </div>
  </div>
);

const Header = ({ telemetry, onNavigate3D, showLidar, onToggleLidar }) => (
  <header className={`h-16 px-6 mx-3 mt-3 flex items-center justify-between shrink-0 select-none ${clayBase.container}`}>
    <div className="flex items-center gap-4">
      <MeshnetLogo />
      <span className={`px-3 py-1 text-xs font-tech-mono font-black ${themeStyles.indigo.badge} rounded-full tracking-widest uppercase`}>
        {telemetry.rover.id}
      </span>
    </div>

    <div className="hidden md:flex items-center gap-3 text-xs">
      <div className={`flex items-center gap-2 px-4 py-2 ${themeStyles.emerald.bg} ${themeStyles.emerald.shadow} ${clayBase.pillBase}`}>
        <span className="relative flex h-2.5 w-2.5">
          <span className="inline-flex rounded-full h-2.5 w-2.5 bg-white animate-pulse"></span>
        </span>
        <span className="font-tech-header text-[11px] font-bold tracking-wider">ROVER ONLINE</span>
      </div>

      <button
        onClick={onToggleLidar}
        className={`flex items-center gap-2 px-4 py-2 ${
          showLidar
            ? `${themeStyles.purple.bg} ${themeStyles.purple.shadow}`
            : 'bg-slate-700 text-white shadow-[4px_4px_10px_#c2cbd9,-4px_-4px_10px_#ffffff]'
        } ${clayBase.pillBase} hover:opacity-90 active:scale-95 cursor-pointer font-tech-header text-[11px] font-bold tracking-wider`}
      >
        <Crosshair className="h-4 w-4" />
        <span>{showLidar ? 'SHOW ANALYTICS' : 'SHOW LIDAR MAP'}</span>
      </button>

      <Link
        to="/rover"
        onClick={() => onNavigate3D?.()}
        className={`flex items-center gap-2 px-4 py-2 ${themeStyles.indigo.bg} ${themeStyles.indigo.shadow} ${clayBase.pillBase} hover:opacity-90 active:scale-95 text-white font-tech-header text-[11px] font-bold tracking-wider`}
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
      <div className="flex items-center gap-2 text-slate-800 font-tech-header text-xs font-black">
        <div className={`p-2 ${themeStyles.blue.bg} ${themeStyles.blue.shadow} ${clayBase.pillBase}`}>
          <Layers className="h-4 w-4" />
        </div>
        <span className="tracking-wider">3D LiDAR MAPPING PHOTO</span>
      </div>
      <span className={`text-xs font-tech-mono font-black px-4 py-1.5 ${themeStyles.emerald.bg} ${themeStyles.emerald.shadow} ${clayBase.pillBase}`}>
        {rover.mappingStatus}
      </span>
    </div>

    <div className={`relative flex-1 min-h-0 overflow-hidden ${clayBase.insetFrame}`}>
      <img src={STATIC_PHOTOS.lidarMap} alt="3D LiDAR Map" className="w-full h-full object-cover" />
      <div className={`absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md p-3 font-tech-mono text-xs text-slate-100 space-y-1.5 rounded-2xl border border-indigo-500/40 shadow-xl`}>
        <div className="text-cyan-400 font-tech-header font-bold text-[11px] border-b border-slate-700 pb-1 flex items-center gap-1.5 tracking-wider">
          <Zap className="h-3.5 w-3.5 fill-cyan-400" /> POSITION MATRIX
        </div>
        <div className="flex justify-between gap-4"><span>X:</span> <span className="text-cyan-400 font-bold">{rover.x} m</span></div>
        <div className="flex justify-between gap-4"><span>Y:</span> <span className="text-cyan-400 font-bold">{rover.y} m</span></div>
        <div className="flex justify-between gap-4"><span>DEPTH:</span> <span className="text-emerald-400 font-bold">{rover.depth} m</span></div>
      </div>
    </div>
  </div>
);

const SensorAnalyticsBox = ({ selectedNode, setSelectedNode }) => {
  const currentGraphData = NODE_HISTORICAL_DATA[selectedNode] || NODE_HISTORICAL_DATA.ALL;

  return (
    <div className={`relative flex flex-col h-full overflow-hidden select-none p-3.5 ${clayBase.container}`}>
      <div className="flex items-center justify-between px-2 py-1 shrink-0 mb-2 gap-2">
        <div className="flex items-center gap-2 text-slate-800 font-tech-header text-xs font-black">
          <div className={`p-2 ${themeStyles.purple.bg} ${themeStyles.purple.shadow} ${clayBase.pillBase}`}>
            <TrendingUp className="h-4 w-4" />
          </div>
          <span className="tracking-wider">REAL-TIME SENSOR & AI GRAPH ANALYTICS</span>
        </div>
        <div className="relative flex items-center">
          <MapPin className="h-3.5 w-3.5 text-indigo-600 absolute left-3 z-10 pointer-events-none" />
          <select
            value={selectedNode}
            onChange={(e) => setSelectedNode(e.target.value)}
            className="pl-8 pr-8 py-1.5 bg-slate-900 text-cyan-400 text-xs font-tech-mono font-bold rounded-xl border border-indigo-500/40 shadow-[inset_2px_2px_4px_#0f172a] focus:outline-none appearance-none cursor-pointer"
          >
            {ALL_NODES.map((node) => (
              <option key={node.id} value={node.id}>
                {node.name}
              </option>
            ))}
          </select>
          <ChevronDown className="h-3.5 w-3.5 text-cyan-400 absolute right-2.5 pointer-events-none" />
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto pr-1">
        <div className="relative flex flex-col p-3 bg-slate-950/90 backdrop-blur-md rounded-2xl shadow-[inset_4px_4px_10px_#020617] border border-slate-800/80 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />     
          <div className="flex justify-between items-center mb-2 z-10">
            <span className="text-xs font-tech-header text-slate-200 flex items-center gap-1.5 tracking-wider">
              <Thermometer className="h-3.5 w-3.5 text-amber-400" /> TEMP & AQI TREND
            </span>
            <div className="flex items-center gap-3 text-[10px] font-tech-mono font-bold tracking-wider">
              <span className="text-cyan-400 flex items-center gap-1">● AQI</span>
              <span className="text-amber-400 flex items-center gap-1">● TEMP (°C)</span>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[90px] relative flex items-end">
            <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
              <defs>
                <pattern id="techGrid1" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                </pattern>
                <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <rect width="300" height="100" fill="url(#techGrid1)" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
              {currentGraphData.tempAQIFill && (
                <path d={currentGraphData.tempAQIFill} fill="url(#aqiGrad)" />
              )}
              <path d={currentGraphData.tempAQIPath} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
              <path d={currentGraphData.tempPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="290" cy="20" r="4" fill="#06b6d4" className="animate-ping opacity-75" />
              <circle cx="290" cy="20" r="3" fill="#06b6d4" />
              <circle cx="290" cy="24" r="3" fill="#f59e0b" />
            </svg>
          </div>
        </div>
        <div className="relative flex flex-col p-3 bg-slate-950/90 backdrop-blur-md rounded-2xl shadow-[inset_4px_4px_10px_#020617] border border-slate-800/80 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-center mb-2 z-10">
            <span className="text-xs font-tech-header text-slate-200 flex items-center gap-1.5 tracking-wider">
              <Scan className="h-3.5 w-3.5 text-rose-400" /> AI DETECTION GRAPH
            </span>
            <div className="flex items-center gap-3 text-[10px] font-tech-mono font-bold tracking-wider">
              <span className="text-rose-400">● CRACKS ({currentGraphData.cracks})</span>
              <span className="text-indigo-400">● PERSONS ({currentGraphData.persons})</span>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[90px] relative flex items-end">
            <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
              <defs>
                <pattern id="techGrid2" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                </pattern>
                <linearGradient id="personsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <rect width="300" height="100" fill="url(#techGrid2)" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
              {currentGraphData.personsFill && (
                <path d={currentGraphData.personsFill} fill="url(#personsGrad)" />
              )}
              <path d={currentGraphData.cracksPath} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="4 4" strokeLinecap="round" />
              <path d={currentGraphData.personsPath} fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="290" cy="30" r="4" fill="#f43f5e" className="animate-ping opacity-75" />
              <circle cx="290" cy="30" r="3" fill="#f43f5e" />
              <circle cx="290" cy="45" r="3" fill="#818cf8" />
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
        <div className="flex items-center gap-2 text-slate-800 font-tech-header text-xs font-black">
          <div className={`p-1.5 ${themeStyles.cyan.bg} ${themeStyles.cyan.shadow} ${clayBase.pillBase}`}>
            <Activity className="h-3.5 w-3.5" />
          </div>
          <span className="tracking-wider">LIVE TELEMETRY</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-200/60 backdrop-blur-sm p-1 rounded-2xl shadow-[inset_2px_2px_4px_#cbd5e1]">
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
              className={`px-2.5 py-1 text-[11px] font-tech-body font-bold rounded-xl transition-all cursor-pointer ${
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
        <div className="relative flex items-center">
          <select
            value={nodeFilter}
            onChange={(e) => setNodeFilter(e.target.value)}
            className="pl-3 pr-7 py-1 bg-slate-200/80 backdrop-blur-sm text-slate-800 text-xs font-tech-mono font-bold rounded-xl shadow-[inset_2px_2px_4px_#cbd5e1] focus:outline-none appearance-none cursor-pointer border border-slate-300"
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
          <div className="flex items-center justify-center h-full text-xs font-tech-body font-bold text-slate-400">
            No sensor data matching selected slicer filters.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-0.5">
            {filteredSensors.map((s) => {
              const isSafe = s.status === 'SAFE';
              const cardBgClass = isSafe
                ? 'bg-emerald-500 text-white shadow-[6px_6px_14px_rgba(16,185,129,0.35)] border border-emerald-400'
                : 'bg-amber-400 text-slate-950 shadow-[6px_6px_14px_rgba(245,158,11,0.4)] border border-amber-300';

              const badgeClass = isSafe
                ? 'bg-emerald-700/60 text-emerald-100'
                : 'bg-amber-950 text-amber-200';

              const metaBgClass = isSafe
                ? 'bg-emerald-600/70 text-emerald-100'
                : 'bg-amber-500/80 text-slate-900';

              return (
                <div
                  key={s.id}
                  className={`flex flex-col justify-between p-2.5 rounded-2xl transition-all duration-300 ${cardBgClass}`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-tech-header font-bold truncate tracking-wider">{s.name}</span>
                    <span className={`text-[9px] font-tech-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${badgeClass}`}>
                      {isSafe ? <ShieldCheck className="h-3 w-3 text-emerald-200" /> : <AlertTriangle className="h-3 w-3 text-amber-900 animate-pulse" />}
                      {s.status}
                    </span>
                  </div>

                  <div className="my-1.5 text-xl font-tech-mono font-black tracking-tight truncate">
                    {s.value} <span className={`text-xs font-tech-body font-bold ${isSafe ? 'text-emerald-100' : 'text-slate-800'}`}>{s.unit}</span>
                  </div>

                  <div className={`flex items-center justify-between text-[9px] font-tech-mono font-bold px-2 py-1 rounded-xl ${metaBgClass}`}>
                    <span>{s.safeRange}</span>
                    <span className="font-black underline">{s.node}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const MeshNetwork = ({ mesh }) => (
  <div className={`flex flex-col h-full overflow-hidden p-3.5 ${clayBase.container}`}>
    <div className="flex items-center justify-between px-2 py-1 shrink-0 mb-1">
      <div className="flex items-center gap-2 text-slate-800 font-tech-header text-xs font-black">
        <div className={`p-2 ${themeStyles.teal.bg} ${themeStyles.teal.shadow} ${clayBase.pillBase}`}>
          <Network className="h-4 w-4" />
        </div>
        <span className="tracking-wider">MESH NETWORK TELEMETRY</span>
      </div>
      <span className={`text-xs font-tech-mono font-bold px-3 py-1 ${themeStyles.teal.bg} ${themeStyles.teal.shadow} ${clayBase.pillBase}`}>
        {mesh.status}
      </span>
    </div>

    <div className="flex flex-wrap items-center justify-between gap-2 p-1 flex-1 overflow-y-auto">
      <div className={`flex flex-1 min-w-[140px] justify-between items-center px-3 py-2 bg-indigo-50/80 rounded-2xl border border-white shadow-sm font-tech-body`}>
        <span className="text-slate-500 text-xs font-bold">LAST NODE:</span>
        <span className="text-indigo-600 font-tech-mono font-black text-xs bg-indigo-100 px-2.5 py-0.5 rounded-full">{mesh.lastNode}</span>
      </div>

      <div className={`flex flex-1 min-w-[170px] justify-between items-center px-3 py-2 bg-emerald-50/80 rounded-2xl border border-white shadow-sm font-tech-body`}>
        <span className="text-slate-500 text-xs font-bold">RSSI / HOPS:</span>
        <span className="text-emerald-600 font-tech-mono font-black text-xs bg-emerald-100 px-2.5 py-0.5 rounded-full">{mesh.rssi} dBm ({mesh.hops} Hops)</span>
      </div>
    </div>
  </div>
);

const WebRTCVideoPlayer = ({ streamId, fallbackPhoto, altText }) => {
  const videoRef = useRef(null);
  const [isLive, setIsLive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    let pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.ontrack = (event) => {
      if (videoRef.current && event.streams[0]) {
        videoRef.current.srcObject = event.streams[0];
        setIsLive(true);
        setIsConnecting(false);
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
        setIsLive(false);
        setIsConnecting(false);
      }
    };

    const connectPiStream = async () => {
  try {
    setIsConnecting(true);
    pc.addTransceiver('video', { direction: 'recvonly' });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Wait for ICE candidate gathering to complete before sending SDP
    if (pc.iceGatheringState !== 'complete') {
      await new Promise((resolve) => {
        const checkState = () => {
          if (pc.iceGatheringState === 'complete') {
            pc.removeEventListener('icegatheringstatechange', checkState);
            resolve();
          }
        };
        pc.addEventListener('icegatheringstatechange', checkState);
      });
    }

    const response = await fetch('http://10.191.250.61:8889/cam/whep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/sdp' },
      body: pc.localDescription.sdp,
    });

    if (!response.ok) throw new Error('WHEP server offline');

    const answerSdp = await response.text();
    await pc.setRemoteDescription(
      new RTCSessionDescription({ type: 'answer', sdp: answerSdp })
    );

    setIsLive(true);
  } catch (err) {
    console.error('WHEP connection failed:', err);
    setIsLive(false);
  } finally {
    setIsConnecting(false);
  }
};

connectPiStream();
    return () => {
      pc.close();
    };
  }, [streamId]);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover ${isLive ? 'block' : 'hidden'}`}
      />

      {!isLive && (
        <img src={fallbackPhoto} alt={altText} className="w-full h-full object-cover opacity-90" />
      )}

      <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700/80 flex items-center gap-1.5 text-[10px] font-tech-mono font-bold text-slate-200 z-20">
        <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'}`} />
        {isLive ? 'LIVE WEBRTC' : isConnecting ? 'CONNECTING...' : 'STATIC SNAPSHOT'}
      </div>
    </div>
  );
};

const NightVisionCameraBox = ({ camera }) => (
  <div className={`flex flex-col h-full select-none overflow-hidden p-3.5 ${clayBase.container}`}>
    <div className="flex items-center justify-between px-2 py-1 text-xs shrink-0 mb-1">
      <div className="flex items-center gap-2 text-slate-800 font-tech-header font-black">
        <div className={`p-2 ${themeStyles.emerald.bg} ${themeStyles.emerald.shadow} ${clayBase.pillBase}`}>
          <Eye className="h-4 w-4" />
        </div>
        <span className="tracking-wider">NIGHT VISION [{camera.id}]</span>
      </div>

      <span className={`text-xs font-tech-mono font-bold px-3 py-1 flex items-center gap-1.5 ${themeStyles.rose.bg} ${themeStyles.rose.shadow} ${clayBase.pillBase}`}>
        <Scan className="h-3.5 w-3.5" />
        {camera.cracksDetected} CRACKS DETECTED
      </span>
    </div>

    <div className={`relative flex-1 min-h-0 overflow-hidden ${clayBase.insetFrame}`}>
      <WebRTCVideoPlayer 
        streamId="nv_stream" 
        fallbackPhoto={STATIC_PHOTOS.nightVision} 
        altText="Night Vision Camera Stream" 
      />
      <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-rose-500/50 flex items-center gap-2 text-rose-400 font-tech-mono text-xs font-bold z-20">
        <AlertTriangle className="h-4 w-4 text-rose-500 animate-pulse" />
        STRUCTURAL CRACKS: {camera.cracksDetected} LOCATIONS
      </div>
      <div className={`absolute top-3 left-3 text-xs font-tech-mono font-bold ${themeStyles.emerald.bg} ${themeStyles.emerald.shadow} px-3 py-1 rounded-full z-20`}>
        {camera.res} | {camera.fps} FPS
      </div>
    </div>
  </div>
);

const ThermalCameraBox = ({ camera }) => (
  <div className={`flex flex-col h-full select-none overflow-hidden p-3.5 ${clayBase.container}`}>
    <div className="flex items-center justify-between px-2 py-1 text-xs shrink-0 mb-1">
      <div className="flex items-center gap-2 text-slate-800 font-tech-header font-black">
        <div className={`p-2 ${themeStyles.rose.bg} ${themeStyles.rose.shadow} ${clayBase.pillBase}`}>
          <Thermometer className="h-4 w-4" />
        </div>
        <span className="tracking-wider">THERMAL CAMERA [{camera.id}]</span>
      </div>

      <span className={`text-xs font-tech-mono font-bold px-3 py-1 flex items-center gap-1.5 ${themeStyles.cyan.bg} ${themeStyles.cyan.shadow} ${clayBase.pillBase}`}>
        <UserCheck className="h-3.5 w-3.5" />
        {camera.personsDetected} PERSONS DETECTED
      </span>
    </div>

    <div className={`relative flex-1 min-h-0 overflow-hidden ${clayBase.insetFrame}`}>
      <WebRTCVideoPlayer 
        streamId="thermal_stream" 
        fallbackPhoto={STATIC_PHOTOS.thermal} 
        altText="Thermal Camera Stream" 
      />
      <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/50 flex items-center gap-2 text-cyan-400 font-tech-mono text-xs font-bold z-20">
        <UserCheck className="h-4 w-4 text-cyan-400" />
        HUMAN HEAT SIGNATURES: {camera.personsDetected}
      </div>
      <div className={`absolute top-3 left-3 text-xs font-tech-body bg-[#eef2f9]/90 backdrop-blur-md p-2 rounded-2xl shadow-md border border-white/60 space-y-0.5 z-20`}>
        <div className="text-slate-700 font-bold">MAX: <span className="text-rose-600 font-tech-mono font-bold">{camera.maxTemp}°C</span></div>
        <div className="text-slate-700 font-bold">AVG: <span className="text-indigo-600 font-tech-mono font-bold">{camera.avgTemp}°C</span></div>
      </div>
    </div>
  </div>
);

export default function Dashboard({ onNavigate3D }) {
  const telemetry = STATIC_TELEMETRY;
  const [showLidar, setShowLidar] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [nodeFilter, setNodeFilter] = useState('ALL');

  return (
    <div className="relative h-screen w-screen bg-slate-900 text-slate-800 flex flex-col font-tech-body overflow-hidden">
      <FontLoader />
      <FloatingGlassBackground />

      <div className="relative z-10 flex flex-col h-full w-full overflow-hidden">
        <Header
          telemetry={telemetry}
          onNavigate3D={onNavigate3D}
          showLidar={showLidar}
          onToggleLidar={() => setShowLidar((prev) => !prev)}
        />

        <main className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-10 gap-3 min-h-0 overflow-hidden">
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
    </div>
  );
}