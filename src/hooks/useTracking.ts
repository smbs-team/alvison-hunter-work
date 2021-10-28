import { useEffect } from 'react';

/**
 *
 * A custom hook that fetches the current tracking info if it not already fetched from
 * the server. It also sets the tracking to be fetched every 30 seconds until the component
 * using it is unmounted. In the future, the OrderLord webhooks will be setup, and this hook
 * should be made to listen for changes instead of polling for them.
 */
export function useTracking(
  fetchTracking: (orderId: string) => void,
  clearTracking: () => void,
  orderId: string
) {
  return useEffect(() => {
    fetchTracking(orderId);
    const trackingInterval = setInterval(() => {
      fetchTracking(orderId);
    }, 30 * 1000);
    return function () {
      clearTracking();
      clearInterval(trackingInterval);
    };
  }, [fetchTracking, clearTracking, orderId]);
}
