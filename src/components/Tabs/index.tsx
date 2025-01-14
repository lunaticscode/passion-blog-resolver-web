import {
  Children,
  cloneElement,
  createContext,
  FC,
  PropsWithChildren,
  ReactElement,
  useContext,
  useMemo,
  useState,
} from "react";

import TabItem from "./TabItem";
import TabPannel from "./TabPannel";
import { tabCls } from "../../consts/className";

export type TabItemValue = string | number;
interface TabsContextProps {
  currentTab: TabItemValue;
  handleChangeTab: (tabItem: TabItemValue) => void;
}
const TabsContext = createContext<TabsContextProps>({
  currentTab: "",
  handleChangeTab: () => {},
});

export const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw Error("(!) TabsContext를 호출할 수 없는 범위입니다.");
  }
  return context;
};
interface TabsProps extends PropsWithChildren {}
interface TabsCompoundProps {
  Item: typeof TabItem;
  Pannel: typeof TabPannel;
}

const Tabs: FC<TabsProps> & TabsCompoundProps = (props) => {
  const { children } = props;
  const [currentTab, setCurrentTab] = useState<TabItemValue>("");

  const handleChangeTab = (tabItem: TabItemValue) => {
    setCurrentTab(tabItem);
  };

  const contextValue = {
    currentTab,
    handleChangeTab,
  };

  const _children = Children.toArray(children) as ReactElement[];

  const [tabItems, tabPannels] = useMemo(
    () => [
      _children.filter((child) => child.type === TabItem),
      _children.filter((child) => child.type === TabPannel),
    ],
    [_children]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={`${tabCls}`}>
        <div className={`${tabCls}-tab-items-wrapper`}>
          {tabItems.map((tabItem, index) =>
            cloneElement(tabItem, { ...tabItem.props, index })
          )}
        </div>
        <div className={`${tabCls}-tab-pannels-wrapper`}>
          {tabPannels.map((tabPannel, index) =>
            cloneElement(tabPannel, { ...tabPannel.props, index })
          )}
        </div>
      </div>
    </TabsContext.Provider>
  );
};

Tabs.Item = TabItem;
Tabs.Pannel = TabPannel;
export default Tabs;
