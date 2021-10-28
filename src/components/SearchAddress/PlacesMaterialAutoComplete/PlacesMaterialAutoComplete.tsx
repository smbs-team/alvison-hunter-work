import { useState, useEffect, useMemo } from 'react';
import { TextField, Grid, Typography } from '@material-ui/core';
import { throttle } from 'lodash';
import { PlaceType } from '../../../interfaces';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import parse from 'autosuggest-highlight/parse';
import { useScript } from '../../../hooks';

interface PlacesMaterialAutocompleteProps {
  onSelect: (newAddress: string) => void;
}

export function PlacesMaterialAutocomplete({
  onSelect,
}: PlacesMaterialAutocompleteProps) {
  const mapsStatus = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GMAPS_KEY}&libraries=places`
  );
  const [address, setAddress] = useState<PlaceType | null>(null);
  const [options, setOptions] = useState<PlaceType[]>([]);
  const [inputValue, setInputValue] = useState('');

  const autoCompleteService = useMemo(
    () =>
      mapsStatus === 'ready' &&
      new window.google.maps.places.AutocompleteService(),
    [mapsStatus]
  );

  const fetch = useMemo(
    () =>
      mapsStatus === 'ready' &&
      throttle((request, callback) => {
        if (autoCompleteService) {
          autoCompleteService.getPlacePredictions(request, callback);
        }
      }, 200),
    [mapsStatus, autoCompleteService]
  );

  useEffect(() => {
    if (mapsStatus === 'ready' && fetch) {
      if (inputValue === '') {
        setOptions(address ? [address] : []);
        return undefined;
      }
      fetch({ input: inputValue }, (results?: PlaceType[]) => {
        let newOptions = [] as PlaceType[];
        if (address) {
          newOptions = [address];
        }
        if (results) {
          newOptions = [...newOptions, ...results];
        }
        setOptions(newOptions);
      });
    }
  }, [inputValue, address, fetch, mapsStatus]);

  return (
    <>
      {mapsStatus === 'ready' && (
        <div className="w-full">
          <div className="inner-search">
            <Autocomplete
              id="places-search"
              className="w-full"
              getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.description
              }
              noOptionsText="Start typing..."
              filterOptions={(x) => x}
              options={options}
              autoComplete
              includeInputInList
              filterSelectedOptions
              value={address}
              onChange={(event: any, newValue: PlaceType | null) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setAddress(newValue);
                if (newValue) {
                  onSelect(newValue.description);
                }
              }}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={!inputValue.length && 'Enter Your Address' || ''}
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{shrink: false}}
                  className="search-address-textfield"
                />
              )}
              renderOption={(option) => {
                const matches =
                  option.structured_formatting.main_text_matched_substrings;
                const parts = parse(
                  option.structured_formatting.main_text,
                  matches.map((match: any) => [
                    match.offset,
                    match.offset + match.length,
                  ])
                );
                return (
                  <Grid container alignItems="center">
                    <Grid item>
                      <LocationOnIcon />
                    </Grid>
                    <Grid item xs>
                      {parts.map((part, index) => (
                        <span
                          key={index}
                          style={{ fontWeight: part.highlight ? 700 : 400 }}
                        >
                          {part.text}
                        </span>
                      ))}
                      <Typography variant="body2" color="textSecondary">
                        {option.structured_formatting.secondary_text}
                      </Typography>
                    </Grid>
                  </Grid>
                );
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
