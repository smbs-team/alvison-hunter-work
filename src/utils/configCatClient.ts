import * as configcat from 'configcat-js';

export const configCatClient = () => {
  // log to console if level is "development"
  const logLevel = process.env.NODE_ENV === 'development' ? 3 : 1;
  const logger = configcat.createConsoleLogger(logLevel);
  const pollInterval = 60; // 1 minute
  // fallback to mock sdk key for testing
  const sdkKey: string = process.env.REACT_APP_CONFIGCAT_SDK_KEY || 'fds374897hfdjsa83w';

  const client = configcat.createClientWithAutoPoll(sdkKey, {
    pollIntervalSeconds: pollInterval,
    logger,
  });
  return client;
};
