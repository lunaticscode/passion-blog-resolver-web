import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import "./index.css";
import SigninPage from "./pages/SigninPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import ConvertKeywordPage from "./pages/ConvertKeywordPage.tsx";
// import ConvertSentencePage from "./pages/ConvertSentencePage.tsx";
import ConvertStructureByKeywordPage from "./pages/ConvertStructureByKeywordPage.tsx";
import SigninSuccess from "./pages/SigninSuccess.tsx";
import ConvertSentencePage2 from "./pages/ConvertSentencePage2.tsx";
import ConvertStructureBySentencePage from "./pages/ConvertStructureBySentencePage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/convert-sentence", element: <ConvertSentencePage2 /> },
      { path: "/convert-keyword", element: <ConvertKeywordPage /> },
      {
        path: "/convert-structure",
        element: <ConvertStructureByKeywordPage />,
      },
      {
        path: "/convert-structure-from-sentence",
        element: <ConvertStructureBySentencePage />,
      },
    ],
  },
  { path: "/signin", element: <SigninPage /> },
  { path: "/signin-success", element: <SigninSuccess /> },
  { path: "*", element: <NotFoundPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
