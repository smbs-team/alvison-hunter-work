import { useEffect, useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Store } from '../../../interfaces';
import { useHistory } from 'react-router-dom';
import { Cart, Modal, RecentItemAddedPopUp } from '../../index';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { useSelector } from 'react-redux';
import { useActions } from '../../../hooks';
import Logo from '../../Logo';
import PartnerBanner from '../PartnerBanner/PartnerBanner';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {
  flattenStore,
  filterCartsBySearchResults,
  countCartItems,
} from '../../../utils';
import * as rawActions from '../../../store/actions';
import './nav.scss';

import { PAGES_WITHOUT_NAV_BAR } from '../../../constants/PAGES-WITHOUT-NAV-BAR';
import { Button } from '@material-ui/core';
import MenuDrawer from '../MenuDrawer/MenuDrawer';
import SecondNavBar from './SecondNavBar/SecondNavBar';
/**
 *
 * A component for the Nav that is at the top of the screen at anytime. It can be customized
 * to appear or hide based on what route is currently updated, and can change dynamically.
 */
export const Nav = () => {
  const {
    user,
    carts,
    quantities,
    searchResults,
    selectedLocation,
    showCart,
    orderType,
    showRecentItem
  } = useSelector((store: Store) => flattenStore(store));

  const { toggleCart, me, toggleRecentItem } = useActions(rawActions);

  const history = useHistory();

  const [currentPath, setCurrentPath] = useState(history.location.pathname);

  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);

  const toggleDrawerFunction =
    (isOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setIsMenuDrawerOpen(isOpen);
    };

  // If the browser 'history' or loggedUser changes, check the user logged status and scroll to top
  useEffect(() => {
    me();
    history.listen(() => {
      setCurrentPath(history.location.pathname);
    });
  }, [me, history]);

  const isLanding = currentPath === '/';
  const isBrand = currentPath.includes('/brand');
  const isLocation = currentPath.includes('/location');
  const isOffering = currentPath.includes('/offering');
  const isCheckout = currentPath.includes('/checkout');

  const filteredCarts = useMemo(() => filterCartsBySearchResults(
    carts,
    searchResults ? [searchResults] : [],
    orderType
  ),
    [carts, searchResults, orderType]);

  const itemCount = useMemo(() => countCartItems(
    filteredCarts,
    quantities
  ),
    [filteredCarts, quantities]);

  const cartButtonRef = useRef<HTMLButtonElement>(null)

  //! render
  return (
    <>
      {/* If the current page doesn't exclude the nav */}
      {!PAGES_WITHOUT_NAV_BAR.some((page) =>
        currentPath.includes(`${page}`)
      ) && (
          <div className={`nav ${isLanding ? 'no-border bg-white' : ''}`}>
            {/* Main bar */}
            <div className={`inner-nav`}>
              <div className="flex items-center">
                {/* Drawer menu */}
                <div className="mr-2">
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleDrawerFunction(true)}
                  >
                    <MenuIcon />
                  </IconButton>
                </div>

                {/* Logo */}
                <div className="logo">
                  <Link
                    to={
                      !isLanding
                        ? `/location${selectedLocation && orderType === 'takeaway'
                          ? `/${selectedLocation}`
                          : ''
                        }${history.location.search}`
                        : '/'
                    }
                  >
                    <Logo />
                  </Link>
                </div>
              </div>

              <div className="flex items-center">
                {/* Login / Sign Up */}
                {isLanding && !user && (
                  <>
                    <Button
                      component={Link}
                      to="/login"
                      className="mr-0 sm:mr-3 px-1 nav-bar-link-btn"
                    >
                      Login
                    </Button>

                    <Button
                      component={Link}
                      to="/signup"
                      classes={{ root: 'px-1 sm:px-3 nav-bar-dark-btn' }}
                      variant="contained"
                      color="primary"
                      disableElevation
                    >
                      Sign Up
                    </Button>
                  </>
                )}

                {/* Cart icon */}
                {!isLanding && !!searchResults && !isCheckout && (
                  <Button
                    variant="contained"
                    color={itemCount ? `primary` : 'inherit'}
                    startIcon={
                      <ShoppingCartIcon
                        style={{ color: itemCount ? 'inherit' : '#030E1B' }}
                      />
                    }
                    ref={cartButtonRef}
                    onClick={() => toggleCart(true)}
                  >
                    <span
                      className="relative"
                      style={{
                        top: '2px',
                        color: itemCount ? 'inherit' : '#030E1B',
                      }}
                    >
                      {itemCount}
                    </span>
                  </Button>
                )}
              </div>
            </div>
            {/* Main bar END */}

            {(isBrand || isLocation || isOffering) &&
              <SecondNavBar />
            }

            <PartnerBanner />

            <MenuDrawer
              anchorPosition="left"
              isDrawerOpen={isMenuDrawerOpen}
              toggleDrawerFunction={toggleDrawerFunction}
            />

            {/*  Cart view/slide */}
            {!!showCart && (
              <>
                <Modal
                  type={'menu-item-modal'}
                  modalClass="hang-right"
                  onClose={() => toggleCart(false)}
                  hideClose={true}
                  useNav={true}
                  content={
                    <Cart filteredCarts={filteredCarts} quantities={quantities} />
                  }
                />
              </>
            )}

            {/*  Recently Added Item view/slide */}
            < div className="desktop">
              {!!showRecentItem && (
                <Modal
                  type={'recent-item-modal'}
                  modalClass="no-background"
                  hideClose={true}
                  isRecentItem={true}
                  onClose={() => toggleRecentItem(false)}
                  content={
                    <RecentItemAddedPopUp filteredCarts={filteredCarts} quantities={quantities} itemCount={itemCount} />
                  }
                />
              )}
            </div>
          </div>
        )}
    </>
  );
};
