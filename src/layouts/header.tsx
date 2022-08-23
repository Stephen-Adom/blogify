import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { Link } from "react-router-dom";

import AddPostModal from "../components/addPostModal";
import { openAddPostModal } from "../hooks/reducers/post-reducer";
import { UserBio } from "../utils/models/post.model";

function Header() {
  const dispatch = useAppDispatch();
  const userProfile: UserBio = useAppSelector(
    (state) => state.auth.authUserFullBio
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-custom fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <div className="symbol symbol-30 mr-2">
            <img alt="Pic" src={require("../assets/images/blogify_logo.png")} />
          </div>
          BLOGIFY
        </Link>

        <div className="navbar-right-section">
          <div className="form-group mb-0 mr-4">
            <div className="input-icon">
              <input
                type="text"
                className="form-control form-control-solid"
                placeholder="Search..."
              />
              <span>
                <i className="fas fa-search icon-md"></i>
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-custom add-post-btn mr-3"
            onClick={() => dispatch(openAddPostModal())}
          >
            <i className="fas fa-plus text-white"></i>
            <span className="ml-2">Add Post</span>
          </button>

          <div className="symbol symbol-40">
            <img
              alt="Pic"
              src={
                userProfile && userProfile.profilePic.downloadURL
                  ? userProfile.profilePic.downloadURL
                  : require("../assets/users/blank.png")
              }
            />
          </div>
        </div>
      </div>

      <AddPostModal></AddPostModal>
    </nav>
  );
}

export default Header;
