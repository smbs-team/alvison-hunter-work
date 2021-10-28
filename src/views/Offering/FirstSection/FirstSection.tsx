import { FC } from "react";
import { Typography, Button } from "@material-ui/core";
import { ReactComponent as ArrowRight } from "../../../assets/icons/arrow_right_2.svg";
import ProductTile from "../../../components/Product/ProductTile/ProductTile";
import vanLeeuwerIceCreamImage from "../../../assets/images/van_leeuwer_ice_cream.png";
import { ReactComponent as BagIcon } from "../../../assets/icons/bag_in_motion.svg";
import { useHistory } from "react-router";
import * as rawActions from "../../../store/actions";
import { useActions } from "../../../hooks";
import { TABS } from "../../../constants/KEYS";
import { Brand, MenuItem, Store } from "../../../interfaces";
import { flattenStore, mapSkuToQuantity } from "../../../utils";
import { useSelector } from "react-redux";
import { Skeleton } from "@material-ui/lab";

interface IFirstSection {
  products: MenuItem[];
  brand: Brand;
}

const FirstSection: FC<IFirstSection> = ({ products, brand }) => {
  const history = useHistory();
  const { carts, quantities, searchLoaded } = useSelector(
    (store: Store) => flattenStore(store)
  );
  const { selectTab } = useActions(rawActions);
  const quantityMap = mapSkuToQuantity(brand, carts, quantities);

  return (
    <section>
      {searchLoaded ? (
        <>
          <div className="p-2 sm:p-4 md:grid md:grid-cols-12">
            <div className="mb-2 sm:mb-3 md:col-start-1 md:col-end-5">
              <div className="flex justify-start items-center ">
                <BagIcon className="text-black mr-1" />
                <Typography variant="h4" className="font-bold">
                  Get it in 10 min
                </Typography>
              </div>

              <Button
                variant="text"
                className="see-all-bttn"
                onClick={() => {
                  selectTab(TABS.FAST_DELIVERY);
                  history.push("/location");
                }}
              >
                See all
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 md:col-start-5 md:col-end-13">
              {products?.map((product, idx) => (
                <ProductTile
                  key={idx}
                  product={product}
                  brand={brand}
                  skuMap={quantityMap}
                />
              ))}
            </div>
          </div>
          <div className=" text-white  relative md:grid md:grid-cols-12 mb-3 md:mb-24">
            <div className="col-start-5 col-end-13 bg-green_bg p-2 sm:p-4">
              <Typography
                variant="h3"
                className="-sm:text-3xl -md:text-4xl mb-1 md:mb-0"
              >
                Want it Fast?
              </Typography>
              <Typography
                variant="h3"
                className="-sm:text-2xl -md:text-4xl mb-2"
              >
                Get Delivery in 10 Minutes!
              </Typography>
              <Typography variant="h6" className="mb-5">
                We'll have any of these items delivered
                <br />
                in 10 minutes or less. Seriously
              </Typography>
              <Button
                variant="text"
                className="text-white px-0"
                endIcon={<ArrowRight />}
                onClick={() => {
                  selectTab(TABS.FAST_DELIVERY);
                  history.push("/location");
                }}
              >
                Try it now
              </Button>
              <img
                className="hidden sm:inline absolute right-0 bottom-0 transform -translate-x-4 md:-translate-x-7 md:scale-110 md:-translate-y-2"
                src={vanLeeuwerIceCreamImage}
                alt=""
              />
            </div>
          </div>
        </>
      ) : (
        <div className="sm:p-4 md:grid md:grid-cols-12">
          <Skeleton className="mt-4" height={40} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 md:col-start-5 md:col-end-13">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} height={200} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default FirstSection;
