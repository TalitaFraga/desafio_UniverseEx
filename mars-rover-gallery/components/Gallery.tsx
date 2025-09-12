"use client"

import { useEffect, useState } from "react"
import type { Photo } from "@/types/mars"
import { type CameraCode, type RoverKey } from "@/constants/mars"
import Filters from "./Filters";
import PhotoCard from "./PhotoCard"

export default function Gallery() {

  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  const [rover, setRover] = useState<RoverKey>("curiosity")
  const [camera, setCamera] = useState<"" | CameraCode>("")
  const [earthDate, setEarthDate] = useState<string>("")

  const [minDate, setMinDate] = useState<string>("")
  const [maxDate, setMaxDate] = useState<string>("")

  const [page, setPage] = useState<number>(1)
  const [hasNext, setHasNext] = useState<boolean>(false)


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
          setEarthDate((prev) => prev || m.max_date)
        }
      } catch (e) {
        console.error(e)
        if (!cancelled) {
          setMinDate("")
          setMaxDate("")
          setEarthDate("")
        }
      }
    })()

    return () => {
      cancelled = true
    };
  }, [rover])


  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);

    (async () => {
      try {
        if (!earthDate) {
          setPhotos([]);
          setHasNext(false)
          return;
        }

        const qs = new URLSearchParams({
          rover,
          earth_date: earthDate,
          page: String(page),
          ...(camera ? { camera: camera.toLowerCase() } : {}),
        })

        const res = await fetch(`/api/mars?${qs.toString()}`, {
          signal: ctrl.signal,
        })
        if (!res.ok) throw new Error(`Falha: ${res.status}`)

        const data = await res.json();
        const current = (data.photos ?? []) as Photo[]
        setPhotos(current);


        setHasNext(current.length === 25)
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.error("Erro ao buscar fotos", err)
          setPhotos([])
          setHasNext(false)
        }
      } finally {
        setLoading(false)
      }
    })();

    return () => ctrl.abort();
  }, [rover, camera, earthDate, page])

  const canPrev = page > 1
  const canNext = hasNext

  const goPrev = () => {
    if (canPrev && !loading) setPage((p) => Math.max(1, p - 1))
  }
  const goNext = () => {
    if (canNext && !loading) setPage((p) => p + 1)
  }

  return (
    <>
      <Filters
        rover={rover}
        setRover={setRover}
        camera={camera}
        setCamera={setCamera}
        earthDate={earthDate}
        setEarthDate={setEarthDate}
        minDate={minDate}
        maxDate={maxDate}
      />

      {!earthDate ? (
        <p className="text-center text-sm text-gray-600">
          Escolha uma data dentro do intervalo acima.
        </p>
      ) : loading && photos.length === 0 ? (
        <p className="text-center text-sm">Carregando fotos...</p>
      ) : photos.length === 0 ? (
        <p className="text-center text-sm">
          Nenhuma foto encontrada para essa combinação.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={goPrev}
              disabled={!canPrev || loading}
              className="border rounded-lg px-3 py-2 disabled:opacity-50"
              aria-label="Página anterior"
            >
              ← Anterior
            </button>
            <span className="text-sm">Página {page}</span>
            <button
              onClick={goNext}
              disabled={!canNext || loading}
              className="border rounded-lg px-3 py-2 disabled:opacity-50"
              aria-label="Próxima página"
            >
              Próxima →
            </button>
            <span className="text-xs opacity-70" aria-live="polite">
              {loading ? "Carregando..." : `Mostrando ${photos.length} fotos`}
            </span>
          </div>
        </>
      )}
    </>
  )
}
