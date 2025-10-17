import { create } from "zustand";
// types
import type { GetMeResponse } from "@/types";
import { calculateAgeFromYYYYMMDD } from "@/lib";

interface IUserInfo extends GetMeResponse {
  age: number;
}

export interface userState {
  userName: string | null;
  accessToken: string | null;
  userInfo: IUserInfo | null;
  // refreshToken: string | null;
}

interface setUserState {
  setAccessToken: (accessToken: string) => void;
  setUserInfo: (userInfo: GetMeResponse | null) => void;
  clearUserInfo: () => void;
}

const initialState: userState = {
  userName: "",
  accessToken: null,
  userInfo: null,
};

export const useAuthStore = create<userState & setUserState>((set) => ({
  ...initialState,
  setAccessToken: (accessToken) => {
    return set((prev) => {
      return {
        ...prev,
        accessToken,
      };
    });
  },
  setUserInfo: (userInfo) => {
    if (userInfo === null) {
      return set((prev) => ({ ...prev, userInfo, userName: null }));
    }

    const age = calculateAgeFromYYYYMMDD(userInfo.birthDate);
    return set((prev) => ({
      ...prev,
      userInfo: { ...userInfo, age },
      userName: userInfo.userName,
    }));
  },
  clearUserInfo: () =>
    set((prev) => ({
      ...prev,
      userInfo: null,
      userName: "",
    })),
  // setRefreshToken: (refreshToken) => {
  //   Cookies.set("refreshToken", refreshToken, { path: PATH.HOME });

  //   return set((prev) => {
  //     if (!prev.userId) return prev;

  //     return {
  //       ...prev,
  //       refreshToken,
  //     };
  //   });
  // },
}));
