import { configcatSubdomain } from '../utils';
import { subdomains } from '../constants/subdomains';
const { REACT_APP_FORCE_ALPACA, REACT_APP_FORCE_WEWORK } = process?.env;

//gets configcat text value based on subdomain
export async function getConfigCatVal(flagId: string, defaultValue: any) {

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
  const value = await await configcatSubdomain(
    keyFound || 'getReef'
  ).getValueAsync(flagId, defaultValue);
  return value;
}
