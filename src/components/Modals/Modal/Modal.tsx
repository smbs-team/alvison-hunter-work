import { CloseIcon } from '../../../assets/icons';
import { useEffect, useState } from 'react';
import { UnregisterCallback } from 'history';
import { useHistory } from 'react-router-dom';
import './modal.scss';
import FocusTrap from "focus-trap-react";

export interface ModalProps {
  onClose?: (passedVal?: any) => void;
  content: any;
  type: string;
  modalClass?: string;
  hideClose?: boolean;
  isChildModal?: boolean;
  useNav?: boolean;
  blocNav?: boolean;
  isRecentItem?: boolean;
}
/**
 *
 * A reusable modal component that is used in a number of different places for modals
 * that are styled in the modal.scss stylesheet.
 */
export const Modal = ({
  onClose,
  content,
  type,
  modalClass,
  hideClose,
  isChildModal,
  useNav,
  isRecentItem
}: ModalProps) => {
  const history = useHistory();
  const initialPath = window.location.pathname;
  const [listeningToHistory, setListening] = useState(false);
  useEffect(() => {
    let unblock: UnregisterCallback;
    if (!listeningToHistory) {
      if (isChildModal) {
        // Blocks navigation when the open modal is a child modal and then
        // closes the modal without nav if the history changes onces
        unblock = history.block();
        const unlisten = history.listen((action) => {
          if (onClose && isChildModal) {
            onClose();
            unblock();
            unlisten();
          }
        });
        setListening(true);
      } else if (useNav) {
        // This history listener makes it so that the modal can be closed with the
        // back button in the browser
        history.push(initialPath + history.location.search);
        const unlisten = history.listen((change) => {
          if (history.action === 'POP' && onClose) {
            onClose();
            unlisten();
          }
        });
        setListening(true);
      }
    }
    // This and the return function make sure that what is behind a modal when it is
    // not open is not scrollable
    if (!isChildModal && !isRecentItem) {
      document.body.style.overflow = 'hidden';
    }
    return function () {
      if (unblock) {
        unblock();
      }
      if (!isChildModal && !isRecentItem) {
        document.body.style.overflow = 'visible';
      }
    };
  }, [
    history,
    onClose,
    isChildModal,
    initialPath,
    useNav,
    listeningToHistory,
    setListening,
    isRecentItem
  ]);


  return (
      <FocusTrap>
        <div className={`modal ${modalClass}`} onClick={() => onClose && onClose()}>
          <div
              className={`modal-content ${type} ${isChildModal ? 'child-modal' : ''}`}
              onClick={(e) => e.stopPropagation()}
          >
            {onClose && !hideClose && (
                <CloseIcon
                    className="default-close"
                    onClick={() => {
                      useNav && history.goBack();
                      onClose();
                    }}
                />
            )}
            {content}
          </div>
        </div>
      </FocusTrap>
  );
};
