import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import Login from './components/Login.jsx'
import SignUp from './components/SignUp.jsx'
import Ui from './components/Ui.jsx'
import AwsPopUp from './pages/AwsPopUp.jsx'
import SqlPopUp from './pages/SqlPopUp.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/signup',
    element: <SignUp/>
  },
  {
    path: '/ui',
    element: <Ui/>
  },
  {
    path: '/aws',
    element: <AwsPopUp/>
  },
  {
    path: '/sql',
    element: <SqlPopUp/>
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

