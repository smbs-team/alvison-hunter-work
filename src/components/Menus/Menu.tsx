import { Menu as MenuInterface, Brand, Store } from "../../interfaces";
import { useState, createRef, useRef, useMemo } from "react";
import { MenuProductGroup } from "../index";
import { useSelector } from "react-redux";
import {
  flattenStore,
  mapSkuToQuantity,
  handleCategorySelectorMouseDown,
} from "../../utils";
import { Link, Element } from "react-scroll";
import "./menu.scss";
import { Divider } from "@material-ui/core";

export interface MenuProps {
  menu: MenuInterface;
  brand: Brand;
  menuType?: string;
}
interface KeyObj {
  [key: string]: any;
}

/**
 *
 * A component that shows the menu for a single brand. It renders the menu groups
 * provided by that brand's menu object.
 */
export const Menu = ({ menu, brand, menuType }: MenuProps) => {
  const { carts, quantities, unavailableItems, orderType } = useSelector(
    (store: Store) => flattenStore(store)
  );
  const quantityMap = mapSkuToQuantity(brand, carts, quantities);

  const unavailableSet = useMemo(
    () => new Set(unavailableItems.map((item) => item.id.toString())),
    [unavailableItems]
  );

  const excludedGroups = useMemo(
    () =>
      menu.menuGroups.reduce<string[]>((acc, group) => {
        const filteredItems = group.menuItems
          .filter((item) => {
            return !unavailableSet.has(item.guid.toString());
          })
          .filter(
            (item) =>
              (menuType === "retail" && item.image) || menuType !== "retail"
          )
          .filter(
            (item) =>
              (item.isAlcoholic && orderType === "delivery") ||
              !item.isAlcoholic
          );
        if (!filteredItems.length) {
          return acc.concat([group.name]);
        }
        return acc;
      }, []),
    [menu, unavailableSet, orderType, menuType]
  );

  const filteredMenuGroups = useMemo(
    () =>
      menu.menuGroups.filter((group) => !excludedGroups.includes(group.name)),
    [menu, excludedGroups]
  );

  const [selectorRefs] = useState(
    filteredMenuGroups.reduce<KeyObj>((acc, group) => {
      return { ...acc, [group.name]: createRef<HTMLDivElement>() };
    }, {})
  );

  const catSelectorRef = useRef<HTMLDivElement>(null);

  const [selectedCategory, selectCategory] = useState(
    filteredMenuGroups[0]?.name
  );

  function handleSetActive(groupName: string) {
    selectCategory(groupName);
    if (catSelectorRef.current) {
      catSelectorRef.current.scrollTo(
        selectorRefs[groupName].current.offsetLeft,
        0
      );
    }
  }

  //! render
  return (
    <div className="horiz-center">
      <div className={`menu-component ${menuType}`}>
        <div>
          <div
            className="category-selector"
            onMouseDown={handleCategorySelectorMouseDown}
            ref={catSelectorRef}
          >
            <div className="inner">
              {filteredMenuGroups.map((group, idx) => {
                return (
                  <div className="cat-holder" key={idx}>
                    <div
                      className={`category-item type s16 ${
                        group.name === selectedCategory ? "selected" : ""
                      } `}
                      ref={selectorRefs[group.name]}
                    >
                      <Link
                        activeClass="active"
                        to={group.name}
                        isDynamic={true}
                        spy={true}
                        smooth={true}
                        offset={-80}
                        duration={50}
                        onClick={() => {
                          if (selectedCategory === group.name) {
                            handleSetActive(group.name);
                          }
                        }}
                        onSetActive={(groupName) => {
                          // We only want this behavior to occur when scrolling because if
                          // the link has simply been clicked this function will have been
                          // called above with the onClick handler.
                          if (selectedCategory !== groupName) {
                            handleSetActive(groupName);
                          }
                        }}
                      >
                        {group.name}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Divider className="mt-2 mb-4 sm:mb-8" />
          <div className="group-holder">
            {filteredMenuGroups.map((group, idx) => {
              return (
                <Element name={group.name} className="element" key={idx}>
                  <MenuProductGroup
                    skuMap={quantityMap}
                    menuType={menuType}
                    group={group}
                    brand={brand}
                  />
                </Element>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
