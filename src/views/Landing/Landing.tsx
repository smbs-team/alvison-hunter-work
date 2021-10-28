import { Address, Store } from "../../interfaces";
import { useHistory, useLocation } from "react-router-dom";
import { Footer, SearchAddress } from "../../components";
import { Discounts } from "../../components/Discounts/Discounts";
import { WelcomeToReef } from "../../components/Welcome2Reef/Welcome2Reef";
import { useEffect } from "react";
import { useActions } from "../../hooks";
import { useSelector } from "react-redux";
import { flattenStore, getSubdomain } from "../../utils";
import * as rawActions from "../../store/actions";
import "./landing.scss";
import { Jumbotron } from "../../components/Layout/Jumbotron/Jumbotron";
import { InstagramFeed } from './InstagramFeed/InstagramFeed';
import { MiamiFavorites } from "./MiamiFavorites/MiamiFavorites";
import { WorkWithReef } from "./WorkWithReef/WorkWithReef";
import { SimpleValueProposition } from "./SimpleValueProposition/SimpleValueProposition";
import { useConfigcatText } from "../../hooks";
import LocationOnIcon from "@material-ui/icons/LocationOn";

/** This component contains the button types conditional rendering for desktops and mobile respectively. */
/**
const SearchBarButton = ()=>{
	return(<div className="flex">
		<div>
		<button className="ml-1 search-btn text-xs md:text-lg font-bold w-5/12 h-8">Get Started</button>
		</div>
		<div className="rounded-search-btn border-2 block md:hidden h-4 w-4 p-2">
			<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</div>
		</div>)
}
 */

/**
 * A component for the splash screen view.
 */
export const Landing = () => {
    const { selectedAddress } = useSelector((store: Store) =>
        flattenStore(store)
    );
    const { locationSearch, selectAddress, setOrderType } =
        useActions(rawActions);
    const history = useHistory();
    const routerLocation = useLocation();
    
    useEffect(() => {
        if (selectedAddress) {
            history.push(`/offering${routerLocation.search}`);
        }
    }, [selectedAddress, history, routerLocation]);

    useEffect(() => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "virtual_pageview",
            page_title: "home",
            page_url: window.location.pathname,
        });
    }, []);

    /** Object containing information about 40% OFF top jumbotron */
    const customTopJumbotronContent = {
        leftColCssRules: "jumbotron-giant-text-custom text-left lg:w-8/12",
        rightColCssRules: "bg-brown-color",
        wrapperBgColor: "bg-green-200",
		strJumboText: "40% OFF",
		gridColumns: "grid-cols-1 lg:grid-cols-2",
        childComp: <Discounts />,
    };

    /** Object containing information about the stop waiting start eating section */
    const customBottomJumbotronContent = {
        leftColCssRules: "jumbotron-giant-text bg-transparent lg:w-8/12",
        rightColCssRules: "bg-transparent",
		wrapperBgColor: "bg-gray-100",
		gridColumns: "grid-cols-1 md:grid-cols-2",
        strJumboText: "STOP WAITING START EATING.",
        childComp: <WelcomeToReef />,
    };
     
	return (
		<div className="home">
			<div className="top-image brownc-bg overflow-hidden">
				<div className="hero-center">
					<div className="hero mt-1" />
				</div>
			</div>
			<div className="horiz-center top-content xl:ml-8">
				<div className="inner-top md:ml-2">
					<div>
						<div className="hero-text my-2">
							<div className="whitespace-pre-wrap looking-for">
								{useConfigcatText("heroTitle", "LIVE\nFEE-LESSLY")}
							</div>
							<div className="whitespace-pre-wrap looking-for-sub text-white my-2">
								{useConfigcatText("heroSubheading", `${getSubdomain() === 'wework' ? 'Get fee-less delivery in minutes.\nBreakfast, lunch, and all the other snacks and essentials you need to work well – delivered straight to WeWork.': 'Food in 30 minutes or less. Snacks in 10 minutes or less.'}`)}
							</div>
						</div>
						<div className="top-bar-search bg-white h-8 flex flex-row items-center">
							<div className="w-1/12">
								<span className="ml-1 items-center block">
									<LocationOnIcon />
								</span>
							</div>
							<div className="w-11/12 md:w-full pr-2 flex flex-row items-center">
								<SearchAddress 
									selectNew
									onComplete={async (address: Address) => {
										await selectAddress(address);
										// If someone is searching from the Landing, now that the
										// orderType tab is gone, the orderType needs to default to
										// delivery.
										await setOrderType("delivery");
										locationSearch(address, "delivery", history);
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div>
				<div>
					{/* Simple Value Proposition */}
					<SimpleValueProposition />

                    {/* Miami Favorites */}
                    <MiamiFavorites />

                    {/* 40% OFF Section */}
                    <Jumbotron {...customTopJumbotronContent} />

                    {/* Instagram Feed */}
                    <InstagramFeed />

                    {/* Work With Reef */}
                    <WorkWithReef />

                    {/* Stop waiting Start Eating Section */}
                    <Jumbotron {...customBottomJumbotronContent} />
                </div>
            </div>
            <Footer />
        </div>
    );
};