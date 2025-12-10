import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import Root from '../Root/Root';
import Home from '../pages/Home/Home';
import ErrorPage from '../pages/Error/ErrorPage';
import RegisterPage from '../Register';
import LoginPage from '../Login';
import AdminSidebar from '../Admin/AdminSidebar';
import PrivateRoute from './PrivateRoute';
import Users from '../components/Users';
import Chefs from '../pages/Chefs';
import Profile from '../components/MyProfile';
import CreateMeal from '../components/CreateMeals';



export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        index: true,
        Component: Home,
      },
      {
        path: 'register',
        element: <RegisterPage></RegisterPage>
      },
      {
        path: 'login',
        element: <LoginPage></LoginPage>
      },
      {
        path: 'admin-sidebar',
        element: <PrivateRoute><AdminSidebar></AdminSidebar></PrivateRoute>,
        children:[
          {
            path: 'users',
            element: <Users></Users>
          },
          {
            path: 'chefs',
            element: <Chefs></Chefs>
          },
          {
            path: 'profile',
            element: <Profile></Profile>
          },
          {
            path: 'create-meal',
            element: <CreateMeal></CreateMeal>
          }
        ]
      }
    ]
  },
]);
