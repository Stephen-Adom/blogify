import React, { useEffect, useState } from "react";
import { Divider } from "primereact/divider";
import { useAppSelector } from "../hooks/hooks";
import { Post, UserBio } from "../utils/models/post.model";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { format } from "date-fns";
import { UserService } from "../services/user.service";
import { FirebaseError } from "firebase/app";
import { PostService } from "../services/post.service";

export default function Bookmarks() {
  const allPosts = useAppSelector((state) => state.post.allPosts);
  const userInfo: UserBio = useAppSelector(
    (state) => state.auth.authUserFullBio
  );
  const AllUsers = useAppSelector((state) => state.user.allUsers);
  const userservice = new UserService();
  const postservice = new PostService();

  const [bookmarks, setBookmarks] = useState<Post[]>([]);
  const [swiperRef, setSwiperRef] = useState(null);

  useEffect(() => {
    if (userInfo) {
      if (allPosts.length) {
        let filteredPost: Post[] = [];
        userInfo.bookmarks.forEach((bookmark) => {
          const postExist = allPosts.find(
            (post) => post.id === bookmark.postId
          );
          if (postExist) {
            filteredPost.push(postExist);
          }
        });

        console.log(filteredPost, "filteredPost");
        setBookmarks(filteredPost);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPosts, userInfo]);

  const formatDate = (date: string) => {
    return format(new Date(date), "dd MMM");
  };

  const formatTime = (date: string) => {
    return format(new Date(date), "kk:mm aa");
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

  return (
    <section id="bookmarks">
      <h5 className="text-left page-title">
        <i className="pi pi-bookmark page-icon"></i> Available Bookmarks(
        {bookmarks.length})
      </h5>

      <Divider />

      <div className="mt-4">
        {bookmarks.length
          ? bookmarks.map((bookmark) => {
              return (
                <div
                  className="card card-custom bookmark-card"
                  key={bookmark.id}
                >
                  <div className="card-body">
                    <div className="symbol mr-3">
                      <img
                        alt="Pic"
                        src={
                          getUserInfo(bookmark.author.id)
                            ? getUserInfo(bookmark.author.id)
                            : require("../assets/users/blank.png")
                        }
                      />
                    </div>
                    <div className="text-left" style={{ width: "94%" }}>
                      <section className="d-flex align-items-center justify-content-between">
                        <div>
                          <div className="d-flex align-items-center">
                            <h5 className="font-weight-bold mb-0">
                              {bookmark.author.displayName}
                            </h5>
                            <span className="font-weight-bold text-muted ml-2">
                              @{bookmark.author.username}
                            </span>
                          </div>
                          <span className="d-block font-weight-bold text-muted">
                            {formatDate(bookmark.createdAt)} at
                            {formatTime(bookmark.createdAt)}
                          </span>
                        </div>

                        {/* <button type="button" className="btn btn-custom">
                          view
                        </button> */}
                      </section>
                      <Divider />
                      <p>{bookmark.content}</p>

                      {bookmark.media.length ? (
                        <section style={{ position: "relative" }}>
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
                          <Swiper
                            // install Swiper modules
                            modules={[Navigation, Pagination, Scrollbar, A11y]}
                            pagination={{ clickable: true }}
                            onSwiper={(swiper) => setSwiperRef(swiper)}
                            onSlideChange={() => console.log("slide change")}
                          >
                            {bookmark.media.map((media) => {
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

                      <section className="post-actions">
                        <div className="d-flex align-items-center">
                          <span>
                            <i className="flaticon2-chat-1 mr-1"></i>
                            <span>{bookmark.comments.length} Comment(s)</span>
                          </span>

                          <span onClick={() => likePost(bookmark)}>
                            <i
                              className={`mr-1 ${checkIfPostLiked(bookmark)}`}
                            ></i>
                            <span>{bookmark.likes.length} Like(s)</span>
                          </span>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </section>
  );
}
