import {
  Cards,
  Promo,
  UserForm,
  MarketingField,
  SMSField,
  AddPaymentModal,
} from '../../components';
import { 
  useLocationSearch, 
  useActions, 
  useCheckoutAnalytics, 
  useFeatureFlag 
} from '../../hooks';
import { useState, useEffect, useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Brand, Store, ICheckoutForm } from '../../interfaces';
import { useSelector } from 'react-redux';
import {
  flattenStore,
  taxTable,
  totalAllCarts,
  filterCartsBySearchResults,
  createAlpacaPayload,
  createCheckoutFormDefaults,
  getDeliveryTimeStrings,
  getFlattenedWeWorks,
  getFlattenedAlpaca
} from '../../utils';
import * as rawActions from '../../store/actions';
import { Phone } from '../../assets/icons';
import '../../styles/checkout.scss';
import { useForm } from 'react-hook-form';
import {
  Button,
  CircularProgress,
} from '@material-ui/core';
import { useQueryParam, StringParam } from 'use-query-params';
import { LocationSummary } from './LocationSummary';
import { CartSummary } from './CartSummary';
import { CostSummary } from './CostSummary';
import { TipSummary } from './TipSummary';
import { OrderPreferences } from './OrderPreferences';
/**
 * A component that holds all necessary section for completing checkout after the cart.
 */
export const Checkout = () => {
  const {
    user,
    carts,
    selectedCard,
    quantities,
    searchResults,
    searchLoaded,
    selectedAddress,
    orderType,
    authLoaded,
    selectedLocation,
    searchInitialized,
    promo,
    deliveryTime,
    showAddPaymentModal, 
    cards
  } = useSelector((store: Store) => flattenStore(store));

  const formControls = useForm({
    defaultValues: createCheckoutFormDefaults(user),
  });
  const { handleSubmit, setValue, watch, control } = formControls;
  const { tip , isAlpaca } = watch();
  const { placeOrder, locationSearch, toggleAddPaymentModal } = useActions(rawActions);

  const history = useHistory();

  const filteredCarts = filterCartsBySearchResults(
    carts,
    searchResults ? [searchResults] : [],
    orderType
  );
  useLocationSearch(
    searchResults,
    orderType,
    locationSearch,
    selectedAddress,
    undefined,
    selectedLocation || undefined,
    searchInitialized
  );

  const [checkingOut, setCheckingOut] = useState(false);

  const currentBrandId = useMemo(
    () => filteredCarts && Object.keys(filteredCarts)[0],
    [filteredCarts]
  );
  const currentBrandObj = useMemo(
    () =>
      searchResults?.brands.find((brand: Brand) => brand.id === currentBrandId),
    [searchResults, currentBrandId]
  );

  const preTipsCalc = useMemo(
    () =>
      totalAllCarts(
        filteredCarts,
        quantities,
        taxTable[currentBrandObj?.location!.name || 0] || 0,
        0,
        promo
      ),
    [filteredCarts, quantities, currentBrandObj, promo]
  );

  const pricesObj = useMemo(
    () =>
      totalAllCarts(
        filteredCarts,
        quantities,
        taxTable[currentBrandObj?.location!.name || 0] || 0,
        tip,
        promo
      ),
    [filteredCarts, quantities, tip, promo, currentBrandObj]
  );

  useEffect(() => {
    if (
      searchResults &&
      filteredCarts &&
      !Object.keys(filteredCarts).length &&
      !checkingOut
    ) {
      history.push('/location');
    }
  }, [searchResults, filteredCarts, checkingOut, history, authLoaded, user]);

  useCheckoutAnalytics({
    pricesObj,
    currentBrandObj,
    orderType,
    filteredCarts,
    quantities,
    searchResults,
    tip,
    user,
    selectedAddress,
  });

  const { isEnabled: addressSelectEnabled } =
    useFeatureFlag('weworkaddressselect');

  const currentWeWork = useMemo(
    () =>
      addressSelectEnabled &&
      getFlattenedWeWorks().find(
        (location) => location.address1 === selectedAddress?.line1
      ),
    [addressSelectEnabled, selectedAddress]
  );

  const currentAlpacaNoTipLocal = !!useMemo(
    () =>
      isAlpaca &&
      getFlattenedAlpaca().find(
        (location) => location.address1 === selectedAddress?.line1
      ),
    [isAlpaca, selectedAddress]
  );

  const [cutlery, setCutlery] = useState(false);
  const [contactlessDelivery, setContactlessDelivery] = useState(false)

  const onSubmit = ({ line2, isAlpaca, ...data }: ICheckoutForm) => {
    // This function grabs all needed data from the form and then combines it with the other required data
    // that is needed to place an order.
    if (currentBrandObj && selectedAddress) {
      placeOrder({
        ...data,
        orderNote: `${cutlery && 'I do not want cutlery' || ''}`+ `${contactlessDelivery && 'I do not want contactless delivery.' || ''}`+ data.orderNote +  `${!!currentWeWork && currentWeWork?.directions || ''}`,
        subTotal: pricesObj.currentCartSubTotal,
        carts: filteredCarts,
        quantities,
        address: { ...selectedAddress, line2 },
        searchResults,
        user,
        orderType,
        selectedCard,
        promo,
        alpacaData:
          isAlpaca &&
          createAlpacaPayload(currentBrandObj, data, selectedAddress),
        history,
        deliveryTime,
        setLoading: (newVal: boolean) => setCheckingOut(newVal),
      });
    }
  };

  const { isEnabled: slotBasedOrderSchedulerEnabled } =
    useFeatureFlag('slotBasedOrderScheduler');

  const deliveryTimeStrings = useMemo(() => 
    getDeliveryTimeStrings(deliveryTime)
    , [deliveryTime]); 

  const [partnerQueryParam] = useQueryParam('partner', StringParam);
  const location =  partnerQueryParam ? `/location?partner=${partnerQueryParam}` : `/location`

  useEffect(() => {
    setValue('orderNote', selectedAddress?.deliveryInstructions || "")
  }, [selectedAddress])


  return searchLoaded ? (
    <div className="w-screen font-sofia pb-8 ">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="checkout-view px-2 pt-1 flex flex-col md:m-auto md:pt-5 md:pb-3 md:horiz-center md:justify-center md:flex-row">
          <div className="order-summary md:mr-3">
            {/* Contact Section - only shows if user is not signed in */}
            {/* This section is blocked by design but this up to date as of figma design 09/22 */}
            {
              !user && 
                <div className="bottom md:flex md:px-2 py-4">
                  <div className="section-title flex justify-between pb-2">
                    <div className="font-bold font-grotesque text-lg text-content_black">Contact Info</div> 
                  </div>
                  <div className="section-body flex flex-col">
                    <UserForm {...formControls} />
                    <MarketingField control={control} />
                    <SMSField control={control} />
                  </div>
                </div>
            }

            {/* Location Section */}
            <div className="bottom md:flex md:px-2 md-4">
              <div className="section-title font-bold font-grotesque text-lg text-content_black pb-2">
                {user ? (
                  'Location'
                ):(
                  `${slotBasedOrderSchedulerEnabled ? ( 
                    orderType === 'delivery' ? `Delivery ${deliveryTimeStrings.short} to` : `Pickup ${deliveryTimeStrings.short} from`
                    ) : (
                    orderType === 'delivery' ? `Delivery to` : `Pickup from`)
                  }`
                )}
                
                
              </div>
              <LocationSummary currentBrandObj = {currentBrandObj} formControls={formControls} />
            </div>

            {/* Phone Number Section - only shows if user is signed in */}
            {
              user && 
                <div className="bottom md:flex md:px-2 pt-4 pb-2_5 ">
                  <div className="section-title" />
                  <div className="section-body flex">
                    <div className="pb-1">
                      <span className="pr-2"><Phone /> </span>
                    </div>
                    <div className="font-sofia text-sm text-content_black font-bold">
                      ({user.phone.substring(0,3)}) {user.phone.substring(3,6)}-{user.phone.substring(6)}
                    </div>
                  </div>
                </div>
            }

            {/* Payment Section */ }
            <div className="bottom md:flex md:px-2 py-4">
              <div className="section-title flex justify-between pb-2 ">
                <div className="font-bold font-grotesque text-lg text-content_black">Payment</div> 
                {
                  cards.length !== 0 &&
                  <div className="text-right font-sofia text-sm underline text-teal cursor-pointer md:hidden" 
                  onClick={() => {toggleAddPaymentModal(true)}}>Add Payment Method</div>
                }
              </div>
              <div className="section-body flex-grow flex flex-col text-sm">
                {
                  cards.length !== 0 &&
                  <div className="text-right font-sofia text-sm underline text-teal cursor-pointer hidden md:block" 
                  onClick={() => {toggleAddPaymentModal(true)}}>Add Payment Method</div>
                }
                {showAddPaymentModal && <AddPaymentModal />}
                <Cards />
              </div>
            </div>

            {/* Preference Section */ }
            <div className="bottom md:flex md:px-2 pb-4">
              <div className="section-title font-bold font-grotesque text-lg text-content_black pb-2 pt-4">
                Preference
              </div>
              <OrderPreferences cutlery={cutlery} setCutlery={setCutlery} contactlessDelivery={contactlessDelivery} setContactlessDelivery={setContactlessDelivery} />
            </div>
            
            {/* Items Section */ }
            <div className="md:flex md:px-2 py-4">
              <div className="section-title flex justify-between pb-2">
                <div className="font-bold font-grotesque text-lg text-content_black ">
                  Your Items
                </div>
                <div className="text-right font-sofia text-sm underline text-teal cursor-pointer md:hidden" onClick={() => {
                    history.push(location)
                  }}>Add Items</div>
              </div>
              <CartSummary searchLoaded={searchLoaded} searchResults={searchResults} orderType={orderType} carts={carts} quantities={quantities}/>
            </div>
          </div>
          

          {/* Order Card Section */}
          <div className="order-card flex flex-col bg-ghost_white pr-0_5 pl-3 px-4 pt-4 pb-3">
            <div className="w-full">
              {/* title */}
              <div className="font-grotesque text-lg text-content_black pb-2 font-bold ">Your Order</div>

              {/* promo */}
              <div className="flex justify-between">
                <div className="flex-grow"><Promo subTotal={preTipsCalc.currentCartSubTotal} /></div>
                <div className="w-2 pl-0_5" />
              </div>
              
              {/* summary */}
              <CostSummary pricesObj = {pricesObj} />

              {/* tip */}
              {!currentAlpacaNoTipLocal && orderType === 'delivery' &&
                <TipSummary tip={tip} preTipsCalc={preTipsCalc} control={control} setValue={setValue}/>
              }
              
              {/* total */}
              <div className="flex justify-between">
                <div className="flex-grow">
                  <div className="flex justify-between text-lg font-bold pt-2">
                    <div>Total</div>
                    <div>${pricesObj.currentCartGrandTotal.toFixed(2)}</div>
                  </div>
                  <div className="py-2">
                  <Button
                    type="submit"
                    disabled={!(selectedAddress && selectedCard) || checkingOut}
                    variant="contained"
                    color="primary"
                    size="large"
                    className="w-full"
                  >
                    {checkingOut ? (
                      <CircularProgress size={24} />
                    ) : (
                      <div className="font-sm">Place Order</div>
                    )}
                  </Button>
                  </div>
                  <div className="font-grotesque text-grey_desc text-xs text-center">
                    {user ? (
                      <span>By clicking, your order will be processed.</span>
                    ):(
                      <span>By clicking place order, you agree to be charged and to our <Link className="text-teal cursor-pointer no-underline" to="/termsOfUse">
                          Terms of Use
                        </Link> and <Link className="text-teal cursor-pointer no-underline" to="/privacyPolicy">
                          Privacy Policy
                        </Link>.
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-2 pl-0_5"/>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  ) : (
    <div />
  );
};

