import { Order } from '../../../interfaces';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import axios from 'axios';

interface ICancelDialogProps {
  refundModalShown: boolean;
  handleClose: () => void;
  order: Order | null;
  handleError(newMsg: string): void;
}

export function CancelDialog({
  refundModalShown,
  handleClose,
  order,
  handleError,
}: ICancelDialogProps) {
  const cancelOrder = async (order: Order | null) => {
    try {
      if (order) {
        await axios.post(`/api/order/${order.id}/cancel`);
        handleClose();
      }
    } catch (e) {
      handleError(e.response?.data?.message);
      handleClose();
    }
  };
  return (
    <Dialog
      open={refundModalShown}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <DialogTitle id="form-dialog-title">Cancel an Order</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want cancel this order? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Abort
        </Button>
        <Button onClick={() => cancelOrder(order)}>Cancel Order</Button>
      </DialogActions>
    </Dialog>
  );
}
