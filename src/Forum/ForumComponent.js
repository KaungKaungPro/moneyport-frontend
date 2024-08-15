import React, { useEffect } from "react";
import RouteNav from "../components/RouteNav";
import { MessageSquare, ThumbsUp, Heart, Pin } from "lucide-react";

const mockPosts = [
  {
    id: 1,
    title: "top 1",
    content: "这是第一个置顶帖子的内容。",
    isPinned: true,
    author: "用户A",
    comments: 5,
    likes: 10,
    loves: 3,
  },
  {
    id: 2,
    title: "top 2",
    content: "这是第二个置顶帖子的内容。",
    isPinned: true,
    author: "用户B",
    comments: 3,
    likes: 7,
    loves: 2,
  },
  {
    id: 3,
    title: "normal 1",
    content: "这是一个普通帖子的内容。",
    isPinned: false,
    author: "用户C",
    comments: 2,
    likes: 5,
    loves: 1,
  },
  {
    id: 4,
    title: "normal 2",
    content: "这是另一个普通帖子的内容。",
    isPinned: false,
    author: "用户D",
    comments: 1,
    likes: 3,
    loves: 0,
  },
];

const PostCard = ({ post }) => (
  <div className="bg-light shadow-md rounded-lg p-4 mb-4">
    <div className="d-flex justify-content-between align-items-center mb-2">
      <h2 className="text-xl font-bold">{post.title}</h2>
      {post.isPinned && <Pin className="text-red-500" size={20} />}
    </div>
    <p className="text-gray-600 mb-2">{post.content}</p>
    <div className="text-sm text-gray-500 mb-2">作者: {post.author}</div>
    <div className="d-flex justify-content-start space-x-4">
      <div className="d-flex justify-content-evenly align-items-center ms-2">
        <MessageSquare size={16} className="me-1" />
        <span>{post.comments}</span>
      </div>
      <div className="d-flex justify-content-evenly align-items-center ms-2">
        <ThumbsUp size={16} className="me-1" />
        <span>{post.likes}</span>
      </div>
      <div className="d-flex justify-content-evenly align-items-center ms-2">
        <Heart size={16} className="me-1" />
        <span>{post.loves}</span>
      </div>
    </div>
  </div>
);

const ForumApp = () => {
  return (
    <>
      <RouteNav />
      <div className="bg-gray-100 min-h-screen p-4">
        <div className="max-w-xl mx-auto">
          <h1 className="text-xl font-bold mb-4 text-center">论坛应用</h1>
          <div className="mb-4">
            <input
              type="text"
              placeholder="发表新帖子..."
              className="w-25 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            {mockPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForumApp;
