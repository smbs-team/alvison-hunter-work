import {
  MenuItem as MenuItemInterface,
  Brand,
  SkuToQuantity,
  Store,
} from '../../interfaces';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { flattenStore, willBrandBeOpen } from '../../utils';
import LazyLoad from 'react-lazyload';
import {AddToCartSmart} from "../Product/AddToCartSmart/AddToCartSmart";
import ProductDetails from '../Product/ProductDetails/ProductDetails';

export interface MenuItemProps {
  item: MenuItemInterface;
  brand: Brand;
  menuType?: string;
  skuMap: SkuToQuantity;
}

/**
 *
 * A component for a single menu item that can be expanded into a modal allowing
 * item customization by clicking on it.
 */
export const MenuProductItem = ({ item, brand, menuType, skuMap }: MenuItemProps) => {

  const { searchResults, user, selectedAddress, orderType, deliveryTime } = 
    useSelector((store: Store) => flattenStore(store));

  const [expanded, toggleExpanded] = useState(false);

  const [imageError, setImageError] = useState(item.image ? false : true);

  const PRICE_ZERO = 0.00;


  useEffect(() => {
    if (expanded) {
      let address = brand.location?.address;
      if (orderType === 'delivery') {
        address = `${selectedAddress?.line1} ${selectedAddress?.line2}, ${selectedAddress?.city}, ${selectedAddress?.state} ${selectedAddress?.zip}, ${selectedAddress?.country}`;
        if (!selectedAddress?.line2) {
          address = `${selectedAddress?.line1}, ${selectedAddress?.city}, ${selectedAddress?.state} ${selectedAddress?.zip}, ${selectedAddress?.country}`;
        }
      }
      let user_id = user?.id;
      if (user?.id === undefined) {
        user_id = 'anonymous';
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ ecommerce: null });
      window.dataLayer.push({
        event: 'view_item',
        date: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
        user_id: user_id,
        vessel: brand.location?.name,
        ecommerce: {
          affiliation: orderType,
          currency: brand.location?.currency || 'USD',
          address: address,
          items: [
            {
              item_id: item.guid,
              item_name: item.name,
              // item_category: , //still not well setup yet
              item_list_id: brand.id,
              item_list_name: brand.name,
              item_list_dir: brand.location?.address,
              // item_additions: , //probs unnecessary
              price: item.price,
            },
          ],
        },
      });
      window.dataLayer.push({
        event: 'virtual_pageview',
        page_title: `brand:${brand.name}:${item.name}`,
        page_url: window.location.pathname,
      });
    }
  }, [
    expanded,
    toggleExpanded,
    item,
    menuType,
    brand,
    searchResults,
    orderType,
    selectedAddress,
    user,
  ]);


  const pathName = item.image && new URL(item.image).pathname;

  const showOpen = brand.isOpen || willBrandBeOpen(brand, deliveryTime); 
  //! render
  return (
    <div className={`menu-item`}>


      {/*  Retail (Lightspeed) brand product  */}
      {menuType === 'retail' && <div className="item-content flex flex-col h-full">

        {/* Add to Cart Smart Component */}
        <AddToCartSmart item={item} brand={brand} menuType={menuType} skuMap={skuMap} guid={item.guid}/>


        {/* Image */}
        <div>
          <LazyLoad
              offset={600}
          >
            {!imageError ? (
                <div
                    className={`item-image ${showOpen ? '' : 'closed'}`}
                    onClick={() => toggleExpanded(!expanded)}
                >
                  <img
                      src={`https://ik.imagekit.io/getreef/orderlordlogos/${pathName}?tr=w-300`}
                      title={item.name || ''}
                      alt={item.name || ''}
                      onError={(e) => {
                        setImageError(true)
                      }}
                  />
                </div>
            ) : (
                <div
                    onClick={() => toggleExpanded(!expanded)}
                    className={`${
                        menuType !== 'retail'
                            ? 'no-image-height'
                            : 'retail-broken-image'
                    }`}
                />
            )}
          </LazyLoad>
        </div>

        {/* add 'closed' class or not */}
        <div className={`flex-grow ${showOpen ? '' : ' closed'}`}>

          <div className="item-text flex flex-col h-full" onClick={() => toggleExpanded(!expanded)}>

            {/* Name */}
            <div className="item-name mb-2 mt-3">{item.name}</div>


            {/* Price */}
            <div className=
            {`${item.price > PRICE_ZERO ? 'item-price type s13 flex flex-grow items-end' : 'hidden'}`}
            >${item.price.toFixed(2)}</div>
            
          </div>
        </div>
      </div>
      }

      {/* Open the 'Product Detail' Side Drawer */}
        <ProductDetails
          menuType={menuType}
          isOpen={expanded}
          brand={brand}
          brandIsOpen={showOpen}
          product={item}
          handleClose={() => toggleExpanded(false)}
        />
    </div>
  );
};
