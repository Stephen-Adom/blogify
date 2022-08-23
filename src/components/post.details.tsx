import { useRef, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { useAppSelector } from "../hooks/hooks";
import { useAppDispatch } from "./../hooks/hooks";
import {
  closePostSidebar,
  setLoadingMessage,
  startLoadingProcessing,
  stopLoadingProcessing,
} from "../hooks/reducers/app.reducer";
import { Dialog } from "primereact/dialog";
import Picker from "emoji-picker-react";
import { Divider } from "primereact/divider";
import { format, formatDistanceStrict } from "date-fns";
import { PostService } from "../services/post.service";
import { Bookmark, Post, UserBio } from "../utils/models/post.model";
import { FirebaseError } from "firebase/app";
import { Tooltip } from "primereact/tooltip";
import { Alert, ToastAlert } from "../lib/alerts";
import { nanoid } from "nanoid";
import { OverlayPanel } from "primereact/overlaypanel";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { storage } from "../utils/firebase.config";
import { getPostDetail } from "../hooks/reducers/post-reducer";
import { UserService } from "./../services/user.service";
import {
  setAuthUserBio,
  updateUserBookmark,
} from "../hooks/reducers/auth.reducer";
import { AuthService } from "../services/auth.service";

export default function PostDetails() {
  const dispatch = useAppDispatch();
  const postservice = new PostService();
  const userservice = new UserService();
  const authservice = new AuthService();

  let post = useAppSelector((state) => state.post.postDetail);
  const sidebarStatus = useAppSelector((state) => state.app.postDetailSidebar);
  const userInfo: UserBio = useAppSelector(
    (state) => state.auth.authUserFullBio
  );

  const AllUsers = useAppSelector((state) => state.user.allUsers);
  const [openDialog, setDialogStatus] = useState(false);
  const [comment, setComment] = useState<string>("");
  const [postImages, setPostImages] = useState<
    { reference: string; downloadURL: string }[]
  >([]);
  let imageOverlayRef = useRef(null);

  // HIDE DIALOG COMPONENT
  const onHide = () => {
    setDialogStatus(false);
  };

  const onEmojiClick = (event, emojiObject) => {
    setComment((current) => current + emojiObject.emoji);
    console.log(emojiObject.emoji);
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

  const formatDate = (date: string) => {
    return format(new Date(date), "dd MMM");
  };

  const formatTime = (date: string) => {
    return format(new Date(date), "kk:mm aa");
  };

  const likePost = () => {
    const currentPost = { ...post };
    const newAuthor = {
      id: userInfo.id,
      displayName: userInfo.firstname + " " + userInfo.lastname,
      profilePic: userInfo.profilePic.downloadURL,
      username: userInfo.username,
    };

    const userExist = currentPost.likes.find(
      (author) => author.id === newAuthor.id
    );

    if (!userExist) {
      currentPost.likes = [...currentPost.likes, newAuthor];
      updateLikeActivity(currentPost);
    } else {
      currentPost.likes = currentPost.likes.filter(
        (author) => author.username !== newAuthor.username
      );
    }
    dispatch(getPostDetail(currentPost));

    console.log(post);

    // console.log(userExist, userInfo, currentPost);

    postservice
      .UpdateLikePost(currentPost)
      .then((response) => {
        fetchPostDetails();
      })
      .catch((err: FirebaseError) => {
        console.log(err);
      });
  };

  // CHECK IF POST LIKED
  const checkIfPostLiked = () => {
    if (userInfo) {
      return post.likes.find((author) => author.username === userInfo.username)
        ? "pi pi-heart-fill"
        : "pi pi-heart";
    } else {
      return "pi pi-heart";
    }
  };

  // SEND COMMENT
  const sendComment = () => {
    if (comment) {
      const currentPost: Post = { ...post };

      const newComment = {
        id: nanoid(),
        author: {
          id: userInfo.id,
          displayName: userInfo.firstname + " " + userInfo.lastname,
          profilePic: userInfo.profilePic.downloadURL,
          username: userInfo.username,
        },
        media: postImages,
        comment,
        createdAt: new Date().toUTCString(),
      };

      currentPost.comments = [...currentPost.comments, newComment];

      postservice
        .UpdateCommentPost(currentPost)
        .then((response) => {
          updateCommentActivity(currentPost);

          fetchPostDetails();
          setComment("");
          setPostImages([]);
          ToastAlert("success", "Comment Sent");
        })
        .catch((err: FirebaseError) => {
          console.log(err);
        });
    }
    console.log(comment);
  };

  // FETCH POST DETAILS
  const fetchPostDetails = () => {
    postservice
      .FetchPostInfo(post.id)
      .then((doc) => {
        console.log(doc.data());
        const postUpdate = {
          id: doc.id,
          content: doc.data().content,
          media: doc.data().media,
          createdAt: doc.data().createdAt,
          author: doc.data().author,
          likes: doc.data().likes,
          comments: doc.data().comments,
        };
        dispatch(getPostDetail(postUpdate));
      })
      .catch((err: FirebaseError) => {
        console.log(err);
      });
  };

  const formatCommentDate = (createdAt: string) => {
    return formatDistanceStrict(new Date(createdAt), new Date(), {
      addSuffix: true,
    });
  };

  // REMOVE POST IMAGE
  const removePostImage = (reference: string) => {
    const imageRef = ref(storage, reference);
    // Delete the file
    deleteObject(imageRef)
      .then(() => {
        // File deleted successfully
        const imageToDelete = postImages.find(
          (image) => image.reference === reference
        );
        const index = postImages.indexOf(imageToDelete);
        postImages.splice(index, 1);
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

  // UPDATE ACTIVITY
  const updateCommentActivity = (post: Post) => {
    if (userInfo.id !== post.author.id) {
      const activity = {
        userId: post.author.id,
        activity: `${userInfo.username} commented on your post`,
        createdAt: new Date().toUTCString(),
        targetId: post.id,
        author: userInfo.id,
        type: "comment",
      };
      userservice
        .UpdateUserActivities(activity)
        .then((response) => {
          console.log(response);
        })
        .catch((err: FirebaseError) => {
          console.log(err);
        });
    }
  };

  const updateLikeActivity = (post: Post) => {
    if (userInfo.id !== post.author.id) {
      const activity = {
        userId: post.author.id,
        activity: `${userInfo.username} liked your post`,
        createdAt: new Date().toUTCString(),
        targetId: post.id,
        author: userInfo.id,
        type: "like",
      };
      userservice
        .UpdateUserActivities(activity)
        .then((response) => {
          console.log(response);
        })
        .catch((err: FirebaseError) => {
          console.log(err);
        });
    }
  };

  const closeSidebar = () => {
    setComment("");
    setPostImages([]);
    dispatch(closePostSidebar());
  };

  const getUserInfo = (id: string) => {
    if (userInfo && AllUsers.length) {
      if (userInfo.id === id) {
        return userInfo.profilePic.downloadURL;
      } else {
        return AllUsers.find((user) => user.id === id).profilePic.downloadURL;
      }
    }
    return null;
  };

  // SAVE POST
  const savePost = (post: Post) => {
    const newBookmark = {
      id: "bm-" + nanoid(),
      postId: post.id,
      createdAt: new Date().toUTCString(),
    };

    const bookmarkExist = userInfo.bookmarks.find(
      (bookmark) => bookmark.postId === post.id
    );

    let updatedBookmarks: Bookmark[] = [];

    if (bookmarkExist) {
      updatedBookmarks = userInfo.bookmarks.filter(
        (bookmark) => bookmark.postId !== post.id
      );
    } else {
      updatedBookmarks = [...userInfo.bookmarks, newBookmark];
    }

    // UPDATE USER BOOKMARK IN STORE
    dispatch(updateUserBookmark(updatedBookmarks));
    // UPDATE USER BOOKMARK IN STORE

    userservice
      .SavePost(userInfo.id, updatedBookmarks)
      .then((response) => {
        ToastAlert("success", "Saved Post Updated");
        return authservice.CheckIfUserUsernameExist(userInfo.username);
      })
      .then((response) => {
        const user = {
          id: response.docs[0].id,
          firstname: response.docs[0].data().firstname,
          lastname: response.docs[0].data().lastname,
          email: response.docs[0].data().email,
          phone: response.docs[0].data().phone,
          username: response.docs[0].data().username,
          createdAt: JSON.stringify(response.docs[0].data().createdAt),
          gender: response.docs[0].data().gender,
          bio: response.docs[0].data().bio,
          dob: response.docs[0].data().dob,
          website: response.docs[0].data().website,
          occupation: response.docs[0].data().occupation,
          location: response.docs[0].data().location,
          profilePic: response.docs[0].data().profilePic,
          followers: response.docs[0].data().followers,
          following: response.docs[0].data().following,
          bookmarks: response.docs[0].data().bookmarks,
        };

        dispatch(setAuthUserBio(user));
      })
      .catch((err: FirebaseError) => {
        console.log(err);
      });
  };

  // CHECK IF POST BOOKMARKED
  const checkIfBookmarked = (post: Post) => {
    if (userInfo) {
      return userInfo.bookmarks.find((bookmark) => bookmark.postId === post.id)
        ? "pi pi-bookmark-fill"
        : "pi pi-bookmark";
    } else {
      return "pi pi-bookmark";
    }
  };

  return (
    <section id="postDetails">
      <Sidebar
        className="postDetail-sidebar"
        visible={sidebarStatus}
        position="right"
        onHide={closeSidebar}
        blockScroll={true}
        closeOnEscape={true}
      >
        {post ? (
          <div
            className="card card-custom post-card"
            style={{ boxShadow: "none" }}
          >
            <div className="card-body" style={{ padding: "16px 16px 0px 4px" }}>
              <section className="post-header d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div className="symbol mr-3">
                    <img
                      alt="Pic"
                      src={
                        getUserInfo(post.author.id)
                          ? getUserInfo(post.author.id)
                          : require("../assets/users/blank.png")
                      }
                    />
                  </div>
                  <div>
                    <h5 className="font-weight-bold mb-0">
                      {post.author.displayName}
                    </h5>
                    <span className="d-block font-weight-bold text-muted">
                      {formatDate(post.createdAt)} at{" "}
                      {formatTime(post.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="dropdown mr-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-icon btn-sm"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="ki ki-bold-more-hor text-muted"></i>
                  </button>
                  <div className="dropdown-menu">
                    <span className="dropdown-item">Delete Post</span>
                  </div>
                </div>
              </section>

              <section className="post-content text-left mt-5">
                <p>{post.content}</p>

                {post.media.length ? (
                  <div
                    id="carouselExampleIndicators"
                    className="carousel slide"
                    data-bs-ride="true"
                  >
                    <div className="carousel-indicators">
                      {post.media.map((media, index) => {
                        return (
                          <button
                            key={media.reference}
                            type="button"
                            data-bs-target="#carouselExampleIndicators"
                            data-bs-slide-to={index}
                            className={index === 0 ? "active" : ""}
                            aria-current={index === 0 ? true : false}
                            aria-label={`Slide ${index + 1}`}
                          ></button>
                        );
                      })}
                    </div>
                    <div className="carousel-inner">
                      {post.media.map((media, index) => {
                        return (
                          <div
                            key={media.reference}
                            className={`carousel-item ${
                              index === 0 ? "active" : ""
                            }`}
                          >
                            <img
                              src={media.downloadURL}
                              className="d-block w-100"
                              alt="..."
                            />
                          </div>
                        );
                      })}
                    </div>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                ) : null}
              </section>

              <section style={{ marginTop: "34px" }}>
                <Divider type="dashed"></Divider>
              </section>

              <section className="post-actions d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <span>
                    <i className="flaticon2-chat-1 mr-1"></i>
                    <span>{post.comments.length} Comment(s)</span>
                  </span>

                  <span onClick={() => likePost()}>
                    <i className={`mr-1 ${checkIfPostLiked()}`}></i>
                    <span>{post.likes.length} Like(s)</span>
                  </span>
                </div>

                <span onClick={() => savePost(post)}>
                  <i className={`mr-1 ${checkIfBookmarked(post)}`}></i>
                </span>
              </section>
            </div>
          </div>
        ) : null}

        <Divider type="dashed"></Divider>

        <section className="postDetails-comment-list">
          {/* begin::Item */}
          {post && post.comments.length
            ? post.comments.map((comment) => {
                return (
                  <section key={comment.id}>
                    <div className="d-flex py-5">
                      {/*<!--begin::Symbol--> */}
                      <div className="symbol symbol-40 mr-5 mt-1">
                        <span className="symbol-label">
                          <img
                            src={
                              getUserInfo(comment.author.id)
                                ? getUserInfo(comment.author.id)
                                : require("../assets/users/blank.png")
                            }
                            className="h-75 align-self-end"
                            alt=""
                          />
                        </span>
                      </div>
                      {/*<!--end::Symbol--> */}

                      {/*<!--begin::info--> */}
                      <div className="d-flex flex-column flex-row-fluid">
                        {/*<!--begin::info--> */}
                        <div className="d-flex align-items-center flex-wrap">
                          <span className="text-dark-75 text-hover-primary mb-1 font-size-lg font-weight-bolder pr-6">
                            {comment.author.displayName}
                          </span>
                          <span className="text-muted font-weight-normal flex-grow-1 font-size-sm">
                            @{comment.author.username}
                          </span>
                          <span className="text-muted font-weight-normal font-size-sm">
                            {formatCommentDate(comment.createdAt)}
                          </span>
                        </div>

                        <span className="text-dark-75 font-size-sm font-weight-normal pt-1">
                          {comment.comment}
                        </span>
                        <div className="row mt-3">
                          {comment.media.length
                            ? comment.media.map((media) => {
                                return (
                                  <div
                                    className="col-lg-6 col-12"
                                    key={media.reference}
                                  >
                                    <img
                                      src={media.downloadURL}
                                      className="img-fluid img-thumbnail"
                                      alt="comment Img"
                                    />
                                  </div>
                                );
                              })
                            : null}
                        </div>
                        {/*<!--end::info--> */}
                      </div>
                      {/*<!--end::info--> */}
                    </div>

                    <Divider type="dashed"></Divider>
                  </section>
                );
              })
            : null}

          {/*<!--end::Item--> */}
        </section>

        <section className="postDetails-comment-form">
          {/** START:: AUTH USER COMMENT SECTIONS */}

          <section className="d-flex align-items-center">
            <div className="symbol symbol-40 mr-3">
              <img
                alt="Pic"
                src={
                  userInfo && userInfo.profilePic.downloadURL
                    ? userInfo.profilePic.downloadURL
                    : require("../assets/users/blank.png")
                }
              />
            </div>
            <textarea
              className="form-control form-control-solid"
              id="exampleTextarea"
              rows={2}
              placeholder="write your comments..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <div className="ml-4 d-flex align-items-center">
              <Tooltip
                target=".comment-emoji-btn"
                content="emoji picker"
                position="bottom"
              />

              <button
                className="btn btn-light comment-emoji-btn"
                onClick={() => setDialogStatus(true)}
              >
                <img
                  src={require("../assets/images/emoji.png")}
                  width="20px"
                  style={{ filter: "grayscale(1)" }}
                  alt=""
                />
              </button>

              <div
                className="box-1"
                onMouseEnter={(e) => imageOverlayRef.current.toggle(e)}
              >
                <input
                  type="file"
                  name="file-1[]"
                  id="file-1"
                  className="inputfile inputfile-2"
                  data-multiple-caption="{count} files selected"
                  multiple={true}
                  onChange={(e) => handleImageUpload(e)}
                />
                <Tooltip
                  target=".uploadLabel"
                  content="Upload Image"
                  position="bottom"
                />
                <label htmlFor="file-1" className="uploadLabel">
                  <span>
                    <i className="pi pi-image"></i>
                  </span>
                </label>
              </div>

              <Tooltip
                target=".send-btn"
                content="post comment"
                position="bottom"
              />
              <button
                type="button"
                className="btn btn-icon btn-light send-btn"
                onClick={sendComment}
              >
                <span className="d-block">
                  <i className="pi pi-send text-muted"></i>
                </span>
              </button>
            </div>
          </section>

          {/** END:: AUTH USER COMMENT SECTIONS */}
        </section>
      </Sidebar>

      <OverlayPanel
        ref={imageOverlayRef}
        showCloseIcon
        id="overlay_panel"
        style={{ width: "300px" }}
        className="overlaypanel-demo"
      >
        <div className="row mt-3 w-100 mx-3">
          {postImages.length
            ? postImages.map((image) => {
                return (
                  <div
                    className="col-12 text-left image-col"
                    key={image.reference}
                  >
                    <button
                      type="button"
                      className="btn btn-icon btn-circle btn-custom remove-image-btn"
                      onClick={() => removePostImage(image?.reference)}
                    >
                      <i className="pi pi-times"></i>
                    </button>
                    <img
                      src={image?.downloadURL}
                      className="img-fluid rounded img-thumbnail"
                      width="100%"
                      alt=""
                    />
                  </div>
                );
              })
            : null}
        </div>
      </OverlayPanel>

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
    </section>
  );
}
