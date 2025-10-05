import { Link } from "react-router-dom";

const Map = ({ locationUrl }) => {
  // Function to extract coordinates from GeometryCollection and format for Google Maps
/*   const getMapUrl = (geoData) => {
    if (!geoData || geoData.type !== "GeometryCollection" || !geoData.geometries) {
      return ""; // Return empty string if data is invalid
    }
    
    // Extract all points
    const points = geoData.geometries
      .filter(geo => geo.type === "Point")
      .map(geo => geo.coordinates);
    
    if (points.length === 0) return "";
    
    // For multiple points, we'll use the first one as the center
    // You could also calculate a center point or show all markers
    const [lng, lat] = points[0];
    return `${lat},${lng}`;
  };

  const mapUrl = getMapUrl(locationUrl);
  console.log("Map URL:", locationUrl); */
  return (
    <section className="mt-48 md:mt-18">
      <div style={{ position: "relative", width: "100%", height: "400px" }}>
        {locationUrl ? (
          <iframe
            src={locationUrl}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
            loading="lazy"
            allowFullScreen
            title="Google Map"
          ></iframe>
        ) : (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            No location data available
          </div>
        )}
      </div>
    </section>
  );
};

export default Map;