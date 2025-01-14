import { FC } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "../icons/CloseIcon";

interface ConvertResultProps {
  result: string;
  open: boolean;
  onClose: () => void;
}

const ConvertResultModal: FC<ConvertResultProps> = (props) => {
  const { result, open, onClose } = props;
  return open
    ? createPortal(
        <>
          <div className={"convert-result-modal-mask"} />
          <div className={"convert-result-modal"}>
            <div className={"convert-result-modal-close-icon"}>
              <CloseIcon width={30} onClick={onClose} />
            </div>
            <textarea className={"convert-result-modal-text"}>
              {result}
            </textarea>
          </div>
        </>,
        document.body
      )
    : null;
};
export default ConvertResultModal;
