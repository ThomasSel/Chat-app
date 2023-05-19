import { useState } from "react";
import { NavigateFunction } from "react-router-dom";

type SignupProps = {
  navigate: NavigateFunction;
};

type SignupFormData = {
  username: string;
  email: string;
  password: string;
};

const Signup = ({ navigate }: SignupProps): JSX.Element => {
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
  });

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
      <div className="form-wrapper">
        <h1>Sign up</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-element">
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
          <div className="form-element">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              data-cy="signup-email"
              required
              pattern="/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/"
              value={formData.email}
              onChange={handleChange("email")}
            />
          </div>
          <div className="form-element">
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
      </div>
    </main>
  );
};

export default Signup;
