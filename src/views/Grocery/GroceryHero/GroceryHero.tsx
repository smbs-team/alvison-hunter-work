import { useSelector } from "react-redux";
import { Store } from '../../../interfaces';
import { ClosedCover } from "../../../components";
import { Brand } from "../../../interfaces/menuInterfaces";
import { FC } from "react";
import "./groceryHero.scss"
import { useConfigcatText } from "../../../hooks";
import { flattenStore, getSubdomain } from "../../../utils";
import { ORDER_TYPE } from "../../../utils/constants";
import { Typography } from "@material-ui/core";


interface IGroceryHero {
    currentBrand: Brand;
}

const GroceryHero: FC<IGroceryHero> = function ({ currentBrand }) {

    const { orderType } = useSelector((store: Store) => flattenStore(store));
    const convenienceBannerSubtext = <Typography className="text-lg font-bold">Pickup just {currentBrand.distance?.toFixed(2)} miles away</Typography>;

    return <div className="horiz-center grocery-hero">
        <div className="hero-container">

            {/* Closed Store Cover  */}
            <ClosedCover currentBrand={currentBrand} isHome={true} />

            {/* Open store */}
            <div className="hero-container__wrapper">
                <div className="hero-container__description" style={(!currentBrand.isOpen ? { color: 'rgba(255,255,255,0.3)' } : undefined)} >
                    <h2 className="whitespace-pre-wrap text-3xl sm:text-5xl mb-1 mt-0 font-hanson sm:leading-tight" style={(!currentBrand.isOpen ? { color: 'rgb(208, 252, 172, 0.3)' } : { color: 'rgb(208, 252, 172)' })} >
                        {useConfigcatText("convenienceBanner", `${getSubdomain() === 'wework' ? 'Anything you need.\nStraight to WeWork.' : 'Delivery in 10 mins.\nSeriously.'}`)}
                    </h2>

                    {/* Description */}

                    <p className="text-lg">
                        Available everyday from 10:00 AM - 2:00 AM
                    </p>

                    {orderType === ORDER_TYPE.TAKEAWAY && convenienceBannerSubtext}
                </div>
            </div>
        </div>
    </div>
}

export default GroceryHero;
