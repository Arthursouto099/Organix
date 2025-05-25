import {createBrowserRouter} from "react-router-dom"
import Login from "../pages/Login";
import DashBoard from "../pages/DashBoard";
import FriendsShip from "../pages/FriendsShip";


const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/DashBoard",
        element: < DashBoard />
    },
    {
        path: "/Friends",
        element: <FriendsShip/>
    }
])


export default router;