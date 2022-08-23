import React from "react";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../hooks/hooks";
import { UserBio } from "../utils/models/post.model";

function Navigation() {
  const userBio: UserBio = useAppSelector(
    (state) => state.auth.authUserFullBio
  );

  return (
    <div className="card card-custom main-navigation-card">
      <div className="card-body">
        <ul className="list-group list-group-flush">
          <NavLink to="/blog/home" className="list-group-item">
            <span className="d-block">
              <i className="flaticon-home-2"></i>
            </span>
            <span className="d-block">Home</span>
          </NavLink>
          <NavLink to="/messages" className="list-group-item">
            <span className="d-block">
              <i className="flaticon2-chat-1"></i>
            </span>
            <span className="d-block">Messages</span>
          </NavLink>
          <NavLink
            to="/blog/bookmarks"
            className="list-group-item justify-content-between"
          >
            <div className="d-flex align-items-center">
              <span className="d-block">
                <i className="far fa-bookmark"></i>
              </span>
              <span className="d-block">Bookmarks</span>
            </div>

            <span
              className="label label-rounded label-primary text-white"
              style={{ fontSize: "11px" }}
            >
              {userBio ? userBio.bookmarks.length : 0}
            </span>
          </NavLink>
          <NavLink to="/blog/my-profile" className="list-group-item">
            <span className="d-block">
              <i className="flaticon2-user-outline-symbol"></i>
            </span>
            <span className="d-block">Profile</span>
          </NavLink>
          <li className="list-group-item">
            <span className="d-block">
              <i className="flaticon2-gear"></i>
            </span>
            <span className="d-block">Settings</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navigation;
