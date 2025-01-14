import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

import { accordionCls } from "../../consts/className";
import AccordionButton from "./AccordionButton";
import AccordionPannel from "./AccordionPannel";

interface AccordionContextProps {
  expandedIndexs: number[];
  handleChangeExpanded: (index: number) => void;
}
const AccordionContext = createContext<AccordionContextProps>({
  expandedIndexs: [],
  handleChangeExpanded: () => {},
});
export const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw Error("(!) Accordion 컨텍스트를 호출할 수 없는 범위입니다.");
  }
  return context;
};

interface AccordionProps extends PropsWithChildren {}
interface AccordionCompoundProps {
  Button: typeof AccordionButton;
  Pannel: typeof AccordionPannel;
}
const Accordion: FC<AccordionProps> & AccordionCompoundProps = (props) => {
  const [expandedIndexs, setExpandedIndexs] = useState<number[]>([]);
  const { children } = props;
  const handleChangeExpanded = (index: number) => {
    setExpandedIndexs((prev) =>
      prev.includes(index)
        ? prev.filter((prevExpandedIndex) => prevExpandedIndex !== index)
        : [...prev, index]
    );
  };
  const contextValue: AccordionContextProps = {
    expandedIndexs,
    handleChangeExpanded,
  };
  // const _children = useMemo(
  //   () => Children.toArray(children) as ReactElement[],
  //   [children]
  // );
  // console.log(children);

  // const [accordionButtons, accordionPannels] = useMemo(
  //   () => [
  //     _children.filter((child) => child.type === AccordionButton),
  //     _children.filter((child) => child.type === AccordionPannel),
  //   ],
  //   [_children]
  // );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={accordionCls}>
        {/* {accordionButtons.map((accordionButton, buttonIndex) => {
          return (
            <div>
              {cloneElement(accordionButton, {
                ...accordionButton.props,
                index: buttonIndex,
              })}
              {cloneElement(accordionPannels[buttonIndex], {
                ...accordionPannels[buttonIndex].props,
                index: buttonIndex,
              })}
            </div>
          );
        })} */}
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

Accordion.Button = AccordionButton;
Accordion.Pannel = AccordionPannel;

export default Accordion;
