import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/users", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid details");
        }
        navigate("/login");
      })
      .catch(console.error);
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            data-cy="signup-username"
            required
            minLength={4}
            value={formData.username}
            onChange={handleChange("username")}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            data-cy="signup-email"
            required
            match="/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/"
            value={formData.email}
            onChange={handleChange("email")}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            data-cy="signup-password"
            required
            minLength={6}
            value={formData.password}
            onChange={handleChange("password")}
          />
        </div>
        <input type="submit" value="Submit" data-cy="signup-submit" />
      </form>
    </main>
  );
};

export default Signup;
