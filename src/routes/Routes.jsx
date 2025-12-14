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
import AllMeals from '../AllMeals';
import MyMeals from '../components/MyMeals';
import OrderPage from '../OrderPage';
import OrderRequestsPage from '../OrderRequestPage';
import MyOrdersPage from '../components/MyOrdersPage';
import PaymentPage from '../components/PaymentPage';
import PaymentSuccess from '../components/PaymentsSuccess';
import MyReviewPage from '../components/MyReviewPage';
import FavoriteMealsPage from '../components/FavoriteMealsPage';
import ManageRequests from '../components/ManageRequests';
import PlatformStatistics from '../components/PlatformStatistics';



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
         path: 'meals',
         element: <AllMeals></AllMeals>
      },
      {
            path: "/order/:mealId",
            element: <OrderPage></OrderPage>,
          },
           {
        path: "payment/:id",
        element: <PaymentPage />,
      },
      {
        path: "payment-success",
        element: <PaymentSuccess />,
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
            index: true,
            element: <Profile></Profile>
          },
          {
            path: 'create-meal',
            element: <CreateMeal></CreateMeal>
          },
          {
            path: 'my-meals',
            element: <MyMeals></MyMeals>
          },
          {
            path: 'orders',
            element: <OrderRequestsPage></OrderRequestsPage>
          },
          {
            path: 'my-orders',
            element: <MyOrdersPage></MyOrdersPage>
          },
          {
            path: 'my-reviews',
            element: <MyReviewPage></MyReviewPage>
          },
          {
            path: 'favorites',
            element: <FavoriteMealsPage></FavoriteMealsPage>
          },
          {
            path: 'requests',
            element: <ManageRequests></ManageRequests>
          },
          {
            path: 'platform',
            element: <PlatformStatistics></PlatformStatistics>
          }
        ]
      }
    ]
  },
]);
