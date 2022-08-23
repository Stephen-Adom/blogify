import { Dialog } from "primereact/dialog";
import { useAppSelector } from "../hooks/hooks";
import { Button } from "primereact/button";
import { useAppDispatch } from "./../hooks/hooks";
import { toggleUserStoryDialog } from "../hooks/reducers/app.reducer";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import { UserService } from "../services/user.service";
import { FirebaseError } from "firebase/app";

export default function ViewStory({ story, user }) {
  let dispatch = useAppDispatch();
  const dialogStatus = useAppSelector((state) => state.app.userStoryDialog);
  const userInfo = useAppSelector((state) => state.auth.authUserFullBio);
  const [swiperRef, setSwiperRef] = useState(null);
  let userservice = new UserService();

  console.log(story);

  const onHide = () => {
    dispatch(toggleUserStoryDialog(false));
  };

  const renderFooter = () => {
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

  useEffect(() => {
    if (story) {
      const userWatched = story.watched.find(
        (id: string) => id === userInfo.id
      );

      console.log(story.watched, userWatched, "story");

      if (!userWatched) {
        let watchedUsers = [...story.watched];
        watchedUsers.push(userInfo.id);
        userservice
          .UpdateUserStoryWatched(story, watchedUsers)
          .then((response) => {
            console.log(response);
          })
          .catch((err: FirebaseError) => {
            console.log(err.message);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story]);

  return (
    <section>
      {user ? (
        <Dialog
          header={`${user.firstname} ${user.lastname}`}
          visible={dialogStatus}
          style={{ width: "50vw" }}
          footer={renderFooter()}
          onHide={() => onHide()}
        >
          <section>
            {story.story.length > 1 ? (
              <div className="swiper-controls">
                <button
                  className="btn btn-white btn-sm btn-circle"
                  onClick={() => swiperRef.slidePrev()}
                >
                  <i className="pi pi-angle-left"></i>
                </button>
                <button
                  style={{ right: "56px" }}
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
              {story.story.map((media) => {
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
        </Dialog>
      ) : null}
    </section>
  );
}
