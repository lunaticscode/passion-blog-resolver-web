import { FC, PropsWithChildren } from "react";
import { tabCls } from "../../consts/className";
interface TabPannelProps extends PropsWithChildren {}
const TabPannel: FC<TabPannelProps> = (props) => {
  const { children } = props;
  return <div className={`${tabCls}-pannel`}>{children}</div>;
};

export default TabPannel;
