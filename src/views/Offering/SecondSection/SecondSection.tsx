import { FC } from "react";
import { Typography, Button } from "@material-ui/core";
import * as rawActions from "../../../store/actions";
import { ReactComponent as BagIcon } from "../../../assets/icons/bag_in_motion.svg";
import { useActions } from "../../../hooks";
import { TABS } from "../../../constants/KEYS";
import { useHistory } from "react-router";
import { Brand } from "../../../interfaces";
import BrandTile from "../../Brands/BrandTile/BrandTile";

interface ISecondSection {
  brands?: Brand[];
}

const SecondSection: FC<ISecondSection> = ({ brands }) => {
  const { selectTab } = useActions(rawActions);
  const history = useHistory();
  return (
    <section>
      <div className="md:grid md:grid-cols-12 mb-2 md:mb-4 p-4 md:p-0">
        <div className="mb-2 sm:mb-3 md:col-start-1 md:col-end-5">
          <div className="flex justify-start items-center ">
            <BagIcon className="text-black mr-1" />
            <Typography variant="h4" className="font-bold">
              Restaurants
            </Typography>
          </div>

          <Button
            variant="text"
            className="see-all-bttn"
            onClick={() => {
              selectTab(TABS.STANDARD_DELIVERY);
              history.push("/location");
            }}
          >
            See all
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 md:col-start-5 md:col-end-13">
          {brands?.map((brand, idx) => (
            <BrandTile key={idx} brand={brand as Brand} />
          ))}
        </div>
      </div>

      {/*//? Blocked by the backend */}
      {/* <div className=" text-white relative md:grid md:grid-cols-12 mb-4 md:mb-8">
          <div className="new-restaurant col-start-5 col-end-13 p-2 sm:p-4">
            <Typography variant="subtitle2" className="uppercase mb-1">
              new restaurant
            </Typography>
            <Typography
              variant="h3"
              className="-sm:text-3xl -md:text-4xl mb-1 md:mb-2"
            >
              Cripy Rice
            </Typography>
            <Typography variant="h6" className="mb-5">
              Lorem ipsum dior noar boad. <br /> Lorem ipsum dior noar boad.{" "}
              <br />
              Lorem ipsum dior noar boad.
            </Typography>
            <Button
              variant="text"
              className="text-white px-0"
              endIcon={<ArrowRight />}
            >
              Try it now
            </Button>
          </div>
        </div> */}
    </section>
  );
};

export default SecondSection;
