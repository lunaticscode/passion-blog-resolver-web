import { FC } from "react";
import ProfileIcon from "./icons/ProfileIcon";
import { useNavigate } from "react-router-dom";
import { headerCls } from "../consts/className";

interface HeaderProps {}
const Header: FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const handleClickLogo = () => {
    navigate("/");
  };

  return (
    <header className={headerCls}>
      <div className={`${headerCls}-left-menus`}>
        <div onClick={handleClickLogo} className={`${headerCls}-logo-wrapper`}>
          LOGO
        </div>
      </div>

      <div className={`${headerCls}-right-menus`}>
        <div className={"profile-wrapper"}>
          <ProfileIcon width={30} />
        </div>
      </div>
    </header>
  );
};
export default Header;
