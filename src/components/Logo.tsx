import {useEffect, useState} from "react";
import { subdomains } from '../constants/subdomains'

const { REACT_APP_FORCE_ALPACA, REACT_APP_FORCE_WEWORK } = process?.env;

const Logo = () => {
  const [logo, setLogo] = useState<string>("reef_logo.svg")
    useEffect(() => {
      for (var key in subdomains) {
        if (
          window.location.href.indexOf(`${key}.getreef.com`) > -1 ||
          window.location.href.indexOf(`${key}-stg.getreef.com`) > -1
        ) {
          setLogo(`${key}_logo.svg`)
        }
      }
      if (REACT_APP_FORCE_WEWORK) {
        setLogo('wework_logo.svg');
      }
      if (REACT_APP_FORCE_ALPACA) {
        setLogo('alpaca_logo.svg');
      }
    }, []);
    return (
      <div>
        <img src={require(`../assets/icons/${logo}`)?.default} alt={"logo"} />
      </div>
    )
};
export default Logo 
