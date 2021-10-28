import { styles } from '../../../../styles/sharedTailwindClasses';
import { ReactElement } from 'react';

const { vertCenter, darkGreyBorder, blueMunsellFillIn, greyedOut } = styles;

interface ISlotSelectorObject {
  blocked: boolean;
  content: ReactElement | string;
}
/**
 * 
 * @param param0 
 * @returns 
 * A reusable slot selector that is currently used for selecting time slots, but
 * also is used elsewhere in designs.
 */
export function SlotSelector({
  options,
  selectedSlot,
  setSelectedSlot,
}: {
  options: ISlotSelectorObject[];
  selectedSlot: number;
  setSelectedSlot: (newSlot: number) => void;
}) {
  return (
    <div className="mt-1_5">
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-sofia text-base select-none">
        {options?.map(({ content, blocked }, idx) => (
          <div
            key={idx}
            className={`h-6 text-center font-bold ${vertCenter} ${
              idx === selectedSlot
                ? `${blueMunsellFillIn} border-solid border-blue_munsell`
                : `${darkGreyBorder} text-dark_grey`
            } border-solid border ${blocked ? greyedOut : ''} ${
              !blocked ? 'cursor-pointer' : ''
            }`}
            onClick={() => !blocked && setSelectedSlot(idx)}
          >
            {content}
          </div>
        ))}
      </div>
    </div>
  );
}
