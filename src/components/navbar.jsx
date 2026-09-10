import { useState } from 'react'
import { Terminal, Cpu, Network, Shield, Menu, X, Circle } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-500/20 bg-slate-950/90 backdrop-blur-md font-mono text-slate-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        
        {/* LEFT: Logo & MeshNet Branding */}
        <div className="flex items-center gap-3">
          {/* Console Window Controls decoration */}
          <div className="hidden sm:flex items-center gap-1.5 pr-2 border-r border-slate-800">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>

          {/* Logo Icon & Name */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 transition-all group-hover:border-emerald-400 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <Network className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-wider text-white group-hover:text-emerald-400 transition-colors">
                Mesh<span className="text-emerald-400">Net</span>
              </span>
              <span className="text-[10px] text-slate-500 font-sans tracking-tight -mt-1">
                v1.0.0 // node-active
              </span>
            </div>
          </a>
        </div>

        {/* CENTER: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-1 text-sm">
          <a
            href="#nodes"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60 transition-all"
          >
            <Cpu className="h-4 w-4 text-emerald-500" />
            <span>Nodes</span>
          </a>
          <a
            href="#topology"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60 transition-all"
          >
            <Network className="h-4 w-4 text-cyan-500" />
            <span>Topology</span>
          </a>
          <a
            href="#security"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60 transition-all"
          >
            <Shield className="h-4 w-4 text-emerald-500" />
            <span>Security</span>
          </a>
        </nav>

        {/* RIGHT: Status Indicator & Terminal CTA */}
        <div className="hidden sm:flex items-center gap-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-950/20 px-2.5 py-1 text-xs text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>SYSTEM_READY</span>
          </div>

          {/* Console Action Button */}
          <button className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:border-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-95">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span>$ launch_cli</span>
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white md:hidden"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <div className="border-t border-slate-800 bg-slate-950/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2 text-sm">
            <a
              href="#nodes"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-300 hover:bg-slate-900 hover:text-emerald-400"
            >
              <Cpu className="h-4 w-4 text-emerald-500" />
              <span>/nodes</span>
            </a>
            <a
              href="#topology"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-300 hover:bg-slate-900 hover:text-emerald-400"
            >
              <Network className="h-4 w-4 text-cyan-500" />
              <span>/topology</span>
            </a>
            <a
              href="#security"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-300 hover:bg-slate-900 hover:text-emerald-400"
            >
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>/security</span>
            </a>
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                <Circle className="h-2 w-2 fill-emerald-400" /> ONLINE
              </span>
              <button className="flex items-center gap-1.5 rounded border border-emerald-500/40 bg-emerald-950/30 px-3 py-1.5 text-xs text-emerald-400">
                <Terminal className="h-3.5 w-3.5" />
                <span>$ launch_cli</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}