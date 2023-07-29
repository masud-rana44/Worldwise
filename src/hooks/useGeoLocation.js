import { useState } from "react";

export function useGeoLocation(defaultPosition = null) {
  const [error, setError] = useState("");
  const [position, setPosition] = useState(defaultPosition);
  const [isLoading, setIsLoading] = useState(false);

  function getPosition() {
    setIsLoading(true);
    if (!navigator.geolocation)
      return setError("Geolocation doesn't support in you browser");

    navigator.geolocation.getCurrentPosition(
      function (pos) {
        const { latitude, longitude } = pos.coords;
        setPosition({
          lat: latitude,
          lng: longitude,
        });
        setIsLoading(false);
      },
      function (err) {
        console.error(err);
        setError(err.message);
        setIsLoading(false);
      }
    );
  }

  return {
    error,
    isLoading,
    position,
    getPosition,
  };
}
