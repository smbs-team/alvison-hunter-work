import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Store } from '../../interfaces';
import { TrackingItem, GoogleMap, Footer } from '../../components';
import { useActions, useTracking, useScript } from '../../hooks';
import { useSelector } from 'react-redux';
import {
    flattenStore,
    SWRFetch
} from '../../utils';
import * as rawActions from '../../store/actions';
import './tracking.scss';
import { OrderField } from './OrderField';
import { DeliveryLocationSection } from './DeliveryLocationSection';
import { PaymentSection } from './PaymentSection';
import { ItemsSection } from './ItemsSection';
import { SupportDialog } from './Dialog/SupportDialog';
import useSWR from 'swr';
import { deliveryTrackingStates, pickupTrackingStates } from './TrackingStateIcons';
import { Typography } from '@material-ui/core';
interface ParamTypes {
    orderId: string;
}
const { REACT_APP_FORCE_ALPACA } = process?.env;
/**
 * A view for showing tracking for a particular order (each order within a group has
 * a separate tracker.)
 */
export const Tracking = () => {
    const { currentTracking, currentOrder } = useSelector((store: Store) =>
        flattenStore(store)
    );
    const mapsStatus = useScript(
        `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GMAPS_KEY}&libraries=places`
    );

    const orderType = currentOrder?.order?.type
    const orderAddress = currentOrder?.order?.address
    const orderNote = currentOrder?.order?.note
    const userPhoneNumber = currentOrder?.order?.user?.phone

    /** Fetching payment details to display on tracking page */

    const { data: paymentInfo } = useSWR((currentOrder ? `/api/payment/${currentOrder?.chargeId}` : null), SWRFetch);
    const paymentMethodDetailsCard = paymentInfo?.charge?.payment_method_details?.card;
    /***************************/

    const { getTracking, clearTracking } = useActions(rawActions);
    const { orderId } = useParams<ParamTypes>();
    useTracking(getTracking, clearTracking, orderId);

    const trackingStates = currentOrder
        ? orderType && orderType === 'takeaway'
            ? pickupTrackingStates
            : deliveryTrackingStates
        : [];

    // TODO need to clarify that we are no longer need to do estimated delivery

    //const [estimate, setEstimate] = useState<number[] | null>();
    // const [low, high] = estimate ? [estimate[0], estimate[1]] : [null, null];
    // const completionTimeLow = currentOrder && new Date(currentOrder.createdAt);
    // low && completionTimeLow?.setMinutes(completionTimeLow.getMinutes() + low);
    // const completionTimeHigh = currentOrder && new Date(currentOrder.createdAt);
    // high &&
    //     completionTimeHigh?.setMinutes(completionTimeHigh.getMinutes() + high);
    // const [hourLow, minLow, _noneLow, amPmLow] = completionTimeLow
    //     ? completionTimeLow.toLocaleTimeString('en-US').split(/:| /)
    //     : [null, null, null, null];
    // const [hourHigh, minHigh, _noneHigh, amPmHigh] = completionTimeHigh
    //     ? completionTimeHigh.toLocaleTimeString('en-US').split(/:| /)
    //     : [null, null, null, null];
    // const orderSuccess1 = useConfigcatText('ordersuccessline1');
    // const orderSuccess2 = useConfigcatText('ordersuccessline2');

    // useEffect(() => {
    //     async function getEstimate() {
    //         const prepTime = currentOrder!.order.brandName.match(/Light Speed/i)
    //             ? 2
    //             : currentOrder!.order.brandName.match(/Wendy's/i)
    //                 ? 5
    //                 : undefined;
    //         const estimate = await getOrderTimeEstimate({
    //             type: orderType!,
    //             origin: currentTracking?.venue,
    //             destination: currentTracking?.customer,
    //             prepTime,
    //         });
    //         setEstimate(estimate);
    //     }
    //     if (mapsStatus === 'ready' && currentOrder) {
    //         getEstimate();
    //     }
    // }, [currentOrder, currentTracking, mapsStatus]);

    const alpaca = useMemo(
        () =>
            window.location.href.indexOf(`alpaca.getreef.com`) > -1 ||
            window.location.href.indexOf(`alpaca-stg.getreef.com`) > -1 ||
            REACT_APP_FORCE_ALPACA,
        []
    );
    const contact = useMemo(() =>
        alpaca ? {
            email: "alpacaSupport@getreef.com",
            phone: "+1 (888) 930 7333",
            phone_format: "1-888-930-7333"
        } : {
            email: "support@getreef.com",
            phone: "+1 (888) 710 7333",
            phone_format: "1-888-710-7333"
        }
        , [alpaca])

    const deliveringMessage = <Typography className="font-bold">Your order from <Typography className="font-bold text-content_black" component='span'>{currentOrder?.order.brandName} </Typography>has been confirmed! We will keep you updated by texting your number.</Typography>
    const deliveredMessage = <Typography className="font-bold">Your order from <Typography className="font-bold text-content_black" component='span'>{currentOrder?.order.brandName}</Typography> has been delivered!</Typography>

    // TODO display this message when new design for wework is completed
    // const orderSuccess = useConfigcatText("orderSuccess", `${getSubdomain() === 'wework' && 'Your order will be delivered to the outpost shelf on the community floor.\nFor orders delivered after 5PM, your delivery driver will call you to meet them in the lobby.'}`)

    return (
        <div>
            {/* Main container */}
            <div className="trackingContainer md:grid md:grid-cols-2">

                {/* Tracking icons and header section*/}
                <div className="gridRowTracking">
                    {currentTracking && trackingStates ? (
                        <>
                            <div className="flex">
                                {trackingStates.slice(0, 5).map((state, idx) => (
                                    <TrackingItem
                                        key={idx}
                                        currentState={currentTracking.state}
                                        itemIndex={idx}
                                        icon={state.icon}
                                    />
                                ))}
                            </div>
                            <div className="orderHeader font-bold">{currentTracking.state < 6 ? trackingStates[currentTracking.state - 1].text
                                : null}
                                <Typography className="description text-base font-normal font-sofia mb-2">{currentTracking.state < 5 ? deliveringMessage : deliveredMessage}</Typography>
                            </div>
                        </>
                    ) : null}
                </div>

                {/* Map */}
                {mapsStatus && <div className="gridRowMap">{currentTracking ? (
                    <GoogleMap
                        tracking={currentTracking!}
                        orderType={orderType}
                    />
                ) : null}
                </div>}

                {/* Order details */}
                <div>
                    {currentOrder && <OrderField
                        text={"Order Number"}
                        description={`# ${currentOrder.orderLordId}`} />}
                    {currentOrder && <DeliveryLocationSection
                        label={"Pickup Location"}
                        orderType={orderType!}
                        address={`${orderAddress?.line1}, ${orderAddress?.city}, ${orderAddress?.state} ${orderAddress?.zip}`}
                        deliveryNotes={orderNote}
                        phoneNumber={userPhoneNumber}
                    />}
                    {paymentInfo &&
                        <PaymentSection
                            label={"Payment Method"}
                            cardBrand={paymentMethodDetailsCard.brand}
                            fundingType={paymentMethodDetailsCard.funding}
                            lastFourDigits={paymentMethodDetailsCard.last4}
                        />}
                    {currentOrder?.order && <ItemsSection
                        text={"Items"}
                        order={currentOrder?.order}
                    />}
                    <Typography className={'font-sofia font-bold'} >Issue with this order? &nbsp;<SupportDialog email={contact.email} phone={contact. phone_format} /></Typography>
                </div>
            </div>
            <Footer />
        </div>
    );
};

