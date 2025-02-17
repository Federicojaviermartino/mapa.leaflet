// Configuración inicial del mapa
const initMap = () => {
  // Coordenadas de las ciudades
  const BILBAO = {
    name: "Bilbao",
    coords: [43.263, -2.935],
  };

  const SAN_SEBASTIAN = {
    name: "San Sebastián",
    coords: [43.3183, -1.9812],
  };

  // Crear instancia del mapa
  const map = L.map("map").setView([43.2905, -2.4581], 9);

  // Añadir capa de tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 19,
  }).addTo(map);

  // Función para calcular distancia en línea recta
  const calculateStraightDistance = (point1, point2) => {
    return map.distance(point1, point2) / 1000; // Convertir a kilómetros
  };

  // Función para crear marcadores
  const createMarker = (city) => {
    return L.marker(city.coords)
      .bindPopup(`<div class="city-marker">${city.name}</div>`)
      .addTo(map);
  };

  // Añadir marcadores
  const bilbaoMarker = createMarker(BILBAO);
  const sanSebastianMarker = createMarker(SAN_SEBASTIAN);

  // Calcular distancia
  const straightDistance = calculateStraightDistance(
    BILBAO.coords,
    SAN_SEBASTIAN.coords
  );

  // Crear línea entre las ciudades
  const routeLine = L.polyline([BILBAO.coords, SAN_SEBASTIAN.coords], {
    color: "#FF4444",
    weight: 3,
    opacity: 0.7,
    dashArray: "10, 10",
  }).addTo(map);

  // Calcular el centro de la línea
  const center = [
    (BILBAO.coords[0] + SAN_SEBASTIAN.coords[0]) / 2,
    (BILBAO.coords[1] + SAN_SEBASTIAN.coords[1]) / 2,
  ];

  // Crear popup con la distancia (inicialmente no visible)
  const distancePopup = L.popup({
    className: "distance-popup",
  }).setLatLng(center).setContent(`
          <div class="distance-info">
              <p><strong>Distancia en línea recta:</strong> ${straightDistance.toFixed(
                2
              )} km</p>
          </div>
      `);

  // Añadir evento de click a la línea
  routeLine.on("click", function (e) {
    distancePopup.openOn(map);
  });

  // Ajustar vista para mostrar toda la ruta
  map.fitBounds(routeLine.getBounds(), {
    padding: [50, 50],
  });

  // Eventos de interacción
  routeLine.on("mouseover", function () {
    this.setStyle({
      color: "#FF0000",
      weight: 4,
      opacity: 1,
    });
  });

  routeLine.on("mouseout", function () {
    this.setStyle({
      color: "#FF4444",
      weight: 3,
      opacity: 0.7,
    });
  });
};

// Esperar a que el DOM esté cargado
document.addEventListener("DOMContentLoaded", initMap);
