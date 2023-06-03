import React, { useState } from "react";
import { NavigateFunction } from "react-router-dom";

type LoginProps = {
  navigate: NavigateFunction;
};

type LoginFormData = {
  email: string;
  password: string;
};

type LoginFormField = keyof LoginFormData;

const Login = ({ navigate }: LoginProps): JSX.Element => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleChange = (
    field: LoginFormField
  ): React.ChangeEventHandler<HTMLInputElement> => {
    return (e) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    fetch("/api/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(
            `/api/login responded with status ${response.status} ${response.statusText}`
          );
        }
      })
      .then((data) => {
        if (data) {
          window.sessionStorage.setItem("token", data.token);
          navigate("/chats");
        }
      })
      .catch(console.error);
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
              pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
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
          <input
            type="submit"
            value="Submit"
            data-cy="login-submit"
            className="form-submit"
          />
        </form>
      </div>
    </main>
  );
};

export default Login;
