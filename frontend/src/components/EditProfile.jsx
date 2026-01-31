  import { useEffect, useState } from "react";
  import api from "../api/axios";
  import { isValidImage, isValidAge, isValidUsername } from "../utils/validators";

  function EditProfile({ onCancel, onUpdated }) {
    const [formData, setFormData] = useState({
      name: "",
      dob: "",
      profile_pic: null,
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch existing profile
    useEffect(() => {
      api.get("/api/profile")
        .then((res) => {
          setFormData({
            name: res.data.name,
            dob: res.data.dob,
            profile_pic: null,
          });
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load profile");
          setLoading(false);
        });
    }, []);

    const handleChange = (e) => {
      const { name, value, files } = e.target;

      if (name === "profile_pic" && files[0]) {
        const imageCheck = isValidImage(files[0]);
        if (imageCheck !== true) {
          setError(imageCheck);
          return;
        }
      }

      setError("");
      setFormData({
        ...formData,
        [name]: files ? files[0] : value,
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      setError("");

      
    if (formData.name) {
      const nameCheck = isValidUsername(formData.name);
      if (nameCheck !== true) {
        setError(nameCheck);
        return;
      }
    }

    
    if (formData.dob) {
      const ageCheck = isValidAge(formData.dob);
      if (ageCheck !== true) {
        setError(ageCheck);
        return;
      }
    }

      const data = new FormData();
      if (formData.name) data.append("name", formData.name);
      if (formData.dob) data.append("dob", formData.dob);
      if (formData.profile_pic) {
        data.append("profile_pic", formData.profile_pic);
      }

      api.patch("/api/profile", data)
        .then(() => {
          onUpdated(); // go back to profile view
        })
        .catch(() => {
          setError("Failed to update profile");
        });
    };

    if (loading) return <p>Loading...</p>;

    return (
      <div className="card">
        <h2>Edit Profile</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
          />

          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />

          <input
            type="file"
            name="profile_pic"
            accept="image/*"
            onChange={handleChange}
          />

          <button type="submit">Save</button>
          <button type="button" className="secondary-btn" onClick={onCancel}>
            Cancel
          </button>
        </form>

        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  export default EditProfile;
