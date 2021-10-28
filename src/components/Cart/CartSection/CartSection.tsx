import { CartItem } from '../..';
import { MenuItem, Brand, Quantities } from '../../../interfaces';

export interface CartSectionProps {
  cart: MenuItem[];
  quantities: Quantities;
  brand: Brand;
  checkout: boolean;
}
/**
 *
 * Component for each section of a cart. There will be one cart section for
 * each brand that has been added to the cart.
 */
export const CartSection = ({ cart, quantities, brand, checkout }: CartSectionProps) => {
  return (
    <div className="cart-section">
      <div className={`font-bold font-grotesque text-content_black ${checkout ? 'text-lg ' : 'text-2xl mt-3'}`}>{brand.name}</div>
      {cart.map((item, idx) => (
        <CartItem key={idx} item={item} quantities={quantities} brand={brand} checkout={checkout}/>
      ))}
    </div>
  );
};
