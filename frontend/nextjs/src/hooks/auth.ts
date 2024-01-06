import useSWR from "swr";
import axios, { csrf } from "@/lib/axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { loginErrorState } from "@/recoil/userAtoms";
import { isLoadingState } from "@/recoil/isLoadingAtom";

export type AuthMiddleware = "auth" | "guest";
export interface IUseAuth {
  middleware: AuthMiddleware;
  redirectIfAuthenticated?: string;
}
export interface IApiRequest {
  setErrors: React.Dispatch<React.SetStateAction<never[]>>;
  setStatus: React.Dispatch<React.SetStateAction<any | null>>;
  [key: string]: any;
}

export const useAuth = ({ middleware, redirectIfAuthenticated }: IUseAuth) => {
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
  const router = useRouter();
  const {
    data: user,
    error,
    mutate,
  } = useSWR<User>("/api/user", () =>
    axios
      .get("/api/user")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) throw error;
        router.push("/verify-email");
      })
  );

  useEffect(() => {
    if (user != undefined && user.Authority == null) {
      router.push("/verify-email");
    }
  }, []);

  const register = async (requests: UserRegister) => {
    await csrf();

    axios
      .post("/register", requests)
      .then(() => mutate())
      .catch((error) => {
        // if (error.response.status !== 422) throw error;
        // console.log(error.response.data.errors);
        // setRequests((prevState: any[]) => prevState.map((obj) => (obj.id === 1 ? { ...obj, errors: error.response.data.errors } : obj)));
      });
  };

  const [loginError, setLoginError] = useRecoilState(loginErrorState);
  const login = async (request: Login) => {
    await csrf();
    axios
      .post("/login", request)
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 422) throw error;
        console.log(error.response.data.errors);
        setLoginError(error.response.data.errors.name);
        setIsLoading(false);
      });
  };

  const forgotPassword = async (args: IApiRequest) => {
    const { setErrors, setStatus, email } = args;
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("/forgot-password", { email })
      .then((response) => setStatus(response.data.status))
      .catch((error) => {
        if (error.response.status !== 422) throw error;
        setErrors(error.response.data.errors);
      });
  };

  // const resetPassword = async (args: IApiRequest) => {
  //   const { setErrors, setStatus, ...props } = args;
  //   await csrf();

  //   setErrors([]);
  //   setStatus(null);

  //   axios
  //     .post("/reset-password", { token: router.query.token, ...props })
  //     .then((response) => {
  //       console.log(response);
  //       router.push("/login");
  //     })
  //     .catch((error) => {
  //       if (error.response && error.response.status !== 422) {
  //         throw error;
  //       } else if (
  //         error.response &&
  //         error.response.data &&
  //         error.response.data.errors
  //       ) {
  //         setErrors(error.response.data.errors);
  //       } else {
  //         // Handle other error cases if needed
  //       }
  //     });
  // };

  const resendEmailVerification = (args: IApiRequest) => {
    const { setStatus } = args;
    axios
      .post("/email/verification-notification")
      .then((response) => setStatus(response.data.status));
  };

  const logout = async () => {
    if (!error) {
      await axios.post("/logout").then(() => mutate());
    }
    window.location.pathname = "/login";
  };

  useEffect(() => {
    if (middleware === "guest" && redirectIfAuthenticated && user) {
      router.push(redirectIfAuthenticated);
    }
    if (
      window.location.pathname === "/verify-email" &&
      user?.email_verified_at
    ) {
      router.push(redirectIfAuthenticated || "/"); // デフォルトのリダイレクト先を指定
    }
    if (middleware === "auth" && error) {
      logout();
    }
  }, [user, error]); // eslint-disable-line

  return {
    user,
    register,
    login,
    forgotPassword,
    // resetPassword,
    resendEmailVerification,
    logout,
    mutate,
  };
};
