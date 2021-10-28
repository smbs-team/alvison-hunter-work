import { SetStateAction, Dispatch } from 'react';
import { ModalState } from '..';
import { Order } from '../../interfaces';
import { GridCellParams } from '@material-ui/data-grid';
import { Button } from '@material-ui/core';

export const createOrderSearchColumns = (
  setModalState: Dispatch<SetStateAction<ModalState>>,
) => [
  {
    field: 'number',
    headerName: 'Number',
    width: 150,
  },
  {
    field: 'user',
    headerName: 'User',
    width: 150,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
  },
  {
    field: 'date',
    headerName: 'Created',
    width: 200,
  },
  {
    field: 'cancelled',
    headerName: 'Cancelled',
    width: 200,
  },
  {
    field: 'totalCost',
    headerName: 'Total',
    width: 150,
  },
  {
    field: 'refunded',
    headerName: 'Refunded',
    width: 150,
  },
  {
    field: 'refund',
    headerName: ' ',
    width: 80,
    renderCell: (params: GridCellParams) => (
      <div className="flex justify-center w-full">
        <Button
          onClick={() =>
            setModalState((state) => ({
              ...state,
              refundModalShown: true,
              order: params.value as Order,
            }))
          }
        >
          Refund
        </Button>
      </div>
    ),
  },
  {
    field: 'cancel',
    headerName: ' ',
    width: 80,
    renderCell: (params: GridCellParams) => (
      <div className="flex justify-center w-full">
        <Button
          onClick={() =>
            setModalState((state) => ({
              ...state,
              cancelModalShown: true,
              order: params.value as Order,
            }))
          }
        >
          Cancel
        </Button>
      </div>
    ),
  },
];
