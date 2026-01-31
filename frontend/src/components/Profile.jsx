import { useEffect, useState } from "react";
import api from "../api/axios";
import EditProfile from "./EditProfile";
import PostForm from "./PostForm";
import PostList from "./PostList";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [refreshPosts, setRefreshPosts] = useState(false);

    const triggerRefresh = () => {
    setRefreshPosts(!refreshPosts);
    };


  const fetchProfile = () => {
    api.get("/api/profile")
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          // Token expired → force logout
          localStorage.clear();
          window.location.href = "/login";
        } else {
          setError("Failed to load profile");
        }
    });

  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (error) return <p>{error}</p>;
  if (!profile) return <p>Loading...</p>;

  const profileImage =
  profile.profile_pic
    ? profile.profile_pic.startsWith("http")
      ? profile.profile_pic
      : `http://127.0.0.1:8000${profile.profile_pic}`
    : "/default.svg";


  // 🔁 EDIT MODE
  if (editing) {
    return (
      <EditProfile
        onCancel={() => setEditing(false)}
        onUpdated={() => {
          setEditing(false);
          fetchProfile();
        }}
      />
    );
  }

  // 👤 VIEW MODE
    return (
    <div className="profile-layout">
      {/* LEFT: PROFILE SIDEBAR */}
      <div className="profile-sidebar">
        <div className="card">
          <img
            src={profileImage}
            alt="Profile"
            className="profile-pic"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default.svg";
            }}
          />

          <h2>{profile.name}</h2>
          <p>{profile.email}</p>
          <p>DOB: {profile.dob}</p>

          <button onClick={() => setEditing(true)}>
            Edit Profile
          </button>

          <button
            className="secondary-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* RIGHT: POSTS AREA */}
      <div className="profile-content">
        <PostForm onPostCreated={triggerRefresh} />
        <PostList refresh={refreshPosts} />
      </div>
    </div>
  );

}

export default Profile;
