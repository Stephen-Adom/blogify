/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Inplace, InplaceDisplay, InplaceContent } from "primereact/inplace";
import { Mention } from "primereact/mention";
import { Alert, ToastAlert } from "../lib/alerts";
import { PostService } from "../services/post.service";

import { useAppSelector } from "../hooks/hooks";
import { FirebaseError } from "firebase/app";
import { storage } from "../utils/firebase.config";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { Tooltip } from "primereact/tooltip";
import { UserBio } from "../utils/models/post.model";
import { nanoid } from "nanoid";
import { useAppDispatch } from "./../hooks/hooks";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import Picker from "emoji-picker-react";
import {
  setLoadingMessage,
  startLoadingProcessing,
  stopLoadingProcessing,
} from "../hooks/reducers/app.reducer";
import imageUploadToCloud from "./HOC/imageUploadToCloud";

function AddPost(props) {
  const dispatch = useAppDispatch();
  const userInfo: UserBio = useAppSelector(
    (state) => state.auth.authUserFullBio
  );

  const postservice = new PostService();

  const [post, setPost] = useState<any>("");
  const [suggestions, setSuggestions] = useState([]);
  // const [multipleSuggestions, setMultipleSuggestions] = useState([]);
  const [postImages, setPostImages] = useState<
    { reference: string; downloadURL: string }[]
  >([]);
  const [openDialog, setDialogStatus] = useState(false);
  const [loading1, setLoading1] = useState(false);

  const onSearch = (event: any) => {
    //in a real application, make a request to a remote url with the query and return suggestions, for demo we filter at client side
    setTimeout(() => {
      const query = event["query"];
      let suggestions;

      if (!query.trim().length) {
        // suggestions = [...customers];
      } else {
        // suggestions = customers.filter((customer) => {
        //     return customer.nickname.toLowerCase().startsWith(query.toLowerCase());
        // });
      }

      setSuggestions(suggestions);
    }, 250);
  };

  // CONVERT TO BASE 64;
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const sendPost = () => {
    if (post) {
      setLoading1(true);
      const newPost = {
        id: nanoid(),
        content: post,
        createdAt: new Date().toUTCString(),
        media: postImages,
        author: {
          id: userInfo.id,
          displayName: userInfo.firstname + " " + userInfo.lastname,
          profilePic: userInfo.profilePic.downloadURL
            ? userInfo.profilePic.downloadURL
            : "",
          username: userInfo.username,
        },
        likes: [],
        comments: [],
      };

      postservice
        .AddNewPost(newPost)
        .then((response) => {
          setLoading1(false);
          ToastAlert("success", "Post Submitted");
          setPost("");
          setPostImages([]);
        })
        .catch((error: FirebaseError) => {
          console.log(error);
        });
    } else {
      setLoading1(false);
      Alert("info", "New Post", "Let people know what's you're thinking!");
    }
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    let images = [];
    for (let file of files) {
      await getBase64(file).then((response) => {
        images.push(response);
      });
    }

    if (images.length === files.length) {
      for (let base64 of images) {
        await uploadImageToCloud(base64)
          .then((response: { reference: string; downloadURL: string }) => {
            if (response) {
              setPostImages((current) => [...current, response]);
              console.log("done uploading 1");
            }
          })
          .catch((err) => {
            Alert("error", "Image Upload", err);
          });
      }
    }

    dispatch(stopLoadingProcessing());
  };

  const uploadImageToCloud = (base64: string) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(
        storage,
        "images/" + userInfo.username + "_" + nanoid()
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

  // REMOVE POST IMAGE
  const removePostImage = (reference: string, index: number) => {
    const imageToDelete = postImages.find(
      (image) => image.reference === reference
    );
    setPostImages(
      postImages.filter((image) => image.reference !== imageToDelete.reference)
    );

    const imageRef = ref(storage, reference);
    // Delete the file
    deleteObject(imageRef)
      .then(() => {
        // File deleted successfully
        console.log("done");
      })
      .catch((error: FirebaseError) => {
        // Uh-oh, an error occurred!
        Alert("error", "File Delete", error.message);
      });
  };

  // RENDER DIALOG FOOTER
  const renderFooter = (name) => {
    return (
      <div>
        <Button
          label="Close"
          icon="pi pi-times"
          onClick={() => onHide()}
          className="p-button-text"
        />
      </div>
    );
  };

  // HIDE DIALOG COMPONENT
  const onHide = () => {
    setDialogStatus(false);
  };

  const onEmojiClick = (event, emojiObject) => {
    setPost((current) => current + emojiObject.emoji);
    console.log(emojiObject.emoji);
  };

  return (
    <div className="user-post-form card card-custom">
      <Inplace closable>
        <InplaceDisplay>
          <div className="card-body d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="symbol">
                <img
                  alt="Pic"
                  src={
                    userInfo && userInfo.profilePic.downloadURL
                      ? userInfo.profilePic.downloadURL
                      : require("../assets/users/blank.png")
                  }
                />
              </div>
              <div className="form-group mb-0">
                <input
                  type="text"
                  className="form-control"
                  placeholder="What's on your mind?"
                />
              </div>
            </div>
            <button type="button" className="btn btn-custom">
              Post
            </button>
          </div>
        </InplaceDisplay>
        <InplaceContent>
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="symbol">
                <img
                  alt="Pic"
                  src={
                    userInfo && userInfo.profilePic.downloadURL
                      ? userInfo.profilePic.downloadURL
                      : require("../assets/users/blank.png")
                  }
                />
              </div>
              <section className="w-100">
                <Mention
                  style={{ maxHeight: "177px" }}
                  trigger="@"
                  suggestions={suggestions}
                  onSearch={onSearch}
                  field="nickname"
                  value={post}
                  onChange={(e) => setPost(e.target["value"])}
                  placeholder="What's happening?"
                />

                <div className="row mt-3 w-100 mx-3">
                  {postImages.length
                    ? postImages.map((image, index) => {
                        return (
                          <div
                            className="col text-left image-col"
                            key={image.reference}
                          >
                            <button
                              type="button"
                              className="btn btn-icon btn-circle btn-custom remove-image-btn"
                              onClick={() =>
                                removePostImage(image?.reference, index)
                              }
                            >
                              <i className="pi pi-times"></i>
                            </button>
                            <img
                              src={image?.downloadURL}
                              className="img-fluid rounded img-thumbnail"
                              width={postImages.length > 1 ? "100%" : "30%"}
                              alt=""
                            />
                          </div>
                        );
                      })
                    : null}
                </div>
              </section>
            </div>
            <div className="mt-3">
              <div
                className="d-flex align-items-center justify-content-end"
                style={{ marginRight: "28px" }}
              >
                <button
                  className="btn btn-light emoji-btn"
                  onClick={() => setDialogStatus(true)}
                >
                  <img
                    src={require("../assets/images/emoji.png")}
                    width="25px"
                    alt=""
                  />
                </button>
                <div className="box mr-3">
                  <input
                    type="file"
                    name="file-1[]"
                    id="file-1"
                    className="inputfile inputfile-1"
                    data-multiple-caption="{count} files selected"
                    multiple={true}
                    onChange={(e) => handleImageUpload(e)}
                  />
                  <Tooltip
                    target=".uploadLabel"
                    content="Upload Image"
                    position="left"
                  />
                  <label htmlFor="file-1" className="uploadLabel">
                    <span>
                      <i className="pi pi-image"></i>
                    </span>
                  </label>
                </div>
                <button
                  disabled={loading1}
                  type="button"
                  className={`btn btn-custom mt-3 addPostBtn ${
                    loading1 && "spinner spinner-white spinner-right"
                  }`}
                  onClick={sendPost}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </InplaceContent>
      </Inplace>

      {/** START:: EMOJI DIALOG COMPOENT */}
      <Dialog
        header="Select Emoji..."
        visible={openDialog}
        position="bottom"
        modal
        style={{ width: "28vw" }}
        footer={renderFooter("displayPosition")}
        onHide={() => onHide()}
        draggable={false}
        resizable={false}
      >
        <p className="m-0">
          <Picker onEmojiClick={onEmojiClick} />
        </p>
      </Dialog>

      {/** END:: EMOJI DIALOG COMPOENT */}
    </div>
  );
}

export default imageUploadToCloud(AddPost);
