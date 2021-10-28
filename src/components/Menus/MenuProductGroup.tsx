import {
  MenuGroup as MenuGroupInterface,
  Brand,
  SkuToQuantity,
  Store,
} from "../../interfaces";
import { Fragment, useMemo } from "react";
import { MenuProductItem } from "../index";
import { flattenStore } from "../../utils";
import { useSelector } from "react-redux";
import { Typography } from "@material-ui/core";
import BrandMenuItem from "../../views/Brand/BrandMenuItem/BrandMenuItem";

export interface MenuGroupProps {
  group: MenuGroupInterface;
  brand: Brand;
  menuType?: string;
  skuMap: SkuToQuantity;
}
/**
 *
 * A component for showing each group in brand's menu. It also requires the brand object.
 * to be passed in.
 */
export const MenuProductGroup = ({
  group,
  brand,
  menuType,
  skuMap,
}: MenuGroupProps) => {
  const { unavailableItems, orderType } = useSelector((store: Store) =>
    flattenStore(store)
  );
  const unavailableIds = unavailableItems.map((item) => item.id.toString());
  const unavailableSet = useMemo(
    () => new Set(unavailableIds),
    [unavailableIds]
  );
  const filtered = useMemo(
    () =>
      group &&
      group.menuItems
        .filter((item) => {
          return !unavailableSet.has(item.guid.toString());
        })
        .filter(
          (item) =>
            (menuType === "retail" && item.image) || menuType !== "retail"
        )
        .filter(
          (item) =>
            (item.isAlcoholic && orderType === "delivery") || !item.isAlcoholic
        ),
    [group, unavailableSet, menuType, orderType]
  );
  return filtered && filtered.length ? (
    <div data-name={group.name} className="menu-group">
      {/*  Retail (Lightspeed) brand menu group  */}
      {menuType === "retail" && (
        <div className="menu-group-retail mt-6 md:grid md:grid-cols-12 ">
          {/* Group name */}
          <div className="group-name font-grotesque type sm bold mt-3 mb-1">
            {group.name}
          </div>

          {/* Products Items  */}
          <div className="menu-items horiz-center">
            {filtered.map((item, idx) => (
              <MenuProductItem
                key={idx}
                item={item}
                brand={brand}
                menuType={menuType}
                skuMap={skuMap}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular brand menu group (not-retail) */}
      {menuType !== "retail" && (
        <div>
          <Typography variant="h4" className="font-bold mb-2">
            {group.name}
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((item, id) => (
              <Fragment key={id}>
                <BrandMenuItem item={item} brand={brand} menuType={menuType} />
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  ) : (
    <span />
  );
};
