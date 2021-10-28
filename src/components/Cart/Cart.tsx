import { Brand, Carts, Quantities, Store } from "../../interfaces";
import { CartSection } from "./CartSection/CartSection";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Typography } from "@material-ui/core";
import { CloseIcon, EmptyCart, EmptyCartMsg } from "../../assets/icons";
import { Link } from "react-router-dom";
import {
  totalAllCarts,
  taxTable,
  flattenStore,
  willBrandBeOpen,
} from "../../utils";
import { useSelector } from "react-redux";
import { useActions, useLocationSearch } from "../../hooks";
import * as rawActions from "../../store/actions";
import "./cart.scss";

export interface CartProps {
  filteredCarts: Carts;
  quantities: Quantities;
}
/**
 * The component that shows all current carts. It renders them for each brand
 * that has items in the carts object.
 */
export const Cart = ({ filteredCarts, quantities }: CartProps) => {
  const {
    searchResults,
    selectedAddress,
    searchLoaded,
    orderType,
    selectedLocation,
    user,
    searchInitialized,
    deliveryTime,
  } = useSelector((store: Store) => flattenStore(store));
  const { toggleCart, locationSearch } = useActions(rawActions);
  const history = useHistory();
  useLocationSearch(
    searchResults,
    orderType,
    locationSearch,
    selectedAddress,
    undefined,
    selectedLocation || undefined,
    searchInitialized
  );
  const [brandClosed, setBrandClosed] = useState(false);
  const currentBrandId = filteredCarts && Object.keys(filteredCarts)[0];
  const currentBrand = searchResults?.brands.find(
    (brand: Brand) => brand.id === currentBrandId
  );
  const pricesObj = totalAllCarts(
    filteredCarts,
    quantities,
    taxTable[currentBrand?.location!.name || 0] || 0,
    0
  );

  useEffect(() => {
    if (filteredCarts[currentBrandId]) {
      let address = currentBrand?.location.address;
      if (orderType === "delivery") {
        address = `${selectedAddress?.line1} ${selectedAddress?.line2}, ${selectedAddress?.city}, ${selectedAddress?.state} ${selectedAddress?.zip}, ${selectedAddress?.country}`;
        if (!selectedAddress?.line2) {
          address = `${selectedAddress?.line1}, ${selectedAddress?.city}, ${selectedAddress?.state} ${selectedAddress?.zip}, ${selectedAddress?.country}`;
        }
      }
      let currency = searchResults?.brands[0].location?.currency || "USD";
      let ecomItems = [];
      for (let i = 0; i < filteredCarts[currentBrandId].length; i++) {
        let item = filteredCarts[currentBrandId][i];
        let cartId = item.cartId || 0;
        let additions = [];
        let additionsPrice = 0;
        for (let key in item.modifiers) {
          let modifier = item.modifiers[key];
          for (let key in modifier) {
            let addition = {
              name: modifier[key].name,
              price: modifier[key].price,
            };
            additionsPrice = additionsPrice + modifier[key].price;
            additions.push(addition);
          }
        }
        let itemObj = {
          item_id: item.guid,
          item_name: item.name,
          item_list_name: currentBrand?.name,
          item_list_id: currentBrand?.id,
          item_list_dir: currentBrand?.location.address,
          item_price: item.price,
          price: Number((item.price + additionsPrice).toFixed(2)),
          quantity: quantities[cartId],
          item_additions: additions,
          item_additions_price: additionsPrice,
        };
        ecomItems.push(itemObj);
      }
      let user_id = user?.id;
      if (user?.id === undefined) {
        user_id = "anonymous";
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ ecommerce: null });
      window.dataLayer.push({
        event: "view_cart",
        date: new Date().toJSON().slice(0, 10).replace(/-/g, "/"),
        user_id: user_id,
        vessel: searchResults?.brands[0].location?.name,
        ecommerce: {
          affiliation: orderType,
          currency: currency,
          address: address,
          items: ecomItems,
          total: Number(pricesObj.currentCartGrandTotal.toFixed(2)),
        },
      });
    }
  }, [
    currentBrand,
    orderType,
    pricesObj,
    quantities,
    searchResults,
    filteredCarts,
    currentBrandId,
    selectedAddress,
    user,
  ]);
  const allowOrders =
    currentBrand?.isOpen || willBrandBeOpen(currentBrand, deliveryTime);

  return (
    <div>
      <div className="horiz-center">
        <div className="cart-view">
          <div className="flex justify-center border-0 border-b border-solid border-grey_line flex-col">
            <div className="flex justify-between py-4 px-4 leading-8">
              <div className="leading-8 flex flex-col justify-center">
                <CloseIcon
                  tabIndex={3}
                  className="h-3 w-3"
                  onKeyPress={(e) => {
                    //On Press Enter
                    if (e.charCode === 13) {
                      toggleCart(false);
                    }
                  }}
                  onClick={() => {
                    toggleCart(false);
                  }}
                />
              </div>
              <div className="text-center font-sofia font-bold text-2xl">
                Your Order
              </div>
              <div className="w-3 h-3" />
            </div>
          </div>
          <div className="horiz-center">
            <div className="cart-body">
              {searchLoaded && searchResults && searchResults.brands
                ? Object.keys(filteredCarts).map((brandId, idx) => {
                    const brand = searchResults.brands.find(
                      (each: Brand) => each.id === brandId
                    );
                    if (!brand?.isOpen && !brandClosed) {
                      setBrandClosed(true);
                    }
                    return Object.keys(filteredCarts[brandId]).length &&
                      brand ? (
                      <CartSection
                        key={idx}
                        cart={filteredCarts[brandId]}
                        quantities={quantities}
                        brand={brand}
                        checkout={false}
                      />
                    ) : (
                      ""
                    );
                  })
                : ""}
            </div>
          </div>
        </div>
      </div>
      {Object.keys(filteredCarts).length ? (
        <div className="white-container flex justify-center h-20 exp-btn">
          <div className="flex flex-col justify-center h-full">
            <Button
              type="submit"
              tabIndex={2}
              variant="contained"
              color="primary"
              size="large"
              className="w-80 h-12 focus:outline-none focus:ring focus:border-blue-300"
              disabled={!allowOrders}
              onClick={() => {
                toggleCart(false);
                history.push("/checkout");
              }}
            >
              <div className="flex justify-between w-full">
                <div className="font-sm">
                  {allowOrders ? "Checkout" : "Brand Closed"}
                </div>
                <div className="font-xs">
                  ${pricesObj.currentCartSubTotal.toFixed(2)}
                </div>
              </div>
            </Button>
          </div>
        </div>
      ) : (
        <div className="h-full w-full flex flex-col justify-center items-center">
          <EmptyCartMsg className="transform translate-x-10" />
          <EmptyCart className="mb-4" />
          <Typography variant="body1" className="text-center mb-2">
            It’s looking really empty in here. <br /> Try adding some snacks to
            your cart!
          </Typography>
          <Link to="/location" onClick={() => toggleCart(false)}>
            View Menus
          </Link>
        </div>
      )}
    </div>
  );
};
