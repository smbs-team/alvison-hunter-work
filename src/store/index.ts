import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import reduxThunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

declare global {interface Window {dataLayer: any;}}
declare global {interface Window {analytics: any;}}


const logger = createLogger(
    {
      //diff: true
    }
);


const middleware: any[] = [reduxThunk];
// The logger should only be added below if NODE_ENV is production
if (process.env.NODE_ENV !== 'production') {
  middleware.push(logger);
}


const composeEnhancers = composeWithDevTools({
    // options like actionSanitizer, stateSanitizer
});


export default createStore(
    rootReducer,
    /* preloadedState, */ composeEnhancers(
        applyMiddleware(...middleware)
        // other store enhancers if any
    )
);
