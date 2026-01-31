import { useState } from "react";
import api from "../api/axios";

function PostForm({ onPostCreated }) {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!description.trim()) {
      setError("Post description cannot be empty");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("description", description);

      if (image) {
        formData.append("image", image);
      }

      await api.post("/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setDescription("");
      setImage(null);
      onPostCreated();
    } catch (err) {
      setError("Failed to create post");
    }
  };

  return (
    <div className="card">
      <h3>Create Post</h3>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit">Post</button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default PostForm;
