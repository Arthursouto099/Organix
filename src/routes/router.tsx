import {createBrowserRouter} from "react-router-dom"
import Login from "../pages/Login";
import DashBoard from "../pages/DashBoard";
import FriendsShip from "../pages/FriendsShip";
import Register from "../pages/Register";
import ProfilePage from "../pages/Profile";
import Collaborations from "../pages/Collaborations";
import UserCollaborations from "../pages/UserCollaborations";


const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/register",
        element: <Register/>
    },
    {
        path: "/DashBoard",
        element: < DashBoard />
    },
    {
        path: "/Friends",
        element: <FriendsShip/>
    },
    {
        path: "/Profile",
        element: <ProfilePage/>
    },
    {
        path: "/:projectId/Collaborations",
        element: <Collaborations/>
    },
    {
        path: "/user/collaborations",
        element: <UserCollaborations/>   
    }
])


export default router;