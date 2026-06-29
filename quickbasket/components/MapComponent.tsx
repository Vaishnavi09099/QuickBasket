"use client"
import React, { useEffect } from 'react'
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import L, { LatLngExpression } from 'leaflet'

const markerIcon = new L.Icon({
  iconUrl: "/location.jpg",
  iconSize: [40, 40],
  iconAnchor: [20, 40]
})

type Props = {
  position: [number, number] | null
  onDragEnd: (pos: [number, number]) => void
}

function DraggableMarker({ position, onDragEnd }: Props) {
  const map = useMap()

  useEffect(() => {
    if (position) {
      map.setView(position as LatLngExpression, 15, { animate: true })
    }
  }, [position, map])

  if (!position) return null

  return (
    <Marker
      icon={markerIcon}
      position={position as LatLngExpression}
      draggable={true}
      eventHandlers={{
        dragend: (e: L.LeafletEvent) => {
          const marker = e.target as L.Marker
          const { lat, lng } = marker.getLatLng()
          onDragEnd([lat, lng])
        }
      }}
    />
  )
}

export default function MapComponent({ position, onDragEnd }: Props) {
  const center = position ?? [20.5937, 78.9629] // india center as default

  return (
    <MapContainer
      center={center as LatLngExpression}
      zoom={position ? 15 : 5}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DraggableMarker position={position} onDragEnd={onDragEnd} />
    </MapContainer>
  )
}