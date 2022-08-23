import {
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  activitesCollectionRef,
  relationCollectionRef,
  storiesCollectionRef,
} from "../utils/collections.db";
import { db } from "../utils/firebase.config";
import { UserBio } from "./../utils/models/post.model";
import {
  Activity,
  Bookmark,
  Relation,
  Story,
} from "../utils/models/post.model";

export class UserService {
  async FetchAllUsersWithAuthUser(docId: string) {
    const userRef = doc(db, "users", docId);
    return await getDoc(userRef);
  }

  async SavePost(userId: string, bookmarks: Bookmark[]) {
    const userRef = doc(db, "users", userId);
    return await updateDoc(userRef, {
      bookmarks,
    });
  }

  async FollowerUser(relation: Relation) {
    return await addDoc(relationCollectionRef, relation);
  }

  async FetchAllRelations() {
    return await getDocs(relationCollectionRef);
  }

  async UploadMyStory(story: Story) {
    return await addDoc(storiesCollectionRef, story);
  }

  async UpdateUserStoryWatched(story: Story, watchedUsers: string[]) {
    const storyRef = doc(db, "stories", story.id);
    return await updateDoc(storyRef, {
      watched: watchedUsers,
    });
  }

  async UpdateUserActivities(activity: Activity) {
    return await addDoc(activitesCollectionRef, activity);
  }

  async FetchAllUserFollowers(user: UserBio) {
    const followerQuery = query(
      relationCollectionRef,
      where("following", "==", user.id)
    );
    return await getDocs(followerQuery);
  }

  async FetchAllUserFollowing(user: UserBio) {
    const followerQuery = query(
      relationCollectionRef,
      where("follower", "==", user.id)
    );
    return await getDocs(followerQuery);
  }
}
