import { usersCollectionRef } from "./../utils/collections.db";
import {
  addDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../utils/firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export class AuthService {
  async RegisterUserInfo(user: any) {
    return await addDoc(usersCollectionRef, user);
  }

  async CreateUserWithEmailAndPassword(email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password);
  }

  async CheckIfUserEmailExist(key: string) {
    const emailQuery = query(usersCollectionRef, where("email", "==", key));
    return await getDocs(emailQuery);
  }

  async CheckIfUserUsernameExist(key: string) {
    const usernameQuery = query(
      usersCollectionRef,
      where("username", "==", key)
    );
    return await getDocs(usernameQuery);
  }

  async signInUserWithEmailAndPassword(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  async UpdateProfileImage(imageURL: string, docId: string) {
    const userDocRef = doc(db, "users", docId);
    return await updateDoc(userDocRef, {
      profilePic: imageURL,
    });
  }
}
