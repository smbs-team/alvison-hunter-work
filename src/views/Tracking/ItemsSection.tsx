import { Divider, Typography } from "@material-ui/core";
import { OrderLordOrder, OrderItem } from "../../interfaces/orderInterfaces";
import { ReceiptDialog } from "./Dialog/ReceiptDialog";
import './tracking.scss';

export interface IProduct {
    name: string;
    priceUnit: string;
    quantity: number;
}

export interface IItemsSection {
    text: string;
    order: OrderLordOrder;
}

/**
 *
 * Component for items section of a tracking page. 
 */
const Item = ({ name, priceUnit, quantity }: IProduct) => {
    return (
        <>
            <Typography className="text-lg font-sofia pt-2">
                {name}
            </Typography>
            <div className="flex items-center justify-between pb-2">
                <Typography className="text-sm font-sofia font-bold">${priceUnit}</Typography>
                <Typography className="text-sm font-sofia grayTextColor">x{quantity}</Typography>
            </div>
            <Divider />
        </>
    )
}

export const ItemsSection = ({ text, order }: IItemsSection) => {
    return (
        <>
            <Typography className="font-bold font-sofia mt-3" variant="h5">{text}</Typography>
            <div className="background border border-solid border-grey_line mt-1 sm:mt-2 p-2">
                {order.products.map((product: OrderItem, idx) => (
                    <Item
                        key={idx}
                        name={product.name}
                        priceUnit={product.priceUnit.toFixed(2)}
                        quantity={product.quantity}
                    />
                ))}
                <Typography className="flex items-center justify-between text-base font-bold font-sofia mt-3 mb-0_5">
                    {order.price && (<div>${order.price.grandTotal.toFixed(2)}</div>)}

                    <ReceiptDialog order={order} />
                </Typography>
            </div>
        </>
    );
};
