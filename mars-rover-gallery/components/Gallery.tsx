"use client";

import { useEffect, useState } from "react";
import type { Photo } from "@/types/mars";
import {CAMERAS_BY_ROVER, ROVERS, type CameraCode, type RoverKey,} from "@/constants/mars";

export default function Gallery() {

  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  const [rover, setRover] = useState<RoverKey>("curiosity")
  const [camera, setCamera] = useState<"" | CameraCode>("")
  const [earthDate, setEarthDate] = useState<string>("")

  const [minDate, setMinDate] = useState<string>("")
  const [maxDate, setMaxDate] = useState<string>("")

  const [page, setPage] = useState<number>(1);
  const [hasNext, setHasNext] = useState<boolean>(false)

  const cameraOptions = CAMERAS_BY_ROVER[rover] as readonly CameraCode[]


  useEffect(() => {
    setCamera("")
  }, [rover])


  useEffect(() => {
    setPage(1);
  }, [rover, camera, earthDate])

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/mars/manifest?rover=${rover}`)
        if (!res.ok) throw new Error(`Manifest: ${res.status}`)
        const m = (await res.json()).photo_manifest
        if (!cancelled) {
          setMinDate(m.landing_date)
          setMaxDate(m.max_date)
          setEarthDate(m.max_date)
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setMinDate("")
          setMaxDate("")
          setEarthDate("")
        }
      }
    })()
    return () => { cancelled = true; }
  }, [rover])

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (!earthDate) {
          setPhotos([])
          setHasNext(false)
          return
        }

        const qs = new URLSearchParams({
          rover,
          earth_date: earthDate,
          page: String(page),
          ...(camera ? { camera: camera.toLowerCase() } : {}),
        })

        const res = await fetch(`/api/mars?${qs.toString()}`);
        if (!res.ok) throw new Error(`Falha: ${res.status}`);

        const data = await res.json()
        const current = (data.photos ?? []) as Photo[]
        setPhotos(current)

        let nextAvailable = false
        if (current.length > 0) {
          const nextQs = new URLSearchParams({
            rover,
            earth_date: earthDate,
            page: String(page + 1),
            ...(camera ? { camera: camera.toLowerCase() } : {}),
          })
          const nextRes = await fetch(`/api/mars?${nextQs.toString()}`)
          if (nextRes.ok) {
            const nextData = await nextRes.json();
            nextAvailable = (nextData.photos?.length ?? 0) > 0
          }
        }
        setHasNext(nextAvailable);
      } catch (err) {
        console.error("Erro ao buscar fotos", err)
        setPhotos([])
        setHasNext(false)
      } finally {
        setLoading(false)
      }
    })();
  }, [rover, camera, earthDate, page])

  const canPrev = page > 1
  const canNext = hasNext

  const goPrev = () => { if (canPrev && !loading) setPage((p) => Math.max(1, p - 1)); }
  const goNext = () => { if (canNext && !loading) setPage((p) => p + 1); }

  return (
    <>
      <div className="mb-6 rounded-xl border border-white/15 bg-transparent p-4">
        <div className="flex flex-wrap items-end gap-4 justify-center sm:justify-between">
          {/* Rover */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">Rover</label>
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
            <label className="text-xs font-medium text-gray-600 mb-1">Data</label>
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
            <label className="text-xs font-medium text-gray-600 mb-1">Câmera</label>
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

      {!earthDate ? (
        <p className="text-center text-sm text-gray-600">Escolha uma data dentro do intervalo acima.</p>
      ) : loading && photos.length === 0 ? (
        <p className="text-center text-sm">Carregando fotos...</p>
      ) : photos.length === 0 ? (
        <p className="text-center text-sm">Nenhuma foto encontrada para essa combinação.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => {
              const src = photo.img_src.replace(/^http:\/\//, "https://");
              return (
                <div key={photo.id} className="border rounded-lg p-2 shadow-sm">
                  <img
                    src={src}
                    alt={`Foto de Marte ${photo.id}`}
                    className="w-full h-48 object-cover rounded"
                    loading="lazy"
                  />
                  <p><strong>Data:</strong> {photo.earth_date}</p>
                  <p><strong>Rover:</strong> {photo.rover.name}</p>
                  <p><strong>Câmera:</strong> {photo.camera.full_name}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={goPrev}
              disabled={!canPrev || loading}
              className="border rounded-lg px-3 py-2 disabled:opacity-50"
            >
              ← Anterior
            </button>
            <span className="text-sm">Página {page}</span>
            <button
              onClick={goNext}
              disabled={!canNext || loading}
              className="border rounded-lg px-3 py-2 disabled:opacity-50"
            >
              Próxima →
            </button>
            <span className="text-xs opacity-70">
              {loading ? "Carregando..." : `Mostrando ${photos.length} fotos`}
            </span>
          </div>
        </>
      )}
    </>
  );
}
