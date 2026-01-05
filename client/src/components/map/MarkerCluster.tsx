"use client";

import MarkerCluster from "react-leaflet-cluster";
import L from "leaflet";

interface MarkerClusterGroupProps {
  children: React.ReactNode;
}

// Custom cluster icon creator
function createClusterIcon(cluster: L.MarkerCluster): L.DivIcon {
  const count = cluster.getChildCount();

  // Determine size and color based on count
  let size = 40;
  let bgColor = "#3b82f6"; // blue-500

  if (count >= 100) {
    size = 60;
    bgColor = "#ef4444"; // red-500
  } else if (count >= 50) {
    size = 55;
    bgColor = "#f97316"; // orange-500
  } else if (count >= 20) {
    size = 50;
    bgColor = "#eab308"; // yellow-500
  } else if (count >= 10) {
    size = 45;
    bgColor = "#22c55e"; // green-500
  }

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${bgColor};
        border: 4px solid white;
        box-shadow: 0 3px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${count >= 100 ? "14px" : "12px"};
      ">
        ${count}
      </div>
    `,
    className: "custom-cluster-icon",
    iconSize: L.point(size, size),
    iconAnchor: [size / 2, size / 2],
  });
}

export default function MarkerClusterGroup({
  children,
}: MarkerClusterGroupProps) {
  return (
    <MarkerCluster
      iconCreateFunction={createClusterIcon}
      showCoverageOnHover={false}
      spiderfyOnMaxZoom={true}
      disableClusteringAtZoom={18}
      maxClusterRadius={60}
      animate={true}
      chunkedLoading={true}
    >
      {children}
    </MarkerCluster>
  );
}
