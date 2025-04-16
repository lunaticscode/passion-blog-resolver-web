import { ComponentType, PropsWithChildren } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "../types/entity";

interface WithAuthHocProps {
  profile?: UserProfile | null;
}
type AuthPermissions = "admin" | "user";
const WithAuth = <
  P extends PropsWithChildren & { profile?: UserProfile | null }
>(
  WrappedComponent: ComponentType<P>,
  _permission: AuthPermissions = "user"
) => {
  const Component = ({ ...props }: WithAuthHocProps) => {
    const { isLoading, isAuth, profile } = useAuth();

    const navigate = useNavigate();
    if (isLoading) return <h1>LOADING...</h1>;
    if (!isLoading && !isAuth) {
      alert("인증 오류!");
      navigate("/signin", { replace: true });
      return;
    }
    return (
      <WrappedComponent
        {...({ ...props, profile } as P & (UserProfile | null))}
      />
    );
  };
  return Component;
};

export default WithAuth;
