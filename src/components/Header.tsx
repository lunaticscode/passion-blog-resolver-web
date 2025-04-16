import { FC } from "react";
import ProfileIcon from "./icons/ProfileIcon";
import { useNavigate } from "react-router-dom";
import { headerCls } from "../consts/className";
import { UserProfile } from "../types/entity";

interface HeaderProps {
  profile: UserProfile | null;
}
const Header: FC<HeaderProps> = ({ profile }) => {
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
          {profile?.picture ? (
            <img width={45} height={45} src={profile.picture} />
          ) : (
            <ProfileIcon width={30} />
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
