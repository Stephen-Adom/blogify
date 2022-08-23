import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import { closeAddPostModal } from "../hooks/reducers/post-reducer";
import { UserBio } from "../utils/models/post.model";
import { Mention } from "primereact/mention";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { storage } from "../utils/firebase.config";
import { FirebaseError } from "firebase/app";
import { Alert, ToastAlert } from "../lib/alerts";
import { nanoid } from "nanoid";
import { Tooltip } from "primereact/tooltip";
import { PostService } from "../services/post.service";
import Picker from "emoji-picker-react";
import {
  setLoadingMessage,
  startLoadingProcessing,
  stopLoadingProcessing,
} from "../hooks/reducers/app.reducer";

export default function AddPostModal() {
  const userInfo: UserBio = useAppSelector(
    (state) => state.auth.authUserFullBio
  );
  const showModal = useAppSelector((state) => state.post.showPostModal);
  const dispatch = useAppDispatch();
  const postservice = new PostService();

  const [suggestions, setSuggestions] = useState([]);
  const [post, setPost] = useState<any>("");
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

  // REMOVE POST IMAGE
  const removePostImage = (reference: string) => {
    const imageToDelete = postImages.find(
      (image) => image.reference === reference
    );
    setPostImages(
      postImages.filter((image) => image.reference !== imageToDelete.reference)
    );

    // REMOVE FROM DB
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

  // CONVERT TO BASE 64;
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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
          console.log(response, "response");
          setLoading1(false);
          ToastAlert("success", "Post Submitted");
          setPost("");
          setPostImages([]);
          onHide();
        })
        .catch((error: FirebaseError) => {
          console.log(error);
        });
    } else {
      setLoading1(false);
      Alert("info", "New Post", "Let people know what's you're thinking!");
    }
  };

  const onHide = () => {
    dispatch(closeAddPostModal());
  };

  const renderFooter = () => {
    return (
      <div className="d-flex align-items-center justify-content-between">
        <section className="d-flex align-items-center">
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
          <div className="box">
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
        </section>

        <section>
          <Button
            label="Close"
            icon="pi pi-times"
            onClick={() => onHide()}
            className="p-button-text"
          />
          <Button
            label="Post"
            icon="pi pi-check"
            loading={loading1}
            onClick={() => sendPost()}
          />
        </section>
      </div>
    );
  };

  // RENDER DIALOG PICKER FOOTER
  const renderPickerFooter = () => {
    return (
      <div>
        <Button
          label="Close"
          icon="pi pi-times"
          onClick={() => onPickerHide()}
          className="p-button-text"
        />
      </div>
    );
  };

  const onPickerHide = () => {
    setDialogStatus(false);
  };

  const onEmojiClick = (event, emojiObject) => {
    setPost((current) => current + emojiObject.emoji);
    console.log(emojiObject.emoji);
  };

  return (
    <Dialog
      header="Add Post"
      visible={showModal}
      position="top"
      modal
      style={{ width: "50vw" }}
      footer={renderFooter()}
      onHide={() => onHide()}
      draggable={false}
      resizable={false}
    >
      <section className="add_Post_modal" style={{ position: "relative" }}>
        <div className="d-flex align-items-center">
          <div className="symbol mr-3">
            <img alt="Pic" src={require("../assets/users/100_10.jpg")} />
          </div>
          <Mention
            style={{ height: "100px", width: "100%" }}
            trigger="@"
            suggestions={suggestions}
            onSearch={onSearch}
            field="nickname"
            value={post}
            onChange={(e) => setPost(e.target["value"])}
            placeholder="What's happening?"
          />
        </div>

        <div className="row mt-3 w-100 mx-3">
          {postImages.length
            ? postImages.map((image) => {
                return (
                  <div
                    className="col text-left image-col"
                    key={image.reference}
                  >
                    <button
                      type="button"
                      className="btn btn-icon btn-circle btn-custom remove-image-btn"
                      onClick={() => removePostImage(image.reference)}
                    >
                      <i className="pi pi-times"></i>
                    </button>
                    <img
                      src={image.downloadURL}
                      className="img-fluid rounded img-thumbnail"
                      width={postImages.length > 1 ? "100%" : "30%"}
                      alt=""
                    />
                  </div>
                );
              })
            : null}
        </div>

        {/** START:: EMOJI DIALOG COMPOENT */}
        <Dialog
          header="Select Emoji..."
          visible={openDialog}
          position="bottom"
          modal
          style={{ width: "28vw" }}
          footer={renderPickerFooter()}
          onHide={() => onPickerHide()}
          draggable={false}
          resizable={false}
        >
          <p className="m-0">
            <Picker onEmojiClick={onEmojiClick} />
          </p>
        </Dialog>

        {/** END:: EMOJI DIALOG COMPOENT */}
      </section>
    </Dialog>
  );
}
