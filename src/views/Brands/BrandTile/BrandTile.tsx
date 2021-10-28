import { useState, FC, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Brand, Store } from "../../../interfaces";
import { Typography } from "@material-ui/core";
import { getStartString, willBrandBeOpen, flattenStore, getSubdomain } from "../../../utils";
import { useSelector } from "react-redux";
import { ORDER_TYPE } from '../../../utils/constants';
import { useConfigcatText } from "../../../hooks";

interface IBrandTile {
  brand: Brand;
}

const BrandTile: FC<IBrandTile> = ({ brand }) => {
  const { deliveryTime, orderType } = useSelector((store: Store) => flattenStore(store));
  const history = useHistory();
  const [itemError, setItemError] = useState(false);

  const restaurantSubtext = orderType === ORDER_TYPE.TAKEAWAY ? `${brand.distance?.toFixed(2)} mi | Fast Food` : `30 min | Fast Food`;
  const description = useConfigcatText("restaurantSubtext", `${getSubdomain() === 'wework' ? 'Fast Food' : restaurantSubtext}`)
  
  useEffect(() => {
    setItemError(false);
  }, [brand]);

  
  return (
    <div>
      <div
        className="relative h-44 mb-1_5 cursor-pointer"
        onClick={() => {
          history.push(
            `/brand/${`${brand.name.toLowerCase().replaceAll(" ", "-")}-${
              brand.id
            }`}${history.location.search}`
          );
        }}
      >
        {!(brand.isOpen || willBrandBeOpen(brand, deliveryTime)) && (
          <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 bg-black flex justify-center items-center">
            <Typography variant="h5" className="text-white">
              {brand.hoursOfOperation && getStartString(brand)
                ? `CLOSED UNTIL ${brand ? getStartString(brand) : ""}`
                : "CLOSED"}
            </Typography>
          </div>
        )}

        {!itemError ? (
          <img
            className="w-full h-full object-cover"
            src={`https://ik.imagekit.io/getreef/reefmarketplacedsp/images/hero_images/${brand.brandId}.png?tr=w-500`}
            alt=""
            onError={(e) => setItemError(true)}
          />
        ) : (
          <div className="flex justify-center items-center flex-col w-full bg-greyed_out h-full object-cover">
            <img
              src="/not_found.svg"
              title="image unavailable"
              alt=""
              className="mx-auto mb-1 h-12"
            />
            <Typography variant="subtitle1" align="center">
              No Image
            </Typography>
          </div>
        )}
      </div>
      <Typography variant="h6" className="font-bold font-sofia">
        {brand.name}
      </Typography>
      <Typography variant="body1" className="font-grotesque grey-desc">
        {description}
      </Typography>
    </div>
  );
};

export default BrandTile;
