import { BrowserRouter } from "react-router";
import { Toaster } from "@/shared/ui";
import { Router } from "./routes";

function App() {
  return (
    <BrowserRouter>
      <Router />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
