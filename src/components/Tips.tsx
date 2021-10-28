import { useState, useEffect, useMemo } from 'react';
import { UseFormSetValue, Control } from 'react-hook-form';
import { CloseIcon } from '../assets/icons';
import { TextField } from '@material-ui/core';
import '../styles/tips.scss';

export interface TipProps {
  preTipsCalc: { currentCartSubTotal: number };
  setValue: UseFormSetValue<any>;
  control: Control<any>;
}
/**
 *
 * A component for selecting various different tips that is currently used in checkout,
 * but may also be used later for adding additional tips to orders.
 */
export const Tips = ({ preTipsCalc, setValue }: TipProps) => {
  const tipItems = useMemo(() => [0.15, 0.18, 0.2, 'other'], []);
  const [selectedTipItem, updateSelectedTipItem] = useState(0);
  const [customTip, setCustomtip] = useState<string | null | boolean | number>(
    ''
  );
  const [customForm, toggleCustomForm] = useState(false);

  const tip = useMemo(
    () =>
      typeof tipItems[selectedTipItem] === 'number'
        ? Number(tipItems[selectedTipItem]) * preTipsCalc.currentCartSubTotal
        : Number(customTip),
    [tipItems, selectedTipItem, preTipsCalc, customTip]
  );
  //const _onChangeTip = useCallback((args) => onChangeTip(args), [onChangeTip]);
  useEffect(() => {
    setValue('tip', tip ? tip : 0);
  }, [tip, setValue]);
  
  return (
    <div className="">
      {customForm ? (
        <div className="flex w-full">
          <TextField
            label="Amount"
            type="number"
            className="flex-grow"
            value={customTip}
            onChange={(e) => {
              const { value } = e.target;
              setCustomtip(
                !!value &&
                  Math.abs(parseInt(value, 10)) >= 0 &&
                  Math.abs(parseInt(value, 10))
              );
            }}
          />
          <CloseIcon
            className="mt-2_5"
            onClick={() => {
              toggleCustomForm(false);
            }}
          />
        </div>
      ) : (
        <div className="flex">
          {tipItems.map((tipItem, idx) => (
            <div
              key={idx}
              onClick={() => {
                updateSelectedTipItem(idx);
                if (idx === tipItems.length - 1) toggleCustomForm(true);
              }}
              className={`
                text-center font-bold cursor-pointer text-sm px-1_5 sm:px-2 pt-1_5 pb-1 font-grotesque tip
                ${selectedTipItem === idx && 'bg-dark_green text-white'}
                ${idx === 0 && 'firstTip'}
              `}
            >
              {typeof tipItem === 'number' ? `${tipItem * 100}%` : 'Custom'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
