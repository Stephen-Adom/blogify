export interface UserBio {
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  username: string;
  createdAt?: string;
  gender?: string;
  bio?: string;
  dob?: string;
  website?: string;
  occupation?: string;
  location?: string;
  headerPhoto?: {
    reference: string;
    downloadURL: string;
  };
  profilePic?: {
    reference: string;
    downloadURL: string;
  };
  bookmarks: Bookmark[];
}

export interface Post {
  id?: string;
  content: string;
  media: Media[];
  createdAt: string;
  author: Author;
  likes: Author[];
  comments: Comment[];
}

export interface Media {
  reference: string;
  downloadURL: string;
}

export interface Author {
  id?: string;
  displayName: string;
  profilePic: string;
  username: string;
}

export interface Comment {
  id?: string;
  author: Author;
  comment: string;
  media: Media[];
  createdAt: string;
}

export interface Bookmark {
  id: string;
  postId: string;
  createdAt: string;
}

export interface Relation {
  id?: string;
  follower: string;
  following: string;
  createdAt?: string;
}

export interface Story {
  id?: string;
  userId: string;
  story: { reference: string; downloadURL: string }[];
  createdAt: string;
  watched: string[];
}

export interface Activity {
  id?: string;
  userId: string;
  activity: string;
  targetId: string;
  createdAt: string;
  type?: string;
  author: string;
}

export interface Message {
  id?: string;
  sender: string;
  receiver: string;
  messages: MessageInfo[];
  createdAt: string;
}

export interface MessageInfo {
  id: string;
  message: string;
  sender: string;
  media: {
    reference: string;
    downloadURL: string;
  }[];
  createdAt: string;
  readAt?: string;
}
