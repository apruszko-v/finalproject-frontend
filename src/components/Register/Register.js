import React, { useState } from "react";
import Wrapper from "../../Wrapper";
import styles from "./Register.module.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        alert("Registration successful! You can now log in.");
        setUsername("");
        setPassword("");
      } else {
        const errorData = await response.json();
        setMessage(`Registration failed: ${errorData.message}`);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again." + error.message);
    }
  };

  return (
    <div className={styles.bcg}>
      <Wrapper>
        <div className={styles.headerContainer}>
          <div>
            <h2 className={styles.headerText}>
              Your Coffee Ritual Starts Here.
            </h2>
          </div>

          <div className={styles.registerContainer}>
            <div className={styles.registerBox}>
              <h2>Register</h2>
              {message && <p>{message}</p>}

              <form onSubmit={handleRegister}>
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />

                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

                <button type="submit">Register</button>
              </form>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}

export default Register;
