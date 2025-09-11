import React from "react";
import styles from "./About.module.css";
import Wrapper from "../../Wrapper";

function About() {
  return (
    <div className={styles.aboutSection}>
      <Wrapper>
        <div className={styles.bcg1}>
        <div className={`${styles.row} ${styles.normal}`}>
          <div className={styles.textBlock}>
            <h2>Coffee is more than a drink — it’s a story in every sip.</h2>
            <p>
              A story that starts high in the mountains, where the air is thin
              and the mornings are cool, and ends in your hands, warm and inviting.
            </p>
            <p>
              It’s the aroma that fills the room before you take the first taste.
            </p>
            <p>It’s the quiet moment you steal for yourself in a busy day.</p>
          </div>
          <div className={styles.imageBlock}>
            <img src="about1.png" alt="Coffee" />
          </div>
        </div>
        </div>

        <div className={styles.bcg2}>
        <div className={`${styles.row} ${styles.reverse}`}>
          <div className={styles.imageBlock}>
            <img src="about2.png" alt="Coffee farm" />
          </div>
          <div className={styles.textBlock}>
            <p><span className={styles.highlight1}>Here, we live for those moments.</span></p>
            <p>
              We travel through flavors — from the bright citrus of African
              highlands to the deep chocolate tones of South American valleys —
              without ever leaving our cup.
            </p>
            <p>
              We explore brewing like an art form, where every method unlocks a
              new side of the bean’s character.
            </p>
          </div>
        </div>
        </div>

        <div className={styles.bcg3}>
        <div className={`${styles.row} ${styles.normal}`}>
          <div className={styles.textBlock}>
            <p>
              We share our discoveries, our recipes, our little secrets — because
              coffee is best when it’s part of a conversation.
            </p>
            <p>
              This is a place for those who chase the perfect cup, not because
              they have to, but because they can’t imagine life without it.
            </p>
            <p className={styles.highlight2}>
              So, pour yourself something beautiful. Take a seat. And let’s explore
              the world of coffee together — one brew at a time.
            </p>
          </div>
          <div className={styles.imageBlock}>
            <img src="about3.png" alt="Coffee" />
          </div>
        </div>
        </div>
      </Wrapper>
    </div>
  );
}

export default About;