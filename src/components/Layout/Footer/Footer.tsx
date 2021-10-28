import { Link } from 'react-router-dom';
import '../../../styles/footer.scss';
import { Facebook, Instagram, GetReefLogo } from '../../../assets/icons';
import { NAME_SPACE } from '../../../utils/constants';
import { useMemo } from 'react';

const { REACT_APP_FORCE_ALPACA } = process?.env;
/**
 *
 * A component for the Footer that is at the bottom of the screen.
 */
export const Footer = () => {
  const alpaca = useMemo(
    () =>
      window.location.href.indexOf(`alpaca.getreef.com`) > -1 ||
      window.location.href.indexOf(`alpaca-stg.getreef.com`) > -1 || 
      REACT_APP_FORCE_ALPACA,
    []
  );

  const contact = useMemo(() => 
    alpaca ? {
      email: "mailto:AlpacaSupport@getreef.com", 
      phone: "tel:+18889307333",
      phone_format: " 1-888-930-7333"
    } : {
      email: "mailto:support@getreef.com", 
      phone: "tel:+18887107333",
      phone_format:"1-888-710-7333"
    }
  , [alpaca])
  
  return (
    <div>
      <div className="desktop ">
        <div className="horiz-center">
          <div className="footer footer-desktop">
            <div className="branding branding-desktop">
              <div className="support">
              Need help with your order? Have a question? <br />
              Contact us at{' '}
              <a href={contact.email}>
                {contact.email.substring(7)}
              </a> or <a href={contact.phone}>{contact.phone_format}</a>
              </div>
              <div className="logo">
                <GetReefLogo height={50} width={150} className="-ml-1_5" />
                <br />
                <div className="reef-tech">
                  {' '}
                  ©2021 REEF Technology Inc. All rights reserved
                </div>
              </div>
            </div>
            <div className="links">
              <div className="reef-links">
                <span className="main">{NAME_SPACE.ABOUT}</span>
                <br />
                <a
                  className="link"
                  href="https://reeftechnology.com/careers/"
                  target="_blank"
                  rel="noreferrer"
                >
                  { NAME_SPACE.DRIVE }
                </a>{' '}
                <br />
                <a
                  className="link"
                  href="https://reeftechnology.com/careers/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Careers
                </a>{' '}
                <br />
                <a
                  className="link"
                  href="https://reeftechnology.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  {NAME_SPACE.PARTNER}
                </a>{' '}
                <br />
                <Link className="link" to="/termsOfUse">
                  Terms of Use
                </Link>{' '}
                <br />
                <Link className="link" to="/privacyPolicy">
                  Privacy Policy
                </Link>
                <br />
              </div>
              <div className="social-links">
                <a
                  className="social-link"
                  href="https://www.facebook.com/getREEF/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Facebook />
                </a>
                <a
                  className="social-link"
                  href="https://www.instagram.com/getreef/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Instagram />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mobile">
        <div className="horiz-center">
          <div className="footer ">
            <div className="support stack">
              Need help with your order? Have a question? <br />
              Contact us at{' '}
              <a href={contact.email}>
                {contact.email.substring(7)}
              </a> <br /> 
              or <a href={contact.phone}>{contact.phone_format}</a>
            </div>
            <div className="links stack">
              <div className="reef-links">
                <span className="main">{ NAME_SPACE.ABOUT }</span>
                <br />
                <a
                  className="link"
                  href="https://reeftechnology.com/careers/"
                  target="_blank"
                  rel="noreferrer"
                >
                  { NAME_SPACE.DRIVE }
                </a>{' '}
                <br />
                <a
                  className="link"
                  href="https://reeftechnology.com/careers/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Careers
                </a>{' '}
                <br />
                <a
                  className="link"
                  href="https://reeftechnology.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  { NAME_SPACE.PARTNER }
                </a>{' '}
                <br />
                <Link className="link" to="/termsOfUse">
                  Terms of Use
                </Link>{' '}
                <br />
                <Link className="link" to="/privacyPolicy">
                  Privacy Policy
                </Link>
                <br />
              </div>
              <div className="social-links">
                <a
                  className="social-link"
                  href="https://www.facebook.com/getREEF/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Facebook />
                </a>
                <a
                  className="social-link"
                  href="https://www.instagram.com/getreef/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Instagram />
                </a>
              </div>
            </div>
            <div className="logo stack">
              <GetReefLogo height={50} width={150} className="-ml-1_5" />
              <br />
              <div className="reef-tech">
                {' '}
                ©2021 REEF Technology Inc. All rights reserved
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
