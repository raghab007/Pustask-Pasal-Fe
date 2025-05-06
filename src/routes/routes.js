import { createBrowserRouter } from "react-router";
import UserLayout from "../layouts/UserLayout";
import About from "../pages/About";
import Home from "../pages/Home";
import BooksPage from "../pages/Books";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/admin/AdminLayout";
import { Component } from "react";
import { BooksManagement } from "../components/admin/BookManagement";

const routes = createBrowserRouter([
    {
      path: "/",
      Component: UserLayout,
      children: [
        { index: true, Component: Home },
        { path: "about", Component: About },
        {path: "books", Component: BooksPage},
        {
           path: "auth",
           Component: AuthLayout,
          children: [
             { path: "login", Component: Login },
             { path: "signup", Component: Signup },
           ],
         },

       
         {
        //   path: "concerts",
        //   children: [
        //     { index: true, Component: ConcertsHome },
        //     { path: ":city", Component: ConcertsCity },
        //     { path: "trending", Component: ConcertsTrending },
        //   ],
         },
      ],
    },

    {
      path: "/admin",
      Component: AdminLayout,
      children:[{
        path: "books", 
        Component: BooksManagement },
      ]

     },
  ]);
  

  export default routes;