import React, { useState, useEffect } from "react";
import styles from "./UserManagement.module.css";
import { useNavigate } from "react-router-dom";

function UserManagement() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [editRecipeId, setEditRecipeId] = useState(null);
  const [editRecipeNotes, setEditRecipeNotes] = useState("");
  // const [edit]

  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewComment, setEditReviewComment] = useState("");
  const [editReviewRating, setEditReviewRating] = useState(5);
  const [updatedPassword, setUpdatedPassword] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/users/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        setUpdatedEmail(data.email);
        setUpdatedUsername(data.username);

        fetch(`http://localhost:8080/api/recipes/user/${data.id}`)
          .then((res) => res.json())
          .then(setRecipes)
          .catch((err) => console.error("Error fetching recipes:", err));

        fetch(`http://localhost:8080/api/reviews/user/${data.id}`)
          .then((res) => res.json())
          .then(setReviews)
          .catch((err) => console.error("Error fetching reviews:", err));
      })
      .catch((err) => {
        console.error(err);
        navigate("/login");
      });
  }, [navigate]);

  const handleUpdateUser = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/users/${userData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: updatedEmail,
            username: updatedUsername,
          }),
        }
      );
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      setUserData(data);
      setMessageType("success");
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessageType("error");
      setMessage(err.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/users/${userData.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Delete failed");
      setMessageType("success");
      setMessage("Account deleted successfully");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMessageType("error");
      setMessage(err.message);
    }
  };

  const handleDeleteRecipe = async (id) => {
    if (!window.confirm("Delete this recipe?")) return;
    try {
      await fetch(`http://localhost:8080/api/recipes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setRecipes(recipes.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditRecipe = (recipe) => {
    setEditRecipeId(recipe.id);
    setEditRecipeNotes(recipe.notes);
  };

  const handleSaveRecipe = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/recipes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ notes: editRecipeNotes }),
      });
      if (res.ok) {
        const updated = recipes.map((r) =>
          r.id === id ? { ...r, notes: editRecipeNotes } : r
        );
        setRecipes(updated);
        setEditRecipeId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await fetch(`http://localhost:8080/api/reviews/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditReview = (review) => {
    setEditReviewId(review.id);
    setEditReviewComment(review.comment);
    setEditReviewRating(review.rating);
  };

  const handleSaveReview = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          comment: editReviewComment,
          rating: editReviewRating,
        }),
      });
      if (res.ok) {
        const updated = reviews.map((r) =>
          r.id === id
            ? { ...r, comment: editReviewComment, rating: editReviewRating }
            : r
        );
        setReviews(updated);
        setEditReviewId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <div>
      <div className={styles.container}>
        <h2 className={styles.title}>My Profile</h2>

        {message && (
          <p
            className={`${styles.message} ${
              messageType === "error"
                ? styles.messageError
                : styles.messageSuccess
            }`}
          >
            {message}
          </p>
        )}

        <div className={styles.userDetails}>
          <p><strong>Username:</strong> {userData.username}</p><br />
          <p><strong>Email:</strong> {userData.email}</p><br />
        </div>

        <label>Update Username</label>
        <input
          type="text"
          value={updatedUsername}
          onChange={(e) => setUpdatedUsername(e.target.value)}
          className={styles.input}
        /><br />

        <label>Update Email</label>
        <input
          type="email"
          value={updatedEmail}
          onChange={(e) => setUpdatedEmail(e.target.value)}
          className={styles.input}
        /><br />

        <label>Update Password</label>
        <input
          type="password"
          value={updatedPassword}
          onChange={(e) => setUpdatedPassword(e.target.value)}
          className={styles.input}
        /><br />

        <button onClick={handleUpdateUser} className={styles.button}>
          Update Profile
        </button>

        <h3 style={{ marginTop: "20px" }}>Delete Account</h3>
        <button
          onClick={handleDeleteUser}
          className={`${styles.button} ${styles.deleteButton}`}
        >
          Delete My Account
        </button>
      </div>

      <div className={styles.container2}>
        <h3 style={{ marginTop: "30px" }}>My Recipes</h3>
        {recipes.length > 0 ? (
          <table className={styles.recipeTable}>
            <thead>
              <tr>
                <th>Coffee</th>
                <th>Brewing Method</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((r) => (
                <tr key={r.id}>
                  <td>{r.coffeeName}</td>
                  <td>{r.brewingMethodName}</td>
                  <td>
                    {editRecipeId === r.id ? (
                      <input
                        value={editRecipeNotes}
                        onChange={(e) => setEditRecipeNotes(e.target.value)}
                      />
                    ) : (
                      r.notes
                    )}
                  </td>
                  <td>
                    {editRecipeId === r.id ? (
                      <button onClick={() => handleSaveRecipe(r.id)}>Save</button>
                    ) : (
                      <button onClick={() => handleEditRecipe(r)}>Edit</button>
                    )}
                    <button onClick={() => handleDeleteRecipe(r.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>You haven't written any recipes yet.</p>
        )}
      </div>

      <div className={styles.container2}>
        <h3 style={{ marginTop: "30px" }}>My Reviews</h3>
        {reviews.length > 0 ? (
          <table className={styles.recipeTable}>
            <thead>
              <tr>
                <th>Coffee</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((rev) => (
                <tr key={rev.id}>
                  <td>{rev.coffeeName}</td>
                  <td>
                    {editReviewId === rev.id ? (
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={editReviewRating}
                        onChange={(e) => setEditReviewRating(e.target.value)}
                      />
                    ) : (
                      rev.rating
                    )}
                  </td>
                  <td>
                    {editReviewId === rev.id ? (
                      <input
                        value={editReviewComment}
                        onChange={(e) => setEditReviewComment(e.target.value)}
                      />
                    ) : (
                      rev.comment
                    )}
                  </td>
                  <td>
                    {editReviewId === rev.id ? (
                      <button onClick={() => handleSaveReview(rev.id)}>Save</button>
                    ) : (
                      <button onClick={() => handleEditReview(rev)}>Edit</button>
                    )}
                    <button onClick={() => handleDeleteReview(rev.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>You haven't written any reviews yet.</p>
        )}
      </div>
    </div>
  );
}

export default UserManagement;