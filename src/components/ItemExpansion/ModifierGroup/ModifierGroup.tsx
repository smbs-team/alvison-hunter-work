import {
  ModifierGroup as ModifierGroupInterface,
  ModifierOption,
  IItemExpansionForm,
} from '../../../interfaces';
import { useMemo, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  Checkbox,
  FormHelperText,
  FormGroup,
} from '@material-ui/core';
// By extending the interface in such a way, we can pass any of the props from
// the react-hook-form from the parent to this component.
export interface ModifierProps {
  group: ModifierGroupInterface;
  modifierOptionReferences: { [id: string]: ModifierOption };
  updateForm: (newForm: IItemExpansionForm) => void;
  formVals: IItemExpansionForm;
  setHasBadGroup: (newVal: boolean) => void;
}
/**
 *
 * A component used in the ItemExpansion that is used for modifier group inputs.
 * It will need to be customized more once the OrderLord menus API is more finalized
 * and we know what we will be receiving from them.
 */
export const ModifierGroup = ({
  group: {
    name: groupName,
    referenceId,
    minSelections,
    maxSelections,
    isMultiSelect,
    modifierOptionReferences: groupModifierList,
  },
  modifierOptionReferences,
  setHasBadGroup,
  updateForm,
  formVals,
}: ModifierProps) => {
  const checkedValues = formVals[referenceId] || {};
  // Handles selection of new values as well as putting the data into a form that
  // can be consumed by our Cart components and functions
  function handleSelect(checkedItemId: string) {
    // If the group is a single select, there will only be one option selected
    // in checkedValues at any given time but if the group is a multiselect, the
    // selected option needs to be toggled.
    const newSelected = (isMultiSelect && { ...checkedValues }) || {
      [checkedItemId]: modifierOptionReferences[checkedItemId],
    };
    if (isMultiSelect) {
      // If the group is a multiselect, the item needs to be toggled
      if (newSelected[checkedItemId]) {
        delete newSelected[checkedItemId];
      } else {
        newSelected[checkedItemId] = modifierOptionReferences[checkedItemId];
      }
    }
    updateForm({ ...formVals, [referenceId]: newSelected });
  }
  // This boolean represents whether the selection for this group is at or above the minimum
  // number of selections is at or below the maximum.
  const isWithinGroupLimits = useMemo(
    () =>
      Object.keys(checkedValues).length >= minSelections &&
      Object.keys(checkedValues).length <= maxSelections,
    [minSelections, maxSelections, checkedValues]
  );
  useEffect(() => {
    // A badGroup would be a group that fails verification of it being within minSelections and maxSelections. 
    // This should be able to be removed if this component is able to be properly refactored to use react-hook-form again
    if (!isWithinGroupLimits) {
      setHasBadGroup(true);
    } else {
      setHasBadGroup(false);
    }
  }, [isWithinGroupLimits, setHasBadGroup]);
  return (
    <>
      {!!groupModifierList.length && (
        <div className="mod-group border-solid border-0 border-t border-gray-300 pt-3 mx-3">
          <div>
            <FormControl
              className="w-full mr-0_5 pb-1_5"
              component="fieldset"
              error={isMultiSelect && !isWithinGroupLimits}
            >
              <FormLabel component="legend" className="pb-0_5 text-lg font-bold text-black font-sofia">
                {groupName}
                {!isMultiSelect && 
                <div className= "text-sm font-normal text-grey_desc">Required</div>}
              </FormLabel>
              <FormGroup aria-describedby={`${referenceId.toString()}-helper`}>
                {groupModifierList.map((optionNumber, idx) => {
                  const option = modifierOptionReferences![optionNumber];
                  const { name: optionName, price } = option;
                  return (
                    <div key={idx} className="w-full flex justify-between font-sofia pb-1_5">
                      <FormControlLabel
                        className="w-full font-sofia"
                        labelPlacement="end"
                        control={
                          isMultiSelect ? (
                            <Checkbox
                              style ={{
                                color: "green_select",
                                height: '12px', 
                              }}
                              checked={!!checkedValues[optionNumber]}
                              onChange={() => handleSelect(optionNumber)}
                            />
                          ) : (
                            <Radio
                              style ={{
                                color: "green_select",
                                height: '12px', 
                              }}
                              checked={!!checkedValues[optionNumber]}
                              onChange={() => handleSelect(optionNumber)}
                            />
                          )
                        }
                        label={<span className="font-sofia pl-0_5">{optionName}</span>}
                      />
                      <div className="flex flex-col justify-center font-sm font-sofia">
                        {(!!price && `+$${price.toFixed(2)}`) || ''}
                      </div>
                    </div>
                  );
                })}
              </FormGroup>
              <FormHelperText id={`${referenceId.toString()}-helper`}>
                {Object.keys(checkedValues).length < minSelections &&
                  `You must choose at least ${minSelections} of this item.`}
                {Object.keys(checkedValues).length > maxSelections &&
                  `You must choose at most ${maxSelections} of this item.`}
              </FormHelperText>
            </FormControl>
          </div>
        </div>
      )}
    </>
  );
};
