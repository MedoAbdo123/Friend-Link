export interface Friend {
  data: {
    name: string;
    avatar: string;
    _id: string;
  };
  roomId: string;
  lastMessage: string;
}

export interface ChatProps {
  firendsData: Friend[];
}

export interface Props {
  onClose: () => void;
  onCommentChange?: (delta: number) => void;
  postId: string;
}

export interface FriendProps {
  name: string;
  avatar: string;
  onClick: () => void;
  lastMessage?: string;
}

export interface PostProps {
  title: string;
  content: string;
  image: string;
  user: {
    _id: string;
    username: string;
    name: string;
    avatar: string;
  };
  avatar?: string;
  username?: string;
  name?: string;
  likes: number;
  commentsNumber: number;
  userPhoto: string;
  timeAgo: string;
  _id: string;
  likedUsers: string[];
}

export interface PostsWrapperProps {
  initialPosts: PostProps[];
}

export interface MyPayload {
  name: string;
  username: string;
  avatar: string;
  id: string;
}

export interface Props {
  onClose: () => void;
}

type Params = Promise<{ username: string; postId: string }>;
export interface PropsParams {
  params: Params;
}

export interface ToastProps {
  bg: string;
  text: string;
  message: string;
  correct?: boolean;
  error?: boolean;
  onClose: () => void;
}

export interface MessageProps {
  message: string;
  photo: string;
  edited: string;
  createdAt: string;
  senderId: {
    name: string;
    avatar: string;
    _id: string;
  };
  linkPreview: {
    title: string;
    description: string;
    image: string;
    url: string;
  };
  _id: string;
}

export interface MessagePaload {
  message: string;
}

export interface PropsComment {
  content: string;
  edited: string;
  user: {
    name: string;
    avatar: string;
    _id: string;
  };
  _id: string;
}

export interface CommentType {
  _id: string;
  edited: string;
  content: string;
  user: {
    name: string;
    avatar: string;
    _id: string;
  };
}

export interface FriendRequest {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    username: string;
    avatar: string;
  };
}

export interface User {
  _id: string;
  name: string;
  username: string;
  avatar: string;
}

export interface StatusPending {
  _id: string;
  receiverId: {
    _id: string;
    name: string;
    username: string;
    avatar: string;
  };
  userId: string
}

export interface RequestsProps {
  _id: string
  senderId: {
    _id: string;
    name: string;
    username: string;
    avatar: string;
  };
}

export interface RequestsClientProps {
  data: FriendRequest[];
  users: User[];
  pending: StatusPending[];
}
