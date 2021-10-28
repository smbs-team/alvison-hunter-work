import { useEffect, useState, useMemo } from 'react';
import { useScript } from '../hooks';
import { Tracking } from '../interfaces/orderInterfaces';
import '../styles/map.scss';

function initMap(initialPos: { lat: number; lng: number }) {
  return new google.maps.Map(document.getElementById('map') as HTMLElement, {
    center: initialPos,
    disableDefaultUI: true,
  });
}

export interface MapProps {
  tracking: Tracking;
  orderType?: string;
}
/**
 *
 * @param param0
 * @returns
 * A component for holding a google map that is used for tracking.
 */
export const GoogleMap = ({ tracking, orderType }: MapProps) => {
  const mapsStatus = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GMAPS_KEY}&libraries=places`
  );
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [customerLocation, setCustomerLocation] =
    useState<google.maps.Marker | null>(null);
  const [restaurantLocation, setRestaurantLocation] =
    useState<google.maps.Marker | null>(null);
  const [driverLocation, setDriverLocation] =
    useState<google.maps.Marker | null>(null);
  const [boundsSet, setBoundsSet] = useState(false);
  const bounds = useMemo(() => new google.maps.LatLngBounds(), []);
  useEffect(() => {
    if (orderType && mapsStatus === 'ready') {
      if (!map) {
        setMap(initMap(tracking.customer));
      } else {
        if (orderType && orderType !== 'takeaway') {
          if (!customerLocation) {
            setCustomerLocation(
              new google.maps.Marker({
                icon: '/icon-home.svg',
                position: tracking.customer,
                map,
              })
            );
          } else {
            const customerPosition = customerLocation!.getPosition();
            customerLocation.setPosition(tracking.customer);
            bounds.extend({
              lat: customerPosition!.lat(),
              lng: customerPosition!.lng(),
            });
            customerLocation.setPosition(tracking.customer);
          }
        }
        if (!restaurantLocation) {
          setRestaurantLocation(
            new google.maps.Marker({
              icon: '/icon-location.svg',
              position: tracking.venue,
              map,
            })
          );
        } else {
          const restaurantPosition = restaurantLocation.getPosition();
          restaurantLocation.setPosition(tracking.venue);
          bounds.extend({
            lat: restaurantPosition!.lat(),
            lng: restaurantPosition!.lng(),
          });
          restaurantLocation.setPosition(tracking.venue);
        }
        if (tracking.position.lat) {
          if (!driverLocation) {
            setDriverLocation(
              new google.maps.Marker({
                icon: '/icon-movingcart.svg',
                position: tracking.position,
                map,
              })
            );
          } else {
            const driverPosition = driverLocation.getPosition();
            driverLocation.setPosition(tracking.position);
            bounds.extend({
              lat: driverPosition!.lat(),
              lng: driverPosition!.lng(),
            });
          }
        }
        if (!boundsSet) {
          if (
            orderType !== 'takeaway'
              ? restaurantLocation && customerLocation
              : restaurantLocation
          ) {
            setBoundsSet(true);
            map.fitBounds(bounds);
          }
        }
      }
    }
  }, [
    tracking,
    map,
    bounds,
    boundsSet,
    customerLocation,
    restaurantLocation,
    driverLocation,
    orderType,
    mapsStatus,
  ]);
  return mapsStatus === 'ready' ? (
    <div className="map-holder">
      <div id="map"></div>
    </div>
  ) : (
    <div />
  );
};
