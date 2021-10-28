import axios from 'axios';
import { DateTime } from 'luxon';
/**
 *
 * @param brandId
 * @returns
 * Checks if a restaurant is currently open or if it will be open at a given deliveryTime timestamp
 */
export const isBrandOpen = async (
  brandId: string, 
  deliveryTime?: string | DateTime | null | boolean
) => {
  deliveryTime = deliveryTime && deliveryTime !== 'ASAP' && deliveryTime;
  try {
    const { data } = await axios.get(
      `/api/location/brand/${brandId}/openCheck${deliveryTime ? `?deliveryTime=${deliveryTime}` : ''}`
    );
    return data.isOpen;
  } catch (error) {
    throw error.response;
  }
};
