import React from "react";
import { Sidebar } from "primereact/sidebar";
import { useAppSelector } from "../hooks/hooks";
import { useAppDispatch } from "./../hooks/hooks";
import { closeProfileUpdate } from "../hooks/reducers/app.reducer";
import { Calendar } from "primereact/calendar";

export default function UpdateUserProfile() {
  const sidebarStatus = useAppSelector(
    (state) => state.app.userProfileUpdateSidebar
  );
  const dispatch = useAppDispatch();

  return (
    <Sidebar
      visible={sidebarStatus}
      className="user-profile-update"
      blockScroll={true}
      position="right"
      onHide={() => dispatch(closeProfileUpdate())}
    >
      <div
        style={{
          height: "95vh",
          overflowY: "auto",
          overflowX: "hidden",
          padding: "20px 20px 0 20px",
        }}
      >
        <div className="row">
          <label className="col-xl-3"></label>
          <div className="col-lg-9 col-xl-6">
            <h5 className="font-weight-bold mb-6">User Profile</h5>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-xl-3 col-lg-3 col-form-label">Avatar</label>
          <div className="col-lg-9 col-xl-6">
            <div
              className="image-input image-input-outline"
              id="kt_profile_avatar"
              style={{
                backgroundImage: `url(${require("../assets/users/blank.png")})`,
              }}
            >
              <div
                className="image-input-wrapper"
                style={{
                  backgroundImage: `url(${require("../assets/users/100_1.jpg")})`,
                }}
              ></div>

              <label
                className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                data-action="change"
                data-toggle="tooltip"
                title=""
                data-original-title="Change avatar"
              >
                <i className="fa fa-pen icon-sm text-muted"></i>
                <input
                  type="file"
                  name="profile_avatar"
                  accept=".png, .jpg, .jpeg"
                />
                <input type="hidden" name="profile_avatar_remove" />
              </label>

              <span
                className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                data-action="cancel"
                data-toggle="tooltip"
                title="Cancel avatar"
              >
                <i className="ki ki-bold-close icon-xs text-muted"></i>
              </span>

              <span
                className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                data-action="remove"
                data-toggle="tooltip"
                title="Remove avatar"
              >
                <i className="ki ki-bold-close icon-xs text-muted"></i>
              </span>
            </div>
            <span className="form-text text-muted">
              Allowed file types: png, jpg, jpeg.
            </span>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-xl-3 col-lg-3 col-form-label">First Name</label>
          <div className="col-lg-9 col-xl-9 col-12">
            <input
              className="form-control form-control-lg form-control-solid"
              type="text"
              value="Nick"
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-xl-3 col-lg-3 col-form-label">Last Name</label>
          <div className="col-lg-9 col-xl-9 col-12">
            <input
              className="form-control form-control-lg form-control-solid"
              type="text"
              value="Bold"
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-xl-3 col-lg-3 col-form-label">Dob</label>
          <div className="col-lg-9 col-xl-9 col-12">
            <Calendar
              id="icon"
              iconPos="left"
              showIcon
              placeholder="Choose date"
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-xl-3 col-lg-3 col-form-label">
            Location Address
          </label>
          <div className="col-lg-9 col-xl-9 col-12">
            <div className="input-group input-group-lg input-group-solid">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="pi pi-map-marker"></i>
                </span>
              </div>
              <input
                type="text"
                className="form-control form-control-lg form-control-solid"
                placeholder="Enter your location address"
              />
            </div>
          </div>
        </div>

        <div className="form-group row">
          <label className="col-xl-3 col-lg-3 col-form-label">Website</label>
          <div className="col-lg-9 col-xl-9 col-12">
            <div className="input-group input-group-lg input-group-solid">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="pi pi-globe"></i>
                </span>
              </div>
              <input
                type="text"
                className="form-control form-control-lg form-control-solid"
                placeholder="Enter your website address"
              />
            </div>
          </div>
        </div>

        <div className="form-group row">
          <label className="col-xl-3 col-lg-3 col-form-label">My Bio</label>
          <div className="col-lg-9 col-xl-9 col-12">
            <textarea
              className="form-control form-control-solid"
              rows={3}
            ></textarea>
          </div>
        </div>

        <div className="form-group text-center">
          <button type="submit" className="btn btn-custom">
            Update Profile
          </button>
        </div>
      </div>
    </Sidebar>
  );
}
