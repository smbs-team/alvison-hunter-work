import { CheckIcon } from '../assets/icons';

export interface ITrackingItem {
  icon: any;
  currentState: number;
  itemIndex: number;
}
/**
 *
 * @param param0
 * @returns
 * A component that is used for each tracking state in the tracking view.
 */
export const TrackingItem = ({
  icon,
  currentState,
  itemIndex
}: ITrackingItem) => {
  const highlighted = currentState > itemIndex;
  const lastElementIndex = 4;
  return (
    <>
      <div className="tracking-section">
        <div className={`circleBox line ${highlighted ? 'check-icon' : 'other-icon'}`}>
          <div className="inner-round">{highlighted ? <CheckIcon /> : icon}</div>
        </div>
      </div>
      {itemIndex !== lastElementIndex && <div className="horizontal-dotted-line"></div>}
    </>
  );
};
