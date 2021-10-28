import { Dialog, DialogContent, DialogTitle, IconButton, Link, Typography } from "@material-ui/core";
import { useState } from "react";
import CustomDialogTitle from '../../../components/UI/DialogTitle/DialogTitle';
import './dialogs.scss'

export interface ISupportContactInfo {
    email: string;
    phone: string;
}

export const SupportDialog = ({ email, phone }: ISupportContactInfo) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => { setOpen(true) };
    const handleClose = () => { setOpen(false) };

    return (
        <>
            <Link component="button" onClick={handleOpen} className="anchor font-normal text-sm">Contact support</Link>
            <Dialog onClose={handleClose} open={open}>
                <CustomDialogTitle leftButton={
                    <IconButton onClick={handleClose}>
                    </IconButton>
                }
                    onClose={handleClose}>Contact Info</CustomDialogTitle>
                <DialogContent dividers>
                    <Typography className="font-sofia text-base px-2 pb-2">Please contact <b>{email}</b> or <b>{phone}</b> if you have any problems with your order </Typography>
                </DialogContent>
            </Dialog>
        </>
    );
}
