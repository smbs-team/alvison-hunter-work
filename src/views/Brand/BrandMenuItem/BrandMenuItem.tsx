import { FC, useState } from "react";
import LazyLoad from "react-lazyload";
import { useSelector } from "react-redux";
import { Brand, MenuItem, Store } from "../../../interfaces";
import { flattenStore, willBrandBeOpen } from "../../../utils";
import { Typography } from "@material-ui/core";
import ProductDetails from "../../../components/Product/ProductDetails/ProductDetails";
import cn from "classnames";
import "./brand-menu-item.scss";

interface IBrandMenuItem {
  item: MenuItem;
  brand: Brand;
  menuType?: string;
}

const BrandMenuItem: FC<IBrandMenuItem> = ({ item, brand, menuType }) => {
  const { deliveryTime } = useSelector((store: Store) => flattenStore(store));
  const [imageError, setImageError] = useState(item.image ? false : true);
  const showOpen = brand.isOpen || willBrandBeOpen(brand, deliveryTime);
  const [expanded, toggleExpanded] = useState(false);
  const pathName = item.image && new URL(item.image).pathname;
  const PRICE_ZERO = 0.0;

  return (
    <>
      <div
        className="item-border w-full flex items-center justify-between p-2 box-border"
        onClick={() => toggleExpanded(!expanded)}
      >
        <div
          className={cn(
            `mr-1 sm:mr-1_5 md:mr-4 flex flex-col h-full justify-center`,
            {
              closed: !showOpen,
            }
          )}
        >
          <Typography variant="h6" className="font-bold font-sofia mb-1">
            {item.name}
          </Typography>

          <Typography variant="body1" className="description">
            {item.description}
          </Typography>

          <div className={cn({ hidden: item.price == PRICE_ZERO }, "flex-1")} />

          <Typography
            className={cn("font-bold", {
              hidden: item.price == PRICE_ZERO,
            })}
          >
            ${item.price.toFixed(2)}
          </Typography>
        </div>

        {!imageError ? (
          <div className={cn("item-image", { closed: !showOpen })}>
            <LazyLoad offset={600}>
              <img
                src={`https://ik.imagekit.io/getreef/orderlordlogos/${pathName}?tr=w-300`}
                alt=""
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 "
                onError={(e) => setImageError(true)}
              />
            </LazyLoad>
          </div>
        ) : (
          <div className="retail-broken-image" />
        )}
      </div>

      <ProductDetails
        menuType={menuType}
        isOpen={expanded}
        brand={brand}
        brandIsOpen={showOpen}
        product={item}
        handleClose={() => toggleExpanded(false)}
      />
    </>
  );
};

export default BrandMenuItem;
