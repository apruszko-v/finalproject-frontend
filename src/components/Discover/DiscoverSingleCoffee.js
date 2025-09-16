import Wrapper from "../../Wrapper";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./DiscoverSingleCoffee.module.css";

function DiscoverSingleCoffee() {
  const { id } = useParams();
  const [coffee, setCoffee] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/coffees/id/${id}`)
      .then((res) => res.json())
      .then(setCoffee)
      .catch(console.error);

    fetch(`http://localhost:8080/api/reviews/coffee/${id}`)
      .then((res) => res.json())
      .then(setReviews)
      .catch(console.error);

    fetch("http://localhost:8080/api/users/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => setUserId(data.id))
      .catch(console.error);
  }, [id]);

  if (!coffee) return <p>Loading...</p>;

  const handleAddReview = (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Musisz być zalogowany, aby dodać recenzję.");
      return;
    }

    const newReview = {
      userId,
      coffeeId: Number(id),
      rating: Number(rating),
      comment,
    };

    fetch("http://localhost:8080/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newReview),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add review");
        return res.json();
      })
      .then(() => {
        setComment("");
        setRating(5);
        setShowForm(false);

        return fetch(`http://localhost:8080/api/reviews/coffee/${id}`);
      })
      .then((res) => res.json())
      .then(setReviews)
      .catch((err) => console.error(err));
  };

  return (
    <div className={styles.bcg}>
      <Wrapper>
        <div className={styles.container}>
          <div className={styles.coffeeHeader}>
            <img
              src={coffee.imageUrl}
              alt={coffee.nameCoffee}
              className={styles.coffeeImage}
            />
            <div className={styles.coffeeInfo}>
              <div className={styles.titleRating}>
                <h2 className={styles.coffeeTitle}>{coffee.nameCoffee}</h2>
                <p className={styles.rating}>{coffee.ratingCoffee
                      ? coffee.ratingCoffee.toFixed(1)
                      : "No rating"} ★</p>
              </div>

              <p>
                <strong>Origin:</strong> {coffee.origin}
              </p>
              <p>
                <strong>Roastery:</strong> {coffee.roastery}
              </p>
              <p>
                <strong>Roast Level:</strong> {coffee.roastLevel}
              </p>
              <p>
                <strong>Flavour Notes:</strong>{" "}
                {coffee.flavourNotes?.join(", ")}
              </p>
              <p>
                <strong>Recommended Methods:</strong>{" "}
                {coffee.recommendedMethods?.join(", ")}
              </p>
            </div>
          </div>

          <div className={styles.reviewsSection}>
            <div className={styles.reviewHeaderLine}>
              <h3>what coffee lovers say</h3>
              <button
                className={styles.addReviewBtn}
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "Cancel" : "share your thoughts"}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleAddReview} className={styles.reviewForm}>
                <div className={styles.ratingComment}>
                  <label>
                    Rating: <break></break>
                    <select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className={styles.ratingComment}>
                  <label>
                    Comment: <break></break>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    ></textarea>
                  </label>

                  <button type="submit" className={styles.submitReviewBtn}>
                    Submit
                  </button>
                </div>
              </form>
            )}

            {reviews.length > 0 ? (
              <ul className={styles.reviewList}>
                {reviews.map((r) => (
                  <li key={r.id} className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <span className={styles.username}>{r.username}</span>
                      <span className={styles.userRating}>{r.rating} ★</span>
                    </div>
                    <p className={styles.comment}>{r.comment}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.noReviews}>No reviews yet.</p>
            )}
          </div>
        </div>
      </Wrapper>
    </div>
  );
}

export default DiscoverSingleCoffee;
