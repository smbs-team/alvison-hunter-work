import { useHistory, Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Order, OrderItem, OrderAddition, Store } from '../../../interfaces';
import { Modal, ProfileTop } from '../../../components';
import { Button } from '@material-ui/core'; 
import { useActions } from '../../../hooks';
import { useSelector } from 'react-redux';
import { flattenStore, getAddressFromStringOrObject } from '../../../utils';
import * as rawActions from '../../../store/actions';
import '../../../styles/order-group.scss';

interface ParamTypes {
  groupId: string;
}
/**
 * A view that shows the details for a particular order group.
 */
export const OrderGroup = () => {
  const { currentGroup, orderGroups } = useSelector((store: Store) =>
    flattenStore(store)
  );
  const { setOrderGroup, unsetOrderGroup } = useActions(rawActions);
  const history = useHistory();
  const { groupId } = useParams<ParamTypes>();
  useEffect(() => {
    setOrderGroup(groupId, orderGroups || []);
    return () => unsetOrderGroup();
  }, [setOrderGroup, unsetOrderGroup, orderGroups, groupId]);
  const [showModal, toggleModal] = useState(false);
  const isPickup =
    currentGroup && currentGroup.orders[0].order.type === 'takeaway';
  const address =
    currentGroup &&
    (!isPickup
      ? currentGroup.orders[0].order.address
      : getAddressFromStringOrObject(currentGroup?.orders[0].order.address));
  return (
    <div className="order-group-view">
      <ProfileTop
        onBack={() => history.goBack()}
        topText={`Order #${
          currentGroup
            ? currentGroup.orders[0].number
              ? currentGroup.orders[0].number
              : currentGroup.orders[0].id.slice(-6)
            : ''
        }`}
      />
      <div className="order-group-list">
        {currentGroup && address ? (
          <div>
            <div className="order-group-section vertical-center">
              <div>
                <div className="type s16 bold">
                  {!isPickup ? 'Delivered to' : 'Pickup from'}
                </div>
                <div className="address type s13">
                  <div>{address.line1}</div>
                  {address.line2 ? <div>{address.line2}</div> : ''}
                  <div>
                    {address.city}, {address.state} {address.zip}
                  </div>
                </div>
              </div>
            </div>
            {currentGroup.orders.map((order: Order, idx: number) => (
              <div key={idx}>
                <div className="brand-section vertical-center">
                  <div className="space-bt">
                    <div>
                      <div className="type s16 bold brand-name">
                        {order.brand.name}
                      </div>
                      <div className="type s13"></div>
                    </div>
                    <div className="tracking-link type s13">
                      <Link to={`/order/${order.id}/tracking`}>tracking</Link>
                    </div>
                  </div>
                </div>
                <div>
                  {order.order.products.map((prod: OrderItem, idx: number) => (
                    <div
                      key={idx}
                      className="order-group-section vertical-center"
                    >
                      <div className="space-bt">
                        <div className="item-name">{prod.name}</div>
                        <div className="item-price type s14">
                          ${prod.priceUnit.toFixed(2)}
                        </div>
                      </div>
                      {prod.additions.map((add: OrderAddition, idx: number) => (
                        <div className="type s13 space-bt" key={idx}>
                          <div>{add.name}</div>
                          <div className="type s14">
                            {add.price ? `+$${add.price.toFixed(2)}` : ''}
                          </div>
                        </div>
                      ))}{' '}
                      <br />
                      <div className="space-bt">
                        <div className="type s13">Quantity</div>
                        <div className="item-price type s14">
                          x{prod.quantity}
                        </div>
                      </div>
                      <div className="space-bt">
                        <div className="item-name type s13 bold">
                          {' '}
                          Item Total
                        </div>
                        <div className="item-price type s14">
                          $
                          {(
                            (Number(prod.priceTotal) +
                              prod.additions.reduce(
                                (acc: number, add: OrderAddition) =>
                                  acc + add.price,
                                0
                              )) *
                            prod.quantity
                          ).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="brand-section vertical-center">
              <div className="totals type s13">
                <div className="space-bt">
                  <div>Subtotal</div>
                  <div className="type s14">
                    ${currentGroup.subtotal.toFixed(2)}
                  </div>
                </div>
                {currentGroup.discountTotal ? (
                  <div className="space-bt">
                    <div>Discounts</div>
                    <div className="type s14">
                      -${currentGroup.discountTotal?.toFixed(2)}
                    </div>
                  </div>
                ) : (
                  ''
                )}
                <div className="space-bt">
                  <div>Tip</div>
                  <div className="type s14">
                    ${currentGroup.tips.toFixed(2)}
                  </div>
                </div>
                <div className="space-bt">
                  <div>Tax</div>
                  <div className="type s14">${currentGroup.tax.toFixed(2)}</div>
                </div>
                <div className="space-bt">
                  <div>Grand Total</div>
                  <div className="type s14">
                    ${currentGroup.grandTotal.toFixed(2)}
                  </div>
                </div>
                <div className="horiz-center">
                  <div
                    className="type s13 issues"
                    onClick={() => toggleModal(true)}
                  >
                    Issue with this order
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
      {showModal ? (
        <Modal
          onClose={() => toggleModal(false)}
          content={
            <div>
              <div className="small-modal-title type s20">Get Help</div>
              <div className="small-modal-text type s14">
                Please contact{' '}
                <a href="mailto:support@getreef.com">support@getreef.com</a> or{' '}
                <a href="tel:+18887107333">1-888-710-7333</a> if you have any
                problems with your order
              </div>
                <Button
                  size="large"
                  className="w-32 h-12"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    toggleModal(false);
                  }}
                >
                  Ok
                </Button>
            </div>
          }
          type={'small-modal'}
        />
      ) : (
        ''
      )}
    </div>
  );
};
