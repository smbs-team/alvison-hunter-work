import * as configcat from 'configcat-js';
//sets client based on subdomain
export const configcatSubdomain = (domain: string) => {
  // log to console if level is "development"
  const logLevel = process.env.NODE_ENV === 'development' ? 3 : 1;
  const logger = configcat.createConsoleLogger(logLevel);
  const pollInterval = 60; // 1 minute

  //current (sub)domain key variables
  const keys: { [key: string]: string | undefined } = {
    getReef: process.env.REACT_APP_CONFIGCAT_SDK_KEY,
    wework: process.env.REACT_APP_CONFIGCAT_WEWORK_SDK_KEY,
    alpaca: process.env.REACT_APP_CONFIGCAT_ALPACA_SDK_KEY,
  };

  // use proper (sub)domain key. fallback to mock sdk key for testing
  const sdkKey: string = keys[domain] || 'fds374897hfdjsa83w';

  const clientSubdomain = configcat.createClientWithAutoPoll(sdkKey, {
    pollIntervalSeconds: pollInterval,
    logger,
  });
  return clientSubdomain;
};
