import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import MenuOptions from "./Components/MenuOptions";
import Home from "./Components/Menu-Components/Home";
import Self from "./Components/Menu-Components/Self";
import Shorts from "./Components/Menu-Components/Shorts";
import Subscriptions from "./Components/Menu-Components/Subsciptions";
import History from "./Components/Menu-Components/History";
import { ThemeProvider } from "./Hooks/ThemeContext";
import VideoPlayer from "./Components/VideoPlayer";
import Result from "./Components/Result";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <MenuOptions />,
        children: [
          {
            path: "/home",
            element: <Home />,
          },
          {
            path: "/shorts",
            element: <Shorts />,
          },
          {
            path: "/Subscriptions",
            element: <Subscriptions />,
          },
          {
            path: "/you",
            element: <Self />,
          },
          {
            path: "/history",
            element: <History />,
          },
          {
            path: "/result/:text",
            element: <Result />,
          },
        ],
      },
      {
        path: "/home/Video/:id",
        element: <VideoPlayer />,
      },
      {
        path: "/result/:text/Video/:id",
        element: <VideoPlayer />,
      },
    ],
  },
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
);
