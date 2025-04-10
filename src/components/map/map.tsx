"use client";
import React, { useEffect, useState } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

type MapProps = {
  latitude: number;
  longitude: number;
  onMapClick: (event: google.maps.MapMouseEvent) => void;
};

const MapComponent: React.FC<MapProps> = ({
  latitude,
  longitude,
  onMapClick,
}) => {
  const [mapCenter, setMapCenter] = useState({ lat: latitude, lng: longitude });

  useEffect(() => {
    // Cập nhật center của bản đồ khi latitude hoặc longitude thay đổi
    setMapCenter({ lat: latitude, lng: longitude });
  }, [latitude, longitude]);

  return (
    <LoadScript googleMapsApiKey={process.env.MAP_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={15}
        onClick={onMapClick}
      >
        {/* Marker sẽ di chuyển theo giá trị latitude và longitude */}
        <Marker position={{ lat: latitude, lng: longitude }} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
