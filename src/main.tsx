import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import "./index.css";
import SigninPage from "./pages/SigninPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import ConvertKeywordPage from "./pages/ConvertKeywordPage.tsx";
import ConvertSentencePage from "./pages/ConvertSentencePage.tsx";
import ConvertStructureByKeywordPage from "./pages/ConvertStructureByKeywordPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/convert-sentence", element: <ConvertSentencePage /> },
      { path: "/convert-keyword", element: <ConvertKeywordPage /> },
      {
        path: "/convert-structure",
        element: <ConvertStructureByKeywordPage />,
      },
      { path: "/signin", element: <SigninPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
