import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { StripeMaterialTextField } from '../..';
import { StripeElementChangeEvent } from '@stripe/stripe-js';
import { Store } from '../../../interfaces';
import { Button, Checkbox, CircularProgress, FormControlLabel } from '@material-ui/core';
import { useState } from 'react';
import { flattenStore } from '../../../utils';
import { useSelector } from 'react-redux';
import { useActions } from '../../../hooks';
import * as rawActions from '../../../store/actions';

export interface IStripeFieldsProps {
  toggleAddingCard(): void;
}
/**
 *
 * A wrapper for the elements provided by stripe-js that should be reusable for any scenario
 * where a new card needs to be added to stripe.
 */
export const StripeFields = ({ toggleAddingCard }: IStripeFieldsProps) => {
  const { user, cards } = useSelector((store: Store) => flattenStore(store));
  const { addCard } = useActions(rawActions);
  const elements = useElements();
  const stripe = useStripe();
  const [adding, setAdding] = useState(false);
  const [defaultCard, setDefaultCard] = useState(false);

  const [stripeElementState, setState] = useState<{
    [key: string]: any;
  }>({ elementError: {} });

  const { elementError } = stripeElementState;

  const onChange = (event: StripeElementChangeEvent) => {
    const { elementType, error } = event;
    setState({ 
      ...stripeElementState,
      elementError: {
        ...elementError,
        [elementType]: error?.message,
      },
    });
  };

  return (
    <div className={`${cards.length !== 0 && 'p-3'}`}>
      <div className="mt-1_5 ">
        <StripeMaterialTextField
          error={Boolean(elementError?.cardNumber)}
          helperText={elementError?.cardNumber && 'Your card number is incomplete.'}
          label="Card Number"
          onChange={onChange}
          stripeElement={CardNumberElement}
        />
      </div>
      <div className="flex w-full">
        <div className="mt-2_5 mr-2_5 w-8/12 ">
          <StripeMaterialTextField
            error={Boolean(elementError?.cardExpiry)}
            helperText={elementError?.cardExpiry && 'Expiration date is incomplete.'}
            label="Expires"
            onChange={onChange}
            stripeElement={CardExpiryElement}
          />
        </div>
        <div className="mt-2_5 w-4/12">
          <StripeMaterialTextField
            error={Boolean(elementError?.cardCvc)}
            helperText={elementError?.cardCvc && "Your card's security code is incomplete."}
            label="CVC"
            onChange={onChange}
            stripeElement={CardCvcElement}
          />
        </div>
      </div>
      <FormControlLabel
        labelPlacement="end"
        className="pl-1_5 mt-2 w-full"
        control={
          <Checkbox
            style ={{
              color: "green_select",
              width: '0px' 
            }}
            checked={defaultCard}
            onChange={() => setDefaultCard(!defaultCard)}
          />
        }
        label={
          <div className="text-sm font-grotesque pl-1">
            Set as default payment method
          </div>
        }
      />
      <div>
        <div className="flex justify-center h-16">
          <div className="flex flex-grow flex-col justify-center h-full">
            <Button
              size="large"
              disabled={adding}
              className="w-full h-12 mt-2_5 text-xl font-sofia"
              variant="contained"
              color="primary"
              onClick={() => {
                setAdding((state) => true);
                addCard(
                  stripe!,
                  elements!,
                  user!,
                  defaultCard,
                  (shouldHideCardForm: boolean = true) => {
                    setAdding((state) => false);
                    if (shouldHideCardForm) {
                      toggleAddingCard();
                    }
                  }
                );
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                  event: 'add_payment_info',
                  date: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
                  user_id: user?.id,
                });
              }}
            >
              {adding ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};