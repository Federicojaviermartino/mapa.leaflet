// Configuración inicial del mapa
const initMap = async () => {
  // API Key de OpenRouteService (necesitas registrarte en openrouteservice.org)
  const ORS_API_KEY = "TU_API_KEY_AQUI";

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

  // Función para obtener distancia por carretera
  const getRoadDistance = async (start, end) => {
    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/v2/directions/driving-car`,
        {
          params: {
            api_key: ORS_API_KEY,
            start: `${start[1]},${start[0]}`,
            end: `${end[1]},${end[0]}`,
          },
        }
      );

      return response.data.features[0].properties.segments[0].distance / 1000; // Convertir a kilómetros
    } catch (error) {
      console.error("Error al obtener la distancia por carretera:", error);
      return null;
    }
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

  // Calcular distancias
  const straightDistance = calculateStraightDistance(
    BILBAO.coords,
    SAN_SEBASTIAN.coords
  );
  const roadDistance = await getRoadDistance(
    BILBAO.coords,
    SAN_SEBASTIAN.coords
  );

  // Crear línea entre las ciudades con popup de distancias
  const routeLine = L.polyline([BILBAO.coords, SAN_SEBASTIAN.coords], {
    color: "#FF4444",
    weight: 3,
    opacity: 0.7,
    dashArray: "10, 10",
  }).addTo(map);

  // Añadir popup con distancias en el centro de la línea
  const center = [
    (BILBAO.coords[0] + SAN_SEBASTIAN.coords[0]) / 2,
    (BILBAO.coords[1] + SAN_SEBASTIAN.coords[1]) / 2,
  ];

  const distancePopup = L.popup({
    permanent: true,
    className: "distance-popup",
  })
    .setLatLng(center)
    .setContent(
      `
          <div class="distance-info">
              <p><strong>Distancia en línea recta:</strong> ${straightDistance.toFixed(
                2
              )} km</p>
              <p><strong>Distancia por carretera:</strong> ${
                roadDistance ? roadDistance.toFixed(2) : "N/A"
              } km</p>
          </div>
      `
    )
    .addTo(map);

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
