import '../../../views/Landing/landing.scss';
import { JumbotronBgColors } from "../../../interfaces";
import React from "react";

export const Jumbotron: React.FC<JumbotronBgColors> = (props) => {
	const { leftColCssRules, childComp, wrapperBgColor, strJumboText, gridColumns } = props;
	return (
		<div className="container">
			<div className={`${wrapperBgColor}`}>
				<div className={`grid ${gridColumns} place-items-center`}>
					<div
						className={`py-4 md:py-4 ${leftColCssRules}`}
					><span className="inline-block align-middle">{strJumboText}</span>
					</div>
					<>{childComp}</>
				</div>
			</div>
		</div>
	);
};
