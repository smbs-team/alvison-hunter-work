import { useEffect, useState } from 'react';
import { useQueryParam, StringParam } from 'use-query-params';
import { useLocation } from 'react-router';
import './PartnerBanner.scss';

import { PARTNER_LIST } from '../../../constants/PARTNERS-LIST';

const PartnerBanner = () => {
  const routerLocation = useLocation();

  const [partnerQueryParam] = useQueryParam('partner', StringParam);
  const [partnerProperties, setPartnerProperties]: any = useState(null);
  //get selected partner properties
  useEffect(
    function () {
      setPartnerProperties(PARTNER_LIST[partnerQueryParam || 'default']);
    },
    [partnerQueryParam]
  );

  //! Render
  return (
    <>
      {!routerLocation.pathname.match(/checkout/gi) && partnerProperties && (
        <div
          className="partner-banner"
          style={{ backgroundColor: partnerProperties?.bgColor }}
        >
          {/* Partner logo */}
          {partnerProperties.logo ? (
            <img
              src={
                require(`../../../assets/partner-icons/${partnerProperties?.logo}`)
                  ?.default
              }
              alt={partnerProperties?.name}
              height="30px"
            />
          ) : (
            partnerProperties.name
          )}
        </div>
      )}
    </>
  );
};

export default PartnerBanner;
