import ReactDOM from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import App from './App'
import ChannelDetails from './Components/ChannelDetails'
import AllVidoesHome from './Components/ChannelDetails-Components/AllVidoesHome'
import Playlist from './Components/ChannelDetails-Components/Playlist'
import Video from './Components/ChannelDetails-Components/Videos'
import History from './Components/Menu-Components/History'
import Home from './Components/Menu-Components/Home'
import Self from './Components/Menu-Components/Self'
import Shorts from './Components/Menu-Components/Shorts'
import Subscriptions from './Components/Menu-Components/Subsciptions'
import MenuOptions from './Components/MenuOptions'
import Result from './Components/Result'
import VideoPlayer from './Components/VideoPlayer'
import { CallContextFun } from './Hooks/CallingCotext'
import { ThemeProvider } from './Hooks/ThemeContext'
import './index.css'
import PostDetails from './Components/ChannelDetails-Components/PostDetails'
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <MenuOptions />,
        children: [
          {
            path: '/',
            element: <Home />,
          },
          {
            path: '/shorts',
            element: <Shorts />,
          },
          {
            path: '/Subscriptions',
            element: <Subscriptions />,
          },
          {
            path: '/you',
            element: <Self />,
          },
          {
            path: '/history',
            element: <History />,
          },
          {
            path: '/result/:text',
            element: <Result />,
          },
          {
            path: '/CD/',
            element: <ChannelDetails />,
            children: [
              {
                path: '/CD/',
                element: <AllVidoesHome />,
              },
              {
                path: '/CD/videolist',
                element: <Video />,
              },
              {
                path: '/CD/Playlist',
                element: <Playlist />,
              },
              {
                path: '/CD/Posts',
                element: <PostDetails />,
              },
            ],
          },
        ],
      },
      {
        path: '/Video/:id',
        element: <VideoPlayer />,
      },
      {
        path: '/result/:text/Video/:id',
        element: <VideoPlayer />,
      },
    ],
  },
])

const root = document.getElementById('root')

ReactDOM.createRoot(root).render(
  <CallContextFun>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </CallContextFun>
)
