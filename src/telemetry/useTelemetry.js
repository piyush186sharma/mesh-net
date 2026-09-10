import { useEffect, useState } from 'react'

const initialTelemetry = { clock: '21:42:08', coordinates: { x: 124.52, y: 87.31, z: -42.18 }, depth: 42.18, heading: 127, distanceTraveled: 184.6, cameraFps: 30, sensors: { co2: 0.08, o2: 20.7, ch4: 0.12, temperature: 31.4, humidity: 64.2, pressure: 98.6, co: 3.2, h2s: 0.4, airQuality: 28, radiation: 0.18, battery: 78 }, mesh: { rssi: -67, quality: 92, lastCommunication: '21:42:05' }, thermal: { max: 43.7, avg: 29.4 } }
const drift = (value, amount) => value + (Math.random() - 0.5) * amount
const tickClock = (clock) => { const [hours, minutes, seconds] = clock.split(':').map(Number); const date = new Date(2000, 0, 1, hours, minutes, seconds + 1); return date.toTimeString().slice(0, 8) }

export function useTelemetry() {
  const [telemetry, setTelemetry] = useState(initialTelemetry)
  useEffect(() => {
    const interval = setInterval(() => setTelemetry((current) => ({ ...current, clock: tickClock(current.clock), coordinates: { x: drift(current.coordinates.x + 0.015, 0.04), y: drift(current.coordinates.y + 0.01, 0.04), z: drift(current.coordinates.z, 0.02) }, depth: drift(current.depth, 0.03), heading: Math.round((current.heading + drift(0, 2) + 360) % 360), distanceTraveled: current.distanceTraveled + 0.03, cameraFps: Math.max(28, Math.min(31, Math.round(drift(current.cameraFps, 1)))), sensors: { ...current.sensors, co2: drift(current.sensors.co2, 0.012), o2: drift(current.sensors.o2, 0.08), ch4: drift(current.sensors.ch4, 0.015), temperature: drift(current.sensors.temperature, 0.3), humidity: drift(current.sensors.humidity, 0.8), pressure: drift(current.sensors.pressure, 0.2), co: drift(current.sensors.co, 0.4), h2s: drift(current.sensors.h2s, 0.08), airQuality: drift(current.sensors.airQuality, 1.2), radiation: drift(current.sensors.radiation, 0.02), battery: current.sensors.battery - 0.002 }, mesh: { ...current.mesh, rssi: Math.round(drift(current.mesh.rssi, 2)), quality: Math.round(drift(current.mesh.quality, 1)), lastCommunication: current.clock }, thermal: { max: drift(current.thermal.max, 0.4), avg: drift(current.thermal.avg, 0.2) } })), 1000)
    return () => clearInterval(interval)
  }, [])
  return telemetry
}