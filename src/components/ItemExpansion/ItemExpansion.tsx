import { useState, useMemo } from "react";
import {
  MenuItem as MenuItemInterface,
  Brand,
  Store,
  IItemExpansionForm,
} from "../../interfaces";
import { ModifierGroup } from "..";
import { CloseIcon, Minus, Plus } from "../../assets/icons";
import { Button, Divider, Typography } from "@material-ui/core";
import {
  getModifiersTotal,
  getDefaultItemExpansionFormVals,
} from "../../utils";
import { flattenStore } from "../../utils";
import "./item-expansion.scss";
import { useSelector } from "react-redux";

interface IItemExpansionProps {
  item: MenuItemInterface;
  brand?: Brand;
  completeFunction(
    brandId: string,
    item: MenuItemInterface,
    quantity: number
  ): void;
  buttonText: string;
  initialQuantity?: number;
  onClose: () => void;
  btnDisabled?: boolean;
}

export const ItemExpansion = ({
  item,
  brand,
  completeFunction,
  buttonText,
  initialQuantity,
  onClose,
  btnDisabled,
}: IItemExpansionProps) => {
  const { unavailableItems } = useSelector((store: Store) =>
    flattenStore(store)
  );
  const {
    modifiers: itemModifiers,
    price,
    modifierGroupReferences,
    image,
    name,
    description,
  } = item;

  const unavailableSet = useMemo(
    () => new Set(unavailableItems.map((item) => item.id.toString())),
    [unavailableItems]
  );

  const defaults = useMemo(
    () =>
      itemModifiers ??
      getDefaultItemExpansionFormVals(
        modifierGroupReferences,
        brand?.transformedMenu!,
        unavailableSet
      ),
    [modifierGroupReferences, brand, itemModifiers, unavailableSet]
  );

  const [modifiersForm, updateModifiersForm] =
    useState<IItemExpansionForm>(defaults);

  const [_quantity, setQuantity] = useState(initialQuantity || 1);
  const totalPrice = useMemo(
    () =>
      modifiersForm && (price + getModifiersTotal(modifiersForm)) * _quantity,
    [modifiersForm, _quantity, price]
  );

  // This is used to hide the image section of this component if there is an error loading it.
  const pathName = image && new URL(image).pathname;
  const [imageError, setImageError] = useState(image ? false : true);

  const [hasBadGroup, setHasBadGroup] = useState(false);

  const onSubmit = (form: any) => {
    form.preventDefault();
    if (!hasBadGroup) {
      onClose();
      completeFunction(
        brand!.id,
        { ...item, modifiers: modifiersForm },
        _quantity
      );
    }
  };
  return (
    <form
      onSubmit={(e) => onSubmit(e)}
      className="content relative h-full flex flex-col overflow-hidden"
    >
      <div className="flex-1 overflow-y-auto pb-16">
        <div className="flex justify-between items-center p-3">
          <CloseIcon
            className="h-3 w-3 cursor-pointer"
            onClick={() => {
              onClose();
              setImageError(true);
            }}
          />

          <Typography
            variant="h4"
            align="center"
            className="font-bold w-1/2 font-sofia"
          >
            {brand?.name}
          </Typography>

          <div className="w-3 h-3" />
        </div>
        <Divider className="mb-2" />

        <div className="w-full">
          {!imageError && image ? (
            <img
              className="exp-img mb-2"
              src={
                `https://ik.imagekit.io/getreef/orderlordlogos/${pathName}?tr=h-267` ||
                ""
              }
              alt=""
              onError={() => setImageError(true)}
            />
          ) : (
            <div style={{ marginTop: "45px" }} />
          )}
          <div className="mx-3">
            <Typography variant="h4" className="font-bold font-sofia mb-1">
              {name}
            </Typography>

            <Typography variant="body1" className="text-grey_desc mb-3">
              {description}
            </Typography>
          </div>
          <div>
            {defaults &&
              modifierGroupReferences.map((groupNumber, idx) => {
                const group =
                  brand!.transformedMenu?.modifierGroupReferences![groupNumber];
                return (
                  group?.modifierOptionReferences?.length &&
                  brand?.transformedMenu?.modifierOptionReferences && (
                    <ModifierGroup
                      key={idx}
                      updateForm={updateModifiersForm}
                      formVals={modifiersForm}
                      setHasBadGroup={(newVal: boolean) =>
                        setHasBadGroup(newVal)
                      }
                      modifierOptionReferences={
                        brand.transformedMenu.modifierOptionReferences
                      }
                      group={{
                        ...group,
                        modifierOptionReferences:
                          group.modifierOptionReferences.filter(
                            (option) => !unavailableSet.has(option)
                          ),
                      }}
                    />
                  )
                );
              })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 bg-white w-full flex items-center p-2 box-border">
        <div className="stepper-holder space-bt border-solid border-gray-300 text-base py-1_5 px-2 w-24 mr-2">
          <div
            className="stepper flex justify-center flex-col"
            onClick={() => {
              const minQuantity = buttonText === "Update Item" ? 0 : 1;
              setQuantity(
                _quantity === minQuantity ? minQuantity : _quantity - 1
              );
            }}
          >
            <Minus />
          </div>
          {_quantity}
          <div
            className="stepper flex justify-center flex-col"
            onClick={() => setQuantity(_quantity + 1)}
          >
            <Plus />
          </div>
        </div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          className="h-12 text-xl flex-1 font-sofia"
          disabled={btnDisabled}
        >
          {buttonText} <span className="hidden sm:inline">&nbsp;•&nbsp;</span> $
          {totalPrice?.toFixed(2)}
        </Button>
      </div>
    </form>
  );
};
