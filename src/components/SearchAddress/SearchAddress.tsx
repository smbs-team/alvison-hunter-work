import { geocodeByAddress } from 'react-places-autocomplete';
import { Address } from '../../interfaces';
import { useActions, useScript, useFeatureFlag } from '../../hooks';
import { createAddressObject } from '../../utils';
import * as rawActions from '../../store/actions';
import { PlacesMaterialAutocomplete, MaterialAddressSelect } from '..';

export interface SearchAddressProps {
  onComplete(address: Address): void;
  selectNew?: boolean;
  onFail?: () => void;
}
/**
 *
 * A wrapper for the module that we are using to access google places API. It should be usable
 * in multiple places with the onComplete function provided by a parent component
 */
export const SearchAddress = ({
  onComplete,
  selectNew,
  onFail,
}: SearchAddressProps) => {
  const mapsStatus = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GMAPS_KEY}&libraries=places`
  );
  const { selectAddress, toggleModal } = useActions(rawActions);

  const { isEnabled: addressSelectEnabled, loading: addressSelectFlagLoading } =
    useFeatureFlag('weworkaddressselect');

  const onSelect = async (val: string) => {
    const res = await geocodeByAddress(val);
    const formatted = createAddressObject(
      res[0].address_components,
      res[0].place_id
    );
    if (!formatted.line1) {
      if (onFail) {
        onFail();
      }
      return toggleModal(
        true,
        'Please complete your address.',
        'Incomplete Address'
      );
    }
    if (selectNew) {
      selectAddress({ ...formatted, addressRaw: res });
    }
    onComplete(formatted);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'search_address',
      search_address: formatted,
    });
  };

  return (
    <>
      {mapsStatus === 'ready' && !addressSelectFlagLoading && (
        <div className="w-full">
          {!addressSelectEnabled ? (
            <PlacesMaterialAutocomplete onSelect={onSelect} />
          ) : (
            <MaterialAddressSelect onComplete={onComplete} />
          )}
        </div>
      )}
    </>
  );
};
