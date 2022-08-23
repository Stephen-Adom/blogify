import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { nanoid } from "nanoid";
import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../hooks/hooks";
import { Alert } from "../lib/alerts";
import { storage } from "../utils/firebase.config";
import { Relation, Story } from "../utils/models/post.model";
import { UserBio } from "./../utils/models/post.model";
import { useAppDispatch } from "./../hooks/hooks";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { FirebaseError } from "firebase/app";
import { UserService } from "../services/user.service";
import {
  setLoadingMessage,
  startLoadingProcessing,
  stopLoadingProcessing,
  toggleUserStoryDialog,
} from "../hooks/reducers/app.reducer";
import ViewStory from "./view-story";

function FollowersStory() {
  let fileRef = useRef(null);
  let dispatch = useAppDispatch();
  let userservice = new UserService();

  const userInfo = useAppSelector((state) => state.auth.authUserFullBio);
  const allRelations = useAppSelector((state) => state.user.userRelations);
  const AllUsers = useAppSelector((state) => state.user.allUsers);
  const userStories = useAppSelector((state) => state.user.userStories);

  const [following, setFollowing] = useState([]);
  const [myStories, setMyStories] = useState<
    { reference: string; downloadURL: string }[]
  >([]);
  const [storyDialog, setStoryDialog] = useState<boolean>(false);
  const [loading1, setLoading1] = useState(false);
  const [viewStoryMedia, setViewStory] = useState<Story>(null);
  const [selectedUser, setSelectedUser] = useState<UserBio>(null);

  useEffect(() => {
    const findIfFollowingExist = (relation: Relation) => {
      return AllUsers.filter((user) => user.id === relation.following);
    };

    if (allRelations.length) {
      allRelations.filter(async (relation) => {
        let response = await findIfFollowingExist(relation);
        setFollowing(response);
      });
    }
  }, [AllUsers, allRelations]);

  // CONVERT TO BASE 64;
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadFile = async (e: any) => {
    if (e.target.files.length) {
      let images = [];
      for (let file of e.target.files) {
        await getBase64(file).then((response) => {
          images.push(response);
        });
      }

      let stories = [];

      if (images.length === e.target.files.length) {
        for (let base64 of images) {
          await uploadImageToCloud(base64).then((response) => {
            stories.push(response);
          });
        }
      }

      dispatch(stopLoadingProcessing());
      setStoryDialog(true);
      setMyStories(stories);
    }
  };

  const uploadMedia = () => {
    fileRef.current.click();
  };

  const uploadImageToCloud = (base64: any) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(
        storage,
        "stories/" + userInfo.username + "_" + nanoid()
      );

      dispatch(startLoadingProcessing());
      dispatch(setLoadingMessage("Uploading Images..."));

      const uploadTask = uploadString(storageRef, base64, "data_url");

      uploadTask
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

  const renderFooter = (name) => {
    return (
      <div>
        <Button
          label="Cancel"
          icon="pi pi-times"
          onClick={() => onDialogHide()}
          className="p-button-text"
        />
        <Button
          label="Share"
          icon="pi pi-send"
          loading={loading1}
          onClick={() => shareStory()}
          autoFocus
        />
      </div>
    );
  };

  const onDialogHide = () => {
    setStoryDialog(false);
  };

  const shareStory = () => {
    if (myStories.length) {
      setLoading1(true);
      const newStory = {
        userId: userInfo.id,
        story: myStories,
        createdAt: new Date().toUTCString(),
        watched: [],
      };

      userservice
        .UploadMyStory(newStory)
        .then((response) => {
          setMyStories([]);
          setLoading1(false);
          onDialogHide();
        })
        .catch((err: FirebaseError) => {
          setLoading1(false);
          Alert("error", "File Delete", err.message);
        });
    }
  };

  // REMOVE IMAGE FILE
  const removeFile = (index: number, reference: string) => {
    console.log(index, reference);
    const imageRef = ref(storage, reference);
    // Delete the file
    deleteObject(imageRef)
      .then(() => {
        // File deleted successfully
        setMyStories(
          myStories.filter((story) => story.reference !== reference)
        );
      })
      .catch((error: FirebaseError) => {
        // Uh-oh, an error occurred!
        Alert("error", "File Delete", error.message);
      });
  };

  const checkIfAuthHasWatched = () => {
    if (userStories.length) {
      const storyFound = userStories.find(
        (story) => story.userId === userInfo.id
      );
      if (storyFound) {
        if (storyFound.watched.length === 0) {
          return true;
        } else {
          console.log(
            "checking watched reached this condition",
            storyFound.watched.find((watch) => watch === userInfo.id)
          );

          return storyFound.watched.find((watch) => watch === userInfo.id)
            ? false
            : true;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  // FETCH USER PROFILE
  const getUserProfileImage = (followed: UserBio): string => {
    return AllUsers.find((user) => user.id === followed.id).profilePic
      .downloadURL;
  };

  // view story
  const viewStory = (userInfo) => {
    const storyFound = userStories.find(
      (story) => story.userId === userInfo.id
    );

    if (storyFound) {
      setSelectedUser(userInfo);
      setViewStory(storyFound);

      dispatch(toggleUserStoryDialog(true));
    }
  };

  return (
    <section>
      <div className="followers-story-section">
        <section className="d-flex align-items-center flex-column story-container">
          <div
            onClick={() => viewStory(userInfo)}
            className={`symbol symbol-40 symbol-lg-40 symbol-circle user-following-story active`}
          >
            <img
              alt="Pic"
              src={
                userInfo && userInfo.profilePic.downloadURL
                  ? userInfo.profilePic.downloadURL
                  : require("../assets/users/blank.png")
              }
            />

            <button
              className="symbol-badge symbol-badge-bottom"
              onClick={uploadMedia}
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
          <input
            hidden
            type="file"
            ref={fileRef}
            onChange={(e) => uploadFile(e)}
            multiple
          />
          <span className="font-weight-bolder mt-1">Your Story</span>
        </section>

        {following?.map((user: UserBio) => {
          return (
            <section
              className="d-flex align-items-center flex-column story-container"
              key={user.id}
            >
              <div
                className={`symbol symbol-40 symbol-lg-40 symbol-circle user-following-story active`}
                key={user.id}
              >
                <img
                  alt="Pic"
                  src={
                    getUserProfileImage(user)
                      ? getUserProfileImage(user)
                      : require("../assets/users/blank.png")
                  }
                />
              </div>

              <span className="font-weight-bolder mt-1">{user.username}</span>
            </section>
          );
        })}
      </div>

      <Dialog
        header="My Story"
        visible={storyDialog}
        position="top"
        modal
        style={{ width: "50vw" }}
        footer={renderFooter("displayPosition")}
        onHide={() => onDialogHide()}
        draggable={false}
        resizable={false}
        baseZIndex={1000}
      >
        <div className="m-0 story-dialog">
          <Swiper
            spaceBetween={20}
            slidesPerView={3}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
          >
            {myStories?.map((story, index) => {
              return (
                <SwiperSlide
                  style={{ position: "relative" }}
                  key={story.reference}
                >
                  <button
                    type="button"
                    onClick={() => removeFile(index, story.reference)}
                    className="btn btn-outline-secondary btn-icon"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                  <img
                    src={story.downloadURL}
                    width="100%"
                    className="rounded img-fluid"
                    alt=""
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </Dialog>

      <ViewStory story={viewStoryMedia} user={selectedUser}></ViewStory>
    </section>
  );
}

export default FollowersStory;
