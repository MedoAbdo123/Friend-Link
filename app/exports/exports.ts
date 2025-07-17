interface Friend {
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
  user: { _id: string };
  likes: number;
  commentNumber: number;
  name: string;
  userPhoto: string;
  timeAgo: string;
  _id: string;
  likedUsers: string[];
  username: string;
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
