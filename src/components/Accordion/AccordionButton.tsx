import { CSSProperties, FC, PropsWithChildren } from "react";
import { useAccordionContext } from ".";
import ChevronDownIcon from "../icons/ChevronDownIcon";
import { accordionCls } from "../../consts/className";

interface AccordionButtonProps extends PropsWithChildren {
  index?: number;
  bgColor?: CSSProperties["backgroundColor"];
}
const AccordionButton: FC<AccordionButtonProps> = (props) => {
  const { children, index = 0, bgColor = "" } = props;
  const { handleChangeExpanded, expandedIndexs } = useAccordionContext();

  const handleClickButton = () => {
    handleChangeExpanded(index);
  };

  return (
    <div
      onClick={handleClickButton}
      className={`${accordionCls}-button`}
      style={{ background: bgColor }}
    >
      <div className={`${accordionCls}-button-title`}>{children}</div>
      <ChevronDownIcon
        className={`${accordionCls}-button-icon`}
        width={24}
        strokeWidth={3}
        data-active={expandedIndexs.includes(index)}
      />
    </div>
  );
};
export default AccordionButton;
