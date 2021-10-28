import { Switch, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { lazily } from 'react-lazily';
import { Tracking } from '../views/Tracking/Tracking';

const {
  Grocery,
  Offering,
  AccountDetails,
  Brands,
  Checkout,
  Addresses,
  Brand,
  PrivacyPolicy,
  TermsOfUse,
  Cards,
  Signup,
  Landing,
  Login,
  NewAddress,
  NewCard,
  OrderGroup,
  Orders,
  PasswordReset,
  RequestPasswordReset,
  Admin,
} = lazily(() => import('../views'));
/**
 * A component that sets up all of the routes for react router. Any new
 * routes must be added here.
 */
export const Routes = () => {
  return (
    <Suspense fallback={<div />}>
      <Switch>
        <Route path="/privacyPolicy">
          <PrivacyPolicy />
        </Route>
        <Route path="/termsOfUse">
          <TermsOfUse />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/profile/details">
          <AccountDetails />
        </Route>
        <Route path="/profile/orders/:groupId">
          <OrderGroup />
        </Route>
        <Route path="/profile/orders">
          <Orders />
        </Route>
        <Route path="/profile/addresses/new">
          <NewAddress />
        </Route>
        <Route path="/profile/addresses">
          <Addresses />
        </Route>
        <Route path="/profile/cards/new">
          <NewCard />
        </Route>
        <Route path="/profile/cards">
          <Cards />
        </Route>
        <Route path="/offering">
          <Offering />
        </Route>
        <Route path="/location/:locationName">
          <Grocery />
        </Route>
        <Route path="/location">
          <Grocery />
        </Route>
        <Route path="/brands">
          <Brands type="all"/>
        </Route>
        <Route path="/wework">
          <Brands type="wework"/>
        </Route>
        <Route path="/brand/:brandNameAndId">
          <Brand />
        </Route>
        <Route path="/checkout">
          <Checkout />
        </Route>
        <Route path="/order/:orderId/tracking">
          <Tracking />
        </Route>
        <Route path="/passwords/request">
          <RequestPasswordReset />
        </Route>
        <Route path="/passwords/reset/:userId/:token">
          <PasswordReset />
        </Route>
        <Route path="/admin">
          <Admin />
        </Route>
        <Route path="/">
          <Landing />
        </Route>
      </Switch>
    </Suspense>
  );
};
