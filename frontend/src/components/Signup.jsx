import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import { isStrongPassword, isValidImage, isValidAge, isValidUsername} from "../utils/validators";

function Signup({ onSignup }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    profile_pic: null,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (name === "profile_pic" && files[0]) {
    const imageCheck = isValidImage(files[0]);
    if (imageCheck !== true) {
      setError(imageCheck);
      return;
    }
  }

  setFormData({
    ...formData,
    [name]: files ? files[0] : value,
  });
};


  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!isStrongPassword(formData.password)) {
    setError(
      "Password must be at least 8 characters, include uppercase, number and special character"
    );
    return;
  }

    const imageCheck = isValidImage(formData.profile_pic);
  if (imageCheck !== true) {
    setError(imageCheck);
    return;
  }

  const nameCheck = isValidUsername(formData.name);
  if (nameCheck !== true) {
    setError(nameCheck);
    return;
  }

  const ageCheck = isValidAge(formData.dob);
  if (ageCheck !== true) {
    setError(ageCheck);
    return;
  }



    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("dob", formData.dob);

    if (formData.profile_pic) {
      data.append("profile-pic", formData.profile_pic);
    }

    api.post("/api/signup", data)
      .then(() => {
        onSignup();
      })
      .catch(() => {
        setError("Signup failed");
      });
  };

  return (
    <div className="card">
      <h2>Signup</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
        />

        <input
          type="date"
          name="dob"
          required
          onChange={handleChange}
        />

        <input
          type="file"
          name="profile_pic"
          accept="image/*"
          onChange={handleChange}
        />

        <button type="submit">Signup</button>
      </form>
    <p>
        Already have an account?{" "}
        <Link to="/login" className="link">
            Login
        </Link>
    </p>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Signup;
