import { AMEX, VISA, Mastercard, GenericCard, Discover } from '../../../assets/icons';

/**
 *
 * @returns
 * A component that returns the appropriate card logo
 */

 const cardComponents : { [key: string]: any } = {
  "Visa": VISA,
  "American Express" : AMEX,
  "MasterCard": Mastercard, 
  "Discover": Discover,
  "JCB": GenericCard, 
  "Diners Club": GenericCard, 
  "UnionPay": GenericCard
};

export interface CardLogoProps {
  cardType: string;
}

export const CardLogo = ({
  cardType
}: CardLogoProps) => {
  const SpecificCard = cardComponents[cardType];
  return (
    <div className="flex flex-col justify-center pl-1_5">
      <SpecificCard />
    </div>
    
  );
};