import { FC } from "react";
import { createPortal } from "react-dom";

interface LoadingProps {
  isLoading: boolean;
}

const Loading: FC<LoadingProps> = ({ isLoading }) => {
  return isLoading
    ? createPortal(
        <>
          <div className={"loading-mask"} />
          <div className={"loading-spinner"}>
            <div className="loadingio-spinner-spinner-nq4q5u6dq7r">
              <div className="ldio-x2uulkbinbj">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div className={"loading-text"}>Loading</div>
          </div>
        </>,
        document.body
      )
    : null;
};
export default Loading;
