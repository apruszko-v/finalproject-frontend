import React, { useState } from "react";
import styles from "./Register.module.css"; 

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [generalError, setGeneralError] = useState(""); 
  const [fieldErrors, setFieldErrors] = useState({}); 

  const handleRegister = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setFieldErrors({});

    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        alert("Registration successful! You can now log in.");
        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        const errorData = await response.json();

        if (errorData.error) {
          setGeneralError(errorData.error);
        } else {
          setFieldErrors(errorData);
        }
      }
    } catch (error) {
      setGeneralError("An error occurred. Please try again. " + error.message);
    }
  };

  return (
    <div className={styles.bcg}>
      <div className={styles.headerContainer}>
        <div>
          <h2 className={styles.headerText}>
            Your Coffee Ritual Starts Here.
          </h2>
        </div>

        <div className={styles.registerContainer}>
          <div className={styles.registerBox}>
            <h2>Register</h2>

            {generalError && <p className={styles.error}>{generalError}</p>}

            <form onSubmit={handleRegister}>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {fieldErrors.username && (
                <p className={styles.fieldError}>{fieldErrors.username}</p>
              )}

              <label htmlFor="email">Email:</label>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // required
              />
              {fieldErrors.email && (
                <p className={styles.fieldError}>{fieldErrors.email}</p>
              )}

              <label htmlFor="password">Password:</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // required
              />
              {fieldErrors.password && (
                <p className={styles.fieldError}>{fieldErrors.password}</p>
              )}

              <button type="submit">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;