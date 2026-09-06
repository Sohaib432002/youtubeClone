import ReactDOM from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import App from './App'
import ChannelDetails from './Components/ChannelDetails'
import AllVidoesHome from './Components/ChannelDetails-Components/AllVidoesHome'
import Playlist from './Components/ChannelDetails-Components/Playlist'
import Video from './Components/ChannelDetails-Components/Videos'
import ChannelShorts from './Components/ChannelDetails-Components/ChannelShorts'
import ChannelLive from './Components/ChannelDetails-Components/ChannelLive'
import ChannelAbout from './Components/ChannelDetails-Components/ChannelAbout'
import ChannelPlaylistVideos from './Components/ChannelDetails-Components/ChannelPlaylistVideos'
import ChannelSearch from './Components/ChannelDetails-Components/ChannelSearch'
import History from './Components/Menu-Components/History'
import Home from './Components/Menu-Components/Home'
import Self from './Components/Menu-Components/Self'
import Shorts from './Components/Menu-Components/Shorts'
import ShortsPlayer from './Components/Menu-Components/ShortsPlayer'
import Downloads from './Components/Menu-Components/Downloads'
import LikedVideos from './Components/Menu-Components/LikedVideos'
import Settings from './Components/Menu-Components/Settings'
import Subscriptions from './Components/Menu-Components/Subsciptions'
import MenuOptions from './Components/MenuOptions'
import Result from './Components/Result'
import VideoPlayer from './Components/VideoPlayer'
import { CallContextFun } from './Hooks/CallingCotext'
import { ThemeProvider } from './Hooks/ThemeContext'
import { AuthProvider } from './Hooks/AuthContext'
import { HistoryProvider } from './Hooks/HistoryContext'
import { PrefsProvider } from './Hooks/PrefsContext'
import { LikesProvider } from './Hooks/LikesContext'
import { SubscriptionsProvider } from './Hooks/SubscriptionsContext'
import { WatchLaterProvider } from './Hooks/WatchLaterContext'
import { PlaylistsProvider } from './Hooks/PlaylistsContext'
import './index.css'
import './App.css'
import PostDetails from './Components/ChannelDetails-Components/PostDetails'
import PostComments from './Components/ChannelDetails-Components/PostComments'
import WatchLater from './Components/Menu-Components/WatchLater'
import PlaylistsPage from './Components/Menu-Components/PlaylistsPage'
import PlaylistDetail from './Components/Menu-Components/PlaylistDetail'

const channelChildren = [
  { path: '', element: <AllVidoesHome /> },
  { path: 'videolist', element: <Video /> },
  { path: 'shorts', element: <ChannelShorts /> },
  { path: 'live', element: <ChannelLive /> },
  { path: 'Playlist', element: <Playlist /> },
  { path: 'Playlist/:playlistId', element: <ChannelPlaylistVideos /> },
  { path: 'Posts', element: <PostDetails /> },
  { path: 'Posts/:post', element: <PostComments /> },
  { path: 'about', element: <ChannelAbout /> },
  { path: 'search', element: <ChannelSearch /> },
  { path: 'videolist/:id', element: <VideoPlayer /> },
]

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <MenuOptions />,
        children: [
          { path: '/', element: <Home /> },
          { path: '/shorts', element: <Shorts /> },
          { path: '/Subscriptions', element: <Subscriptions /> },
          { path: '/you', element: <Self /> },
          { path: '/history', element: <History /> },
          { path: '/downloads', element: <Downloads /> },
          { path: '/liked', element: <LikedVideos /> },
          { path: '/watch-later', element: <WatchLater /> },
          { path: '/playlists', element: <PlaylistsPage /> },
          { path: '/playlist/:playlistId', element: <PlaylistDetail /> },
          { path: '/settings', element: <Settings /> },
          { path: '/result/:text', element: <Result /> },
          {
            path: '/channel/:channelId',
            element: <ChannelDetails />,
            children: channelChildren,
          },
          {
            path: '/CD',
            element: <ChannelDetails />,
            children: channelChildren,
          },
        ],
      },
      { path: '/Video/:id', element: <VideoPlayer /> },
      { path: '/result/:text/Video/:id', element: <VideoPlayer /> },
      { path: '/shorts/:id', element: <ShortsPlayer /> },
    ],
  },
])

const root = document.getElementById('root')

ReactDOM.createRoot(root).render(
  <AuthProvider>
    <HistoryProvider>
      <PrefsProvider>
        <LikesProvider>
          <SubscriptionsProvider>
            <WatchLaterProvider>
              <PlaylistsProvider>
                <CallContextFun>
                  <ThemeProvider>
                    <RouterProvider router={router} />
                  </ThemeProvider>
                </CallContextFun>
              </PlaylistsProvider>
            </WatchLaterProvider>
          </SubscriptionsProvider>
        </LikesProvider>
      </PrefsProvider>
    </HistoryProvider>
  </AuthProvider>
)
