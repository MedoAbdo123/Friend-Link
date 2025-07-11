interface Friend {
  data: {
    name: string;
    avatar: string;
    _id: string;
  };
  roomId: string;
}

export interface ChatProps {
  firendsData: Friend[];
}

export interface Props {
  onClose: () => void;
  onCommentChange?: (delta: number) => void;
}

export interface FriendProps {
  name: string;
  avatar: string;
  onClick: () => void;
}

export interface PostProps {
  title: string;
  content: string;
  image: string;
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

type Params = Promise<{ username: string }>;
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
  senderId: {
    name: string;
    avatar: string;
    _id: string;
  };
  _id: string
}

export interface MessagePaload  {
  message: string;
};