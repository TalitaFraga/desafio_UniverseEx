"use client"

import type { Photo } from "@/types/mars"

interface PhotoCardProps {
  photo: Photo;
}

export default function PhotoCard({ photo }: PhotoCardProps) {
  const src = photo.img_src.replace(/^http:\/\//, "https://")

  return (
    <div className="border rounded-lg p-2 shadow-sm">
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
  )
}
