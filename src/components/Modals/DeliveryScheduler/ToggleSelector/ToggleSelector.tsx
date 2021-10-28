import { styles } from '../../../../styles/sharedTailwindClasses';
import { ReactElement } from 'react';

const { vertCenter, darkGreyBorder, blueMunsellFillIn } = styles;
/**
 * 
 * @param param0 
 * @returns 
 * A reusable toggle selector that matches the styles in the figma designs
 * that are used in a number of places.
 */
export function ToggleSelector({
  title,
  tabs,
  selectorFunc,
  selected,
}: {
  title: string | ReactElement;
  tabs: string[];
  selectorFunc: (newVal: any) => void;
  selected: string;
}) {
  return (
    <div className="px-2">
      <div className="font-sofia text-sm mt-2">{title}</div>
      <div
        className={`grid grid-cols-2 mt-1_5 ${darkGreyBorder} border font-sofia text-base h-5 p-0_5 select-none cursor-pointer`}
      >
        {tabs.map((type, idx) => (
          <div
            key={idx}
            className={`text-center ${vertCenter} ${
              type === selected ? blueMunsellFillIn : ''
            }`}
            onClick={() => selectorFunc(type)}
          >
            {type}
          </div>
        ))}
      </div>
    </div>
  );
}
