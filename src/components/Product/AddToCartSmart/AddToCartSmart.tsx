import {Brand, MenuItem as MenuItemInterface, SkuToQuantity, Store} from "../../../interfaces";
import {PlusIcon} from "../../../assets/icons";
import RemoveTwoToneIcon from '@material-ui/icons/RemoveTwoTone';

import "./add-to-cart-smart.scss"
import {useSelector} from "react-redux";
import {crossBrandCheck, flattenStore} from "../../../utils";
import {useActions} from "../../../hooks";
import * as rawActions from "../../../store/actions";
import {Button} from "../../UI/Button";
import {useEffect, useState} from "react";



export interface IAddToCartSmart {
  item: MenuItemInterface;
  brand: Brand;
  menuType?: string;
  skuMap: SkuToQuantity,
  guid: string | number
}


/**
 * ?A component that allow add/remove an item to the cart, it change his layout and shows something like the (-) quantity (+)
 */
export const AddToCartSmart = ({item, brand, menuType, skuMap, guid}: IAddToCartSmart ) =>  {


const [isExpanded, setIsExpanded] = useState(false);

const [hideExpandedTimeoutResetFlag, setHideExpandedTimeoutResetFlag] = useState(false);

  const { searchResults, carts, quantities, user, selectedAddress, orderType } =
      useSelector((store: Store) => flattenStore(store));

  const { addToCart, updateItem, removeFromCart, clearCarts, toggleModal } = useActions(rawActions);

  const crossingBrands =  searchResults && crossBrandCheck(carts, searchResults, brand.id, orderType);


  //! Empty cart modal
  const _crossBrandBlock = () => {

    //! toggle Cross Brand modal
    toggleModal(
        true,
        'Looks like you’re hungry. You have items from another restaurant already in your cart. Would you like to remove those to continue with your order?',
        'Empty Cart',
        <Button
            btnClass={'small'}
            content={'Empty Cart'}
            clickFunc={() => {
              clearCarts(
                  searchResults ? searchResults.brands.map((br) => br.id) : undefined
              );
              toggleModal(false);
            }}
        />
    );
  };


  //! add to cart function
  function addToCartFunction() {

      if (crossingBrands) {
        _crossBrandBlock();
      } else {

        const inCartItem : MenuItemInterface | undefined  = carts[brand.id] && carts[brand.id].find((cartItem) => cartItem.guid === item.guid);

        addToCart(
            {...item, modifiers: {}},
            inCartItem ? quantities[inCartItem.cartId!] + 1 : 1,
            user,
            selectedAddress,
            orderType,
            brand,
            menuType === 'retail'
        );
    }

  }


  //! remove from cart function
  function removeFromCartFunction() {

      if (crossingBrands) {
          _crossBrandBlock();
      } else {

          //if there are already 0 elements, do nothing
          if (!skuMap[guid]) {
              return '';
          }

          //get the "item" that already has the "cartId" property included (it will be need it in the reducer).
          //Note:  according Alex Leigh, this approach will not work on the regular brands because "There can be multiple instances of an item in the restaurant cart with the same GUID"
          const inCartItem: MenuItemInterface | undefined  = carts[brand.id] && carts[brand.id].find((cartItem) => cartItem.guid === item.guid);


          skuMap[guid] > 1
              ? updateItem(brand.id, inCartItem, skuMap[guid] - 1)
              //if there is only 1, remove the object from cart
              : removeFromCart(
                  brand,
                  inCartItem,
                  user,
                  selectedAddress,
                  orderType
              );

      }
  }


    //? timeout to auto hide the expanded layout. Also with every click on (+) or (-) the timeout is reset.
    useEffect(() => {

        let timer: any = 0;

        if (isExpanded) {
            timer = setTimeout(() => {
                setIsExpanded(false);
            }, 3500);

        }

        return () => clearTimeout(timer); //it is executed every time the dependency list changes, cleaning the timeout.

    }, [hideExpandedTimeoutResetFlag, isExpanded]);


  //! render
  return <div className={`add-to-cart-smart ${isExpanded && 'isExpanded'}`} >

    {/* Default (+) button */}
    {!isExpanded && !skuMap[guid] && < PlusIcon onClick={() => {setIsExpanded(true); addToCartFunction()}} />}

    {/* Number of Items in cart button */}
    {!isExpanded && skuMap[guid] && (<div className="item-count"  onClick={() => {setIsExpanded(true);}} >  {skuMap[guid]}  </div>)}

    {/* Expanded (+) x (-) layout */}
    {isExpanded && (
        <div className="expanded">

            <RemoveTwoToneIcon onClick={() => {removeFromCartFunction(); setHideExpandedTimeoutResetFlag(!hideExpandedTimeoutResetFlag);}} classes={{root: 'remove-icon'}} />

                <p className="item-count-expanded" > {skuMap[guid] || 0} </p>

            <PlusIcon onClick={() => {addToCartFunction(); setHideExpandedTimeoutResetFlag(!hideExpandedTimeoutResetFlag)}} />

        </div>
    )}


  </div>;
}
