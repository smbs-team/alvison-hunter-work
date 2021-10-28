import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { StripeFields, ProfileTop } from '../../../components';
import { Elements } from '@stripe/react-stripe-js';
import { useHistory } from 'react-router-dom';
/**
 *
 * @returns
 * A component for the view where new cards are created.
 */
export const NewCard = () => {
  const [stripePromise] = useState(() =>
    loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!)
  );
  const history = useHistory();
  const fontPath =
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;800&display=swap';
  return (
    <div>
      <ProfileTop onBack={() => history.goBack()} topText={'Payment'} />
      <div className="pt-8">
        <div className="flex justify-center">
          <div className="w-72 xs:w-80 sm:w-96 mt-1">

          <Elements
            stripe={stripePromise}
            options={{
              fonts: [
                {
                  cssSrc: fontPath,
                },
              ],
            }}
          >
            <StripeFields toggleAddingCard={() => history.goBack()} />
          </Elements>
          </div>
        </div>
      </div>
    </div>
  );
};
