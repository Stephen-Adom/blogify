import { addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { postCollectionRef } from "../utils/collections.db";
import { db } from "../utils/firebase.config";
import { Post } from "../utils/models/post.model";

export class PostService {
  async AddNewPost(post: Post) {
    return await addDoc(postCollectionRef, post);
  }

  async UpdateLikePost(post: Post) {
    const postRef = doc(db, "posts", post.id);
    return await updateDoc(postRef, {
      likes: post.likes,
    });
  }

  async UpdateCommentPost(post: Post) {
    const postRef = doc(db, "posts", post.id);
    return await updateDoc(postRef, {
      comments: post.comments,
    });
  }

  async FetchPostInfo(id: string) {
    const postRef = doc(db, "posts", id);
    return await getDoc(postRef);
  }
}
