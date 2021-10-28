import { Order } from '../../interfaces';

export function createOrderSearchRows(orders: Order[]) {
  return orders.map((order: Order, idx: number) => {
    const { number, status, createdAt, refunds, id, totalCost, cancelledAt } =
      order;
    return {
      number,
      status,
      date: new Date(createdAt).toLocaleString(),
      cancelled: cancelledAt
        ? new Date(cancelledAt).toLocaleString()
        : 'Not Cancelled',
      id,
      totalCost: `$${totalCost.toFixed(2)}`,
      refunded: `$${
        !refunds.length
          ? 0
          : refunds.reduce((acc, refund) => acc + refund.amount, 0).toFixed(2)
      }`,
      user: `${order.order.user.firstName} ${order.order.user.lastName![0]}`,
      refund: order,
      cancel: order,
    };
  });
}
