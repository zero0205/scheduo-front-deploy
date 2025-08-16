import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router";
import { queryClient } from "@/shared/tanstack-query";
import { Toaster } from "@/shared/ui";
import { Router } from "./routes";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Router />
        <Toaster />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} client={queryClient} />
    </QueryClientProvider>
  );
}

export default App;
