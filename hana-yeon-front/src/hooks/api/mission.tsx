import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib";
import { GET_USER_MISSIONS } from "@/constants";
import type { ApiResponse, GetUserMissionsResponse } from "@/types";

export const useGetUserMissions = () => {
  return useQuery({
    queryKey: ["getUserMissions"],
    queryFn: () => {
      return API.get<ApiResponse<GetUserMissionsResponse>>(GET_USER_MISSIONS);
    },
    select: (data) => {
      console.log(data.data.missions.sort((a, _) => (a.isCompleted ? 1 : -1)));
      return data.data?.missions.sort((a, _) => (a.isCompleted ? 1 : -1));
    },
    staleTime: 1000 * 60 * 5,
  });
};
