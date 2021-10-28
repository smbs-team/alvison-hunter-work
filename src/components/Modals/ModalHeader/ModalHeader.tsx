import { styles } from '../../../styles/sharedTailwindClasses';
import { CloseIcon } from '../../../assets/icons';
const {
  vertCenter,
  borderBottom,
} = styles;

/**
 * 
 * @param param0 
 * @returns 
 * The styles in this modal header should be usable as a header for
 * most of the modals in the current design.
 */
export function ModalHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className={`flex justify-between py-4 px-4 ${borderBottom} leading-7`}>
      <div className="w-3 h-3" />
      <div className="text-center font-sofia font-bold text-lg">
        Edit Delivery Time
      </div>
      <div className={`leading-7 ${vertCenter}`}>
        <CloseIcon
          className="h-3 w-3 align-middle cursor-pointer"
          onClick={onClose}
        />
      </div>
    </div>
  );
}
