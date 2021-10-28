import { LoadingIcon } from '../../assets/icons';
import { MouseEvent } from 'react';
import '../../styles/button.scss';

export interface ButtonProps {
  clickFunc?: (e: MouseEvent) => void;
  content: any;
  subText?: string;
  disabled?: boolean;
  loading?: boolean;
  size?: string;
  btnClass?: string;
  largeText?: string;
  isSubmit?: boolean;
}

/**
 * A reusable button component with styles that can easily be changed
 * in all places that this component is used
 */
export const Button = ({
  clickFunc,
  content,
  subText,
  disabled,
  loading,
  size,
  btnClass,
  largeText,
  isSubmit,
}: ButtonProps) => {
  return (
    <div
      className={`btn-holder ${disabled ? 'disabled' : ''} ${
        loading ? 'loading' : ''
      } ${size || ''} ${btnClass || ''}`}
    >
      <button
        type={isSubmit ? 'submit' : 'button'}
        className={`button ${btnClass || undefined} ${
          largeText ? 'space-bt' : ''
        }`}
        onClick={clickFunc}
        disabled={loading || disabled}
      >
        {largeText ? (
          <div className="long-text vertical-center">{largeText}</div>
        ) : (
          ''
        )}
        {!loading ? (
          <div className={'vertical-center'}>
            <div
              className={`horiz-center ${largeText ? 'with-large-text' : ''}`}
            >
              <div>{content}</div>
            </div>
          </div>
        ) : (
          <div className={`loading-icon horiz-center`}>
            <div className={'loading-inner vertical-center'}>
              <LoadingIcon />
            </div>
          </div>
        )}
      </button>
      {!loading ? (
        <span className="sub-text">
          <div>{subText}</div>
        </span>
      ) : (
        ''
      )}
    </div>
  );
};
