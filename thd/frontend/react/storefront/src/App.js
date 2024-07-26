// src/App.js
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import Loading from './components/Loading'; // Fallback component for lazy loading

// Lazy load components
const Shop = React.lazy(() => import('./components/Shop'));
const HomeScreen = React.lazy(() => import('./components/HomeScreen'));
const OrderConfirm = React.lazy(() => import('./components/OrderConfirm'));
const Info = React.lazy(() => import('./components/Profile'));
const Register = React.lazy(() => import('./components/Register'));
const Checkout = React.lazy(() => import('./components/Checkout'));
const Confirm = React.lazy(() => import('./components/Confirm'));
const Details = React.lazy(() => import('./components/Details'));

// Mock useGlobalState for this example
const useGlobalState = (key) => {
  return key === 'isLoggedIn' ? true : false;
};

const AuthRoute = ({ component: Component, ...rest }) => {
  const isLoggedIn = useGlobalState('isLoggedIn');
  return (
    <Route 
      {...rest}
      render={(props) => (
        !isLoggedIn 
          ? <Component {...props} />
          : <Redirect to="/shop/menu" />
      )}
    />
  );
};

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isLoggedIn = useGlobalState('isLoggedIn');
  return (
    <Route 
      {...rest}
      render={(props) => (
        isLoggedIn 
          ? <Component {...props} />
          : <Redirect to="/login" />
      )}
    />
  );
};

const AuthStack = () => (
  <Switch>
    <AuthRoute path="/confirm" component={Confirm} />
    <AuthRoute path="/register" component={Register} />
    <AuthRoute path="/login" component={HomeScreen} />
  </Switch>
);

const ShopStack = () => (
  <Switch>
    <PrivateRoute path="/shop/menu" component={Shop} />
    <PrivateRoute path="/shop/checkout" component={Checkout} />
    <PrivateRoute path="/shop/details" component={Details} />
    <PrivateRoute path="/shop/order-confirm" component={OrderConfirm} />
  </Switch>
);

const AppTabs = () => (
  <>
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/profile">Profile</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/shop/menu">Shop</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    <React.Suspense fallback={<Loading />}>
      <Switch>
        <Route path="/profile" component={AuthStack} />
        <Route path="/shop" component={ShopStack} />
        <Redirect from="/" to="/profile" />
      </Switch>
    </React.Suspense>
  </>
);

export default function App() {
  return (
    <Router>
      <AppTabs />
    </Router>
  );
}