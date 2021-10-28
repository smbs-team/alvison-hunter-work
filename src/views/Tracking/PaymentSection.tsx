import { Typography } from "@material-ui/core";
import { MasterCardIcon, VisaIcon, AmexIcon, DiscoverIcon, Wallet2Icon } from "../../assets/icons";
import { CARDS } from "../../constants/KEYS";

export interface IPaymentSection {
    label: string;
    cardBrand: string;
    fundingType: string;
    lastFourDigits: string;
}

/**
 *
 * Component for payment section of a tracking page. 
 */
export const PaymentSection = ({ label, cardBrand, fundingType, lastFourDigits }: IPaymentSection) => {
    return (
        <>
            <Typography className="font-bold font-sofia mt-3" variant="h5">{label}</Typography>
            <div className="background flex items-center border border-solid border-grey_line mt-1 sm:mt-2 p-2">
                {(() => {
                    switch (cardBrand) {
                        case CARDS.MASTER_CARD:
                            return <MasterCardIcon className="iconMargin" />;
                        case CARDS.VISA:
                            return <VisaIcon className="iconMargin" />;
                        case CARDS.AMEX:
                            return <AmexIcon className="iconMargin" />;
                        case CARDS.DISCOVER:
                            return <DiscoverIcon className="iconMargin" />;
                        default:
                            return <Wallet2Icon className="iconMargin" />;
                    }
                })()}

                <div>
                    <Typography className="font-bold text-base font-sofia capitalize" component="div">{cardBrand}{' '}
                        <Typography className="font-bold text-base font-sofia capitalize" component="span">{fundingType}</Typography>
                    </Typography>
                    <Typography className="grayTextColor text-sm font-sofia capitalize" component="div">{fundingType} ****{lastFourDigits}</Typography>
                </div>
            </div>
        </>
    );
};
