import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CloseIcon } from '../../../assets/icons';
import { useActions } from '../../../hooks';
import * as rawActions from '../../../store/actions';
import { Modal, StripeFields } from '../../';
import '../../../styles/checkout-cards.scss';
import { styles } from '../../../styles/sharedTailwindClasses';

export function AddPaymentModal() {
  const { toggleAddPaymentModal} = useActions(rawActions);
  const [stripePromise] = useState(() =>
    loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!)
  );
  const { borderBottom } = styles;
  //! Reload the page if stripePromise fails (retry 3 times)
  useEffect(
    function () {
      //? Stripe successfully loaded
      stripePromise
        .then(
          (StripePromiseResult) => {
            sessionStorage.removeItem('stripeLoadingRetryCounter'); //remove the counter
          }

          //? Stripe load failed
        )
        .catch((error) => {
          let stripeLoadingRetryCounter: number | string | null | undefined =
            sessionStorage.getItem('stripeLoadingRetryCounter');

          if (
            stripeLoadingRetryCounter !== null &&
            stripeLoadingRetryCounter !== undefined
          ) {
            stripeLoadingRetryCounter = Number(stripeLoadingRetryCounter); //get value from sessionStorage
          } else {
            sessionStorage.setItem('stripeLoadingRetryCounter', '1'); //start the "retry" counter
            stripeLoadingRetryCounter = 1;
          }

          if (stripeLoadingRetryCounter < 4) {
            sessionStorage.setItem(
              'stripeLoadingRetryCounter',
              String(Number(stripeLoadingRetryCounter) + 1)
            ); //increment the counter

            setTimeout(function () {
              window.location.reload(false); //reload the page after 2 seconds
            }, 2000);
          }
        });
    },
    [stripePromise]
  );

  return (
    <Modal
      modalClass="flex justify-center"
      type={'add-payment-modal'}
      content={ 
        <div className="flex flex-col cursor-default">
          <div className={`flex justify-between ${borderBottom} p-3`}>
            <div className="w-2 h-2" />
            <div className="font-sofia text-xl font-bold">Add payment method</div>
            <CloseIcon 
              className="pt-0_5"
              onClick={() => {toggleAddPaymentModal(false)}}
            />
          </div>
          <Elements
            stripe={stripePromise}
          >
            <StripeFields toggleAddingCard={() => toggleAddPaymentModal(false)} />
          </Elements> 
        </div>
      }
    />
  );
}
