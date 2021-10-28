import wrap from '../../../assets/images/burritos.jpg';
import { Button } from '../../../components';
import '../../../views/Landing/landing.scss';
import { NavHashLink } from 'react-router-hash-link';
import { scrollWithOffset } from '../../../utils/scrollToWithOffset';

export const OrderNow = () => {
  return (
    <div>
      <div className="horiz-center">
        <div className="flash-banner">
          <div className="burritos-desktop">
            <img alt="plate of burritos" src={wrap} />
          </div>
          <div className="burritos-mobile mt-2">
            <img
              alt="plate of burritos"
              src={
                'https://ik.imagekit.io/getreef/reefmarketplacedsp/site-images/wraps-mobile.png'
              }
            />
          </div>
          <div className="flash-text">
            <div>
              <div className="title-type pt-2 lg:pt-0">
                Fast Wasn't Fast Enough
              </div>
            </div>
            <div>
              <div className="body-type">
                You've never seen delivery this fast.
                <br />
                Meals in 30 and snacks in 10. GO!
                <div className="outer-btn-holder">
                  <NavHashLink
                    elementId="addressInput"
                    to={{ pathname: '', search: window.location.search }}
                    smooth
                    scroll={(el) => {
                      scrollWithOffset(el, -300);
                    }}
                  >
                    <Button
                      btnClass="small mb-2 lg:mb-0"
                      content={'Order Now'}
                      clickFunc={() => {}}
                    />
                  </NavHashLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
