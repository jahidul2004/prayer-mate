import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/home/Home";
import SalahTime from "../pages/salahTime/SalahTime";
import Quibla from "../pages/qibla/Quibla";
import Amal from "../pages/amal/Amal";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout></MainLayout>,
        children: [
            {
                path: "/",
                element: <Home></Home>,
            },
            {
                path: "/salah-time",
                element: <SalahTime></SalahTime>,
            },
            {
                path: "/qibla",
                element: <Quibla></Quibla>,
            },
            {
                path: "/amal",
                element: <Amal></Amal>,
            },
        ],
    },
]);
export default router;
