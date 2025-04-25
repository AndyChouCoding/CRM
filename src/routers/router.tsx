
import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/components/layout";
import Dashboard from "../pages/dashboard";
import Login from "../pages/Login"
import { ProtectedRoute } from '../pages/components/ProtectedRoute';
import TicketCenter from "../pages/message_center";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Login/></Layout>,
  },
  {
    path: "/dashboard",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['agent','manager']}>
          <Dashboard/>
        </ProtectedRoute>
      </Layout>
    )
  },
  {
    path: "/message_center",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['agent','manager']}>
          <TicketCenter/>
        </ProtectedRoute>
      </Layout>
    )
  }
]);
export default Router;
