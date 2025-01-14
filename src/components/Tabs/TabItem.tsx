import { FC, PropsWithChildren } from "react";
import { tabCls } from "../../consts/className";
import { TabItemValue, useTabsContext } from ".";

interface TabItemProps extends PropsWithChildren {
  value: TabItemValue;
  index?: number;
}
const TabItem: FC<TabItemProps> = (props) => {
  const { children, value } = props;

  const { currentTab, handleChangeTab } = useTabsContext();
  const handleClickTabItem = () => {
    if (currentTab === value) return;
    handleChangeTab(value);
  };
  return (
    <div onClick={handleClickTabItem} className={`${tabCls}-item`}>
      {children}
      <select></select>
    </div>
  );
};

export default TabItem;
