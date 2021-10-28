import { useConfigcatText } from "../../hooks";
import { getSubdomain } from "../../utils";

export const WelcomeToReef: React.FC = () => {
	return (
		<div
			className="flex flex-col jumbotron-regular-text bg-transparent space-y-2 md:space-y-4 mx-1 w-11/12 items-start md:w-9/12 mb-5 md:mb-4 py-2">
        <div className="flex-grow w-11/12 mx-auto font-normal whitespace-pre-wrap">
        {useConfigcatText("welcomeToReef", 
          `Welcome to REEF, where everything you want, and need, is delivered fast and fresh.\n\nHow fast? ${getSubdomain() === 'wework' ? 'Get your order right on time with scheduled deliveries, up to a week in advance!':'30 minutes for meals and 10 minutes for your snack cravings and essentials.'}\n\nHow fresh? Fries arrive crispy. Ice cream stays icy. And the cheese on your pizza is still melting. From your favorite cravings to what’s new in your neighborhood, REEF offers the best of delivery, in minutes."`)}
        </div>
		</div>
	);
};