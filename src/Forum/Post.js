import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPostPage, removePostBatchByIds, savePost } from "../api/post";
import RouteNav from "../components/RouteNav";
import "./post.css";
import '../assets/icons/iconfont.css';
import './tailwind.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreatePost = ({ onPostCreated, onError }) => {
  const [title, setTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    savePost({ title, postContent })
      .then((res) => {
        if (res.code !== 200) {
          onError("Error: Post creation failed.");
          return;
        }
        onPostCreated();
        setTitle("");
        setPostContent("");
      })
      .catch(() => {
        onError("Error: Post creation failed.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-white rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Create New Post</h3>
        <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            className="w-full p-2 mb-4 border rounded"
            required
        />
        <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Post content"
            rows="5"
            className="w-full p-2 mb-4 border rounded"
            required
        />
        <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Post"}
        </button>
      </form>
  );
};

const PostList = ({ posts, onPin, onDelete, userRole }) => {
    return (
        <div>
            {posts.map((post) => (
                <div
                    key={post.postId}
                    className={`mb-4 p-4 rounded-lg shadow ${
                        post.pinned ? "bg-yellow-100" : "bg-white"
                    }`}
                >
                    <div className="flex justify-between items-center mb-2">
                        <Link
                            to={`/app/forum/post/${post.postId}`}
                            className={`text-2xl font-bold hover:underline ${
                                post.pinned ? "text-orange-600" : "text-blue-600"
                            }`}
                        >
                            {post.title}
                        </Link>
                        {userRole === "Admin" && (
                            <i
                                className={`iconfont icon-tuding1 text-2xl cursor-pointer ${
                                    post.pinned ? "text-orange-500" : "text-gray-400"
                                }`}
                                onClick={() => onPin(post.postId, !post.pinned)}
                            ></i>
                        )}
                    </div>
                    <p className="text-gray-700 mb-2">{post.postContent}</p>
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">{post.postTime}</p>
                        <div className="flex items-center space-x-4">
              <span className="flex items-center text-gray-600">
                <i className="iconfont icon-pinglun mr-1"></i>
                  {post.replyCount}
              </span>
                            <span className="flex items-center text-gray-600">
                <i className="iconfont icon-zan mr-1"></i>
                                {post.likeCount}
              </span>
                            {userRole === "Admin" && (
                                <button
                                    onClick={() => onDelete([post.postId])}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-4">
      <ul className="pagination justify-content-center">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${currentPage === number ? "active" : ""}`}
          >
            <button onClick={() => onPageChange(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = () => {
    setIsLoading(true);
    getPostPage({ pageNo: currentPage, pageSize: postsPerPage })
      .then((res) => {
        setPosts(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(() => {
        setError("Error: Failed to fetch posts.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlePostCreated = () => {
    fetchPosts();
  };

  const handlePin = (postId, pinned) => {
    savePost({ postId, pinned })
      .then((res) => {
        if (res.code !== 200) {
          alert("Error: Failed to pin/unpin post.");
          return;
        }
        fetchPosts();
      })
      .catch(() => {
        alert("Error: Failed to pin/unpin post.");
      });
  };

  const handleDelete = (ids) => {
    removePostBatchByIds(ids)
      .then((res) => {
        if (res.code !== 200) {
          alert("Error: Failed to delete post.");
          return;
        }
        fetchPosts();
      })
      .catch(() => {
        alert("Error: Failed to delete post.");
      });
  };

  return (
    <>
      <RouteNav />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Forum</h1>
        <CreatePost onPostCreated={handlePostCreated} onError={setError} />
        {error && <div className="text-danger my-2">{error}</div>}
        {isLoading ? (
          <div className="text-center">Loading posts...</div>
        ) : (
          <>
            <PostList
              posts={posts}
              onPin={handlePin}
              onDelete={handleDelete}
              userRole={user ? user.role : null}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ForumPage;
