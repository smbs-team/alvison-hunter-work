import { ProfileTop } from '../../../components';
import { Store } from '../../../interfaces';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { Wallet, CloseIcon } from '../../../assets/icons';
import { useActions } from '../../../hooks';
import { useSelector } from 'react-redux';
import { flattenStore } from '../../../utils';
import * as rawActions from '../../../store/actions';
import '../../../styles/cards.scss';
/**
 *
 * @returns
 * A component for a list of a user's cards
 */
export const Cards = () => {
  const { cards, user } = useSelector((store: Store) => flattenStore(store));
  const { fetchCards, deleteCard } = useActions(rawActions);
  useEffect(() => {
    if (user) {
      fetchCards(user.id!);
    }
  }, [fetchCards, user]);
  const history = useHistory();
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'virtual_pageview',
      page_title: 'profile:paymentMethods',
      page_url: window.location.pathname,
    });
  }, []);

  return (
    <div>
      <ProfileTop
        onBack={() => history.goBack()}
        hasNew={true}
        onNew={() => history.push('/profile/cards/new')}
        topText={'Payment'}
        newText={'Add new'}
      />
      <div className="card-list">
        {cards.length === 0 && (
          <div className="card-center">
            <Wallet />
            <br />
            <div className="type s16 card-msg">No saved payment methods</div>
          </div>
        )}
        {cards.map((card, idx) => (
          <div key={idx} className="card-list-item type s14">
            <div className="space-bt">
              <div>
                {card.type} ***{card.last4}
              </div>
              <div>
                <CloseIcon onClick={() => deleteCard(user!.id!, card.id)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
