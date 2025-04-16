import axios, { HttpStatusCode, isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { UserProfile } from "../types/entity";

const useAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [error, setError] = useState<Error>(); // debugging 용도
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const execAuth = async () => {
    try {
      const authRequest = await axios.get("/auth");
      if (authRequest.status === HttpStatusCode.Ok) {
        setIsAuth(true);
        setProfile(authRequest.data.profile);
      }
    } catch (err) {
      console.error(err);
      if (isAxiosError(err)) {
        setError(err);
      } else {
        setError(new Error("AUTH_API_ERROR"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    execAuth();
  }, []);

  return {
    isLoading,
    isAuth,
    error,
    profile,
  };
};
export default useAuth;
