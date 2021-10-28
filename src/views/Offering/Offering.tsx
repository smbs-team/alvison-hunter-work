import { FC, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useActions, useLocationSearch } from "../../hooks";
import { Brand, MenuItem, Store } from "../../interfaces";
import { flattenStore } from "../../utils";
import * as rawActions from "../../store/actions";
import { LOCAL_STORAGE_KEYS, TABS } from "../../constants/KEYS";
import "./offering.scss";
import { Footer } from "../../components";
import { WEWORK_FAVORITES } from "../../constants/wework-favorites";
import GroceryHero from "../Grocery/GroceryHero/GroceryHero";
import FirstSection from "./FirstSection/FirstSection";
import SecondSection from "./SecondSection/SecondSection";

const Offering: FC = () => {
  const {
    orderType,
    searchResults,
    searchLoaded,
    selectedAddress,
    unavailableItems,
    selectedTab,
  } = useSelector((store: Store) => flattenStore(store));

  const { locationSearch } = useActions(rawActions);

  const lightSpeedData = searchResults?.brands.find((brand) =>
    brand.name.match(/Light Speed/gi)
  );

  const brandList = searchResults?.brands
    .filter((brand) =>
      selectedTab === TABS.WE_WORK
        ? WEWORK_FAVORITES.has(brand.name)
        : !brand.name.match(/Light Speed/gi)
    )
    .slice(0, 6);

  const menu = lightSpeedData?.transformedMenu!.menus[0];

  useLocationSearch(searchResults, orderType, locationSearch, selectedAddress);

  const unavailableSet = useMemo(
    () => new Set(unavailableItems.map((item) => item.id.toString())),
    [unavailableItems]
  );

  const excludedGroups = useMemo(
    () =>
      menu?.menuGroups?.reduce<string[]>((acc, group) => {
        const productListItems = group.menuItems
          .filter((item) => !unavailableSet.has(item.guid.toString()))
          .filter((item) => !!item.image)
          .filter(
            (item) =>
              (item.isAlcoholic && orderType === "delivery") ||
              !item.isAlcoholic
          );
        if (!productListItems.length) {
          return acc.concat([group.name]);
        }
        return acc;
      }, []),
    [menu, unavailableSet, orderType]
  );

  const lightSpeedProductsList = useMemo(() => {
    return menu?.menuGroups.filter(
      (group) => !excludedGroups?.includes(group.name)
    )[0];
  }, [menu, excludedGroups]);

  const productsList = useMemo(
    () =>
      lightSpeedProductsList?.menuItems
        .slice(0, 8)
        .filter((item) => !unavailableSet.has(item.guid.toString()))
        .filter((item) => !!item.image)
        .filter(
          (item) =>
            (item.isAlcoholic && orderType === "delivery") || !item.isAlcoholic
        ),
    [lightSpeedProductsList, unavailableSet, orderType]
  );

  useEffect(() => {
    if (searchLoaded && !searchResults?.brands.length) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.SAVED_ADDRESS);
    }
  }, [searchLoaded, searchResults]);

  return (
    <div>
      <div className="w-full md:mb-4 ">
        {lightSpeedData ? (
          <GroceryHero currentBrand={lightSpeedData as Brand} />
        ) : (
          <div className="h-64 md:h-96 bg-green_bg "></div>
        )}
      </div>

      <div className="mx-auto max-w-screen-2xl">
        <FirstSection
          products={productsList as MenuItem[]}
          brand={lightSpeedData as Brand}
        />
        <SecondSection brands={brandList} />
      </div>

      <Footer />
    </div>
  );
};

export default Offering;
