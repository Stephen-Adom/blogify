import React, { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/hooks";
import { Relation, UserBio } from "./../utils/models/post.model";
// import { useAppDispatch } from "./../hooks/hooks";
import { UserService } from "../services/user.service";
import { FirebaseError } from "firebase/app";
import { ToastAlert } from "../lib/alerts";
// import { fetchAllRelations } from "../hooks/reducers/user.reducer";

function Suggestions() {
  // let dispatch = useAppDispatch();
  const userservice = new UserService();

  const AllUsers = useAppSelector((state) => state.user.allUsers);
  const userInfo = useAppSelector((state) => state.auth.authUserFullBio);
  const allRelations = useAppSelector((state) => state.user.userRelations);
  let [randomUsers, setRandomUsers] = useState<UserBio[]>([]);

  useEffect(() => {
    // FILTER ALL USERS NOT FOLLOWED BY AUTH USER

    const findIfFollowingExist = (relation: Relation) => {
      return AllUsers.filter((user) => user.id !== relation.following);
    };

    if (allRelations.length) {
      allRelations.filter(async (relation) => {
        let response = await findIfFollowingExist(relation);
        console.log(response, "filtered");
        getMeRandomElements(response);
      });
    }

    // GET RANDOM USERS TO FOLLOW
    const getMeRandomElements = (users: UserBio[]) => {
      // GET RANDOM USERS FOR AUTH USER TO FOLLOW
      const shuffledList = users.sort(() => Math.random() - 0.5);
      const newList = shuffledList.slice(0, 10);
      setRandomUsers(newList);
    };
  }, [AllUsers, allRelations]);

  // FOLLOW USER
  const followUser = (user: UserBio, index: number) => {
    const follow = {
      follower: userInfo.id,
      following: user.id,
      createdAt: new Date().toUTCString(),
    };

    // if(randomUsers.length){

    // }else{

    // }

    userservice
      .FollowerUser(follow)
      .then((response) => {
        // return userservice.FetchAllRelations();
      })
      // .then((querySnapshot) => {
      //   const relations = [];
      //   querySnapshot.forEach((doc) => {
      //     relations.push({
      //       id: doc.id,
      //       createdAt: doc.data().createdAt,
      //       follower: doc.data().follower,
      //       following: doc.data().following,
      //     });
      //   });

      //   dispatch(fetchAllRelations(relations));
      // })
      .catch((err: FirebaseError) => {
        ToastAlert("error", err.message);
      });
  };

  return (
    <section>
      {allRelations.length ? (
        <section>
          {randomUsers.length ? (
            <section className="d-flex align-items-center justify-content-between">
              <h6 className="font-weight-bold text-muted">
                SUGGESTIONS FOR YOU
              </h6>
            </section>
          ) : null}

          {randomUsers.length ? (
            <div className="card card-custom suggestion-list mt-3">
              <div className="card-body" style={{ padding: "6px" }}>
                {randomUsers.length
                  ? randomUsers.map((user, index) => {
                      return (
                        <div
                          className="card card-custom suggestion-card"
                          key={user.id}
                        >
                          <div className="card-body">
                            <section className="d-flex align-items-center">
                              <div className="symbol symbol-40 mr-3">
                                <img
                                  alt="Pic"
                                  src={
                                    user.profilePic.downloadURL
                                      ? user.profilePic.downloadURL
                                      : require("../assets/users/blank.png")
                                  }
                                />
                              </div>
                              <div className="text-left">
                                <h5 className="mb-0 font-weight-bold">
                                  {user.firstname} {user.lastname}
                                </h5>
                                <span className="text-muted">
                                  @{user.username}
                                </span>
                              </div>
                            </section>

                            <section>
                              <button
                                type="button"
                                className="btn btn-custom"
                                onClick={() => followUser(user, index)}
                              >
                                Follow
                              </button>
                            </section>
                          </div>
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>
          ) : null}
        </section>
      ) : (
        <div className="card card-custom suggestion-list mt-3">
          <div className="card-body" style={{ padding: "6px" }}>
            {AllUsers.length
              ? AllUsers.map((user, index) => {
                  return (
                    <div
                      className="card card-custom suggestion-card"
                      key={user.id}
                    >
                      <div className="card-body">
                        <section className="d-flex align-items-center">
                          <div className="symbol symbol-40 mr-3">
                            <img
                              alt="Pic"
                              src={
                                user.profilePic.downloadURL
                                  ? user.profilePic.downloadURL
                                  : require("../assets/users/blank.png")
                              }
                            />
                          </div>
                          <div className="text-left">
                            <h5 className="mb-0 font-weight-bold">
                              {user.firstname} {user.lastname}
                            </h5>
                            <span className="text-muted">@{user.username}</span>
                          </div>
                        </section>

                        <section>
                          <button
                            type="button"
                            className="btn btn-custom"
                            onClick={() => followUser(user, index)}
                          >
                            Follow
                          </button>
                        </section>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      )}
    </section>
  );
}

export default Suggestions;
