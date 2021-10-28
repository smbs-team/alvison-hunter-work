import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useActions } from '../hooks';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, Store } from '../interfaces';
import { StripeFields } from './Stripe/StripeFields/StripeFields';
import { Radio } from '@material-ui/core';
import { flattenStore } from '../utils';
import { CardLogo } from '../views/Profile/Cards/CardLogo';
import * as rawActions from '../store/actions';
import '../styles/checkout-cards.scss';


const shortenType = (type: string) => {
  if(type === 'MasterCard'){
    return 'MC'
  } else if (type === 'American Express') {
    return 'AmEx' 
  } else {
    return type
  }
}
/**
 *
 * A list of users' stored cards that allows users to add cards within the
 * StripeFields component if the have allowed it to be shown
 */
export const Cards = () => {
  const { cards, user, selectedCard } = useSelector((store: Store) =>
    flattenStore(store)
  );
  const { fetchCards, selectCard } = useActions(rawActions);
  const [stripePromise] = useState(() =>
    loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!)
  );
  const [cardsFetched, setCardsFetched] = useState(false);
  const [addingCard, toggleAddCard] = useState(false);

  let selectedIdx = 
    selectedCard && cards.findIndex((card) => card.id === selectedCard.id);
  
  useEffect(() => {
    if (user) {
      fetchCards(user.id!, (fetchedCards: Card[]) => {
        setCardsFetched(true);
        if (!fetchedCards.length) {
          toggleAddCard(true);
        }
      });
    } else {
      setCardsFetched(true);
      toggleAddCard(true);
    }
  }, [fetchCards, user]);

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

  return cardsFetched ? (
    <div className="cards-comp">
      {cards.length === 0 && (
        <Elements
          stripe={stripePromise}
        >
          <StripeFields toggleAddingCard={() => toggleAddCard(false)} />
        </Elements>
      )}
      {!addingCard && (
        <div className="w-full">
          {cards.map((card, i) => (
            <div className= "flex justify-between"
              key={i}
            >
              <div
                className={'font-sofia font-bold text-sm flex'}
                onClick={() => selectCard(card)}
              >
                <Radio
                  style ={{
                    color: "green_select",
                    width: '0px'
                  }}
                  checked={selectedIdx === i}
                  onChange={() => null}
                />
                <CardLogo cardType={card.type} />
                <div className="pl-2 flex flex-col justify-center"> 
                  {shortenType(card.type)} .... {card.last4}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ) : (
    <div />
  );
};