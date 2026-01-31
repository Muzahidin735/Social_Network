import { useEffect, useState } from "react";
import api from "../api/axios";
import PostItem from "./PostItem";

function PostList({ refresh }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      const res = await api.get("/api/posts");
      console.log("POSTS FETCHED:", res.data);

      setPosts(res.data);
    } catch {
      setError("Failed to load posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refresh]);

  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      {/*posts.length === 0 && <p>No posts yet</p>*/}

      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          onAction={fetchPosts}
        />
      ))}
    </div>
  );
}

export default PostList;
