import { useRequireAdmin } from '../../hooks';
import { SWRFetch } from '../../utils';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { RefundDialog } from './RefundDialog/RefundDialog';
import { CancelDialog } from './CancelDialog/CancelDialog';
import { DataGrid } from '@material-ui/data-grid';
import { createOrderSearchColumns } from './createOrderSearchColumns';
import { createOrderSearchRows } from './createOrderSearchRows';
import { OrderSearchForm } from '../../components';
import { FormObject, Order } from '../../interfaces';
import useSWR from 'swr';

export interface ModalState {
  order: Order | null;
  refundModalShown: boolean;
  cancelModalShown: boolean;
  errorMsg: string;
}

export function Admin() {
  // Makes sure this view can only be seen by users with the role of admin
  useRequireAdmin();

  const { control: searchControl, handleSubmit: handleOrderSearchSubmit } =
    useForm();

  const [orderSearchTerm, setOrderSearchTerm] = useState('');

  // Search for the provided order number with SWR. This will likely later need
  // to be extended with more advanced search features.
  const { data: ordersData, mutate } = useSWR(
    (orderSearchTerm &&
      `/api/order/search?number=${orderSearchTerm.toUpperCase()}`) ||
      null,
    SWRFetch,
  );

  const onOrderSearchSubmit = async ({ orderNumber }: FormObject) => {
    setOrderSearchTerm(orderNumber.toUpperCase());
  };

  // The state that goes with this useState hook is used for controlling all
  // 3 modals in this view (CancelDialog, RefundDialog and Snackbar)
  const [
    { refundModalShown, order, cancelModalShown, errorMsg },
    setModalState,
  ] = useState<ModalState>({
    errorMsg: '',
    cancelModalShown: false,
    refundModalShown: false,
    order: null,
  });

  // Used to close the error and refund modals
  const handleClose = (type: string) => {
    setModalState((state) => ({
      ...state,
      [`${type}ModalShown`]: false,
      order: null,
    }));
    // Make sure to fetch updated data when the refund is issued
    mutate(`/api/order/search?number=${orderSearchTerm.toUpperCase()}`);
  };
  // This handles the message for the error snackbar
  const handleError = (newMsg: string) =>
    setModalState((state) => ({ ...state, errorMsg: newMsg }));

  return (
    <div className="pt-10">
      <RefundDialog
        refundModalShown={refundModalShown}
        order={order}
        handleClose={() => handleClose('refund')}
        handleError={handleError}
      />
      <CancelDialog
        refundModalShown={cancelModalShown}
        order={order}
        handleClose={() => handleClose('cancel')}
        handleError={handleError}
      />
      <div className="flex justify-center">
        <div className="mt-5 w-11/12">
          <form onSubmit={handleOrderSearchSubmit(onOrderSearchSubmit)}>
            <div className="sm:w-3/12 w-9/12">
              <OrderSearchForm control={searchControl} />
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              className="mt-1"
            >
              Search
            </Button>
          </form>
          <div className="mt-1"></div>
          <DataGrid
            columns={createOrderSearchColumns(setModalState)}
            rows={
              ordersData?.data?.length
                ? createOrderSearchRows(ordersData.data)
                : []
            }
          />
        </div>
      </div>
      <Snackbar
        open={!!errorMsg.length}
        autoHideDuration={3000}
        onClose={() => handleError('')}
      >
        <MuiAlert elevation={6} variant="filled" severity="error">
          {errorMsg}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
