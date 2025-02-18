// Initial map configuration
const initMap = () => {
  // Autonomous Communities capitals data
  const CAPITALS = [
    {
      name: "Madrid",
      community: "Community of Madrid",
      population: 6747425,
      coords: [40.4168, -3.7038],
    },
    {
      name: "Barcelona",
      community: "Catalonia",
      population: 7763362,
      coords: [41.3851, 2.1734],
    },
    {
      name: "Valencia",
      community: "Valencian Community",
      population: 5058138,
      coords: [39.4699, -0.3763],
    },
    {
      name: "Sevilla",
      community: "Andalusia",
      population: 8472407,
      coords: [37.3891, -5.9845],
    },
    {
      name: "Zaragoza",
      community: "Aragon",
      population: 1326261,
      coords: [41.6488, -0.8891],
    },
    {
      name: "Mérida",
      community: "Extremadura",
      population: 1059501,
      coords: [38.919, -6.3437],
    },
    {
      name: "Murcia",
      community: "Region of Murcia",
      population: 1518486,
      coords: [37.9922, -1.1307],
    },
    {
      name: "Palma",
      community: "Balearic Islands",
      population: 1171543,
      coords: [39.5696, 2.6502],
    },
    {
      name: "Oviedo",
      community: "Principality of Asturias",
      population: 1011792,
      coords: [43.3603, -5.8448],
    },
    {
      name: "Santander",
      community: "Cantabria",
      population: 584507,
      coords: [43.4623, -3.8099],
    },
    {
      name: "Vitoria",
      community: "Basque Country",
      population: 2213993,
      coords: [42.8462, -2.6722],
    },
    {
      name: "Pamplona",
      community: "Navarre",
      population: 661537,
      coords: [42.8125, -1.6458],
    },
    {
      name: "Logroño",
      community: "La Rioja",
      population: 319796,
      coords: [42.4661, -2.4456],
    },
    {
      name: "Valladolid",
      community: "Castile and León",
      population: 2383139,
      coords: [41.6523, -4.7245],
    },
    {
      name: "Toledo",
      community: "Castilla-La Mancha",
      population: 2049562,
      coords: [39.8628, -4.0273],
    },
    {
      name: "Santiago de Compostela",
      community: "Galicia",
      population: 2695645,
      coords: [42.8782, -8.5448],
    },
    {
      name: "Santa Cruz de Tenerife",
      community: "Canary Islands",
      population: 2175952,
      coords: [28.4636, -16.2518],
    },
  ];

  // Create map instance centered in Spain
  const map = L.map("map").setView([40.4168, -3.7038], 6);

  // Add tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 19,
  }).addTo(map);

  // Function to calculate straight distance
  const calculateStraightDistance = (point1, point2) => {
    return map.distance(point1, point2) / 1000; // Convert to kilometers
  };

  // Store selected markers
  let selectedMarkers = [];
  let currentLine = null;
  let currentDistancePopup = null;

  // Function to create markers
  const createMarker = (city) => {
    const marker = L.marker(city.coords)
      .bindPopup(
        `
        <div class="city-marker">
          <p><strong>Capital:</strong> ${city.name}</p>
          <p><strong>Community:</strong> ${city.community}</p>
          <p><strong>Population:</strong> ${city.population.toLocaleString()} inhabitants</p>
        </div>
      `
      )
      .addTo(map);

    marker.on("click", function (e) {
      handleMarkerClick(marker, city);
    });

    return marker;
  };

  // Function to handle marker clicks
  const handleMarkerClick = (marker, city) => {
    if (selectedMarkers.length === 2) {
      // Reset previous selection
      selectedMarkers = [];
      if (currentLine) {
        map.removeLayer(currentLine);
      }
      if (currentDistancePopup) {
        map.removeLayer(currentDistancePopup);
      }
    }

    if (!selectedMarkers.includes(marker)) {
      selectedMarkers.push(marker);
      marker.setIcon(
        L.icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        })
      );
    }

    if (selectedMarkers.length === 2) {
      drawLineBetweenMarkers();
    }
  };

  // Function to draw line between selected markers
  const drawLineBetweenMarkers = () => {
    const coords = selectedMarkers.map((marker) => marker.getLatLng());

    if (currentLine) {
      map.removeLayer(currentLine);
    }

    currentLine = L.polyline(coords, {
      color: "#FF4444",
      weight: 3,
      opacity: 0.7,
      dashArray: "10, 10",
    }).addTo(map);

    const distance = calculateStraightDistance(coords[0], coords[1]);
    const center = [
      (coords[0].lat + coords[1].lat) / 2,
      (coords[0].lng + coords[1].lng) / 2,
    ];

    if (currentDistancePopup) {
      map.removeLayer(currentDistancePopup);
    }

    currentDistancePopup = L.popup({
      className: "distance-popup",
    })
      .setLatLng(center)
      .setContent(
        `
        <div class="distance-info">
          <p><strong>Straight distance:</strong> ${distance.toFixed(2)} km</p>
        </div>
      `
      )
      .openOn(map);
  };

  // Add markers for all capitals
  CAPITALS.forEach(createMarker);
};

// Wait for DOM to be loaded
document.addEventListener("DOMContentLoaded", initMap);
