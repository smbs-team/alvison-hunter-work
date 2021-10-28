import { subdomains } from '../constants/subdomains';
const { REACT_APP_FORCE_ALPACA, REACT_APP_FORCE_WEWORK } = process?.env;

//fetch subdomain based on url or dev env 
export function getSubdomain() {

  let keyFound = Object.keys(subdomains).find(
    (key) =>
      window.location.href.includes(`${key}.getreef.com`) ||
      window.location.href.includes(`${key}-stg.getreef.com`)
  )
  if (REACT_APP_FORCE_WEWORK) {
    keyFound = 'wework';
  }
  if (REACT_APP_FORCE_ALPACA) {
    keyFound = 'alpaca';
  }

  return keyFound || 'getReef';
}
