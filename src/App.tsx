import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./layouts/header";
import AppSidebar from "./layouts/sidebar";
import { auth } from "./utils/firebase.config";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import { setAuthUser, setAuthUserBio } from "./hooks/reducers/auth.reducer";
import { AuthService } from "./services/auth.service";
import { onSnapshot, orderBy, query, where } from "firebase/firestore";
import {
  activitesCollectionRef,
  postCollectionRef,
  relationCollectionRef,
  storiesCollectionRef,
  usersCollectionRef,
} from "./utils/collections.db";
import { fetchAllPost } from "./hooks/reducers/post-reducer";
import { Post, UserBio } from "./utils/models/post.model";
import {
  fetchAllMyFollowers,
  fetchAllRelations,
  fetchAllUsersExceptAuth,
  UpdateStories,
  updateUserActivities,
} from "./hooks/reducers/user.reducer";
import UpdateUserProfile from "./components/editUserProfile";
import { AuthUser } from "./utils/models/authState.model";
import { BlockUI } from "primereact/blockui";
import ChatBox from "./components/chatBox";

function App() {
  const dispatch = useAppDispatch();
  const authservice = new AuthService();

  let processing = useAppSelector((state) => state.app.processing);
  const userInfo = useAppSelector((state) => state.auth.authUserFullBio);
  const loadingMessage = useAppSelector((state) => state.app.loadingMessage);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then((token) => {
          if (token) {
            const authUser = {
              uid: user.uid,
              email: user.email,
              accessToken: token,
              refreshToken: user.refreshToken,
              infoId: null,
              metadata: JSON.stringify(user.metadata),
            };
            fetchUserBio(authUser);
            fetchAllFilteredUsers(authUser);
            dispatch(setAuthUser(authUser));
          }
        });
      }
    });

    const fetchUserBio = (authUser) => {
      authservice.CheckIfUserEmailExist(authUser.email).then((response) => {
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
          headerPhoto: response.docs[0].data().headerPhoto,
          bookmarks: response.docs[0].data().bookmarks,
        };

        dispatch(setAuthUserBio(user));
      });
    };

    const fetchAllFilteredUsers = (authUser: AuthUser) => {
      const usersQuery = query(
        usersCollectionRef,
        where("email", "!=", authUser.email)
      );
      const unsubscribe = onSnapshot(usersQuery, (querySnapshot) => {
        const allUsers: UserBio[] = [];

        querySnapshot.forEach((doc) => {
          allUsers.push({
            id: doc.id,
            firstname: doc.data().firstname,
            lastname: doc.data().lastname,
            email: doc.data().email,
            phone: doc.data().phone,
            username: doc.data().username,
            createdAt: JSON.stringify(doc.data().createdAt),
            gender: doc.data().gender,
            bio: doc.data().bio,
            dob: doc.data().dob,
            website: doc.data().website,
            occupation: doc.data().occupation,
            location: doc.data().location,
            profilePic: doc.data().profilePic,
            headerPhoto: doc.data().headerPhoto,
            bookmarks: doc.data().bookmarks,
          });
        });
        dispatch(fetchAllUsersExceptAuth(allUsers));
      });
      return () => unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    const q = query(postCollectionRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allPost: Post[] = [];
      querySnapshot.forEach((doc) => {
        allPost.push({
          id: doc.id,
          content: doc.data().content,
          media: doc.data().media,
          createdAt: doc.data().createdAt,
          author: doc.data().author,
          likes: doc.data().likes,
          comments: doc.data().comments,
        });
      });

      dispatch(fetchAllPost(allPost));
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      const relationQuery = query(
        relationCollectionRef,
        where("follower", "==", userInfo.id)
      );
      const unsubscribe = onSnapshot(relationQuery, (querySnapshot) => {
        const relations = [];
        querySnapshot.forEach((doc) => {
          relations.push({
            id: doc.id,
            follower: doc.data().follower,
            following: doc.data().following,
            createdAt: doc.data().createdAt,
          });
        });

        dispatch(fetchAllRelations(relations));
      });
      return () => unsubscribe();
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (userInfo) {
      const relationQuery = query(
        relationCollectionRef,
        where("following", "==", userInfo.id)
      );
      const unsubscribe = onSnapshot(relationQuery, (querySnapshot) => {
        const relations = [];
        querySnapshot.forEach((doc) => {
          relations.push({
            id: doc.id,
            follower: doc.data().follower,
            following: doc.data().following,
            createdAt: doc.data().createdAt,
          });
        });

        dispatch(fetchAllMyFollowers(relations));
      });
      return () => unsubscribe();
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (userInfo) {
      const unsubscribe = onSnapshot(storiesCollectionRef, (querySnapshot) => {
        const stories = [];
        querySnapshot.forEach((doc) => {
          stories.push({
            id: doc.id,
            userId: doc.data().userId,
            story: doc.data().story,
            createdAt: doc.data().createdAt,
            watched: doc.data().watched,
          });
        });

        dispatch(UpdateStories(stories));
      });
      return () => unsubscribe();
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (userInfo) {
      const activityQuery = query(
        activitesCollectionRef,
        where("userId", "==", userInfo.id)
      );
      const unsubscribe = onSnapshot(activityQuery, (querySnapshot) => {
        const activities = [];
        querySnapshot.forEach((doc) => {
          activities.push({
            id: doc.id,
            userId: doc.data().userId,
            activity: doc.data().activity,
            createdAt: doc.data().createdAt,
            targetId: doc.data().targetId,
            author: doc.data().author,
            type: doc.data().type,
          });
        });

        dispatch(updateUserActivities(activities));
      });
      return () => unsubscribe();
    }
  }, [dispatch, userInfo]);

  const blockTemplate = () => {
    return (
      <div className="d-flex flex-column align-items-center">
        <img
          src={require("./assets/images/blogify_logo.png")}
          width="30px"
          className="animate__heartBeat animate__animated animate__infinite"
          alt=""
        />
        <span className="font-weight-bold text-white mt-2">
          {loadingMessage}
        </span>
      </div>
    );
  };

  return (
    <div className="App">
      <BlockUI blocked={processing} fullScreen template={blockTemplate}>
        <Header></Header>
        {/** USER PROFILE COMPONENT */}
        <UpdateUserProfile></UpdateUserProfile>
        {/** USER PROFILE COMPONENT */}

        <ChatBox></ChatBox>

        <main id="main-content">
          <div className="row w-100 m-0">
            <div className="col-lg-3 left-sidebar">
              <AppSidebar></AppSidebar>
            </div>
            <div className="col-lg-9 col-md-12 col-12 m-0 p-0">
              <div className="row w-100 p-0 m-0">
                <Outlet></Outlet>
              </div>
            </div>
          </div>
        </main>
      </BlockUI>
    </div>
  );
}

export default App;
