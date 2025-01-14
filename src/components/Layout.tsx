import { FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {}
const Layout: FC<LayoutProps> = () => {
  return (
    <>
      <Header />
      <Sidebar />
      <Outlet />
    </>
  );
};
export default Layout;
