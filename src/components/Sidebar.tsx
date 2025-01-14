import { ReactNode } from "react";
import { sidebarCls } from "../consts/className";
import { useLocation, useNavigate } from "react-router-dom";
import { ConverterIcon } from "./icons";

interface SidebarProps {}

type SidebarMenu = {
  href: string;
  label: string;
  icon: ReactNode;
};

const sidebarMenus: SidebarMenu[] = [
  { href: "/convert-keyword", label: "키워드 재조합", icon: <ConverterIcon /> },
  { href: "/convert-sentence", label: "문장 재조합", icon: <ConverterIcon /> },
  { href: "/convert-article", label: "글 재조합", icon: <ConverterIcon /> },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleClickMenu = (href: string) => {
    navigate(href);
  };
  return (
    <aside className={`${sidebarCls}`}>
      <div className={`${sidebarCls}-menus-wrapper`}>
        {sidebarMenus.map((menu) => (
          <div
            key={`sidebar-menu-${menu.href.toString().split("/")[1]}`}
            onClick={() => handleClickMenu(menu.href)}
            className={`${sidebarCls}-menu`}
            data-active={location.pathname === menu.href}
          >
            {menu.icon}
            <span className={`${sidebarCls}-menu-label`}>{menu.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
