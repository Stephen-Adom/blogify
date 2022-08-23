import React, { useRef } from "react";
import { Tooltip } from "primereact/tooltip";
import { useAppSelector } from "../hooks/hooks";
import ProfileSummaryLoader from "./loaders/profile-summary-loader";
import { useAppDispatch } from "./../hooks/hooks";
import { UserBio } from "../utils/models/post.model";
import { AuthService } from "../services/auth.service";
import { updateAuthImage } from "../hooks/reducers/auth.reducer";
import { Alert } from "../lib/alerts";
import { FirebaseError } from "firebase/app";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "../utils/firebase.config";
import { Toast } from "primereact/toast";
import {
  setLoadingMessage,
  startLoadingProcessing,
  stopLoadingProcessing,
} from "../hooks/reducers/app.reducer";

function UserProfileCard() {
  const toast = useRef(null);
  const dispatch = useAppDispatch();
  const authservice = new AuthService();
  const userProfile: UserBio = useAppSelector(
    (state) => state.auth.authUserFullBio
  );

  // CONVERT TO BASE 64;
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // UPDATE USER PROFILE IMAGE
  const UpdateProfileImage = (e: any) => {
    const file = e.target.files[0];

    getBase64(file).then((response) => {
      if (response) {
        dispatch(startLoadingProcessing());
        dispatch(setLoadingMessage("Updating Profile..."));
        UploadImageToClound(response, userProfile)
          .then((imageUrl: any) => {
            authservice
              .UpdateProfileImage(imageUrl, userProfile.id)
              .then((response) => {
                dispatch(updateAuthImage(imageUrl));
                dispatch(stopLoadingProcessing());
                Alert("success", "Profile Image", "Profile Image Updated");
              })
              .catch((err: FirebaseError) => {
                Alert("error", "Image Upload", err.message);
              });
          })
          .catch((err) => {
            console.log(err);
            dispatch(stopLoadingProcessing());
            Alert("error", "Image Upload", err.message);
          });
      }
    });
  };

  // UPLOAD IMAGE TO FIREBASE CLOUD
  const UploadImageToClound = (base64: any, userInfo: any) => {
    console.log(base64);
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, "profiles/" + userInfo.username);
      uploadString(storageRef, base64, "data_url")
        .then((response) => {
          getDownloadURL(response.ref).then((downloadURL) => {
            resolve({
              reference: response.ref.fullPath,
              downloadURL,
            });
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  return (
    <section>
      <Toast ref={toast} />
      {userProfile ? (
        <div className="card card-custom profile-summary-card">
          <div className="card-body">
            <div
              className="image-input image-input-outline mr-4"
              id="kt_profile_avatar"
              style={{
                backgroundImage: `url(${require("../assets/users/blank.png")})`,
              }}
            >
              <div
                className="image-input-wrapper"
                style={{
                  backgroundImage: `url(${userProfile.profilePic.downloadURL})`,
                }}
              ></div>
              <Tooltip
                target=".updateProfileIcon"
                content="Update Image"
                position="right"
              />
              <label
                onChange={(e) => UpdateProfileImage(e)}
                className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow updateProfileIcon"
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
            </div>
            <div className="text-left">
              <h5 className="font-weight-bold mb-0">
                {userProfile.firstname} {userProfile.lastname}
              </h5>
              <span className="text-muted">@{userProfile.username}</span>
            </div>
          </div>
        </div>
      ) : (
        <ProfileSummaryLoader></ProfileSummaryLoader>
      )}
    </section>
  );
}

export default UserProfileCard;
