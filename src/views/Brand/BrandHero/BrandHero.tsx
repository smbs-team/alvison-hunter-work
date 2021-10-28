import {ClosedCover, StoreHours} from "../../../components";
import { Brand } from "../../../interfaces/menuInterfaces";
import {FC} from "react";

interface IBrandHero {
    currentBrand: Brand
}


const BrandHero: FC<IBrandHero> = function ({currentBrand}) {
    


    return <div className="horiz-center ">

            <div className="hero-container"
                 style={{background: `linear-gradient(15deg, rgb(3, 14, 27) 0.27%, rgba(3, 14, 27, 0) 98.46%), url(https://ik.imagekit.io/getreef/reefmarketplacedsp/images/hero_images/${currentBrand.brandId}.png?tr=w-1440) no-repeat`}}>


                {/* Closed Store Cover  */}
                <ClosedCover currentBrand={currentBrand} isHome={false} />

                {/* Open store */}
                <div className="hero-container__wrapper">

                    <div className="hero-container__description" style={ (!currentBrand.isOpen ? {color: 'rgba(255,255,255,0.3)'} : undefined ) } >

                      <h2 className="text-4xl mb-1"> {currentBrand.name} </h2>

                      {/* Address and More (Store hours) */}
                      <div className="my-0 flex flex-wrap" style={{height: '28px'}}>
                          <p className="m-0">
                          {currentBrand.location?.address?.split(", ")[0]}
                          {typeof currentBrand?.distance !== "undefined" && ` • ${(currentBrand?.distance * 0.621371).toFixed(1)}mi away`}
                          {` • `} </p>  <StoreHours currentBrand={currentBrand}/> </div>
                    </div>

                </div>




            </div>

        </div>




}

export default BrandHero;
