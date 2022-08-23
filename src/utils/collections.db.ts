import { collection } from "firebase/firestore";
import { db } from "./firebase.config";

export const usersCollectionRef = collection(db, "users");
export const postCollectionRef = collection(db, "posts");
export const relationCollectionRef = collection(db, "relations");
export const storiesCollectionRef = collection(db, "stories");
export const activitesCollectionRef = collection(db, "activities");
export const messagesCollectionRef = collection(db, "messages");
