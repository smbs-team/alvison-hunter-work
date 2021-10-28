import { Carts, Quantities } from '../interfaces/cartInterfaces';
import { User, Address } from '../interfaces/userInterfaces';
import { Brand, MenuItem, ModifierOption } from '../interfaces/menuInterfaces';
import { SearchResults } from '../interfaces/locationInterfaces';
import { Promo } from '../interfaces/paymentInterfaces';
import { isBrandOpen } from '../utils/isBrandOpen';
import { taxTable } from '../utils/taxTable';
import { DateTime } from 'luxon';

export async function transformCarts({
  carts,
  quantities,
  address,
  user, 
  searchResults,
  tips,
  type,
  note,
  promo,
  deliveryTime,
}: {
  carts: Carts,
  quantities: Quantities,
  address: Address,
  user: User,
  searchResults: SearchResults,
  tips: number,
  type: string,
  note?: string,
  promo?: Promo | null,
  deliveryTime?: string | DateTime | null,
}) {
  const transformed: { [key: string]: any } = {};
  const expectedDeliveryAt = deliveryTime && deliveryTime !== 'ASAP' && deliveryTime;
  for (const cart in carts) {
    const brand = searchResults.brands.find((br) => br.id === cart);
    const taxRate = taxTable[brand!.location?.name || 0] || 0;
    const allCartsTotals = totalAllCarts(
      carts,
      quantities,
      taxRate,
      tips,
      promo
    );
    const tipProportion =
      allCartsTotals.currentCartSubTotal / allCartsTotals.currentCartSubTotal;
    transformed[cart] = {
      expectedDeliveryAt,
      taxRate,
      isOpen: await isBrandOpen(brand!.id, deliveryTime),
      brandId: brand!.id,
      brandName: brand!.name,
      timedOrder: '1',
      address,
      user,
      type,
      chargeId: null,
      note,
      products: carts[cart].map((item) => {
        const prods = {
          orderingSystemId: item.guid,
          partnerSystemId: item.partnerSystemId,
          barcode: item.barcode,
          name: item.name,
          quantity: quantities[item.cartId!],
          priceUnit: item.price,
          priceTotal: item.price,
          note: item.note,
          additions: (() => {
            const flat = [];
            for (const key in item.modifiers!) {
              for (const mod in item.modifiers[key]) {
                const current = item.modifiers[key][mod];
                current.quantity = 1;
                flat.push(current);
              }
            }
            return flat.map(
              ({ name, price, guid, partnerSystemId, barcode }) => ({
                name,
                partnerSystemId,
                barcode,
                price,
                orderingSystemId: guid,
                quantity: 1,
              })
            );
          })(),
        };
        return prods;
      }),
      venue: {
        name: 'DSP Order',
      },
      price: {
        currency: brand?.location?.currency || 'usd',
        deliveryFee: 0,
        discountTotal: +allCartsTotals.discounts.toFixed(2),
        subTotal: +allCartsTotals.currentCartSubTotal.toFixed(2),
        // Currently, OrderLord is not handling tax and only wants to handle subTotals. Tips
        // can also be added
        grandTotal: +(
          allCartsTotals.currentCartSubTotal - allCartsTotals.discounts
        ).toFixed(2),
        actualGrandTotal: +allCartsTotals.currentCartGrandTotal.toFixed(2),
        taxRate: +taxRate.toFixed(2),
        taxAmount: +allCartsTotals.tax.toFixed(2),
        // The current calculation is based on what proportion each individual order is of the
        // order grouping
        tips: +(tipProportion * tips).toFixed(2),
      },
      brand: brand,
      promo,
    };
  }
  return transformed;
}

export function getCartPrice(
  cart: MenuItem[],
  quantities: Quantities,
  taxRate: number
) {
  const currentCartSubTotal = cart.reduce((acc: number, item: MenuItem) => {
    const flat = [];
    let unitPriceWithModifiers = item.price;
    for (const key in item.modifiers!) {
      for (const mod in item.modifiers[key]) {
        flat.push(item.modifiers[key][mod]);
        unitPriceWithModifiers += item.modifiers[key][mod].price;
      }
    }
    return acc + unitPriceWithModifiers * quantities[item.cartId!];
  }, 0);
  return {
    currentCartSubTotal,
  };
}

export function totalAllCarts(
  carts: Carts,
  quantities: Quantities,
  taxRate: number,
  tips: number,
  promo?: Promo | null
) {
  const totals = Object.keys(carts)
    .map((cart) => getCartPrice(carts[cart], quantities, taxRate))
    .reduce(
      (acc, each) => {
        return {
          currentCartSubTotal:
            acc.currentCartSubTotal + each.currentCartSubTotal,
          currentCartGrandTotal: 0,
          tips: 0,
          tax: 0,
          discounts: 0,
        };
      },
      {
        currentCartSubTotal: 0,
        currentCartGrandTotal: 0,
        tips: 0,
        tax: 0,
        discounts: 0,
      }
    );
  if (promo?.percentageOff) {
    totals.discounts +=
      totals.currentCartSubTotal * (promo.percentageOff / 100);
  }
  if (promo?.amountOff) {
    totals.discounts += promo.amountOff;
  }
  totals.tips = +tips.toFixed(2);
  totals.tax = +(
    (totals.currentCartSubTotal - totals.discounts) *
    taxRate
  ).toFixed(2);
  totals.currentCartGrandTotal += +totals.tips.toFixed(2);
  totals.currentCartGrandTotal += +totals.currentCartSubTotal.toFixed(2);
  totals.currentCartGrandTotal += +totals.tax.toFixed(2);
  totals.currentCartGrandTotal -= +totals.discounts.toFixed(2);
  totals.currentCartGrandTotal = +totals.currentCartGrandTotal.toFixed(2);
  return totals;
}

interface ModifierGroups {
  [key: string]: { [key: string]: ModifierOption };
}
/**
 *
 * @param modifiers
 * @returns
 * Gets the total price of modifiers for a single item in the client-side formatting
 */
export function getModifiersTotal(modifiers: ModifierGroups) {

  if (!modifiers) { return 0}

  return Object.values(modifiers).reduce((acc, modGroup) => {
    return (
      acc +
      Object.values(modGroup).reduce((acc, mod) => {
        return acc + mod.price * mod.quantity;
      }, 0)
    );
  }, 0);
}
/**
 *
 * @param carts
 * @param location
 * Filters carts by search results so that only carts for given search results are shown. This is done
 * so that carts display correctly for brands.
 */
export function filterCartsBySearchResults(
  carts: Carts,
  searchResults: SearchResults[],
  orderType: string
) {
  const brands = new Set();
  for (const loc of searchResults) {
    for (const brand of loc.brands) {
      brands.add(brand.id);
    }
  }
  const filtered: Carts = {};
  for (const brandId of Array.from(brands)) {
    const current = carts[brandId as string];
    if (current) {
      filtered[brandId as string] =
        orderType === 'delivery'
          ? current
          : current.filter((item) => !item.isAlcoholic);
    }
  }
  return filtered;
}
/**
 *
 * @param carts
 * @param location
 * @param newBrandId
 * @returns
 * A function that checks if the carts object has multiple brands added for the current location
 */
export function crossBrandCheck(
  carts: Carts,
  searchResults: SearchResults,
  newBrandId: string,
  orderType: string
) {
  const filtered = filterCartsBySearchResults(
    carts,
    [searchResults],
    orderType
  );
  return Object.keys(filtered).length && !filtered[newBrandId] ? true : false;
}
/**
 * Matches skus to quantities. For use displaying total counts of a particular item on menu pages
 */
export function mapSkuToQuantity(
  currentBrand: Brand,
  carts: Carts,
  quantities: Quantities
) {
  const quantityMap: { [key: string]: number } = {};
  carts[currentBrand?.id]?.forEach((item) => {
    if (item.cartId) {
      quantityMap[item.guid] = quantityMap[item.guid]
        ? quantityMap[item.guid] + quantities[item.cartId]
        : quantities[item.cartId];
    }
  });
  return quantityMap;
}
/**
 *
 * @param carts
 * @param quantities
 * Counts the total number of items added to all carts
 */
export const countCartItems = (carts: Carts, quantities: Quantities) =>
  Object.values(carts).reduce(
    (acc, cart) =>
      acc + cart.reduce((acc, item) => acc + quantities[item.cartId!], 0),
    0
  );
