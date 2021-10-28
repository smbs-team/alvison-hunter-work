import { Brand, Store } from '../../interfaces';
import { getStartString, willBrandBeOpen, flattenStore } from '../../utils';
import { useSelector } from 'react-redux';
import './closed-cover.scss';


interface ClosedCoverProps {
  currentBrand: Brand;
  isHome?: boolean;
}

/**
 * 
 * @param param0 
 * @returns 
 * willBrandBe open is used to see if a brand will be open at a user’s chosen deliveryTime. 
 * If they have chosen a deliveryTime, we need to base the showing of the ClosedCover on this
 * rather than if the restaurant is open at the current time, which is what isOpen is based on. 
 * If we don’t do this, then a user can’t place an order for 1pm the next day after 
 * the restaurant is closed. This logic is also used in a few other places.
 */
export const ClosedCover = ({currentBrand, isHome}: ClosedCoverProps) => {
    const { deliveryTime } = useSelector((store: Store) => flattenStore(store));
    return (
        <>
            {/* Store is closed */}
            {!(currentBrand.isOpen || willBrandBeOpen(currentBrand, deliveryTime))  && (
                <div className={`closed-cover horiz-center ${isHome ? 'isHome' : ''}`}>
                    <div className="closed-until">
                        {currentBrand.hoursOfOperation && getStartString(currentBrand)
                            ? `CLOSED UNTIL ${getStartString(currentBrand)}`
                            : 'CLOSED'}
                    </div>
                </div>
            )}
        </>
    )
}
