import RouteNav from "../components/RouteNav";
import React, { useState, useEffect } from "react";
import axios from "axios";

function ForumComponent() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchPosts();
    // fetchCurrentUser();
  }, []);

  const fetchPosts = async () => {
    const response = await axios.get(
      `http://localhost:8080/api/forum/posts?page=${page}&size=10`
    );
    if (response.data.content) {
      setPosts((prevPosts) => [...prevPosts, ...response.data.content]);
      setHasMore(response.data.content.length === 10);
      setPage((prevPage) => prevPage + 1);
    }
  };

  // const fetchCurrentUser = async () => {
  //   try {
  //     const response = await axios.get("/api/users/current");
  //     setUser(response.data);
  //   } catch (error) {
  //     console.error("Failed to fetch current user", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to post");
      return;
    }
    await axios.post("/api/forum/posts", { postContent: newPost });
    setNewPost("");
    setPosts([]);
    setPage(0);
    fetchPosts();
  };

  return (
    <>
      <RouteNav />
      <div>
        <h1>Investment Forum</h1>
        {user ? <p>Welcome, {user.username}!</p> : <p>Please log in to post</p>}
        <form onSubmit={handleSubmit}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Write your post here..."
          />
          <button type="submit" disabled={!user}>
            Post
          </button>
        </form>
        <div>
          {posts.map((post) => (
            <div key={post.postId}>
              <p>{post.postContent}</p>
              <small>
                {new Date(post.postTime).toLocaleString()} by{" "}
                {post.user.username}
              </small>
            </div>
          ))}
        </div>
        {hasMore && <button onClick={fetchPosts}>Load More</button>}
      </div>
    </>
  );
}

export default ForumComponent;
