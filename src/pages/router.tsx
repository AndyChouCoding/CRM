
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Dashboard from "./dashboard";
import Login from "./Login"

const Router = createBrowserRouter([
    { path:"/",element:<Layout><Login/></Layout>,},
    { path:"/Dashboard",element:<Layout><Dashboard/></Layout>}
])

export default Router;