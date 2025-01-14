import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import "./index.css";
import SigninPage from "./pages/SigninPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import ConvertPage from "./pages/ConvertPage.tsx";
import ConvertArticlePage from "./pages/ConvertArticlePage.tsx";
import ConvertSentencePage from "./pages/ConvertSentencePage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/convert-keyword", element: <ConvertPage /> },
      { path: "/convert-sentence", element: <ConvertSentencePage /> },
      { path: "/convert-article", element: <ConvertArticlePage /> },
      { path: "/signin", element: <SigninPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
