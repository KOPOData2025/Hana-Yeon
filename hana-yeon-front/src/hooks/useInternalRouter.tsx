import { useMemo } from "react";
import { useNavigate, type NavigateOptions } from "react-router-dom";
import { PATH } from "@/constants";

export const useInternalRouter = () => {
  const navigate = useNavigate();

  return useMemo(() => {
    return {
      back() {
        navigate(-1);
      },
      push(path: RoutePath, options?: NavigateOptions) {
        navigate(path, options);
      },
      replace(path: RoutePath) {
        navigate(path, { replace: true });
      },
    };
  }, [navigate]);
};

type RoutePath =
  | (typeof PATH)[keyof typeof PATH]
  | `${typeof PATH.ACCOUNT_DETAIL}/${string}`
  | `${typeof PATH.SHOP}/${string}`;
