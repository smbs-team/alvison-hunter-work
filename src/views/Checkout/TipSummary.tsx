import { Tooltip, withStyles } from '@material-ui/core';
import { Control, UseFormSetValue } from 'react-hook-form';
import { Tips } from '../../components';
import '../../styles/checkout.scss';



/**
 *
 * A component that displays the tip cost and renders the 
 * tip module 
 * 
 */

 export interface TipSummaryProps {
  preTipsCalc: { currentCartSubTotal: number };
  setValue: UseFormSetValue<any>;
  control: Control<any>;
  tip: number;
}

export const TipSummary= ({ preTipsCalc,  setValue, control, tip }: TipSummaryProps) => {
  
  const InfoTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: 'white',
      color: 'black',
      maxWidth: 200,
      fontSize: 13,
      boxShadow: "-3px 2px 7px #eaeaea",
    },
  }))(Tooltip);

  return (
    <div className="flex justify-between">
      <div className="border-0 border-b border-grey_line border-solid text-sm py-2 flex-grow">
        <div className="flex justify-between text-content_black">
          <div className="font-bold font-grotesque">Delivery Tip</div>
          <div className="font-grotesque pr-0_5">${tip.toFixed(2)}</div>
        </div>
        <div className="py-2">
        <Tips
          preTipsCalc={preTipsCalc}
          control={control}
          setValue={setValue}
        />
        </div>
        <div className="font-grotesque text-grey_desc">
          100% of your tip goes to your delivery driver!
        </div>
      </div>
      <div className="w-2 pl-0_5" />
    </div>
  );
};
