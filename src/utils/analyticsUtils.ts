import { User, Promo, Card } from '../interfaces';
/**
 * This function should handle all of the necessary analytics in the placeOrder function.
 * @param param0
 */
export function handlePlaceOrderAnalytics({
  transformed,
  locationObj,
  orderId,
  user,
  promo,
  selectedCard,
}: {
  transformed: { [key: string]: any };
  locationObj: any;
  orderId: string;
  user: User;
  promo?: Promo | null;
  selectedCard?: Card;
}) {
  const ecomItems = [];
  const products = [];
  const transObj = Object.values(transformed)[0];
  const ecomAddress =
    transObj.type === 'delivery'
      ? `${transObj.address.line1} ${transObj.address.line2}, ${transObj.address.city}, ${transObj.address.state} ${transObj.address.zip} ${transObj.address.country}`
      : locationObj.address;
  for (let i = 0; i < transObj.products.length; i++) {
    let additionsPrice = 0;
    const additions = [];
    for (let j = 0; j < transObj.products[i].additions.length; j++) {
      const addition = {
        name: transObj.products[i].additions[j].name,
        price: transObj.products[i].additions[j].price,
      };
      additions.push(addition);
      additionsPrice += transObj.products[i].additions[j].price;
    }
    const ecomItem = {
      item_list_id: Object.values(transformed).find((item) => item.brandId)
        .brandId,
      item_list_name: Object.values(transformed).find((item) => item.brandName)
        .brandName,
      item_list_dir: locationObj.address,
      item_name: transObj.products[i].name,
      item_id: transObj.products[i].orderingSystemId,
      item_price: transObj.products[i].priceUnit,
      price: Number(
        (transObj.products[i].priceUnit + additionsPrice).toFixed(2)
      ),
      quantity: transObj.products[i].quantity,
      item_additions: additions,
      item_additions_price: additionsPrice,
    };
    ecomItems.push(ecomItem);
    const product = {
      product_id: transObj.products[i].orderingSystemId,
      sku: transObj.products[i].orderingSystemId,
      name: transObj.products[i].name,
      price: Number(
        (transObj.products[i].priceUnit + additionsPrice).toFixed(2)
      ),
      quantity: transObj.products[i].quantity,
    };
    products.push(product);
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: 'purchase',
    date: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
    userId: transObj.user.id,
    vessel: locationObj.name,
    ecommerce: {
      affiliation: transObj.type,
      currency: locationObj.currency || 'USD',
      address: ecomAddress,
      items: ecomItems,
      sub_total: Number(transObj.price.subTotal.toFixed(2)),
      tip_percent: (transObj.price.tips / transObj.price.subTotal) * 100,
      tip: Number(transObj.price.tips.toFixed(2)),
      tax: Number(transObj.price.taxAmount.toFixed(2)),
      delivery_fee: Number(transObj.price.deliveryFee.toFixed(2)),
      discount: Number(transObj.price.discountTotal.toFixed(2)),
      grand_total: Number(transObj.price.actualGrandTotal.toFixed(2)),
      value: Number(
        (
          transObj.price.subTotal -
          transObj.price.discountTotal -
          transObj.price.tips
        ).toFixed(2)
      ),
      transaction_id: orderId,
    },
  });
  //send user data and order data to segment for receipt
  window.analytics.track('Order Completed', {
    order_id: orderId,
    affiliation: Object.values(transformed).find((item) => item.brandName)
      .brandName,
    total: Number(transObj.price.actualGrandTotal.toFixed(2)),
    subtotal: Number(transObj.price.subTotal.toFixed(2)),
    revenue: Number(
      (
        transObj.price.subTotal -
        transObj.price.discountTotal -
        transObj.price.tips
      ).toFixed(2)
    ),
    shipping: Number(transObj.price.deliveryFee.toFixed(2)),
    tax: Number(transObj.price.taxAmount.toFixed(2)),
    discount: Number(transObj.price.discountTotal.toFixed(2)),
    currency: locationObj.currency || 'USD',
    products: products,
    order_note: transObj.note,
    promo: promo || 'none',
    card_type: selectedCard?.type,
    card_last_four: selectedCard?.last4,
  });
  window.analytics.identify(user?.id, {
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    mailOptIn: user?.marketing,
    smsOptIn: user?.smsOptIn,
    event: 'purchase',
    phone: user?.phone,
  });
}
