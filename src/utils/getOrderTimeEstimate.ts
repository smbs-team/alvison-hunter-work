import { distance } from './distance';
const deliveryPrepAvg = 17;
const pickupPrepAvg = 14;

interface LatLng {
  lat: number;
  lng: number;
}

export async function getOrderTimeEstimate({
  type,
  origin,
  destination,
  prepTime,
}: {
  type: string;
  origin?: { lat: number; lng: number; name: string };
  destination?: { lat: number; lng: number; name: string };
  prepTime?: number;
}) {
  if (type === 'delivery') {
    const getRoutePromise = (req: {
      origin: LatLng;
      destination: LatLng;
      travelMode?: google.maps.TravelMode;
    }) => {
      const directionsService = new google.maps.DirectionsService();
      req.travelMode = google.maps.TravelMode.DRIVING;
      return new Promise((resolve, reject) => {
        directionsService.route(req, function (response, status) {
          if (status === 'OK') {
            const travelTime = response.routes[0].legs[0].duration;
            return resolve(travelTime);
          }
          return reject(response);
        });
      });
    };
    try {
      const res = await getRoutePromise({
        origin: origin as LatLng,
        destination: destination as LatLng,
      });
      const low =
        (prepTime || deliveryPrepAvg) +
        Math.round((res as google.maps.Duration).value / 60);
      const high = Math.max(low * 1.2, low + 3);
      return [low, high];
    } catch (e) {
      const dist = distance(
        origin!.lat,
        origin!.lng,
        destination!.lat,
        destination!.lng
      );
      const deliveryEstimate = dist * 0.621371 * 10;
      const low = (prepTime || deliveryPrepAvg) + deliveryEstimate;
      const high = Math.max(low * 1.2, low + 3);
      return [low, high];
    }
  } else {
    const low = prepTime || pickupPrepAvg;
    const high = Math.max(low * 1.2, low + 3);
    return [low, high];
  }
}
