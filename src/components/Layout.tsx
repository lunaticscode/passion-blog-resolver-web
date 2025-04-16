import { FC, useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import WithAuth from "../hocs/WithAuth";
import { UserProfile } from "../types/entity";

interface LayoutProps {
  profile: UserProfile | null;
}
const Layout: FC<LayoutProps> = ({ profile }) => {
  const location = useLocation();
  const isSignPage = useMemo(
    () => location.pathname === "/signin",
    [location.pathname]
  );

  return (
    <>
      {!isSignPage && <Header profile={profile} />}
      {!isSignPage && <Sidebar />}
      <Outlet />
    </>
  );
};
export default WithAuth(Layout);
