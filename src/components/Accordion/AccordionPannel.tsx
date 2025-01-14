import { FC, PropsWithChildren } from "react";
import { useAccordionContext } from ".";
import { accordionCls } from "../../consts/className";

interface AccordionPannelProps extends PropsWithChildren {
  index?: number;
}

const AccordionPannel: FC<AccordionPannelProps> = (props) => {
  const { children, index = 0 } = props;
  const { expandedIndexs } = useAccordionContext();
  return expandedIndexs.includes(index) ? (
    <div className={`${accordionCls}-pannel`}>{children}</div>
  ) : null;
};
export default AccordionPannel;
