import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import App from './App.jsx'
import './index.css'
// import Login from './components/Login.jsx'
// import SignUp from './components/SignUp.jsx'
import Ui from './components/Ui.jsx'
import AwsPopUp from './pages/AwsPopUp.jsx'
import SqlPopUp from './pages/SqlPopUp.jsx'
import Dashboard  from './components/Dashboard.jsx'
import Layout from './pages/Layout/Layout.jsx'
import ETL from './pages/ETL.jsx'
import Authenticate from './pages/Authenticate.jsx'
import Report from './pages/Report.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Authenticate/>
  },
  // {
  //   path: '/login',
  //   element: <Login/>
  // },
  // {
  //   path: '/signup',
  //   element: <SignUp/>
  // },
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
  {
    path: '/visualization',
    element: (<Layout>
      <Dashboard/>
    </Layout>)
  },
  {
    path: '/ETL',
    element: (  
        <Layout>
          <ETL />
        </Layout>

    )  },
  {
    path: '/report',
    element: (  
        <Layout>
          <Report />
        </Layout>

    )  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

