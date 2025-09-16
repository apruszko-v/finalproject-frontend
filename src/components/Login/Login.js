import React, { useState } from "react";
import Wrapper from "../../Wrapper";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";

function Login({ setAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const Navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  setMessage("");

  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  try {
    const response = await fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (response.ok) {
      const meResponse = await fetch("http://localhost:8080/api/users/me", {
        credentials: "include",
      });
      if (meResponse.ok) {
        const data = await meResponse.json();
        setAuth(data);
        Navigate("/discover");
      }
    } else {
      let errorMessage = "Login failed";
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error; 
        }
      } catch {
        errorMessage = "Login failed";
      }
      setMessage(errorMessage);
    }
  } catch (err) {
    setMessage("An error occurred. Please try again. " + err.message);
  }
};

  return (
    <div className={styles.bcg}>
      <Wrapper>
        <div className={styles.wrapper}>
          <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
              <h2>Login</h2>

              {message && <p className={styles.message}>{message}</p>}

              <form onSubmit={handleLogin}>
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button type="submit">Login</button>
              </form>
            </div>
          </div>
        </div>
        <div className={styles.registerPrompt}>
          <p>Haven't joined yet?</p>
          <p>
            <a href="/register">Be part of something great - <span className={styles.highlight}>sign up!</span></a>
          </p>
        </div>
      </Wrapper>
    </div>
  );
}

export default Login;
