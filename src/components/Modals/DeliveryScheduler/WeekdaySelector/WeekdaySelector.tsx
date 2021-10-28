import { styles } from '../../../../styles/sharedTailwindClasses';
import { IDaysWithSlots } from '../../../../utils';
import { ReactElement } from 'react';

const { vertCenter, darkGreyBorder, blueMunsellFillIn, greyedOut } = styles;

/**
 * 
 * @param param0 
 * @returns 
 * A reusable selector for days of the week.
 */
export function WeekdaySelector({
  title,
  slots,
  selectedDayIdx,
  setSelectedDayIdx,
}: {
  title: string | ReactElement;
  slots: IDaysWithSlots[];
  selectedDayIdx: number;
  setSelectedDayIdx: (newIdx: number) => void;
}) {
  return (
    <>
      <div className="font-sofia font-bold text-sm mt-1">{title}</div>
      <div
        className={`grid grid-cols-7 mt-1_5 ${darkGreyBorder} border border-t-0`}
      >
        {slots &&
          slots.map(({ dayName, dayOfMonth, blocked }, idx) => (
            <div
              key={idx}
              className={`h-20 font-sofia text-center ${vertCenter} select-none ${
                !blocked ? 'cursor-pointer' : ''
              } ${darkGreyBorder} border-0 border-t	
                        ${idx !== 6 ? 'border-r' : ''}
                      ${selectedDayIdx === idx ? blueMunsellFillIn : ''} ${
                blocked ? greyedOut : ''
              } ${!blocked ? 'cursor-pointer' : ''}`}
              onClick={() => !blocked && setSelectedDayIdx(idx)}
            >
              <div className="text-xs md:text-base w-full">{dayName}</div>
              <div className="text-lg w-full font-bold">{dayOfMonth}</div>
            </div>
          ))}
      </div>
    </>
  );
}
