"use client"

import { CAMERAS_BY_ROVER, ROVERS, type CameraCode, type RoverKey } from "@/constants/mars"

interface FiltersProps {
    rover: RoverKey;
    setRover: (r: RoverKey) => void
    camera: "" | CameraCode
    setCamera: (c: "" | CameraCode) => void
    earthDate: string
    setEarthDate: (d: string) => void
    minDate: string
    maxDate: string
}

export default function Filters({
  rover,
  setRover,
  camera,
  setCamera,
  earthDate,
  setEarthDate,
  minDate,
  maxDate,

}: FiltersProps) {
  const cameraOptions = CAMERAS_BY_ROVER[rover] as readonly CameraCode[]

  return (
    <div className="mb-6 rounded-xl border border-white/15 bg-transparent p-4">
      <div className="flex flex-wrap items-end gap-4 justify-center sm:justify-between">

        {/* Rover */}
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-400 mb-1">Rover</label>
          <select
            value={rover}
            onChange={(e) => setRover(e.target.value as RoverKey)}
            className="h-10 w-44 border rounded-lg px-3 shadow-sm"
          >
            {ROVERS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Data */}
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-400 mb-1">Data</label>
          <input
            type="date"
            value={earthDate}
            min={minDate || undefined}
            max={maxDate || undefined}
            onChange={(e) => setEarthDate(e.target.value)}
            className="h-10 w-44 border rounded-lg px-3 shadow-sm"
          />
        </div>

        {/* Câmera */}
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-400 mb-1">Câmera</label>
          <select
            value={camera}
            onChange={(e) => setCamera(e.target.value as "" | CameraCode)}
            className="h-10 w-44 border rounded-lg px-3 shadow-sm"
          >
            <option value="">Todas</option>
            {cameraOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
