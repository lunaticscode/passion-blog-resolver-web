import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SigninSuccess = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/", { replace: true });
  }, []);
  return <h1>Signin Success</h1>;
};
export default SigninSuccess;
