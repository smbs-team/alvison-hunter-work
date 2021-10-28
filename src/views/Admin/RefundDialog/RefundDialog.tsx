import { Order } from '../../../interfaces';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { FormFragmentTemplate } from '../../../components';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface IRefundDialogProps {
  refundModalShown: boolean;
  handleClose: () => void;
  order: Order | null;
  handleError(newMsg: string): void; 
}

export function RefundDialog({
  refundModalShown,
  handleClose,
  order,
  handleError,
}: IRefundDialogProps) {
  const { control, handleSubmit } = useForm();
  const issueRefund = async ({
    reason,
    amount,
  }: {reason: string, amount?: string}) => {
    try {
      if (order) {
        await axios.post(`/api/order/${order.id}/refund`, {
          amount: amount && parseFloat(amount),
          reason,
        });
      }
    } catch (e) {
      handleError(e.response?.data?.message);
    }
    handleClose();
  };
  return (
    <Dialog
      open={refundModalShown}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <form onSubmit={handleSubmit(issueRefund)}>
        <DialogTitle id="form-dialog-title">Issue a Refund</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To issue a refund, please enter the amount below or leave the field
            blank to issue a full refund. A reason is required for any refund.
          </DialogContentText>
          <FormFragmentTemplate
            fields={[
              {
                name: 'amount',
                text: 'Amount',
                required: false,
              },
              {
                name: 'reason',
                text: 'Refund Reason',
                required: true,
              },
            ]}
            control={control}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button type="submit">Refund</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
