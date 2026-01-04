"use strict";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from '@pages/Root'
import Home from '@pages/Home'
import Login from '@pages/Login'
import Register from '@pages/Register'
import Error404 from '@pages/Error404'
import Users from '@pages/Users'
// import Electivo from '@pages/Electivo'
import Profile from '@pages/Profile'
import ProtectedRoute from '@components/ProtectedRoute'
import Electivos from '@pages/Electivos'
import Timetable from '@pages/Timetable'
import { VALID_ADMIN_ROLES } from "./services/admin.service.js";
import Inscripciones from '@pages/Inscripciones';
import Carreras from "@pages/Carreras";
import Solicitudes from "./pages/Solicitudes.jsx";
import NuevaSolicitud from "./pages/Nuevasolicitud.jsx";
import { STUDENT_ROLE } from "./constants/PermissionsConstants.jsx";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/users",
        element: (
          <ProtectedRoute allowedRoles={VALID_ADMIN_ROLES}>
            <Users />
          </ProtectedRoute>
        ),
      },
      { 
       path: "/inscripciones", 
       element: <Inscripciones/>,
      },
       { 
       path: "/Solicitudes", 
       element: <Solicitudes/>,
      },
       { 
       path: "/NuevaSolicitud",
       element: (
        <ProtectedRoute allowedRoles={[STUDENT_ROLE]}>
          <NuevaSolicitud/>
        </ProtectedRoute>
       ),
      },
      {
        path: "/electivos",
        element: <Electivos/>,
      },      
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/horarios",
        element: <Timetable />,
      },
      {
        path: "/carreras",
        element: (
          <ProtectedRoute allowedRoles={VALID_ADMIN_ROLES}>
            <Carreras />
          </ProtectedRoute>
        ),
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {/*
    path: "/register",
    element: <Register />,
  */},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
