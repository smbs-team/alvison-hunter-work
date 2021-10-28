import { Dialog, DialogContent, Divider, IconButton, Link, Typography } from '@material-ui/core';
import { useState } from 'react';
import CustomDialogTitle from '../../../components/UI/DialogTitle/DialogTitle';
import { OrderItem, OrderLordOrder } from '../../../interfaces';
import './dialogs.scss'

export interface IReceiptItem {
    order: OrderLordOrder;
}

export const ReceiptDialog = ({ order }: IReceiptItem) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Link component="button" type="button" onClick={handleOpen} className="anchor font-normal text-sm">View receipt</Link>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                maxWidth={'xs'}
                fullWidth
            >
                <CustomDialogTitle
                    leftButton={
                        <IconButton onClick={handleClose}>
                        </IconButton>
                    }
                    onClose={handleClose}
                >
                    Receipt
                </CustomDialogTitle>
                <DialogContent dividers>
                    <div className="container">
                        <Typography className="font-sofia font-bold text-base pb-2" component="div">Order number<span className="font-normal px-2">#324</span></Typography>
                        <div>
                            {order.products.map((item: OrderItem, idx) => (
                                <div key={idx} className="flex items-center justify-between pb-2 ">
                                    <Typography className="truncate pr-3 font-sofia text-base" component="div">x{item.quantity} {item.name}</Typography>
                                    <Typography className="font-bold font-sofia text-base" component="div">${item.priceTotal.toFixed(2)}</Typography>
                                </div>
                            ))}
                        </div>
                        <Divider />
                        <div className="flex items-center justify-between pb-2 pt-2">
                            <Typography className="font-bold font-sofia text-base" component="div">Subtotal</Typography>
                            <Typography className="font-sofia text-base" component="div">${order.price.subTotal.toFixed(2)}</Typography>
                        </div>
                        <div className="flex items-center justify-between pb-2 ">
                            <Typography className="font-bold font-sofia text-base" component="div">Tips</Typography>
                            <Typography className="font-sofia text-base" component="div">${order.price.tips.toFixed(2)}</Typography>
                        </div>
                        <div className="flex items-center justify-between pb-2 ">
                            <Typography className="font-bold font-sofia text-base" component="div">Tax</Typography>
                            <Typography className="font-sofia text-base" component="div">${order.price.taxAmount.toFixed(2)}</Typography>
                        </div>
                        <div className="flex items-center justify-between pb-2">
                            <Typography className="font-bold font-sofia text-base" component="div">Fees</Typography>
                            <Typography className="font-sofia text-base strike">$1.95</Typography>
                        </div>
                        <div className="flex items-center justify-between pb-2">
                            <Typography className="font-bold font-sofia text-base" component="div">Total</Typography>
                            <Typography className="font-sofia text-lg" component="div">${order.price.actualGrandTotal.toFixed(2)}</Typography>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
