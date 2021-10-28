import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormLabel,
  Radio,
  FormControlLabel,
  RadioGroup,
  TextField,
  makeStyles,
} from '@material-ui/core';
import { useMemo } from 'react';
import { Store } from '../../../../interfaces';
import { useFeatureFlag } from '../../../../hooks';
import { flattenStore, getFlattenedWeWorks } from '../../../../utils';
import { useSelector } from 'react-redux';
import { Controller } from 'react-hook-form';

interface OrderNotesProps {
  orderType: string;
  control: any;
  watch: any;
}
/**
 * This component handles all of the different order notes needed for checkout in different
 * subdomains. It needs to get watch and control from react-hook-form.
 * @param param0
 * @returns
 */
export function OrderNotes({ watch, control }: OrderNotesProps) {
  const { orderType, selectedAddress } = useSelector((store: Store) =>
    flattenStore(store)
  );
  const { isEnabled: addressSelectEnabled, loading: addressSelectFlagLoading } =
    useFeatureFlag('weworkaddressselect');
  const { isAlpaca } = watch();
  const currentWeWork = useMemo(
    () =>
      addressSelectEnabled &&
      getFlattenedWeWorks().find(
        (location) => location.address1 === selectedAddress?.line1
      ),
    [addressSelectEnabled, selectedAddress]
  );

  const useStyles = makeStyles((theme) => ({
    input: {
      height: 5,
    },
    margin: {
      margin: theme.spacing(1),
    },
  }));
  
  const classes = useStyles();

  return (
    <>
      {!addressSelectFlagLoading && (
        <div className="w-full">
          {isAlpaca && (
            <div>
              <Controller
                control={control}
                name="floor"
                render={({ field }) => (
                  <div className="flex justify-center mt-1 my-2 ">
                    <TextField
                      required
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        disableUnderline: true, 
                        style : {
                          background: "white", 
                          border: "1px solid #e9ecef",
                          paddingBottom: "8px",
                        }
                      }}
                      variant="filled"
                      multiline
                      className={`text-content_black w-full`}
                      label="Floor"
                      id="floor"
                      aria-describedby={`floor-helper-text`}
                      {...field}
                    />
                  </div>
                )}
              />
              <Controller
                control={control}
                name="unit"
                render={({ field }) => (
                  <div className="flex justify-center mt-1 mt-2">
                    <TextField
                      required
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        disableUnderline: true,
                        style : {
                          background: "white", 
                          border: "1px solid #e9ecef",
                          paddingBottom: "8px",
                        }
                      }}
                      variant="filled"
                      multiline
                      className={`text-content_black w-full`}
                      label="Suite, Unit, and/or Company"
                      id="unit"
                      aria-describedby={`unit-helper-text`}
                      {...field}
                    />
                  </div>
                )}
              />
              <div className="horiz-center text-sm font-grotesque">
                <Controller
                  control={control}
                  name="additionalNotes"
                  defaultValue="Desk"
                  render={({ field }) => (
                    <FormControl
                      className="w-full ml-0_5 mr-0_5 mt-3 text-sm font-grotesque"
                      required
                      component="fieldset"
                    >
                      <FormLabel component="legend" style={{ color: 'black', fontSize: '14px'}}>
                        Delivery Preferences
                      </FormLabel>
                      <RadioGroup aria-label="Delivery Preferences" {...field} >
                        <FormControlLabel
                          value="Desk"
                          control={<Radio style={{ color: "green_select"}} />}
                          label={<span className="text-sm">Desk</span>}
                        />
                        <FormControlLabel
                          value="Alpaca outpost in office"
                          control={<Radio style={{ color: "green_select" }} />}
                          label={<span className="text-sm">Alpaca outpost in office</span>}
                        />
                        <FormControlLabel
                          value="Building lobby outpost"
                          control={<Radio style={{ color: "green_select" }}/>}
                          label={<span className="text-sm">Building lobby outpost</span>}
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </div>
            </div>
          )}
          <div className="w-full">
            {orderType === 'delivery' &&
              (!addressSelectEnabled ? (
                !isAlpaca && (
                <Controller
                  control={control}
                  name="line2"
                  render={({ field }) => (
                    <div className="flex justify-center mt-1 my-2 ">
                      <TextField
                        variant="filled"
                        multiline
                        className={`text-content_black w-full`}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          disableUnderline: true,
                          style : {
                            background: "white", 
                            border: "1px solid #e9ecef",
                            paddingBottom: "8px",
                          } 
                        }}
                        label="Apt / Suite / Floor"
                        id="line2"
                        aria-describedby={`unit-helper-text`}
                        {...field}
                      />
                    </div>
                  )}
                />
                )
              ) : (
                <Controller
                  control={control}
                  name="line2"
                  render={({ field }) => (
                    <div className={`flex justify-center px-1 pt-1 my-2 border border-solid border-grey_line`}>
                      <FormControl className='w-full'>
                        <InputLabel required id="floor-select" shrink disabled>
                          Select Floor
                        </InputLabel>
                        <Select required labelId="floor-select" {...field} disableUnderline 
                        >
                          {currentWeWork &&
                            currentWeWork.floors.map((floor, idx) => (
                              <MenuItem key={idx} value={floor}>
                                {floor}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </div>
                  )}
                />
              ))}
          </div>
          <div>
            <Controller
              control={control}
              name="orderNote"
              render={({ field }) => (
                <div className="flex justify-center mt-1 my-2 ">
                  {isAlpaca ? (
                    <TextField
                      required
                      InputLabelProps={{ shrink: true }}
                        InputProps={{
                          disableUnderline: true, 
                          style : {
                            background: "white", 
                            border: "1px solid #e9ecef",
                            paddingBottom: "8px",
                          }
                        }}
                        variant="filled"
                        multiline
                        className={`text-content_black w-full`}
                      id="orderNote"
                      label="Drop Off Instructions"
                      aria-describedby={`unit-helper-text`}
                      {...field}
                    />
                  ) : (
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        disableUnderline: true,
                        style : {
                          background: "white", 
                          border: "1px solid #e9ecef",
                          paddingBottom: "8px",
                        }
                      }}
                      variant="filled"
                        multiline
                        className={`text-content_black w-full`}
                      id="orderNote"
                      label="Order Notes"
                      aria-describedby={`unit-helper-text`}
                      {...field}
                    />
                  )}
                </div>
              )}
            />
          </div>
        </div>
      )}
    </>
  );
}
