"use client";

import { useEffect, useState } from "react";
import type { Photo } from "@/types/mars";
import {
  CAMERAS_BY_ROVER,
  ROVERS,
  type CameraCode,
  type RoverKey,
} from "@/constants/mars";

export default function Gallery() {
  // dados e controle
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  // filtros
  const [rover, setRover] = useState<RoverKey>("curiosity");
  const [camera, setCamera] = useState<"" | CameraCode>("");
  const [earthDate, setEarthDate] = useState<string>("");

  // limites vindos do manifest
  const [minDate, setMinDate] = useState<string>("");
  const [maxDate, setMaxDate] = useState<string>("");

  // câmeras dependem do rover atual
  const cameraOptions = CAMERAS_BY_ROVER[rover] as readonly CameraCode[];

  // ao trocar rover, limpamos a câmera
  useEffect(() => {
    setCamera("");
  }, [rover]);

  // ao trocar rover, carregamos manifest e já sugerimos uma data "boa" (max_date)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/mars/manifest?rover=${rover}`);
        if (!res.ok) throw new Error(`Manifest: ${res.status}`);
        const m = (await res.json()).photo_manifest;
        if (!cancelled) {
          setMinDate(m.landing_date);
          setMaxDate(m.max_date);
          setEarthDate(m.max_date); // começa pela última data com fotos
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setMinDate("");
          setMaxDate("");
          setEarthDate(""); // força usuário a escolher se falhar o manifest
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [rover]);

  // buscar fotos quando rover/câmera/data mudarem
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (!earthDate) {
          setPhotos([]);
          return;
        }

        const qs = new URLSearchParams({
          rover,
          page: "1",
          earth_date: earthDate,
          ...(camera ? { camera: camera.toLowerCase() } : {}),
        });

        const res = await fetch(`/api/mars?${qs.toString()}`);
        if (!res.ok) throw new Error(`Falha: ${res.status}`);

        const data = await res.json();
        setPhotos(data.photos ?? []);
      } catch (err) {
        console.error("Erro ao buscar fotos", err);
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [rover, camera, earthDate]);

  return (
    <>
      {/* Rover */}
      <div className="mb-4">
        <label className="mr-2 text-sm font-medium">Rover:</label>
        <select
          value={rover}
          onChange={(e) => setRover(e.target.value as RoverKey)}
          className="border rounded px-2 py-1"
        >
          {ROVERS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Data (min/max do manifest) */}
      <div className="mb-1">
        <label className="mr-2 text-sm font-medium">Data terrestre:</label>
        <input
          type="date"
          value={earthDate}
          min={minDate || undefined}
          max={maxDate || undefined}
          onChange={(e) => setEarthDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>
      {/* dica visual dos limites */}
      <p className="text-xs text-gray-500 mb-4">
        intervalo válido: {minDate || "—"} → {maxDate || "—"}
      </p>

      {/* Câmera */}
      <div className="mb-4">
        <label className="mr-2 text-sm font-medium">Câmera:</label>
        <select
          value={camera}
          onChange={(e) => setCamera(e.target.value as "" | CameraCode)}
          className="border rounded px-2 py-1"
        >
          <option value="">Todas</option>
          {cameraOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Resultados */}
      {!earthDate ? (
        <p>Escolha uma data dentro do intervalo acima.</p>
      ) : loading ? (
        <p>Carregando fotos...</p>
      ) : photos.length === 0 ? (
        <p>Nenhuma foto encontrada para essa combinação.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="border rounded-lg p-2 shadow">
              <img
                src={photo.img_src}
                alt={`Foto de Marte ${photo.id}`}
                className="w-full h-48 object-cover rounded"
                loading="lazy"
              />
              <p>
                <strong>Data:</strong> {photo.earth_date}
              </p>
              <p>
                <strong>Rover:</strong> {photo.rover.name}
              </p>
              <p>
                <strong>Câmera:</strong> {photo.camera.full_name}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
