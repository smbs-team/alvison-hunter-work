import {
  Select,
  MenuItem,
  ListSubheader,
  InputLabel,
  FormControl,
} from '@material-ui/core';
import { useState, ReactElement } from 'react';
import { WEWORK_LOCATIONS } from '../../../constants/wework-locations';
import { useActions, useScript } from '../../../hooks';
import * as rawActions from '../../../store/actions';
import { createAddressObject } from '../../../utils';
import { Address } from '../../../interfaces';
import { geocodeByAddress } from 'react-places-autocomplete';

interface MaterialAddressSelectProps {
  onComplete: (newAddress: Address) => void;
}

type MaterialElement = typeof ListSubheader | typeof MenuItem; 

export function MaterialAddressSelect({
  onComplete,
}: MaterialAddressSelectProps) {
  const mapsStatus = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GMAPS_KEY}&libraries=places`
  );
  const { setOrderType } = useActions(rawActions);
  const [address, setAddress] = useState<any>('');
  return (
    <>
      {mapsStatus === 'ready' && (
        <FormControl variant="filled" className="w-full">
          {!address && (
            <InputLabel id="location-select">WeWork Location</InputLabel>
          )}
          <Select
            style={{ textAlign: 'left' }}
            variant="outlined"
            labelId="location-select"
            onChange={async (e) => {
              const addressString = e.target.value as string;
              setAddress(addressString);
              const res = await geocodeByAddress(addressString);
              const formatted = createAddressObject(
                res[0].address_components,
                res[0].place_id
              );
              setOrderType('delivery');
              onComplete({ ...formatted, fromSelectComponent: true });
            }}
            value={address}
          >
            {Object.keys(WEWORK_LOCATIONS).reduce<
              ReactElement<MaterialElement>[]
            >((acc, cityName) => {
              const locations = Object.values(WEWORK_LOCATIONS[cityName]);
              return acc.concat([
                <ListSubheader key={cityName}>
                  {cityName.replaceAll('_', ' ')}
                </ListSubheader>,
                ...locations.map((weworkLocation, idx) => (
                  <MenuItem
                    key={`${cityName}-${idx}}`}
                    value={weworkLocation.full_address}
                  >
                    {weworkLocation.name}
                  </MenuItem>
                )),
              ]);
            }, [])}
          </Select>
        </FormControl>
      )}
    </>
  );
}
