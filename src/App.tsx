import { BrowserRouter as Router, Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ThemeProvider } from '@material-ui/core/styles';
import { StylesProvider } from '@material-ui/core/styles';


import { Provider } from 'react-redux';
import store from './store';
import { Nav, ModalWrapper, Routes } from './components';
import MUITheme from "./theme/MUITheme";

import 'normalize.css/normalize.css';
import './styles/type.scss';
import "./styles/SassStylesConfig/_css-variables.scss"; //css variables
import './styles/type.scss'; //custom old utilities
import "./styles/SassStylesConfig/_utilities.scss"; //custom utilities
import "./styles/SassStylesConfig/tailwindUtilities.css";  /* @tailwind utilities; */

declare global {
  interface Window {
    initMap: () => void;
  }
}

export const App = () => {
  return (
      <Router>
          <QueryParamProvider ReactRouterRoute={Route}>
              <ThemeProvider theme={MUITheme}>
                  <StylesProvider injectFirst>
                      <Provider store={store}>
                          <ModalWrapper/>
                          <Nav/>
                          <Routes/>
                      </Provider>
                  </StylesProvider>
              </ThemeProvider>
          </QueryParamProvider>
      </Router>
  );
};

export default App;
