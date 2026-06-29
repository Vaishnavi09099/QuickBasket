"use client"
import React, { useEffect } from 'react'
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import L, { LatLngExpression } from "leaflet"

interface ILocation {
  latitude: number
  longitude: number
}
interface Iprops {
  userLocation: ILocation
  deliveryBoyLocation: ILocation
}

function Recenter({ positions }: { positions: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    if (positions[0] !== 0 && positions[1] !== 0) {
      map.setView(positions, map.getZoom(), { animate: true })
    }
  }, [positions, map])
  return null
}

function LiveMap({ userLocation, deliveryBoyLocation }: Iprops) {
  const deliveryBoyIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/9561/9561688.png",
    iconSize: [45, 45]
  })
  const userIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/4821/4821951.png",
    iconSize: [45, 45]
  })

  const linePositions: [number, number][] =
    deliveryBoyLocation && userLocation
      ? [
          [userLocation.latitude, userLocation.longitude],
          [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]
        ]
      : []

  const center = deliveryBoyLocation
      ? [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]
      : [userLocation.latitude, userLocation.longitude]

  return (
    <div style={{ width: "100%", height: "500px", borderRadius: "12px", overflow: "hidden", position: "relative", zIndex: 0 }}>
      <MapContainer
        center={center as LatLngExpression}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
      >
        <Recenter positions={center as any} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
          <Popup>Delivery Address</Popup>
        </Marker>

        
        {deliveryBoyLocation && (
          <Marker position={[deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]} icon={deliveryBoyIcon}>
            <Popup>Delivery Boy</Popup>
          </Marker>
        )}
        <Polyline positions={linePositions as any} color="green" />
      </MapContainer>
    </div>
  )
}

export default LiveMap