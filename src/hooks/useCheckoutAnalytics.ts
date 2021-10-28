import { useEffect, useState } from 'react';
import {
  Brand,
  SearchResults,
  Address,
  User,
  Carts,
  Quantities,
  PricesObj,
} from '../interfaces';
/**
 * Handles analytics that happen when the checkout view is loaded.
 * @param param0
 * @returns
 */
export function useCheckoutAnalytics({
  currentBrandObj,
  searchResults,
  selectedAddress,
  orderType,
  user,
  filteredCarts,
  quantities,
  pricesObj,
  tip,
}: {
  currentBrandObj?: Brand;
  searchResults?: SearchResults | null;
  selectedAddress: Address | null;
  orderType: string;
  user: User | null;
  filteredCarts: Carts;
  quantities: Quantities;
  pricesObj: PricesObj;
  tip: number;
}) {
  const [beginCheckout, setBeginCheckout] = useState(true);
  return useEffect(() => {
    if (beginCheckout && currentBrandObj && searchResults) {
      let currency = 'USD';
      if (currentBrandObj?.location!.name === 'TOR-018') {
        currency = 'CAD';
      }
      let ecomItems = [];
      let brandAddress =
        currentBrandObj?.location?.address || searchResults?.address;
      let ecomAddress = brandAddress;
      if (orderType === 'delivery') {
        ecomAddress = `${selectedAddress?.line1} ${selectedAddress?.line2}, ${selectedAddress?.city}, ${selectedAddress?.state}, ${selectedAddress?.zip} ${selectedAddress?.country}`;
        if (!selectedAddress?.line2) {
          ecomAddress = `${selectedAddress?.line1}, ${selectedAddress?.city}, ${selectedAddress?.state}, ${selectedAddress?.zip} ${selectedAddress?.country}`;
        }
      }
      for (let i = 0; i < filteredCarts[currentBrandObj.id]?.length; i++) {
        let additions = [];
        let addPrice = 0;
        for (let key in filteredCarts[currentBrandObj.id][i].modifiers) {
          let modGroup = (filteredCarts[currentBrandObj.id][i] as any)
            .modifiers[key];
          for (const key in modGroup) {
            let mod = {
              name: modGroup[key].name,
              price: modGroup[key].price,
            };
            additions.push(mod);
            addPrice = modGroup[key].price + addPrice;
          }
        }
        let cartId = filteredCarts[currentBrandObj.id][i].cartId || 0;
        let ecomItem = {
          item_list_id: currentBrandObj?.id,
          item_list_name: currentBrandObj?.name,
          item_list_dir: brandAddress,
          item_id: filteredCarts[currentBrandObj.id][i].guid,
          item_name: filteredCarts[currentBrandObj.id][i].name,
          item_price: filteredCarts[currentBrandObj.id][i].price,
          price: Number(
            (filteredCarts[currentBrandObj.id][i].price + addPrice).toFixed(2)
          ),
          quantity: quantities[cartId],
          item_additions: additions,
          item_additions_price: addPrice,
        };
        ecomItems.push(ecomItem);
      }
      let user_id = user?.id;
      if (user?.id === undefined) {
        user_id = 'anonymous';
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ ecommerce: null });
      window.dataLayer.push({
        event: 'begin_checkout',
        date: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
        userId: user_id,
        vessel: currentBrandObj?.location?.name,
        ecommerce: {
          affiliation: orderType,
          currency: currency,
          address: ecomAddress,
          items: ecomItems,
          sub_total: Number(pricesObj.currentCartSubTotal.toFixed(2)),
          tip_percent:
            (tip / Number(pricesObj.currentCartSubTotal.toFixed(2))) * 100,
          tip: tip,
          tax: Number(pricesObj.tax.toFixed(2)),
          grand_total: Number(pricesObj.currentCartGrandTotal.toFixed(2)),
        },
      });
    }
    setBeginCheckout(false);
  }, [
    beginCheckout,
    pricesObj,
    currentBrandObj,
    orderType,
    filteredCarts,
    quantities,
    searchResults,
    tip,
    user,
    selectedAddress,
  ]);
}
