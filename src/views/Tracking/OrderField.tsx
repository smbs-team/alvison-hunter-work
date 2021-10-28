import { Typography } from "@material-ui/core";

export interface IOrderField {
    text: string;
    description: string;
}

/**
 *
 * Component for order section of a tracking page. 
 */
export const OrderField = ({ text, description }: IOrderField) => {
    return (
        <>
            <Typography className=" font-bold font-sofia mt-3" component="div" variant="h5">{text}</Typography>
            <Typography className="background border border-solid font-sofia font-bold text-base border-grey_line mt-1 sm:mt-2 p-2" component="div">{description}</Typography>
        </>
    );
};
