/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { format } from "date-fns";
import { useAppSelector } from "../hooks/hooks";
import PostLoader from "./loaders/post.loaders";
import { Divider } from "primereact/divider";
import { Author, Bookmark, Post } from "../utils/models/post.model";
import { UserBio } from "./../utils/models/post.model";
import { PostService } from "../services/post.service";
import { FirebaseError } from "firebase/app";
import { useAppDispatch } from "./../hooks/hooks";
import { openPostSidebar } from "../hooks/reducers/app.reducer";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { getPostDetail } from "../hooks/reducers/post-reducer";
import PostDetails from "./post.details";
import { nanoid } from "nanoid";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import {
  setAuthUserBio,
  updateUserBookmark,
} from "../hooks/reducers/auth.reducer";
import { ToastAlert } from "../lib/alerts";
import { Link } from "react-router-dom";
import { userInfo } from "os";
import { useNavigate } from "react-router-dom";

function PostList() {
  const postservice = new PostService();
  const userservice = new UserService();
  const authservice = new AuthService();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [swiperRef, setSwiperRef] = useState(null);

  const allPosts = useAppSelector((state) => state.post.allPosts);
  const userInfo: UserBio = useAppSelector(
    (state) => state.auth.authUserFullBio
  );
  const AllUsers = useAppSelector((state) => state.user.allUsers);

  const formatDate = (date: string) => {
    return format(new Date(date), "dd MMM");
  };

  const formatTime = (date: string) => {
    return format(new Date(date), "kk:mm aa");
  };

  const likePost = (post: Post) => {
    const currentPost = { ...post };
    const newAuthor = {
      id: userInfo.id,
      displayName: userInfo.firstname + " " + userInfo.lastname,
      profilePic: userInfo.profilePic.downloadURL,
      username: userInfo.username,
    };
    const userExist = currentPost.likes.find(
      (author) => author.username === userInfo.username
    );
    if (!userExist) {
      currentPost.likes = [...currentPost.likes, newAuthor];

      updateLikeActivity(post);
    } else {
      currentPost.likes = currentPost.likes.filter(
        (author) => author.username !== newAuthor.username
      );
    }

    postservice
      .UpdateLikePost(currentPost)
      .then((response) => {})
      .then((response) => {
        console.log(response);
      })
      .catch((err: FirebaseError) => {
        console.log(err);
      });
  };

  // CHECK IF POST LIKED
  const checkIfPostLiked = (post: Post) => {
    if (userInfo) {
      return post.likes.find((author) => author.username === userInfo.username)
        ? "pi pi-heart-fill"
        : "pi pi-heart";
    } else {
      return "pi pi-heart";
    }
  };

  // UPDATE ACTIVITY
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

  // view post details
  const viewPostDetails = (post) => {
    dispatch(getPostDetail(post));
    dispatch(openPostSidebar());
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

  const checkIfAuthPost = (post: Post) => {
    if (userInfo) {
      return userInfo.id === post.author.id ? false : true;
    }

    return true;
  };

  const viewDetails = (id: string) => {
    if (userInfo && userInfo.id === id) {
      navigate("/blog/my-profile");
    } else {
      navigate(`/blog/profile/${id}`);
    }
  };

  const chatUser = (postAuthor: Author) => {};

  return (
    <div className="post-list-container">
      {allPosts.length ? (
        allPosts.map((post) => {
          return (
            <div className="card card-custom post-card" key={post.id}>
              <div className="card-body" style={{ padding: "24px" }}>
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
                      <div className="d-flex align-items-center">
                        <h5
                          className="font-weight-bold mb-0"
                          onClick={() => viewDetails(post.author.id)}
                        >
                          {post.author.displayName}
                        </h5>
                        <span
                          className="font-weight-bold text-muted ml-2"
                          onClick={() => viewDetails(post.author.id)}
                        >
                          @{post.author.username}
                        </span>
                      </div>
                      <span className="d-block font-weight-bold text-left text-muted">
                        {formatDate(post.createdAt)} at
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
                      <a
                        onClick={() => viewDetails(post.author.id)}
                        className="dropdown-item"
                      >
                        view Profile
                      </a>
                      <span
                        className="dropdown-item"
                        onClick={() => chatUser(post.author)}
                      >
                        Send Message
                      </span>
                      <span
                        className="dropdown-item"
                        hidden={checkIfAuthPost(post)}
                      >
                        Delete Post
                      </span>
                    </div>
                  </div>
                </section>

                <section className="post-content text-left mt-5">
                  <p>{post.content}</p>

                  {post.media.length ? (
                    <section
                      style={{
                        position: "relative",
                        height: "330px",
                        overflowY: "hidden",
                      }}
                    >
                      {post.media.length > 1 ? (
                        <div className="swiper-controls">
                          <button
                            className="btn btn-white btn-sm btn-circle"
                            onClick={() => swiperRef.slidePrev()}
                          >
                            <i className="pi pi-angle-left"></i>
                          </button>
                          <button
                            className="btn btn-white btn-sm btn-circle"
                            onClick={() => swiperRef.slideNext()}
                          >
                            <i className="pi pi-angle-right"></i>
                          </button>
                        </div>
                      ) : null}
                      <Swiper
                        // install Swiper modules
                        modules={[Navigation, Pagination, Scrollbar, A11y]}
                        pagination={{ clickable: true }}
                        onSwiper={(swiper) => setSwiperRef(swiper)}
                        onSlideChange={() => console.log("slide change")}
                      >
                        {post.media.map((media) => {
                          return (
                            <SwiperSlide key={media.reference}>
                              <img
                                src={media.downloadURL}
                                className="img-fluid rounded"
                                width="100%"
                                alt=""
                              />
                            </SwiperSlide>
                          );
                        })}
                      </Swiper>
                    </section>
                  ) : null}
                </section>

                <section style={{ marginTop: "34px" }}>
                  <Divider type="dashed"></Divider>
                </section>

                <section className="post-actions">
                  <div className="d-flex align-items-center">
                    <span onClick={(e) => viewPostDetails(post)}>
                      <i className="flaticon2-chat-1 mr-1"></i>
                      <span>{post.comments.length} Comment(s)</span>
                    </span>

                    <span onClick={() => likePost(post)}>
                      <i className={`mr-1 ${checkIfPostLiked(post)}`}></i>
                      <span>{post.likes.length} Like(s)</span>
                    </span>
                  </div>

                  <span onClick={() => savePost(post)}>
                    <i className={`mr-1 ${checkIfBookmarked(post)}`}></i>
                  </span>
                </section>
              </div>
            </div>
          );
        })
      ) : (
        <PostLoader />
      )}

      <PostDetails></PostDetails>
    </div>
  );
}

export default PostList;
