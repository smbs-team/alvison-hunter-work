import { Divider, Typography } from '@material-ui/core';
import {
    PhoneIcon,
    HouseIcon,
    LocationIcon
} from '../../assets/icons';
import './tracking.scss';

export interface IDeliveryLocationSection {
    label: string;
    address: string;
    orderType: string;
    deliveryNotes?: string;
    phoneNumber?: string;
}

/**
 *
 * Component for delivery location section of a tracking page. 
 */
export const DeliveryLocationSection = ({ label, address, deliveryNotes, phoneNumber, orderType }: IDeliveryLocationSection) => {

    /* This function use a regular expression to format phone number */
    function formatPhoneNumber(phoneNumber: string) {
        var cleaned = ('' + phoneNumber).replace(/\D/g, '');
        var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            var intlCode = (match[1] ? '+1 ' : '');
            return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
        }
        return null;
    }

    return (
        <>
            <Typography className="font-bold font-sofia mt-3" variant="h5">{label}</Typography>
            <div className="background border border-solid border-grey_line mt-1 sm:mt-2 p-2">
                {deliveryNotes ? (
                    <>
                        <Typography className="address flex items-center font-bold text-base">
                            {orderType === 'takeaway' ? <LocationIcon className="iconMargin" /> : <HouseIcon className="iconMargin" />}{address}
                        </Typography>
                        <Divider />
                        <Typography className="grayTextColor pt-2 font-sofia text-sm ">“{deliveryNotes}”</Typography>
                    </>
                ) : (
                    <Typography className="flex items-center font-bold text-base">
                        <HouseIcon className="iconMargin" />{address}
                    </Typography>
                )}
            </div>
            <div className="background border border-solid border-grey_line mt-2 p-1_5">
                <Typography className="flex items-center font-bold font-sofia text-base">
                    <PhoneIcon className="iconMargin" />{formatPhoneNumber(phoneNumber!!)}
                </Typography>
            </div>
        </>
    );
};
