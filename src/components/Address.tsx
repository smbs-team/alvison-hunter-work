import { Address as AddressInterface } from '../interfaces';
import { EditIcon, CloseIcon } from '../assets/icons';

export interface AddressProps {
  address: AddressInterface;
  onEdit(): void;
  onDelete(): void;
}

/**
 *
 * @param param0
 * A component for the address show view.
 */
export const Address = ({ address, onEdit, onDelete }: AddressProps) => {
  return (
    <div className="type s14 address-list-item">
      <div className="space-bt">
        <div>{address.line1}</div>
        <div onClick={onEdit}>
          <EditIcon />
        </div>
      </div>
      <div>{address.line2 ? <div>{address.line1}</div> : ''}</div>
      <div className="space-bt">
        <div>
          {address.city} {address.state}, {address.zip}
        </div>
        <div onClick={onDelete}>
          <CloseIcon />
        </div>
      </div>
    </div>
  );
};
