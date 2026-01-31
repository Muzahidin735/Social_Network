import api from "../api/axios";

function PostItem({ post, onAction }) {

  const imageUrl =
    post.image &&
    (post.image.startsWith("http")
      ? post.image
      : `http://127.0.0.1:8000${post.image}`);

  const handleLike = async () => {
    await api.post(`/api/posts/${post.id}/like`);
    onAction();
  };

  const handleDislike = async () => {
    await api.post(`/api/posts/${post.id}/dislike`);
    onAction();
  };

  const handleDelete = async () => {
    await api.delete(`/api/posts/${post.id}/delete`);
    onAction();
  };

  return (
    <div className="card">
      <p><strong>{post.user}</strong></p>
      <p>{post.description}</p>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Post"
          className="post-image"
        />
      )}

      <div>
        <button onClick={handleLike}>
          👍 {post.likes_count}
        </button>

        <button onClick={handleDislike}>
          👎 {post.dislikes_count}
        </button>

        {post.is_owner && (
          <button
            className="secondary-btn"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default PostItem;
