import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AsyncBoundaryProvider } from "@toss/async-boundary";
import { OverlayProvider } from "overlay-kit";

import { SnackbarProvider, type SnackbarProviderProps } from "notistack";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const snackbarOptions: Omit<SnackbarProviderProps, "children"> = {
  maxSnack: 2,
  autoHideDuration: 700,
  anchorOrigin: { vertical: "top", horizontal: "center" },
};

export default function GlobalProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <AsyncBoundaryProvider>
        <OverlayProvider>
          <SnackbarProvider {...snackbarOptions}>{children}</SnackbarProvider>
        </OverlayProvider>
      </AsyncBoundaryProvider>
    </QueryClientProvider>
  );
}
