import React from "react";
import styles from "./Logo.module.css";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <div className={styles.logoContainer}>
      <Link to="/" className={styles.logoLink}>
        <h1 className={styles.logoText}>Your Brew Journal</h1>

        <img
          className={styles.logoPng}
          src="./logo.png"
          alt="Coffee Explorer Logo"
        />
      </Link>
    </div>
  );
}

export default Logo;
