import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";
import Logo from "../Logo/Logo";
import stylesW from "../../Wrapper.module.css";
import UserManagement from "../UserManagement/UserManagement";

function Navigation({ auth, handleLogout }) {
  return (
    <div>
      <div className={styles.navbar}>
        <Logo />
      </div>

      <div>
        <nav className={styles.navbar}>
          <ul className={styles.navList}>
            <li>
              <Link to="/discover" className={styles.navItem}>
                Discover
              </Link>
            </li>
            <li>
              <Link to="/about" className={styles.navItem}>
                About
              </Link>
            </li>
            <li>
              <Link to="/community-recipes" className={styles.navItem}>
                Community Recipes
              </Link>
            </li>

            {!auth && (
              <>
                <li>
                  <Link to="/register" className={styles.navItem}>
                    Register
                  </Link>
                </li>
                <li>
                  <Link to="/login" className={styles.navItem}>
                    Login
                  </Link>
                </li>
              </>
            )}

            {auth && (
              <>
                <li className={styles.navItem}>
                  <Link to="/userManagement" className={styles.navItem}>
                    <span>My profile</span>
                  </Link>
                </li>
                <li>
                  <Link to="/" className={styles.navItem}>
                    <button onClick={handleLogout} className={styles.navItem}>
                      Logout
                    </button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Navigation;
