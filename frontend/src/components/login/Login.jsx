import { useState } from "react";

const Login = (props) => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8000/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data) {
          window.localStorage.setItem("token", data.token);
          props.navigate("/chats");
        }
      });
  };

  return (
    <main>
      <div className="form-wrapper">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-element">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              data-cy="login-email"
              required
              match="/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/"
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
              data-cy="login-password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange("password")}
            />
          </div>
          <input type="submit" value="Submit" data-cy="login-submit" />
        </form>
      </div>
    </main>
  );
};

export default Login;
