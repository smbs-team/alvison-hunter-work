import React, { FC } from "react";
import { Drawer } from "@material-ui/core";
import { ItemExpansion } from "../../ItemExpansion/ItemExpansion";
import { Button } from "../../index";
import * as rawActions from "../../../store/actions";
import { useHistory } from "react-router";
import { Brand, MenuItem, Store } from "../../../interfaces";
import { crossBrandCheck, flattenStore } from "../../../utils";
import { useSelector } from "react-redux";
import { useActions } from "../../../hooks";

interface IProductDetails {
  menuType?: string;
  isOpen: boolean;
  handleClose: () => void;
  product: MenuItem;
  brand: Brand;
  brandIsOpen: boolean;
}

const ProductDetails: FC<IProductDetails> = ({
  isOpen,
  handleClose,
  menuType,
  brand,
  brandIsOpen,
  product,
}) => {
  const history = useHistory();
  const { searchResults, carts, user, selectedAddress, orderType } =
    useSelector((store: Store) => flattenStore(store));
  const crossingBrands =
    searchResults && crossBrandCheck(carts, searchResults, brand.id, orderType);
  const { addToCart, toggleModal, clearCarts } = useActions(rawActions);

  const _crossBrandBlock = () => {
    toggleModal(
      true,
      "Looks like you’re hungry. You have items from another restaurant already in your cart. Would you like to remove those to continue with your order?",
      "Empty Cart",
      <Button
        btnClass={"small"}
        content={"Empty Cart"}
        clickFunc={() => {
          clearCarts(
            searchResults ? searchResults.brands.map((br) => br.id) : undefined
          );
          handleClose();
        }}
      />
    );
  };

  return (
    <Drawer open={isOpen} anchor="right" onClose={handleClose}>
      <ItemExpansion
        item={product}
        completeFunction={(
          brandId: string,
          item: MenuItem,
          quantity: number
        ) => {
          if (crossingBrands) {
            _crossBrandBlock();
          } else {
            addToCart(
              item,
              quantity,
              user,
              selectedAddress,
              orderType,
              brand,
              menuType === "retail"
            );
          }
        }}
        brand={brand}
        buttonText={brandIsOpen ? "Add to cart" : "Brand Closed"}
        btnDisabled={!brandIsOpen}
        onClose={handleClose}
      />
    </Drawer>
  );
};

export default ProductDetails;
