import {
  MenuItem as MenuItemInterface,
  Brand,
  SkuToQuantity,
  Store,
} from "../../../interfaces";
import { useState, useEffect, FC } from "react";
import { useSelector } from "react-redux";
import { Typography } from "@material-ui/core";
import { flattenStore, willBrandBeOpen } from "../../../utils";
import LazyLoad from "react-lazyload";
import { AddToCartSmart } from "../AddToCartSmart/AddToCartSmart";
import cn from "classnames";
import ProductDetails from "../ProductDetails/ProductDetails";

export interface IProductTile {
  product: MenuItemInterface;
  brand: Brand;
  skuMap: SkuToQuantity;
}

const ProductTile: FC<IProductTile> = ({ product, brand, skuMap }) => {
  const { searchResults, user, selectedAddress, orderType, deliveryTime } =
    useSelector((store: Store) => flattenStore(store));

  const [expanded, toggleExpanded] = useState(false);

  const [imageError, setImageError] = useState(product.image ? false : true);

  useEffect(() => {
    if (expanded) {
      let address = brand.location?.address;
      if (orderType === "delivery") {
        address = `${selectedAddress?.line1} ${selectedAddress?.line2}, ${selectedAddress?.city}, ${selectedAddress?.state} ${selectedAddress?.zip}, ${selectedAddress?.country}`;
        if (!selectedAddress?.line2) {
          address = `${selectedAddress?.line1}, ${selectedAddress?.city}, ${selectedAddress?.state} ${selectedAddress?.zip}, ${selectedAddress?.country}`;
        }
      }
      let user_id = user?.id;
      if (user?.id === undefined) {
        user_id = "anonymous";
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ ecommerce: null });
      window.dataLayer.push({
        event: "view_item",
        date: new Date().toJSON().slice(0, 10).replace(/-/g, "/"),
        user_id: user_id,
        vessel: brand.location?.name,
        ecommerce: {
          affiliation: orderType,
          currency: brand.location?.currency || "USD",
          address: address,
          items: [
            {
              item_id: product.guid,
              item_name: product.name,
              // item_category: , //still not well setup yet
              item_list_id: brand.id,
              item_list_name: brand.name,
              item_list_dir: brand.location?.address,
              // item_additions: , //probs unnecessary
              price: product.price,
            },
          ],
        },
      });
      window.dataLayer.push({
        event: "virtual_pageview",
        page_title: `brand:${brand.name}:${product.name}`,
        page_url: window.location.pathname,
      });
    }
  }, [
    expanded,
    toggleExpanded,
    product,
    brand,
    searchResults,
    orderType,
    selectedAddress,
    user,
  ]);

  const pathName = product.image && new URL(product.image).pathname;
  const showOpen = brand.isOpen || willBrandBeOpen(brand, deliveryTime);

  return (
    <div className={"relative"}>
      <div className="flex flex-col h-full cursor-pointer">
        <AddToCartSmart
          item={product}
          brand={brand}
          menuType={"retail"}
          skuMap={skuMap}
          guid={product.guid}
        />

        <LazyLoad offset={600}>
          {!imageError ? (
            <div
              className={cn({ "opacity-60": !showOpen }, "mb-2")}
              onClick={() => toggleExpanded(!expanded)}
            >
              <img
                src={`https://ik.imagekit.io/getreef/orderlordlogos/${pathName}?tr=w-300`}
                title={product.name || ""}
                alt={product.name}
                className="w-full"
                onError={(e) => {
                  setImageError(true);
                }}
              />
            </div>
          ) : (
            <div
              onClick={() => toggleExpanded(!expanded)}
              className={"bg-greyed_out h-32 sm:h-40 mb-2"}
            />
          )}
        </LazyLoad>

        <div className={cn("flex-grow", { "opacity-60": !showOpen })}>
          <div
            className="flex flex-col h-full"
            onClick={() => toggleExpanded(!expanded)}
          >
            <Typography variant="subtitle1" className="mb-1">
              {product.name}
            </Typography>
            <Typography variant="subtitle1" className="font-bold">
              ${product.price.toFixed(2)}
            </Typography>
          </div>
        </div>
      </div>

      <ProductDetails
        isOpen={expanded}
        brand={brand}
        menuType="retail"
        brandIsOpen={showOpen}
        product={product}
        handleClose={() => toggleExpanded(false)}
      />
    </div>
  );
};

export default ProductTile;
