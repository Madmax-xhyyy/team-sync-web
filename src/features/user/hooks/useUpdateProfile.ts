import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCurrentUser } from "../api/user.api";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: async (response) => {
      // Prevent an older in-flight profile read from overwriting the saved profile.
      await queryClient.cancelQueries({ queryKey: ["current-user"] });
      queryClient.setQueryData(["current-user"], response);
      await queryClient.invalidateQueries({ queryKey: ["organization-members"] });
    },
  });
}
