import { Tooltip, withStyles } from '@material-ui/core';
import React from 'react';
import InfoIcon from '@material-ui/icons/Info';
import '../../styles/checkout.scss';


/**
 *
 * A component that displays the users pickup or delivery address 
 * and subdomain specific order notes.  
 * 
 */

 export interface CostSummaryProps {
  pricesObj: {
    currentCartSubTotal: number;
    currentCartGrandTotal: number;
    tips: number;
    tax: number;
    discounts: number;
} 
}

export const CostSummary= ({ pricesObj}: CostSummaryProps) => {
  
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
    <div className="flex justify-between ">
    <div className="border-0 border-b border-grey_line border-solid text-sm py-2 flex-grow">
      <div className="flex justify-between text-content_black">
        <div className="font-bold font-grotesque test-sm">Subtotal</div>
        <div className="font-grotesque test-sm ">${pricesObj.currentCartSubTotal.toFixed(2)}</div>
      </div>
      <div className="flex justify-between text-content_black">
        <div className="font-bold font-grotesque test-sm">Tax</div>
        <div className="font-grotesque test-sm">${pricesObj.tax.toFixed(2)}</div>
      </div>
      <div className="flex justify-between text-content_black">
        <div className="font-bold font-grotesque test-sm">Delivery</div>
        <div className="font-grotesque test-sm"><span className="line-through">$1.95</span><span className="font-bold"> FREE </span></div>
      </div>
      {
        pricesObj.discounts > 0 && 
        <div className="flex justify-between text-content_black">
          <div className="font-bold font-grotesque test-sm">Discounts</div>
          <div className="font-grotesque test-sm">-${pricesObj.discounts.toFixed(2)}</div>
        </div>
      }

    </div>
    <div className="pt-4">
      <InfoTooltip
        className="text-lg align-text-bottom pt-3 pl-0_5" 
        placement="right" 
        title={
          <React.Fragment>
            {"Our competitors charge fees that add up. With getREEF, we provide you "}
            <b>{'no-fee'}</b>
            {" deliveries."}
          </React.Fragment>
        }
      >
        <InfoIcon />
      </InfoTooltip>
    </div>
  </div>
  );
};
