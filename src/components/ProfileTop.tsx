import { BackIcon, AddIcon } from '../assets/icons';
import '../styles/profile-top.scss';

export interface ProfileTopProps {
  onBack(): void;
  onNew?: () => void;
  hasNew?: boolean;
  topText: string;
  newText?: string;
}
/**
 *
 * @param param0
 * @returns
 * A component to use at the top of profile views.
 */
export const ProfileTop = ({
  onBack,
  hasNew,
  onNew,
  topText,
  newText,
}: ProfileTopProps) => (
  <div className="profile-top">
    <div>
      <BackIcon onClick={onBack} />
      <div className="space-bt">
        <div className="top-text">{topText}</div>
        {hasNew ? (
          <div className="add-new" onClick={onNew}>
            <AddIcon />
            {newText}
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  </div>
);
