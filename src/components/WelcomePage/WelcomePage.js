import React from "react";
import stylesWP from "./WelcomePage.module.css";
import stylesWr from "../../Wrapper.module.css";
import { Link } from "react-router-dom";

function WelcomePage() {
  return (
    <div className={stylesWr.wrapper}>
      <div className={stylesWP.welcomeContainer}>
        <div className={stylesWP.photoContainer}>
          <img
            className={stylesWP.photoWelcomePage}
            src="./welcomePagePhoto.png"
            alt="Coffee"
          />
        </div>

        <div className={stylesWP.textContainer}>
          <div>
            <h2 className={stylesWP.title}>
              From Bean to Perfect Cup. Your Coffee Journey, Perfected.
            </h2>
            <p className={stylesWP.description}>
              Discover, track, and share the world's best specialty coffees.
              Find the perfect brew recipe, every single time, with help from a
              passionate community.
            </p>
            <Link to="/login" className={stylesWP.joinCommunity}>
              <p>Join the Community!</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
