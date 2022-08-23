import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/style.bundle.css";
import "./assets/global/plugins.bundle.css";
import "./assets/css/index.css";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "animate.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLogin from "./pages/auth/login";
import AppRegister from "./pages/auth/register";
import Home from "./pages/home";
import { store } from "./hooks/store";
import { Provider } from "react-redux";
import Bookmarks from "./pages/bookmarks";
import Profile from "./pages/profile";
import UserProfile from "./pages/user-profile";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate replace to="/login"></Navigate>}
          ></Route>
          <Route path="/blog" element={<App />}>
            <Route path="home" element={<Home></Home>}></Route>
            <Route path="bookmarks" element={<Bookmarks />}></Route>
            <Route path="my-profile" element={<Profile />}></Route>
            <Route path="profile/:id" element={<UserProfile />}></Route>
          </Route>
          <Route path="/login" element={<AppLogin />}></Route>
          <Route path="/register" element={<AppRegister />}></Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
