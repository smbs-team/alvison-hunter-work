import { useHistory, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { OrderItem, Store } from '../../../interfaces';
import { ProfileTop } from '../../../components';
import { OrderHistory } from '../../../assets/icons';
import { useActions } from '../../../hooks';
import { useSelector } from 'react-redux';
import { flattenStore } from '../../../utils';
import * as rawActions from '../../../store/actions';
import '../../../styles/orders.scss';
/**
 * A view for a list of user's orders.
 */
export const Orders = () => {
  const { user, orderGroups, groupsFetched } = useSelector((store: Store) =>
    flattenStore(store)
  );
  const { fetchOrderGroups } = useActions(rawActions);
  const history = useHistory();
  useEffect(() => {
    if (user) {
      fetchOrderGroups(user);
    }
  }, [user, fetchOrderGroups]);
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'virtual_pageview',
      page_title: 'profile:orderhistory',
      page_url: window.location.pathname,
    });
  }, []);
  const sorted =
    orderGroups &&
    orderGroups?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  return (
    <div className="orders-view">
      <ProfileTop onBack={() => history.goBack()} topText={'Order History'} />
      {groupsFetched ? (
        <div>
          {orderGroups!.length ? (
            <div className="order-list">
              {sorted?.map((orderGroup, idx) => {
                const date = new Date(orderGroup.createdAt);
                const brandAcc: string[] = [];
                const brands = orderGroup.orders.reduce(
                  (acc, order) => acc.concat(order.brand.name),
                  brandAcc
                );
                const itemsAcc: OrderItem[] = [];
                const flatOrderItems = orderGroup.orders
                  .reduce(
                    (acc, order) => acc.concat(order.order.products),
                    itemsAcc
                  )
                  .map((item: OrderItem) => item.name);
                return (
                  <Link
                    to={`/profile/orders/${orderGroup.id}`}
                    key={idx}
                    className="order-list-item vertical-center"
                  >
                    <div>
                      <div className="space-bt list-line">
                        <div className="brands type s16 bold">
                          {brands.join(', ')}
                        </div>
                        <div className="date type s14">
                          {date.getMonth() + 1}/{date.getDate()}/
                          {date.getFullYear().toString().slice(-2)}
                        </div>
                      </div>
                      <div className="type s14 list-line">
                        {flatOrderItems.slice(0, 3).join(', ')}
                      </div>
                      <div className="type s13 list-line">
                        ${orderGroup.grandTotal.toFixed(2)}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="orders-center">
              <OrderHistory />
              <br />
              <div className="type s16 orders-msg"> No order history</div>
            </div>
          )}
        </div>
      ) : (
        <div className="orders-msg type s16">Loading...</div>
      )}
    </div>
  );
};
