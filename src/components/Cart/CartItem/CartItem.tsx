import { Brand, MenuItem, Quantities, Store } from "../../../interfaces";
import { getModifiersTotal, flattenStore } from "../../../utils";
import { useState } from "react";
import { Modal, ItemExpansion } from "../..";
import { useSelector } from "react-redux";
import { useActions } from "../../../hooks";
import * as rawActions from "../../../store/actions";
import "./cart-item.scss";

export interface CartItemProps {
  item: MenuItem;
  quantities: Quantities;
  brand: Brand;
  checkout: boolean;
}
/**
 *
 * Component for displaying an item in a cart that can be expanded to edit an item that
 * is in a user's cart
 */
export const CartItem = ({
  item,
  quantities,
  brand,
  checkout,
}: CartItemProps) => {
  const { user, orderType, selectedAddress } = useSelector((store: Store) =>
    flattenStore(store)
  );
  const { updateItem, removeFromCart } = useActions(rawActions);
  const [expanded, toggleExpanded] = useState(false);
  const totalPrice =
    (item.price + (item ? getModifiersTotal(item.modifiers!) : 0)) *
    quantities[item.cartId!];
  return (
    <div className="border-0 border-b border-solid border-grey_line font-grotesque pb-3 pt-3">
      <div className="space-bt">
        <div className="flex mr-2_5">
          <div
            className={`font-bold mr-2 font-sofia ${
              checkout ? "text-sm" : "text-lg"
            }`}
          >
            x{quantities[item.cartId!]}
          </div>
          <div>
            <div
              className={`font-bold mb_3 font-sofia ${
                checkout ? "text-sm" : "text-lg"
              }`}
            >
              {item.name}
            </div>
            <div className="desktop  mb-1 text-grey_desc text-sm ">
              {item.description?.length > 45
                ? `${item.description.replace(/^(.{45}[^\s]*).*/, "$1")}...`
                : item.description}
            </div>
            <div className="mobile  mb-1 text-grey_desc text-sm  ">
              {item.description?.length > 18
                ? `${item.description.replace(/^(.{18}[^\s]*).*/, "$1")}...`
                : item.description}
            </div>
            <div>
              {!checkout && (
                <button
                  className="mr-3 underline  text-sm  cursor-pointer p-0 border-0 bg-transparent"
                  onClick={() => toggleExpanded(true)}
                >
                  Edit
                </button>
              )}
              <button
                className="underline text-sm  cursor-pointer  p-0 border-0 bg-transparent"
                onClick={() =>
                  removeFromCart(brand, item, user, selectedAddress, orderType)
                }
              >
                Remove
              </button>
            </div>
          </div>
        </div>
        <div
          className={`font-bold font-sofia ${checkout ? "text-sm" : "text-lg"}`}
        >
          ${totalPrice.toFixed(2)}
        </div>
      </div>
      {expanded && (
        <Modal
          type={"menu-item-modal"}
          modalClass="hang-right"
          isChildModal={true}
          hideClose={true}
          onClose={() => {
            toggleExpanded(false);
          }}
          content={
            <ItemExpansion
              item={item}
              brand={brand}
              completeFunction={(brandId, item, quantity) => {
                quantity > 0
                  ? updateItem(brandId, item, quantity)
                  : removeFromCart(
                      brand,
                      item,
                      user,
                      selectedAddress,
                      orderType
                    );
              }}
              initialQuantity={quantities[item.cartId!]}
              buttonText={"Update Item"}
              onClose={() => {
                toggleExpanded(false);
              }}
            />
          }
        />
      )}
    </div>
  );
};
