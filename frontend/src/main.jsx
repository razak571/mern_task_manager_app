import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createRoutesFromElements, Route, RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import store from "./redux/store.js";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import axios from "axios";
import PrivateRoute from "./redux/features/auth/PrivateRoute.jsx";
import NonAuthenticatedUser from "./redux/features/auth/NonAuthenticatedUser.jsx";

axios.defaults.withCredentials = true;

const queryClient = new QueryClient({
  // i can give default options here
});

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<NonAuthenticatedUser />}>
        <Route index={true} path="/" element={<Home />} />
      </Route>

      <Route path="" element={<PrivateRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </QueryClientProvider>
);
