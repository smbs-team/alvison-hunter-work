import { CartSection} from '../../components';
import { Brand, Carts, Quantities, SearchResults } from '../../interfaces';
import { useHistory } from 'react-router-dom';
import { filterCartsBySearchResults } from '../../utils';
import '../../styles/checkout.scss';
import { StringParam, useQueryParam } from 'use-query-params';


/**
 *
 * A component that displays the users pickup or delivery address 
 * and subdomain specific order notes.  
 * 
 */

 export interface CartSummaryProps {
  searchLoaded: boolean, 
  searchResults: SearchResults | null,
  orderType: string,
  carts: Carts, 
  quantities: Quantities, 
}

export const CartSummary= ({ searchLoaded, searchResults, orderType, carts, quantities}: CartSummaryProps) => {
  
  const [partnerQueryParam] = useQueryParam('partner', StringParam);
  const location =  partnerQueryParam ? `/location?partner=${partnerQueryParam}` : `/location`
  
  const history = useHistory();
  
  const filteredCarts = filterCartsBySearchResults(
    carts,
    searchResults ? [searchResults] : [],
    orderType
  );

  return (
    <div className="section-body lg:pl-6 lg:w-full">
      <div className="text-right font-sofia text-sm underline text-teal cursor-pointer hidden md:block" onClick={() => {
          history.push(location)
        }}>Add Items</div>
      {searchLoaded && searchResults && searchResults.brands
      ? Object.keys(filteredCarts).map((brandId, idx) => {
          const brand = searchResults.brands.find(
            (each: Brand) => each.id === brandId
          );
          return Object.keys(filteredCarts[brandId]).length &&
            brand ? (
            <CartSection
              key={idx}
              cart={filteredCarts[brandId]}
              quantities={quantities}
              brand={brand}
              checkout={true}
            />
          ) : (
            ''
          );
        })
      : ''}
    </div>
  );
};
